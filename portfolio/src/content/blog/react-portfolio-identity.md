---
title: Como estou deixando este portfólio menos genérico
slug: react-portfolio-identity
excerpt: O foco não é adicionar efeito por efeito, e sim construir identidade visual, hierarquia e decisões de interface coerentes com a narrativa técnica.
publishedAt: 2026-03-18
category: Produto pessoal
tags: [Portfolio, React, UX]
featured: false
hasDemo: false
---
# Identidade não nasce de mais componentes

Portfólio técnico costuma cair em dois extremos: uma landing bonita demais e sem substância, ou uma lista fria de projetos. Procuro um terceiro caminho: personalidade visual apoiada por contexto técnico.

## Público e problema

O visitante não lê um portfólio como quem usa um produto por meses. Recrutadores procuram sinais rápidos de critério. Pessoas técnicas procuram evidência de implementação. Designers observam composição e cuidado.

O problema é atender a essas leituras sem produzir uma página que grita para todos ao mesmo tempo. A identidade precisa organizar a atenção antes de pedir uma decisão.

Por isso, evito medir qualidade apenas pela quantidade de componentes. Uma seção nova só merece existir quando melhora a narrativa, esclarece uma competência ou permite examinar uma decisão.

## Requisitos

Defini requisitos simples para o ciclo atual:

- hierarquia visual compreensível sem animação
- leitura confortável em telas pequenas e grandes
- relação explícita entre projeto, decisão e evidência
- componentes reutilizados quando compartilham comportamento
- tema e contraste que não prejudiquem acessibilidade

Esses requisitos são critérios de projeto, não resultados comprovados. A avaliação precisa confirmar se a interface os atende em uso real.

## Tokens

Quando cada seção escolhe suas próprias cores, raios e espaçamentos, a identidade vira uma coleção de exceções. Tokens reduzem variação acidental e tornam uma mudança visual mais localizada.

```ts
export const UI_CLASSES = {
  surfaceCard: 'ui-surface-card rounded-[1.5rem] border ...',
  gradientPanel: 'ui-gradient-panel rounded-[1.5rem] border ...',
  tagChip: 'ui-tag-chip rounded-full border ...',
} as const;
```

O exemplo é um vocabulário de aplicação. Ele não deve esconder diferenças semânticas apenas para forçar uniformidade. Uma superfície de leitura pode precisar de contraste e largura distintos de uma superfície de destaque.

Também trato tipografia, espaçamento e cor como decisões relacionadas. A escala precisa construir níveis. O espaçamento precisa indicar agrupamento. A cor precisa reforçar estado ou prioridade, e não competir com todo o conteúdo.

## Composição editorial

Cards repetidos são uma solução fácil para organizar informação, mas podem nivelar projetos diferentes. Prefiro alternar texto, evidência, código, diagrama e chamada quando cada forma serve a uma etapa da história.

Um artigo técnico começa com uma pergunta. Depois mostra um contexto, apresenta uma decisão e oferece uma forma de examiná-la. A composição visual deve acompanhar esse ritmo, em vez de transformar todo trecho em um bloco com a mesma aparência.

No blog, a navegação lateral orienta sem disputar com o conteúdo. Em telas menores, ela não deve impedir a leitura. O princípio responsivo é preservar relações importantes, não manter cada coluna intacta.

## Componentes

Uma superfície reutilizável faz sentido quando reduz decisões repetidas de comportamento, foco, borda ou espaçamento. Não crio um componente apenas porque duas tags possuem o mesmo número de linhas.

```tsx
const SurfaceCard = forwardRef<HTMLDivElement, SurfaceCardProps>(
  ({ children, className, variant = 'default', ...props }, ref) => (
    <div ref={ref} className={classNames(SURFACE_VARIANT_CLASS[variant], className)} {...props}>
      {children}
    </div>
  ),
);
```

A abstração permanece saudável quando seu nome comunica uma decisão. `SurfaceCard` diz que existe uma superfície com variantes. Não promete resolver qualquer caixa da aplicação.

## Narrativa no código

O código também faz parte da apresentação. Um leitor técnico precisa conseguir sair da tela e localizar o fluxo. Nomes, limites de arquivo e contratos valem mais que comentários que repetem a implementação.

Em uma seção de projeto, separo dados de composição visual quando o domínio justifica essa distinção. Assim, a narrativa pode mudar sem reescrever a forma como os dados são representados.

