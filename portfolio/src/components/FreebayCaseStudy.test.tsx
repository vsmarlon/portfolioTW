import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import FreebayCaseStudy from './FreebayCaseStudy';

const renderCase = () =>
  render(
    <ThemeProvider>
      <MemoryRouter>
        <FreebayCaseStudy />
      </MemoryRouter>
    </ThemeProvider>,
  );

describe('FreebayCaseStudy', () => {
  it('presents the formal study structure without invented claims', () => {
    renderCase();

    expect(screen.getByRole('heading', { name: 'Freebay' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'O problema em uma página' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Escolhas registradas, não preferências' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'O que este estudo não afirma' })).toBeInTheDocument();
    expect(screen.getByText(/sem métricas inventadas/i)).toBeInTheDocument();
  });

  it('reuses the blog reading shell with sidebar, resizer and tracked article', () => {
    renderCase();

    expect(screen.getByTestId('case-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('case-sidebar-resizer')).toHaveAttribute('aria-valuenow', '320');
    expect(screen.getByTestId('case-article')).toHaveAttribute('data-blog-article');
    expect(screen.getAllByRole('navigation', { name: 'Neste estudo' })).toHaveLength(2);
  });

  it('switches the interactive flow without effects', () => {
    renderCase();

    expect(screen.getAllByText(/Cliente pede feed\/busca/)).not.toHaveLength(0);
    fireEvent.click(screen.getByRole('button', { name: 'Compra' }));
    expect(screen.getByRole('button', { name: 'Compra' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getAllByText(/Pagamento único com rastreio por pedido/)).not.toHaveLength(0);
    expect(FreebayCaseStudy.toString()).not.toMatch(/useEffect/);
  });
});
