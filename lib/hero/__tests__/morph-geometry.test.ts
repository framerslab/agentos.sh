import { describe, it, expect } from 'vitest';
import { slideOffsetPx } from '../morph-geometry';

describe('slideOffsetPx', () => {
  const widths: [number, number] = [120, 80]; // 'Emergent'=120, 'Adaptive'=80

  it('returns 0 when the active word is the widest (wrapper already snug)', () => {
    expect(slideOffsetPx(widths, 0)).toBe(0); // active=120 == max
  });
  it('returns negative offset to pull trailing text left when active word is narrower', () => {
    expect(slideOffsetPx(widths, 1)).toBe(-40); // 80 - max(120) = -40
  });
  it('is 0 when both words are equal', () => {
    expect(slideOffsetPx([100, 100], 1)).toBe(0);
  });
  it('handles a missing/garbage active index by treating offset as 0', () => {
    expect(slideOffsetPx(widths, 5)).toBe(0);
  });
});
