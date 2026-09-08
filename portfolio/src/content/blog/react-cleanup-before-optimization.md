---
title: O que eu removo antes de otimizar um layout React
slug: react-cleanup-before-optimization
excerpt: Antes de falar em performance, eu reduzo ruído estrutural: estados duplicados, efeitos desnecessários e wrappers que só aumentam complexidade.
publishedAt: 2026-03-12
category: Performance
tags: [React, Performance, Refactor]
featured: false
hasDemo: false
---
# Otimização quase sempre começa removendo

Em portfólio e em produto real, o impulso inicial costuma ser adicionar memoização, virtualização ou outra biblioteca. Antes disso, procuro estados duplicados, efeitos sem responsabilidade clara e estrutura sem função.

## Método

Meu método começa com uma pergunta simples: qual interação está lenta e qual evidência demonstra isso? Sem essa resposta, uma otimização pode apenas trocar complexidade de lugar.

Depois, leio o fluxo completo. Identifico a fonte dos dados, os eventos que mudam intenção, os efeitos que sincronizam com o exterior e os elementos que realmente precisam existir no DOM.

A ordem prática é:

1. remover estado derivado
2. mover ações para eventos
3. separar sincronização externa de cálculo local
4. reduzir wrappers sem papel
5. medir novamente

Essa ordem não promete um ganho universal. Ela reduz hipóteses antes de introduzir técnicas que também têm custo.

## Estado derivado

Se um valor pode ser calculado durante o render a partir de props ou estado existente, criar outro estado para ele abre uma segunda fonte de verdade.

Antes:

```tsx
const [filtered, setFiltered] = useState<Item[]>([]);

useEffect(() => {
  setFiltered(items.filter((item) => item.active));
}, [items]);
```

Depois:

```tsx
const filtered = items.filter((item) => item.active);
```

O segundo exemplo torna a dependência direta. Ele não precisa esperar um efeito para refletir `items`. Também elimina uma atualização de estado usada apenas para repetir um cálculo.

A recomendação não significa que todo cálculo deva ser refeito sem pensar. Para uma transformação cara, `useMemo` pode ser considerado depois de medir. Primeiro é preciso demonstrar que o custo existe e que a dependência está correta.

## Eventos e efeitos

Efeitos são apropriados para sincronizar o componente com sistemas externos. Um clique, porém, já é uma informação sobre a intenção do usuário. Esconder essa ação em um efeito torna o fluxo indireto.

Antes:

```tsx
useEffect(() => {
  if (shouldNavigate) {
    navigate('/checkout');
  }
}, [shouldNavigate, navigate]);
```

Depois:

```tsx
function handleConfirm() {
  startTransition(() => {
    navigate('/checkout');
  });
}
```

O ponto principal não é adicionar `startTransition` em qualquer navegação. A escolha depende da operação e da versão do React. O aprendizado seguro é manter a causa da mudança junto do evento que a produziu.

Um efeito que reage a `shouldNavigate` pode executar duas vezes em desenvolvimento, dependendo das verificações do ambiente. A ação precisa ser idempotente ou, melhor, ficar no evento quando é uma consequência direta dele.

## Contratos de efeitos

Quando um efeito é necessário, eu verifico quatro aspectos: dependências, limpeza, concorrência e fronteira externa. O efeito deve declarar o que lê e precisa interromper trabalho que não pode mais concluir.

Um listener de janela, por exemplo, precisa ser removido. Uma requisição pode precisar de cancelamento ou de uma forma de ignorar uma resposta obsoleta. A solução concreta depende da API usada.

```tsx
useEffect(() => {
  const controller = new AbortController();

  fetch(`/api/items?q=${query}`, { signal: controller.signal })
    .then((response) => response.json())
    .then(setItems)
    .catch((error: unknown) => {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setError(error);
    });

  return () => controller.abort();
}, [query]);
```

O exemplo mostra um contrato de cancelamento da Fetch API. Ele não substitui tratamento de resposta HTTP inválida nem validação dos dados recebidos.

## DOM

Um wrapper sem papel semântico, de layout ou de acessibilidade adiciona leitura e pode dificultar seletores, estilos e testes. Isso não significa que profundidade do DOM seja automaticamente um problema de performance.

Antes:

