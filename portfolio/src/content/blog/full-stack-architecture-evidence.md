---
title: Arquitetura full stack como evidência de trabalho
slug: full-stack-architecture-evidence
excerpt: Como usar um portfólio para mostrar decisões de produto, contratos e limites de sistema sem transformar a apresentação em um inventário de ferramentas.
publishedAt: 2026-04-12
category: Arquitetura
tags: [Full Stack, React, NestJS, Arquitetura]
featured: true
hasDemo: false
---
# Arquitetura também é comunicação

Um portfólio técnico precisa provar mais do que a capacidade de montar uma tela. Ele precisa mostrar como uma decisão se sustenta quando deixa de ser um componente isolado e passa a participar de um sistema.

Isso muda a unidade de explicação. Em vez de apresentar uma tecnologia como conquista isolada, apresento uma sequência em que cada camada recebe uma responsabilidade observável.

## Problema

Listar React, NestJS ou PostgreSQL não explica onde cada tecnologia é necessária. O leitor ainda precisa descobrir qual problema foi resolvido, quem era responsável por cada regra e como a informação atravessava o sistema.

Meu problema de apresentação é transformar implementação em evidência sem fingir que um projeto de portfólio possui a mesma operação de um produto consolidado. A narrativa precisa ser concreta e também honesta sobre seus limites.

## Método

Eu começo pelo fluxo, não pelo inventário. Descrevo a intenção do usuário, a entrada no cliente, a validação, a decisão do domínio, a persistência e a resposta observável.

Depois, separo fatos de hipóteses. Um contrato implementado é evidência direta. Uma possível melhoria de cache é hipótese. Um resultado de performance só entra como conclusão quando existe medição reproduzível.

O método tem três perguntas: qual mudança o fluxo produz, em que fronteira ela é decidida e como o próximo componente sabe o que ocorreu. Essas perguntas são pequenas, mas evitam diagramas sem responsabilidade.

## Fluxo de ponta a ponta

O percurso pode ser descrito assim: o cliente envia uma intenção, o serviço valida o contexto, o domínio decide, a persistência registra e a resposta informa o próximo estado.

No cliente, a validação melhora a interação. Ela não substitui a validação do servidor, porque a fronteira de confiança termina antes da API. O backend precisa rejeitar entradas inválidas mesmo quando a interface parece correta.

No serviço, controller e DTO adaptam transporte. A regra de negócio deve permanecer em uma camada que possa ser testada sem depender de detalhes do navegador ou do framework HTTP.

Na persistência, o sistema mantém o estado que precisa sobreviver à requisição. A resposta não deve ser apenas um reflexo do que o cliente enviou. Ela precisa representar o resultado aceito pelo domínio.

## Contratos e limites

React e Flutter podem ter experiências diferentes, mas não precisam inventar regras diferentes. DTOs, validações e respostas consistentes deixam o backend responsável por proteger o domínio.

Um contrato útil descreve entradas, saídas, erros e estados que não são definitivos. Se o endpoint pode aceitar a intenção e concluir a operação depois, a resposta precisa dizer isso em vez de usar um `success: true` ambíguo.

```ts
type Result<T, E> =
  | { success: true; data: T }
  | { success: false; error: E };
```

O tipo é ilustrativo. A aplicação real precisa definir códigos, serialização, autenticação e compatibilidade. Um union type não substitui uma especificação de API.

Contratos também protegem limites de mudança. O cliente não deve conhecer tabelas. O serviço não deve depender de um seletor visual. A integração externa não deve espalhar seus tipos pela regra central.

## Evidência no código

O código funciona como evidência quando o leitor consegue seguir uma entrada até seu efeito sem depender de conhecimento implícito. Nomes de funções, tipos de erro e testes devem revelar o contrato que o texto descreve.

Isso não exige expor cada arquivo. Exige selecionar exemplos representativos: uma validação na fronteira, uma transformação de dados, uma decisão de persistência e um estado de interface.

A seleção precisa deixar claro o que não foi mostrado. Um trecho isolado pode parecer elegante e ainda esconder uma dependência importante. Por isso, o snippet precisa estar ligado ao fluxo que pretende explicar.

