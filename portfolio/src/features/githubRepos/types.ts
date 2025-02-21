export interface GitHubRepositoryDto {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  visibility: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  fork: boolean;
}

