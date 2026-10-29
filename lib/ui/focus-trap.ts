/** What the header menu's focus trap needs to know about an element. */
export interface FocusCandidate {
  getClientRects(): { length: number };
}

/**
 * Keep the elements that are rendered. An element under display: none has no
 * client rects and cannot take focus, so it must never be the first or last
 * stop of a focus trap. In the header menu that is the theme and language row
 * from Tailwind's sm breakpoint up.
 */
export function keepRendered<T extends FocusCandidate>(elements: Iterable<T>): T[] {
  return Array.from(elements).filter((element) => element.getClientRects().length > 0);
}

/**
 * Where a Tab press has to move focus to keep it inside the trap: Tab on the
 * last element goes to the first, Shift+Tab on the first goes to the last.
 * Returns null when the browser's own Tab order already stays inside.
 */
export function tabWrapTarget<T>(focusable: readonly T[], active: unknown, shiftKey: boolean): T | null {
  if (focusable.length === 0) return null;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (shiftKey && active === first) return last;
  if (!shiftKey && active === last) return first;
  return null;
}
