import { failure, success, type ResponseEntity } from '../../shared/result';
import type { AppError } from '../../shared/errors';
import { safeGet } from '../../shared/http/axiosClient';
import type { GitHubRepoRow } from '../../types/blog';
import { mapRepositoryDtoToRow } from './mappers';
import type { GitHubRepositoryDto } from './types';

export async function fetchGitHubRepositories(
  username: string,
): Promise<ResponseEntity<GitHubRepoRow[], AppError>> {
  const response = await safeGet<GitHubRepositoryDto[]>(`/users/${username}/repos`, {
    params: {
      sort: 'updated',
      per_page: 100,
    },
  });

  if (!response.success) {
    return response;
  }

  if (!Array.isArray(response.data)) {
    return failure({
      code: 'INVALID_RESPONSE',
      message: 'A API retornou um formato inesperado de repositórios.',
    });
  }

  const rows = response.data
    .filter((repository) => !repository.fork)
    .map(mapRepositoryDtoToRow)
    .sort((left, right) => right.stars - left.stars);

  return success(rows);
}
