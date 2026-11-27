import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

/**
 * The Paracosm banner on the home page reads its words from each locale's
 * message file (namespace paracosmBanner). A locale that lacks a key would
 * show the key's path, and a locale holding the English words would show
 * English on its own home page.
 */
const LOCALES = ['de', 'en', 'es', 'fr', 'ja', 'ko', 'pt', 'zh'] as const;
const KEYS = ['ariaVisit', 'description', 'launch', 'learnMore', 'learnMoreAria', 'subtitle'];

function banner(locale: string): Record<string, string> {
  const file = path.resolve(__dirname, '../../../messages', `${locale}.json`);
  const messages = JSON.parse(readFileSync(file, 'utf8')) as { paracosmBanner?: Record<string, string> };
  return messages.paracosmBanner ?? {};
}

describe('paracosmBanner messages', () => {
  test.each(LOCALES)('%s holds every banner string, none empty', (locale) => {
    const words = banner(locale);
    expect(Object.keys(words).sort()).toEqual(KEYS);
    for (const key of KEYS) expect(words[key]?.trim().length ?? 0).toBeGreaterThan(0);
  });

  test.each(LOCALES.filter((locale) => locale !== 'en'))('%s has its own description, not the English one', (locale) => {
    expect(banner(locale).description).not.toBe(banner('en').description);
  });

  test('the description says a run changes one thing between timelines', () => {
    expect(banner('en').description).toContain('change one thing between them');
    expect(banner('en').description).not.toContain('commanders');
  });
});
