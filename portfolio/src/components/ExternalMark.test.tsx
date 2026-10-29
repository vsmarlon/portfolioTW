import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import ExternalMark from './ExternalMark';

describe('ExternalMark', () => {
  it('renders a decorative glyph plus screen-reader text', () => {
    const { container } = render(<ExternalMark />);

    expect(container.querySelector('svg[aria-hidden="true"]')).toBeInTheDocument();
    expect(container.querySelector('svg')).toHaveClass('inline-block');
    expect(screen.getByText('(abre em nova aba)')).toBeInTheDocument();
  });
});
