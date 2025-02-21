import { useEffect, useState } from 'react';
import {
  applyPerformanceMode,
  detectPerformanceMode,
  type PerformanceMode,
} from '../utils/performanceMode';

export function usePerformanceMode() {
  const [mode, setMode] = useState<PerformanceMode>(() => detectPerformanceMode());

  useEffect(() => {
    applyPerformanceMode(mode);
  }, [mode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMode = () => {
      setMode(detectPerformanceMode());
    };

    mediaQuery.addEventListener('change', updateMode);
    window.addEventListener('resize', updateMode, { passive: true });

    return () => {
      mediaQuery.removeEventListener('change', updateMode);
      window.removeEventListener('resize', updateMode);
    };
  }, []);

  return mode;
}

