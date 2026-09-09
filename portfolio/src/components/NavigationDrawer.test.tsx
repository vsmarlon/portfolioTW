import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ActiveSectionProvider } from '../contexts/ActiveSectionContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { LocaleProvider } from '../contexts/LocaleContext';
import NavigationDrawer from './NavigationDrawer';

const Providers = ({ children, initialEntries = ['/'] }: { children: React.ReactNode; initialEntries?: string[] }) => (
  <ThemeProvider>
    <LocaleProvider><MemoryRouter initialEntries={initialEntries}>
      <ActiveSectionProvider>{children}</ActiveSectionProvider>
    </MemoryRouter></LocaleProvider>
  </ThemeProvider>
);

describe('NavigationDrawer', () => {
  const swipe = (dialog: HTMLDialogElement, start: [number, number], end: [number, number]) => {
    for (const [type, [clientX, clientY]] of [['pointerdown', start], ['pointerup', end]] as const) {
      const event = new Event(type, { bubbles: true });
      Object.defineProperties(event, { clientX: { value: clientX }, clientY: { value: clientY } });
      dialog.dispatchEvent(event);
    }
  };

  it('opens a modal drawer with the expected accessible state', () => {
    render(<NavigationDrawer />, { wrapper: Providers });

    const trigger = screen.getByRole('button', { name: 'Abrir navegação' });
    const dialog = document.querySelector<HTMLDialogElement>('#site-navigation');
    expect(dialog).not.toBeNull();
    if (!dialog) throw new Error('Navigation dialog was not rendered');

    expect(trigger).toHaveAttribute('aria-controls', 'site-navigation');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(dialog?.open).toBe(false);

    fireEvent.click(trigger);

    expect(dialog?.open).toBe(true);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'Início' })).toHaveAttribute('aria-current', 'location');
    expect(screen.getByRole('link', { name: 'Blog' })).not.toHaveAttribute('aria-current');
  });

  it('uses page semantics for the active Blog route', () => {
    render(<NavigationDrawer />, { wrapper: ({ children }) => <Providers initialEntries={['/blog']}>{children}</Providers> });
    fireEvent.click(screen.getByRole('button', { name: 'Abrir navegação' }));

    expect(screen.getByRole('link', { name: 'Blog' })).toHaveAttribute('aria-current', 'page');
  });

  it.each([
    ['the close button', () => fireEvent.click(screen.getByRole('button', { name: 'Fechar navegação' }))],
    ['Escape', () => fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })],
    ['the backdrop', () => fireEvent.click(screen.getByRole('dialog'))],
  ])('closes and restores focus after %s', (_, closeDrawer) => {
    render(<NavigationDrawer />, { wrapper: Providers });
    const trigger = screen.getByRole('button', { name: 'Abrir navegação' });
    fireEvent.click(trigger);

    closeDrawer();

    expect(document.querySelector<HTMLDialogElement>('#site-navigation')?.open).toBe(false);
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes on a horizontal swipe but keeps vertical swipes available for scrolling', () => {
    render(<NavigationDrawer />, { wrapper: Providers });
    const trigger = screen.getByRole('button', { name: 'Abrir navegação' });
    fireEvent.click(trigger);
    const dialog = document.querySelector<HTMLDialogElement>('#site-navigation');
    expect(dialog).not.toBeNull();
    if (!dialog) throw new Error('Navigation dialog was not rendered');

    swipe(dialog, [100, 100], [180, 180]);
    expect(dialog?.open).toBe(true);

    swipe(dialog, [100, 100], [180, 120]);
    expect(dialog?.open).toBe(false);
  });
});
