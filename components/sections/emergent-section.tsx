'use client'

import { useState, useRef, useMemo } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Zap, ArrowRight, Hammer, Users, RefreshCw } from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Forge Spark Particles — ambient animated background effect         */
/* ------------------------------------------------------------------ */

/**
 * Renders small animated "spark" circles that drift upward in the SVG
 * background, giving the section a dynamic, alive feel. Each spark has
 * randomised position, delay, and size.
 */
function ForgeParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      cx: 50 + Math.random() * 800,
      startY: 380 + Math.random() * 40,
      endY: -20 - Math.random() * 60,
      r: 1.5 + Math.random() * 2.5,
      delay: Math.random() * 6,
      dur: 4 + Math.random() * 4,
      color: i % 3 === 0 ? 'var(--color-accent-primary)' : i % 3 === 1 ? 'var(--color-accent-secondary)' : 'var(--color-accent-primary)',
    })),
  [])

  return (
    <svg
      viewBox="0 0 900 420"
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <filter id="spark-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>
      {particles.map((p) => (
        <circle
          key={p.id}
          cx={p.cx}
          r={p.r}
          fill={p.color}
          filter="url(#spark-blur)"
          opacity="0.6"
        >
          <animate
            attributeName="cy"
            values={`${p.startY};${p.endY}`}
            dur={`${p.dur}s`}
            begin={`${p.delay}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0;0.7;0.5;0"
            dur={`${p.dur}s`}
            begin={`${p.delay}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Tab 1: Runtime Tool Forging — flow diagram                         */
/* ------------------------------------------------------------------ */

/**
 * SVG pipeline diagram showing the 5-step forging flow:
 * Identify Gap -> Write Spec -> Judge Evaluates -> Tool Activated -> Agent Uses
 *
 * Includes animated data-flow dots traversing each connection.
 */
function ToolForgingDiagram({ steps }: { steps: string[] }) {
  const nodePositions = [
    { x: 30, y: 70 },
    { x: 200, y: 70 },
    { x: 370, y: 70 },
    { x: 540, y: 70 },
    { x: 710, y: 70 },
  ]

  return (
    <svg viewBox="0 0 870 180" className="w-full h-auto" role="img" aria-label="Tool forging pipeline">
      <defs>
        <linearGradient id="forge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-accent-primary)" />
          <stop offset="50%" stopColor="var(--color-accent-secondary)" />
          <stop offset="100%" stopColor="var(--color-accent-primary)" />
        </linearGradient>
        <filter id="forge-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <marker id="forge-arrow" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="var(--color-accent-primary)" />
        </marker>
      </defs>

      {/* Ambient glow blobs */}
      <circle cx="130" cy="90" r="80" fill="var(--color-accent-primary)" opacity="0.06" filter="url(#forge-glow)" />
      <circle cx="540" cy="90" r="100" fill="var(--color-accent-secondary)" opacity="0.05" filter="url(#forge-glow)" />

      {/* Connection lines */}
      {nodePositions.slice(0, -1).map((from, i) => {
        const to = nodePositions[i + 1]
        return (
          <g key={`conn-${i}`}>
            <line
              x1={from.x + 120}
              y1={from.y + 25}
              x2={to.x}
              y2={to.y + 25}
              stroke="url(#forge-grad)"
              strokeWidth="2"
              strokeDasharray="6,4"
              opacity="0.5"
              markerEnd="url(#forge-arrow)"
            />
            {/* Animated flow dot */}
            <circle r="3.5" fill="var(--color-accent-primary)" opacity="0.9">
              <animate
                attributeName="cx"
                values={`${from.x + 120};${to.x}`}
                dur="3s"
                begin={`${i * 0.6}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values={`${from.y + 25};${to.y + 25}`}
                dur="3s"
                begin={`${i * 0.6}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;0.9;0.9;0"
                dur="3s"
                begin={`${i * 0.6}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        )
      })}

      {/* Step nodes */}
      {nodePositions.map((pos, i) => (
        <g key={`node-${i}`}>
          {/* Outer glow ring */}
          <rect
            x={pos.x - 4}
            y={pos.y - 4}
            width={128}
            height={58}
            rx="18"
            fill="none"
            stroke="var(--color-accent-primary)"
            strokeWidth="1"
            opacity="0.15"
          >
            <animate
              attributeName="opacity"
              values="0.1;0.3;0.1"
              dur={`${3 + i * 0.5}s`}
              repeatCount="indefinite"
            />
          </rect>
          {/* Node background */}
          <rect
            x={pos.x}
            y={pos.y}
            width={120}
            height={50}
            rx="14"
            fill="var(--color-background-primary)"
            stroke="var(--color-border-primary)"
            strokeWidth="1.5"
          />
          {/* Step number */}
          <text
            x={pos.x + 60}
            y={pos.y + 20}
            textAnchor="middle"
            fill="var(--color-accent-primary)"
            fontSize="9"
            fontWeight="700"
          >
            {String(i + 1).padStart(2, '0')}
          </text>
          {/* Step label */}
          <text
            x={pos.x + 60}
            y={pos.y + 36}
            textAnchor="middle"
            fill="var(--color-text-primary)"
            fontSize="9"
            fontWeight="600"
            className="select-none"
          >
            {steps[i]?.length > 16 ? `${steps[i].slice(0, 14)}...` : steps[i]}
          </text>
        </g>
      ))}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Tab 2: Agent Synthesis — radial spawn diagram                      */
/* ------------------------------------------------------------------ */

/**
 * SVG radial diagram showing how an orchestrator spawns specialist agents.
 * The orchestrator sits at the centre; specialist agents fan out around it
 * with animated connection lines.
 */
function AgentSynthesisDiagram({ labels }: { labels: { orchestrator: string; specialists: string[]; results: string } }) {
  const cx = 400
  const cy = 170
  const r = 120

  const specialists = labels.specialists.slice(0, 5)

  return (
    <svg viewBox="0 0 800 340" className="w-full h-auto" role="img" aria-label="Agent synthesis diagram">
      <defs>
        <radialGradient id="synth-center" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-accent-secondary)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--color-accent-secondary)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="synth-edge" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-accent-secondary)" />
          <stop offset="100%" stopColor="var(--color-accent-primary)" />
        </linearGradient>
      </defs>

      {/* Center glow */}
      <circle cx={cx} cy={cy} r="70" fill="url(#synth-center)" />

      {/* Orchestrator node */}
      <circle
        cx={cx}
        cy={cy}
        r="44"
        fill="var(--color-background-primary)"
        stroke="var(--color-accent-secondary)"
        strokeWidth="2"
      />
      <text x={cx} y={cy + 4} textAnchor="middle" fill="var(--color-accent-secondary)" fontSize="11" fontWeight="700">
        {labels.orchestrator}
      </text>

      {/* Specialist agents fanning out */}
      {specialists.map((name, i) => {
        const angle = ((i / specialists.length) * Math.PI) - Math.PI / 2 + Math.PI / specialists.length
        const sx = cx + r * Math.cos(angle)
        const sy = cy + r * Math.sin(angle)

        return (
          <g key={i}>
            {/* Connection line */}
            <line
              x1={cx}
              y1={cy}
              x2={sx}
              y2={sy}
              stroke="url(#synth-edge)"
              strokeWidth="1.5"
              strokeDasharray="5,5"
              opacity="0.4"
            />
            {/* Animated pulse dot */}
            <circle r="3" fill="var(--color-accent-secondary)">
              <animate
                attributeName="cx"
                values={`${cx};${sx};${cx}`}
                dur="5s"
                begin={`${i * 0.4}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values={`${cy};${sy};${cy}`}
                dur="5s"
                begin={`${i * 0.4}s`}
                repeatCount="indefinite"
              />
            </circle>
            {/* Specialist node */}
            <circle
              cx={sx}
              cy={sy}
              r="34"
              fill="var(--color-background-primary)"
              stroke="var(--color-border-primary)"
              strokeWidth="1.5"
            >
              <animate
                attributeName="stroke"
                values="var(--color-border-primary);var(--color-accent-secondary);var(--color-border-primary)"
                dur={`${3 + i * 0.3}s`}
                repeatCount="indefinite"
              />
            </circle>
            <text
              x={sx}
              y={sy + 4}
              textAnchor="middle"
              fill="var(--color-text-primary)"
              fontSize="9"
              fontWeight="600"
            >
              {name.length > 14 ? `${name.slice(0, 12)}...` : name}
            </text>
          </g>
        )
      })}

      {/* Results merge arrow */}
      <text x={cx} y={cy + r + 70} textAnchor="middle" fill="var(--color-text-muted)" fontSize="10">
        {labels.results}
      </text>
      <line
        x1={cx}
        y1={cy + 50}
        x2={cx}
        y2={cy + r + 55}
        stroke="var(--color-accent-secondary)"
        strokeWidth="1.5"
        strokeDasharray="4,4"
        opacity="0.4"
      />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Tab 3: Self-Improving Patterns — cyclic feedback loop               */
/* ------------------------------------------------------------------ */

/**
 * Circular feedback loop diagram: Execute -> Observe -> Update -> Execute
 * with central label and animated traversal dot.
 */
function FeedbackLoopDiagram({ steps }: { steps: string[] }) {
  const cx = 400
  const cy = 160
  const r = 100
  const loopSteps = steps.slice(0, 4)

  return (
    <svg viewBox="0 0 800 340" className="w-full h-auto" role="img" aria-label="Self-improving feedback loop">
      <defs>
        <linearGradient id="loop-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-accent-primary)" />
          <stop offset="100%" stopColor="var(--color-accent-secondary)" />
        </linearGradient>
      </defs>

      {/* Central label */}
      <text x={cx} y={cy - 6} textAnchor="middle" fill="var(--color-accent-primary)" fontSize="12" fontWeight="700">
        Self-Improving
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="var(--color-accent-primary)" fontSize="12" fontWeight="700">
        Loop
      </text>

      {/* Loop ring */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#loop-grad)" strokeWidth="2" strokeDasharray="8,6" opacity="0.35" />

      {/* Animated orbiting dot */}
      <circle r="5" fill="var(--color-accent-primary)">
        <animateMotion
          dur="6s"
          repeatCount="indefinite"
          path={`M${cx + r},${cy} A${r},${r} 0 1,1 ${cx + r - 0.01},${cy}`}
        />
        <animate attributeName="opacity" values="0.6;1;0.6" dur="6s" repeatCount="indefinite" />
      </circle>

      {/* Step nodes around the ring */}
      {loopSteps.map((step, i) => {
        const angle = (i / loopSteps.length) * 2 * Math.PI - Math.PI / 2
        const nx = cx + (r + 60) * Math.cos(angle)
        const ny = cy + (r + 60) * Math.sin(angle)

        return (
          <g key={i}>
            {/* Spoke */}
            <line
              x1={cx + r * Math.cos(angle)}
              y1={cy + r * Math.sin(angle)}
              x2={nx}
              y2={ny}
              stroke="var(--color-accent-primary)"
              strokeWidth="1"
              strokeDasharray="3,3"
              opacity="0.3"
            />
            {/* Node */}
            <rect
              x={nx - 55}
              y={ny - 18}
              width={110}
              height={36}
              rx="10"
              fill="var(--color-background-primary)"
              stroke="var(--color-border-primary)"
              strokeWidth="1.5"
            />
            <text x={nx} y={ny + 4} textAnchor="middle" fill="var(--color-text-primary)" fontSize="9" fontWeight="600">
              {step}
            </text>
          </g>
        )
      })}

      {/* Additional detail cards below */}
      {[
        { label: steps[4] || 'Self-evaluation', x: 140, y: 290 },
        { label: steps[5] || 'Skill and workflow tools', x: 400, y: 290 },
        { label: steps[6] || 'Memory consolidation', x: 660, y: 290 },
      ].map((item, i) => (
        <g key={`detail-${i}`}>
          <rect
            x={item.x - 70}
            y={item.y}
            width={140}
            height={32}
            rx="8"
            fill="var(--color-background-glass, var(--color-background-secondary))"
            stroke="var(--color-border-primary)"
            strokeWidth="1"
          />
          <text x={item.x} y={item.y + 20} textAnchor="middle" fill="var(--color-text-muted)" fontSize="8" fontWeight="600">
            {item.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Export                                                         */
/* ------------------------------------------------------------------ */

/**
 * Emergent Capabilities section for the AgentOS landing page.
 *
 * Showcases three pillars of emergent runtime intelligence:
 * 1. Runtime Tool Forging — agents create new tools on the fly
 * 2. Agent Synthesis — orchestrators spawn specialist sub-agents
 * 3. Self-Improving Patterns — feedback loops that refine behaviour
 *
 * Uses a tabbed panel layout with SVG diagrams, framer-motion animations,
 * and ambient "forge spark" particle effects.
 */
export function EmergentSection() {
  const t = useTranslations('emergent')
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 })
  const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0)

  const tabs = useMemo(() => [
    { id: 0 as const, label: t('tabs.toolForging'), icon: Hammer },
    { id: 1 as const, label: t('tabs.agentSynthesis'), icon: Users },
    { id: 2 as const, label: t('tabs.selfImproving'), icon: RefreshCw },
  ], [t])

  const forgingSteps = useMemo(() => [
    t('forging.step1'),
    t('forging.step2'),
    t('forging.step3'),
    t('forging.step4'),
    t('forging.step5'),
  ], [t])

  const synthesisLabels = useMemo(() => ({
    orchestrator: t('synthesis.orchestrator'),
    specialists: [
      t('synthesis.specialist1'),
      t('synthesis.specialist2'),
      t('synthesis.specialist3'),
      t('synthesis.specialist4'),
    ],
    results: t('synthesis.resultsMerge'),
  }), [t])

  const loopSteps = useMemo(() => [
    t('loop.execute'),
    t('loop.observe'),
    t('loop.update'),
    t('loop.executeBetter'),
    t('loop.selfEvaluation'),
    t('loop.skillsAndWorkflows'),
    t('loop.memoryConsolidation'),
  ], [t])

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  }

  return (
    <section
      ref={sectionRef}
      id="emergent"
      className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        background: 'linear-gradient(175deg, var(--color-background-primary) 0%, var(--color-background-elevated) 100%)',
      }}
      aria-labelledby="emergent-heading"
    >
      {/* Ambient gradient blurs */}
      <div
        className="absolute top-[-100px] right-1/4 w-[600px] h-[600px] rounded-full blur-3xl opacity-[0.07] pointer-events-none"
        style={{ background: 'var(--color-accent-primary)' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-80px] left-1/3 w-[500px] h-[500px] rounded-full blur-3xl opacity-[0.06] pointer-events-none"
        style={{ background: 'var(--color-accent-secondary)' }}
        aria-hidden="true"
      />

      {/* Forge spark particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <ForgeParticles />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
          className="text-center mb-12"
        >
          <h2 id="emergent-heading" className="text-4xl sm:text-5xl font-extrabold mb-4">
            <span className="gradient-text">{t('title')}</span>
          </h2>
          <p className="text-lg max-w-3xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Tabbed panels */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: 0.2 } } }}
        >
          <div
            className="rounded-3xl overflow-hidden shadow-sm"
            style={{
              border: '1px solid var(--color-border-primary)',
              background: 'var(--color-background-primary)',
            }}
          >
            {/* Tab bar */}
            <div className="flex border-b" style={{ borderColor: 'var(--color-border-primary)' }} role="tablist" aria-label={t('title')}>
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-bold transition-all relative`}
                    style={{
                      color: isActive ? 'var(--color-accent-primary)' : 'var(--color-text-muted)',
                    }}
                    aria-selected={isActive}
                    role="tab"
                    id={`emergent-tab-${tab.id}`}
                    aria-controls={`emergent-panel-${tab.id}`}
                    aria-label={tab.label}
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="emergent-tab-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5"
                        style={{ background: 'linear-gradient(to right, var(--color-accent-primary), var(--color-accent-secondary))' }}
                      />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Tab content */}
            <div className="p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {activeTab === 0 && (
                  <motion.div
                    key="tab-forging"
                    role="tabpanel"
                    id="emergent-panel-0"
                    aria-labelledby="emergent-tab-0"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-6 overflow-x-auto">
                      <div className="min-w-[700px]">
                        <ToolForgingDiagram steps={forgingSteps} />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                          {t('forging.description')}
                        </p>
                      </div>
                      <div className="space-y-3">
                        {(t.raw('forging.details') as string[]).map((detail) => (
                          <div
                            key={detail}
                            className="flex items-start gap-2 text-xs"
                            style={{ color: 'var(--color-text-secondary)' }}
                          >
                            <span
                              className="mt-1 h-1.5 w-1.5 rounded-full shrink-0"
                              style={{ background: 'var(--color-accent-primary)' }}
                              aria-hidden="true"
                            />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 1 && (
                  <motion.div
                    key="tab-synthesis"
                    role="tabpanel"
                    id="emergent-panel-1"
                    aria-labelledby="emergent-tab-1"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-6 overflow-x-auto">
                      <div className="min-w-[600px]">
                        <AgentSynthesisDiagram labels={synthesisLabels} />
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed max-w-2xl mx-auto text-center" style={{ color: 'var(--color-text-secondary)' }}>
                      {t('synthesis.description')}
                    </p>
                  </motion.div>
                )}

                {activeTab === 2 && (
                  <motion.div
                    key="tab-loop"
                    role="tabpanel"
                    id="emergent-panel-2"
                    aria-labelledby="emergent-tab-2"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-6 overflow-x-auto">
                      <div className="min-w-[600px]">
                        <FeedbackLoopDiagram steps={loopSteps} />
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed max-w-2xl mx-auto text-center" style={{ color: 'var(--color-text-secondary)' }}>
                      {t('loop.description')}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: 0.35 } } }}
          className="text-center mt-10"
        >
          <a
            href="https://docs.agentos.sh/features/emergent-capabilities"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Zap className="w-5 h-5" />
            {t('ctaExploreDocs')}
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
