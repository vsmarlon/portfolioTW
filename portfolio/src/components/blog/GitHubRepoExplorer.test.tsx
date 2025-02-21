import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '../../contexts/ThemeContext';
import GitHubRepoExplorer from './GitHubRepoExplorer';

const useGitHubRepositoriesQueryMock = vi.fn();

vi.mock('../../features/githubRepos/useGitHubRepositoriesQuery', () => ({
  useGitHubRepositoriesQuery: () => useGitHubRepositoriesQueryMock(),
}));

function renderExplorer() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <GitHubRepoExplorer />
      </ThemeProvider>
    </QueryClientProvider>,
  );
}

describe('GitHubRepoExplorer', () => {
  it('renders repositories from feature hook data in the themed grid', async () => {
    useGitHubRepositoriesQueryMock.mockReturnValue({
      rows: [
        {
          id: 1,
          name: 'portfolio-grid',
          description: 'Demo de tabela com dados reais.',
          language: 'TypeScript',
          visibility: 'Público',
          stars: 7,
          forks: 2,
          updatedAt: '23 mar 2026',
          url: 'https://github.com/vsmarlon/portfolio-grid',
        },
      ],
      stats: ['1 repositório público'],
      isLoading: false,
      isFetching: false,
      isError: false,
      errorMessage: null,
      refetch: vi.fn(),
    });

    renderExplorer();

    expect(
      screen.getByRole('heading', { name: /GitHub Repository Explorer com MUI DataGrid/i }),
    ).toBeInTheDocument();
    expect(await screen.findByText('portfolio-grid')).toBeInTheDocument();
  });
});
