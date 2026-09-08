---
title: Freebay: produto, arquitetura e design system no mesmo caso
slug: freebay-product-architecture
excerpt: Um estudo sobre como comércio social, serviços, integrações e decisões visuais podem formar uma única narrativa de produto.
publishedAt: 2026-03-28
category: Estudo de caso
tags: [Freebay, Produto, Design System, NestJS]
featured: false
hasDemo: false
---
# Freebay é um exercício de coerência

O Freebay foi pensado como um produto em que descoberta, relacionamento e transação não ficam em telas sem conexão. A arquitetura e o design system precisam contar a mesma história: reduzir atrito sem esconder a complexidade necessária.

## Contexto

Comércio social mistura catálogo, identidade, conversa e pagamento. Cada parte pode parecer uma feature isolada, mas o usuário percebe uma única jornada. Uma decisão em uma etapa altera expectativas na seguinte.

O caso é apresentado como estudo de arquitetura e produto, não como prova de escala comercial. O objetivo é tornar as fronteiras legíveis e explicar quais pontos dependem de hipóteses ainda não validadas.

## Objetivos

Os objetivos foram organizar uma experiência de descoberta, permitir interação entre pessoas e preservar uma transação compreensível. Também era necessário manter clientes diferentes alinhados ao mesmo domínio.

React e Flutter podem oferecer composições distintas. Ainda assim, ambos precisam respeitar regras comuns de identidade, oferta, pedido e pagamento. Essa divisão evita que uma decisão visual seja confundida com uma regra de negócio.

## Jornada de domínio

A jornada começa quando uma pessoa encontra uma oferta. Ela consulta detalhes, interpreta disponibilidade e decide se quer iniciar uma relação com o vendedor ou avançar para a compra.

Depois, a intenção de compra precisa ser reavaliada no contexto correto. Preço, moeda, estoque, endereço e forma de pagamento não devem ser inferidos apenas pela tela que iniciou o fluxo.

Uma conversa pode apoiar a descoberta, mas não deve ser tratada como autorização financeira. O domínio precisa manter a diferença entre mensagem, intenção e transação confirmada.

Essa separação também ajuda a pensar eventos. Uma nova mensagem pode ser notificada sem criar um pedido. Um pagamento aprovado pode atualizar o pedido sem depender de uma tela aberta no momento.

## Serviços e persistência

Clientes React e Flutter conversam com serviços NestJS. Autenticação, social commerce e listagens têm responsabilidades diferentes, enquanto PostgreSQL sustenta os dados relacionais.

O serviço de identidade protege a entrada e fornece contexto de usuário. O serviço de catálogo organiza ofertas e suas informações públicas. O serviço de pedidos concentra a intenção transacional e seu ciclo de vida.

Essa divisão não deve ser lida como obrigação de criar um serviço para cada tabela. A fronteira vale quando há uma responsabilidade, um contrato e uma necessidade operacional distintos.

Caso contrário, a separação pode apenas distribuir complexidade.

PostgreSQL é adequado ao caso relacional porque pedidos, itens, usuários e referências de pagamento possuem relações que precisam ser consultadas com clareza. A escolha não remove a necessidade de modelar ownership, índices e migrações.

Persistência também não é sinônimo de verdade universal. Uma listagem pode usar uma projeção otimizada, enquanto o pedido confirmado exige uma fonte transacional. O contrato deve dizer qual leitura é adequada a cada decisão.

## A borda NestJS e Stripe

Stripe fica na borda do domínio como integração explícita. O serviço não deve tratar uma chamada externa como se fosse uma simples escrita local. Há credenciais, idempotência, webhooks, estados intermediários e falhas parciais.

A aplicação pode criar uma intenção de pagamento, mas a confirmação final deve respeitar o contrato do provedor. O webhook precisa ser autenticado conforme a documentação da Stripe e processado de modo idempotente.

```ts
type PaymentState =
  | 'pending'
  | 'authorized'
  | 'failed'
  | 'cancelled';
```

Esse tipo é apenas uma simplificação didática. Os estados reais devem refletir o contrato adotado e não podem ser inventados para preencher uma tabela.

O serviço registra a referência externa e traduz eventos relevantes para o domínio. Ele não deve espalhar o SDK da Stripe por controllers ou componentes. Assim, a troca de detalhes do provedor não contamina a experiência inteira.

