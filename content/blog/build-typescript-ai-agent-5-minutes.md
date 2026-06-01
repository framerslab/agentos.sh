---
title: "Build a TypeScript AI Agent Runtime in 5 Minutes (AgentOS Quickstart)"
date: "2026-04-12"
excerpt: "From npm install to a working agent with cognitive memory, HEXACO personality, tools, and guardrails. Five steps, under 50 lines of TypeScript. Runtime-anchored quickstart with inline citations."
author: "AgentOS Team"
category: "Tutorial"
audience: "engineer"
image: "/img/blog/og/build-typescript-ai-agent-5-minutes.png"
keywords: "typescript ai agent runtime, build ai agent typescript, typescript ai agent framework, ai agent quickstart, agentos tutorial, AI agent SDK TypeScript, cognitive memory tutorial, HEXACO personality AI"
---

> "Begin at the beginning, the King said gravely, and go on till you come to the end: then stop."
>
> *Alice in Wonderland*, 1865

Five-minute tutorials are usually a lie. They omit the API key setup, they assume your network and your `node_modules` cooperate, and they end at "hello world" instead of at something you can use. This one tries not to be that. By the end of these five minutes you'll have a TypeScript AI agent runtime with persistent cognitive memory, an opt-in HEXACO personality, web search, and a guardrail pack. The whole thing is under fifty lines of TypeScript. None of those lines are placeholder code.

