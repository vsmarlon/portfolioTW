import { useCallback, useRef } from 'react';
import { getDocumentPerformanceMode } from '../utils/performanceMode';

let sharedObserver: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            sharedObserver?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );
  }
  return sharedObserver;
}

export function useScrollReveal() {
  const observedRef = useRef<Set<Element>>(new Set());

  const ref = useCallback((node: HTMLElement | null) => {
    if (node && !observedRef.current.has(node)) {
      if (getDocumentPerformanceMode() === 'reduced') {
        node.classList.add('revealed');
        return;
      }

      observedRef.current.add(node);
      getObserver().observe(node);
    }
  }, []);

  return ref;
}
