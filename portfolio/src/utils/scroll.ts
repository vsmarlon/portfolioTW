import { getDocumentPerformanceMode } from './performanceMode';

const DEFAULT_SCROLL_OFFSET = 104;
const DEFAULT_HASH_SCROLL_TIMEOUT_MS = 5000;
const DEFAULT_SCROLL_RESTORE_TIMEOUT_MS = 5000;

function getTimestamp() {
  return typeof performance !== 'undefined' ? performance.now() : Date.now();
}

function resolveBehavior(smooth: boolean): ScrollBehavior {
  if (!smooth) {
    return 'auto';
  }

  if (
    typeof window !== 'undefined' &&
    (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      getDocumentPerformanceMode() === 'reduced')
  ) {
    return 'auto';
  }

  return 'smooth';
}

export function scrollToTop({ smooth = false }: { smooth?: boolean } = {}) {
  window.scrollTo({ top: 0, behavior: resolveBehavior(smooth) });
}

export function scrollToElementId(
  id: string,
  {
    smooth = false,
    offset = DEFAULT_SCROLL_OFFSET,
  }: { smooth?: boolean; offset?: number } = {},
): boolean {
  const target = document.getElementById(id);

  if (!target) {
    return false;
  }

  const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - offset);
  window.scrollTo({ top, behavior: resolveBehavior(smooth) });
  return true;
}

export function scrollToHash(
  hash: string,
  options?: { smooth?: boolean; offset?: number },
): boolean {
  const normalized = hash.replace(/^#/, '');

  if (!normalized) {
    return false;
  }

  return scrollToElementId(normalized, options);
}

export function scheduleHashScroll(
  hash: string,
  {
    smooth = false,
    offset = DEFAULT_SCROLL_OFFSET,
    timeoutMs = DEFAULT_HASH_SCROLL_TIMEOUT_MS,
  }: { smooth?: boolean; offset?: number; timeoutMs?: number } = {},
) {
  const start = getTimestamp();
  let animationFrameId: number | null = null;

  const tryScroll = () => {
    if (scrollToHash(hash, { smooth, offset })) {
      return;
    }

    const now = getTimestamp();

    if (now - start >= timeoutMs) {
      return;
    }

    animationFrameId = requestAnimationFrame(tryScroll);
  };

  animationFrameId = requestAnimationFrame(tryScroll);

  return () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
    }
  };
}

export function scheduleScrollToPosition(
  top: number,
  {
    smooth = false,
    timeoutMs = DEFAULT_SCROLL_RESTORE_TIMEOUT_MS,
  }: { smooth?: boolean; timeoutMs?: number } = {},
) {
  const targetTop = Math.max(0, top);
  const start = getTimestamp();
  let animationFrameId: number | null = null;

  const tryScroll = () => {
    const maxScrollableTop = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const destination = Math.min(targetTop, maxScrollableTop);
    window.scrollTo({ top: destination, behavior: resolveBehavior(smooth) });

    const now = getTimestamp();
    const reachedTarget = Math.abs(window.scrollY - targetTop) <= 1 && maxScrollableTop >= targetTop;

    if (reachedTarget || now - start >= timeoutMs) {
      return;
    }

    animationFrameId = requestAnimationFrame(tryScroll);
  };

  animationFrameId = requestAnimationFrame(tryScroll);

  return () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
    }
  };
}
