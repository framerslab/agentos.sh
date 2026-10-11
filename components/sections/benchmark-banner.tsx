'use client'

import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'

/**
 * Top-of-page benchmark announcement banner.
 * Surfaces the latest LongMemEval-M result with a CTA to the canonical
 * blog post on agentos.sh. Dismissible per visit; the localStorage
 * key is dated so future banners ship independently.
 */
const STORAGE_KEY = 'agentos-banner-2026-04-29'
const BLOG_SLUG = 'agentos-memory-sota-longmemeval'

export function BenchmarkBanner() {
  const locale = useLocale()
  // Default VISIBLE so the banner paints on first render. useEffect
  // below hides it if previously dismissed; brief render-then-hide
  // flicker beats the longer hidden-then-show flash every fresh
  // visitor was seeing.
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === 'dismissed') {
        setHidden(true)
      }
    } catch {
      // localStorage unavailable (private browsing, locked-down browser)
    }
  }, [])

  if (hidden) return null

  // Solid dark gradient + white text guarantees WCAG AA contrast in
  // every theme (default + twilight-neo, light + dark), since the
  // background is theme-independent. Brand identity surfaces in the
  // 2px gradient bottom border instead of the body fill.
  return (
    <aside
      role="region"
      aria-label="Latest benchmark result"
      className="relative mt-[64px] w-full text-sm sm:mt-[68px]"
      style={{
        backgroundImage:
          'linear-gradient(90deg, #0a0f1f 0%, #14102a 45%, #1c0e2e 100%)',
        color: '#ffffff',
        borderBottom: '2px solid transparent',
        borderImage:
          'linear-gradient(90deg, var(--color-accent-primary), var(--color-accent-secondary), var(--color-accent-tertiary)) 1',
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-1.5 px-4 py-2.5 sm:flex-row sm:justify-center sm:gap-4">
        <span className="text-center text-[13px] font-semibold leading-snug text-white sm:text-sm sm:text-left">
          New benchmarks: 85.6% on LongMemEval-S with a per-category reader router, 84.2% with gpt-4o alone, level with{' '}
          <a
            href="https://mastra.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-white underline underline-offset-2 hover:opacity-90"
          >
            Mastra
          </a>
          &apos;s Observational Memory at gpt-4o (84.23%). 70.2% on M.
        </span>
        <div className="inline-flex items-stretch overflow-hidden rounded-md bg-white/15 ring-1 ring-white/30 transition-colors hover:bg-white/20">
          <a
            href={`/${locale}/blog/${BLOG_SLUG}/`}
            className="px-3 py-1 font-bold text-white"
          >
            Read the post →
          </a>
          <button
            type="button"
            aria-label="Dismiss benchmark banner"
            onClick={() => {
              try {
                window.localStorage.setItem(STORAGE_KEY, 'dismissed')
              } catch {
                // localStorage unavailable; still hide the banner for this session
              }
              setHidden(true)
            }}
            className="flex items-center justify-center border-l border-white/30 px-2.5 text-base leading-none text-white/80 transition-colors hover:bg-white/15 hover:text-white"
          >
            ×
          </button>
        </div>
      </div>
    </aside>
  )
}
