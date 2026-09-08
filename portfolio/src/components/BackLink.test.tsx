import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BackLink from './BackLink';

describe('BackLink', () => {
  it('renders a consistent labeled return link', () => {
    render(
      <MemoryRouter>
        <BackLink to="/#projects">Voltar aos projetos</BackLink>
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', { name: 'Voltar aos projetos' });
    expect(link).toHaveAttribute('href', '/#projects');
  });
});
