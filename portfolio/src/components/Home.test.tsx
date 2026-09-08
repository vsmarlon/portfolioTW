import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ActiveSectionProvider } from '../contexts/ActiveSectionContext';
import Home from './Home';

const Providers = ({ children }: { children: React.ReactNode }) => <ThemeProvider><MemoryRouter><ActiveSectionProvider>{children}</ActiveSectionProvider></MemoryRouter></ThemeProvider>;

describe('Home', () => {
  it('presents the full-stack identity and project CTA without availability claims', () => {
    render(<Home />, { wrapper: Providers });
    expect(screen.getByRole('heading', { name: /Desenvolvedor Full Stack/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ver projetos/i })).toBeInTheDocument();
    expect(screen.queryByText(/Disponível/i)).not.toBeInTheDocument();
  });
});
