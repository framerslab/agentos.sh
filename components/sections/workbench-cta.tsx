import { Cpu, Check, GitBranch, Download } from 'lucide-react'
import { useTranslations } from 'next-intl'

/**
 * AgentOS Workbench CTA. Sits right under the "See AgentOS in action"
 * demo player on the homepage so visitors know the demos are recorded
 * inside Workbench and can grab it themselves. MIT-licensed companion
 * to the Apache 2.0 AgentOS runtime.
 */
export function WorkbenchCTA() {
  const t = useTranslations('workbench')

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl border-2 border-[var(--color-accent-primary)]/30 bg-gradient-to-br from-[var(--color-background-elevated)] to-[var(--color-background-glass)] p-8 sm:p-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--color-accent-primary)]/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] shadow-lg">
                  <Cpu className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-accent-primary)]/40 bg-[var(--color-accent-primary)]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--color-accent-primary)]">
                    {t('badge1')}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-background-secondary)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                    {t('badge2')}
                  </span>
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-[var(--color-text-primary)]">
                {t('title')}
              </h2>
              <p className="text-[var(--color-text-secondary)] text-lg mb-4">
                {t('description')}
              </p>
              <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  {t('feature1')}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  {t('feature2')}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  {t('feature3')}
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-3 w-full lg:w-auto">
              <a
                href="https://github.com/framerslab/agentos-workbench"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] text-white shadow-lg hover:shadow-xl hover:brightness-110 transition-all"
              >
                <GitBranch className="w-5 h-5" />
                {t('viewGithub')}
              </a>
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold border-2 border-[var(--color-border-subtle)] text-[var(--color-text-tertiary)] bg-transparent cursor-not-allowed opacity-70"
              >
                <Download className="w-5 h-5" />
                {t('downloadComingSoon')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
