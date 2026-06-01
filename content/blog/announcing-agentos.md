---
title: "Announcing AgentOS: Open-Source TypeScript AI Agent Runtime"
date: "2026-04-12"
excerpt: "AgentOS is an open-source TypeScript runtime for building AI agents with cognitive memory, HEXACO personality, multi-agent orchestration, runtime tool forging, 37 channel adapters, and 11 LLM providers. Apache 2.0 licensed."
author: "AgentOS Team"
category: "Announcements"
audience: "evaluator"
image: "/img/blog/og/announcing-agentos.png"
keywords: "agentos launch, ai agent framework, typescript ai agents, build ai agent, multi-agent orchestration, cognitive memory, open source ai framework, langgraph alternative, crewai alternative, mastra alternative, adaptive ai agents, emergent tool forging, agent simulation framework, AI agent SDK TypeScript"
---

> "So we and our elaborately evolving computers may meet each other halfway. Someday a human being, named perhaps Fred White, may shoot a robot named Pete Something-or-other, which has come out of a General Electric factory, and to his surprise see it weep and bleed. And the dying robot may shoot back and, to its surprise, see a wisp of gray smoke arise from the electric pump that it supposed was Mr. White's beating heart."
>
> — Philip K. Dick, *The Android and the Human*, 1972

Most agent frameworks treat the LLM as a function call, hand the result back to your application, and let your application do everything that should outlive the call. Memory across sessions, personality consistency, tool registration, multi-agent coordination, retry on tool failure: all of it ends up in handlers you write yourself. After enough handlers, the application code is the agent and the framework is a thin shim over the model.

AgentOS puts those concerns inside the runtime. Persistent cognitive memory, optional HEXACO personality, runtime tool forging in a hardened sandbox, six multi-agent orchestration strategies, streaming guardrails, a voice pipeline, and one dispatch interface across the major LLM providers. This post is the announcement that the project is open source under Apache 2.0 and that the public benchmark numbers are real.

The short version: `npm install @framers/agentos`.

## What AgentOS Is

