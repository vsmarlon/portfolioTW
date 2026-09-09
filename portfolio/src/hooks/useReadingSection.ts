import { useCallback, useRef, useState } from 'react';
import { getScrollOffset } from '../utils/scroll';

export function useReadingSection(): { activeId: string | null; articleRef: (node: HTMLElement | null) => void } {
  const [activeId, setActiveId] = useState<string | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const articleRef = useCallback((node: HTMLElement | null) => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    setActiveId(null);
    if (!node) return;

    let frame: number | null = null;
    const update = () => {
      frame = null;
      const headings = [...node.querySelectorAll<HTMLElement>('h2[id], h3[id], section[id]')];
      if (!headings.length) return;
      const threshold = getScrollOffset() + 24;
      let current = headings[0];
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= threshold) current = heading;
      }
      setActiveId(current.id);
    };
    const scheduleUpdate = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });
    update();
    cleanupRef.current = () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return { activeId, articleRef };
}
