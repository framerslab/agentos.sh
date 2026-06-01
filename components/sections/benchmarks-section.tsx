'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ArrowRight, ExternalLink, Trophy, Github } from 'lucide-react'

/**
 * Benchmark data is hardcoded (numbers + citations) since accuracy
 * percentages are language-neutral. Translations cover the prose
 * framing only. Cross-provider configurations are intentionally
 * excluded because their results cannot be reproduced from public
 * methodology disclosures (Mastra 94.9% gpt-5-mini + gemini observer,
 * Mem0 93.4% managed-platform, etc.). The footnote names them so
 * readers comparing this page to vendor marketing are not surprised.
 */

interface BenchmarkRow {
  system: string
  accuracy: string
  ci: string
  costPerCorrect: string
  p50Latency: string
  source: { label: string; href: string }
  isAgentos?: boolean
}

const LONGMEMEVAL_S_ROWS: BenchmarkRow[] = [
  {
    system: 'EmergenceMem Internal',
    accuracy: '86.0%',
    ci: 'not published',
    costPerCorrect: 'not published',
    p50Latency: '5,650 ms',
    source: {
      label: 'emergence.ai',
      href: 'https://www.emergence.ai/blog/sota-on-longmemeval-with-rag',
    },
  },
  {
    system: 'AgentOS canonical-hybrid + reader-router',
    accuracy: '85.6%',
    ci: '[82.4%, 88.6%]',
    costPerCorrect: '$0.0090',
    p50Latency: '3,558 ms',
    source: {
      label: '85.6% Pareto-win post',
      href: '/en/blog/agentos-memory-sota-longmemeval/',
    },
    isAgentos: true,
  },
  {
    system: 'Mastra OM gpt-4o (gemini-flash observer)',
    accuracy: '84.23%',
    ci: 'not published',
    costPerCorrect: 'not published',
    p50Latency: 'not published',
    source: {
      label: 'mastra.ai',
      href: 'https://mastra.ai/research/observational-memory',
    },
  },
  {
    system: 'Supermemory gpt-4o',
    accuracy: '81.6%',
    ci: 'not published',
    costPerCorrect: 'not published',
    p50Latency: 'not published',
    source: {
      label: 'supermemory.ai',
      href: 'https://supermemory.ai/research/',
    },
  },
  {
    system: 'EmergenceMem Simple Fast (rerun in agentos-bench)',
    accuracy: '80.6%',
    ci: '[77.0%, 84.0%]',
    costPerCorrect: '$0.0586',
    p50Latency: '3,703 ms',
    source: {
      label: 'vendor reproduction',
      href: 'https://github.com/framerslab/agentos-bench/blob/master/vendors/emergence-simple-fast/',
    },
  },
  {
    system: 'Zep self-reported',
    accuracy: '71.2%',
    ci: 'not published',
    costPerCorrect: 'not published',
    p50Latency: '632 ms p95 search',
    source: {
      label: 'getzep.com',
      href: 'https://blog.getzep.com/state-of-the-art-agent-memory/',
    },
  },
]

interface MRow {
  system: string
  accuracy: string
  ci: string
  license: string
  source: { label: string; href: string }
  isAgentos?: boolean
}

const LONGMEMEVAL_M_ROWS: MRow[] = [
  {
    system: 'AgentBrain (Test 0)',
    accuracy: '71.7%',
    ci: 'not published',
    license: 'closed-source SaaS',
    source: { label: 'github.com/AgentBrainHQ', href: 'https://github.com/AgentBrainHQ' },
  },
  {
    system: 'AgentOS (sem-embed + reader-router + top-K=5)',
    accuracy: '70.2%',
    ci: '[66.0%, 74.0%]',
    license: 'Apache-2.0',
    source: {
      label: '70.2% post',
      href: '/en/blog/agentos-memory-sota-longmemeval/',
    },
    isAgentos: true,
  },
  {
    system: 'LongMemEval paper academic baseline',
    accuracy: '65.7%',
    ci: 'not published',
    license: 'open repo',
    source: {
      label: 'Wu et al., ICLR 2025',
      href: 'https://arxiv.org/abs/2410.10813',
    },
  },
  {
    system: 'Mem0 v3, Mastra OM, Hindsight, Zep, EmergenceMem, Supermemory, Letta, others',
    accuracy: 'not published',
    ci: '—',
    license: 'various',
    source: { label: 'reports S only', href: 'https://github.com/framerslab/agentos-bench/blob/master/results/LEADERBOARD.md' },
  },
]

