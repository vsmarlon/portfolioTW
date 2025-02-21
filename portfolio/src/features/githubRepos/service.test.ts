import { describe, expect, it, vi } from 'vitest';
import { fetchGitHubRepositories } from './service';

const safeGetMock = vi.fn();

vi.mock('../../shared/http/axiosClient', () => ({
  safeGet: (...args: unknown[]) => safeGetMock(...args),
}));

describe('fetchGitHubRepositories', () => {
  it('maps github dto payload into grid rows', async () => {
    safeGetMock.mockResolvedValue({
      success: true,
      data: [
        {
          id: 1,
          name: 'portfolio-grid',
          html_url: 'https://github.com/vsmarlon/portfolio-grid',
          description: 'Demo',
          language: 'TypeScript',
          visibility: 'public',
          stargazers_count: 10,
          forks_count: 2,
          updated_at: '2026-03-22T10:00:00.000Z',
          fork: false,
        },
      ],
    });

    const result = await fetchGitHubRepositories('vsmarlon');

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data[0]?.name).toBe('portfolio-grid');
      expect(result.data[0]?.visibility).toBe('Público');
    }
  });

  it('returns structured error when payload is invalid', async () => {
    safeGetMock.mockResolvedValue({
      success: true,
      data: {} as unknown,
    });

    const result = await fetchGitHubRepositories('vsmarlon');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('INVALID_RESPONSE');
    }
  });
});
