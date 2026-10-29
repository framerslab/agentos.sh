import { describe, it, expect } from 'vitest';
import { revealScrollDelta } from '../reveal-in-scroller';

// The header menu on a 568x320 screen: it starts under the 68px bar and
// scrolls down to the bottom of the screen.
const menu = { top: 68, bottom: 320 };

describe('revealScrollDelta', () => {
  it('scrolls up by the part of an upward list that opened above the menu', () => {
    // Theme list opened upward from the controls at the end of the menu:
    // 224px tall, its top 52px above the menu's top edge.
    expect(revealScrollDelta(menu, { top: 16, bottom: 240 })).toBe(-52);
  });

  it('scrolls down by the part of a list that opened below the menu', () => {
    expect(revealScrollDelta(menu, { top: 200, bottom: 400 })).toBe(80);
  });

  it('does not scroll the top of a list out of view to show its bottom', () => {
    // A list taller than the view: scroll only until its top reaches the top.
    expect(revealScrollDelta({ top: 68, bottom: 160 }, { top: 100, bottom: 300 })).toBe(32);
  });

  it('shows the top of a list taller than the view that starts above it', () => {
    expect(revealScrollDelta({ top: 68, bottom: 160 }, { top: 0, bottom: 400 })).toBe(-68);
  });

  it('does not scroll when the list is already in view', () => {
    expect(revealScrollDelta(menu, { top: 68, bottom: 320 })).toBe(0);
    expect(revealScrollDelta(menu, { top: 100, bottom: 200 })).toBe(0);
  });
});
