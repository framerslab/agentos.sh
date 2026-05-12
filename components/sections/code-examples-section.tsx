'use client'

import { useState, useEffect, useMemo } from 'react'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { motion } from 'framer-motion'
import { Copy, Check, Code2, Cpu, Database, GitBranch, Sparkles, Play, Book } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface CodeExample {
  id: string
  title: string
  description: string
  language: string
  code: string
  category: 'basic' | 'advanced' | 'integration' | 'deployment'
}

export function CodeExamplesSection() {
  const t = useTranslations('codeExamples')
  const tFooter = useTranslations('footer')

  const codeExamples: CodeExample[] = useMemo(() => ([
  {
    id: 'basic-agent',
    title: t('examples.basicAgent.title'),
    description: t('examples.basicAgent.description'),
    language: 'typescript',
    category: 'basic',
    code: `import { agent } from '@framers/agentos'

// Define a tool — any object matching the ITool shape works
const calculatorTool = {
  name: 'calculator',
  description: 'Performs basic math operations',
  inputSchema: {
    type: 'object',
    properties: {
      operation: { type: 'string', enum: ['add', 'multiply', 'divide'] },
      a: { type: 'number' },
      b: { type: 'number' },
    },
    required: ['operation', 'a', 'b'],
  },
  execute: async (args) => {
    const { operation, a, b } = args
    switch (operation) {
      case 'add':      return { success: true, output: a + b }
      case 'multiply': return { success: true, output: a * b }
      case 'divide':   return { success: true, output: b !== 0 ? a / b : 'Division by zero' }
      default:         return { success: false, error: 'Unknown operation' }
    }
  },
}

// Create an agent — provider picks the default model, override with model: when needed
const mathAgent = agent({
  provider: 'anthropic',                       // or 'openai', 'gemini', etc. (16 supported)
  model: 'claude-haiku-4-5-20251001',          // optional: omit to use the provider default
  instructions: 'You are a helpful math assistant. Use the calculator tool.',
  tools: [calculatorTool],                     // agent auto-selects the right tool per step
  maxSteps: 5,                                 // cap agentic loops at 5 iterations
})

// .generate() runs the full tool-use loop and returns the final answer
const result = await mathAgent.generate('What is 42 multiplied by 17?')
console.log(result.text)           // => "42 multiplied by 17 equals 714."
console.log(result.toolCalls)      // => [{ toolName: 'calculator', args: { ... }, result: 714 }]`
  },
  {
    id: 'gmi-roles',
    title: t('examples.gmiRoles.title'),
    description: t('examples.gmiRoles.description'),
    language: 'typescript',
    category: 'advanced',
    code: `import { agency } from '@framers/agentos'

// Multi-agent team — each agent gets its own provider + personality
const researchTeam = agency({
  strategy: 'graph',              // dependency-based DAG execution
  memory: { shared: true },       // agents share conversation context
  agents: {
    researcher: {
      provider: 'anthropic',                       // Claude for deep reasoning
      model: 'claude-sonnet-4-5-20250929',
      instructions: 'Find accurate, well-sourced information on the topic.',
    },
    writer: {
      provider: 'openai',                          // GPT for natural prose
      model: 'gpt-4o-mini',
      instructions: 'Write a clear, well-structured article for professionals.',
      dependsOn: ['researcher'],                   // runs after researcher finishes
    },
    reviewer: {
      provider: 'gemini',                          // Gemini for cross-checking facts
      model: 'gemini-2.5-flash',
      instructions: 'Review the article for accuracy, clarity, and tone.',
      dependsOn: ['writer'],
    },
  },
})

// Same .generate() interface as a single agent
const result = await researchTeam.generate(
  'Compare TCP vs UDP for real-time game networking'
)

console.log(result.text)           // final polished article
console.log(result.agentCalls)     // trace of which agent did what

// 6 strategies: sequential, parallel, debate, review-loop, hierarchical, graph`
  },
  {
    id: 'memory-system',
    title: t('examples.memorySystem.title'),
    description: t('examples.memorySystem.description'),
    language: 'typescript',
    category: 'advanced',
    code: `import { agent } from '@framers/agentos'

// Personality traits (HEXACO model) shape tone, verbosity, creativity
const tutor = agent({
  provider: 'anthropic',
  model: 'claude-sonnet-4-5-20250929',
  instructions: 'You are a patient computer science tutor.',
  personality: {
    openness: 0.9,                // creative, exploratory answers
    conscientiousness: 0.95,      // thorough, well-structured
    agreeableness: 0.85,          // warm, encouraging tone
  },
  memory: {
    enabled: true,                // session history persists automatically
    cognitive: true,              // Ebbinghaus decay, reconsolidation, involuntary recall
  },
})

// Sessions scope conversation history by ID
const session = tutor.session('student-1')

// The agent remembers everything within the session
await session.send('My exam is on distributed systems next Thursday.')
await session.send('I struggle with consensus algorithms.')

// Context from earlier turns is recalled automatically
const reply = await session.send('What should I focus on this week?')
console.log(reply.text)
// => References the Thursday exam and suggests Paxos/Raft study plan

// Inspect conversation history and token usage
console.log(session.messages())
const usage = await session.usage()
console.log(\`Total tokens: \${usage.totalTokens}\`)`
  },
  {
    id: 'hexaco-agent',
    title: 'HEXACO agent with memory',
    description: 'Configure an agent with personality + cognitive memory in one declaration. Six trait values shape voice and tone; memory persists across sessions automatically.',
    language: 'typescript',
    category: 'basic',
    code: `import { agent } from '@framers/agentos'

// Personality is six 0-1 trait values. The runtime appends a trait-derived
// directive to the system prompt and modulates three cognitive-memory
// mechanisms (involuntary recall, consolidation, schema encoding) based on
// honesty / emotionality / openness. Default is neutral (0.5) on every axis.
const tutor = agent({
  provider: 'openai',
  model: 'gpt-4o',
  instructions: 'You are a patient programming tutor.',
  personality: {
    honesty:           0.85,  // direct, transparent, no flattery
    emotionality:      0.65,  // tone-aware without being clinical
    extraversion:      0.50,
    agreeableness:     0.75,  // warm, encouraging
    conscientiousness: 0.90,  // structured, thorough, follow-through
    openness:          0.85,  // creative, exploratory framing
  },
  memory: {
    enabled:    true,         // session history persists automatically
    cognitive:  true,         // Ebbinghaus decay + reconsolidation + 6 more
  },
})

// Sessions scope conversation history by ID. Same agent, multiple users,
// no cross-talk — each session has its own memory bag.
const session = tutor.session('user-42')

// The agent remembers across turns. Context from the first message is
// recalled automatically in the second.
await session.send('My exam is on distributed systems next Thursday.')
await session.send('I struggle with consensus algorithms.')
const reply = await session.send('What should I focus on this week?')

console.log(reply.text)
// => "Given Thursday's exam and your block on consensus, lock in Paxos
//     and Raft this week. Start with the leader-election proof…"

// Inspect what the session actually carries — full message history +
// token usage. Useful for debugging memory recall or cost.
console.log(session.messages())
const usage = await session.usage()
console.log(\`Total tokens: \${usage.totalTokens}\`)

// Full HEXACO guide: https://docs.agentos.sh/features/hexaco-personality`
  },
  {
    id: 'multimodal-rag',
    title: 'Multimodal RAG (image + audio + docs)',
    description: 'One brain across PDFs, images, and audio. Captions and transcripts are derived automatically and indexed alongside text — a single query searches every modality.',
    language: 'typescript',
    category: 'advanced',
    code: `import { Memory } from '@framers/agentos'
import { MultimodalIndexer } from '@framers/agentos/cognition/rag'
import fs from 'fs'

// One brain backs everything: text chunks, PDF bodies, image captions,
// audio transcripts — all in the same vector store.
const brain = await Memory.createSqlite({ path: './brain.sqlite' })

// Text + documents flow through the standard ingest pipeline.
// Loaders auto-detect PDF / DOCX / MD / HTML / CSV / JSON / XML.
await brain.ingest('./reports/q4-earnings.pdf')
await brain.ingest('./notes/')                       // recurse a folder

// Images + audio go through MultimodalIndexer. It captions images via
// a vision provider, transcribes audio via STT, and indexes the
// derived text into the same vector store as everything else.
const indexer = new MultimodalIndexer({
  embeddingManager: brain.embeddingManager,
  vectorStore:      brain.vectorStore,
  visionProvider:   { provider: 'openai', model: 'gpt-4o-mini' },
  sttProvider:      { provider: 'openai', model: 'whisper-1' },
})

await indexer.indexImage({ image: fs.readFileSync('./figures/revenue-chart.png') })
await indexer.indexAudio({ audio: fs.readFileSync('./calls/sales-q4.wav'), language: 'en' })

// One text query, every modality searched. Hits arrive ranked with
// modality + derived text so you can cite the underlying asset.
const hits = await indexer.search('Q4 revenue growth drivers')
for (const hit of hits) {
  console.log(\`[\${hit.modality}] \${hit.text.slice(0, 80)}…  (\${hit.score.toFixed(2)})\`)
  // => [image]    "Bar chart showing 23% YoY growth in cloud…  (0.91)"
  // => [audio]    "…we hit $4.2B in cloud services…           (0.87)"
  // => [document] "Revenue grew 23% to $4.2B driven by…       (0.84)"
}

// Full guide: https://docs.agentos.sh/features/multimodal-rag`
  },
  {
    id: 'tool-integration',
    title: t('examples.toolIntegration.title'),
    description: t('examples.toolIntegration.description'),
    language: 'typescript',
    category: 'integration',
    code: `import { Memory, agent } from '@framers/agentos'

// Memory owns ingest + retrieval. Pass plain text, file paths, directories,
// or URLs — chunking + embedding happens automatically.
const mem = await Memory.createSqlite({ path: './brain.sqlite' })

await mem.ingest('Q4 revenue grew 23% YoY to $4.2B driven by cloud services...')
await mem.ingest('./earnings-report.pdf')
await mem.ingest('./competitor-analysis.csv')

// Wire the memory to an agent — the agent calls mem.recall() automatically
// before generating an answer when the prompt looks retrieval-bound.
const analyst = agent({
  provider: 'openai',
  model: 'gpt-4o-mini',
  instructions: 'You are a financial analyst. Cite passages from memory.',
  memory: mem,
})

const answer = await analyst.generate('What drove revenue growth in Q4?')
console.log(answer.text)          // cites specific passages from ingested docs
console.log(answer.sources)       // which chunks were retrieved

// Works with 10 document loaders, 3 PDF tiers, 4 chunking strategies.
await mem.close()`
  },
  {
    id: 'skills-integration',
    title: t('examples.skillsIntegration.title'),
    description: t('examples.skillsIntegration.description'),
    language: 'typescript',
    category: 'integration',
    code: `import { searchSkills, getSkillsByCategory } from '@framers/agentos-skills-registry/catalog'
import { createCuratedManifest } from '@framers/agentos-extensions-registry'

// Browse the catalog (zero deps, works anywhere)
const devTools = getSkillsByCategory('developer-tools')
// => [{ name: 'github', ... }, { name: 'coding-agent', ... }, { name: 'git', ... }]

const matches = searchSkills('slack')
// => [{ name: 'slack-helper', category: 'communication', ... }]

// Register extensions + channels in one call
const manifest = await createCuratedManifest({
  channels: ['telegram', 'discord', 'slack'],
  tools: 'all',
})`
  },
  {
    id: 'streaming',
    title: t('examples.realtimeStream.title'),
    description: t('examples.realtimeStream.description'),
    language: 'typescript',
    category: 'advanced',
    code: `import { streamText, agent } from '@framers/agentos'

// --- Option 1: Stateless streaming (no agent, no memory) ---
const stream = streamText({
  provider: 'openai',
  model: 'gpt-4o-mini',           // omit to use the provider's default
  prompt: 'Explain quantum computing in simple terms',
})

// Iterate over text deltas as they arrive from the LLM
for await (const chunk of stream.textStream) {
  process.stdout.write(chunk)     // print tokens incrementally
}

// After the stream finishes, await aggregated results
const fullText = await stream.text
const usage = await stream.usage
console.log('\\nTokens used:', usage.totalTokens)

// --- Option 2: Agent streaming (with memory + tool calls) ---
const myAgent = agent({
  provider: 'anthropic',
  model: 'claude-haiku-4-5-20251001',
  instructions: 'You are a helpful science tutor.',
})

// .stream() returns the same StreamTextResult shape
const agentStream = myAgent.stream('What is quantum entanglement?')

// fullStream yields typed events: text, tool-call, tool-result, error
for await (const part of agentStream.fullStream) {
  switch (part.type) {
    case 'text':
      process.stdout.write(part.text)
      break
    case 'tool-call':
      console.log('\\nCalling tool:', part.toolName)
      break
    case 'tool-result':
      console.log('Tool result:', part.result)
      break
  }
}`
  },
  {
    id: 'mission-orchestrator',
    title: t('examples.missionOrchestrator.title'),
    description: t('examples.missionOrchestrator.description'),
    language: 'typescript',
    category: 'advanced',
    code: `import { mission } from '@framers/agentos/orchestration'
import { z } from 'zod'

// Describe a goal in plain English — the planner decomposes it.
// Tree of Thought: generates 3 candidate plans, scores each on
// feasibility/cost/latency, and picks the best decomposition.
const research = mission('competitor-analysis')
  .input(z.object({ topic: z.string() }))          // typed input schema
  .goal('Research {{topic}}, compare the top 5 solutions, write a report')
  .returns(z.object({                                // typed output schema
    report: z.string(),
    sources: z.array(z.string()),
  }))
  .planner({ strategy: 'adaptive', maxSteps: 8 })   // auto-decomposition
  .autonomy('guardrailed')        // auto-approve below safety thresholds
  .providerStrategy('balanced')   // strong models for reasoning, cheap for routing
  .costCap(5.00)                  // hard spending limit in USD
  .compile()

// Stream execution events in real time. Mission uses the graph runtime, so
// events are graph-shaped: run_start, node_start, node_end, edge_transition,
// checkpoint_saved, run_end.
for await (const event of research.stream({ topic: 'vector databases' })) {
  if (event.type === 'node_start')      console.log(\`\\n[\${event.nodeId}] started\`)
  if (event.type === 'node_end')        console.log(\`[\${event.nodeId}] done\`)
  if (event.type === 'edge_transition') console.log(\`-> \${event.target}\`)
  if (event.type === 'run_end')         console.log('mission complete')
}

const result = await research.invoke({ topic: 'vector databases' })
console.log(result.report)        // structured output matching .returns() schema`
  },
  {
    id: 'voice-agent',
    title: t('examples.voiceAgent.title'),
    description: t('examples.voiceAgent.description'),
    language: 'typescript',
    category: 'integration',
    code: `// Voice agents need ELEVENLABS_API_KEY (TTS) and DEEPGRAM_API_KEY (STT)
// in env, plus a working mic. See docs.agentos.sh/features/voice-pipeline.
import { agent } from '@framers/agentos'

// Voice agent — speaks, listens, and calls tools in real time
const concierge = agent({
  provider: 'openai',
  model: 'gpt-4o-mini',
  instructions: \`You are a hotel concierge. Help guests with reservations
    and recommendations. Be warm and concise. You're speaking, not writing.\`,
  tools: [
    {
      name: 'book_restaurant',
      description: 'Book a table at a local restaurant',
      inputSchema: {
        type: 'object',
        properties: {
          restaurant: { type: 'string' },
          guests: { type: 'number' },
          time: { type: 'string' },
        },
        required: ['restaurant', 'guests', 'time'],
      },
      execute: async ({ restaurant, guests, time }) => ({
        success: true,
        output: \`Booked \${guests} guests at \${restaurant} for \${time}\`,
      }),
    },
  ],
  voice: {
    tts: { provider: 'elevenlabs', voice: 'rachel' },  // low-latency TTS
    stt: { provider: 'deepgram' },                      // streaming STT
  },
})

// Start a live voice session — audio streams bidirectionally
const call = concierge.voiceSession('lobby-1')
await call.start()                 // begins listening on default mic`
  },
  {
    id: 'orchestration-graph',
    title: t('examples.orchestrationGraph.title'),
    description: t('examples.orchestrationGraph.description'),
    language: 'typescript',
    category: 'advanced',
    code: `import { AgentGraph, START, END } from '@framers/agentos/orchestration'
import { z } from 'zod'

// State schema: input (frozen user input), scratch (node-to-node bag),
// artifacts (accumulated outputs returned by invoke()).
const reviewPipeline = new AgentGraph({
  input:     z.object({ topic: z.string() }),
  scratch:   z.object({ draft: z.string().optional(), score: z.number().optional() }),
  artifacts: z.object({ finalPost: z.string().optional() }),
})
  .addNode('draft', {
    type: 'gmi',
    provider: 'anthropic',
    model: 'claude-haiku-4-5-20251001',
    instructions: 'Write a short blog post about the given topic.',
  })
  .addNode('review', {
    type: 'judge',
    provider: 'anthropic',
    model: 'claude-haiku-4-5-20251001',
    rubric: 'Score 1-10 on accuracy, clarity, engagement. Explain issues.',
    threshold: 7,
  })
  .addNode('revise', {
    type: 'gmi',
    provider: 'anthropic',
    model: 'claude-sonnet-4-5-20250929',
    instructions: 'Revise the draft based on the reviewer feedback.',
  })
  // Wire the graph — note the cycle: revise loops back to review until score >= 7
  .addEdge(START, 'draft')
  .addEdge('draft', 'review')
  .addConditionalEdge('review', ({ score }) => (score >= 7 ? END : 'revise'))
  .addEdge('revise', 'review')
  .compile()

// Execute with streaming events. Graph emits run_start, node_start, node_end,
// edge_transition, checkpoint_saved, run_end.
for await (const event of reviewPipeline.stream({ topic: 'AI agents' })) {
  if (event.type === 'node_start')      console.log(\`\\n[\${event.nodeId}] started\`)
  if (event.type === 'node_end')        console.log(\`[\${event.nodeId}] done\`)
  if (event.type === 'run_end')         console.log('pipeline complete')
}`
  },
  {
    id: 'image-generation',
    title: t('examples.imageGeneration.title'),
    description: t('examples.imageGeneration.description'),
    language: 'typescript',
    category: 'integration',
    code: `import { generateObject } from '@framers/agentos'
import { z } from 'zod'

// Structured output — extract typed data from unstructured text.
// The LLM output is validated against the Zod schema automatically.
const { object } = await generateObject({
  provider: 'openai',
  model: 'gpt-4o-mini',
  schema: z.object({
    name: z.string(),
    sentiment: z.enum(['positive', 'negative', 'neutral', 'mixed']),
    topics: z.array(z.string()),
    confidence: z.number().min(0).max(1),
  }),
  prompt: 'Analyze: "The new iPhone camera is incredible but battery disappointing."',
})

console.log(object)
// => { name: "iPhone Review", sentiment: "mixed",
//      topics: ["camera", "battery"], confidence: 0.92 }

// Works with any provider — swap the provider string. The output budget
// auto-sizes from the schema shape, so nested arrays don't truncate.
const { object: recipe } = await generateObject({
  provider: 'openai',
  model: 'gpt-4o',
  schema: z.object({
    title: z.string(),
    ingredients: z.array(z.string()),    // flat strings stay reliable across providers
    steps: z.array(z.string()),
    prepTimeMinutes: z.number(),
  }),
  prompt: \`Return a chocolate chip cookie recipe as JSON with these fields:
- title: recipe name (string)
- ingredients: list of ingredient lines with quantity and item (string array)
- steps: list of preparation steps (string array)
- prepTimeMinutes: prep time in minutes (number)\`,
})

console.log(recipe.title)
console.log(\`Prep: \${recipe.prepTimeMinutes} min\`)`
  },
  {
    id: 'deployment',
    title: t('examples.deployment.title'),
    description: t('examples.deployment.description'),
    language: 'bash',
    category: 'deployment',
    code: `# Install the Wunderland CLI (https://wunderland.sh)
npm install -g wunderland

# Create an agent from natural language
wunderland create "A research assistant that finds papers and writes summaries"

# Chat with your agent
wunderland chat --provider anthropic

# Run a mission (Tree of Thought planning + multi-agent execution)
wunderland mission "Research the top 5 AI frameworks, compare architectures, write a report" \\
  --autonomy guardrailed \\
  --provider-strategy balanced \\
  --cost-cap 5.00

# Generate deployment artifacts
wunderland deploy --target docker

# Or deploy directly
docker compose up -d

# Monitor running agents
wunderland status
wunderland monitor`
  },
  {
    id: 'emergent-tools',
    title: t('examples.emergentTools.title'),
    description: t('examples.emergentTools.description'),
    language: 'typescript',
    category: 'advanced',
    code: `// Emergent tool forging needs the full runtime — use agency() (or AgentOS),
// the lightweight agent() helper accepts the config but doesn't enforce it.
import { agency } from '@framers/agentos'

const researcher = agency({
  strategy: 'sequential',
  agents: {
    analyst: {
      provider: 'anthropic',
      model: 'claude-sonnet-4-5-20250929',
      instructions: 'You are a research analyst.',
    },
  },
  emergent: {
    enabled: true,
    judge: 'strict',          // judge evaluates forged tools before use
    lifetime: 'session',      // tools exist only for this session
    maxForgedTools: 5,        // cap runtime-created tools
  },
})

// The runtime may forge a "scrape_financial_data" tool if web_search alone
// isn't sufficient for the task.
const report = await researcher.generate(
  'Analyze Q4 earnings trends for the top 5 AI companies.'
)
console.log(report.text)

// Inspect what tools were forged during this run.
console.log(report.forgedTools)
// [{ name: "extract_earnings_table", forgedAt: "...", approved: true }]`
  }
]), [t])
  const [activeExample, setActiveExample] = useState(codeExamples[0])
  const [activeCategory, setActiveCategory] = useState<'all' | 'basic' | 'advanced' | 'integration' | 'deployment'>('all')
  const [copied, setCopied] = useState<string | null>(null)
  const [SyntaxHighlighter, setSyntaxHighlighter] = useState<null | (typeof import('react-syntax-highlighter').Prism)>(null)
  const [syntaxTheme, setSyntaxTheme] = useState<Record<string, React.CSSProperties> | null>(null)
  const [codeViewerReady, setCodeViewerReady] = useState(false)
  
  // Auto-select first example when category changes
  useEffect(() => {
    const filtered = activeCategory === 'all' ? codeExamples : codeExamples.filter((ex) => ex.category === activeCategory)
    if (filtered.length > 0) {
      setActiveExample(filtered[0])
    }
  }, [activeCategory, codeExamples])

  // Defer loading the heavy code highlighter until after mount/idle
  useEffect(() => {
    const loadHighlighter = () => {
      Promise.all([
        import('react-syntax-highlighter').then(m => m.Prism),
        import('react-syntax-highlighter/dist/esm/styles/prism').then(m => m.vscDarkPlus)
      ]).then(([PrismComp, theme]) => {
        setSyntaxHighlighter(() => PrismComp)
        setSyntaxTheme(theme)
        setCodeViewerReady(true)
      }).catch(() => {
        // no-op fallback; keep viewer minimal if load fails
      })
    }
    if ('requestIdleCallback' in window) {
      const w = window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => void }
      w.requestIdleCallback(loadHighlighter, { timeout: 1500 })
    } else {
      setTimeout(loadHighlighter, 600)
    }
  }, [])

  const categories = [
    { value: 'all' as const, label: t('categories.all'), icon: Code2, color: 'from-purple-500 to-pink-500' },
    { value: 'basic' as const, label: t('categories.basic'), icon: Code2, color: 'from-blue-500 to-cyan-500' },
    { value: 'advanced' as const, label: t('categories.advanced'), icon: Cpu, color: 'from-green-500 to-emerald-500' },
    { value: 'integration' as const, label: t('categories.integration'), icon: GitBranch, color: 'from-orange-500 to-red-500' },
    { value: 'deployment' as const, label: t('categories.deployment'), icon: Database, color: 'from-indigo-500 to-purple-500' }
  ]

  const filteredExamples = activeCategory === 'all'
    ? codeExamples
    : codeExamples.filter((ex) => ex.category === activeCategory)

  const { copy: clipboardCopy } = useCopyToClipboard()
  const copyCode = (code: string, id: string) => {
    clipboardCopy(code)
    setCopied(id)
    setTimeout(() => setCopied(null), 1500)
  }

  const categoryIcons = {
    basic: Code2,
    advanced: Cpu,
    integration: GitBranch,
    deployment: Database
  }

  return (
    <section className="py-8 sm:py-12 lg:py-14 px-2 sm:px-6 lg:px-8 relative overflow-hidden transition-theme" aria-labelledby="code-examples-heading">
      {/* Subtle organic gradient background */}
      <div className="absolute inset-0 organic-gradient opacity-20" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 id="code-examples-heading" className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="gradient-text">{t('title')}</span>
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Category Filter - Mobile Responsive */}
        <div className="flex justify-center mb-10 overflow-x-auto">
          <div className="inline-flex gap-2 p-1 glass-morphism rounded-2xl min-w-min">
            {categories.map((cat) => {
              const Icon = cat.icon
              return (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-3 rounded-xl font-medium transition-all text-xs sm:text-sm whitespace-nowrap ${
                    activeCategory === cat.value
                      ? 'bg-gradient-to-r ' + cat.color + ' text-white shadow-modern'
                      : 'text-text-secondary hover:text-text-primary hover:bg-background-primary/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{cat.label}</span>
                  <span className="sm:hidden">{cat.label.split(' ')[0]}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Example List - Enhanced Blocks */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4 px-2">
              {t('selectExample')}
            </h3>
            <div className="space-y-3">
              {filteredExamples.map((example) => {
                const Icon = categoryIcons[example.category]
                return (
                  <motion.button
                    key={example.id}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveExample(example)}
                    className={`w-full text-left p-4 rounded-xl transition-all relative overflow-hidden group ${
                      activeExample.id === example.id
                        ? 'bg-gradient-to-br from-[var(--color-background-elevated)] to-[var(--color-background-glass)] shadow-lg border border-[var(--color-accent-primary)]'
                        : 'bg-[var(--color-background-glass)] border border-transparent hover:border-[var(--color-border-interactive)]'
                    }`}
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors ${
                        activeExample.id === example.id ? 'bg-accent-primary' : 'bg-transparent group-hover:bg-accent-primary/50'
                    }`} />
                    
                    <div className="flex items-center gap-3 pl-2">
                      <div className={`p-2 rounded-lg shrink-0 ${
                        activeExample.id === example.id
                          ? 'bg-accent-primary text-[var(--color-background-primary)] shadow-md'
                          : 'bg-accent-primary/10 text-accent-primary'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-bold text-sm mb-0.5 truncate ${
                            activeExample.id === example.id ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'
                        }`}>
                          {example.title}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)] line-clamp-1">
                          {example.category}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Code Display - Much better styling */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeExample.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <div className="glass-morphism rounded-3xl overflow-hidden shadow-modern-lg h-full flex flex-col">
                {/* Header - Enhanced */}
                <div className="p-6 border-b border-border-subtle">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-text-primary mb-2">
                        {activeExample.title}
                      </h3>
                      <p className="text-text-secondary">
                        {activeExample.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 text-xs font-bold text-accent-primary">
                        {activeExample.language}
                      </span>
                      <button
                        onClick={() => copyCode(activeExample.code, activeExample.id)}
                        className="p-2.5 rounded-lg hover:bg-accent-primary/10 transition-all group"
                        aria-label={t('copyButton')}
                      >
                        {copied === activeExample.id ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <Copy className="w-5 h-5 text-text-secondary group-hover:text-accent-primary transition-colors" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

        {/*
          Tabs: Synchronous vs Streaming.
          The "Synchronous" tab anchors on the `basic-agent` example; the
          "Streaming" tab on `streaming`. The previous logic short-circuited
          when activeExample.id === 'streaming', so clicking Synchronous
          while streaming was selected did nothing (it hit the no-op
          branch). The handlers below switch unconditionally — React de-dups
          identical state, so re-selecting the active tab is free.
        */}
        <div className="px-6 pt-4 border-b border-border-subtle">
          <div className="inline-flex gap-2 rounded-2xl p-1 glass-morphism">
            <button
              onClick={() => {
                const target = codeExamples.find((e) => e.id === 'basic-agent')
                if (target) setActiveExample(target)
              }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                activeExample.id !== 'streaming'
                  ? 'bg-[var(--color-accent-primary)] text-[var(--color-text-on-accent)] shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-[var(--color-background-elevated)]'
              }`}
            >
              {t('tabs.synchronous')}
            </button>
            <button
              onClick={() => {
                const target = codeExamples.find((e) => e.id === 'streaming')
                if (target) setActiveExample(target)
              }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                activeExample.id === 'streaming'
                  ? 'bg-[var(--color-accent-primary)] text-[var(--color-text-on-accent)] shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-[var(--color-background-elevated)]'
              }`}
            >
              {t('tabs.streaming')}
            </button>
          </div>
        </div>

        {/* Code Block with Syntax Highlighting */}
        <div className="flex-1 overflow-auto bg-[#1e1e1e] max-h-[300px] sm:max-h-[400px] lg:max-h-none">
                  {codeViewerReady && SyntaxHighlighter && syntaxTheme ? (
                    <SyntaxHighlighter
                      language={activeExample.language}
                      style={syntaxTheme}
                      showLineNumbers={true}
                      customStyle={{
                        margin: 0,
                        padding: '1.5rem',
                        background: 'transparent',
                        fontSize: '0.875rem',
                      }}
                      lineNumberStyle={{
                        minWidth: '2.5rem',
                        paddingRight: '1rem',
                        color: '#6b7280',
                        userSelect: 'none',
                      }}
                    >
                      {activeExample.code}
                    </SyntaxHighlighter>
                  ) : (
                    <pre
                      aria-busy="true"
                      className="m-0 p-6 text-sm text-gray-200"
                      style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}
                    >
{activeExample.code}
                    </pre>
                  )}
                </div>

                {/* Footer - Interactive */}
                <div className="p-3 sm:p-4 border-t border-border-subtle bg-gradient-to-r from-accent-primary/5 to-accent-secondary/5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                      <a
                        href={`https://playground.agentos.sh?example=${activeExample.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-accent-primary text-white text-xs sm:text-sm font-semibold hover:bg-accent-hover transition-all group"
                      >
                        <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
                        {t('runButton')}
                      </a>
                      <a
                        href={`https://docs.agentos.sh/examples/${activeExample.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg border-2 border-accent-primary text-accent-primary text-xs sm:text-sm font-semibold hover:bg-accent-primary/10 transition-all"
                      >
                        <Book className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">{t('docsButton')}</span>
                        <span className="sm:hidden">Docs</span>
                      </a>
                      <a
                        href="https://docs.agentos.sh/api"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg border-2 border-accent-primary text-accent-primary text-xs sm:text-sm font-semibold hover:bg-accent-primary/10 transition-all"
                      >
                        <Book className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">{tFooter('apiReferenceTSDoc')}</span>
                        <span className="sm:hidden">API</span>
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-accent-primary animate-pulse" />
                      <span className="text-xs font-semibold text-text-muted">
                        {t(`categories.${activeExample.category}`)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Quick Start CTA - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="relative overflow-hidden rounded-3xl glass-morphism p-12">
            <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/10 via-accent-secondary/10 to-accent-tertiary/10" />

            <div className="relative z-10 text-center">
              <h3 className="text-3xl font-bold mb-4 gradient-text">
                {t('cta.title')}
              </h3>
              <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
                {t('cta.description')}
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <div className="px-8 py-4 bg-[var(--color-background-elevated)] rounded-xl font-mono text-sm border-2 border-[var(--color-border-interactive)] shadow-lg">
                  <span className="text-[var(--color-text-muted)]">$</span> {copied === 'cta-install' ? <span className="text-[var(--color-accent-primary)] font-semibold">Copied!</span> : <>npm install @framers/agentos</>}
                  <button
                    onClick={() => copyCode('npm install @framers/agentos', 'cta-install')}
                    className="ml-3 p-1.5 rounded-md hover:bg-[var(--color-background-secondary)] transition-colors text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                    aria-label="Copy install command"
                  >
                    {copied === 'cta-install' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <a
                  href="https://docs.agentos.sh/getting-started/getting-started"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] text-[var(--color-text-on-accent)] shadow-lg shadow-[var(--color-accent-primary)]/20 hover:shadow-xl hover:brightness-110 transition-all duration-[var(--duration-fast)]"
                >
                  <Sparkles className="w-5 h-5" />
                  {t('cta.button')}
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/20">{t('cta.time')}</span>
                </a>

                <a
                  href="https://wunderland.sh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold border border-[var(--color-border-interactive)] bg-[var(--color-background-elevated)] text-[var(--color-text-primary)] hover:bg-[var(--color-background-secondary)] transition-all duration-[var(--duration-fast)]"
                >
                  <Play className="w-5 h-5 text-[var(--color-accent-primary)]" />
                  Try the Wunderland CLI
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-accent-primary)]/15 text-[var(--color-accent-primary)]">wunderland.sh</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}