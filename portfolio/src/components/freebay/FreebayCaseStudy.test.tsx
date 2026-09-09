import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LocaleProvider } from '../../contexts/LocaleContext';
import { ThemeProvider } from '../../contexts/ThemeContext';
import FreebayCaseStudy from './FreebayCaseStudy';
import Header from '../Header';


const renderCase = () =>
  render(
    <ThemeProvider>
      <LocaleProvider><MemoryRouter><FreebayCaseStudy /></MemoryRouter></LocaleProvider>
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

  it('switches the complete case study to English without mixed copy', () => {
    render(
      <ThemeProvider>
        <LocaleProvider>
          <MemoryRouter>
            <Header />
            <FreebayCaseStudy />
          </MemoryRouter>
        </LocaleProvider>
      </ThemeProvider>,
    );

    fireEvent.change(screen.getByRole('combobox', { name: 'Idioma' }), { target: { value: 'en' } });

    expect(screen.getByText('Non-functional requirements: resource authorization, idempotent webhooks, money transitions recorded in an immutable ledger, and no capability marked ready before concurrency and replay testing.')).toBeInTheDocument();
    expect(screen.getByText('Local transactions and consistency while the domain is still moving; extract when a boundary stabilizes.')).toBeInTheDocument();
    expect(screen.getByText('DTO input validation at every HTTP boundary; the backend is authoritative for price, inventory, and order state.')).toBeInTheDocument();
    expect(screen.getByText('Webhook replay without duplicate debit or credit.')).toBeInTheDocument();
    expect(screen.getByText('There are no production metrics because there is no production: payouts, disputes, and one-time media remain in hardening, the web client is under construction, and domains still need to be acquired. The next steps, in this order and without shortcuts: complete the financial ledger with concurrency tests, close private-media authorization, build the web marketplace on the same contracts, and publish only then.')).toBeInTheDocument();
    expect(screen.getByText('The main result is a presentable full-stack foundation: the product can be read through its experience and through the structure that makes it possible, without invented metrics or promises beyond the evidence.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Analysis of architectural decisions' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Implementation evidence' })).toBeInTheDocument();
    expect(screen.getByAltText('Freebay product detail')).toBeInTheDocument();
    expect(screen.queryByText(/não há métricas|requisitos não funcionais|sem débito/i)).not.toBeInTheDocument();
  });
});
