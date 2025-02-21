import type { GitHubRepoRow } from '../../types/blog';
import { formatCompactNumber, formatPtBrDate } from '../../utils/date';
import type { GitHubRepositoryDto } from './types';

export function mapRepositoryDtoToRow(repository: GitHubRepositoryDto): GitHubRepoRow {
  return {
    id: repository.id,
    name: repository.name,
    description: repository.description ?? '',
    language: repository.language ?? '',
    visibility: repository.visibility === 'public' ? 'Público' : 'Privado',
    stars: repository.stargazers_count,
    forks: repository.forks_count,
    updatedAt: formatPtBrDate(repository.updated_at),
    url: repository.html_url,
  };
}

export function buildRepositoryStats(rows: GitHubRepoRow[]): string[] {
  if (rows.length === 0) {
    return [];
  }

  const totalStars = rows.reduce((sum, repository) => sum + repository.stars, 0);
  const topLanguage = Object.entries(
    rows.reduce<Record<string, number>>((accumulator, repository) => {
      if (!repository.language) {
        return accumulator;
      }

      accumulator[repository.language] = (accumulator[repository.language] ?? 0) + 1;
      return accumulator;
    }, {}),
  ).sort((left, right) => right[1] - left[1])[0]?.[0];

  const repositoryCountLabel = rows.length === 1 ? 'repositório público' : 'repositórios públicos';

  return [
    `${rows.length} ${repositoryCountLabel}`,
    `${formatCompactNumber(totalStars)} stars acumuladas`,
    topLanguage ? `stack recorrente: ${topLanguage}` : 'stack variada',
  ];
}
