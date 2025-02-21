export type PerformanceMode = 'normal' | 'reduced';

const FIREFOX_PATTERN = /firefox/i;
const PERFORMANCE_MODE_ATTRIBUTE = 'data-performance-mode';

export function detectPerformanceMode(): PerformanceMode {
  if (typeof window === 'undefined') {
    return 'normal';
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return 'reduced';
  }

  const isFirefox = FIREFOX_PATTERN.test(window.navigator.userAgent);
  return isFirefox ? 'reduced' : 'normal';
}

export function getDocumentPerformanceMode(): PerformanceMode {
  if (typeof document === 'undefined') {
    return 'normal';
  }

  return document.documentElement.getAttribute(PERFORMANCE_MODE_ATTRIBUTE) === 'reduced'
    ? 'reduced'
    : 'normal';
}

export function applyPerformanceMode(mode: PerformanceMode) {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.setAttribute(PERFORMANCE_MODE_ATTRIBUTE, mode);
}

