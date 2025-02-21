import { describe, it, expect, vi, afterEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Blog from './Blog';

function renderBlog(initialEntry: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Blog />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

afterEach(() => {
  window.localStorage.clear();
  vi.unstubAllGlobals();
});

describe('Blog', () => {
  it('renders the article-first listing with sidebar navigation and demo entry point', () => {
    renderBlog('/blog');

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /Explorador de reposit[óo]rios com MUI DataGrid e GitHub/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ir para a demo/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Todos os artigos/i).length).toBeGreaterThan(0);
  });

  it('renders an article detail page with the embedded github grid demo', async () => {
    renderBlog('/blog/github-data-grid-case-study');

    expect(
      screen.getByRole('heading', {
        name: /Explorador de reposit[óo]rios com MUI DataGrid e GitHub/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Reposit[óo]rios reais, grid sob demanda/i }),
    ).toBeInTheDocument();
  });

  it('falls back to not found when the article slug does not exist', () => {
    renderBlog('/blog/slug-inexistente');

    expect(screen.getByText(/Essa rota saiu do mapa/i)).toBeInTheDocument();
  });

  it('supports keyboard resizing and persists sidebar width', async () => {
    renderBlog('/blog');

    const sidebar = screen.getByTestId('blog-sidebar');
    const handle = screen.getByTestId('blog-sidebar-resizer');

    expect(sidebar).toHaveStyle({ width: '320px' });

    fireEvent.keyDown(handle, { key: 'ArrowRight' });
    fireEvent.keyDown(handle, { key: 'ArrowRight' });

    await waitFor(() => {
      expect(sidebar).toHaveStyle({ width: '344px' });
      expect(window.localStorage.getItem('portfolio.blog.sidebarWidth')).toBe('344');
    });
  });

  it('supports mouse dragging for sidebar resizing', async () => {
    renderBlog('/blog');

    const sidebar = screen.getByTestId('blog-sidebar');
    const handle = screen.getByTestId('blog-sidebar-resizer');

    fireEvent.mouseDown(handle, { button: 0, clientX: 500 });
    fireEvent.mouseMove(window, { clientX: 560 });
    fireEvent.mouseUp(window, { clientX: 560 });

    await waitFor(() => {
      expect(sidebar).toHaveStyle({ width: '380px' });
      expect(window.localStorage.getItem('portfolio.blog.sidebarWidth')).toBe('380');
    });
  });

  it('keeps the resize handle stretched for full-height dragging', () => {
    renderBlog('/blog');

    const handle = screen.getByTestId('blog-sidebar-resizer');
    expect(handle).toHaveClass('lg:self-stretch');
    expect(handle.firstElementChild).toHaveClass('h-full');
  });

  it('restores persisted sidebar width and clamps invalid values', async () => {
    window.localStorage.setItem('portfolio.blog.sidebarWidth', '920');
    renderBlog('/blog');

    await waitFor(() => {
      expect(screen.getByTestId('blog-sidebar')).toHaveStyle({ width: '460px' });
    });
  });

  it('does not use a left border on the main blog content container', () => {
    renderBlog('/blog');

    const mainContent = screen.getByTestId('blog-main-content');
    expect(mainContent).not.toHaveClass('border-l');
    expect(mainContent).not.toHaveClass('border-l-0');
    expect(mainContent).not.toHaveClass('lg:border-l');
  });
});
