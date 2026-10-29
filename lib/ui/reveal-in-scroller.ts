/** The top and bottom edges of a box, in viewport pixels. */
export interface VerticalEdges {
  top: number;
  bottom: number;
}

/**
 * How far a scroll container has to scroll (positive is down) so that a box
 * inside it is fully in view. When the box is taller than the view, its top
 * edge wins, so the start of a list is what shows.
 */
export function revealScrollDelta(view: VerticalEdges, box: VerticalEdges): number {
  if (box.top < view.top) return box.top - view.top;
  if (box.bottom > view.bottom) return Math.min(box.bottom - view.bottom, box.top - view.top);
  return 0;
}

/**
 * Scroll the nearest ancestor of `element` that scrolls vertically and has
 * something to scroll, so that `element` is fully in view. The header menu
 * is such an ancestor on a screen 20rem tall or less. Ancestors from <body>
 * up are never scrolled, so a dropdown in the page header never moves the
 * page.
 */
export function revealInScrollingAncestor(element: HTMLElement): void {
  for (let node = element.parentElement; node && node !== document.body; node = node.parentElement) {
    const { overflowY } = window.getComputedStyle(node);
    if ((overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight) {
      const top = node.getBoundingClientRect().top + node.clientTop;
      const delta = revealScrollDelta({ top, bottom: top + node.clientHeight }, element.getBoundingClientRect());
      if (delta !== 0) node.scrollTop += delta;
      return;
    }
  }
}
