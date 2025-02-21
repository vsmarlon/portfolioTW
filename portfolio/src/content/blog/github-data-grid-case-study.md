---
title: Explorador de repositórios com MUI DataGrid e GitHub
slug: github-data-grid-case-study
excerpt: Estudo de caso sobre como transformar uma tabela comum em uma demo com dados reais, estados assíncronos previsíveis e narrativa técnica clara.
publishedAt: 2026-03-24
readTime: 14 min de leitura
category: Engenharia de Frontend
tags: [React, MUI DataGrid, React Query, GitHub API]
featured: true
hasDemo: true
---
# Uma demo que parece produto, não playground

No blog antigo, a experiência principal era uma demo técnica separada do conteúdo. Isso mostrava implementação, mas não comunicava decisão. Nesta versão, a lógica foi invertida: o artigo explica critérios e a demo existe para sustentar a história.

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

- célula principal combina nome + descrição para contexto imediato
- colunas numéricas (`Stars`, `Forks`) ficam curtas e escaneáveis
- atualização recente aparece como sinal de atividade, não só volume
- quick filter no toolbar ajuda exploração sem navegação extra

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

Isso reduz a sensação de quebra do produto e orienta o próximo passo.

## Decisões de performance

Boas escolhas simples já ajudam bastante:

- `staleTime` de 5 minutos evita requisições repetidas em navegação curta
- split de código da demo para não pesar o carregamento do artigo
- render condicional para loading/error/success com feedback visual claro

## O que eu mediria em produção

Se essa feature fosse para ambiente de produto, eu acompanharia:

1. tempo até primeiro conteúdo útil da tabela
2. taxa de erro por status HTTP
3. frequência de refetch manual por sessão
4. tempo médio entre abrir artigo e interagir com a demo

## Checklist para replicar

1. Estruture em `service -> hook -> component`.
2. Defina um tipo de erro único para a feature.
3. Normalize DTO em mapper separado.
4. Configure cache de consulta com política explícita.
5. Só depois refine visual do grid.

## Resultado para o portfólio

Quando a demo vive dentro de um artigo, ela deixa de ser um bloco técnico isolado. O visitante entende contexto, trade-offs e resultado. Isso melhora leitura para recrutadores, designers e devs, porque cada perfil entra pela camada que prefere: texto, interface ou código.
