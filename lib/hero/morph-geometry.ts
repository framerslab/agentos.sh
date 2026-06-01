/**
 * Horizontal offset (px) to apply via CSS transform to the inline word that
 * follows a ParticleMorphText wrapper. The wrapper is pinned to the wider of
 * the two morph words so its box never reflows (zero CLS). When the active
 * (currently shown) word is narrower, the trailing word is pulled left by the
 * difference, reproducing the original width-driven slide without a layout
 * shift. Returns <= 0. Out-of-range index => 0 (no slide).
 */
export function slideOffsetPx(wordWidths: [number, number], activeIndex: number): number {
  const active = wordWidths[activeIndex];
  if (typeof active !== 'number') return 0;
  const max = Math.max(wordWidths[0], wordWidths[1]);
  return active - max; // <= 0
}