```tsx
<div className="grid">
  <div className="grid-item">
    <div className="card-wrapper">
      <Card />
    </div>
  </div>
</div>
```

Depois:

```tsx
<div className="grid">
  <Card className="grid-item" />
</div>
```

Antes de remover, verifico se o elemento fornece semântica, contexto para `aria`, posicionamento ou uma fronteira visual real. O critério é função, não uma contagem arbitrária de nós.

## Contratos assíncronos

A interface também fica mais simples quando o transporte não retorna formatos ambíguos. Um resultado discriminado separa sucesso de falha sem depender de valores nulos com muitos significados.

```ts
type ResponseEntity<T, E> =
  | { success: true; data: T }
  | { success: false; data: null; error: E };
```

O componente renderiza estados conhecidos. Isso reduz condicionais espalhadas, mas não transforma uma falha de rede em falha de domínio. Essa classificação continua sendo responsabilidade da camada que conhece o transporte.

## Medição

Depois da limpeza, escolho uma ou duas interações críticas. Registro a situação inicial, repito o cenário com condições semelhantes e comparo o resultado.

```ts
performance.mark('projects-render-start');
// render da seção
performance.mark('projects-render-end');
performance.measure('projects-render', 'projects-render-start', 'projects-render-end');
```

Esse trecho ilustra a API de User Timing. Ele não mede sozinho o desempenho percebido. Para uma avaliação séria, combino perfis do React, ferramentas do navegador e uma definição clara do que está sendo comparado.

Também separo correção de velocidade. Uma mudança que reduz milissegundos, mas perde foco, anuncia estado incorretamente ou descarta resposta válida não é uma melhoria aceitável.

## Critérios

Considero a refatoração adequada quando a fonte da verdade fica única e o fluxo de evento fica explícito.

Também verifico se os efeitos sincronizam apenas com o exterior e se o DOM mantém semântica.

Considero a otimização justificada quando há uma hipótese mensurável, uma ferramenta adequada e uma regressão coberta por teste ou verificação reproduzível.

Se a mudança apenas adiciona `memo`, `useMemo` ou uma abstração sem evidência, eu a adio. O custo cognitivo também é uma parte do sistema.

## O que não remover

Limpeza não significa apagar toda camada ou transformar toda função em uma expressão curta. Um nome explícito pode proteger uma regra importante. Um componente pode existir para oferecer foco, semântica ou uma fronteira de teste.

Também não removo uma abstração apenas porque ela parece pequena hoje. O critério é se ela concentra uma decisão que se repete e se seu nome continua mais fácil de entender do que as cópias que evitaria.

Em especial, não sacrifico tratamento de erro, cancelamento e acessibilidade para reduzir linhas. Menos código é útil quando remove duplicação acidental, não quando elimina informação necessária para operar o sistema.

Esse limite evita uma leitura superficial da simplicidade. Uma função pequena pode continuar difícil de operar se omitir estados, e uma função maior pode ser clara quando registra uma sequência externa que precisa de tratamento explícito.

## Limitações

Remover estado derivado não garante uma redução perceptível no tempo de interação. Eliminar wrappers pode não alterar o custo de layout. A aplicação pode ter gargalos em rede, imagem, servidor ou terceiros.

Por isso, a limpeza é uma preparação para investigar, não uma métrica de sucesso. O efeito só pode ser julgado depois de repetir o cenário e observar a interação relevante.

O uso de `performance.measure` exige interpretar o cenário. Uma medição isolada sofre influência do dispositivo, do cache e do ambiente. As conclusões deste método são hipóteses até serem repetidas.

## Conclusão

Antes de otimizar um layout React, limpo o fluxo para que o próximo problema seja observável. Cálculos derivados permanecem no render quando isso é suficiente. Eventos carregam intenções. Efeitos ficam reservados à sincronização.

Essa abordagem não rejeita otimização. Ela cria critérios para que uma otimização seja pequena, explicável e reversível. Em vez de acumular técnicas, o código passa a mostrar por que cada uma existe.

O resultado esperado é um ponto de partida mais confiável para a próxima medição.

## Referências

- [React: You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [React: Separating Events from Effects](https://react.dev/learn/separating-events-from-effects)
- [React: Referencing Values with Refs](https://react.dev/learn/referencing-values-with-refs)
- [MDN: Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [MDN: User Timing API](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/User_timing)
