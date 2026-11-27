import { ExternalLink } from 'lucide-react'

/**
 * Paracosm promotional banner. Server component; the swarm-logo
 * rotation is CSS-only so no framer-motion lands in the client bundle.
 */
export function ParacosmBanner() {
  return (
    <section className="relative overflow-hidden py-12 sm:py-16">
      {/* Background gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, color-mix(in oklab, var(--color-accent-primary) 8%, transparent), transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        <div
          className="rounded-2xl border p-6 sm:p-10 backdrop-blur-xl"
          style={{
            borderColor: 'color-mix(in oklab, var(--color-accent-primary) 25%, transparent)',
            background:
              'linear-gradient(135deg, color-mix(in oklab, var(--color-background-primary) 92%, transparent), color-mix(in oklab, var(--color-accent-primary) 6%, transparent) 50%, color-mix(in oklab, var(--color-background-primary) 95%, transparent))',
            boxShadow:
              '0 0 60px color-mix(in oklab, var(--color-accent-primary) 8%, transparent), inset 0 1px 0 color-mix(in oklab, var(--color-accent-primary) 10%, transparent)',
          }}
        >
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-10">
            {/* Paracosm swarm logo — CSS-only 60s rotation, no JS animation */}
            <div
              className="flex-shrink-0 motion-safe:animate-[spin_60s_linear_infinite]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 64 64"
                width="72"
                height="72"
                className="drop-shadow-[0_0_20px_rgba(232,180,74,0.3)]"
              >
                <g opacity="0.5">
                  <line x1="32" y1="32" x2="37.63" y2="10.98" stroke="currentColor" strokeWidth="1.6" />
                  <line x1="32" y1="32" x2="53.02" y2="26.37" stroke="currentColor" strokeWidth="1.6" />
                  <line x1="32" y1="32" x2="47.39" y2="47.39" stroke="currentColor" strokeWidth="1.6" />
                  <line x1="32" y1="32" x2="26.37" y2="53.02" stroke="currentColor" strokeWidth="1.6" />
                  <line x1="32" y1="32" x2="10.98" y2="37.63" stroke="currentColor" strokeWidth="1.6" />
                  <line x1="32" y1="32" x2="16.61" y2="16.61" stroke="currentColor" strokeWidth="1.6" />
                </g>
                <g opacity="0.18">
                  <line x1="37.63" y1="10.98" x2="47.39" y2="47.39" stroke="currentColor" strokeWidth="1.1" />
                  <line x1="53.02" y1="26.37" x2="26.37" y2="53.02" stroke="currentColor" strokeWidth="1.1" />
                  <line x1="47.39" y1="47.39" x2="10.98" y2="37.63" stroke="currentColor" strokeWidth="1.1" />
                  <line x1="26.37" y1="53.02" x2="16.61" y2="16.61" stroke="currentColor" strokeWidth="1.1" />
                  <line x1="10.98" y1="37.63" x2="37.63" y2="10.98" stroke="currentColor" strokeWidth="1.1" />
                  <line x1="16.61" y1="16.61" x2="53.02" y2="26.37" stroke="currentColor" strokeWidth="1.1" />
                </g>
                <circle cx="32" cy="32" r="9.2" fill="#e8b44a" opacity="0.08" />
                <circle cx="32" cy="32" r="5.12" fill="#e8b44a" />
                <circle cx="37.63" cy="10.98" r="3.52" fill="#e06530" />
                <circle cx="53.02" cy="26.37" r="3.52" fill="#e8b44a" />
                <circle cx="47.39" cy="47.39" r="3.52" fill="#4ca8a8" />
                <circle cx="26.37" cy="53.02" r="3.52" fill="#e06530" />
                <circle cx="10.98" cy="37.63" r="3.52" fill="#4ca8a8" />
                <circle cx="16.61" cy="16.61" r="3.52" fill="#e8b44a" />
              </svg>
            </div>

            {/* Content */}
            <div className="flex-1 text-center sm:text-left">
              <div className="mb-2 flex items-center justify-center gap-3 sm:justify-start">
                <h2
                  className="font-mono text-xl font-bold tracking-wider sm:text-2xl"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  <a
                    href="https://paracosm.agentos.sh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-opacity hover:opacity-80"
                    aria-label="Paracosm: visit paracosm.agentos.sh"
                  >
                    PARA<span style={{ color: '#e8b44a' }}>COSM</span>
                  </a>
                </h2>
              </div>

              <p
                className="mb-1 font-mono text-xs font-semibold uppercase tracking-[3px]"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                AI Agent Swarm Simulation Engine
              </p>

              <p
                className="mb-5 max-w-lg text-sm leading-relaxed sm:text-[15px]"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Define a scenario. Run it as timelines from the same start and change one thing between them: a leader’s personality, an intervention or an event at a past turn.
                Watch that one change compound into divergent civilizations.
                Built on AgentOS.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                <a
                  href="https://paracosm.agentos.sh/sim"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    background: 'linear-gradient(135deg, #e06530, #c44a1e)',
                    boxShadow: '0 4px 16px rgba(224, 101, 48, 0.25)',
                    fontSize: '13px',
                  }}
                >
                  Launch Simulation
                  <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </a>
                <a
                  href="https://agentos.sh/blog/paracosm-launch/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 font-semibold transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    borderColor: 'var(--color-border-subtle)',
                    color: 'var(--color-text-secondary)',
                    fontSize: '13px',
                  }}
                  aria-label="Learn more about Paracosm — read the 2026 overview blog post"
                >
                  Learn more about Paracosm
                </a>
                <a
                  href="https://www.npmjs.com/package/paracosm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs font-semibold transition-colors hover:underline"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  npm install paracosm
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
