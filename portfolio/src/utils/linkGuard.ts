// Cards across the portfolio are links. Without this guard, selecting text
// inside one of them navigates away on mouse-up, which nobody asked for.
// A click that lands inside an active text selection is treated as selection,
// not navigation. Plain clicks behave exactly as before.
export function installLinkGuard(): () => void {
  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0) return;
    const target = event.target as Element | null;
    const link = target?.closest?.('a[href]');
    if (!link || !(link instanceof HTMLAnchorElement)) return;

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;
    const anchor = selection.anchorNode;
    const anchorElement = anchor instanceof Element ? anchor : anchor?.parentElement ?? null;
    if (anchorElement && link.contains(anchorElement)) {
      // preventDefault alone cancels navigation (React Router respects it);
      // the click itself keeps propagating so app handlers stay consistent.
      event.preventDefault();
    }
  };

  document.addEventListener('click', onClick, true);
  return () => document.removeEventListener('click', onClick, true);
}
