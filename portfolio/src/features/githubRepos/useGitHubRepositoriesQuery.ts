import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { AppError } from '../../shared/errors';
import { getUserSafeErrorMessage } from '../../shared/errors';
import type { GitHubRepoRow } from '../../types/blog';
import type { ResponseEntity } from '../../shared/result';
import {
  DEFAULT_GITHUB_USERNAME,
  GITHUB_REPOSITORIES_QUERY_KEY,
  GITHUB_REPOSITORIES_QUERY_STALE_TIME_MS,
} from './constants';
import { buildRepositoryStats } from './mappers';
import { fetchGitHubRepositories } from './service';

interface UseGitHubRepositoriesQueryOptions {
  username?: string;
}

type QueryPayload = ResponseEntity<GitHubRepoRow[], AppError>;

export function useGitHubRepositoriesQuery({
  username = DEFAULT_GITHUB_USERNAME,
}: UseGitHubRepositoriesQueryOptions = {}) {
  const query = useQuery<QueryPayload>({
    queryKey: GITHUB_REPOSITORIES_QUERY_KEY(username),
    queryFn: () => fetchGitHubRepositories(username),
    staleTime: GITHUB_REPOSITORIES_QUERY_STALE_TIME_MS,
  });

  const rows = useMemo(() => (query.data?.success ? query.data.data : []), [query.data]);
  const appError = useMemo(
    () => (query.data && !query.data.success ? query.data.error : null),
    [query.data],
  );
  const stats = useMemo(() => buildRepositoryStats(rows), [rows]);
  const hasUnexpectedQueryError = query.isError && !appError;
  const errorMessage = appError
    ? getUserSafeErrorMessage(appError)
    : hasUnexpectedQueryError
      ? 'Falha inesperada ao consultar a API.'
      : null;

  return {
    rows,
    stats,
    error: appError,
    errorMessage,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: Boolean(appError) || hasUnexpectedQueryError,
    refetch: query.refetch,
  };
}
