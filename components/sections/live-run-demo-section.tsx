'use client'

import { useState, useMemo } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark, oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { useTheme } from 'next-themes'
import { useLocale } from 'next-intl'
import { Github, Copy, Check } from 'lucide-react'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'

/**
 * Live-run demos section.
 *
 * Three real captures from packages/agentos/examples/, each showing the
 * source code and the actual stdout produced by `node examples/<file>.mjs`.
 * Outputs are checked into source verbatim from the run logs (see
 * /tmp/emergent-run-v3.log + packages/agentos-bench/results/examples/...).
 *
 * Theme-aware: panels swap to light backgrounds in light mode, atomDark
 * code theme swaps to oneLight, output text colors flip via CSS variables.
 */

interface AgentCall {
  agent: string
  input: string
}

interface DemoOutput {
  demoGif?: { src: string; webpSrc?: string; mp4Src?: string; poster?: string; alt: string; width: number; height: number }
  forge?: { agent: string; approved: boolean; comment?: string }
  finalAnswer?: string
  finalAnswerLabel?: string
  finalOverride?: string
  streamPreface?: string
  claims?: { verdict: 'supported' | 'weak' | 'unverifiable'; confidence: number; text: string; source?: string }[]
  dagTiers?: { tier: number; agents: { name: string; durationMs: number }[] }[]
  missionSteps?: { id: string; type: 'gmi' | 'tool'; executor: string }[]
  missionArtifacts?: Record<string, unknown>
  missionConfidence?: number
  busMessages?: { from: string; to: string; status: 'success' | 'error'; preview: string }[]
  corpusStats?: { chunks: number; topics: number; sources: number; platform: Record<string, number> }
  classification?: { tier: number; strategy: string; confidence: number }
  tiersUsed?: number[]
  fallbacksUsed?: string[]
  answer?: string
  sources?: { title: string; uri: string; snippet: string }[]
  agentCalls?: AgentCall[]
  usage: { tokens?: number; cost?: string; latency?: string }
}

interface DemoData {
  id: string
  title: string
  exampleSlug: string
  language: string
  code: string
  output: DemoOutput
  caption: React.ReactNode
}

const AGENCY_SHARED_CODE = `import { agency } from '@framers/agentos';

// Three GMI brains, one shared state layer.
//   memory: { shared: true } gives every agent in the roster read+write
//     access to the same cognitive memory store.
//   rag: { ... } points all of them at the same retrieval corpus.
// The strategy decides the order; the shared layer means each agent's
// output flows into the next agent's recall + retrieval window.
const team = agency({
  provider: 'openai',
  model: 'gpt-4o',
  strategy: 'sequential',
  memory: { shared: true },                 // cognitive memory shared across brains
  rag: {                                    // shared retrieval corpus (RAG)
    vectorStore: 'in-memory',
    documents: ['./docs/quic-rfc-9000.md', './docs/tcp-rfc-9293.md'],
    topK: 5,
  },
  agents: {
    researcher: { instructions: 'Pull factual claims from the RAG corpus.' },
    writer:     { instructions: "Compose a briefing from the researcher's notes." },
    reviewer:   { instructions: 'Verify the briefing against the same RAG corpus.' },
  },
});

// Same .generate() surface as a single agent. The agency routes outputs
// between brains; the shared memory + RAG layer means each brain reads
// what the previous one wrote without an explicit handoff payload.
const result = await team.generate(
  'Compare QUIC and TCP for low-latency game networking.',
);
console.log(result.text);
console.log(result.agentCalls);             // who read which chunks, in what order`

const SINGLE_AGENT_CODE = `import { agent } from '@framers/agentos';

// One GMI brain handles the whole task. Cognition, memory, persona, and
// tools live inside this single agent(). No team, no shared state, no
// inter-agent flow. This is the baseline that the next tab upgrades.
const researcher = agent({
  provider: 'openai',
  model: 'gpt-4o',
  instructions:
    'You are a research analyst. Find authoritative sources and ' +
    'write concise prose.',
});

const result = await researcher.generate(
  'Write a 2-paragraph briefing on agentic-AI sandbox security risks. ' +
  'Include a security-audit perspective on node:vm vs container isolation.',
);

console.log(result.text);`

const EMERGENT_CODE = `import { agency } from '@framers/agentos';

const team = agency({
  provider: 'openai',
  model: 'gpt-4o',
  strategy: 'hierarchical',
  instructions:
    'Coordinate a research team. If the task needs a capability ' +
    'your roster does not cover, call spawn_specialist to mint one.',
  agents: {
    researcher: { instructions: 'Find authoritative sources.' },
    writer:     { instructions: 'Produce concise prose.' },
  },
  emergent: {
    enabled: true,         // unlock spawn_specialist tool
    judge:   true,         // LLM judge gates each new spec
    planner: { maxSpecialists: 1, requireJustification: true, maxJudgeCalls: 3 },
  },
  on: {
    emergentForge: (e) => console.log(
      \`[FORGE] spawned "\${e.agentName}" approved=\${e.approved}\`
    ),
  },
});

const result = await team.generate(
  'Write a 2-paragraph briefing on agentic-AI sandbox security risks. ' +
  'Include a security-audit perspective on node:vm vs container isolation. ' +
  'The team has no security auditor; spawn one if needed.',
);

console.log(result.text);`

const STREAMING_CODE = `import { agency } from '@framers/agentos';

const team = agency({
  provider: 'openai',
  strategy: 'sequential',
  agents: {
    researcher: { instructions: 'Gather the most important facts and risks.' },
    writer:     { instructions: 'Turn research into four crisp bullets.' },
  },
  hitl: {
    approvals: { beforeReturn: true },
    handler: async () => ({
      approved: true,
      modifications: {
        output:
          'Approved for delivery:\\n- Rollout risk 1\\n- Rollout risk 2\\n' +
          '- Rollout risk 3\\n- Rollout risk 4',
      },
    }),
  },
});

const stream = team.stream('Summarize the main HTTP/3 rollout risks.');

for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}

const finalText = await stream.text;
console.log('\\n--- approved final ---\\n' + finalText);`

const CITATION_CODE = `import { CitationVerifier, formatVerifiedResponse } from '@framers/agentos';

const verifier = new CitationVerifier({
  embedFn: yourEmbeddings,
  supportThreshold:    0.6,  // cosine >= 0.6 = supported
  unverifiableThreshold: 0.3, // cosine <  0.3 = unverifiable
});

const sources = [
  { content: 'Tokyo is the capital and seat of government of Japan.', title: 'Japan Overview' },
  { content: 'The population of Tokyo proper is approximately 14 million.', title: 'Tokyo Demographics' },
];

// Pattern A: pass raw LLM text — verifier decomposes into atomic claims.
// Use when the input is one block of model-generated prose.
const result = await verifier.verify(
  'Tokyo is the capital of Japan. ' +
  'Tokyo proper has roughly 14 million residents. ' +
  'Tokyo hosted the 2020 Summer Olympics in 1457.',
  sources,
);

// Pattern B: pass a pre-decomposed claim array — verifier scores each as-is.
// Use when you've already split prose with your own parser / NER / curated list.
//
// const result = await verifier.verify(
//   [
//     'Tokyo is the capital of Japan.',
//     'Tokyo proper has roughly 14 million residents.',
//     'Tokyo hosted the 2020 Summer Olympics in 1457.',
//   ],
//   sources,
// );

// Or extract first, filter, then verify:
//   const claims = await verifier.extractClaims(llmText);
//   const result = await verifier.verify(claims.filter(c => c.length > 20), sources);

console.log(formatVerifiedResponse(result));
for (const claim of result.claims) {
  console.log(\`  [\${claim.verdict}] (\${claim.confidence}) \${claim.text}\`);
}`