O mesmo vale para demos. Um exemplo interativo não deve ser um brinquedo solto. Ele precisa responder à pergunta levantada pelo texto e deixar claro quando depende de uma API externa ou de uma hipótese.

## Tema e acessibilidade

O tema escuro não é uma licença para usar contraste agressivo. Texto, controles, foco e estados precisam continuar distinguíveis. Cores não devem ser a única forma de comunicar erro, sucesso ou seleção.

Também considero movimento uma preferência do usuário. Transições podem orientar atenção, mas o conteúdo precisa funcionar quando a redução de movimento está ativa. A interface não deve esconder informação atrás de uma animação.

Foco visível, ordem de teclado e nomes acessíveis entram no mesmo critério. A aparência final é incompleta se a interação só funciona com mouse ou visão sem alteração de contraste.

## Exemplo de bloco de código

Snippet técnico também comunica identidade:

```css
.code-block-pre {
  border: 1px solid rgba(6, 182, 212, 0.25);
  background: radial-gradient(circle at 0% 0%, rgba(6, 182, 212, 0.12), transparent 38%), #020617;
}

.code-block-pre .hljs-keyword {
  color: #7dd3fc;
}
```

O bloco precisa manter legibilidade, permitir seleção e respeitar o fluxo horizontal. Estilizar sintaxe não é suficiente se o código vira uma imagem difícil de consultar.

## Como avalio

Avalio a identidade por perguntas observáveis. Um visitante entende o que faço sem procurar uma lista escondida? Consegue diferenciar um projeto de outro? Encontra uma evidência em vez de apenas uma afirmação?

Na interface, verifico largura de texto, hierarquia de títulos, comportamento em viewport menor, foco e contraste. No código, procuro tokens usados de modo coerente e componentes com responsabilidades legíveis.

O resultado desejado não é uma taxa de conversão inventada. É um percurso que pode ser observado em testes manuais, revisão visual e navegação por teclado.

Uma revisão visual também precisa considerar conteúdo fora do caso ideal. Títulos longos, descrições vazias, nomes de tecnologias diferentes e mensagens de erro testam a elasticidade da composição.

Se o layout funciona apenas com frases curtas ou com uma quantidade previsível de cartões, ele ainda não demonstrou identidade. Demonstrou uma captura controlada. O sistema precisa tolerar variação sem perder hierarquia.

Eu registro essas verificações como critérios simples, não como uma promessa de cobertura total. A intenção é permitir que uma próxima alteração repita a avaliação e revele quando uma decisão deixou de funcionar.

Esse registro também reduz dependência de gosto pessoal. A revisão continua interpretativa, mas passa a discutir hierarquia, legibilidade, estados e comportamento observável em vez de apenas preferência estética.

## Limitações

Uma identidade visual não resolve falta de conteúdo. Tokens não impedem toda inconsistência. Componentes reutilizáveis podem ficar rígidos quando recebem variantes demais.

Também não afirmo que a composição atual seja a melhor para todo público. O critério de recrutamento é uma hipótese baseada no propósito do portfólio. Entrevistas e observação de visitantes poderiam revelar outras necessidades.

Essa hipótese deve ser revisada quando o público, o conteúdo ou o objetivo profissional mudar. A identidade precisa continuar servindo à leitura, não proteger decisões antigas.

## Conclusão

Estou deixando o portfólio menos genérico ao reduzir escolhas arbitrárias. A narrativa define o que merece destaque. O sistema visual torna essas escolhas repetíveis. Os componentes protegem comportamento sem apagar diferenças.

O objetivo não é parecer complexo. É fazer com que cor, tipografia, código, navegação e conteúdo apontem para a mesma ideia: competência técnica também inclui explicar limites, contexto e intenção.

Quando esses elementos concordam, a interface deixa de ser uma moldura decorativa e passa a participar da argumentação do trabalho.

Essa participação é deliberada. O visual introduz a pergunta, o texto organiza a resposta e o código oferece uma forma de verificar a decisão sem transformar o portfólio em documentação integral.

## Referências

- [W3C: Web Content Accessibility Guidelines 2.2](https://www.w3.org/TR/WCAG22/)
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [MDN: Accessible Web Apps and Widgets](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/ARIA)
- [React: Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
