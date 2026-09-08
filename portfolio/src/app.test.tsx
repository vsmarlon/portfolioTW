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

  it('keeps the redesigned home sections in order without the removed terminal', () => {
    render(<App />);

    expect([...document.querySelectorAll('main > section')].map((section) => section.id)).toEqual([
      'home',
      'projects',
      'systems',
      'about',
      'writing',
      'contact',
    ]);
    expect(screen.queryByText(/Terminal/i)).not.toBeInTheDocument();
  });

  it('renders Freebay through the shared shell route', async () => {
    window.history.pushState({}, '', '/projects/freebay');

    render(<App />);

    expect(await screen.findByRole('heading', { name: 'Freebay' })).toBeInTheDocument();
    expect(screen.getAllByRole('banner')).toHaveLength(2);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Arquitetura do Freebay' })).toBeInTheDocument();
  });
});
