---
title: Explorador de repositórios com MUI DataGrid e GitHub
slug: github-data-grid-case-study
excerpt: Estudo de caso sobre como transformar uma tabela comum em uma demo com dados reais, estados assíncronos previsíveis e narrativa técnica clara.
publishedAt: 2026-03-24
category: Engenharia de Frontend
tags: [React, MUI DataGrid, React Query, GitHub API]
featured: false
hasDemo: true
---
# Uma demo que parece produto, não playground

No blog antigo, a experiência principal era uma demo técnica separada do conteúdo. Isso mostrava implementação, mas não comunicava decisão.

Nesta versão, a lógica foi invertida: o artigo explica critérios e a demo existe para sustentar a história.

## Objetivo do experimento

Eu queria uma tabela que provasse, ao mesmo tempo:

- consumo real de API, sem dados mockados "bonitos demais"
- estados de carregamento/erro como parte do produto
- leitura de alta densidade sem visual de painel genérico
- base de código fácil de evoluir sem acoplamento entre UI e rede

## Por que usar dados reais do GitHub

Escolher dados reais muda tudo:

- obriga o frontend a lidar com inconsistência de descrições e linguagens
- expõe limites de API (rate limit) que em mock raramente aparecem
- torna o caso de uso legível para recrutador e para dev no primeiro olhar

Além disso, conecta diretamente o conteúdo do blog ao meu portfólio público.

## Arquitetura do módulo

A estrutura foi separada em camadas para evitar `fetch` perdido no componente:

```text
features/githubRepos/
  service.ts
  mappers.ts
  useGitHubRepositoriesQuery.ts
shared/
  http/axiosClient.ts
  errors.ts
  result.ts
components/blog/
  GitHubRepoExplorer.tsx
```

Essa separação facilita manutenção. Se eu precisar trocar endpoint, cabeçalhos, estratégia de retry ou mapeamento de erro, não encosto no JSX principal.

O limite também orienta testes. O mapeador pode ser verificado com objetos fixos, enquanto a consulta pode exercitar sucesso, falha e resposta inválida sem montar a tabela inteira.

## Contrato de retorno previsível

Para reduzir condicionais espalhadas, padronizei o retorno assíncrono:

```ts
type ResponseEntity<T, E> =
  | { success: true; data: T }
  | { success: false; data: null; error: E };
```

Benefícios diretos:

- sucesso sempre tem `data`
- falha sempre tem `error`
- o componente renderiza estado, não adivinha formato

## Exemplo 1: serviço com validação de domínio

```ts
export async function fetchGitHubRepositories(username: string) {
  const response = await safeGet<GitHubRepositoryDto[]>(`/users/${username}/repos`, {
    params: { sort: 'updated', per_page: 100 },
  });

  if (!response.success) return response;

  if (!Array.isArray(response.data)) {
    return failure({
      code: 'INVALID_RESPONSE',
      message: 'A API retornou um formato inesperado de repositórios.',
    });
  }

  const rows = response.data
    .filter((repo) => !repo.fork)
    .map(mapRepositoryDtoToRow)
    .sort((a, b) => b.stars - a.stars);

  return success(rows);
}
```

Ponto importante: erro de rede e erro de domínio são tratados separadamente.

[[DEMO_GITHUB_REPOS]]

## Exemplo 2: hook com estado pronto para render

```ts
export function useGitHubRepositoriesQuery({ username = 'vsmarlon' } = {}) {
  const query = useQuery({
    queryKey: ['github-repositories', username],
    queryFn: () => fetchGitHubRepositories(username),
    staleTime: 1000 * 60 * 5,
  });

  const rows = query.data?.success ? query.data.data : [];
  const appError = query.data && !query.data.success ? query.data.error : null;

  return {
    rows,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: Boolean(appError),
    errorMessage: appError?.message ?? null,
    refetch: query.refetch,
  };
}
```

Esse formato deixa o componente previsível e melhora testabilidade.

## Estratégia de UX no DataGrid

O grid foi desenhado com foco em leitura rápida:

- célula principal combina nome e descrição para contexto imediato
- colunas numéricas, como `Stars` e `Forks`, ficam curtas e escaneáveis
- atualização recente aparece como sinal de atividade, não só volume
- quick filter no toolbar ajuda exploração sem navegação extra