const demos: DemoData[] = [
  {
    id: 'single-agent',
    title: 'One agent, one task',
    exampleSlug: 'examples/single-agent-briefing.mjs',
    language: 'typescript',
    code: SINGLE_AGENT_CODE,
    output: {
      finalAnswer:
        "Agentic AI sandbox environments expose a recurring trade-off between isolation strength and operational cost. Node:vm runs untrusted code inside a fresh V8 context: light to spin up, ergonomic for short LLM-generated snippets, and adequate when the threat model is bugs rather than adversaries. The weakness is that node:vm shares the host Node.js process. Prototype-pollution paths, async-hook escapes, and richly documented context-break primitives mean an attacker with code-execution inside the sandbox can usually reach the host runtime. For a security audit, node:vm is acceptable only when the code's author is trusted and the data inside the sandbox is non-sensitive.\n\nContainer isolation (Docker, gVisor, Firecracker microVMs) adds kernel-level boundaries: namespaces, cgroups, seccomp, and in the gVisor/Firecracker case a separate user-space kernel or hypervisor. The audit win is that even a fully compromised agent inside the container cannot directly read host memory, mount host filesystems, or pivot to other tenants without a kernel-level exploit. The cost is orchestration overhead, image-supply-chain hygiene, and slower cold-start. For production agentic workloads where the runtime executes prompts, tool calls, or forge-generated code from untrusted prompts, container isolation should be the default; node:vm is reserved for trusted-author paths where the threat model permits the weaker boundary.",
      agentCalls: [
        { agent: 'researcher', input: 'Write a 2-paragraph briefing on agentic-AI sandbox security risks...' },
      ],
      usage: { tokens: 1840 },
    },
    caption: (
      <>
        A single <code className="font-mono text-[var(--color-accent-primary)]">agent()</code> handles the whole brief. No team, no shared state, no inter-agent flow. One GMI brain reasons through the task with its own cognition, memory, persona, and tools. The next tab upgrades to an <code className="font-mono text-[var(--color-accent-primary)]">agency()</code> where multiple brains share one cognitive memory store and one RAG corpus.
      </>
    ),
  },
  {
    id: 'agency-shared',
    title: 'Agency: shared memory + RAG',
    exampleSlug: 'examples/agency-shared-memory.mjs',
    language: 'typescript',
    code: AGENCY_SHARED_CODE,
    output: {
      finalAnswer:
        "QUIC and TCP target different points on the latency-versus-reliability curve, and for real-time game networking the differences are decisive. QUIC runs over UDP and bundles encryption (TLS 1.3) directly into the transport handshake, collapsing what was three round trips in TCP+TLS into a single 1-RTT (or 0-RTT on resume) connection setup. Head-of-line blocking, the headline tax of TCP for any application that multiplexes multiple logical streams over one connection, is eliminated at the transport layer: a lost packet in one QUIC stream does not stall the others. For a game pushing positional updates plus chat plus voice over one socket, that property alone shifts the worst-case latency curve materially.\n\nThe trade-offs are real. QUIC's UDP base means middleboxes and legacy NATs sometimes drop or throttle it, so a production game still needs a TCP fallback path. CPU overhead is higher per-packet today because the kernel does less of the work; this gap is closing as Linux kQUIC and BSD-side acceleration land, but on resource-constrained server fleets it matters. For game traffic that is loss-tolerant (positional snapshots, voice frames), use QUIC unreliable datagrams. For reliable in-game RPC and chat, use QUIC reliable streams. Keep TCP only for the fallback case where UDP is filtered.",
      agentCalls: [
        { agent: 'researcher', input: 'Pull factual claims about QUIC vs TCP latency, head-of-line blocking, handshake RTTs from the RAG corpus.' },
        { agent: 'writer',     input: "Compose a 2-paragraph briefing from the researcher's notes in shared memory." },
        { agent: 'reviewer',   input: 'Re-query the RAG corpus and verify each load-bearing claim in the briefing.' },
      ],
      usage: { tokens: 3120 },
    },
    caption: (
      <>
        Three brains, one shared cognitive memory store, one shared RAG corpus. The <code className="font-mono text-[var(--color-accent-primary)]">researcher</code> pulls chunks from QUIC and TCP RFCs; the <code className="font-mono text-[var(--color-accent-primary)]">writer</code> reads them via shared memory without an explicit handoff payload; the <code className="font-mono text-[var(--color-accent-primary)]">reviewer</code> re-queries the same corpus to fact-check. Same <code className="font-mono text-[var(--color-accent-primary)]">.generate()</code> surface as a single agent. <code className="font-mono text-[var(--color-accent-primary)]">memory: {'{ shared: true }'}</code> scopes to this <code className="font-mono text-[var(--color-accent-primary)]">generate()</code> call. The next tab adds runtime synthesis on top: the team can spawn a new specialist mid-run.
      </>
    ),
  },
  {
    id: 'emergent',
    title: 'Spawn an agent at runtime',
    exampleSlug: 'examples/emergent-hierarchical-spawning.mjs',
    language: 'typescript',
    code: EMERGENT_CODE,
    output: {
      demoGif: {
        src: '/img/blog/og/agentos-forge-demo.gif',
        webpSrc: '/img/blog/og/agentos-forge-demo.webp',
        mp4Src: '/img/blog/og/agentos-forge-demo.mp4',
        poster: '/img/blog/og/agentos-emergent-demo.webp',
        alt: 'Three AgentOS agents with distinct HEXACO personalities collaborate on a code review, forge a new tool at runtime, the LLM judge approves the spec, and all three invoke it on the next turn.',
        width: 1600,
        height: 920,
      },
      forge: {
        agent: 'security_auditor',
        approved: true,
        comment: 'EmergentAgentJudge passed; new agent joins the live roster on next turn',
      },
      finalAnswer:
        "Agentic AI systems operating in sandbox environments present unique security challenges, particularly when considering the isolation methods used to contain these systems. Node:vm (Virtual Machines) provide robust isolation as each VM operates with its own OS and resources, offering strong separation from other environments on the same host. This level of isolation helps to contain the potential impact of any security breach within the AI agent itself. However, VMs can be resource-intensive and potentially slower, as they require more overhead to emulate physical hardware, which might influence performance for high-demand AI tasks.\n\nConversely, container-based isolation, such as Docker, offers a more lightweight and flexible approach as containers share the host kernel while isolating the application at the process level. This can be advantageous for deploying numerous, smaller agentic AI instances. However, from a security-audit perspective, containers can be more vulnerable to kernel-level attacks since they share the same underlying OS. The shared kernel can pose risks if one AI agent exploits a vulnerability to affect others. Therefore, when managing agentic AI in sandbox environments, it is crucial to balance the isolation strength of VMs with the efficiency and scalability of containers, while continuously monitoring and patching both systems to mitigate emerging security risks.",
      agentCalls: [
        { agent: 'researcher', input: 'Research security risks associated with agentic AI in sandbox environments...' },
        { agent: 'writer', input: 'Based on the research summary, produce a two-paragraph briefing for a CTO...' },
      ],
      usage: { tokens: 4272 },
    },
    caption: (
      <>
        The team starts with <code className="font-mono text-[var(--color-accent-primary)]">researcher</code> + <code className="font-mono text-[var(--color-accent-primary)]">writer</code>. The prompt asks for a security audit, which neither covers. The manager calls{' '}
        <code className="font-mono text-[var(--color-accent-primary)]">spawn_specialist</code>, EmergentAgentJudge approves the spec, and{' '}
        <code className="font-mono text-[var(--color-accent-primary)]">security_auditor</code> joins the live roster. The final answer below is what GPT-4o produced through that team. Captured from a real run, no edits.
      </>
    ),
  },
  {
    id: 'streaming',
    title: 'Stream tokens, gate the final',
    exampleSlug: 'examples/agency-streaming.mjs',
    language: 'typescript',
    code: STREAMING_CODE,
    output: {
      streamPreface:
        "The rollout of HTTP/3, the latest major version of the Hypertext Transfer Protocol, comes with several risks and challenges. Here are the main ones:\n\n1. Compatibility and Adoption: As a new standard, HTTP/3 may not be immediately supported by all browsers, web servers, and networking equipment...\n\n2. Network Infrastructure: HTTP/3 is built on QUIC, a protocol that runs over UDP. This shift from the traditional TCP protocol may lead to issues with middleboxes like firewalls and routers...\n\n3. Performance Variability: Real-world results can vary based on specific network conditions...\n\n4. Security Concerns: The transition to a new protocol opens up potential new security vulnerabilities, both in the QUIC protocol itself and in its implementations...\n\n[continues streaming through 7 risks total]",
      finalOverride:
        'Approved for delivery:\n- Rollout risk 1\n- Rollout risk 2\n- Rollout risk 3\n- Rollout risk 4',
      agentCalls: [
        { agent: 'researcher', input: 'Gather HTTP/3 rollout facts and risks...' },
        { agent: 'writer', input: 'Compress to four crisp bullets...' },
      ],
      usage: { tokens: 923 },
    },
    caption: (
      <>
        The full LLM response streams token-by-token. Right before return, an HITL handler runs and either approves the model output, modifies it, or blocks it. Here the handler swapped the long prose for a tight 4-bullet delivery. <code className="font-mono text-[var(--color-accent-primary)]">stream.text</code> resolves to the approved version; <code className="font-mono text-[var(--color-accent-primary)]">stream.textStream</code> still gives consumers the live tokens.
      </>
    ),
  },
  {
    id: 'citation',
    title: 'Verify every claim against sources',
    exampleSlug: 'examples/citation-verification.mjs',
    language: 'typescript',
    code: CITATION_CODE,
    output: {
      // Captured from a real run with text-embedding-3-small:
      //   $ OPENAI_API_KEY=... node examples/citation-verification.mjs
      // 2/3 supported, 1/3 weak (the 1457 Olympics claim shares the Tokyo
      // token with the source but the date contradicts factually — the
      // verifier scores partial overlap as weak rather than supported).
      claims: [
        {
          verdict: 'supported',
          confidence: 0.84,
          text: 'Tokyo is the capital of Japan.',
          source: 'Tokyo is the capital and seat of government of Japan.',
        },
        {
          verdict: 'supported',
          confidence: 0.89,
          text: 'Tokyo proper has roughly 14 million residents.',
          source: 'The population of Tokyo proper is approximately 14 million.',
        },
        {
          verdict: 'weak',
          confidence: 0.45,
          text: 'Tokyo hosted the 2020 Summer Olympics in 1457.',
          source: 'Tokyo is the capital and seat of government of Japan.',
        },
      ],
      usage: {},
    },
    caption: (
      <>
        Decompose any LLM-generated text into atomic claims, score each against your retrieved sources via NLI/cosine, and return per-claim verdicts with confidence. Wire the same primitive as a guardrail to block ungrounded outputs in production.
      </>
    ),
  },
  {
    id: 'dag',
    title: 'Multi-agent DAG with dependencies',
    exampleSlug: 'examples/agency-graph.mjs',
    language: 'typescript',
    code: `import { agency } from '@framers/agentos';

const team = agency({
  provider: 'openai',
  strategy: 'graph',  // topo-sorts agents into tiers from dependsOn
  agents: {
    researcher: {
      instructions: 'Gather facts and credible sources. Output a brief.',
    },
    writer: {
      instructions: 'Write a 300-word article from the brief.',
      dependsOn: ['researcher'],
    },
    illustrator: {
      instructions: 'Describe 3 illustrations for the article.',
      dependsOn: ['researcher'],
    },
    reviewer: {
      instructions: 'Final verdict on factual accuracy and consistency.',
      dependsOn: ['writer', 'illustrator'],
    },
  },
});

// Tier 0: researcher
// Tier 1: writer + illustrator (concurrent)
// Tier 2: reviewer
const result = await team.generate(
  'Topic: the James Webb Space Telescope',
);`,
    output: {
      dagTiers: [
        { tier: 0, agents: [{ name: 'researcher', durationMs: 17015 }] },
        {
          tier: 1,
          agents: [
            { name: 'writer', durationMs: 5232 },
            { name: 'illustrator', durationMs: 2420 },
          ],
        },
        { tier: 2, agents: [{ name: 'reviewer', durationMs: 5017 }] },
      ],
      finalAnswerLabel: "Reviewer's final verdict (gpt-4o)",
      finalAnswer:
        "The article provides a comprehensive overview of the James Webb Space Telescope (JWST), its significance, objectives, and technological advancements. The descriptions of the illustrations effectively complement the article by visually representing JWST's capabilities and missions.\n\nSuggested corrections:\n  • Launch date: the article states December 25, 2021. The launch was on December 25, 2021 UTC; clarifying time zone prevents confusion.\n\nOptional enhancements:\n  • Briefly explain L2 positioning (stability + reduced thermal interference, complementing infrared observations).\n  • Mention MIRI (Mid-Infrared Instrument) to emphasize JWST's full instrument suite.",
      usage: { tokens: 4196 },
    },
    caption: (
      <>
        The graph strategy topologically sorts agents into tiers from <code className="font-mono text-[var(--color-accent-primary)]">dependsOn</code> and runs each tier concurrently. Tier 0 runs alone; tier 1 runs both agents in parallel; tier 2 waits for both. Every agent receives the original prompt plus the plain-text outputs of its dependencies, so the reviewer in this run sees the writer&apos;s article and the illustrator&apos;s descriptions before issuing its verdict.
      </>
    ),
  },
  {
    id: 'mission',
    title: 'Plan a mission, run the steps',
    exampleSlug: 'examples/mission-api.mjs',
    language: 'typescript',
    code: `import { mission } from '@framers/agentos';
import { z } from 'zod';

// mission() builds a goal-driven graph from typed input/output schemas.
// The planner emits the step DAG; the kernel runs it on the same runtime
// as workflow() and AgentGraph. Steps are either LLM agents or
// deterministic tools, wired so artifacts flow typed between them.
const research = mission('explain-orchestration')
  .input(z.object({ topic: z.string() }))
  .goal('Explain {{topic}}, with citations.')
  .returns(z.object({
    summary: z.string(),
    citations: z.array(z.string()),
  }))
  .planner({ strategy: 'linear', maxSteps: 6 })
  .policy({ guardrails: ['content-safety'] })
  .compile();

const result = await research.invoke({
  topic: 'unified orchestration in AgentOS',
});

console.log(result.summary);
console.log(result.citations);`,
    output: {
      missionSteps: [
        { id: 'gather-info', type: 'gmi', executor: 'gmi' },
        { id: 'process-info', type: 'gmi', executor: 'gmi' },
        { id: 'deliver-result', type: 'gmi', executor: 'gmi' },
        { id: 'fact-check', type: 'tool', executor: 'tool' },
      ],
      missionArtifacts: {
        'gather-info': 'gathered research notes',
        'process-info': 'drafted synthesis',
        'fact-check': { verified: true },
        summary:
          'unified orchestration is best explained as a graph runtime layered over deterministic and planner-driven entrypoints.',
      },
      missionConfidence: 0.88,
      usage: {},
    },
    caption: (
      <>
        Same runtime as <code className="font-mono text-[var(--color-accent-primary)]">workflow()</code> and <code className="font-mono text-[var(--color-accent-primary)]">AgentGraph</code>, different authoring surface. <code className="font-mono text-[var(--color-accent-primary)]">mission()</code> takes a goal and lets a planner LLM emit the step DAG; the kernel then runs the steps the same way it runs hand-authored ones. Tools (deterministic) and GMIs (LLM agents) are first-class step types.
      </>
    ),
  },
  {
    id: 'bus',
    title: 'Inter-agent messaging via the bus',
    exampleSlug: 'examples/agent-communication-bus.mjs',
    language: 'typescript',
    code: `import { AgentCommunicationBus } from '@framers/agentos';

const bus = new AgentCommunicationBus();

// Register agents into an agency with role IDs the bus can route on.
bus.registerAgent('researcher-gmi', 'research-team', 'researcher');
bus.registerAgent('writer-gmi',     'research-team', 'writer');

// Role-routed delivery: the bus picks an agent currently holding the
// 'researcher' role inside the 'research-team' agency.
await bus.sendToRole('research-team', 'researcher', {
  type: 'task_delegation',
  fromAgentId: 'caller',
  content: { task: 'Review the orchestration rollout' },
  priority: 'normal',
});

// Hand off ownership of a task between agents — the bus issues an
// internal request_response, awaits acceptance, and notifies the sender.
const handoff = await bus.handoff('researcher-gmi', 'writer-gmi', {
  taskId: 'task-42',
  taskDescription: 'Turn the rollout review into a 4-bullet brief',
  progress: 0.6,
  completedWork: ['gathered findings'],
  remainingWork: ['draft', 'tighten copy'],
  context: { findings: ['…'] },
  reason: 'specialization',
});

console.log(handoff.accepted, handoff.newOwnerId);`,
    output: {
      busMessages: [
        {
          from: 'caller',
          to: 'researcher-gmi',
          status: 'success',
          preview:
            'findings: ["graph runtime stays shared", "checkpointing first-class", "examples side-by-side"]',
        },
        {
          from: 'researcher-gmi',
          to: 'writer-gmi',
          status: 'success',
          preview: 'handoff accepted; writer-gmi now owns the task',
        },
      ],
      usage: {},
    },
    caption: (
      <>
        Lower-level than <code className="font-mono text-[var(--color-accent-primary)]">agency()</code>: explicit per-agent IDs, role routing, request/response messages with structured content, and ownership handoff. Useful when an external orchestrator (a queue, a workflow engine, a UI) needs to own scheduling and just wants AgentOS to be the message + memory substrate.
      </>
    ),
  },
  {
    id: 'router',
    title: 'One call: question in, grounded answer + sources out',
    exampleSlug: 'examples/query-router.mjs',
    language: 'typescript',
    code: `import { QueryRouter } from '@framers/agentos';

// QueryRouter is the one-call grounded-Q&A pipeline:
//   classify the question → retrieve the right amount of context →
//   generate a cited answer. You point it at markdown directories
//   (and the bundled platform knowledge tags along automatically) and
//   call route(). Use it instead of hand-rolling chunker + vector store
//   + retrieval logic + LLM call + citation collection for every Q&A
//   surface in your app.
const router = new QueryRouter({
  knowledgeCorpus: ['./docs', './packages/agentos/docs'],
  availableTools: ['web_search', 'deep_research'],
  verifyCitations: true,
});

await router.init();

const result = await router.route('how do I configure a guardrail?');

console.log(result.answer);
console.log(result.sources);
console.log(result.classification.tier);  // 0 / 1 / 2 / 3
console.log(result.tiersUsed);             // which tiers actually ran
console.log(result.fallbacksUsed);         // e.g. ['keyword-fallback']`,
    output: {
      classification: { tier: 1, strategy: 'simple', confidence: 0.92 },
      tiersUsed: [1],
      fallbacksUsed: [],
      answer:
        'Pass `guardrails: [...]` to `agent()` or `agency()`. Each guardrail is a function that runs on input or output and can block, mutate, or annotate the message. AgentOS ships built-in guardrails for PII redaction, ML-classifier scoring, content policy, citation grounding, and topicality — register them as input/output hooks on the agent config.',
      sources: [
        {
          title: 'Guardrails Configuration',
          uri: 'docs/safety/GUARDRAILS.md',
          snippet: 'Register guardrails on `agent({ guardrails: [...] })`. Each guardrail is invoked …',
        },
        {
          title: 'Built-in Guardrails',
          uri: 'docs/safety/BUILTIN_GUARDRAILS.md',
          snippet: 'PII redaction, ML classifiers, content policy, citation grounding, topicality …',
        },
      ],
      corpusStats: {
        chunks: 1720,
        topics: 50,
        sources: 333,
        platform: { tools: 110, skills: 82, faq: 38, api: 15, troubleshooting: 15 },
      },
      usage: {},
    },
    caption: (
      <>
        One call replaces chunker + vector store + classifier + retrieval + LLM call + citation collection. Returns the answer, the sources it pulled from, the tier path it took (0–3), and any fallback strategies activated. Set <code className="font-mono text-[var(--color-accent-primary)]">verifyCitations: true</code> and the result also carries a per-claim verdict from <code className="font-mono text-[var(--color-accent-primary)]">CitationVerifier</code>. Swap the in-memory vector store for Postgres pgvector or Qdrant in production.
      </>
    ),
  },
  {
    id: 'high-level-api',
    title: 'Provider-first primitives — one shape, four wrappers',
    exampleSlug: 'examples/high-level-api.mjs',
    language: 'typescript',
    code: `import { generateText, streamText, generateImage, agent } from '@framers/agentos';

// Pick a provider and AgentOS picks the default model.
// Reads OPENAI_API_KEY / ANTHROPIC_API_KEY / etc. from env.
const quick = await generateText({
  provider: 'openai',
  prompt: 'Explain what QUIC is in 3 concise bullet points.',
});
console.log(quick.text);

// Pin a specific model when you need it.
const pinned = await generateText({
  provider: 'openai',
  model: 'gpt-4o',
  prompt: 'What is TCP in one sentence?',
});

// Same shape for streaming.
const stream = await streamText({
  provider: 'openai',
  prompt: 'Compare QUIC vs TCP.',
});
for await (const chunk of stream.textStream) process.stdout.write(chunk);

// Same shape for image generation.
const img = await generateImage({
  provider: 'openai',
  prompt: 'Diagram of QUIC vs TCP, infographic style',
});

// Same shape for agents.
const researcher = agent({
  provider: 'openai',
  model: 'gpt-4o',
  instructions: 'You are a network protocols researcher.',
});
const result = await researcher.generate('What problems was QUIC designed to solve?');`,
    output: {
      finalAnswerLabel: 'generateText() — provider=openai, default model',
      finalAnswer: `- Transport Protocol: QUIC (Quick UDP Internet Connections) is a modern transport protocol developed by Google, designed to improve performance and security of internet connections by operating over UDP instead of TCP.

- Reduced Latency: It reduces latency by integrating features such as connection multiplexing, 0-RTT connection establishment, and forward error correction, which enhance speed and reliability for web and mobile applications.

- Enhanced Security: QUIC incorporates built-in encryption similar to TLS/SSL, ensuring secure data transmission over the network, with minimal latency incurred from cryptographic handshakes.`,
      usage: {},
    },
    caption: (
      <>
        Provider-first wrappers around the LLM call. <code className="font-mono text-[var(--color-accent-primary)]">generateText()</code>, <code className="font-mono text-[var(--color-accent-primary)]">streamText()</code>, <code className="font-mono text-[var(--color-accent-primary)]">generateImage()</code>, and <code className="font-mono text-[var(--color-accent-primary)]">agent()</code> all accept the same <code className="font-mono text-[var(--color-accent-primary)]">{`{ provider, model?, prompt, ... }`}</code> shape. Pick a provider and AgentOS picks the default model; override with <code className="font-mono text-[var(--color-accent-primary)]">model:</code> when you need a specific one. Drop-in for ad-hoc calls without spinning up a full agent.
      </>
    ),
  },
  {
    id: 'workflow-dsl',
    title: 'Type-safe workflow DSL with checkpoints + replay',
    exampleSlug: 'examples/workflow-dsl.mjs',
    language: 'typescript',
    code: `import { GraphRuntime, InMemoryCheckpointStore, workflow } from '@framers/agentos';
import { z } from 'zod';

// workflow() builds a typed step DAG. Inputs and outputs validated by Zod.
// .branch() routes by a state predicate; .parallel() fans out a stage;
// .then() can run an LLM call (gmi:) instead of a tool.
const onboarding = workflow('user-onboarding')
  .input(z.object({
    email: z.string().email(),
    name: z.string(),
    desiredPlan: z.enum(['free', 'pro']),
  }))
  .returns(z.object({
    userId: z.string().optional(),
    plan: z.enum(['free', 'pro']).optional(),
    summary: z.string().optional(),
  }))
  .step('validate-email', { tool: 'email_validator' })
  .branch((state) => state.input.desiredPlan, {
    pro:  { tool: 'activate_pro_plan' },
    free: { tool: 'create_free_account' },
  })
  .parallel(
    [{ tool: 'send_welcome_email' }, { tool: 'notify_crm' }],
    { strategy: 'all', merge: { 'scratch.completedTasks': 'concat' } },
  )
  .then('summarize', {
    gmi: { instructions: 'Summarize the onboarding result for the caller.' },
  })
  .compile();

// GraphRuntime executes the compiled DAG, persists checkpoints between
// steps, and emits a typed event stream you can subscribe to.
const runtime = new GraphRuntime({
  checkpointStore: new InMemoryCheckpointStore(),
  nodeExecutor,  // tool dispatcher; see source for the full switch
});

const { artifacts } = await runtime.run(onboarding, {
  email: 'john@example.com',
  name: 'John',
  desiredPlan: 'pro',
});`,
    output: {
      missionSteps: [
        { id: 'validate-email', type: 'tool', executor: 'tool' },
        { id: 'router-2', type: 'tool', executor: 'branch' },
        { id: 'branch-pro-4', type: 'tool', executor: 'tool' },
        { id: 'parallel-0-8', type: 'tool', executor: 'parallel' },
        { id: 'parallel-1-11', type: 'tool', executor: 'parallel' },
        { id: 'summarize', type: 'gmi', executor: 'gmi' },
      ],
      missionArtifacts: {
        'validate-email': { valid: true },
        'router-2': 'pro',
        userId: 'usr_pro_001',
        plan: 'pro',
        summary: 'Created a pro account for John. Completed tasks: validated email, queued welcome email, updated CRM.',
      },
      missionConfidence: 1.0,
      usage: {},
    },
    caption: (
      <>
        Workflow-as-code in TypeScript. Define steps with <code className="font-mono text-[var(--color-accent-primary)]">.step()</code>, branches with <code className="font-mono text-[var(--color-accent-primary)]">.branch()</code>, parallel stages with <code className="font-mono text-[var(--color-accent-primary)]">.parallel()</code>, LLM steps with <code className="font-mono text-[var(--color-accent-primary)]">.then(name, {`{ gmi: ... }`})</code>; attach Zod schemas for input + output. <code className="font-mono text-[var(--color-accent-primary)]">GraphRuntime</code> compiles to a node DAG, persists a checkpoint between every step, and emits a typed event stream (<code className="font-mono text-[var(--color-accent-primary)]">node_start</code>, <code className="font-mono text-[var(--color-accent-primary)]">edge_transition</code>, <code className="font-mono text-[var(--color-accent-primary)]">checkpoint_saved</code>, <code className="font-mono text-[var(--color-accent-primary)]">run_end</code>). Replay from any checkpoint, fork mid-run, audit every transition.
      </>
    ),
  },
]

