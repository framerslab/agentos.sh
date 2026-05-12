'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Sparkles, Brain } from 'lucide-react'

/**
 * Runtime Intelligence pillar section for the AgentOS landing page.
 *
 * Two side-by-side cards introducing the two runtime adaptation surfaces:
 *   - Emergent Tool Forging: agents can synthesize new tools and specialist
 *     agents at runtime, gated by a judge LLM and sandbox execution.
 *   - Adaptive Prompt Intelligence: per-turn metaprompts re-tune mood,
 *     inferred user skill, task complexity, working-memory imprints, and
 *     HEXACO traits between turns, with bounded budgets and concrete cost
 *     overhead (~\$0.12 per 1000 turns on gpt-4o-mini at default cadence).
 *
 * The two cards sit side-by-side on desktop, stack on mobile. Each card
 * surfaces a small inline SVG flow diagram and three feature bullets, then
 * links to the corresponding live-docs guide.
 */
export function RuntimeIntelligenceSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 })

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  }

  return (
    <section
      ref={sectionRef}
      id="runtime-intelligence"
      className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        background:
          'linear-gradient(175deg, var(--color-background-primary) 0%, var(--color-background-elevated) 100%)',
      }}
      aria-labelledby="runtime-intel-heading"
    >
      {/* Ambient gradient blurs */}
      <div
        className="absolute top-[-100px] left-1/4 w-[600px] h-[600px] rounded-full blur-3xl opacity-[0.07] pointer-events-none"
        style={{ background: 'var(--color-accent-primary)' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-80px] right-1/3 w-[500px] h-[500px] rounded-full blur-3xl opacity-[0.06] pointer-events-none"
        style={{ background: 'var(--color-accent-secondary)' }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
          className="text-center mb-12"
        >
          <p
            className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] mb-3"
            style={{ color: 'var(--color-accent-primary)' }}
          >
            Two Runtime Adaptation Surfaces
          </p>
          <h2
            id="runtime-intel-heading"
            className="text-4xl sm:text-5xl font-extrabold mb-4"
          >
            <span className="gradient-text">Agents that change shape mid-run</span>
          </h2>
          <p
            className="text-lg max-w-3xl mx-auto"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Most agent frameworks freeze the persona, the tool set, and the prompt at startup.
            AgentOS does not. Two independent runtime systems re-tune the agent between turns:
            one expands capability, the other refines voice.
          </p>
        </motion.div>

        {/* Two pillar cards */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* PILLAR 1: Emergent Tool Forging */}
          <motion.article
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={{
              ...fadeUp,
              visible: {
                ...fadeUp.visible,
                transition: { ...fadeUp.visible.transition, delay: 0.15 },
              },
            }}
            className="rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col"
            style={{
              border: '1px solid var(--color-border-primary)',
              background: 'var(--color-background-primary)',
            }}
          >
            {/* Top stripe */}
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{
                background:
                  'linear-gradient(to right, var(--color-accent-primary), var(--color-accent-secondary))',
              }}
              aria-hidden="true"
            />

            <div className="flex items-center gap-3 mb-4">
              <span
                className="inline-flex items-center justify-center w-11 h-11 rounded-xl"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(99, 102, 241, 0.16), rgba(236, 72, 153, 0.18))',
                  color: 'var(--color-accent-primary)',
                }}
                aria-hidden="true"
              >
                <Sparkles className="w-5 h-5" />
              </span>
              <p
                className="text-xs font-bold uppercase tracking-[0.16em]"
                style={{ color: 'var(--color-accent-primary)' }}
              >
                Capability surface
              </p>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold mb-3">Emergent Tool Forging</h3>
            <p
              className="text-base mb-5 leading-relaxed"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Hierarchical agencies forge new TypeScript tools and spawn specialist agents
              mid-run when the static roster falls short. A judge LLM reviews every forge
              before it runs sandboxed in a node:vm with bounded memory and time.
            </p>

            {/* Mini SVG flow */}
            <div className="mb-5 rounded-xl p-4" style={{ background: 'var(--color-background-elevated)' }}>
              <svg viewBox="0 0 420 80" className="w-full h-auto" role="img" aria-label="Tool forging flow">
                <defs>
                  <linearGradient id="forge-mini-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--color-accent-primary)" />
                    <stop offset="100%" stopColor="var(--color-accent-secondary)" />
                  </linearGradient>
                  <marker id="forge-mini-arrow" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L6,3 L0,6 z" fill="var(--color-accent-primary)" />
                  </marker>
                </defs>
                {/* Nodes */}
                {[
                  { x: 8, label: 'Agent' },
                  { x: 110, label: 'Forge' },
                  { x: 212, label: 'Judge' },
                  { x: 314, label: 'Tool' },
                ].map((n, i) => (
                  <g key={i}>
                    <rect
                      x={n.x}
                      y={22}
                      width={94}
                      height={36}
                      rx={10}
                      fill="var(--color-background-primary)"
                      stroke="var(--color-border-primary)"
                      strokeWidth={1.4}
                    />
                    <text
                      x={n.x + 47}
                      y={45}
                      textAnchor="middle"
                      fontSize={12}
                      fontWeight={700}
                      fill="var(--color-text-primary)"
                    >
                      {n.label}
                    </text>
                  </g>
                ))}
                {/* Connectors */}
                {[102, 204, 306].map((x, i) => (
                  <g key={`conn-${i}`}>
                    <line
                      x1={x}
                      y1={40}
                      x2={x + 8}
                      y2={40}
                      stroke="url(#forge-mini-grad)"
                      strokeWidth={1.6}
                      strokeDasharray="4,3"
                      markerEnd="url(#forge-mini-arrow)"
                    />
                    <circle r={2.5} fill="var(--color-accent-primary)">
                      <animate
                        attributeName="cx"
                        values={`${x};${x + 8}`}
                        dur="2.2s"
                        begin={`${i * 0.4}s`}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="cy"
                        values="40;40"
                        dur="2.2s"
                        begin={`${i * 0.4}s`}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0;1;0"
                        dur="2.2s"
                        begin={`${i * 0.4}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                ))}
              </svg>
            </div>

            {/* Bullets */}
            <ul className="space-y-2.5 mb-6">
              {[
                'forgeTool · spawn_specialist · adapt_personality — three emergent tools, all bounded by per-session budgets',
                'Judge LLM gates every forge; sandbox runs in node:vm with default-empty fetch/fs allowlist',
                'PersonalityMutationStore records every trait edit with reasoning for audit',
              ].map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-start gap-2 text-sm leading-relaxed"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <span
                    className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0"
                    style={{ background: 'var(--color-accent-primary)' }}
                    aria-hidden="true"
                  />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <a
              href="/features#emergent"
              className="mt-auto inline-flex items-center gap-2 text-sm font-bold transition-opacity hover:opacity-80"
              style={{ color: 'var(--color-accent-primary)' }}
            >
              <Sparkles className="w-4 h-4" />
              Explore emergent capabilities
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.article>

          {/* PILLAR 2: Adaptive Prompt Intelligence */}
          <motion.article
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={{
              ...fadeUp,
              visible: {
                ...fadeUp.visible,
                transition: { ...fadeUp.visible.transition, delay: 0.28 },
              },
            }}
            className="rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col"
            style={{
              border: '1px solid var(--color-border-primary)',
              background: 'var(--color-background-primary)',
            }}
          >
            {/* Top stripe */}
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{
                background:
                  'linear-gradient(to right, var(--color-accent-secondary), var(--color-accent-primary))',
              }}
              aria-hidden="true"
            />

            <div className="flex items-center gap-3 mb-4">
              <span
                className="inline-flex items-center justify-center w-11 h-11 rounded-xl"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(99, 102, 241, 0.16), rgba(139, 92, 246, 0.18))',
                  color: 'var(--color-accent-secondary)',
                }}
                aria-hidden="true"
              >
                <Brain className="w-5 h-5" />
              </span>
              <p
                className="text-xs font-bold uppercase tracking-[0.16em]"
                style={{ color: 'var(--color-accent-secondary)' }}
              >
                Voice surface
              </p>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold mb-3">Adaptive Prompt Intelligence</h3>
            <p
              className="text-base mb-5 leading-relaxed"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Between turns, metaprompts re-tune the GMI's mood, inferred user skill, task
              complexity, working-memory imprints, and HEXACO traits. Three trigger types
              (periodic, sentiment events, host flags) decide when. Default sentiment is
              lexicon-based and free; everything else is opt-in.
            </p>

            {/* Mini SVG flow */}
            <div className="mb-5 rounded-xl p-4" style={{ background: 'var(--color-background-elevated)' }}>
              <svg viewBox="0 0 420 80" className="w-full h-auto" role="img" aria-label="Adaptive loop flow">
                <defs>
                  <linearGradient id="adaptive-mini-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--color-accent-secondary)" />
                    <stop offset="100%" stopColor="var(--color-accent-primary)" />
                  </linearGradient>
                  <marker id="adaptive-mini-arrow" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L6,3 L0,6 z" fill="var(--color-accent-secondary)" />
                  </marker>
                </defs>
                {[
                  { x: 8, label: 'Turn N' },
                  { x: 110, label: 'Trigger' },
                  { x: 212, label: 'Update' },
                  { x: 314, label: 'Turn N+1' },
                ].map((n, i) => (
                  <g key={i}>
                    <rect
                      x={n.x}
                      y={22}
                      width={94}
                      height={36}
                      rx={10}
                      fill="var(--color-background-primary)"
                      stroke="var(--color-border-primary)"
                      strokeWidth={1.4}
                    />
                    <text
                      x={n.x + 47}
                      y={45}
                      textAnchor="middle"
                      fontSize={12}
                      fontWeight={700}
                      fill="var(--color-text-primary)"
                    >
                      {n.label}
                    </text>
                  </g>
                ))}
                {[102, 204, 306].map((x, i) => (
                  <g key={`conn-${i}`}>
                    <line
                      x1={x}
                      y1={40}
                      x2={x + 8}
                      y2={40}
                      stroke="url(#adaptive-mini-grad)"
                      strokeWidth={1.6}
                      strokeDasharray="4,3"
                      markerEnd="url(#adaptive-mini-arrow)"
                    />
                    <circle r={2.5} fill="var(--color-accent-secondary)">
                      <animate
                        attributeName="cx"
                        values={`${x};${x + 8}`}
                        dur="2.2s"
                        begin={`${i * 0.4 + 0.2}s`}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="cy"
                        values="40;40"
                        dur="2.2s"
                        begin={`${i * 0.4 + 0.2}s`}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0;1;0"
                        dur="2.2s"
                        begin={`${i * 0.4 + 0.2}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                ))}
                {/* Loop curve */}
                <path
                  d="M 361 22 Q 380 -8 200 -8 Q 36 -8 55 22"
                  fill="none"
                  stroke="url(#adaptive-mini-grad)"
                  strokeWidth={1.2}
                  strokeDasharray="3,3"
                  opacity={0.5}
                  markerEnd="url(#adaptive-mini-arrow)"
                />
              </svg>
            </div>

            <ul className="space-y-2.5 mb-6">
              {[
                'turn_interval · event_based · manual triggers — most turns fire nothing; cost stays at zero',
                'Five built-in presets: frustration recovery, confusion clarification, satisfaction, error recovery, engagement',
                'Roughly $0.12 per 1000 turns on gpt-4o-mini at default cadence — opt-in beyond that',
              ].map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-start gap-2 text-sm leading-relaxed"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <span
                    className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0"
                    style={{ background: 'var(--color-accent-secondary)' }}
                    aria-hidden="true"
                  />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <a
              href="/features#adaptive"
              className="mt-auto inline-flex items-center gap-2 text-sm font-bold transition-opacity hover:opacity-80"
              style={{ color: 'var(--color-accent-secondary)' }}
            >
              <Brain className="w-4 h-4" />
              Explore adaptive intelligence
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.article>
        </div>

        {/* Footer prose */}
        <motion.p
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{
            ...fadeUp,
            visible: {
              ...fadeUp.visible,
              transition: { ...fadeUp.visible.transition, delay: 0.42 },
            },
          }}
          className="text-center text-sm max-w-3xl mx-auto mt-10"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Both surfaces are independently configurable and both stay off by default. The two
          are also compositional: an emergent <code>adapt_personality</code> tool mutation
          can ride alongside a per-turn metaprompt that adjusts mood — same agent, two
          adaptation paths.
        </motion.p>
      </div>
    </section>
  )
}