Uma tabela não é apenas uma superfície para despejar campos. Ela precisa sugerir uma ordem de leitura. O nome identifica o objeto. A descrição explica sua finalidade. Os números ajudam a comparar.

O mapeador também evita que o componente conheça o formato inteiro da API. A linha do grid recebe apenas os valores necessários à apresentação. Essa redução torna explícita a fronteira entre transporte e interface.

## Estados assíncronos como parte da experiência

Carregamento, sucesso vazio, falha e atualização em segundo plano são estados distintos. Confundi-los produz uma tela que parece quebrada ou que oculta informação importante.

O carregamento inicial deve ocupar o espaço esperado pela tabela. Um estado vazio precisa dizer que a consulta terminou sem linhas. O erro precisa explicar o contexto e oferecer uma ação possível.

Durante uma atualização, o conteúdo anterior pode continuar visível. O indicador de busca informa que há trabalho em curso sem apagar uma resposta que ainda é útil.

Essa escolha depende do contrato da biblioteca e deve ser verificada na implementação final.

## Erros úteis, não genéricos

Mensagem de erro boa diz contexto e ação:

```ts
if (status === 429) {
  return {
    code: 'RATE_LIMITED',
    message: 'Limite de requisições da API atingido. Tente novamente em alguns minutos.',
  };
}
```

O status `429` é definido para excesso de requisições. Ainda assim, a aplicação não deve presumir que todo erro tem esse formato. O adaptador precisa tratar respostas incompletas e falhas de rede.

## Cache e desempenho

O cache da consulta tem duas funções: evitar trabalho repetido em navegação curta e preservar uma experiência estável ao retornar ao artigo. O tempo de validade não é uma verdade universal.

O valor de cinco minutos usado no exemplo é uma hipótese de produto, não uma métrica observada. A política deve ser revisada conforme a frequência de mudança dos dados, os limites da API e o comportamento de uso.

Separar a demo também permite carregá-la sob demanda. Isso pode reduzir o custo inicial do artigo, mas só um relatório de build e uma medição no navegador confirmam o efeito. Não se deve converter essa possibilidade em promessa numérica.

## Avaliação

Eu avaliaria o experimento em quatro dimensões. A primeira é correção: a linha representa o repositório certo e os erros não são confundidos com sucesso vazio.

A segunda é legibilidade. Um leitor precisa compreender a tabela sem conhecer o código. A terceira é manutenção: endpoint, mapeador e visual devem poder mudar em fronteiras diferentes.

A quarta é observabilidade. Em um produto real, eu registraria falhas por classe, estados de carregamento e refetch manual. Esses sinais permitem melhorar a política sem inventar resultados.

## Limitações

Esta demo não representa um backend proprietário. Ela depende de disponibilidade externa, limites de requisição e mudanças no contrato público do GitHub.

Também não prova escalabilidade para milhões de linhas. A consulta apresentada busca uma lista limitada e o grid não deve ser confundido com uma solução para qualquer volume.

O usuário exibido no exemplo é uma escolha de demonstração. A disponibilidade de seus repositórios pode mudar. O resultado visual, portanto, não é um dado fixo do artigo.

## Como replicar

1. Defina o DTO mínimo da resposta externa.
2. Valide a forma recebida antes de mapear.
3. Converta o DTO em uma linha própria da interface.
4. Modele sucesso, falha e carregamento separadamente.
5. Configure cache com uma hipótese explícita.
6. Teste a consulta com resposta válida, vazia, limitada e indisponível.
7. Meça antes de chamar qualquer mudança de otimização.

## Conclusão

Quando a demo vive dentro de um artigo, ela deixa de ser um bloco técnico isolado. O visitante entende contexto, trade-offs e resultado sem precisar aceitar afirmações vagas.

O valor do caso está menos no componente DataGrid do que na cadeia de decisões. Dados reais revelam limites. Contratos reduzem suposições. Estados explícitos transformam falhas em parte projetada da experiência.

Essa cadeia é a evidência que permanece útil mesmo quando a ferramenta muda.

## Referências

- [GitHub REST API: repositórios do usuário](https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user)
- [GitHub REST API: limites de uso](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api)
- [MUI X Data Grid: documentação](https://mui.com/x/react-data-grid/)
- [TanStack Query: caching](https://tanstack.com/query/latest/docs/framework/react/guides/caching)
- [TanStack Query: estados de consulta](https://tanstack.com/query/latest/docs/framework/react/guides/queries)
