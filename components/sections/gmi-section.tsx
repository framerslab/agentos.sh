'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  Brain,
  Shield,
  Wrench,
  Workflow,
  Database,
  Fingerprint,
  Cpu,
  Radio,
  Check,
  X,
} from 'lucide-react'
import { useTranslations } from 'next-intl'

/* ------------------------------------------------------------------ */
/*  Layer definitions                                                   */
/* ------------------------------------------------------------------ */

type LayerId =
  | 'channels'
  | 'guardrails'
  | 'tools'
  | 'orchestration'
  | 'memory'
  | 'personality'
  | 'llmCore'

interface LayerDef {
  id: LayerId
  icon: typeof Brain
  /** CSS color — will use site variables where possible */
  color: string
  /** Radius of this ring in the SVG (outermost → innermost) */
  radius: number
  /** Ring thickness */
  thickness: number
}

/**
 * Seven concentric layers from outermost (channels) to innermost (LLM core).
 * Radii are tuned for a 500x500 SVG viewBox.
 */
const LAYERS: LayerDef[] = [
  { id: 'channels',      icon: Radio,       color: '#60a5fa', radius: 220, thickness: 28 },
  { id: 'guardrails',    icon: Shield,      color: '#f59e0b', radius: 188, thickness: 26 },
  { id: 'tools',         icon: Wrench,      color: '#34d399', radius: 158, thickness: 24 },
  { id: 'orchestration', icon: Workflow,     color: '#a78bfa', radius: 130, thickness: 22 },
  { id: 'memory',        icon: Database,    color: '#22d3ee', radius: 104, thickness: 20 },
  { id: 'personality',   icon: Fingerprint, color: '#f472b6', radius: 80,  thickness: 18 },
  { id: 'llmCore',       icon: Cpu,         color: '#fbbf24', radius: 52,  thickness: 30 },
]

/* ------------------------------------------------------------------ */
/*  Flow dot — data flowing between concentric rings                    */
/* ------------------------------------------------------------------ */

/**
 * A small circle that orbits along a circular path, creating
 * a "data flowing between layers" effect.
 */
function FlowDot({
  cx,
  cy,
  radius,
  delay = 0,
  duration = 6,
  color = 'var(--color-accent-primary)',
}: {
  cx: number
  cy: number
  radius: number
  delay?: number
  duration?: number
  color?: string
}) {
  return (
    <circle r="2.5" fill={color} opacity="0.7">
      <animateMotion
        path={`M${cx + radius},${cy} A${radius},${radius} 0 1,1 ${cx + radius - 0.01},${cy}`}
        dur={`${duration}s`}
        begin={`${delay}s`}
        repeatCount="indefinite"
      />
      <animate
        attributeName="opacity"
        values="0;0.8;0.8;0"
        dur={`${duration}s`}
        begin={`${delay}s`}
        repeatCount="indefinite"
      />
    </circle>
  )
}

/* ------------------------------------------------------------------ */
/*  Comparison rows                                                     */
/* ------------------------------------------------------------------ */

const COMPARISON_KEYS = [
  'identity',
  'memory',
  'behavior',
  'providers',
  'tools',
  'safety',
] as const

/* ------------------------------------------------------------------ */
/*  Code example                                                        */
/* ------------------------------------------------------------------ */

const CODE_EXAMPLE = `import { AgentOS, AgentOSResponseChunkType } from '@framers/agentos';

const agentos = await AgentOS.create();

for await (const chunk of agentos.processRequest({
  userId: 'user-42',
  sessionId: 'research-q1',
  selectedPersonaId: 'v_researcher',
  textInput: 'Analyze Q1 market trends in AI infrastructure.',
})) {
  if (chunk.type === AgentOSResponseChunkType.TEXT_DELTA) {
    process.stdout.write(chunk.textDelta);
  }
}`

