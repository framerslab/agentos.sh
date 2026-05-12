'use client'

import { useState, useRef, useMemo } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Brain, ArrowRight, Repeat, Activity, Sliders } from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Background ambient particles                                       */
/* ------------------------------------------------------------------ */

/**
 * Subtle drifting particle effect that gives the section the same alive
 * feel as the Emergent counterpart, but in a cooler indigo/cyan palette
 * to read as "regulation" rather than "synthesis".
 */
function AdaptiveParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        cx: 50 + Math.random() * 800,
        startY: 380 + Math.random() * 40,
        endY: -20 - Math.random() * 60,
        r: 1.2 + Math.random() * 2.2,
        delay: Math.random() * 6,
        dur: 5 + Math.random() * 4,
      })),
    [],
  )

  return (
    <svg
      viewBox="0 0 900 420"
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <filter id="adaptive-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>
      {particles.map((p) => (
        <circle key={p.id} cx={p.cx} r={p.r} fill="var(--color-accent-primary)" filter="url(#adaptive-blur)" opacity="0.55">
          <animate
            attributeName="cy"
            values={`${p.startY};${p.endY}`}
            dur={`${p.dur}s`}
            begin={`${p.delay}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0;0.6;0.4;0"
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
/*  Tab 1: Three trigger types                                         */
/* ------------------------------------------------------------------ */

function TriggerTypesDiagram() {
  return (
    <svg viewBox="0 0 800 280" className="w-full h-auto" role="img" aria-label="Three metaprompt trigger types">
      <defs>
        <linearGradient id="trig-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-accent-primary)" />
          <stop offset="100%" stopColor="var(--color-accent-secondary)" />
        </linearGradient>
        <marker id="trig-arrow" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="var(--color-accent-primary)" />
        </marker>
      </defs>

      {/* Three lane columns */}
      {[
        { x: 30, label: 'turn_interval', sub: 'Periodic self-regulation', color: 'var(--color-accent-primary)' },
        { x: 290, label: 'event_based', sub: 'SentimentTracker-driven', color: 'var(--color-accent-secondary)' },
        { x: 550, label: 'manual', sub: 'Host- or tool-driven', color: 'var(--color-accent-primary)' },
      ].map((lane, i) => (
        <g key={i}>
          {/* Lane background */}
          <rect
            x={lane.x}
            y={20}
            width={220}
            height={240}
            rx={14}
            fill="var(--color-background-elevated)"
            stroke={lane.color}
            strokeOpacity={0.35}
            strokeWidth={1.2}
          />
          {/* Header */}
          <text x={lane.x + 16} y={48} fontSize="14" fontWeight={700} fill="var(--color-text-primary)">
            {lane.label}
          </text>
          <text x={lane.x + 16} y={66} fontSize="10" fill="var(--color-text-muted)" letterSpacing="0.04em">
            {lane.sub.toUpperCase()}
          </text>

          {/* Trigger condition box */}
          <rect
            x={lane.x + 16}
            y={80}
            width={188}
            height={56}
            rx={8}
            fill="var(--color-background-primary)"
            stroke="var(--color-border-primary)"
            strokeWidth={1.2}
          />
          <text x={lane.x + 26} y={100} fontFamily="ui-monospace, monospace" fontSize="10" fill="var(--color-text-primary)">
            {i === 0 && '{ type:'}
            {i === 1 && '{ type:'}
            {i === 2 && '{ type: '}
          </text>
          <text x={lane.x + 26} y={114} fontFamily="ui-monospace, monospace" fontSize="10" fill="var(--color-text-primary)">
            {i === 0 && "  'turn_interval',"}
            {i === 1 && "  'event_based',"}
            {i === 2 && "'manual' }"}
          </text>
          <text x={lane.x + 26} y={128} fontFamily="ui-monospace, monospace" fontSize="10" fill="var(--color-text-primary)">
            {i === 0 && '  intervalTurns: 5 }'}
            {i === 1 && '  eventName: ... }'}
            {i === 2 && ''}
          </text>

          {/* Fires when label */}
          <text
            x={lane.x + 16}
            y={156}
            fontSize="9"
            fontWeight={600}
            letterSpacing="0.08em"
            fill="var(--color-text-muted)"
          >
            FIRES WHEN
          </text>
          <text x={lane.x + 16} y={172} fontSize="11" fill="var(--color-text-secondary)">
            {i === 0 && 'Counter ≥ intervalTurns'}
            {i === 1 && 'Event in pending set'}
            {i === 2 && 'workingMemory flag set'}
          </text>
          <text x={lane.x + 16} y={188} fontSize="11" fill="var(--color-text-secondary)">
            {i === 0 && 'Resets on fire'}
            {i === 1 && '(Sentiment opt-in)'}
            {i === 2 && 'Cleared on fire'}
          </text>

          {/* Cost row */}
          <text
            x={lane.x + 16}
            y={216}
            fontSize="9"
            fontWeight={600}
            letterSpacing="0.08em"
            fill="var(--color-text-muted)"
          >
            COST WHEN FIRES
          </text>
          <text x={lane.x + 16} y={232} fontSize="11" fill={lane.color} fontWeight={600}>
            {i === 0 && '+1 LLM call per N turns'}
            {i === 1 && '+1 LLM call per event'}
            {i === 2 && '+1 LLM call per flag'}
          </text>
        </g>
      ))}

      {/* Soft divider arrow flowing into shared loop */}
      <text x={400} y={278} textAnchor="middle" fontSize="10" fill="var(--color-text-muted)">
        All three flow into the same MetapromptExecutor handler routing
      </text>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Tab 2: Five built-in presets                                       */
/* ------------------------------------------------------------------ */

function PresetsDiagram() {
  const presets = [
    { id: 'frustration_recovery', event: 'USER_FRUSTRATED', mood: 'empathetic', color: '#ef4444' },
    { id: 'confusion_clarification', event: 'USER_CONFUSED', mood: 'analytical', color: '#f59e0b' },
    { id: 'satisfaction_reinforcement', event: 'USER_SATISFIED', mood: 'curious', color: '#10b981' },
    { id: 'error_recovery', event: 'ERROR_THRESHOLD_EXCEEDED', mood: 'careful', color: '#8b5cf6' },
    { id: 'engagement_boost', event: 'LOW_ENGAGEMENT', mood: 'creative', color: '#06b6d4' },
  ]

  return (
    <svg viewBox="0 0 800 320" className="w-full h-auto" role="img" aria-label="Five built-in metaprompt presets">
      <defs>
        <marker id="preset-arrow" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 z" fill="var(--color-text-muted)" />
        </marker>
      </defs>

      {/* Column headers */}
      <text x={130} y={22} textAnchor="middle" fontSize="10" fontWeight={700} letterSpacing="0.08em" fill="var(--color-text-muted)">
        EVENT
      </text>
      <text x={400} y={22} textAnchor="middle" fontSize="10" fontWeight={700} letterSpacing="0.08em" fill="var(--color-text-muted)">
        PRESET HANDLER
      </text>
      <text x={680} y={22} textAnchor="middle" fontSize="10" fontWeight={700} letterSpacing="0.08em" fill="var(--color-text-muted)">
        TYPICAL MOOD UPDATE
      </text>

      {presets.map((p, i) => {
        const y = 50 + i * 50
        return (
          <g key={p.id}>
            {/* Event pill */}
            <rect
              x={20}
              y={y}
              width={220}
              height={36}
              rx={8}
              fill="var(--color-background-elevated)"
              stroke={p.color}
              strokeOpacity={0.45}
              strokeWidth={1.3}
            />
            <circle cx={36} cy={y + 18} r={4} fill={p.color} />
            <text x={48} y={y + 22} fontSize="11" fontFamily="ui-monospace, monospace" fill="var(--color-text-primary)">
              {p.event}
            </text>

            {/* Arrow */}
            <line
              x1={244}
              y1={y + 18}
              x2={278}
              y2={y + 18}
              stroke="var(--color-text-muted)"
              strokeWidth={1.2}
              strokeDasharray="3,3"
              markerEnd="url(#preset-arrow)"
            />

            {/* Preset id */}
            <rect
              x={282}
              y={y}
              width={236}
              height={36}
              rx={8}
              fill="var(--color-background-primary)"
              stroke="var(--color-border-primary)"
              strokeWidth={1.3}
            />
            <text x={294} y={y + 22} fontSize="11" fontFamily="ui-monospace, monospace" fontWeight={600} fill="var(--color-text-primary)">
              gmi_{p.id}
            </text>

            {/* Arrow */}
            <line
              x1={522}
              y1={y + 18}
              x2={556}
              y2={y + 18}
              stroke="var(--color-text-muted)"
              strokeWidth={1.2}
              strokeDasharray="3,3"
              markerEnd="url(#preset-arrow)"
            />

            {/* Mood */}
            <rect
              x={560}
              y={y}
              width={216}
              height={36}
              rx={8}
              fill="var(--color-background-elevated)"
              stroke="var(--color-accent-primary)"
              strokeOpacity={0.3}
              strokeWidth={1.2}
            />
            <text x={572} y={y + 22} fontSize="11" fill="var(--color-text-primary)">
              {p.mood}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Tab 3: State surfaces                                              */
/* ------------------------------------------------------------------ */

function StateSurfacesDiagram() {
  const surfaces = [
    { label: 'GMI mood', detail: 'onMoodUpdate(mood)' },
    { label: 'User context', detail: 'skillLevel · sentiment' },
    { label: 'Task context', detail: 'complexity · goal · phase' },
    { label: 'Working memory', detail: 'imprints persist across turns' },
    { label: 'HEXACO traits', detail: 'via AdaptPersonalityTool + drift' },
  ]

  return (
    <svg viewBox="0 0 800 280" className="w-full h-auto" role="img" aria-label="Five state surfaces metaprompts mutate">
      <defs>
        <radialGradient id="state-center" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-accent-primary)" stopOpacity={0.18} />
          <stop offset="100%" stopColor="var(--color-accent-primary)" stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Central hub */}
      <circle cx={400} cy={140} r={70} fill="url(#state-center)" />
      <circle cx={400} cy={140} r={52} fill="var(--color-background-primary)" stroke="var(--color-accent-primary)" strokeWidth={2} />
      <text x={400} y={134} textAnchor="middle" fontSize="11" fontWeight={700} fill="var(--color-accent-primary)">
        MetapromptExecutor
      </text>
      <text x={400} y={150} textAnchor="middle" fontSize="10" fill="var(--color-text-muted)">
        applyMetapromptUpdates()
      </text>

      {/* Five surface nodes positioned radially */}
      {surfaces.map((s, i) => {
        const angle = (i / surfaces.length) * 2 * Math.PI - Math.PI / 2
        const r = 105
        const cx = 400 + r * Math.cos(angle)
        const cy = 140 + r * Math.sin(angle)

        return (
          <g key={i}>
            {/* Connection line */}
            <line
              x1={400 + 52 * Math.cos(angle)}
              y1={140 + 52 * Math.sin(angle)}
              x2={cx - 6 * Math.cos(angle)}
              y2={cy - 6 * Math.sin(angle)}
              stroke="var(--color-accent-secondary)"
              strokeWidth={1.5}
              strokeDasharray="4,3"
              opacity={0.45}
            />
            {/* Animated pulse */}
            <circle r={2.8} fill="var(--color-accent-primary)">
              <animate
                attributeName="cx"
                values={`${400};${cx}`}
                dur="3.5s"
                begin={`${i * 0.5}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values={`${140};${cy}`}
                dur="3.5s"
                begin={`${i * 0.5}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;0.9;0"
                dur="3.5s"
                begin={`${i * 0.5}s`}
                repeatCount="indefinite"
              />
            </circle>
            {/* Surface node */}
            <rect
              x={cx - 92}
              y={cy - 22}
              width={184}
              height={44}
              rx={8}
              fill="var(--color-background-elevated)"
              stroke="var(--color-accent-secondary)"
              strokeOpacity={0.4}
              strokeWidth={1.3}
            />
            <text x={cx} y={cy - 6} textAnchor="middle" fontSize="11" fontWeight={700} fill="var(--color-text-primary)">
              {s.label}
            </text>
            <text x={cx} y={cy + 10} textAnchor="middle" fontSize="9" fill="var(--color-text-muted)">
              {s.detail}
            </text>
          </g>
        )
      })}

      <text x={400} y={266} textAnchor="middle" fontSize="10" fill="var(--color-text-muted)">
        Mutations flow back through callbacks · all reflected in next turn's prompt
      </text>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Export                                                         */
/* ------------------------------------------------------------------ */

/**
 * Adaptive Prompt Intelligence section for the /features page.
 *
 * Companion to EmergentSection — same visual rhythm (tabbed panel with SVG
 * diagrams + ambient particles), different content. Three tabs cover the
 * three substantive surfaces of adaptive intelligence:
 *
 *   1. Three trigger types — when metaprompts fire and what they cost
 *   2. Five built-in presets — sentiment-event-driven handlers
 *   3. State surfaces — what metaprompts actually mutate
 */
export function AdaptiveSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 })
  const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0)

  const tabs = [
    { id: 0 as const, label: 'Three Trigger Types', icon: Sliders },
    { id: 1 as const, label: 'Built-in Presets', icon: Activity },
    { id: 2 as const, label: 'State Surfaces', icon: Repeat },
  ]

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  }

  return (
    <section
      ref={sectionRef}
      id="adaptive"
      className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        background:
          'linear-gradient(175deg, var(--color-background-elevated) 0%, var(--color-background-primary) 100%)',
      }}
      aria-labelledby="adaptive-heading"
    >
      {/* Ambient gradient blurs */}
      <div
        className="absolute top-[-80px] left-1/3 w-[500px] h-[500px] rounded-full blur-3xl opacity-[0.06] pointer-events-none"
        style={{ background: 'var(--color-accent-secondary)' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-100px] right-1/4 w-[600px] h-[600px] rounded-full blur-3xl opacity-[0.07] pointer-events-none"
        style={{ background: 'var(--color-accent-primary)' }}
        aria-hidden="true"
      />

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <AdaptiveParticles />
      </div>

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
            style={{ color: 'var(--color-accent-secondary)' }}
          >
            Runtime Voice Surface
          </p>
          <h2 id="adaptive-heading" className="text-4xl sm:text-5xl font-extrabold mb-4">
            <span className="gradient-text">Adaptive Prompt Intelligence</span>
          </h2>
          <p
            className="text-lg max-w-3xl mx-auto"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Between turns, metaprompts re-tune mood, inferred user skill, task complexity,
            working-memory imprints, and HEXACO traits. Three trigger types decide when. Most
            turns fire nothing — adaptive overhead lands around $0.12 per 1000 turns on
            gpt-4o-mini at default cadence.
          </p>
        </motion.div>

        {/* Tabbed panel */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{
            ...fadeUp,
            visible: {
              ...fadeUp.visible,
              transition: { ...fadeUp.visible.transition, delay: 0.2 },
            },
          }}
        >
          <div
            className="rounded-3xl overflow-hidden shadow-sm"
            style={{
              border: '1px solid var(--color-border-primary)',
              background: 'var(--color-background-primary)',
            }}
          >
            {/* Tab bar */}
            <div
              className="flex border-b"
              style={{ borderColor: 'var(--color-border-primary)' }}
              role="tablist"
              aria-label="Adaptive Intelligence sections"
            >
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-bold transition-all relative"
                    style={{
                      color: isActive ? 'var(--color-accent-secondary)' : 'var(--color-text-muted)',
                    }}
                    aria-selected={isActive}
                    role="tab"
                    id={`adaptive-tab-${tab.id}`}
                    aria-controls={`adaptive-panel-${tab.id}`}
                    aria-label={tab.label}
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="adaptive-tab-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5"
                        style={{
                          background:
                            'linear-gradient(to right, var(--color-accent-secondary), var(--color-accent-primary))',
                        }}
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
                    key="tab-triggers"
                    role="tabpanel"
                    id="adaptive-panel-0"
                    aria-labelledby="adaptive-tab-0"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-6 overflow-x-auto">
                      <div className="min-w-[700px]">
                        <TriggerTypesDiagram />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          Three independent triggers decide when a metaprompt fires. They
                          compose: a single persona can ship one periodic self-reflection,
                          three event-based recovery presets, and a manual host flag for
                          tool-driven re-plans, all running on independent cadences.
                        </p>
                      </div>
                      <div className="space-y-3">
                        {[
                          'turn_interval — runs every Nth user turn (counter persists in working memory across sessions)',
                          'event_based — fires when SentimentTracker emits a matching GMIEvent like USER_FRUSTRATED',
                          'manual — host code or tools set a flag in working memory; cleared on fire',
                        ].map((detail) => (
                          <div
                            key={detail}
                            className="flex items-start gap-2 text-xs"
                            style={{ color: 'var(--color-text-secondary)' }}
                          >
                            <span
                              className="mt-1 h-1.5 w-1.5 rounded-full shrink-0"
                              style={{ background: 'var(--color-accent-secondary)' }}
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
                    key="tab-presets"
                    role="tabpanel"
                    id="adaptive-panel-1"
                    aria-labelledby="adaptive-tab-1"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-6 overflow-x-auto">
                      <div className="min-w-[700px]">
                        <PresetsDiagram />
                      </div>
                    </div>
                    <p
                      className="text-sm leading-relaxed max-w-3xl mx-auto text-center"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      Five preset handlers ship with the runtime. SentimentTracker emits the
                      matching event when consecutive turns cross a threshold (default 2),
                      the preset fires, and an LLM call writes back the recommended mood,
                      user-skill, and task-complexity updates. Personas can override any
                      preset by defining a metaprompt with the same ID.
                    </p>
                  </motion.div>
                )}

                {activeTab === 2 && (
                  <motion.div
                    key="tab-state"
                    role="tabpanel"
                    id="adaptive-panel-2"
                    aria-labelledby="adaptive-tab-2"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-6 overflow-x-auto">
                      <div className="min-w-[700px]">
                        <StateSurfacesDiagram />
                      </div>
                    </div>
                    <p
                      className="text-sm leading-relaxed max-w-3xl mx-auto text-center"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      Five surfaces, five callbacks. The executor never mutates GMI internals
                      directly; everything flows through callbacks the GMI registered at
                      construction. Mood, user context, and task context reset between
                      sessions; working-memory imprints persist for the session; HEXACO trait
                      drift persists across sessions through the persona overlay.
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
          variants={{
            ...fadeUp,
            visible: {
              ...fadeUp.visible,
              transition: { ...fadeUp.visible.transition, delay: 0.35 },
            },
          }}
          className="text-center mt-10"
        >
          <a
            href="https://docs.agentos.sh/features/adaptive-prompt-intelligence"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Brain className="w-5 h-5" />
            Read the full guide
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
