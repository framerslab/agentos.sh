'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

const placeholderSlots = [0] as const

export function SocialProofSection() {
  const t = useTranslations('socialProof')
  const tNav = useTranslations('nav')
  const tFooter = useTranslations('footer')

  const updateLinks = [
    { label: tFooter('releaseNotes'), href: 'https://github.com/framerslab/agentos/releases' },
    { label: tNav('changelog'), href: 'https://docs.agentos.sh/docs/getting-started/releasing' },
    { label: tNav('faq'), href: '/faq' }
  ] as const

  return (
    <section className="py-10 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden section-tint" aria-labelledby="social-proof-heading">
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_80%_20%,var(--color-accent-primary),transparent_55%)]" />
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 id="social-proof-heading" className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 gap-4"
          >
            {/* Wilds AI — revealed deployment */}
            <a
              href="https://wilds.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="relative overflow-hidden rounded-3xl border border-border-subtle/60 bg-white/80 dark:bg-white/5 dark:border-white/10 p-5 backdrop-blur flex flex-col items-center justify-center gap-3 transition-colors hover:border-accent-primary/50 hover:bg-white/90 dark:hover:bg-white/10"
            >
              <svg width="48" height="48" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className="rounded-xl">
                <rect width="64" height="64" rx="15" fill="#0c1528"/>
                <defs>
                  <clipPath id="above-front">
                    <rect x="0" y="0" width="64" height="50"/>
                  </clipPath>
                </defs>
                <path d="M9,50 L24,22 L32,32 L40,22 L55,50 L47,50 L40,34 L32,44 L24,34 L17,50 Z" fill="#1a3358" clipPath="url(#above-front)"/>
                <path d="M9,50 L22,28 L32,40 L42,28 L55,50 L47,50 L42,38 L32,50 L22,38 L17,50 Z" fill="#2d6bc9"/>
                <circle cx="32" cy="16" r="5" fill="#4a8fe8"/>
              </svg>
              <span className="text-sm font-semibold text-text-primary">Wilds AI</span>
            </a>

            {/* Paracosm — revealed deployment */}
            <a
              href="https://paracosm.agentos.sh"
              target="_blank"
              rel="noopener noreferrer"
              className="relative overflow-hidden rounded-3xl border border-border-subtle/60 bg-white/80 dark:bg-white/5 dark:border-white/10 p-5 backdrop-blur flex flex-col items-center justify-center gap-3 transition-colors hover:border-accent-primary/50 hover:bg-white/90 dark:hover:bg-white/10"
            >
              <svg width="48" height="48" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className="rounded-xl">
                <rect width="64" height="64" rx="15" fill="#1c1232"/>
                <line x1="32" y1="32" x2="37.6" y2="11" stroke="#f5f0e4" strokeWidth="1.6" opacity="0.55"/>
                <line x1="32" y1="32" x2="53" y2="26.4" stroke="#f5f0e4" strokeWidth="1.6" opacity="0.55"/>
                <line x1="32" y1="32" x2="47.4" y2="47.4" stroke="#f5f0e4" strokeWidth="1.6" opacity="0.55"/>
                <line x1="32" y1="32" x2="26.4" y2="53" stroke="#f5f0e4" strokeWidth="1.6" opacity="0.55"/>
                <line x1="32" y1="32" x2="11" y2="37.6" stroke="#f5f0e4" strokeWidth="1.6" opacity="0.55"/>
                <line x1="32" y1="32" x2="16.6" y2="16.6" stroke="#f5f0e4" strokeWidth="1.6" opacity="0.55"/>
                <circle cx="32" cy="32" r="9.2" fill="#e8b44a" opacity="0.15"/>
                <circle cx="32" cy="32" r="5.1" fill="#e8b44a"/>
                <circle cx="37.6" cy="11" r="3.5" fill="#e06530"/>
                <circle cx="53" cy="26.4" r="3.5" fill="#e8b44a"/>
                <circle cx="47.4" cy="47.4" r="3.5" fill="#4ca8a8"/>
                <circle cx="26.4" cy="53" r="3.5" fill="#e06530"/>
                <circle cx="11" cy="37.6" r="3.5" fill="#4ca8a8"/>
                <circle cx="16.6" cy="16.6" r="3.5" fill="#e8b44a"/>
              </svg>
              <span className="text-sm font-semibold text-text-primary">Paracosm</span>
            </a>

            {/* Wunderland — revealed deployment */}
            <a
              href="https://wunderland.sh"
              target="_blank"
              rel="noopener noreferrer"
              className="relative overflow-hidden rounded-3xl border border-border-subtle/60 bg-white/80 dark:bg-white/5 dark:border-white/10 p-5 backdrop-blur flex flex-col items-center justify-center gap-3 transition-colors hover:border-accent-primary/50 hover:bg-white/90 dark:hover:bg-white/10"
            >
              <svg width="48" height="48" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="rounded-xl">
                <rect width="100" height="100" rx="22" fill="#0c1528"/>
                {/* Outer frame */}
                <polygon points="50,10 76,22 88,50 76,78 50,90 24,78 12,50 24,22"
                         fill="none"
                         stroke="#0ea5e9"
                         strokeWidth="2"/>
                {/* Main W */}
                <path d="M24,28 L34,50 L50,32 L66,50 L76,28"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"/>
                {/* Mirror line */}
                <line x1="20" y1="50" x2="80" y2="50" stroke="#eab308" strokeWidth="2" opacity="0.75"/>
                {/* Reflected W */}
                <path d="M24,72 L34,50 L50,68 L66,50 L76,72"
                      fill="none"
                      stroke="#0ea5e9"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.4"/>
              </svg>
              <span className="text-sm font-semibold text-text-primary">Wunderland</span>
            </a>

            {placeholderSlots.map((slot) => (
              <div key={slot} className="relative overflow-hidden rounded-3xl border border-border-subtle/60 bg-white/80 dark:bg-white/5 dark:border-white/10 p-5 backdrop-blur">
                <div className="absolute inset-0 bg-black/50 blur-lg opacity-0 pointer-events-none" aria-hidden="true" />
                {/* Abstract logo silhouette – no text label */}
                <div className="flex items-center justify-center mb-3">
                  <div className="h-14 w-28 rounded-3xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-primary to-[color:var(--color-accent-warm)] opacity-60" />
                    <svg viewBox="0 0 100 40" className="relative w-full h-full">
                      <path
                        d="M5 30 C 20 10, 40 5, 55 20 S 85 35, 95 15"
                        fill="none"
                        stroke="rgba(255,255,255,0.85)"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <circle cx="25" cy="18" r="3" fill="rgba(255,255,255,0.8)" />
                      <circle cx="55" cy="24" r="3" fill="rgba(255,255,255,0.7)" />
                      <circle cx="80" cy="14" r="3" fill="rgba(255,255,255,0.75)" />
                    </svg>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-black/70 backdrop-blur-lg text-center">
                  <span className="text-sm font-semibold text-text-primary">{t('comingSoon')}</span>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-border-subtle/70 bg-white/85 dark:bg-white/5 dark:border-white/10 p-6 shadow-sm backdrop-blur"
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-text-muted mb-4">{t('latestUpdates')}</p>
            <ul className="space-y-3">
              {updateLinks.map((link) => (
                <li key={link.label} className="flex items-center justify-between">
                  <a
                    href={link.href}
                    className="text-text-primary font-semibold hover:text-accent-primary transition-colors"
                  >
                    {link.label}
                  </a>
                  <span aria-hidden="true" className="text-text-muted">↗</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-2xl border border-dashed border-accent-primary/40 p-4 text-center">
              <p className="text-sm text-text-secondary">{t('cta.ask')}</p>
              <a href="mailto:team@frame.dev" className="text-accent-primary font-semibold">team@frame.dev</a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

