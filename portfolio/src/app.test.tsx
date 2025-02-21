import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from './app';

describe('App routing', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('renders the 404 page for unknown routes', async () => {
    window.history.pushState({}, '', '/rota-inexistente');

    render(<App />);

    expect(await screen.findByText(/Essa rota saiu do mapa/i)).toBeInTheDocument();
    expect(screen.getByText(/Erro 404/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Voltar para o inicio/i })).toBeInTheDocument();
  });
});