If you are setting up your first AgentOS agent and run into trouble at any step, the [Discord](https://wilds.ai/discord) is the fastest way to unblock yourself; we monitor it. Runnable examples live at [github.com/framerslab/agentos/tree/master/packages/agentos/examples](https://github.com/framerslab/agentos/tree/master/packages/agentos/examples). `high-level-api.mjs` is the closest match to this tutorial.

Zero to a working AI agent with personality, cognitive memory, web search, and guardrails. Five steps, under 50 lines of TypeScript.

## Step 1: Install

```bash
npm install @framers/agentos
```

Set your API key:

```bash
export OPENAI_API_KEY=sk-your-key
# or ANTHROPIC_API_KEY, GEMINI_API_KEY, GROQ_API_KEY, etc.
```

AgentOS auto-detects which provider you have configured. Supports [11 LLM providers](https://docs.agentos.sh/features/llm-output-validation) out of the box:

| Provider | API Key Variable | Models |
|----------|-----------------|--------|
| [OpenAI](https://platform.openai.com/) | `OPENAI_API_KEY` | GPT-4o, GPT-4o-mini, o1 |
| [Anthropic](https://www.anthropic.com/) | `ANTHROPIC_API_KEY` | Claude Opus 4, Sonnet 4, Haiku |
| [Google Gemini](https://ai.google.dev/) | `GEMINI_API_KEY` | Gemini 2.5 Pro, Flash |
| [Ollama](https://ollama.ai/) | Local (no key) | Llama 3, Mistral, Qwen |
| [Groq](https://groq.com/) | `GROQ_API_KEY` | Llama 3, Mixtral |
| [OpenRouter](https://openrouter.ai/) | `OPENROUTER_API_KEY` | 200+ models |
| [Together](https://www.together.ai/) | `TOGETHER_API_KEY` | Open-source models |
| [Mistral](https://mistral.ai/) | `MISTRAL_API_KEY` | Mistral Large, Small |
| [xAI](https://x.ai/) | `XAI_API_KEY` | Grok 2 |
| [Claude Code CLI](https://docs.agentos.sh/features/cli-providers) | PATH detection | Sonnet / Opus via subscription |
| [Gemini CLI](https://docs.agentos.sh/features/cli-providers) | PATH detection | Gemini via subscription |

## Step 2: Generate Text

```typescript
import { generateText } from '@framers/agentos';

const result = await generateText({
  provider: 'openai',
  model: 'gpt-4o',
  prompt: 'Explain the Monty Hall problem.',
});

console.log(result.text);
```

One LLM call, one response. Now let's add personality and memory.

## Step 3: Add Personality and Memory

```typescript
import { agent } from '@framers/agentos';

const assistant = agent({
  provider: 'anthropic',
  model: 'claude-sonnet-4-20250514',
  instructions: 'You are a helpful research assistant.',
  personality: {
    openness: 0.9,          // explores ideas broadly
    conscientiousness: 0.85, // thorough and organized
    agreeableness: 0.7,      // friendly but direct
  },
  memory: {
    enabled: true,
    decay: 'ebbinghaus',     // memories naturally fade over time
  },
});

// First conversation
const answer1 = await assistant.text('My name is Sarah and I study marine biology.');
// The agent remembers Sarah's name and field

// Later conversation, the agent still knows
const answer2 = await assistant.text('What topics would interest me?');
// Response references marine biology because it remembers
```

### How Personality Works

[HEXACO personality traits](https://docs.agentos.sh/features/cognitive-memory-guide), based on the [six-factor model from personality psychology](https://hexaco.org/hexaco-inventory) ([Ashton & Lee, 2004](https://doi.org/10.1207/s15327957pspr0802_1)), shape how the agent communicates. Recent research shows that [LLMs can reliably simulate HEXACO personality structures](https://arxiv.org/abs/2508.00742) with coherent factor recovery.

| Trait | High Value Effect | Low Value Effect |
|-------|------------------|-----------------|
| **Openness** | Explores tangential ideas, creative responses | Stays focused, conservative |
| **Conscientiousness** | Organized, thorough, detailed | Casual, brief |
| **Agreeableness** | Warm, accommodating | Direct, challenging |
| **Extraversion** | Enthusiastic, verbose | Reserved, concise |
| **Emotionality** | Empathetic, supportive | Analytical, detached |
| **Honesty-Humility** | Transparent, admits limitations | Confident, promotional |

### How Memory Works

[Cognitive memory](https://docs.agentos.sh/features/cognitive-memory) goes beyond chat history. [8 neuroscience-grounded mechanisms](https://docs.agentos.sh/api/classes/CognitiveMechanismsEngine) model how human memory actually works:

- **[Ebbinghaus decay](https://en.wikipedia.org/wiki/Forgetting_curve)**: memories fade exponentially over time (R = e^(-t/S)), [replicated and validated by Murre & Dros (2015)](https://pmc.ncbi.nlm.nih.gov/articles/PMC4492928/). High-importance events resist decay (flashbulb memories).
- **[Reconsolidation](https://doi.org/10.1038/35021052)**: retrieved memories drift toward the agent's current emotional context ([Nader et al., 2000](https://doi.org/10.1038/35021052)).
- **[Retrieval-induced forgetting](https://doi.org/10.1037/0096-3445.123.2.178)**: retrieving one memory suppresses competing memories ([Anderson et al., 1994](https://doi.org/10.1037/0096-3445.123.2.178)).
- **[4-tier hierarchy](https://docs.agentos.sh/features/memory-system-overview)**: working memory, episodic, semantic, observational. Memories consolidate upward automatically.

This approach mirrors the [ACT-R cognitive architecture](https://arxiv.org/html/2512.20651) used by recent AI memory systems like [Memory Bear](https://arxiv.org/html/2512.20651) and [CortexGraph](https://github.com/prefrontal-systems/cortexgraph), which also integrate Ebbinghaus decay with activation scheduling.

## Step 4: Add Tools

```typescript
const researcher = agent({
  provider: 'openai',
  model: 'gpt-4o',
  instructions: 'You are a research assistant with access to web search.',
  tools: ['web_search', 'deep_research', 'verify_citations'],
  memory: { enabled: true },
});

const result = await researcher.text(
  'What are the latest developments in room-temperature superconductors?'
);
// The agent searches the web, verifies claims against sources,
// and responds with cited information
```

AgentOS ships with [107+ curated extensions](https://github.com/framerslab/agentos-extensions) covering web search, news, image search, browser automation, deep research, and more. The [`verify_citations` tool](https://docs.agentos.sh/features/citation-verification) decomposes responses into atomic claims and checks each against sources using [NLI-based entailment scoring](https://docs.agentos.sh/api/classes/CitationVerifier).

## Step 5: Add Guardrails

```typescript
const safeBot = agent({
  provider: 'anthropic',
  model: 'claude-sonnet-4-20250514',
  instructions: 'You are a customer support agent for a SaaS product.',
  security: { tier: 'strict' },
  guardrails: {
    input: ['pii-redaction', 'ml-classifiers'],
    output: ['grounding-guard', 'code-safety'],
  },
  memory: { enabled: true },
  tools: ['web_search'],
});
```

[6 guardrail packs](https://docs.agentos.sh/features/guardrails) run on every request:

| Guardrail | Detection Method | What It Catches |
|-----------|-----------------|-----------------|
| **[PII Redaction](https://docs.agentos.sh/features/safety-primitives)** | 4-tier: regex + NLP + NER + LLM | Names, emails, SSNs, credit cards, addresses |
| **[ML Classifiers](https://docs.agentos.sh/features/guardrails-architecture)** | ONNX BERT models | Toxicity, prompt injection, jailbreak attempts |
| **[Topicality](https://docs.agentos.sh/features/guardrails)** | Embedding-based + drift detection | Off-topic messages, scope violations |
| **[Code Safety](https://docs.agentos.sh/features/guardrails)** | OWASP pattern scanning | Command injection, XSS, SQL injection in generated code |
| **[Grounding Guard](https://docs.agentos.sh/features/citation-verification)** | NLI-based claim verification | Hallucinated facts not supported by RAG sources |
| **[Content Policy](https://docs.agentos.sh/features/creating-guardrails)** | LLM rewrite/block | Configurable category enforcement |

[5 security tiers](https://docs.agentos.sh/features/guardrails): `dangerous` > `permissive` > `balanced` > `strict` > `paranoid`. Each tier controls tool access and guardrail enforcement. This layered approach addresses the [runtime security concerns](https://www.ibm.com/think/insights/agentic-ai-runtime-security) that IBM identifies as critical for agentic AI systems.

## Full Example: 47 Lines

```typescript
import { agent } from '@framers/agentos';

const myAgent = agent({
  // LLM
  provider: 'anthropic',
  model: 'claude-sonnet-4-20250514',
  instructions: `You are a knowledgeable research assistant.
    You search the web for current information,
    verify your claims against sources, and cite everything.`,

  // Personality (HEXACO six-factor model)
  personality: {
    openness: 0.9,
    conscientiousness: 0.85,
    agreeableness: 0.7,
    extraversion: 0.6,
    emotionality: 0.3,
    honestyHumility: 0.95,
  },

  // Cognitive memory with Ebbinghaus decay
  memory: {
    enabled: true,
    decay: 'ebbinghaus',
  },

  // Tools (107+ available extensions)
  tools: [
    'web_search',
    'deep_research',
    'verify_citations',
    'news_search',
  ],

  // Safety (6 guardrail packs, 5 security tiers)
  security: { tier: 'balanced' },
  guardrails: {
    input: ['pii-redaction'],
    output: ['grounding-guard'],
  },
});

// Use it
const response = await myAgent.text('What happened in tech this week?');
console.log(response);
```

## What's Next

- **[Deploy to messaging channels](https://docs.agentos.sh/features/channels)**: [37 adapters](https://docs.agentos.sh/features/channels) including Telegram, WhatsApp, Discord, Slack
- **[Add voice](https://docs.agentos.sh/features/voice-pipeline)**: [12 STT providers](https://docs.agentos.sh/features/voice-pipeline), [12 TTS providers](https://docs.agentos.sh/features/voice-pipeline), VAD, and [telephony](https://docs.agentos.sh/features/telephony-providers) via Twilio, Telnyx, Plivo
- **[Build multi-agent teams](https://docs.agentos.sh/features/agency-api)**: [6 coordination strategies](https://docs.agentos.sh/features/agency-collaboration) with [emergent tool forging](https://docs.agentos.sh/features/emergent-capabilities)
- **[Graph-based orchestration](https://docs.agentos.sh/features/workflow-dsl)**: `workflow()`, `AgentGraph`, and `mission()` for complex pipelines
- **[Full documentation](https://docs.agentos.sh)**: guides, [API reference](https://docs.agentos.sh/api), and architecture

```bash
npm install @framers/agentos
```

- [GitHub](https://github.com/framerslab/agentos)
- [npm](https://www.npmjs.com/package/@framers/agentos)
- [Documentation](https://docs.agentos.sh)
- [Discord](https://wilds.ai/discord)

## FAQ

### What's the minimum Node version?

Node 22 LTS or later. AgentOS uses native fetch, top-level await, and the structured-clone-friendly Worker APIs that all stabilized by 22.

### Can I use this without an OpenAI API key?

Yes. AgentOS auto-detects whichever provider key you set. Set `ANTHROPIC_API_KEY` for Claude, `GEMINI_API_KEY` for Gemini, or run [Ollama](https://ollama.ai/) locally with no key at all. The runtime resolves models the same way regardless of source.

### How does cognitive memory persist between sessions?

Cognitive memory writes to a backing store (SQLite by default, or your chosen Postgres instance) keyed by an agent ID. When the same agent ID is rehydrated in a new session, prior episodic memories load automatically and Ebbinghaus decay continues from where it left off. See the [memory persistence guide](https://docs.agentos.sh/features/cognitive-memory) for swap-out instructions.

### Is HEXACO required, or opt-in?

Opt-in. Omit the `personality` block entirely and the agent runs with no trait shaping. When provided, every trait defaults to 0.5 (neutral) so partial profiles work too.

### Can I run this fully local with Ollama?

Yes. Set `provider: 'ollama'`, `model: 'llama3'` (or any pulled tag), and skip the API key entirely. The full feature set (memory, HEXACO, tools, guardrails) works against local models. Latency depends on your hardware.

### What's the difference between AgentOS and other TypeScript agent frameworks?

The runtime ships cognitive memory, HEXACO personality, emergent tool forging, and guardrails as first-class primitives, not bolt-ons. Most TypeScript agent frameworks expose graph orchestration over an LLM and stop there. AgentOS treats the agent as a stateful runtime with measured memory and personality behavior. Comparisons against specific frameworks live in `/blog/agentos-vs-mastra` and `/blog/ai-agent-framework-comparison-2026` once those land.

---

**AgentOS** is built by [Frame](https://frame.dev). See [Wilds.ai](https://wilds.ai) for AI game worlds powered by AgentOS.
