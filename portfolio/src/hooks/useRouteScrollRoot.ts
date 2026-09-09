import { useCallback, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { scheduleHashScroll, scrollToTop } from '../utils/scroll';

export function useRouteScrollRoot() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const cleanupRef = useRef<(() => void) | null>(null);

  return useCallback((node: HTMLElement | null) => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    if (!node || navigationType === 'REPLACE') return;

    if (location.hash) {
      cleanupRef.current = scheduleHashScroll(location.hash, { root: node });
    } else if (navigationType !== 'POP') {
      scrollToTop();
    }
  }, [location, navigationType]);
}
