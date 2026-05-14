'use client'

import { useState, useMemo, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import {
  ArrowRight,
  Layers,
  Brain,
  Shield,
  Zap,
  Gauge,
  Eye,
  Users,
  User,
  MessageSquare,
  RotateCcw,
  TreePine,
  Workflow,
  Share2,
  BookOpen,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Strategy type definitions                                          */
/* ------------------------------------------------------------------ */

type StrategyId = 'single-agent' | 'sequential' | 'parallel' | 'debate' | 'review-loop' | 'hierarchical' | 'graph'

interface StrategyDef {
  id: StrategyId
  icon: typeof ArrowRight
  color: string
}

const STRATEGIES: StrategyDef[] = [
  { id: 'single-agent', icon: User, color: 'var(--color-text-muted)' },
  { id: 'sequential', icon: ArrowRight, color: 'var(--color-accent-primary)' },
  { id: 'parallel', icon: Layers, color: 'var(--color-accent-secondary)' },
  { id: 'debate', icon: MessageSquare, color: '#f59e0b' },
  { id: 'review-loop', icon: RotateCcw, color: '#10b981' },
  { id: 'hierarchical', icon: TreePine, color: '#8b5cf6' },
  { id: 'graph', icon: Workflow, color: '#ec4899' },
]

/* ------------------------------------------------------------------ */
/*  Code snippets per strategy                                         */
/* ------------------------------------------------------------------ */

const CODE_SNIPPETS: Record<StrategyId, string> = {
  'single-agent': `import { agent } from '@framers/agentos';

// One GMI brain. Cognition, memory, persona, tools live inside.
// No team, no shared state, no inter-agent flow.
const writer = agent({
  instructions: 'Research, draft, and polish an article.',
});

const { text } = await writer.generate('Write about quantum computing.');
// The agency tabs below show what composing a team of these brains adds:
// shared memory, shared RAG, inter-brain communication, orchestrated flow.`,

  sequential: `import { agency } from '@framers/agentos';

const pipeline = agency({
  agents: {
    researcher: { instructions: 'Gather facts.' },
    writer:     { instructions: 'Draft the article.' },
    editor:     { instructions: 'Polish for clarity.' },
  },
  strategy: 'sequential',
});

const { text } = await pipeline.generate('Write about quantum computing.');`,

  parallel: `import { agency } from '@framers/agentos';

const panel = agency({
  model: 'openai:gpt-4o',
  agents: {
    optimist:  { instructions: 'Argue in favour.' },
    pessimist: { instructions: 'Argue against.' },
    neutral:   { instructions: 'Give a balanced view.' },
  },
  strategy: 'parallel',
});

const { text } = await panel.generate('Should AI have legal rights?');`,

  debate: `import { agency } from '@framers/agentos';

const debaters = agency({
  model: 'openai:gpt-4o',
  agents: {
    proponent: { instructions: 'Defend your position.' },
    critic:    { instructions: 'Challenge every claim.' },
  },
  strategy: 'debate',
  maxRounds: 4,
});

const { text } = await debaters.generate('Remote vs. in-office work?');`,

  'review-loop': `import { agency } from '@framers/agentos';

const loop = agency({
  model: 'openai:gpt-4o',
  agents: {
    drafter:  { instructions: 'Draft a press release.' },
    reviewer: { instructions: 'Review for brand voice.' },
  },
  strategy: 'review-loop',
  maxRounds: 3,
});

const { text } = await loop.generate('Announce our product launch.');`,

  hierarchical: `import { agency } from '@framers/agentos';

const team = agency({
  model: 'openai:gpt-4o',
  agents: {
    manager:    { instructions: 'Coordinate the team.' },
    researcher: { instructions: 'Find information.' },
    coder:      { instructions: 'Write code.' },
    writer:     { instructions: 'Produce polished prose.' },
  },
  strategy: 'hierarchical',
});

const { text } = await team.generate('Explain quicksort.');`,

  graph: `import { agency } from '@framers/agentos';

const team = agency({
  agents: {
    researcher: {
      instructions: 'Research the topic thoroughly.',
    },
    writer: {
      instructions: 'Write from the research.',
      dependsOn: ['researcher'],
    },
    illustrator: {
      instructions: 'Describe illustrations.',
      dependsOn: ['researcher'],
    },
    reviewer: {
      instructions: 'Review article + illustrations.',
      dependsOn: ['writer', 'illustrator'],
    },
  },
  strategy: 'graph',
  memory: { shared: true },               // cognitive memory shared across brains
  rag: { vectorStore: 'in-memory', topK: 5 }, // shared retrieval corpus (RAG)
  // shared state scope: this generate() call
});`,
}

/* ------------------------------------------------------------------ */
/*  Shared capabilities row                                            */
/* ------------------------------------------------------------------ */

interface SharedCapability {
  icon: typeof Brain
  labelKey: string
}

const SHARED_CAPABILITIES: SharedCapability[] = [
  { icon: Brain, labelKey: 'sharedMemory' },
  { icon: BookOpen, labelKey: 'sharedRAG' },
  { icon: Share2, labelKey: 'sharedExecState' },
  { icon: Eye, labelKey: 'hitlGates' },
  { icon: Zap, labelKey: 'streamingOutput' },
  { icon: Gauge, labelKey: 'resourceControls' },
  { icon: Shield, labelKey: 'perAgentGuardrails' },
]

/* ------------------------------------------------------------------ */
/*  Flow dot animation helper                                          */
/* ------------------------------------------------------------------ */

/**
 * A small circle that travels along a path, creating a "data flowing"
 * visual effect consistent with the GMI section's streaming dots.
 */
function FlowDot({
  path,
  delay = 0,
  duration = 3,
  color = 'var(--color-accent-primary)',
}: {
  path: string
  delay?: number
  duration?: number
  color?: string
}) {
  return (
    <motion.circle
      r="3"
      fill={color}
      opacity={0.9}
    >
      <animateMotion
        path={path}
        dur={`${duration}s`}
        begin={`${delay}s`}
        repeatCount="indefinite"
        fill="freeze"
      />
      <animate
        attributeName="opacity"
        values="0;0.9;0.9;0"
        dur={`${duration}s`}
        begin={`${delay}s`}
        repeatCount="indefinite"
      />
    </motion.circle>
  )
}

/* ------------------------------------------------------------------ */
/*  Strategy SVG diagrams                                              */
/* ------------------------------------------------------------------ */

/**
 * Renders an agent node as a rounded rect with label. Consistently
 * styled across all strategy diagrams.
 */
function AgentNode({
  x,
  y,
  label,
  color = 'var(--color-accent-primary)',
  w = 90,
  h = 36,
  fontSize = 11,
}: {
  x: number
  y: number
  label: string
  color?: string
  w?: number
  h?: number
  fontSize?: number
}) {
  return (
    <g>
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rx={10}
        fill="var(--color-background-primary)"
        stroke={color}
        strokeWidth={1.5}
      />
      <text
        x={x}
        y={y + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--color-text-primary)"
        fontSize={fontSize}
        fontWeight={600}
        fontFamily="inherit"
      >
        {label}
      </text>
    </g>
  )
}

/** Single agent: Input -> one brain -> Output */
function SingleAgentDiagram({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <svg viewBox="0 0 520 80" className="w-full h-auto" aria-label={t('strategies.single-agent.name')}>
      <defs>
        <marker id="single-arrow" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="var(--color-text-muted)" />
        </marker>
      </defs>
      {/* Arrows */}
      <line x1="118" y1="40" x2="220" y2="40" stroke="var(--color-text-muted)" strokeWidth="1.5" markerEnd="url(#single-arrow)" opacity="0.6" />
      <line x1="320" y1="40" x2="422" y2="40" stroke="var(--color-text-muted)" strokeWidth="1.5" markerEnd="url(#single-arrow)" opacity="0.6" />
      {/* Flow dots */}
      <FlowDot path="M118,40 L220,40" delay={0} duration={2.5} color="var(--color-text-muted)" />
      <FlowDot path="M320,40 L422,40" delay={1.2} duration={2.5} color="var(--color-text-muted)" />
      {/* Nodes */}
      <AgentNode x={70} y={40} label={t('diagrams.input')} color="var(--color-text-muted)" w={76} />
      <AgentNode x={270} y={40} label={t('diagrams.singleAgent')} color="var(--color-text-muted)" w={92} />
      <AgentNode x={472} y={40} label={t('diagrams.output')} color="var(--color-text-muted)" w={76} />
    </svg>
  )
}

/** Sequential: A -> B -> C */
function SequentialDiagram({ t }: { t: ReturnType<typeof useTranslations> }) {
  const agents = [
    { x: 100, label: t('diagrams.agentA') },
    { x: 260, label: t('diagrams.agentB') },
    { x: 420, label: t('diagrams.agentC') },
  ]
  return (
    <svg viewBox="0 0 520 80" className="w-full h-auto" aria-label={t('strategies.sequential.name')}>
      <defs>
        <marker id="seq-arrow" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="var(--color-accent-primary)" />
        </marker>
      </defs>
      {/* Arrows */}
      <line x1="148" y1="40" x2="210" y2="40" stroke="var(--color-accent-primary)" strokeWidth="1.5" markerEnd="url(#seq-arrow)" opacity="0.6" />
      <line x1="308" y1="40" x2="370" y2="40" stroke="var(--color-accent-primary)" strokeWidth="1.5" markerEnd="url(#seq-arrow)" opacity="0.6" />
      {/* Flow dots */}
      <FlowDot path="M148,40 L210,40" delay={0} duration={2.5} />
      <FlowDot path="M308,40 L370,40" delay={1.2} duration={2.5} />
      {/* Nodes */}
      {agents.map((a) => (
        <AgentNode key={a.label} x={a.x} y={40} label={a.label} />
      ))}
    </svg>
  )
}

/** Parallel: fan-out from Input, fan-in to Synthesis */
function ParallelDiagram({ t }: { t: ReturnType<typeof useTranslations> }) {
  const agentY = [20, 60, 100]
  const labels = [t('diagrams.agentA'), t('diagrams.agentB'), t('diagrams.agentC')]
  return (
    <svg viewBox="0 0 520 120" className="w-full h-auto" aria-label={t('strategies.parallel.name')}>
      <defs>
        <marker id="par-arrow" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="var(--color-accent-secondary)" />
        </marker>
      </defs>
      {/* Fan-out lines */}
      {agentY.map((y, i) => (
        <g key={`fan-out-${i}`}>
          <line x1="110" y1="60" x2="195" y2={y} stroke="var(--color-accent-secondary)" strokeWidth="1.2" markerEnd="url(#par-arrow)" opacity="0.5" />
          <FlowDot path={`M110,60 L195,${y}`} delay={i * 0.4} duration={2.5} color="var(--color-accent-secondary)" />
        </g>
      ))}
      {/* Fan-in lines */}
      {agentY.map((y, i) => (
        <g key={`fan-in-${i}`}>
          <line x1="325" y1={y} x2="380" y2="60" stroke="var(--color-accent-secondary)" strokeWidth="1.2" markerEnd="url(#par-arrow)" opacity="0.5" />
          <FlowDot path={`M325,${y} L380,60`} delay={1.5 + i * 0.3} duration={2.5} color="var(--color-accent-secondary)" />
        </g>
      ))}
      {/* Nodes */}
      <AgentNode x={70} y={60} label={t('diagrams.input')} color="var(--color-text-muted)" w={76} />
      {agentY.map((y, i) => (
        <AgentNode key={labels[i]} x={260} y={y} label={labels[i]} color="var(--color-accent-secondary)" />
      ))}
      <AgentNode x={440} y={60} label={t('diagrams.synthesis')} color="var(--color-accent-secondary)" w={96} />
    </svg>
  )
}

/** Debate: circular arrows between agents with round counter */
function DebateDiagram({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <svg viewBox="0 0 520 120" className="w-full h-auto" aria-label={t('strategies.debate.name')}>
      <defs>
        <marker id="deb-arrow" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#f59e0b" />
        </marker>
      </defs>
      {/* Top arc: Proponent -> Critic */}
      <path d="M190,45 C260,0 300,0 370,45" fill="none" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#deb-arrow)" opacity="0.5" />
      {/* Bottom arc: Critic -> Proponent */}
      <path d="M370,75 C300,120 260,120 190,75" fill="none" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#deb-arrow)" opacity="0.5" />
      {/* Flow dots on arcs */}
      <FlowDot path="M190,45 C260,0 300,0 370,45" delay={0} duration={3} color="#f59e0b" />
      <FlowDot path="M370,75 C300,120 260,120 190,75" delay={1.5} duration={3} color="#f59e0b" />
      {/* Agent nodes */}
      <AgentNode x={150} y={60} label={t('diagrams.proponent')} color="#f59e0b" w={96} />
      <AgentNode x={410} y={60} label={t('diagrams.critic')} color="#f59e0b" w={96} />
      {/* Round counter */}
      <rect x="248" y="42" width="64" height="24" rx="12" fill="color-mix(in srgb, #f59e0b 15%, transparent)" stroke="#f59e0b" strokeWidth="1" />
      <text x="280" y="58" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight={700} fontFamily="inherit">
        {t('diagrams.roundN')}
      </text>
      {/* Judge node */}
      <AgentNode x={280} y={105} label={t('diagrams.judge')} color="#f59e0b" w={72} h={28} fontSize={10} />
      <line x1="280" y1="67" x2="280" y2="90" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />
    </svg>
  )
}

/** Review Loop: Drafter <-> Reviewer with Approved? gate */
function ReviewLoopDiagram({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <svg viewBox="0 0 520 110" className="w-full h-auto" aria-label={t('strategies.reviewLoop.name')}>
      <defs>
        <marker id="rev-arrow" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#10b981" />
        </marker>
      </defs>
      {/* Forward: Drafter -> Reviewer */}
      <line x1="185" y1="45" x2="290" y2="45" stroke="#10b981" strokeWidth="1.5" markerEnd="url(#rev-arrow)" opacity="0.6" />
      <FlowDot path="M185,45 L290,45" delay={0} duration={2.5} color="#10b981" />
      {/* Feedback loop: Reviewer -> Drafter (below) */}
      <path d="M310,63 C310,95 200,95 150,63" fill="none" stroke="#10b981" strokeWidth="1.2" markerEnd="url(#rev-arrow)" opacity="0.4" strokeDasharray="4,4" />
      <FlowDot path="M310,63 C310,95 200,95 150,63" delay={1.5} duration={3} color="#10b981" />
      {/* Approved? gate */}
      <polygon points="395,45 425,25 455,45 425,65" fill="var(--color-background-primary)" stroke="#10b981" strokeWidth="1.5" />
      <text x="425" y="49" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight={700} fontFamily="inherit">
        {t('diagrams.approved')}
      </text>
      <line x1="345" y1="45" x2="393" y2="45" stroke="#10b981" strokeWidth="1.5" markerEnd="url(#rev-arrow)" opacity="0.6" />
      {/* Output */}
      <line x1="457" y1="45" x2="495" y2="45" stroke="#10b981" strokeWidth="1.5" markerEnd="url(#rev-arrow)" opacity="0.6" />
      <text x="505" y="49" fill="var(--color-text-muted)" fontSize="10" fontWeight={600} fontFamily="inherit">
        {t('diagrams.output')}
      </text>
      {/* Nodes */}
      <AgentNode x={140} y={45} label={t('diagrams.drafter')} color="#10b981" w={96} />
      <AgentNode x={310} y={45} label={t('diagrams.reviewer')} color="#10b981" w={96} />
    </svg>
  )
}

/** Hierarchical: tree with orchestrator at top */
function HierarchicalDiagram({ t }: { t: ReturnType<typeof useTranslations> }) {
  const specialists = [
    { x: 130, label: t('diagrams.specialistA') },
    { x: 280, label: t('diagrams.specialistB') },
    { x: 430, label: t('diagrams.specialistC') },
  ]
  return (
    <svg viewBox="0 0 560 110" className="w-full h-auto" aria-label={t('strategies.hierarchical.name')}>
      <defs>
        <marker id="hier-arrow" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#8b5cf6" />
        </marker>
      </defs>
      {/* Lines from orchestrator to specialists */}
      {specialists.map((s, i) => (
        <g key={s.label}>
          <line x1="280" y1="36" x2={s.x} y2="72" stroke="#8b5cf6" strokeWidth="1.2" markerEnd="url(#hier-arrow)" opacity="0.5" />
          <FlowDot path={`M280,36 L${s.x},72`} delay={i * 0.5} duration={2.8} color="#8b5cf6" />
        </g>
      ))}
      {/* Orchestrator */}
      <AgentNode x={280} y={22} label={t('diagrams.orchestrator')} color="#8b5cf6" w={110} />
      {/* Specialists */}
      {specialists.map((s) => (
        <AgentNode key={s.label} x={s.x} y={88} label={s.label} color="#8b5cf6" w={100} />
      ))}
    </svg>
  )
}

/** Graph (DAG): nodes at different depths with tier lines */
function GraphDiagram({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <svg viewBox="0 0 560 140" className="w-full h-auto" aria-label={t('strategies.graph.name')}>
      <defs>
        <marker id="dag-arrow" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#ec4899" />
        </marker>
      </defs>
      {/* Tier lines */}
      {[0, 1, 2].map((tier) => {
        const x = 80 + tier * 170
        return (
          <g key={`tier-${tier}`}>
            <line x1={x - 50} y1="5" x2={x - 50} y2="135" stroke="var(--color-border-primary)" strokeWidth="1" strokeDasharray="3,6" opacity="0.3" />
            <text x={x - 46} y="14" fill="var(--color-text-muted)" fontSize="8" fontFamily="inherit" opacity="0.5">
              T{tier}
            </text>
          </g>
        )
      })}
      {/* Edges */}
      {/* Researcher -> Writer */}
      <line x1="145" y1="45" x2="210" y2="45" stroke="#ec4899" strokeWidth="1.2" markerEnd="url(#dag-arrow)" opacity="0.5" />
      <FlowDot path="M145,45 L210,45" delay={0} duration={2.5} color="#ec4899" />
      {/* Researcher -> Illustrator */}
      <line x1="145" y1="55" x2="210" y2="100" stroke="#ec4899" strokeWidth="1.2" markerEnd="url(#dag-arrow)" opacity="0.5" />
      <FlowDot path="M145,55 L210,100" delay={0.4} duration={2.5} color="#ec4899" />
      {/* Writer -> Reviewer */}
      <line x1="310" y1="45" x2="380" y2="70" stroke="#ec4899" strokeWidth="1.2" markerEnd="url(#dag-arrow)" opacity="0.5" />
      <FlowDot path="M310,45 L380,70" delay={1.2} duration={2.5} color="#ec4899" />
      {/* Illustrator -> Reviewer */}
      <line x1="310" y1="100" x2="380" y2="80" stroke="#ec4899" strokeWidth="1.2" markerEnd="url(#dag-arrow)" opacity="0.5" />
      <FlowDot path="M310,100 L380,80" delay={1.6} duration={2.5} color="#ec4899" />
      {/* Nodes */}
      <AgentNode x={100} y={50} label={t('diagrams.researcher')} color="#ec4899" w={96} />
      <AgentNode x={260} y={45} label={t('diagrams.writer')} color="#ec4899" w={90} />
      <AgentNode x={260} y={100} label={t('diagrams.illustrator')} color="#ec4899" w={96} />
      <AgentNode x={430} y={75} label={t('diagrams.reviewer')} color="#ec4899" w={96} />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Strategy Diagrams dispatcher                                       */
/* ------------------------------------------------------------------ */

function StrategyDiagram({ strategy, t }: { strategy: StrategyId; t: ReturnType<typeof useTranslations> }) {
  switch (strategy) {
    case 'single-agent':
      return <SingleAgentDiagram t={t} />
    case 'sequential':
      return <SequentialDiagram t={t} />
    case 'parallel':
      return <ParallelDiagram t={t} />
    case 'debate':
      return <DebateDiagram t={t} />
    case 'review-loop':
      return <ReviewLoopDiagram t={t} />
    case 'hierarchical':
      return <HierarchicalDiagram t={t} />
    case 'graph':
      return <GraphDiagram t={t} />
  }
}

/* ------------------------------------------------------------------ */
/*  Main exported component                                            */
/* ------------------------------------------------------------------ */

/**
 * **Parallel Agency Section**
 *
 * Dedicated landing page section showcasing multi-agent coordination
 * via the `agency()` API. Displays all 6 orchestration strategies as
 * interactive, selectable tabs with animated SVG flow diagrams,
 * contextual code snippets, and a shared-capabilities summary row.
 */
export function AgencySection() {
  const t = useTranslations('agencySection')
  const [activeStrategy, setActiveStrategy] = useState<StrategyId>('sequential')

  const activeStrategyDef = useMemo(
    () => STRATEGIES.find((s) => s.id === activeStrategy)!,
    [activeStrategy],
  )

  return (
    <section
      id="agency"
      className="py-12 sm:py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-theme section-gradient"
      aria-labelledby="agency-heading"
    >
      {/* Subtle organic gradient background */}
      <div className="absolute inset-0 organic-gradient opacity-20" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ---- Header ---- */}
        <div className="text-center mb-10">
          <h2
            id="agency-heading"
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

        {/* ---- Strategy tabs ---- */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {STRATEGIES.map((s) => {
            const Icon = s.icon
            const isActive = s.id === activeStrategy
            return (
              <button
                key={s.id}
                onClick={() => setActiveStrategy(s.id)}
                aria-pressed={isActive}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer"
                style={{
                  background: isActive
                    ? `color-mix(in srgb, ${s.color} 22%, var(--color-background-primary))`
                    : 'var(--color-background-glass)',
                  color: isActive ? s.color : 'var(--color-text-secondary)',
                  border: `1px solid ${isActive ? s.color : 'var(--color-border-primary)'}`,
                  boxShadow: isActive ? `0 0 16px color-mix(in srgb, ${s.color} 20%, transparent)` : 'none',
                }}
              >
                <Icon className="w-4 h-4" />
                {t(`strategies.${s.id}.name`)}
              </button>
            )
          })}
        </div>

        {/* ---- Active strategy card ---- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStrategy}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="glass-morphism rounded-3xl p-6 sm:p-8 shadow-modern-lg mb-10"
          >
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left: diagram + description */}
              <div>
                <h3
                  className="text-xl sm:text-2xl font-bold mb-2"
                  style={{ color: activeStrategyDef.color }}
                >
                  {t(`strategies.${activeStrategy}.name`)}
                </h3>
                <p
                  className="text-sm leading-relaxed mb-6"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {t(`strategies.${activeStrategy}.description`)}
                </p>

                {/* SVG diagram */}
                <div
                  className="rounded-2xl p-4 overflow-x-auto"
                  style={{
                    background: 'var(--color-background-secondary)',
                    border: '1px solid var(--color-border-primary)',
                  }}
                >
                  <StrategyDiagram strategy={activeStrategy} t={t} />
                </div>
              </div>

              {/* Right: code snippet */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ background: activeStrategyDef.color }}
                  />
                  <span
                    className="text-xs font-semibold uppercase tracking-wide"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {t('codeExampleLabel')}
                  </span>
                </div>
                <div
                  className="flex-1 rounded-2xl p-4 sm:p-5 font-mono text-xs sm:text-sm leading-relaxed overflow-auto"
                  style={{
                    background: 'var(--color-background-primary)',
                    border: '1px solid var(--color-border-primary)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  <pre className="whitespace-pre-wrap">{CODE_SNIPPETS[activeStrategy]}</pre>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ---- Shared Capabilities row ---- */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          className="rounded-2xl p-6 shadow-sm"
          style={{
            border: '1px solid var(--color-border-primary)',
            background: 'var(--color-background-secondary)',
          }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="h-2 w-10 rounded-full"
              style={{
                background:
                  'linear-gradient(to right, var(--color-accent-primary), var(--color-accent-secondary))',
              }}
            />
            <p
              className="text-sm font-semibold uppercase tracking-wide"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {t('sharedCapabilitiesTitle')}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {SHARED_CAPABILITIES.map((cap) => {
              const Icon = cap.icon
              return (
                <div
                  key={cap.labelKey}
                  className="flex items-center gap-3 rounded-xl p-3"
                  style={{
                    background: 'var(--color-background-glass)',
                    border: '1px solid var(--color-border-primary)',
                  }}
                >
                  <Icon
                    className="w-5 h-5 shrink-0"
                    style={{ color: 'var(--color-accent-primary)' }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {t(`sharedCapabilities.${cap.labelKey}`)}
                  </span>
                </div>
              )
            })}
          </div>
          <p
            className="text-xs mt-5 leading-relaxed"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <strong style={{ color: 'var(--color-text-secondary)' }}>
              {t('sharedCapabilitiesScopeNoteLabel')}
            </strong>{' '}
            {t.rich('sharedCapabilitiesScopeNote', {
              code: (chunks: ReactNode) => (
                <code
                  className="font-mono"
                  style={{
                    color: 'var(--color-accent-primary)',
                    background: 'var(--color-background-glass)',
                    padding: '0 4px',
                    borderRadius: '3px',
                  }}
                >
                  {chunks}
                </code>
              ),
              link: (chunks: ReactNode) => (
                <a
                  href="https://docs.agentos.sh/features/agency-api#shared-conversation-memory"
                  style={{ color: 'var(--color-accent-primary)' }}
                  className="underline-offset-2 hover:underline"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
        </motion.div>

        {/* ---- CTA ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <a
            href="https://docs.agentos.sh/features/agency-api"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Users className="w-5 h-5" />
            {t('ctaExploreDocs')}
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
