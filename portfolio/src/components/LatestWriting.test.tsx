import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LatestWriting from './LatestWriting';
import { getBlogHighlights } from '../data/blogHighlights';
import { LocaleProvider } from '../contexts/LocaleContext';

describe('LatestWriting', () => {
  it('renders the three newest parsed posts in published-date order', () => {
    render(
      <LocaleProvider>
        <MemoryRouter>
          <LatestWriting />
        </MemoryRouter>
      </LocaleProvider>,
    );

    const links = screen.getAllByRole('link').filter((link) => link.getAttribute('href')?.startsWith('/blog/'));
    expect(links).toHaveLength(3);
    getBlogHighlights('pt-BR').forEach((post, index) => {
      expect(links[index]).toHaveTextContent(post.title);
      expect(links[index]).toHaveTextContent(post.category);
      expect(links[index]).toHaveTextContent(post.excerpt);
      expect(links[index]).toHaveTextContent(post.formattedDate);
    });
  });
});
