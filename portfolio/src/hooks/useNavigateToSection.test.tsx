import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useNavigateToSection } from './useNavigateToSection';
import type { ReactNode } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => (
  <MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>
);

describe('useNavigateToSection', () => {
  it('returns a function', () => {
    const { result } = renderHook(() => useNavigateToSection(), { wrapper });
    expect(typeof result.current).toBe('function');
  });

  it('scrolls to the target section with a header offset for same-page hash navigation', () => {
    const { result } = renderHook(() => useNavigateToSection(), { wrapper });
    const mockScrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    const mockEl = {
      getBoundingClientRect: () => ({ top: 280 }),
    };

    vi.spyOn(document, 'getElementById').mockReturnValue(mockEl as unknown as HTMLElement);

    const mockEvent = { preventDefault: vi.fn() } as unknown as React.MouseEvent<HTMLAnchorElement>;
    result.current(mockEvent, '/#sobre');

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockScrollTo).toHaveBeenCalledWith({ top: 176, behavior: 'smooth' });
  });

  it('scrolls to the top for same-page root navigation', () => {
    const { result } = renderHook(() => useNavigateToSection(), { wrapper });
    const mockScrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

    const mockEvent = { preventDefault: vi.fn() } as unknown as React.MouseEvent<HTMLAnchorElement>;
    result.current(mockEvent, '/');

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockScrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
