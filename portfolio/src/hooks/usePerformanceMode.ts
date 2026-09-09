import { useCallback, useSyncExternalStore } from 'react';
import { detectPerformanceMode, type PerformanceMode } from '../utils/performanceMode';

function subscribeToPerformanceMode(onChange: () => void) {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  mediaQuery.addEventListener('change', onChange);
  return () => mediaQuery.removeEventListener('change', onChange);
}

export function usePerformanceMode() {
  const mode = useSyncExternalStore(subscribeToPerformanceMode, detectPerformanceMode, () => 'normal' as PerformanceMode);
  const performanceRootRef = useCallback((node: HTMLElement | null) => {
    if (node) node.ownerDocument.documentElement.setAttribute('data-performance-mode', mode);
  }, [mode]);

  return { mode, performanceRootRef };
}
