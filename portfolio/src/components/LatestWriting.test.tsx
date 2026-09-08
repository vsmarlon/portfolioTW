import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LatestWriting from './LatestWriting';
import { blogPosts } from '../data/blogPosts';

describe('LatestWriting', () => {
  it('renders the three newest parsed posts in published-date order', () => {
    render(
      <MemoryRouter>
        <LatestWriting />
      </MemoryRouter>,
    );

    const links = screen.getAllByRole('link').filter((link) => link.getAttribute('href')?.startsWith('/blog/'));
    expect(links).toHaveLength(3);
    expect(links.map((link) => link.textContent)).toEqual(blogPosts.slice(0, 3).map((post) => expect.stringContaining(post.title)));
  });
});
