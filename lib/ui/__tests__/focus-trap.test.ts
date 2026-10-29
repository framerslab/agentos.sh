import { describe, it, expect } from 'vitest';
import { keepRendered, tabWrapTarget } from '../focus-trap';

const element = (name: string, shown: boolean) => ({
  name,
  getClientRects: () => ({ length: shown ? 1 : 0 }),
});

// The header menu from Tailwind's sm breakpoint up: the links are shown and
// the theme and language row (display: none) is not.
const menu = () => [
  element('Features', true),
  element('GMIs', true),
  element('GitHub', true),
  element('Mode', false),
  element('Theme', false),
  element('Language', false),
];

describe('keepRendered', () => {
  it('drops the elements that have no client rects', () => {
    expect(keepRendered(menu()).map((e) => e.name)).toEqual(['Features', 'GMIs', 'GitHub']);
  });

  it('keeps every element when all are shown', () => {
    const all = [element('Features', true), element('Language', true)];
    expect(keepRendered(all)).toEqual(all);
  });
});

describe('tabWrapTarget', () => {
  it('sends Tab on the last shown link back to the first link, not on to a hidden control', () => {
    const focusable = keepRendered(menu());
    expect(tabWrapTarget(focusable, focusable[2], false)).toBe(focusable[0]);
  });

  it('sends Shift+Tab on the first link to the last shown link', () => {
    const focusable = keepRendered(menu());
    const target = tabWrapTarget(focusable, focusable[0], true);
    expect(target).toBe(focusable[2]);
    expect(target?.name).toBe('GitHub');
  });

  it('leaves Tab between two elements of the list to the browser', () => {
    const focusable = keepRendered(menu());
    expect(tabWrapTarget(focusable, focusable[0], false)).toBeNull();
    expect(tabWrapTarget(focusable, focusable[2], true)).toBeNull();
  });

  it('returns null for an empty list', () => {
    expect(tabWrapTarget([], null, false)).toBeNull();
  });
});
