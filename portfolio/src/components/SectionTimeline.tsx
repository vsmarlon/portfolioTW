import { useState, useEffect } from 'react';

export default function SectionTimeline() {
  const [scrollProgress, setScrollProgress] = useState(-1);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const article = document.querySelector<HTMLElement>('[data-blog-article]');
      if (!article) {
        setScrollProgress(-1);
        return;
      }

      const articleRect = article.getBoundingClientRect();
      const footerRect = document.querySelector('footer')?.getBoundingClientRect();
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

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    schedule();
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  if (scrollProgress < 0) return null;

  return (
    <div
      aria-hidden="true"
      data-testid="section-timeline"
      className="fixed right-4 top-24 bottom-8 z-40 hidden lg:flex flex-col items-center"
    >
      <div className="relative h-full w-0.5 bg-stone-900/15 dark:bg-stone-100/15">
        <div
          className="absolute top-0 left-0 w-full bg-[#a1006b] dark:bg-fuchsia-200"
          style={{
            height: `${scrollProgress * 100}%`,
            transition: 'height 100ms linear',
          }}
        />
      </div>
    </div>
  );
}
