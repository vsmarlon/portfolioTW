---
title: O que eu removo antes de otimizar um layout React
slug: react-cleanup-before-optimization
excerpt: Antes de falar em performance, eu reduzo ruído estrutural: estados duplicados, efeitos desnecessários e wrappers que só aumentam complexidade.
publishedAt: 2026-03-12
readTime: 12 min de leitura
category: Performance
tags: [React, Performance, Refactor]
featured: false
hasDemo: false
---
# Otimização quase sempre começa removendo

Em portfólio e em produto real, o impulso inicial costuma ser adicionar memoização, virtualização ou mais uma biblioteca. Na prática, quase sempre eu ganho mais removendo excesso primeiro.

## Minha ordem de revisão

1. eliminar estados derivados que podem nascer no render
2. mover regra de interação para evento (e não para efeito)
3. reduzir estrutura de DOM sem função clara
4. medir depois da limpeza, não antes

## Exemplo 1: estado derivado sem `useEffect`

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

Ganhos imediatos:

- menos render extra
- menos risco de sincronização quebrada
- código mais simples de testar

Se você ainda fica em dúvida sobre efeito, o guia oficial ajuda muito:

- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)

## Exemplo 2: navegação em evento, não em efeito

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

A intenção fica explícita: navegação por ação do usuário, não por efeito indireto.

## Exemplo 3: wrappers sem papel estrutural

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

Nem todo wrapper custa performance perceptível, mas quase todo wrapper desnecessário custa manutenção.

## Exemplo 4: contrato assíncrono previsível

Mesmo sem backend próprio, eu evito retorno ambíguo:

```ts
type ResponseEntity<T, E> =
  | { success: true; data: T }
  | { success: false; data: null; error: E };
```

Com isso, o componente não depende de detalhe de transporte:

```ts
if (!response.success) {
  setError(response.error.message);
  return;
}

setRows(response.data);
```

## Como medir depois da limpeza

```ts
performance.mark('projects-render-start');
// render da seção
performance.mark('projects-render-end');
performance.measure('projects-render', 'projects-render-start', 'projects-render-end');
```

Não precisa medir tudo. Foque em 1 ou 2 interações críticas e compare antes/depois.

## Sinais de que vale refatorar antes de otimizar

- estado derivado replicado em múltiplos lugares
- efeito disparando regra de negócio
- componente grande com responsabilidades misturadas
- classe visual repetida em muitos arquivos
- tratamento de erro inconsistente entre telas

Se dois ou mais itens aparecem, limpar primeiro costuma acelerar qualquer otimização posterior.

## O impacto real no produto

Quando a base fica mais simples:

- bugs ficam mais rastreáveis
- PRs ficam menores e mais revisáveis
- ajustes visuais deixam de quebrar fluxo de dados
- futuras otimizações têm alvo mais claro

## O ganho para portfólio

Código limpo também comunica senioridade. Um portfólio com menos "truques" e mais critério passa confiança técnica mais rápido do que uma lista de técnicas sem contexto.
