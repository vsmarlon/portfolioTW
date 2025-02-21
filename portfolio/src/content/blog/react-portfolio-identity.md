---
title: Como estou deixando este portfólio menos genérico
slug: react-portfolio-identity
excerpt: O foco não é adicionar efeito por efeito, e sim construir identidade visual, hierarquia e decisões de interface coerentes com a narrativa técnica.
publishedAt: 2026-03-18
readTime: 11 min de leitura
category: Produto pessoal
tags: [Portfolio, React, UX]
featured: false
hasDemo: false
---
# Identidade não nasce de mais componentes

Portfólio técnico costuma cair em dois extremos: landing "bonita demais" sem substância ou lista fria de projetos sem narrativa. Meu objetivo é o meio: personalidade visual com contexto técnico suficiente para sustentar decisões.

## O que eu estou evitando

- seções que parecem template pronto
- widgets decorativos sem função de leitura
- páginas que competem entre si em vez de formar uma história

## O que eu estou fortalecendo

- tipografia com hierarquia clara
- blocos com peso editorial, não apenas cards repetidos
- demos que servem ao texto em vez de roubar atenção

Esse ajuste importa porque recrutador não navega portfólio como usuário de produto final. A pessoa busca sinais de critério visual, domínio técnico e clareza de comunicação.

## Exemplo 1: tokens visuais centralizados

Quando classe utilitária repete demais, identidade vira ruído. Centralizar tokens reduz variação acidental:

```ts
export const UI_CLASSES = {
  surfaceCard: 'ui-surface-card rounded-[1.5rem] border ...',
  gradientPanel: 'ui-gradient-panel rounded-[1.5rem] border ...',
  tagChip: 'ui-tag-chip rounded-full border ...',
} as const;
```

Benefícios:

- mudanças visuais viram alteração única
- consistência entre home, blog e projetos
- menos "quase igual" espalhado no código

## Exemplo 2: componente de superfície reutilizável

```tsx
const SurfaceCard = forwardRef<HTMLDivElement, SurfaceCardProps>(
  ({ children, className, variant = 'default', ...props }, ref) => (
    <div ref={ref} className={classNames(SURFACE_VARIANT_CLASS[variant], className)} {...props}>
      {children}
    </div>
  ),
);
```

Isso não é abstração gratuita. É redução de decisão repetida em toda nova seção.

## Exemplo 3: layout editorial com flex

Em áreas críticas do blog, priorizei composição flex:

```tsx
<div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-0">
  <aside className="hidden lg:block lg:shrink-0">...</aside>
  <section className="min-w-0 lg:flex-1">...</section>
</div>
```

Resultado:

- layout mais adaptável por breakpoint
- menos microajuste manual de largura
- leitura mais contínua entre navegação e conteúdo

## Exemplo 4: bloco de código como peça de narrativa

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

Quando o bloco conversa com o tema, ele deixa de parecer elemento externo e vira parte da experiência.

## Estrutura que eu uso para decidir interface

Eu penso em três camadas:

1. **narrativa**: o que quero provar sobre meu critério
2. **sistema**: tokens, componentes e padrões de comportamento
3. **execução**: espaçamento, tipografia, contraste e fluxo de leitura

Se só a terceira camada existe, o site pode ficar bonito, mas genérico.

## Erros comuns que estou evitando nesse ciclo

- exagerar contraste sem motivo e quebrar hierarquia
- usar animação para esconder falta de conteúdo
- misturar tom visual entre páginas sem sistema comum
- adicionar componente novo quando o ajuste era só composição

## O efeito prático

Com estrutura melhor, até projeto pequeno ganha força. O visitante deixa de ver só screenshot e passa a entender contexto, intenção e maturidade de implementação.
