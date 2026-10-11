'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  Code2,
  Globe,
  Package,
  Database,
  Terminal,
  Users,
  Shield,
  UserCheck,
  Zap,
  GitBranch,
  Search,
  Sparkles,
  Brain,
  type LucideIcon
} from 'lucide-react'
import { CodePopover } from '../ui/code-popover'
import { useTranslations } from 'next-intl'

interface FeatureCard {
  icon: LucideIcon
  title: string
  body: string
  pill: string
  gradient: string
  bullets?: string[]
  codeExample: {
    title: string
    language: string
    code: string
  }
}

export default function FeaturesGridClient() {
  const t = useTranslations('features')
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.2 })
  
  const featureCards: FeatureCard[] = [
    {
      icon: Users,
      title: t('multiAgent.title'),
      body: t('multiAgent.description'),
      pill: t('multiAgent.pill'),
      gradient: 'from-violet-500 to-purple-500',
      bullets: [t('multiAgent.bullet1'), t('multiAgent.bullet2')],
      codeExample: {
        title: 'Multi-Agent Setup',
        language: 'typescript',
        code: `import { agency } from '@framers/agentos'

const team = agency({
  provider: 'openai', model: 'gpt-4o',   // merges the parallel answers
  strategy: 'parallel',
  agents: {
    researcher: { provider: 'openai', model: 'gpt-4o', instructions: 'Research the topic.' },
    analyst:    { provider: 'anthropic', model: 'claude-sonnet-4-6', instructions: 'Analyze findings.' },
    executor:   { provider: 'ollama', model: 'llama3', instructions: 'Execute the plan.' },
  },
})
const result = await team.generate('Plan a product launch')`
      }
    },
    {
      icon: Shield,
      title: t('guardrails.title'),
      body: t('guardrails.description'),
      pill: t('guardrails.pill'),
      gradient: 'from-emerald-500 to-green-500',
      bullets: [t('guardrails.bullet1'), t('guardrails.bullet2')],
      codeExample: {
        title: 'Safety Primitives',
        language: 'typescript',
        code: `import { agent } from '@framers/agentos'

// agent() runs no guardrail packs; they run on the full AgentOS runtime.
// Its own limits: a tool-step cap, an output cap and a spend budget.
const safeAgent = agent({
  provider: 'openai', model: 'gpt-4o',
  instructions: 'You are a helpful assistant.',
  maxSteps: 5,                 // limits runaway tool loops
  maxTokens: 8000,             // caps output length
  budget: { maxCostUSD: 1 },   // refuses a call that would pass $1
})
const result = await safeAgent.generate('Summarize this document')`
      }
    },
    {
      icon: UserCheck,
      title: 'Human-in-the-Loop',
      body: 'Pause an agency run before a tool call, an agent, an emergent spawn or the final return. Route the pending action to a human, an LLM judge with fallback, a webhook or Slack, all on one decision contract.',
      pill: '4 triggers · 6 handlers',
      gradient: 'from-cyan-500 to-blue-500',
      bullets: [
        'beforeTool · beforeAgent · beforeEmergent · beforeReturn',
        'hitl.cli() · hitl.llmJudge() · hitl.slack() · hitl.webhook() · auto-approve/reject',
      ],
      codeExample: {
        title: 'HITL — LLM judge with CLI fallback',
        language: 'typescript',
        code: `import { agency, hitl } from '@framers/agentos'

// Cheap judge handles most approvals; humans only see the uncertain calls.
const guarded = agency({
  agents: { worker: { instructions: 'Execute tasks.' } },
  hitl: {
    approvals: {
      beforeTool: ['delete-file', 'send-email'],
      beforeReturn: true,
    },
    handler: hitl.llmJudge({
      model: 'gpt-4o-mini',
      criteria: 'Approve unless the action deletes data, sends messages, or spends > $1.',
      confidenceThreshold: 0.8,
      fallback: hitl.cli(), // escalate uncertain calls
    }),
    timeoutMs: 60_000,
    onTimeout: 'reject',
  },
})

// Full HITL guide: https://docs.agentos.sh/features/human-in-the-loop`,
      }
    },
    {
      icon: Sparkles,
      title: 'Emergent Tool Forging',
      body: 'Hierarchical agencies spawn specialist agents mid-run when the static roster falls short, and agents on the full AgentOS runtime can forge new tools. Each capability has its own budget.',
      pill: 'forge_tool · spawn_specialist · adapt_personality',
      gradient: 'from-fuchsia-500 to-pink-500',
      bullets: [
        'Manager-tier agent decides at runtime when to synthesize capability',
        'An LLM judge reviews each new agent spec before it joins the roster',
      ],
      codeExample: {
        title: 'Emergent capabilities',
        language: 'typescript',
        code: `import { agency } from '@framers/agentos'

// Hierarchical + emergent: the manager can spawn specialists
// when the static roster cannot cover the task.
const team = agency({
  provider: 'openai', model: 'gpt-4o',   // the manager
  strategy: 'hierarchical',
  agents: {
    researcher: { instructions: 'Gather information from the web.' },
    analyst:    { instructions: 'Synthesize findings into a report.' },
  },
  emergent: {
    enabled: true,                    // unlocks spawn_specialist
    judge: true,                      // an LLM judge reviews each spec
    planner: { maxSpecialists: 2 },   // cap on spawns per run
  },
})
const result = await team.generate('Investigate a novel domain')

// Full guide: https://docs.agentos.sh/features/emergent-capabilities`,
      }
    },
    {
      icon: Brain,
      title: 'Adaptive Prompt Intelligence',
      body: 'Three trigger types (periodic, sentiment-event, manual) drive metaprompts that re-tune mood, user-skill inference and task complexity between turns. Sentiment tracking and metaprompts are opt-in.',
      pill: '3 triggers · 5 presets',
      gradient: 'from-indigo-500 to-violet-500',
      bullets: [
        'turn_interval · event_based · manual triggers, all opt-in',
        'SentimentTracker emits frustrated / confused / satisfied / low-engagement events',
      ],
      codeExample: {
        title: 'Adaptive metaprompts',
        language: 'typescript',
        code: `import { AgentOS, type IPersonaDefinition } from '@framers/agentos'

// sentimentTracking and metaPrompts belong to a persona on the full runtime.
// Sentiment events drive recovery presets; a self-reflection every 5 turns
// re-reads mood, user skill and task complexity.
const tutor: IPersonaDefinition = {
  id: 'tutor',
  name: 'Tutor',
  description: 'A patient programming tutor.',
  version: '1.0.0',
  baseSystemPrompt: 'You are a patient programming tutor.',
  defaultProviderId: 'openai',
  defaultModelId: 'gpt-4o-mini',
  sentimentTracking: {
    enabled: true,
    presets: ['frustration_recovery', 'confusion_clarification', 'satisfaction_reinforcement'],
  },
  metaPrompts: [{
    id: 'gmi_self_trait_adjustment',
    promptTemplate: 'Review {{evidence}}. Respond JSON with optional updatedGmiMood, updatedUserSkillLevel, updatedTaskComplexity.',
    trigger: { type: 'turn_interval', intervalTurns: 5 },
    temperature: 0.3,
  }],
}

const agentos = await AgentOS.create({ personas: [tutor] })

// Full guide: https://docs.agentos.sh/features/adaptive-prompt-intelligence`,
      }
    },
    {
      icon: Zap,
      title: t('streaming.title'),
      body: t('streaming.description'),
      pill: t('streaming.pill'),
      gradient: 'from-amber-500 to-orange-500',
      bullets: [t('streaming.bullet1'), t('streaming.bullet2')],
      codeExample: {
        title: 'Streaming Response',
        language: 'typescript',
        code: `import { streamText } from '@framers/agentos'

const stream = streamText({
  provider: 'openai', model: 'gpt-4o',
  prompt: userInput,
})
for await (const chunk of stream.textStream) {
  process.stdout.write(chunk)
}
const fullText = await stream.text`
      }
    },
    {
      icon: Package,
      title: t('toolPacks.title'),
      body: t('toolPacks.description'),
      pill: t('toolPacks.pill'),
      gradient: 'from-blue-500 to-cyan-500',
      bullets: [t('toolPacks.bullet1'), t('toolPacks.bullet2')],
      codeExample: {
        title: 'Tool Pack Integration',
        language: 'typescript',
        code: `import { AgentOS } from '@framers/agentos'
import { createCuratedManifest } from '@framers/agentos-extensions-registry'

// Builds manifest entries for the installed packs; packs that are
// not installed are skipped.
const manifest = await createCuratedManifest({
  tools: ['web-search', 'news-search', 'image-generation'],
  channels: ['telegram', 'discord'],
})

const agentos = await AgentOS.create({ extensionManifest: manifest })`
      }
    },
    {
      icon: GitBranch,
      title: t('workflow.title'),
      body: t('workflow.description'),
      pill: t('workflow.pill'),
      gradient: 'from-rose-500 to-pink-500',
      bullets: [t('workflow.bullet1'), t('workflow.bullet2')],
      codeExample: {
        title: 'Workflow Definition',
        language: 'typescript',
        code: `import { agency } from '@framers/agentos'

// Use 'graph' strategy with dependsOn for DAG workflows
const pipeline = agency({
  provider: 'openai', model: 'gpt-4o',
  strategy: 'graph',
  agents: {
    fetcher:     { instructions: 'Fetch raw data.', dependsOn: [] },
    transformer: { instructions: 'Process data.', dependsOn: ['fetcher'] },
    storer:      { instructions: 'Save results.', dependsOn: ['transformer'] },
  },
})
const result = await pipeline.generate('Run the data pipeline')`
      }
    },
    {
      icon: Globe,
      title: t('language.title'),
      body: t('language.description'),
      pill: t('language.pill'),
      gradient: 'from-purple-500 to-pink-500',
      bullets: [t('language.bullet1'), t('language.bullet2')],
      codeExample: {
        title: 'Language Support',
        language: 'typescript',
        code: `import { generateText } from '@framers/agentos'

// The model handles language natively — just prompt in any language
const result = await generateText({
  provider: 'openai', model: 'gpt-4o',
  system: 'Always reply in the same language the user writes in.',
  prompt: 'AIの最新動向を教えてください',  // Japanese
})
console.log(result.text)  // Responds in Japanese`
      }
    },
    {
      icon: Database,
      title: t('storage.title'),
      body: t('storage.description'),
      pill: t('storage.pill'),
      gradient: 'from-green-500 to-emerald-500',
      bullets: [t('storage.bullet1'), t('storage.bullet2')],
      codeExample: {
        title: 'Session Memory',
        language: 'typescript',
        code: `import { agent } from '@framers/agentos'

// Agents have built-in session memory (enabled by default)
const myAgent = agent({
  provider: 'openai', model: 'gpt-4o',
  instructions: 'You are a persistent assistant.',
})
const session = myAgent.session('user-42')
await session.send('Remember: my favorite color is blue')
const reply = await session.send('What is my favorite color?')
// => "Your favorite color is blue."`
      }
    },
    {
      icon: Terminal,
      title: t('workbench.title'),
      body: t('workbench.description'),
      pill: t('workbench.pill'),
      gradient: 'from-orange-500 to-red-500',
      bullets: [t('workbench.bullet1'), t('workbench.bullet2'), t('workbench.bullet3')],
      codeExample: {
        title: 'Dev Workbench',
        language: 'bash',
        code: `# Run the Workbench from a clone
git clone https://github.com/framerslab/agentos-workbench.git
cd agentos-workbench
pnpm install && (cd backend && npm ci)
pnpm dev   # opens http://localhost:5175`
      }
    },
    {
      icon: Search,
      title: t('capabilityDiscovery.title'),
      body: t('capabilityDiscovery.description'),
      pill: t('capabilityDiscovery.pill'),
      gradient: 'from-teal-500 to-cyan-500',
      bullets: [t('capabilityDiscovery.bullet1'), t('capabilityDiscovery.bullet2')],
      codeExample: {
        title: 'Capability Discovery',
        language: 'typescript',
        code: `const result = await discoveryEngine.discover(
  'search the web for AI news'
);
// Default token budgets per tier:
// Tier 0: category summaries (200)
// Tier 1: top-5 relevant capabilities (800)
// Tier 2: full schemas for the top 2 (2,000)`
      }
    }
  ]

  // Puzzle piece animation variants for falling into place
  const puzzleVariants = {
    hidden: (index: number) => ({
      opacity: 0,
      y: -80,
      x: index % 2 === 0 ? -30 : 30,
      rotate: index % 2 === 0 ? -8 : 8,
      scale: 0.9,
    }),
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      x: 0,
      rotate: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: index * 0.1,
        duration: 0.6,
      },
    }),
  }

  return (
    <section 
      id="features" 
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      ref={containerRef}
    >
      {/* Background subtle gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% 0%, var(--color-accent-primary)/0.08, transparent 60%)',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl mb-4 font-bold gradient-text">
            {t('sectionTitle')}
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-3xl mx-auto">
            {t('sectionSubtitle')}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featureCards.map((card, index) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.title}
                custom={index}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                variants={puzzleVariants}
                className="group relative"
              >
                {/* Puzzle piece card */}
                <div 
                  className="relative h-full p-6 rounded-xl bg-[var(--color-background-card)] border-2 border-[var(--color-border-subtle)] hover:border-[var(--color-accent-primary)] transition-all duration-300 overflow-hidden"
                  style={{
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  }}
                >
                  {/* Puzzle notch indicators */}
                  <div className="absolute -top-1 left-1/4 w-8 h-2 bg-[var(--color-accent-primary)]/20 rounded-b-full" />
                  <div className="absolute -bottom-1 right-1/4 w-8 h-2 bg-[var(--color-accent-secondary)]/20 rounded-t-full" />
                  
                  {/* Subtle gradient background on hover */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(135deg, var(--color-accent-primary)/0.05, var(--color-accent-secondary)/0.05)`,
                    }}
                  />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white shadow-lg mb-4`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Pill and Code Button */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[var(--color-accent-primary)]/10 text-xs font-semibold text-[var(--color-accent-primary)]">
                        {card.pill}
                      </span>
                      <CodePopover
                        examples={[card.codeExample]}
                        trigger={
                          <button 
                            className="p-1.5 rounded-lg hover:bg-[var(--color-accent-primary)]/10 transition-colors"
                            aria-label={`View code example for ${card.title}`}
                          >
                            <Code2 className="w-4 h-4 text-[var(--color-accent-primary)]" />
                          </button>
                        }
                        position="bottom"
                      />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2 group-hover:text-[var(--color-accent-primary)] transition-colors">
                      {card.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-[var(--color-text-secondary)] mb-4 line-clamp-3">
                      {card.body}
                    </p>

                    {/* Bullets */}
                    {card.bullets && (
                      <ul className="space-y-1.5">
                        {card.bullets.slice(0, 2).map((bullet) => (
                          <li key={bullet} className="flex items-start gap-2 text-xs text-[var(--color-text-muted)]">
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-[var(--color-accent-primary)] shrink-0" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