/* ------------------------------------------------------------------ */
/*  Main exported component                                             */
/* ------------------------------------------------------------------ */

/**
 * **Anatomy of a GMI Section**
 *
 * Focused "What is a GMI?" explainer with:
 * - 7-layer interactive concentric ring diagram
 * - GMI vs Traditional Agent comparison
 * - Code example: `AgentOS.create()` and `processRequest()` streaming a GMI reply
 * - CTA to docs
 */
export function GMISection() {
  const t = useTranslations('gmiSection')
  const [activeLayer, setActiveLayer] = useState<LayerId>('llmCore')

  const activeLayerDef = LAYERS.find((l) => l.id === activeLayer)!
  const ActiveIcon = activeLayerDef.icon

  const CX = 250
  const CY = 250

  return (
    <section
      id="gmis"
      className="py-12 sm:py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-theme section-gradient"
      aria-labelledby="gmi-heading"
    >
      {/* Subtle organic gradient */}
      <div className="absolute inset-0 organic-gradient opacity-20" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ---- Header ---- */}
        <div className="text-center mb-10">
          <h2
            id="gmi-heading"
            className="text-4xl sm:text-5xl font-extrabold mt-4 mb-4"
          >
            <span className="gradient-text">{t('title')}</span>
          </h2>
          <p
            className="text-lg max-w-3xl mx-auto"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {t('subtitle')}
          </p>
        </div>

        {/* ---- Interactive Layered Diagram ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-morphism rounded-3xl p-6 sm:p-8 shadow-modern-lg mb-14"
        >
          <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-center">
            {/* SVG diagram */}
            <div className="relative aspect-square max-w-lg mx-auto w-full">
              <svg viewBox="0 0 500 500" className="w-full h-full">
                <defs>
                  {/* Soft glow filter for the LLM core pulse */}
                  <filter id="gmi-core-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Concentric ring layers (outermost first so innermost paints on top) */}
                {LAYERS.map((layer) => {
                  const isActive = activeLayer === layer.id
                  const isCore = layer.id === 'llmCore'
                  const _innerR = layer.radius - layer.thickness / 2
                  const _outerR = layer.radius + layer.thickness / 2

                  return (
                    <g key={layer.id}>
                      {/* Ring (as a thick circle stroke) */}
                      <circle
                        cx={CX}
                        cy={CY}
                        r={layer.radius}
                        fill="none"
                        stroke={layer.color}
                        strokeWidth={layer.thickness}
                        opacity={isActive ? 0.35 : 0.12}
                        className="transition-all duration-300"
                        style={{
                          filter: isCore && isActive ? 'url(#gmi-core-glow)' : undefined,
                        }}
                      />

                      {/* Clickable transparent hit area */}
                      <circle
                        cx={CX}
                        cy={CY}
                        r={layer.radius}
                        fill="none"
                        stroke="transparent"
                        strokeWidth={layer.thickness + 8}
                        className="cursor-pointer focus:outline-none"
                        style={{ outline: 'none' }}
                        onClick={() => setActiveLayer(layer.id)}
                        role="button"
                        tabIndex={0}
                        aria-label={t(`layers.${layer.id}.name`)}
                        aria-pressed={isActive}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            setActiveLayer(layer.id)
                          }
                        }}
                      />

                      {/* Active ring highlight */}
                      {isActive && (
                        <motion.circle
                          cx={CX}
                          cy={CY}
                          r={layer.radius}
                          fill="none"
                          stroke={layer.color}
                          strokeWidth={2}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0.4, 0.8, 0.4] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          style={{ filter: 'url(#gmi-core-glow)' }}
                        />
                      )}

                      {/* Label on the ring */}
                      <text
                        x={CX}
                        y={CY - layer.radius - (isCore ? -4 : layer.thickness / 2 + 6)}
                        textAnchor="middle"
                        fill={isActive ? layer.color : 'var(--color-text-muted)'}
                        fontSize={isCore ? 11 : 9}
                        fontWeight={isActive ? 700 : 400}
                        fontFamily="inherit"
                        className="transition-all duration-300 pointer-events-none select-none"
                        style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
                      >
                        {t(`layers.${layer.id}.name`)}
                      </text>
                    </g>
                  )
                })}

                {/* LLM Core filled center */}
                <motion.circle
                  cx={CX}
                  cy={CY}
                  r={LAYERS[LAYERS.length - 1].radius - LAYERS[LAYERS.length - 1].thickness / 2}
                  fill="#fbbf24"
                  opacity={0.08}
                  animate={{ opacity: [0.06, 0.14, 0.06] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Pulse animation on LLM core — uses explicit initial
                    to prevent framer-motion setting r to undefined before
                    the first animation frame */}
                <motion.circle
                  cx={CX}
                  cy={CY}
                  fill="#fbbf24"
                  filter="url(#gmi-core-glow)"
                  initial={{ r: 20, opacity: 0.3 }}
                  animate={{
                    r: [18, 28, 18],
                    opacity: [0.4, 0.1, 0.4],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />
                <circle cx={CX} cy={CY} r={8} fill="#fbbf24" opacity={0.6} />

                {/* Streaming flow dots orbiting between layers */}
                <FlowDot cx={CX} cy={CY} radius={220} delay={0} duration={12} color="#60a5fa" />
                <FlowDot cx={CX} cy={CY} radius={188} delay={1} duration={10} color="#f59e0b" />
                <FlowDot cx={CX} cy={CY} radius={158} delay={2} duration={9} color="#34d399" />
                <FlowDot cx={CX} cy={CY} radius={130} delay={0.5} duration={8} color="#a78bfa" />
                <FlowDot cx={CX} cy={CY} radius={104} delay={1.5} duration={7} color="#22d3ee" />
                <FlowDot cx={CX} cy={CY} radius={80} delay={0.8} duration={6} color="#f472b6" />

                {/* Radial flow dots (data moving inward) */}
                {[0, 90, 180, 270].map((angle, i) => {
                  const rad = (angle * Math.PI) / 180
                  const x1 = CX + 230 * Math.cos(rad)
                  const y1 = CY + 230 * Math.sin(rad)
                  const x2 = CX + 50 * Math.cos(rad)
                  const y2 = CY + 50 * Math.sin(rad)
                  return (
                    <circle key={`radial-${i}`} r="2" fill="var(--color-accent-primary)" opacity="0.6">
                      <animateMotion
                        path={`M${x1 - CX},${y1 - CY} L${x2 - CX},${y2 - CY}`}
                        dur="4s"
                        begin={`${i * 1}s`}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0;0.7;0.7;0"
                        dur="4s"
                        begin={`${i * 1}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  )
                })}
              </svg>
            </div>

            {/* Detail panel */}
            <div className="flex flex-col gap-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLayer}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className="rounded-2xl p-5"
                    style={{
                      background: `linear-gradient(135deg, color-mix(in srgb, ${activeLayerDef.color} 10%, transparent), transparent)`,
                      border: `1px solid color-mix(in srgb, ${activeLayerDef.color} 30%, transparent)`,
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{
                          background: `color-mix(in srgb, ${activeLayerDef.color} 20%, transparent)`,
                        }}
                      >
                        <ActiveIcon className="w-5 h-5" style={{ color: activeLayerDef.color }} />
                      </div>
                      <h3
                        className="text-lg font-bold"
                        style={{ color: activeLayerDef.color }}
                      >
                        {t(`layers.${activeLayer}.name`)}
                      </h3>
                    </div>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {t(`layers.${activeLayer}.description`)}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Layer quick-nav pills */}
              <div className="flex flex-wrap gap-1.5">
                {LAYERS.map((layer) => {
                  const isActive = activeLayer === layer.id
                  return (
                    <button
                      key={layer.id}
                      onClick={() => setActiveLayer(layer.id)}
                      className="rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 cursor-pointer"
                      style={{
                        background: isActive
                          ? `color-mix(in srgb, ${layer.color} 20%, transparent)`
                          : 'var(--color-background-glass)',
                        color: isActive ? layer.color : 'var(--color-text-muted)',
                        border: `1px solid ${isActive ? layer.color : 'var(--color-border-primary)'}`,
                      }}
                    >
                      {t(`layers.${layer.id}.name`)}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ---- GMI vs Traditional Agents ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <div className="text-center mb-8">
            <h3
              className="text-2xl sm:text-3xl font-bold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {t('comparisonTitle')}
            </h3>
          </div>

          <div className="max-w-3xl mx-auto space-y-2">
            {COMPARISON_KEYS.map((key, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="grid grid-cols-2 gap-3 rounded-xl overflow-hidden"
              >
                {/* Traditional */}
                <div
                  className="flex items-start gap-3 p-4 rounded-l-xl"
                  style={{
                    background:
                      i % 2 === 0
                        ? 'var(--color-background-secondary)'
                        : 'var(--color-background-glass)',
                    borderTop: '1px solid var(--color-border-primary)',
                    borderBottom: '1px solid var(--color-border-primary)',
                    borderLeft: '1px solid var(--color-border-primary)',
                  }}
                >
                  <X
                    className="w-4 h-4 mt-0.5 shrink-0"
                    style={{ color: 'var(--color-text-muted)' }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {t(`comparison.${key}.traditional`)}
                  </span>
                </div>

                {/* GMI */}
                <div
                  className="flex items-start gap-3 p-4 rounded-r-xl"
                  style={{
                    background:
                      i % 2 === 0
                        ? 'linear-gradient(135deg, color-mix(in srgb, var(--color-accent-primary) 8%, transparent), transparent)'
                        : 'linear-gradient(135deg, color-mix(in srgb, var(--color-accent-primary) 5%, transparent), transparent)',
                    borderTop: '1px solid color-mix(in srgb, var(--color-accent-primary) 20%, transparent)',
                    borderBottom: '1px solid color-mix(in srgb, var(--color-accent-primary) 20%, transparent)',
                    borderRight: '1px solid color-mix(in srgb, var(--color-accent-primary) 20%, transparent)',
                  }}
                >
                  <Check
                    className="w-4 h-4 mt-0.5 shrink-0"
                    style={{ color: 'var(--color-accent-primary)' }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {t(`comparison.${key}.gmi`)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Column headers — placed after rows for visual clarity on small screens */}
          <div className="max-w-3xl mx-auto grid grid-cols-2 gap-3 mt-3">
            <p
              className="text-xs font-semibold uppercase tracking-wide text-center"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {t('comparisonTraditionalLabel')}
            </p>
            <p
              className="text-xs font-semibold uppercase tracking-wide text-center"
              style={{ color: 'var(--color-accent-primary)' }}
            >
              {t('comparisonGmiLabel')}
            </p>
          </div>
        </motion.div>

        {/* ---- Code example ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="h-2 w-2 rounded-full"
                style={{ background: 'var(--color-accent-primary)' }}
              />
              <span
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {t('codeExampleLabel')}
              </span>
            </div>
            <div
              className="rounded-2xl p-5 font-mono text-xs sm:text-sm leading-relaxed overflow-auto"
              style={{
                background: 'var(--color-background-primary)',
                border: '1px solid var(--color-border-primary)',
                color: 'var(--color-text-secondary)',
              }}
            >
              <pre className="whitespace-pre-wrap">{CODE_EXAMPLE}</pre>
            </div>
          </div>
        </motion.div>

        {/* ---- CTA ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <a
            href="https://docs.agentos.sh/architecture/gmi"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Brain className="w-5 h-5" />
            {t('ctaExploreDocs')}
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
