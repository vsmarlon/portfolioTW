import { useCallback, useEffect, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent } from 'react';

const SIDEBAR_WIDTH_STORAGE_KEY = 'portfolio.blog.sidebarWidth';
const SIDEBAR_DEFAULT_WIDTH = 320;
const SIDEBAR_MIN_WIDTH = 260;
const SIDEBAR_MAX_WIDTH = 460;
const SIDEBAR_KEYBOARD_STEP = 12;

function clampSidebarWidth(width: number) {
  return Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, width));
}

interface BlogSidebarResizeState {
  sidebarWidth: number;
  sidebarMinWidth: number;
  sidebarMaxWidth: number;
  handleResizeMouseDown: (event: ReactMouseEvent<HTMLButtonElement>) => void;
  handleResizeKeyDown: (event: ReactKeyboardEvent<HTMLButtonElement>) => void;
}

export function useBlogSidebarResize(): BlogSidebarResizeState {
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH);

  useEffect(() => {
    const persistedWidth = window.localStorage.getItem(SIDEBAR_WIDTH_STORAGE_KEY);

    if (!persistedWidth) {
      return;
    }

    const parsedWidth = Number.parseFloat(persistedWidth);

    if (!Number.isFinite(parsedWidth)) {
      return;
    }

    setSidebarWidth(clampSidebarWidth(parsedWidth));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_WIDTH_STORAGE_KEY, String(sidebarWidth));
  }, [sidebarWidth]);

  useEffect(
    () => () => {
      document.body.style.removeProperty('cursor');
      document.body.style.removeProperty('user-select');
    },
    [],
  );

  const resizeSidebar = useCallback((nextWidth: number) => {
    setSidebarWidth(clampSidebarWidth(nextWidth));
  }, []);

  const handleResizeMouseDown = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement>) => {
      if (event.button !== 0) {
        return;
      }

      event.preventDefault();
      const startX = event.clientX;
      const startWidth = sidebarWidth;

      const handleMouseMove = (mouseEvent: MouseEvent) => {
        const delta = mouseEvent.clientX - startX;
        resizeSidebar(startWidth + delta);
      };

      const stopResizing = () => {
        document.body.style.removeProperty('cursor');
        document.body.style.removeProperty('user-select');
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      const handleMouseUp = () => {
        stopResizing();
      };

      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp, { once: true });
    },
    [resizeSidebar, sidebarWidth],
  );

  const handleResizeKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        resizeSidebar(sidebarWidth - SIDEBAR_KEYBOARD_STEP);
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        resizeSidebar(sidebarWidth + SIDEBAR_KEYBOARD_STEP);
      }
    },
    [resizeSidebar, sidebarWidth],
  );

  return {
    sidebarWidth,
    sidebarMinWidth: SIDEBAR_MIN_WIDTH,
    sidebarMaxWidth: SIDEBAR_MAX_WIDTH,
    handleResizeMouseDown,
    handleResizeKeyDown,
  };
}
