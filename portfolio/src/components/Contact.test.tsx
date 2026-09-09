import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { LocaleProvider } from '../contexts/LocaleContext';
import Contact from './Contact';

const Providers = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider><LocaleProvider>{children}</LocaleProvider></ThemeProvider>
);

describe('Contact', () => {
  it('renders the new contact pitch and direct channels', () => {
    render(<Contact />, { wrapper: Providers });

    expect(screen.getByText(/Direto ao ponto/i)).toBeInTheDocument();
    expect(screen.getByText(/Escolha o melhor ponto de contato/i)).toBeInTheDocument();
    expect(screen.getByText(/Resposta rápida/i)).toBeInTheDocument();
    expect(screen.getByText(/Como trabalho/i)).toBeInTheDocument();
    expect(screen.getAllByText('(abre em nova aba)')).toHaveLength(2);
  });
});