## Segurança como fronteira

Autenticação, autorização e validação não são detalhes que aparecem apenas quando há erro. Elas definem o que um cliente pode pedir e quais dados podem atravessar a fronteira.

O artigo não substitui uma revisão de segurança. Ainda assim, mostrar onde a confiança termina evita a impressão de que o cliente controla a regra. Segredos permanecem fora do bundle e mensagens públicas não devem revelar detalhes internos sem necessidade.

## Dados e integrações

A decisão de dados começa pelo ownership. O serviço que decide uma regra precisa ter acesso confiável à informação necessária ou consultar uma fonte explicitamente responsável por ela.

Integrações externas introduzem latência, indisponibilidade e formatos que o sistema não controla. Um adaptador deve traduzir essas diferenças e classificar falhas sem esconder o contexto operacional.

Uma escrita local e uma chamada externa podem falhar em momentos diferentes. A arquitetura precisa escolher entre estados intermediários, compensação, repetição ou confirmação posterior. Não há uma receita única que permita declarar atomicidade onde ela não existe.

Em um fluxo assíncrono, a fila não é uma promessa de conclusão imediata. Ela representa trabalho aceito para processamento. O usuário precisa receber um estado que diferencie aceitação, processamento, sucesso e falha.

## Estados observáveis

Carregamento, vazio, erro, sucesso e atualização são estados de produto. Se o cliente possui apenas `data` ou `erro`, ele não consegue comunicar uma operação que ainda está em andamento.

Um estado de erro deve preservar o que continua válido e oferecer uma ação possível. Repetir automaticamente pode ajudar em falhas transitórias, mas também pode duplicar trabalho ou piorar um limite externo.

O estado exibido precisa corresponder ao contrato. Uma resposta `202 Accepted` não deve ser apresentada como resultado final sem que o backend tenha definido esse significado. O texto da interface é parte da precisão técnica.

## Avaliação

Eu avaliaria o fluxo por correção, legibilidade e recuperação. Correção pergunta se a regra certa decide. Legibilidade pergunta se um leitor consegue localizar a responsabilidade. Recuperação pergunta se a falha tem um caminho compreensível.

Para a apresentação, também verificaria se cada tecnologia aparece ligada a uma necessidade. Se a lista de ferramentas cresce sem alterar o fluxo explicado, ela é decoração e deve ser removida.

Métricas de performance só seriam incluídas depois de definir cenário, dispositivo, navegador, rede e interação. Sem essas condições, um número isolado parece preciso, mas não sustenta comparação.

## Limitações

Um portfólio não é uma auditoria de produção. Ele pode mostrar contratos, testes e decisões, mas não comprova sozinho disponibilidade, segurança operacional ou comportamento sob tráfego real.

A narrativa também seleciona um caminho feliz e alguns erros relevantes. Sistemas reais possuem permissões, migrações, incidentes e integrações que exigem mais documentação do que um artigo comporta.

A simplificação é aceitável quando é declarada. Ela se torna um problema quando um diagrama parcial é apresentado como arquitetura completa.

## Conclusão

Arquitetura full stack funciona como evidência quando mostra uma sequência verificável: intenção, contrato, decisão, estado e efeito persistido. A lista de tecnologias passa a ser consequência da necessidade, não o assunto principal.

Essa abordagem também melhora a comunicação entre perfis. Pessoas de produto encontram o problema. Pessoas de engenharia encontram os limites. Pessoas de design encontram os estados e a consequência da regra na interface.

O que deve permanecer simples é dito como simples. O que é hipótese é rotulado como hipótese. Essa honestidade é parte do trabalho técnico, não uma nota de rodapé.

## Referências

- [NestJS: Controllers](https://docs.nestjs.com/controllers)
- [NestJS: Validation](https://docs.nestjs.com/techniques/validation)
- [MDN: HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)
- [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110)
- [OWASP: API Security Top 10](https://owasp.org/API-Security/editions/2023/en/0x11-t10/)