export function BenchmarksSection() {
  const t = useTranslations('benchmarks')
  const [activeTab, setActiveTab] = useState<'s' | 'm'>('s')

  const accent = 'var(--color-accent-primary)'

  return (
    <section
      id="benchmarks"
      className="relative w-full py-24 md:py-32"
      aria-labelledby="benchmarks-heading"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-background-secondary)] px-4 py-2 text-xs font-medium uppercase tracking-wider text-[var(--color-text-secondary)] backdrop-blur"
        >
          <Trophy className="h-3.5 w-3.5" style={{ color: accent }} aria-hidden />
          {t('badge')}
        </motion.div>

        {/* Title + subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mb-12 max-w-3xl"
        >
          <h2
            id="benchmarks-heading"
            className="mb-4 text-4xl font-bold tracking-tight md:text-5xl"
          >
            <span className="gradient-text">{t('title')}</span>
          </h2>
          <p className="text-lg leading-relaxed text-[var(--color-text-secondary)]">{t('subtitle')}</p>
        </motion.div>

        {/* Headline numbers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-background-secondary)] p-8 backdrop-blur">
            <div className="mb-2 text-sm font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
              {t('highlightSAccuracy')}
            </div>
            <div
              className="mb-2 brand-gradient-text text-6xl font-bold tracking-tight"
            >
              {t('highlightSValue')}
            </div>
            <div className="text-sm text-[var(--color-text-secondary)]">{t('highlightSCi')}</div>
          </div>
          <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-background-secondary)] p-8 backdrop-blur">
            <div className="mb-2 text-sm font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
              {t('highlightMAccuracy')}
            </div>
            <div
              className="mb-2 brand-gradient-text text-6xl font-bold tracking-tight"
            >
              {t('highlightMValue')}
            </div>
            <div className="text-sm text-[var(--color-text-secondary)]">{t('highlightMCi')}</div>
          </div>
        </motion.div>

        {/* Tab switcher */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-6 flex flex-wrap gap-2"
          role="tablist"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 's'}
            onClick={() => setActiveTab('s')}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
              activeTab === 's'
                ? 'border border-[var(--color-border-primary)] bg-[var(--color-background-tertiary)] text-[var(--color-text-primary)]'
                : 'border border-[var(--color-border-subtle)] bg-transparent text-[var(--color-text-muted)] hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-text-secondary)]'
            }`}
          >
            {t('tabS')}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'm'}
            onClick={() => setActiveTab('m')}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
              activeTab === 'm'
                ? 'border border-[var(--color-border-primary)] bg-[var(--color-background-tertiary)] text-[var(--color-text-primary)]'
                : 'border border-[var(--color-border-subtle)] bg-transparent text-[var(--color-text-muted)] hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-text-secondary)]'
            }`}
          >
            {t('tabM')}
          </button>
        </motion.div>

        {/* Comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <p className="mb-4 text-sm text-[var(--color-text-muted)]">{t('matrixIntro')}</p>
          <div className="overflow-x-auto rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-background-secondary)]/40 backdrop-blur">
            {activeTab === 's' ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border-subtle)] text-left text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                    <th className="px-6 py-4 font-medium">System</th>
                    <th className="px-6 py-4 text-right font-medium">Accuracy</th>
                    <th className="px-6 py-4 text-right font-medium">$/correct</th>
                    <th className="px-6 py-4 text-right font-medium">p50 latency</th>
                    <th className="px-6 py-4 font-medium">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {LONGMEMEVAL_S_ROWS.map((row) => (
                    <tr
                      key={row.system}
                      className={`border-b border-[var(--color-border-subtle)] last:border-b-0 ${
                        row.isAgentos
                          ? 'bg-gradient-to-r from-[hsl(180,95%,45%)]/[0.12] to-transparent'
                          : ''
                      }`}
                    >
                      <td
                        className={`px-6 py-4 ${
                          row.isAgentos ? 'font-semibold text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'
                        }`}
                      >
                        {row.system}
                      </td>
                      <td
                        className={`px-6 py-4 text-right tabular-nums ${
                          row.isAgentos ? 'font-bold text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'
                        }`}
                      >
                        {row.accuracy}
                      </td>
                      <td className="px-6 py-4 text-right tabular-nums text-[var(--color-text-muted)]">
                        {row.costPerCorrect}
                      </td>
                      <td className="px-6 py-4 text-right tabular-nums text-[var(--color-text-muted)]">
                        {row.p50Latency}
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={row.source.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[var(--color-text-secondary)] underline-offset-4 hover:text-[var(--color-text-primary)] hover:underline"
                        >
                          {row.source.label}
                          <ExternalLink className="h-3 w-3" aria-hidden />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border-subtle)] text-left text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                    <th className="px-6 py-4 font-medium">System</th>
                    <th className="px-6 py-4 text-right font-medium">Accuracy</th>
                    <th className="px-6 py-4 font-medium">License</th>
                    <th className="px-6 py-4 font-medium">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {LONGMEMEVAL_M_ROWS.map((row) => (
                    <tr
                      key={row.system}
                      className={`border-b border-[var(--color-border-subtle)] last:border-b-0 ${
                        row.isAgentos
                          ? 'bg-gradient-to-r from-[hsl(180,95%,45%)]/[0.12] to-transparent'
                          : ''
                      }`}
                    >
                      <td
                        className={`px-6 py-4 ${
                          row.isAgentos ? 'font-semibold text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'
                        }`}
                      >
                        {row.system}
                      </td>
                      <td
                        className={`px-6 py-4 text-right tabular-nums ${
                          row.isAgentos ? 'font-bold text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'
                        }`}
                      >
                        {row.accuracy}
                      </td>
                      <td className="px-6 py-4 text-[var(--color-text-muted)]">{row.license}</td>
                      <td className="px-6 py-4">
                        <a
                          href={row.source.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[var(--color-text-secondary)] underline-offset-4 hover:text-[var(--color-text-primary)] hover:underline"
                        >
                          {row.source.label}
                          <ExternalLink className="h-3 w-3" aria-hidden />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

        {/* Footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mb-10 max-w-4xl text-xs leading-relaxed text-[var(--color-text-muted)]"
        >
          {t('footnote')}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap gap-3"
        >
          <a
            href="https://github.com/framerslab/agentos-bench/blob/master/results/LEADERBOARD.md"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-text-primary)] px-6 py-3 text-sm font-medium text-[var(--color-background-primary)] transition-all hover:opacity-90"
          >
            {t('ctaBenchmarksPage')}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
          <a
            href="https://agentos.sh/blog/agentos-memory-sota-longmemeval/"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-subtle)] px-6 py-3 text-sm font-medium text-[var(--color-text-primary)] transition-all hover:border-[var(--color-border-primary)] hover:bg-[var(--color-background-secondary)]"
          >
            {t('ctaReadAudit')}
            <ExternalLink className="h-4 w-4" aria-hidden />
          </a>
          <a
            href="https://github.com/framerslab/agentos-bench"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-subtle)] px-6 py-3 text-sm font-medium text-[var(--color-text-primary)] transition-all hover:border-[var(--color-border-primary)] hover:bg-[var(--color-background-secondary)]"
          >
            <Github className="h-4 w-4" aria-hidden />
            {t('ctaSeeRunJsons')}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
