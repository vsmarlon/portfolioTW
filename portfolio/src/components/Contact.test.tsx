import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../contexts/ThemeContext';
import Contact from './Contact';

const Providers = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('Contact', () => {
  it('renders the new contact pitch and direct channels', () => {
    render(<Contact />, { wrapper: Providers });

    expect(screen.getByText(/Contato que vira/i)).toBeInTheDocument();
    expect(screen.getByText(/Escolha o melhor ponto de contato/i)).toBeInTheDocument();
    expect(screen.getByText(/Resposta rápida/i)).toBeInTheDocument();
  });
});