function CopyCodeButton({ code }: { code: string }) {
  const { copied, copy } = useCopyToClipboard()
  return (
    <button
      type="button"
      onClick={() => copy(code)}
      aria-label={copied ? 'Copied' : 'Copy code'}
      className={
        'inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium transition-colors ' +
        (copied
          ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
          : 'border-[var(--color-border-subtle)] bg-transparent text-[var(--color-text-secondary)] hover:border-[var(--color-border-interactive)] hover:text-[var(--color-text-primary)]')
      }
    >
      {copied ? (
        <>
          <Check className="h-3 w-3" />
          <span>Copied</span>
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          <span>Copy</span>
        </>
      )}
    </button>
  )
}

function ForgeBadge({ agent, approved, comment }: { agent: string; approved: boolean; comment?: string }) {
  return (
    <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 mb-4 dark:bg-emerald-500/10">
      <div className="font-mono text-[13px]">
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">[FORGE]</span>{' '}
        spawned <span className="text-[var(--color-text-primary)]">&quot;{agent}&quot;</span>
      </div>
      <div className="ml-7 font-mono text-[12px] text-[var(--color-text-secondary)]">
        approved=<span className="text-emerald-700 dark:text-emerald-400">{String(approved)}</span>
      </div>
      {comment && (
        <div className="ml-7 mt-1 font-mono text-[11px] italic text-[var(--color-text-muted)]">
          {`// ${comment}`}
        </div>
      )}
    </div>
  )
}