## Socket.IO e tempo real

Socket.IO pode comunicar mudanças que merecem atualização rápida, como uma nova mensagem ou alteração de status. A conexão, porém, não substitui persistência nem autorização.

O servidor precisa verificar a identidade e o direito de participar de um canal. O cliente deve tratar reconexão, evento repetido e estado desatualizado. Uma notificação recebida é um sinal para reconciliar dados, não necessariamente a representação completa do recurso.

Quando o tempo real falha, a interface precisa continuar compreensível. Consulta posterior, indicador de reconexão e atualização manual são alternativas que evitam transformar uma conexão transitória em perda aparente de informação.

## Design system

Um design system não é apenas uma coleção de cores. Tipografia, espaçamento, estados e componentes repetidos criam um vocabulário para que descoberta, detalhe e conversa pareçam partes do mesmo produto.

O sistema começa por papéis, não por nomes arbitrários. Uma cor de ação precisa continuar distinguível em botão, link e estado de foco. Uma superfície de catálogo pode ter densidade diferente de uma tela de conversa.

Componentes devem expor estados necessários: carregando, vazio, erro, foco e desabilitado. Esconder essas diferenças dentro de cada tela aumenta divergência e torna a revisão visual mais difícil.

O design system também ajuda o domínio a permanecer visível. Um estado de pedido não é apenas uma cor. Ele precisa de texto, estrutura e ação coerentes com a regra que representa.

## Trade-offs

Serviços separados podem melhorar ownership, mas elevam custo de contratos, observabilidade e deploy. Um serviço mais amplo pode ser mais simples no início, desde que suas fronteiras internas permaneçam claras.

React e Flutter permitem experiências próprias, mas duplicam parte da manutenção. A compensação é compartilhar contratos e decisões de domínio, não forçar o mesmo componente em plataformas diferentes.

Stripe reduz a necessidade de construir infraestrutura de pagamento. Em troca, introduz dependência externa, políticas do provedor e necessidade de acompanhar mudanças documentadas.

Socket.IO melhora atualização percebida em alguns fluxos. Em troca, exige reconexão, presença, autorização e estratégia para recuperar eventos perdidos. Não é uma otimização neutra.

## Avaliação

Eu avaliaria o caso por continuidade da jornada, clareza de contratos e capacidade de falhar sem perder o estado conhecido. O fluxo de oferta até pagamento deve indicar quem decide cada transição.

Também verificaria se o design system reduz divergência entre telas. Um componente não é bem-sucedido apenas por ser reutilizado; ele precisa preservar semântica, acessibilidade e uma variação limitada.

Na operação, observaria falhas de webhook, reconexões, latência percebida e erros de persistência. Não apresento números porque não há uma medição publicada para este exercício.

## Limitações

O caso não demonstra volume de produção, conversão, disponibilidade ou tempo de resposta. Essas conclusões exigiriam ambiente instrumentado, tráfego representativo e critérios definidos antes da medição.

A arquitetura descrita também não resolve automaticamente fraude, estoque distribuído, moderação ou políticas de cancelamento. Esses temas precisam de decisões próprias e não devem ser escondidos atrás do desenho de serviços.

As escolhas de Stripe e Socket.IO são adequadas ao cenário descrito, mas podem não ser adequadas a outro produto. Custos, requisitos regulatórios e capacidades da equipe alterariam a decisão.

## Conclusão

O valor do Freebay está na cadeia de decisões. A jornada orienta os serviços. Os contratos protegem as fronteiras. Stripe e Socket.IO permanecem integrações explícitas. O design system dá forma consistente às regras.

O caso evita inventar métricas ou esconder o que ainda é hipótese. O acabamento visual só é útil quando torna a arquitetura mais examinável. Produto e implementação ficam mais confiáveis quando podem ser explicados no mesmo percurso.

## Referências

- [NestJS: documentação oficial](https://docs.nestjs.com/)
- [PostgreSQL: documentação oficial](https://www.postgresql.org/docs/)
- [Stripe: webhooks](https://docs.stripe.com/webhooks)
- [Stripe: idempotent requests](https://docs.stripe.com/api/idempotent_requests)
- [Socket.IO: documentação](https://socket.io/docs/v4/)
- [W3C: Web Content Accessibility Guidelines 2.2](https://www.w3.org/TR/WCAG22/)
