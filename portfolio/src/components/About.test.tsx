import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ActiveSectionProvider } from '../contexts/ActiveSectionContext';
import About from './About';

const Providers = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <MemoryRouter>
      <ActiveSectionProvider>{children}</ActiveSectionProvider>
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
});
