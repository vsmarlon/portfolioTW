import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SectionTimeline from './SectionTimeline';

function renderTimeline(pathname: string, scrollY: number, article: DOMRect, footer: DOMRect, runFrameImmediately = true, includeArticle = true) {
  Object.defineProperty(window, 'scrollY', { configurable: true, value: scrollY });
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
    if (runFrameImmediately) callback(0);
    return 1;
  });

  return render(
    <MemoryRouter initialEntries={[pathname]}>
      <SectionTimeline />
      <Routes>
        <Route
          path="/blog/:slug"
          element={
            <>
              {includeArticle ? <article data-blog-article ref={(node) => {
                if (node) vi.spyOn(node, 'getBoundingClientRect').mockReturnValue(article);
              }} /> : <span>article loading</span>}
              <footer
                ref={(node) => {
                  if (node) vi.spyOn(node, 'getBoundingClientRect').mockReturnValue(footer);
                }}
              />
            </>
          }
        />
        <Route path="/blog" element={<span>listing</span>} />
      </Routes>
    </MemoryRouter>
  );
}

const rect = (top: number, bottom: number) => ({ top, bottom } as DOMRect);

afterEach(() => vi.restoreAllMocks());

describe('SectionTimeline', () => {
  it('does not render during the initial lazy state when no article exists', () => {
    const empty = rect(0, 0);
    renderTimeline('/blog/post', 0, empty, empty, true, false);

    expect(screen.queryByTestId('section-timeline')).not.toBeInTheDocument();
  });

  it('stays absent on the listing route and before/after the article', () => {
    const empty = rect(0, 0);
    const { unmount } = renderTimeline('/blog', 0, empty, empty);
    expect(screen.queryByTestId('section-timeline')).not.toBeInTheDocument();
    unmount();

    renderTimeline('/blog/post', 0, rect(900, 1400), rect(1600, 1800));
    expect(screen.queryByTestId('section-timeline')).not.toBeInTheDocument();
    renderTimeline('/blog/post', 1400, rect(-1400, -400), rect(1600, 1800));
    expect(screen.queryByTestId('section-timeline')).not.toBeInTheDocument();
  });

  it('shows clamped progress inside the article, including short geometry', () => {
    renderTimeline('/blog/post', 500, rect(-500, 500), rect(1000, 1200));
    expect(screen.getByTestId('section-timeline')).toBeInTheDocument();
    expect(screen.getByTestId('section-timeline').firstElementChild?.firstElementChild).toHaveStyle({ height: '100%' });
  });

  it('hides when the footer enters the viewport', () => {
    renderTimeline('/blog/post', 500, rect(-500, 900), rect(700, 1000));
    expect(screen.queryByTestId('section-timeline')).not.toBeInTheDocument();
  });

  it('cancels a queued animation frame when unmounted', () => {
    const cancel = vi.spyOn(window, 'cancelAnimationFrame');

    const { unmount } = renderTimeline('/blog/post', 500, rect(-500, 900), rect(1200, 1400), false);
    unmount();

    expect(cancel).toHaveBeenCalledWith(1);
  });
});
