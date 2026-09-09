const DEFAULT_SCROLL_OFFSET = 96;
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
let cancelActiveScroll: (() => void) | null = null;

function stopActiveScroll() {
  cancelActiveScroll?.();
  cancelActiveScroll = null;
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
    window.scrollTo({ top, behavior: 'instant' });
    return;
  }

  const startTime = getTimestamp();
  let cancelled = false;
  const cancel = () => {
    if (cancelled) return;
    cancelled = true;
    window.removeEventListener('wheel', cancel);
    window.removeEventListener('touchmove', cancel);
    if (activeFrame !== null) {
      cancelAnimationFrame(activeFrame);
      activeFrame = null;
    }
  };
  cancelActiveScroll = cancel;
  window.addEventListener('wheel', cancel, { passive: true });
  window.addEventListener('touchmove', cancel, { passive: true });

  const step = (now: number) => {
    activeFrame = null;
    if (cancelled) return;
    const progress = Math.min(1, (now - startTime) / FAST_SCROLL_DURATION_MS);
    // CSS smooth scrolling must not animate each frame a second time.
    window.scrollTo({ top: Math.round(start + distance * easeInOutCubic(progress)), behavior: 'instant' });
    if (progress < 1) {
      activeFrame = requestAnimationFrame(step);
      return;
    }
    cancel();
    cancelActiveScroll = null;
  };

  activeFrame = requestAnimationFrame(step);
}

export function scrollToTop({ smooth = true }: { smooth?: boolean } = {}) {
  animatedScrollTo(0, smooth);
}

export function getScrollOffset(): number {
  const header = document.querySelector<HTMLElement>('header.fixed');
  const headerHeight = header?.getBoundingClientRect().height ?? 0;
  if (headerHeight > 0) return Math.ceil(headerHeight + 16);

  const cssOffset = getComputedStyle(document.documentElement).getPropertyValue('--scroll-header-offset').trim();
  const parsedOffset = Number.parseFloat(cssOffset);
  return Number.isFinite(parsedOffset) ? parsedOffset : DEFAULT_SCROLL_OFFSET;
}

export function scrollToElementId(id: string, { smooth = true, offset = getScrollOffset() }: { smooth?: boolean; offset?: number } = {}): boolean {
  const target = document.getElementById(id);
  if (!target) return false;
  const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - offset);
  animatedScrollTo(top, smooth);
  return true;
}

export function scrollToHash(hash: string, options?: { smooth?: boolean; offset?: number; root?: ParentNode }): boolean {
  const normalized = hash.replace(/^#/, '');
  const target = normalized && options?.root
    ? [...options.root.querySelectorAll<HTMLElement>('[id]')].find((element) => element.id === normalized) ?? null
    : null;
  if (target) {
    const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - (options?.offset ?? getScrollOffset()));
    animatedScrollTo(top, options?.smooth ?? true);
    return true;
  }
  return normalized && !options?.root ? scrollToElementId(normalized, options) : false;
}

export function scheduleHashScroll(hash: string, { smooth = true, offset, timeoutMs = DEFAULT_HASH_SCROLL_TIMEOUT_MS, root }: { smooth?: boolean; offset?: number; timeoutMs?: number; root?: ParentNode } = {}) {
  const start = getTimestamp();
  let animationFrameId: number | null = null;
  let rootObserver: MutationObserver | null = null;
  let finished = false;
  let cancelScroll: (() => void) | null = null;
  const cleanup = () => {
    finished = true;
    rootObserver?.disconnect();
    rootObserver = null;
    if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  };
  const tryScroll = () => {
    animationFrameId = null;
    if (finished) return;
    if (scrollToHash(hash, { smooth, offset, root })) {
      cancelScroll = cancelActiveScroll;
      cleanup();
      return;
    }
    if (getTimestamp() - start >= timeoutMs) {
      cleanup();
      return;
    }
    animationFrameId = requestAnimationFrame(tryScroll);
  };
  if (root && typeof MutationObserver !== 'undefined') {
    rootObserver = new MutationObserver(() => {
      if (animationFrameId === null) tryScroll();
    });
    rootObserver.observe(root, { childList: true, subtree: true });
  }
  animationFrameId = requestAnimationFrame(tryScroll);
  return () => {
    cleanup();
    cancelScroll?.();
  };
}