[AgentOS](https://agentos.sh) is a TypeScript runtime for building AI agents that adapt, remember, and collaborate. Every agent is a **Generalized Mind Instance (GMI)**: a persistent cognitive core with personality traits, episodic memory, and autonomous decision-making.

```bash
npm install @framers/agentos
```

```typescript
import { agent } from '@framers/agentos';

const bot = agent({
  provider: 'anthropic',
  instructions: 'You are a helpful assistant.',
  personality: { openness: 0.9, conscientiousness: 0.85 },
  memory: { enabled: true, cognitive: true },
});

const reply = await bot.session('demo').send('What is AgentOS?');
console.log(reply.text);
```

## What Makes It Different

### Cognitive Memory

[8 neuroscience-grounded memory mechanisms](https://docs.agentos.sh/features/cognitive-memory) modulated by the agent's [HEXACO personality](https://docs.agentos.sh/features/cognitive-memory-guide):

- **[Reconsolidation](https://docs.agentos.sh/api/classes/CognitiveMechanismsEngine)**: memories rewrite each time they are recalled, incorporating new context. Based on [Nader et al. (2000)](https://doi.org/10.1038/35021052) on memory reconsolidation in fear conditioning.
- **[Retrieval-induced forgetting](https://docs.agentos.sh/api/classes/CognitiveMechanismsEngine)**: retrieving one memory suppresses related competing memories. Based on [Anderson et al. (1994)](https://doi.org/10.1037/0096-3445.123.2.178).
- **[Involuntary recall](https://docs.agentos.sh/api/classes/CognitiveMechanismsEngine)**: contextual cues trigger unexpected memory retrieval. Based on [Berntsen (2010)](https://doi.org/10.1177/1745691610370007).
- **[Ebbinghaus decay](https://docs.agentos.sh/api/classes/CognitiveMechanismsEngine)**: exponential memory decay following the [forgetting curve](https://en.wikipedia.org/wiki/Forgetting_curve), [replicated and validated by Murre & Dros (2015)](https://pmc.ncbi.nlm.nih.gov/articles/PMC4492928/).
- **Feeling-of-knowing, temporal gist extraction, schema encoding, source confidence decay**: each mechanism implemented in the [`CognitiveMechanismsEngine`](https://docs.agentos.sh/api/classes/CognitiveMechanismsEngine), with trait modulation controlled by [HEXACO personality dimensions](https://hexaco.org/hexaco-inventory).

Memory follows a [4-tier hierarchy](https://docs.agentos.sh/features/memory-system-overview) (working memory, episodic, semantic, observational) that consolidates upward automatically. This approach is grounded in the same [ACT-R cognitive architecture](https://arxiv.org/html/2512.20651) principles used by recent systems like [Memory Bear](https://arxiv.org/html/2512.20651) and [CortexGraph](https://github.com/prefrontal-systems/cortexgraph).

### Multi-Agent Orchestration

[6 coordination strategies](https://docs.agentos.sh/features/agency-api) for teams of specialized agents:

| Strategy | Description | Use Case |
|----------|-------------|----------|
| Sequential | Linear pipeline, each agent refines previous output | Editing chains, translation pipelines |
| Parallel | Fan-out to all agents simultaneously | Research, brainstorming, redundancy |
| Debate | Agents argue positions, synthesize consensus | Decision-making under uncertainty |
| Review loop | Author and reviewer iterate until quality threshold | Content QA, code review |
| Hierarchical | Manager delegates to specialized workers | Task decomposition |
| Graph (DAG) | Dependency-based execution with conditional branching | Complex multi-step workflows |

Agents share memory through the [`AgentCommunicationBus`](https://docs.agentos.sh/api/classes/AgentCommunicationBus) and coordinate via the [`AgencyRegistry`](https://docs.agentos.sh/api/classes/AgencyRegistry).

When `strategy: 'hierarchical'` is paired with `emergent: { enabled: true }`, the manager LLM gets a `spawn_specialist` tool alongside its `delegate_to_<name>` tools. Calling it forges a new sub-agent at runtime via [`EmergentAgentForge`](https://docs.agentos.sh/api/classes/EmergentAgentForge), gates it through [`EmergentAgentJudge`](https://docs.agentos.sh/api/classes/EmergentAgentJudge) for safety review, and adds the new specialist to the live roster, so `delegate_to_<spawned-role>` becomes available on the next turn. Bounds via `planner.maxSpecialists`, `planner.maxJudgeCalls`, and an optional HITL `beforeEmergent` gate. See [Hierarchical + emergent agent spawning](https://docs.agentos.sh/architecture/emergent-agency-system) for the worked example.

[![AgentOS spawning a security_audit_specialist agent at runtime, side-by-side with the source code](/img/blog/og/agentos-emergent-demo.png)](/demo/emergent-spawning.html)

The image above is captured from a real `node examples/emergent-hierarchical-spawning.mjs` run. The team starts with researcher + writer; the prompt requires a security audit; the manager calls `spawn_specialist`, EmergentAgentJudge approves the spec, and `security_audit_specialist` joins the live roster. The `[FORGE]` line is the moment that happens. Reproduce: `node examples/emergent-hierarchical-spawning.mjs` after `npm install @framers/agentos` and `export OPENAI_API_KEY=...`.

### Emergent Tool Forging

Agents [create new tools at runtime](https://docs.agentos.sh/features/emergent-capabilities) when no existing tool fits the task:

- **Compose mode**: chains existing tools into pipelines (safe by construction)
- **Sandbox mode**: generates code in a memory-bounded, time-limited isolation environment

An [`EmergentJudge`](https://docs.agentos.sh/api/classes/EmergentJudge) reviews safety and correctness before activation. Approved tools promote through [3 trust tiers](https://docs.agentos.sh/features/emergent-capabilities): session, agent, shared. The [`EmergentToolRegistry`](https://docs.agentos.sh/api/classes/EmergentToolRegistry) tracks usage and confidence scores.

### Production Infrastructure

- **[11 LLM providers](https://docs.agentos.sh/features/llm-output-validation)** with automatic fallback chains: OpenAI, Anthropic, Gemini, Ollama, OpenRouter, Groq, Together, Mistral, xAI, plus [CLI bridges](https://docs.agentos.sh/features/cli-providers) for Claude Code and Gemini CLI
- **[37 channel adapters](https://docs.agentos.sh/features/channels)**: Telegram, Discord, Slack, WhatsApp, email, webchat, Twitter/X, Instagram, Reddit, Bluesky, Mastodon, and [26 more](https://docs.agentos.sh/features/channels)
- **[6 guardrail packs](https://docs.agentos.sh/features/guardrails)** across [5 security tiers](https://docs.agentos.sh/features/guardrails) from `permissive` to `paranoid`: [PII redaction](https://docs.agentos.sh/features/safety-primitives) (4-tier detection: regex + NLP + NER + LLM), [prompt injection defense](https://docs.agentos.sh/features/guardrails-architecture), [grounding guards](https://docs.agentos.sh/features/citation-verification), [code safety scanning](https://docs.agentos.sh/features/guardrails), topicality enforcement, content policy
- **[Multimodal RAG](https://docs.agentos.sh/features/multimodal-rag)**: [7 vector backends](https://docs.agentos.sh/features/rag-memory) (SQLite to Qdrant), [4 retrieval strategies](https://docs.agentos.sh/features/rag-memory), [GraphRAG](https://docs.agentos.sh/features/rag-memory) with [Louvain community detection](https://doi.org/10.1088/1742-5468/2008/10/P10008) ([Blondel et al., 2008](https://doi.org/10.1088/1742-5468/2008/10/P10008)), [10 document loaders](https://docs.agentos.sh/features/multimodal-rag)
- **[Voice pipeline](https://docs.agentos.sh/features/voice-pipeline)**: [12 STT providers](https://docs.agentos.sh/features/voice-pipeline), [12 TTS providers](https://docs.agentos.sh/features/voice-pipeline), VAD, speaker diarization, [telephony](https://docs.agentos.sh/features/telephony-providers) via Twilio, Telnyx, Plivo
- **[Graph-based orchestration](https://docs.agentos.sh/features/workflow-dsl)**: `workflow()` for deterministic DAGs, `AgentGraph` for loops and custom control flow, `mission()` for planner-driven orchestration
- **[OpenTelemetry observability](https://docs.agentos.sh/features/cost-optimization)**: opt-in OTEL export, cost tracking, token usage, session audit logs

### TypeScript Native

Full type safety with [Zod-validated structured output](https://docs.agentos.sh/features/structured-output). ESM-first architecture. The [TypeDoc API reference](https://docs.agentos.sh/api) documents every public class, interface, and function.

## How AgentOS Compares

| Capability | AgentOS | [LangGraph](https://www.langchain.com/langgraph) | [CrewAI](https://crewai.com) | [Mastra](https://mastra.ai) | [VoltAgent](https://voltagent.dev/) |
|------------|---------|-----------|--------|--------|-----------|
| Language | TypeScript | Python + JS | Python | TypeScript | TypeScript |
| Cognitive memory | [8 mechanisms](https://docs.agentos.sh/features/cognitive-memory) + Ebbinghaus decay | Checkpoints | Short/long-term | Semantic | Conversation + RAG |
| Personality | [HEXACO 6-factor](https://docs.agentos.sh/features/cognitive-memory-guide) | None | Role descriptions | None | None |
| Channel adapters | [37](https://docs.agentos.sh/features/channels) | None | None | None | None |
| Voice pipeline | [12 STT + 12 TTS](https://docs.agentos.sh/features/voice-pipeline) | None | None | None | None |
| Guardrails | [6 packs](https://docs.agentos.sh/features/guardrails) | Middleware | Basic | None | Module |
| Tool forging | [Runtime creation](https://docs.agentos.sh/features/emergent-capabilities) | None | None | None | None |

See [AgentOS vs LangGraph vs CrewAI vs Mastra vs VoltAgent](/blog/agentos-vs-langgraph-vs-crewai) for the full comparison.

## What we measured (and what we didn't)

AgentOS ships with [agentos-bench](https://github.com/framerslab/agentos-bench), an Apache 2.0 memory benchmark suite. We publish bootstrap CIs at 10k resamples on every headline number and the per-cell run JSON for replication. The recent results:

- **LongMemEval-S**: 85.6% [82.4%, 88.6%] at $0.0090 per correct, gpt-4o reader, 4-second avg latency. Beats Mastra OM gpt-4o (84.2% published) on accuracy at the same answer LLM. Beats EmergenceMem Simple Fast (80.6% measured in our harness, their public reference repo ships with no LICENSE) by +5.0 points at 6.5x lower cost-per-correct. Statistically tied with EmergenceMem Internal's published 86.0%, but Emergence's number comes from **closed-source SaaS at [emergence.ai/web-automation-api](https://www.emergence.ai/web-automation-api), not a library you can install**. AgentOS ships the full architecture under [Apache-2.0](https://github.com/framerslab/agentos/blob/master/LICENSE).
- **LongMemEval-M** (1.5M tokens, 500 sessions per haystack): 70.2% [66.0%, 74.0%] at $0.0078 per correct with reader-router top-K=5. Competitive with the strongest published M results in the original LongMemEval paper ([Wu et al, ICLR 2025, Table 3](https://arxiv.org/abs/2410.10813)). At Top-5, +4.5 points above the paper's round-level configuration (65.7%) and 1.2 below the paper's session-level configuration (71.4%); 1.8 below the paper's overall best (72.0% at round-level Top-10).

We do not run benchmarks against vendors that don't ship complete standalone runnables. We do not claim X-times-cheaper unless reader model and config match between the two systems being compared. The entire methodology (judges, sample sizes, judge FPR probes, adversarial calibration) is documented in [agentos-bench/docs](https://github.com/framerslab/agentos-bench/tree/master/docs).

This is what an honest benchmark looks like. If something on this list is wrong, file an issue against agentos-bench and we'll fix it or retract the claim.

## Get Started

- [Documentation](https://docs.agentos.sh)
- [GitHub](https://github.com/framerslab/agentos)
- [Discord](https://wilds.ai/discord)
- [npm](https://www.npmjs.com/package/@framers/agentos)
- [How to Build a TypeScript AI Agent in 5 Minutes](/blog/build-typescript-ai-agent-5-minutes)
- [Adaptive vs. Emergent Intelligence](/blog/adaptive-vs-emergent)
- [Paracosm launch](/blog/paracosm-launch), the simulation product built on AgentOS

## FAQ

**Why TypeScript?** Most AI infrastructure is Python. Most production application code is JavaScript or TypeScript. The runtime that lives inside an application should match the application's language. AgentOS does. The Python interop story is via the API server (REST/SSE) or via JSON Schema-generated types from the artifact schema.

**Is AgentOS a LangGraph alternative?** It's an alternative if your job is "build an AI agent with memory and personality and tools." It is not an alternative if your job is "compose Python research code into a workflow." Different jobs. We have a [head-to-head comparison post](/blog/agentos-vs-langgraph-vs-crewai) with honest-cost-rule applied.

**Does AgentOS lock me into a specific LLM?** No. 11 provider adapters ship; you can add yours in ~50 lines if it's not in the list. The provider abstraction is decoupled from the agent abstraction.

**What's the deal with HEXACO personality?** It's optional. Pass `personality` and the runtime biases retrieval, decision routing, and tool selection by the trait vector. Don't pass it and the runtime acts personality-neutral. We don't make HEXACO the centerpiece because not every agent needs it; we just make it work cleanly when you want it.

**Is the cognitive memory feature the same as RAG?** No. RAG retrieves documents. Cognitive memory is a layered system covering short-term context, episodic memory (events with time and emotion encoding), semantic memory (facts and relationships), and a Ebbinghaus-style decay model for forgetting. RAG is one of the retrievers cognitive memory composes with. The [Cognitive Memory docs](https://docs.agentos.sh/features/cognitive-memory) walk through every mechanism with primary-source citations.

**Can AgentOS run agents that talk on the phone?** Yes. The voice pipeline (12 STT providers, 12 TTS providers) plus telephony adapters in the channels system gets you a voice agent that runs as a phone call. We have [a case study with Wilds.ai](/blog/ai-companion-case-study-wilds) on the companion side of the same stack.

**What about safety?** Six guardrail packs ship: topicality, ML classifiers (toxicity / prompt-injection / NSFW), grounding (NLI), PII redaction, code safety (static analysis), and skills (curated SKILL.md execution). Each has its own README in the [packages/agentos-ext-*](https://github.com/framerslab/agentos/tree/master/packages) tree.

**Is this production-ready for X?** Define X. We don't publish a generic "production-ready" label because the answer depends on what you're shipping. We do publish concrete benchmark numbers, concrete safety posture, and concrete provider compatibility. Read those, judge for yourself, file issues when we miss.

[Apache 2.0 licensed](https://github.com/framerslab/agentos/blob/master/LICENSE). Built by [Frame](https://frame.dev).
