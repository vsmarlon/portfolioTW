import type { ReactNode } from 'react';
import { useBlogSidebarResize } from '../hooks/useBlogSidebarResize';

interface ReadingShellProps {
  sidebar: ReactNode;
  sidebarTestId: string;
  resizerTestId: string;
  children: ReactNode;
}

const ReadingShell = ({ sidebar, sidebarTestId, resizerTestId, children }: ReadingShellProps) => {
  const {
    sidebarWidth,
    sidebarMinWidth,
    sidebarMaxWidth,
    handleResizeMouseDown,
    handleResizeKeyDown,
  } = useBlogSidebarResize();

  return (
    <div className="mt-10 flex min-h-[calc(100vh-5rem)] flex-col gap-6 lg:flex-row lg:items-start lg:gap-0">
      <aside
        data-testid={sidebarTestId}
        className="hidden lg:block lg:shrink-0 lg:sticky lg:top-28"
        style={{ width: `${sidebarWidth}px` }}
      >
        {sidebar}
      </aside>

      <button
        type="button"
        role="separator"
        aria-label="Redimensionar navegação lateral"
        aria-orientation="vertical"
        aria-valuemin={sidebarMinWidth}
        aria-valuemax={sidebarMaxWidth}
        aria-valuenow={Math.round(sidebarWidth)}
        onMouseDown={handleResizeMouseDown}
        onKeyDown={handleResizeKeyDown}
        data-testid={resizerTestId}
        className="group hidden w-10 shrink-0 cursor-col-resize touch-none select-none items-stretch justify-center lg:flex lg:self-stretch focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf6ef] dark:focus-visible:ring-offset-[#131110]"
      >
        <span className="ui-sidebar-rail h-full w-px transition-colors" />
      </button>

      {children}
    </div>
  );
};

export default ReadingShell;