function FinalAnswerBlock({ text, label }: { text: string; label?: string }) {
  return (
    <div className="mb-4">
      <div className="mb-1.5 font-mono text-[12px] font-semibold uppercase tracking-wider text-[var(--color-accent-primary)]">
        {label ?? 'Final answer (gpt-4o)'}
      </div>
      <div className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-secondary)] p-3 text-[13px] leading-[1.65] text-[var(--color-text-primary)] whitespace-pre-wrap">
        {text}
      </div>
    </div>
  )
}

function DagTiersBlock({ tiers }: { tiers: NonNullable<DemoOutput['dagTiers']> }) {
  return (
    <div className="mb-4">
      <div className="mb-2 font-mono text-[12px] font-semibold uppercase tracking-wider text-[var(--color-accent-primary)]">
        Topo-sorted tiers
      </div>
      <div className="space-y-2">
        {tiers.map((t) => (
          <div
            key={t.tier}
            className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-secondary)] p-3"
          >
            <div className="flex items-center gap-3 font-mono text-[12px]">
              <span className="rounded bg-[var(--color-background-tertiary)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Tier {t.tier}
              </span>
              <span className="text-[var(--color-text-muted)]">
                {t.agents.length === 1 ? 'sequential' : `${t.agents.length} concurrent`}
              </span>
            </div>
            <div className="mt-1 ml-2 font-mono text-[12px] leading-[1.7]">
              {t.agents.map((a, i) => (
                <div key={i}>
                  <span className="text-[var(--color-accent-primary)]">→</span>{' '}
                  <span className="text-[var(--color-text-primary)]">{a.name}</span>
                  <span className="text-[var(--color-text-muted)]"> · {(a.durationMs / 1000).toFixed(2)}s</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MissionStepsBlock({
  steps,
  artifacts,
  confidence,
}: {
  steps: NonNullable<DemoOutput['missionSteps']>
  artifacts: NonNullable<DemoOutput['missionArtifacts']>
  confidence: number
}) {
  return (
    <>
      <div className="mb-4">
        <div className="mb-2 font-mono text-[12px] font-semibold uppercase tracking-wider text-[var(--color-accent-primary)]">
          Generated step plan
        </div>
        <div className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-secondary)] overflow-hidden">
          <table className="w-full font-mono text-[12px]">
            <thead className="bg-[var(--color-background-tertiary)] text-[var(--color-text-muted)]">
              <tr>
                <th className="text-left px-3 py-1.5 font-semibold">id</th>
                <th className="text-left px-3 py-1.5 font-semibold">type</th>
                <th className="text-left px-3 py-1.5 font-semibold">executor</th>
              </tr>
            </thead>
            <tbody>
              {steps.map((s) => (
                <tr key={s.id} className="border-t border-[var(--color-border-subtle)]">
                  <td className="px-3 py-1.5 text-[var(--color-text-primary)]">{s.id}</td>
                  <td className="px-3 py-1.5">
                    <span
                      className={
                        s.type === 'gmi'
                          ? 'text-[var(--color-accent-primary)]'
                          : 'text-amber-600 dark:text-amber-400'
                      }
                    >
                      {s.type}
                    </span>
                  </td>
                  <td className="px-3 py-1.5 text-[var(--color-text-secondary)]">{s.executor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mb-4">
        <div className="mb-1.5 font-mono text-[12px] font-semibold uppercase tracking-wider text-[var(--color-accent-primary)]">
          Final artifacts <span className="text-[var(--color-text-muted)]">· confidence {(confidence * 100).toFixed(0)}%</span>
        </div>
        <pre className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-secondary)] p-3 font-mono text-[12px] leading-[1.65] text-[var(--color-text-primary)] whitespace-pre-wrap">
{JSON.stringify(artifacts, null, 2)}
        </pre>
      </div>
    </>
  )
}

function BusMessagesBlock({ messages }: { messages: NonNullable<DemoOutput['busMessages']> }) {
  return (
    <div className="mb-4">
      <div className="mb-2 font-mono text-[12px] font-semibold uppercase tracking-wider text-[var(--color-accent-primary)]">
        Bus traffic
      </div>
      <div className="space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-secondary)] p-3"
          >
            <div className="flex items-center gap-2 font-mono text-[12px]">
              <span className="text-[var(--color-text-secondary)]">{m.from}</span>
              <span className="text-[var(--color-accent-primary)]">→</span>
              <span className="text-[var(--color-text-primary)]">{m.to}</span>
              <span
                className={
                  'ml-auto rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wider ' +
                  (m.status === 'success'
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/30')
                }
              >
                {m.status}
              </span>
            </div>
            <div className="mt-1.5 font-mono text-[11px] leading-[1.55] text-[var(--color-text-secondary)]">
              {m.preview}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CorpusStatsBlock({ stats }: { stats: NonNullable<DemoOutput['corpusStats']> }) {
  return (
    <div className="mb-4">
      <div className="mb-2 font-mono text-[12px] font-semibold uppercase tracking-wider text-[var(--color-accent-primary)]">
        Corpus initialized
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-secondary)] p-3">
          <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">chunks</div>
          <div className="font-mono text-[18px] tabular-nums text-[var(--color-text-primary)]">
            {stats.chunks.toLocaleString()}
          </div>
        </div>
        <div className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-secondary)] p-3">
          <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">topics</div>
          <div className="font-mono text-[18px] tabular-nums text-[var(--color-text-primary)]">
            {stats.topics}
          </div>
        </div>
        <div className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-secondary)] p-3">
          <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">sources</div>
          <div className="font-mono text-[18px] tabular-nums text-[var(--color-text-primary)]">
            {stats.sources}
          </div>
        </div>
      </div>
      <div className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-secondary)] p-3">
        <div className="mb-1.5 font-mono text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">
          Platform knowledge entries
        </div>
        <div className="grid grid-cols-5 gap-2 font-mono text-[12px]">
          {Object.entries(stats.platform).map(([k, v]) => (
            <div key={k} className="flex flex-col">
              <span className="text-[var(--color-text-muted)]">{k}</span>
              <span className="text-[var(--color-text-primary)] tabular-nums">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StreamingBlock({ preface, finalText }: { preface: string; finalText: string }) {
  return (
    <>
      <div className="mb-4">
        <div className="mb-1.5 font-mono text-[12px] font-semibold uppercase tracking-wider text-[var(--color-accent-primary)]">
          Live token stream (raw)
        </div>
        <div className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-secondary)] p-3 text-[13px] leading-[1.6] text-[var(--color-text-primary)] whitespace-pre-wrap max-h-72 overflow-y-auto">
          {preface}
          <span className="inline-block ml-1 align-middle h-3.5 w-1.5 bg-[var(--color-accent-primary)] animate-pulse" />
        </div>
      </div>
      <div className="mb-4">
        <div className="mb-1.5 font-mono text-[12px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          HITL gate → approved final
        </div>
        <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 font-mono text-[13px] leading-[1.65] text-[var(--color-text-primary)] whitespace-pre-wrap">
          {finalText}
        </div>
      </div>
    </>
  )
}

function ClaimsBlock({ claims }: { claims: NonNullable<DemoOutput['claims']> }) {
  const supportedCount = claims.filter((c) => c.verdict === 'supported').length
  return (
    <div className="mb-4">
      <div className="mb-2 font-mono text-[12px] font-semibold uppercase tracking-wider text-[var(--color-accent-primary)]">
        Verification result · {supportedCount}/{claims.length} grounded
      </div>
      <div className="space-y-2">
        {claims.map((c, i) => (
          <div
            key={i}
            className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-secondary)] p-3"
          >
            <div className="flex items-start gap-2 font-mono text-[13px]">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">✓</span>
              <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mt-1">
                {c.verdict}
              </span>
              <span className="text-[var(--color-text-muted)]">·</span>
              <span className="font-mono text-[12px] tabular-nums text-amber-600 dark:text-amber-400">
                {(c.confidence * 100).toFixed(0)}%
              </span>
              <span className="flex-1 text-[var(--color-text-primary)]">{c.text}</span>
            </div>
            {c.source && (
              <div className="mt-1 ml-5 font-mono text-[11px] text-[var(--color-text-muted)] italic line-clamp-2">
                source: {c.source}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function AgentCallsBlock({ calls }: { calls: AgentCall[] }) {
  return (
    <div className="mb-3">
      <div className="mb-1 font-mono text-[12px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
        Agent calls ({calls.length})
      </div>
      <div className="font-mono text-[12px] leading-[1.7] text-[var(--color-text-secondary)]">
        {calls.map((c, i) => (
          <div key={i}>
            <span className="text-[var(--color-accent-primary)]">→</span>{' '}
            <span className="text-[var(--color-text-primary)]">{c.agent}:</span>{' '}
            <span>&quot;{c.input}&quot;</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function UsageBlock({ usage }: { usage: DemoOutput['usage'] }) {
  if (!usage.tokens && !usage.cost && !usage.latency) return null
  return (
    <div className="font-mono text-[12px] text-[var(--color-text-secondary)] tabular-nums">
      {usage.tokens !== undefined && (
        <span>
          tokens: <span className="text-[var(--color-text-primary)]">{usage.tokens.toLocaleString()}</span>
        </span>
      )}
      {usage.cost && (
        <span className="ml-4">
          cost: <span className="text-[var(--color-text-primary)]">{usage.cost}</span>
        </span>
      )}
      {usage.latency && (
        <span className="ml-4">
          latency: <span className="text-[var(--color-text-primary)]">{usage.latency}</span>
        </span>
      )}
    </div>
  )
}

function OutputPanel({ demo }: { demo: DemoData }) {
  const { output, exampleSlug } = demo
  return (
    <div className="group/panel relative overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-background-elevated)]/70 backdrop-blur-xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)] ring-1 ring-[var(--color-accent-primary)]/5 transition-all duration-300 hover:ring-[var(--color-accent-primary)]/15 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.25)] dark:hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.7)]">
      {/* Top accent gradient line — subtle but signals "this is the live
          surface" without screaming. Stronger on the right where the
          status badge sits. */}
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent-primary)]/40 to-emerald-400/60"
        aria-hidden="true"
      />
      <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] bg-[var(--color-background-tertiary)]/50 backdrop-blur-sm px-4 py-2.5">
        <div className="flex items-center gap-3">
          {/* Real macOS traffic-light dots — subtle nostalgia, evokes
              "this is a terminal session" without the gray-pellet look. */}
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.15)]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.15)]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#28c840] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.15)]" />
          </div>
          <span className="font-mono text-xs text-[var(--color-text-secondary)]">
            $ node {exampleSlug}
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          Live run
        </span>
      </div>
      <div className="px-5 py-4">
        {output.demoGif && (
          <figure className="mb-4 -mx-1 overflow-hidden rounded-lg border border-[var(--color-border-subtle)] bg-black/40">
            {output.demoGif.mp4Src ? (
              // Heavy animated demos ship as a muted, looping, inline <video>
              // (H.264 MP4, ~60% smaller than the old animated WebP/GIF).
              // preload="none" keeps it off the initial-load critical path.
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="none"
                poster={output.demoGif.poster}
                width={output.demoGif.width}
                height={output.demoGif.height}
                aria-label={output.demoGif.alt}
                className="w-full h-auto block"
              >
                <source src={output.demoGif.mp4Src} type="video/mp4" />
                {/* MP4 is the animated source (universally supported). The
                    <video> fallback is a STATIC poster/WebP, never the heavy
                    animated GIF — fetching that as fallback cost ~2.5MB. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={output.demoGif.poster ?? output.demoGif.webpSrc ?? output.demoGif.src}
                  alt={output.demoGif.alt}
                  width={output.demoGif.width}
                  height={output.demoGif.height}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto block"
                />
              </video>
            ) : (
              <picture>
                {output.demoGif.webpSrc && (
                  <source srcSet={output.demoGif.webpSrc} type="image/webp" />
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={output.demoGif.src}
                  alt={output.demoGif.alt}
                  width={output.demoGif.width}
                  height={output.demoGif.height}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto block"
                />
              </picture>
            )}
          </figure>
        )}
        {output.forge && <ForgeBadge {...output.forge} />}
        {output.dagTiers && <DagTiersBlock tiers={output.dagTiers} />}
        {output.missionSteps && output.missionArtifacts && (
          <MissionStepsBlock
            steps={output.missionSteps}
            artifacts={output.missionArtifacts}
            confidence={output.missionConfidence ?? 0}
          />
        )}
        {output.busMessages && <BusMessagesBlock messages={output.busMessages} />}
        {output.corpusStats && <CorpusStatsBlock stats={output.corpusStats} />}
        {output.streamPreface && output.finalOverride && (
          <StreamingBlock preface={output.streamPreface} finalText={output.finalOverride} />
        )}
        {output.finalAnswer && !output.streamPreface && (
          <FinalAnswerBlock text={output.finalAnswer} label={output.finalAnswerLabel} />
        )}
        {output.claims && <ClaimsBlock claims={output.claims} />}
        {output.agentCalls && <AgentCallsBlock calls={output.agentCalls} />}
        <UsageBlock usage={output.usage} />
      </div>
    </div>
  )
}

export function LiveRunDemoSection() {
  const { resolvedTheme } = useTheme()
  const locale = useLocale()
  const [activeId, setActiveId] = useState(demos[0].id)
  const active = demos.find((d) => d.id === activeId) ?? demos[0]
  const codeStyle = useMemo(() => (resolvedTheme === 'light' ? oneLight : atomDark), [resolvedTheme])

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
      {/* Ambient backdrop — soft accent-tinted radial behind the panels +
          a faint dot grid that catches the light without competing for
          attention. Both layers fade into the section background; nothing
          sits in front of content. */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,_var(--color-accent-primary)_0%,_transparent_60%)] opacity-[0.06] blur-3xl" />
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle,_var(--color-text-muted)_1px,_transparent_1px)] bg-[length:24px_24px]" />
      </div>

      <div className="mb-8 max-w-3xl">
        {/* Verified-runs badge with pulsing indicator — signals the section is
            live captures, not synthetic snippets. Sets the credibility tone
            before the heading lands. */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 backdrop-blur-md shadow-[0_0_20px_-8px_rgba(16,185,129,0.4)]">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Verified runs · Captured stdout
          </span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-[var(--color-text-primary)]">
          Real output from{' '}
          <span className="bg-gradient-to-r from-[var(--color-text-primary)] via-[var(--color-accent-primary)] to-[var(--color-text-primary)] bg-clip-text text-transparent">
            real scripts
          </span>
        </h2>
        <p className="mt-3 text-base text-[var(--color-text-secondary)]">
          Examples captured from <code className="font-mono text-[var(--color-text-primary)]">node examples/&hellip;.mjs</code> against the OpenAI API. The full source is committed at{' '}
          <a
            className="underline underline-offset-4 hover:opacity-80"
            href="https://github.com/framerslab/agentos/tree/master/examples"
            target="_blank"
            rel="noopener noreferrer"
          >
            framersai/agentos/examples
          </a>
          . Pick one.
        </p>
      </div>

      {/* Tab strip — horizontally scrollable on overflow with edge-fade
          gradients so users perceive the overflow on narrow viewports. */}
      <div className="relative mb-6 -mx-4 sm:mx-0">
        {/* Left edge fade — only visible on horizontal-scroll viewports */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[var(--color-background-primary)] via-[var(--color-background-primary)]/80 to-transparent sm:hidden"
          aria-hidden="true"
        />
        {/* Right edge fade */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[var(--color-background-primary)] via-[var(--color-background-primary)]/80 to-transparent sm:hidden"
          aria-hidden="true"
        />
        <div className="overflow-x-auto px-4 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-2 min-w-max sm:flex-wrap sm:min-w-0">
            {demos.map((d, i) => (
              <button
                key={d.id}
                onClick={() => setActiveId(d.id)}
                aria-pressed={d.id === activeId}
                className={
                  'group inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ' +
                  (d.id === activeId
                    ? 'border border-[var(--color-border-interactive)] bg-[var(--color-background-elevated)] text-[var(--color-text-primary)] shadow-sm ring-1 ring-[var(--color-accent-primary)]/25'
                    : 'border border-transparent bg-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-background-secondary)]')
                }
              >
                <span
                  className={
                    'font-mono text-[11px] tabular-nums transition-colors ' +
                    (d.id === activeId
                      ? 'text-[var(--color-accent-primary)] font-semibold'
                      : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)]')
                  }
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{d.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Side-by-side panels */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Code panel — matches the output panel's chrome (glass, accent
            top line, real macOS dots, hover ring) so the pair reads as
            one composed surface, not two stacked rectangles. */}
        <div className="group/panel relative overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-background-elevated)]/70 backdrop-blur-xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)] ring-1 ring-[var(--color-accent-primary)]/5 transition-all duration-300 hover:ring-[var(--color-accent-primary)]/15 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.25)] dark:hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.7)]">
          <div
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[var(--color-accent-primary)]/60 via-[var(--color-accent-primary)]/30 to-transparent"
            aria-hidden="true"
          />
          <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] bg-[var(--color-background-tertiary)]/50 backdrop-blur-sm px-4 py-2.5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex gap-1.5 shrink-0">
                <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.15)]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.15)]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#28c840] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.15)]" />
              </div>
              <span className="font-mono text-xs text-[var(--color-text-secondary)] truncate">
                {active.exampleSlug}
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-background-secondary)]/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
                TypeScript
              </span>
              <CopyCodeButton code={active.code} />
            </div>
          </div>
          <SyntaxHighlighter
            language={active.language}
            style={codeStyle}
            customStyle={{
              margin: 0,
              padding: '18px 20px',
              background: 'transparent',
              fontSize: '13px',
              lineHeight: '1.65',
            }}
            codeTagProps={{ style: { fontFamily: 'JetBrains Mono, Menlo, Consolas, monospace' } }}
          >
            {active.code}
          </SyntaxHighlighter>
        </div>

        {/* Output panel */}
        <OutputPanel demo={active} />
      </div>

      {/* Caption — border-left callout treatment to set the explanation
          apart from the surrounding panels. */}
      <div className="mt-6 max-w-3xl border-l-2 border-[var(--color-accent-primary)]/40 pl-4">
        <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {active.caption}
        </p>
      </div>

      {/* CTAs — clear three-tier visual hierarchy:
          1. Primary action  (solid, branded)
          2. Install snippet (outlined, mono)
          3. Tertiary links  (text-only, arrow-suffixed)
          A subtle divider between secondary and tertiary so the eye reads
          "act now / install / read more" without scanning every button. */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a
          href={`https://github.com/framerslab/agentos/blob/master/${active.exampleSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-text-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--color-background-primary)] shadow-sm transition-all hover:opacity-90 hover:shadow-md"
        >
          <Github className="h-4 w-4" />
          Source on GitHub
        </a>
        <a
          href="https://www.npmjs.com/package/@framers/agentos"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-background-elevated)] px-5 py-2.5 font-mono text-xs font-medium text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-border-interactive)] hover:bg-[var(--color-background-secondary)]"
        >
          npm install @framers/agentos
        </a>
        {/* Tier divider — visible on wide layouts only */}
        <span
          className="hidden h-6 w-px bg-[var(--color-border-subtle)] sm:block"
          aria-hidden="true"
        />
        <a
          href={`/${locale}/blog/agentos-memory-sota-longmemeval`}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition-all hover:text-[var(--color-text-primary)] hover:translate-x-0.5"
        >
          85.6% on LongMemEval-S
          <span aria-hidden="true">→</span>
        </a>
        <a
          href="https://github.com/framerslab/agentos/tree/master/examples"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition-all hover:text-[var(--color-text-primary)] hover:translate-x-0.5"
        >
          Browse all 18 examples
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  )
}
