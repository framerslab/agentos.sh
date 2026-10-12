/**
 * ForgeDemoSection. Runtime agent spawning, positioned directly under the
 * hero. Server component, zero client JS: a condensed copy of
 * examples/emergent-hierarchical-spawning.mjs from the agentos repository,
 * with links to the full file and to one captured run of an adapted script
 * (/demo/emergent-spawning.html).
 */

const EXAMPLE_CODE = `import { agency } from '@framers/agentos';

const research = agency({
  provider: 'openai',
  model: 'gpt-4o',
  strategy: 'hierarchical',
  instructions:
    'Coordinate the team to produce a thorough research report. ' +
    'If you need a capability neither the researcher nor the writer covers, ' +
    'call spawn_specialist to mint a new specialist for just this run.',
  agents: {
    researcher: { instructions: 'Find authoritative sources and pull verbatim quotes.' },
    writer: { instructions: 'Produce well-cited prose from the research brief.' },
  },
  emergent: {
    enabled: true,     // unlocks the spawn_specialist tool
    tier: 'session',   // spawned agents are discarded when generate() returns
    judge: true,       // EmergentAgentJudge reviews each spec before activation
    planner: { maxSpecialists: 3, requireJustification: true, maxJudgeCalls: 6 },
  },
  on: {
    emergentForge: (event) =>
      console.log(\`[FORGE] spawned "\${event.agentName}" approved=\${event.approved}\`),
  },
});

const result = await research.generate(
  'Survey the post-2023 RAG literature, including evaluation methodology, ' +
    'known limitations, and reproducibility challenges.',
);
console.log(result.text);`

export function ForgeDemoSection() {
  return (
    <section
      id="forge-demo"
      className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8"
      aria-labelledby="forge-demo-heading"
    >
      <div className="mx-auto max-w-6xl">
        <header className="text-center mb-8">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-primary)] mb-2">
            Runtime agent spawning
          </p>
          <h2 id="forge-demo-heading" className="text-3xl sm:text-4xl font-bold mb-3">
            <span className="gradient-text">Spawn an agent at runtime</span>
          </h2>
          <p className="text-base sm:text-lg max-w-3xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            A manager coordinates a researcher and a writer. When the task needs a role neither covers, the manager calls{' '}
            <code className="font-mono text-[var(--color-accent-primary)]">spawn_specialist</code>, an LLM judge approves the new agent&apos;s spec, and the specialist joins the roster for the manager&apos;s next turn.
          </p>
        </header>

        <figure
          className="rounded-2xl overflow-hidden border shadow-2xl shadow-violet-500/10"
          style={{ borderColor: 'var(--color-border-primary)' }}
        >
          <div
            className="p-5 font-mono text-xs sm:text-sm leading-relaxed overflow-auto"
            style={{
              background: 'var(--color-background-primary)',
              color: 'var(--color-text-secondary)',
            }}
          >
            <pre className="whitespace-pre-wrap">{EXAMPLE_CODE}</pre>
          </div>
          <figcaption
            className="px-4 py-3 text-xs sm:text-sm flex flex-wrap items-center justify-between gap-2"
            style={{
              color: 'var(--color-text-muted)',
              background: 'var(--color-background-secondary)',
            }}
          >
            <span>
              Condensed from <code className="font-mono text-[var(--color-accent-primary)]">examples/emergent-hierarchical-spawning.mjs</code>. Run the full file with <code className="font-mono text-[var(--color-accent-primary)]">node</code> in a built clone.
            </span>
            <span className="flex flex-wrap items-center gap-4">
              <a
                href="/demo/emergent-spawning.html"
                className="text-[var(--color-accent-primary)] hover:underline whitespace-nowrap"
              >
                One captured run →
              </a>
              <a
                href="https://github.com/framerslab/agentos/blob/master/examples/emergent-hierarchical-spawning.mjs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-accent-primary)] hover:underline whitespace-nowrap"
              >
                View source on GitHub →
              </a>
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
