---
title: Repository explorer with MUI DataGrid and GitHub
slug: github-data-grid-case-study
excerpt: A case study on turning an ordinary table into a demo with real data, predictable asynchronous states, and a clear technical narrative.
publishedAt: 2026-03-24
category: Frontend Engineering
tags: [React, MUI DataGrid, React Query, GitHub API]
featured: false
hasDemo: true
---
# A demo that feels like a product, not a playground

In the old blog, the main experience was a technical demo separated from the content. It showed implementation, but did not communicate a decision.

In this version, the logic is reversed: the article explains criteria, and the demo exists to support the story.

## Experiment objective

I wanted a table that could prove all of the following at once:

- real API consumption, without data that is "too polished" because it is mocked
- loading and error states as part of the product
- high-density reading without a generic dashboard look
- a codebase that is easy to evolve without coupling UI and network concerns

## Why use real GitHub data

Choosing real data changes everything:

- it forces the frontend to handle inconsistent descriptions and languages
- it exposes API limits, such as rate limiting, that rarely appear in a mock
- it makes the use case legible to a recruiter and a developer at first glance

It also connects the blog content directly to my public portfolio.

## Module architecture

The structure was split into layers to avoid a lost `fetch` inside the component:

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

This separation makes maintenance easier. If I need to change the endpoint, headers, retry strategy, or error mapping, I do not touch the main JSX.

The boundary also guides tests. The mapper can be checked with fixed objects, while the query can exercise success, failure, and an invalid response without mounting the entire table.

## Predictable return contract

To reduce scattered conditionals, I standardized the asynchronous return value:

```ts
type ResponseEntity<T, E> =
  | { success: true; data: T }
  | { success: false; data: null; error: E };
```

Direct benefits:

- success always has `data`
- failure always has `error`
- the component renders a state instead of guessing the format

## Example 1: service with domain validation

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

The important point is that network errors and domain errors are handled separately.

[[DEMO_GITHUB_REPOS]]

## Example 2: hook with render-ready state

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

This format makes the component predictable and improves testability.

## UX strategy in DataGrid

The grid was designed for quick reading:

- the main cell combines name and description for immediate context
- numeric columns, such as `Stars` and `Forks`, stay short and scannable
- recent updates appear as a sign of activity, not only volume
- a quick filter in the toolbar supports exploration without extra navigation

A table is not merely a surface for dumping fields. It must suggest a reading order. The name identifies the object. The description explains its purpose. The numbers help comparison.

The mapper also keeps the component from knowing the API's entire format. The grid row receives only the values needed for presentation. This reduction makes the boundary between transport and interface explicit.

## Asynchronous states as part of the experience

Loading, empty success, failure, and background updating are distinct states. Confusing them produces a screen that looks broken or hides important information.

Initial loading should occupy the space expected by the table. An empty state should say that the query finished without rows. An error should explain the context and offer a possible action.

During an update, previous content can remain visible. The fetching indicator says that work is in progress without erasing an answer that is still useful.

This choice depends on the library contract and must be verified in the final implementation.

## Useful, not generic, errors

A good error message gives context and an action:

```ts
if (status === 429) {
  return {
    code: 'RATE_LIMITED',
    message: 'Limite de requisições da API atingido. Tente novamente em alguns minutos.',
  };
}
```

Status `429` is defined for too many requests. Even so, the application should not assume every error has this format. The adapter must handle incomplete responses and network failures.

## Cache and performance

The query cache has two purposes: avoiding repeated work during short navigation and preserving a stable experience when returning to the article. The freshness period is not a universal truth.

The five-minute value used in the example is a product hypothesis, not an observed metric. The policy should be reviewed according to data-change frequency, API limits, and usage behavior.

Separating the demo also allows it to load on demand. This may reduce the article's initial cost, but only a build report and browser measurement can confirm the effect. This possibility should not become a numerical promise.

## Evaluation

I would evaluate the experiment across four dimensions. The first is correctness: the row represents the right repository, and errors are not confused with an empty success.

The second is legibility. A reader must understand the table without knowing the code. The third is maintainability: endpoint, mapper, and visual layer should be able to change across different boundaries.

The fourth is observability. In a real product, I would record failures by class, loading states, and manual refetches. These signals allow the policy to improve without inventing results.

## Limitations

This demo does not represent a proprietary backend. It depends on external availability, request limits, and changes to GitHub's public contract.

It also does not prove scalability to millions of rows. The query shown retrieves a limited list, and the grid should not be confused with a solution for every volume.

The user shown in the example is a demonstration choice. Their repositories may change or become unavailable. The visual result is therefore not fixed article data.

## How to replicate it

1. Define the minimum DTO for the external response.
2. Validate the received shape before mapping it.
3. Convert the DTO into an interface-specific row.
4. Model success, failure, and loading separately.
5. Configure the cache with an explicit hypothesis.
6. Test the query with valid, empty, limited, and unavailable responses.
7. Measure before calling any change an optimization.

## Conclusion

When a demo lives inside an article, it stops being an isolated technical block. The visitor understands context, trade-offs, and outcome without having to accept vague claims.

The value of the case lies less in the DataGrid component than in the chain of decisions. Real data reveals limits. Contracts reduce assumptions. Explicit states turn failures into a designed part of the experience.

This chain is the evidence that remains useful even when the tool changes.

## References

- [GitHub REST API: list repositories for a user](https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user)
- [GitHub REST API: rate limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api)
- [MUI X Data Grid: documentation](https://mui.com/x/react-data-grid/)
- [TanStack Query: caching](https://tanstack.com/query/latest/docs/framework/react/guides/caching)
- [TanStack Query: query states](https://tanstack.com/query/latest/docs/framework/react/guides/queries)
