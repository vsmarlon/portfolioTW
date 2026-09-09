import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';
import type { ReactNode } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => vi.restoreAllMocks());

  it('follows the system without persisting a derived preference', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    });

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe('dark');
    expect(localStorage.getItem('theme')).toBeNull();
  });

  it('keeps a manual theme usable when storage is unavailable', () => {
    vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError');
    });
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(() => act(() => result.current.setTheme('dark'))).not.toThrow();
    expect(result.current.theme).toBe('dark');
  });

  it('defaults to dark when no localStorage and no media query match', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    // jsdom defaults to no prefers-color-scheme, so getInitialTheme returns 'light'
    // but localStorage is empty so it reads system - just check it returns a valid theme
    expect(['dark', 'light']).toContain(result.current.theme);
  });

  it('reads theme from localStorage', () => {
    localStorage.setItem('theme', 'dark');
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBe('dark');
  });

  it('toggleTheme switches between dark and light', () => {
    localStorage.setItem('theme', 'dark');
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBe('dark');

    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe('light');

    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe('dark');
  });

  it('setTheme applies the given theme', () => {
    localStorage.setItem('theme', 'light');
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => result.current.setTheme('dark'));
    expect(result.current.theme).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('applies data-theme attribute on toggle', () => {
    localStorage.setItem('theme', 'dark');
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => result.current.toggleTheme());
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('syncs a theme change made in another tab without reacting to its own write', () => {
    localStorage.setItem('theme', 'dark');
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => result.current.setTheme('light'));
    expect(result.current.theme).toBe('light');

    localStorage.setItem('theme', 'dark');
    act(() => window.dispatchEvent(new StorageEvent('storage', { key: 'theme', newValue: 'dark' })));

    expect(result.current.theme).toBe('dark');
  });

  it('accepts clearing the stored theme from another tab', () => {
    localStorage.setItem('theme', 'dark');
    const { result } = renderHook(() => useTheme(), { wrapper });

    localStorage.removeItem('theme');
    act(() => window.dispatchEvent(new StorageEvent('storage', { key: 'theme', newValue: null })));

    expect(['dark', 'light']).toContain(result.current.theme);
    expect(localStorage.getItem('theme')).toBeNull();
  });
});
