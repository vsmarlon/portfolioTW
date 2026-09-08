const DEFAULT_SCROLL_OFFSET = 104;
const DEFAULT_HASH_SCROLL_TIMEOUT_MS = 5000;
// Fast enough not to annoy, slow enough to read as motion.
const FAST_SCROLL_DURATION_MS = 420;

function getTimestamp() {
  return typeof performance !== 'undefined' ? performance.now() : Date.now();
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

let activeFrame: number | null = null;

function stopActiveScroll() {
  if (activeFrame !== null) {
    cancelAnimationFrame(activeFrame);
    activeFrame = null;
  }
}

function animatedScrollTo(top: number, smooth: boolean) {
  stopActiveScroll();
  const start = window.scrollY;
  const distance = top - start;
  if (!smooth || distance === 0 || prefersReducedMotion()) {
    window.scrollTo({ top, behavior: 'auto' });
    return;
  }

  const startTime = getTimestamp();
  const cancel = () => {
    window.removeEventListener('wheel', cancel);
    window.removeEventListener('touchmove', cancel);
    stopActiveScroll();
  };
  window.addEventListener('wheel', cancel, { passive: true });
  window.addEventListener('touchmove', cancel, { passive: true });

  const step = (now: number) => {
    activeFrame = null;
    const progress = Math.min(1, (now - startTime) / FAST_SCROLL_DURATION_MS);
    window.scrollTo(0, Math.round(start + distance * easeInOutCubic(progress)));
    if (progress < 1) {
      activeFrame = requestAnimationFrame(step);
      return;
    }
    cancel();
  };

  activeFrame = requestAnimationFrame(step);
}

export function scrollToTop({ smooth = true }: { smooth?: boolean } = {}) {
  animatedScrollTo(0, smooth);
}

export function scrollToElementId(id: string, { smooth = true, offset = DEFAULT_SCROLL_OFFSET }: { smooth?: boolean; offset?: number } = {}): boolean {
  const target = document.getElementById(id);
  if (!target) return false;
  const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - offset);
  animatedScrollTo(top, smooth);
  return true;
}

export function scrollToHash(hash: string, options?: { smooth?: boolean; offset?: number }): boolean {
  const normalized = hash.replace(/^#/, '');
  return normalized ? scrollToElementId(normalized, options) : false;
}

export function scheduleHashScroll(hash: string, { smooth = true, offset = DEFAULT_SCROLL_OFFSET, timeoutMs = DEFAULT_HASH_SCROLL_TIMEOUT_MS }: { smooth?: boolean; offset?: number; timeoutMs?: number } = {}) {
  const start = getTimestamp();
  let animationFrameId: number | null = null;
  const tryScroll = () => {
    if (scrollToHash(hash, { smooth, offset })) return;
    if (getTimestamp() - start >= timeoutMs) return;
    animationFrameId = requestAnimationFrame(tryScroll);
  };
  animationFrameId = requestAnimationFrame(tryScroll);
  return () => {
    if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
  };
}
