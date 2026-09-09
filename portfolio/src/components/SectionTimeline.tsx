import { useCallback, useRef, useState } from 'react';

export default function SectionTimeline() {
  const [scrollProgress, setScrollProgress] = useState(-1);
  const cleanupRef = useRef<(() => void) | null>(null);
  const rootRef = useCallback((node: HTMLDivElement | null) => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    if (!node) return;

    let disposed = false;
    let frame = 0;
    let article: HTMLElement | null = null;
    let articleObserver: MutationObserver | null = null;
    let resizeObserver: ResizeObserver | null = null;
    const findArticle = () => {
      let parent = node.parentElement;
      while (parent) {
        const found = parent.querySelector<HTMLElement>('[data-blog-article]');
        if (found) return found;
        parent = parent.parentElement;
      }
      return null;
    };
    const update = () => {
      frame = 0;
      article ??= findArticle();
      if (!article) {
        setScrollProgress(-1);
        return;
      }

      const articleRect = article.getBoundingClientRect();
      const footerRect = node.ownerDocument.querySelector('footer')?.getBoundingClientRect();
      const articleTop = articleRect.top + window.scrollY;
      const articleBottom = articleRect.bottom + window.scrollY;
      const insideArticle = articleRect.top < window.innerHeight && articleRect.bottom > 0;
      const footerVisible = Boolean(footerRect && footerRect.bottom > 0 && footerRect.top <= window.innerHeight);

      if (!insideArticle || footerVisible) {
        setScrollProgress(-1);
        return;
      }

      const range = Math.max(1, articleBottom - articleTop - window.innerHeight);
      setScrollProgress(Math.max(0, Math.min(1, (window.scrollY - articleTop) / range)));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const attachArticle = (nextArticle: HTMLElement | null) => {
      article = nextArticle;
      articleObserver?.disconnect();
      articleObserver = null;
      if (article && typeof ResizeObserver !== 'undefined') {
        resizeObserver?.disconnect();
        resizeObserver = new ResizeObserver(schedule);
        resizeObserver.observe(article);
      }
      schedule();
    };

    queueMicrotask(() => {
      if (disposed) return;
      const currentArticle = findArticle();
      if (currentArticle) attachArticle(currentArticle);
    });
    if (!article && node.parentElement) {
      articleObserver = new MutationObserver(() => {
        const nextArticle = findArticle();
        if (nextArticle) attachArticle(nextArticle);
      });
      articleObserver.observe(node.parentElement, { childList: true, subtree: true });
    }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    schedule();
    cleanupRef.current = () => {
      disposed = true;
      articleObserver?.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      data-testid={scrollProgress < 0 ? undefined : 'section-timeline'}
      className={scrollProgress < 0 ? 'contents' : 'fixed right-4 top-24 bottom-8 z-40 hidden lg:flex flex-col items-center'}
    >
      {scrollProgress >= 0 ? (
        <div className="relative h-full w-0.5 bg-stone-900/15 dark:bg-stone-100/15">
          <div
            className="absolute top-0 left-0 w-full bg-[#a1006b] dark:bg-fuchsia-200"
            style={{ height: `${scrollProgress * 100}%`, transition: 'height 100ms linear' }}
          />
        </div>
      ) : null}
    </div>
  );
}
