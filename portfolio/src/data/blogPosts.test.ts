import { describe, expect, it } from 'vitest';
import { blogPosts } from './blogPosts';
import { getReadingTime } from '../utils/readingTime';

describe('blog post reading time', () => {
  it('derives every imported post value from its body', () => {
    expect(blogPosts.length).toBeGreaterThan(0);
    expect(blogPosts.every((post) => post.readTime === getReadingTime(post.body))).toBe(true);
    expect(blogPosts.every((post) => post.body.trim().split(/\s+/).length >= 1200)).toBe(true);
  });

  it('imports the six restored articles with a single featured and demo marker', () => {
    expect(blogPosts.map((post) => post.slug).sort()).toEqual([
      'freebay-product-architecture',
      'full-stack-architecture-evidence',
      'github-data-grid-case-study',
      'postgresql-oracle-data-decisions',
      'react-cleanup-before-optimization',
      'react-portfolio-identity',
    ]);
    expect(blogPosts.filter((post) => post.featured)).toHaveLength(1);
    expect(blogPosts.filter((post) => post.hasDemo)).toHaveLength(1);
  });
});
