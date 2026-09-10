import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ActiveSectionProvider } from '../contexts/ActiveSectionContext';
import { LocaleProvider } from '../contexts/LocaleContext';
import About from './About';

const Providers = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <MemoryRouter>
      <LocaleProvider>
        <ActiveSectionProvider>{children}</ActiveSectionProvider>
      </LocaleProvider>
    </MemoryRouter>
  </ThemeProvider>
);

describe('About', () => {
  it('renders current focus, timeline, and skills sections together', () => {
    render(<About />, { wrapper: Providers });

    expect(screen.getByTestId('about-current-focus')).toBeInTheDocument();
    expect(screen.getByTestId('about-experience')).toBeInTheDocument();
    expect(screen.getByTestId('about-skills')).toBeInTheDocument();
  });

  it.each([
    ['en', 'Software Engineering Intern · QQTech', 'Unisinos'],
    ['pt-BR', 'Estagiário de Engenharia de Software · QQTech', 'Unisinos'],
  ] as const)('renders localized timeline and focus copy for %s', (locale, timelineTitle, location) => {
    window.localStorage.setItem('locale', locale);
    render(<About />, { wrapper: Providers });

    expect(screen.getByText(timelineTitle)).toBeInTheDocument();
    expect(screen.getByText(location)).toBeInTheDocument();
    expect(screen.queryByText(/about\.(timeline|focus)\./)).not.toBeInTheDocument();
  });

  it('routes to the localized resume in the same tab without downloading it', () => {
    window.localStorage.setItem('locale', 'en');
    render(<About />, { wrapper: Providers });

    const resumeLink = screen.getByRole('link', { name: /view resume/i });
    expect(resumeLink).toHaveAttribute('href', '/cv/en');

    expect(resumeLink).not.toHaveAttribute('target');
    expect(resumeLink).not.toHaveAttribute('download');
  });
});
