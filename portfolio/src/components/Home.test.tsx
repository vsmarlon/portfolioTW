import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ActiveSectionProvider } from '../contexts/ActiveSectionContext';
import Home from './Home';

const Providers = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <MemoryRouter>
      <ActiveSectionProvider>{children}</ActiveSectionProvider>
    </MemoryRouter>
  </ThemeProvider>
);

describe('Home', () => {
  it('renders the hero name', () => {
    render(<Home />, { wrapper: Providers });
    expect(screen.getByTestId('home-hero-name')).toBeInTheDocument();
  });

  it('renders the availability badge', () => {
    render(<Home />, { wrapper: Providers });
    expect(screen.getByTestId('home-availability-badge')).toBeInTheDocument();
  });

  it('renders the technology section heading', () => {
    render(<Home />, { wrapper: Providers });
    expect(screen.getByTestId('home-tech-section')).toBeInTheDocument();
  });

  it('renders core technology icons', () => {
    render(<Home />, { wrapper: Providers });
    expect(screen.getByRole('img', { name: /HTML5/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /CSS3/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /JavaScript/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Python/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /PostgreSQL/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Redis/i })).toBeInTheDocument();
  });

  it('renders CTA buttons', () => {
    render(<Home />, { wrapper: Providers });
    expect(screen.getByTestId('home-cta-projects')).toBeInTheDocument();
    expect(screen.getByTestId('home-cta-contact')).toBeInTheDocument();
  });
});
