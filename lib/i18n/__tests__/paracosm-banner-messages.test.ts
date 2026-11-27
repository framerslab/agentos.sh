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

type Messages = {
  paracosmBanner?: Record<string, string>;
  faq?: { general?: { whatIsParacosm?: { answer?: string } } };
};

function messages(locale: string): Messages {
  const file = path.resolve(__dirname, '../../../messages', `${locale}.json`);
  return JSON.parse(readFileSync(file, 'utf8')) as Messages;
}

function banner(locale: string): Record<string, string> {
  return messages(locale).paracosmBanner ?? {};
}

function faqAnswer(locale: string): string {
  return messages(locale).faq?.general?.whatIsParacosm?.answer ?? '';
}

/**
 * A Paracosm run reads no intervention: WorldModel.intervene() runs simulate()
 * and keeps the intervention on the run's artifact only, so neither the banner
 * nor the FAQ may offer one as the thing that changes between timelines.
 */
const INTERVENTION: Record<(typeof LOCALES)[number], RegExp> = {
  de: /Intervention/i,
  en: /intervention/i,
  es: /intervención/i,
  fr: /intervention/i,
  ja: /介入/,
  ko: /개입/,
  pt: /intervenção/i,
  zh: /干预/,
};

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

  test.each(LOCALES)('%s offers no intervention as the thing that changes', (locale) => {
    expect(banner(locale).description).not.toMatch(INTERVENTION[locale]);
    expect(faqAnswer(locale).length).toBeGreaterThan(0);
    expect(faqAnswer(locale)).not.toMatch(INTERVENTION[locale]);
  });

  test('the FAQ says the event director writes the unscripted crises', () => {
    expect(faqAnswer('en')).toContain('writes the unscripted crises');
  });
});
