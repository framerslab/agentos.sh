---
title: "Build a TypeScript AI Agent Runtime in 5 Minutes (AgentOS Quickstart)"
date: "2026-04-12"
excerpt: "From npm install to a TypeScript agent with a HEXACO personality, cognitive memory across sessions, web search and a claim-by-claim citation check. Five steps."
author: "AgentOS Team"
category: "Tutorial"
audience: "engineer"
image: "/img/blog/og/build-typescript-ai-agent-5-minutes.png"
keywords: "typescript ai agent runtime, build ai agent typescript, typescript ai agent framework, ai agent quickstart, agentos tutorial, AI agent SDK TypeScript, cognitive memory tutorial, HEXACO personality AI"
---

> "Begin at the beginning, the King said gravely, and go on till you come to the end: then stop."
>
> *Alice in Wonderland*, 1865

Five-minute tutorials are usually a lie. They omit the API key setup, they assume your network and your `node_modules` cooperate, and they end at "hello world" instead of at something you can use. This one tries not to be that. By the end of these five minutes you'll have a TypeScript agent with an opt-in HEXACO personality, cognitive memory that carries what a user told it into their next session, a web search tool, and a check that scores every claim in an answer against the sources it found. The full example is 67 lines of TypeScript. None of those lines are placeholder code.

If you are setting up your first AgentOS agent and run into trouble at any step, the [Discord](https://wilds.ai/discord) is the fastest way to unblock yourself; we monitor it. Runnable examples live in [examples/](https://github.com/framerslab/agentos/tree/master/examples) in the agentos repository. They import the built `dist/`, so run them from a clone after `pnpm install && pnpm build`. `high-level-api.mjs` is the closest match to this tutorial.

Zero to a working AI agent with personality, cognitive memory, web search, and citation checks. Five steps.

## Step 1: Install

```bash
npm install @framers/agentos
```

Set your API key:

```bash
export OPENAI_API_KEY=sk-your-key
# or ANTHROPIC_API_KEY, GEMINI_API_KEY, GROQ_API_KEY, etc.
```

AgentOS auto-detects which provider you have configured. It ships [13 LLM providers](https://github.com/framerslab/agentos/blob/master/src/core/llm/providers/AIModelProviderManager.ts), each with the model it uses when you name none:

| Provider | API Key Variable | Default model |
|----------|-----------------|---------------|
| [OpenAI](https://platform.openai.com/) | `OPENAI_API_KEY` | `gpt-4o` |
| [Anthropic](https://www.anthropic.com/) | `ANTHROPIC_API_KEY` | `claude-sonnet-4-6` |
| [Google Gemini](https://ai.google.dev/) | `GEMINI_API_KEY` | `gemini-2.5-flash` |
| [Ollama](https://ollama.ai/) | `OLLAMA_BASE_URL` (no key) | `llama3.2` |
| [Groq](https://groq.com/) | `GROQ_API_KEY` | `llama-3.3-70b-versatile` |
| [OpenRouter](https://openrouter.ai/) | `OPENROUTER_API_KEY` | `openai/gpt-4o` |
| [Requesty](https://www.requesty.ai/) | `REQUESTY_API_KEY` | `openai/gpt-4o` |
| [Together](https://www.together.ai/) | `TOGETHER_API_KEY` | `meta-llama/Llama-3.3-70B-Instruct-Turbo` |
| [Mistral](https://mistral.ai/) | `MISTRAL_API_KEY` | `mistral-large-latest` |
| [xAI](https://x.ai/) | `XAI_API_KEY` | `grok-2` |
| [LiteLLM](https://www.litellm.ai/) | `apiKey` and `baseUrl` options (your proxy) | None; set `model` to one your proxy serves |
| [Claude Code CLI](https://docs.agentos.sh/features/cli-providers) | PATH detection | `claude-sonnet-4-6` via subscription |
| [Gemini CLI](https://docs.agentos.sh/features/cli-providers) | PATH detection | `gemini-3.5-flash` via subscription |

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
  runtime: 'gmi',            // cognitive memory runs on the GMI runtime
  provider: 'openai',
  model: 'gpt-4o',
  instructions: 'You are a helpful research assistant.',
  personality: {
    openness: 0.9,           // explores ideas broadly
    conscientiousness: 0.85, // thorough and organized
    agreeableness: 0.7,      // warm, validates before offering alternatives
  },
  memory: true,              // embeds with text-embedding-3-small through OPENAI_API_KEY
});

// Monday: Sarah introduces herself
const monday = assistant.session('monday', { userId: 'user-7f3a' });
await monday.send('My name is Sarah and I study marine biology.');

// Friday: a new session for the same user
const friday = assistant.session('friday', { userId: 'user-7f3a' });
const reply = await friday.send('What do I study, and what should I read next?');
console.log(reply.text); // this turn's prompt carries what Sarah said on Monday

await assistant.close();
```

Every session keeps its own message history, on either runtime. Monday's fact reaches Friday's session through cognitive memory. With `runtime: 'gmi'` and `memory` set, the agent builds one memory manager that all of its sessions share, files each message a user sends under their `userId`, and recalls it in any later session opened with the same id. Without `runtime: 'gmi'`, `agent()` keeps session history only and logs a warning that it does not apply `memory`. Memory embeds through OpenAI, Gemini or Ollama. Anthropic, Groq and xAI have no embedding models in AgentOS, so an agent on one of those needs one of the three keys as well, or `memory: { embedding: { provider, model } }` naming the one to use.

### How Personality Works

[HEXACO personality traits](https://docs.agentos.sh/features/cognitive-memory-guide), based on the [six-factor model from personality psychology](https://hexaco.org/hexaco-inventory) ([Ashton & Lee, 2007](https://doi.org/10.1177/1088868306294907)), shape how the agent communicates. Each trait above 0.65 or below 0.35 adds one directive to the system prompt, and a value in between adds none; on the GMI runtime the same traits also tune seven of the eight memory mechanisms. Recent research shows that [LLMs can reliably simulate HEXACO personality structures](https://arxiv.org/abs/2508.00742) with coherent factor recovery.

| Trait | High Value Effect | Low Value Effect |
|-------|------------------|-----------------|
| **Openness** | Explores tangential ideas, creative responses | Stays focused, conservative |
| **Conscientiousness** | Organized, thorough, detailed | Casual, brief |
| **Agreeableness** | Warm, accommodating | Direct, challenging |
| **Extraversion** | Enthusiastic, verbose | Reserved, concise |
| **Emotionality** | Empathetic, supportive | Analytical, detached |
| **Honesty-Humility** | Transparent, admits limitations | Confident, promotional |

### How Memory Works

[Cognitive memory](https://docs.agentos.sh/features/cognitive-memory) goes beyond chat history. [8 neuroscience-grounded mechanisms](https://docs.agentos.sh/api/classes/CognitiveMechanismsEngine) model how human memory actually works, on top of a decay model every trace follows:

- **[Ebbinghaus decay](https://en.wikipedia.org/wiki/Forgetting_curve)**: the decay model under all eight. Memories fade exponentially over time (R = e^(-t/S)), [replicated and validated by Murre & Dros (2015)](https://pmc.ncbi.nlm.nih.gov/articles/PMC4492928/). Emotionally intense events resist decay: above an intensity of 0.8 a memory encodes as a flashbulb memory, with five times the stability.
- **[Reconsolidation](https://doi.org/10.1038/35021052)**: retrieved memories drift toward the agent's current emotional context ([Nader et al., 2000](https://doi.org/10.1038/35021052)).
- **[Retrieval-induced forgetting](https://doi.org/10.1037/0278-7393.20.5.1063)**: retrieving one memory suppresses competing memories ([Anderson, Bjork & Bjork, 1994](https://doi.org/10.1037/0278-7393.20.5.1063)).
- **[Memory types](https://docs.agentos.sh/features/memory-system-overview)**: traces are episodic, semantic, procedural, prospective or relational, and a slot-based working memory holds the ones in focus.

This approach mirrors the [ACT-R cognitive architecture](https://arxiv.org/html/2512.20651) used by recent AI memory systems like [Memory Bear](https://arxiv.org/html/2512.20651) and [CortexGraph](https://github.com/prefrontal-systems/cortexgraph), which also integrate Ebbinghaus decay with activation scheduling.

## Step 4: Add Tools

```typescript
import { agent } from '@framers/agentos';
import { WebSearchService, TavilyProvider } from '@framers/agentos/cognition/web-search';

// Needs OPENAI_API_KEY and TAVILY_API_KEY in the environment.
const search = new WebSearchService();
search.registerProvider(new TavilyProvider(process.env.TAVILY_API_KEY!));

const researcher = agent({
  provider: 'openai',
  model: 'gpt-4o',
  instructions: 'You are a research assistant with access to web search.',
  tools: {
    web_search: {
      description: 'Search the web. Returns titles, URLs and snippets.',
      parameters: {
        type: 'object',
        properties: { query: { type: 'string' } },
        required: ['query'],
      },
      execute: async ({ query }) => search.search(query, { maxResults: 5 }),
    },
  },
});

const result = await researcher.generate(
  'What are the latest developments in room-temperature superconductors?'
);
console.log(result.text);
// The model calls web_search and answers from the results,
// within maxSteps (5 by default) model calls.
```

A tool is a name mapped to a description, a JSON Schema for its arguments and an `execute` function; `agent()` also takes an `ExternalToolRegistry` or prompt-only tool schemas. `WebSearchService` sends each query to every provider you register (Firecrawl, Tavily, Serper and Brave) in parallel and fuses their rankings. The [agentos-extensions](https://github.com/framerslab/agentos-extensions) registry holds 111 curated extension packs, among them news search, image search, browser automation and deep research. Their tools are `ITool` objects, and `agent()` accepts those in the same tool map.

## Step 5: Check Answers Against Sources

```typescript
import { agent, embedText } from '@framers/agentos';
// `search` is the WebSearchService from step 4.

const sources = async (query: string) =>
  (await search.search(query, { maxResults: 5 })).map((r) => ({
    content: r.content ?? r.snippet,
    title: r.title,
    url: r.url,
  }));

const checked = agent({
  provider: 'openai',
  model: 'gpt-4o',
  instructions: 'You are a research assistant. Answer in short, factual sentences.',
  verifyCitations: {
    retrieve: sources,
    embedFn: async (texts) =>
      (await embedText({ provider: 'openai', input: texts })).embeddings,
  },
});

const answer = await checked.generate('What did the latest IPCC synthesis report conclude?');
console.log(answer.text);
for (const claim of answer.grounding?.claims ?? []) {
  console.log(claim.verdict, claim.confidence.toFixed(2), claim.text);
}
```

With [`verifyCitations`](https://docs.agentos.sh/features/citation-verification), `generate()` sends the prompt to `retrieve` for sources, splits the answer into sentence-sized claims, and scores each claim by the cosine similarity of its embedding to the closest source: [`CitationVerifier`](https://docs.agentos.sh/api/classes/CitationVerifier) marks it `supported` at 0.6 or above, `unverifiable` below 0.3, and `weak` in between. Pass an `nliFn` as well and a supported claim that the NLI model reads as contradicted is marked `contradicted`. The check runs after the answer is written and never holds it back; when retrieval fails, `grounding` stays unset. It runs on `generate()`, and session sends skip it.

## Where Guardrails Run

`agent()` accepts `guardrails` and `security` options without applying them: it logs a warning that names them, and its [capability contract](https://github.com/framerslab/agentos/blob/master/src/api/runtime/capabilityContract.ts) lists both as accepted but deferred. The [6 guardrail packs](https://docs.agentos.sh/features/guardrails) run on the full AgentOS runtime (`AgentOS.create()`), which evaluates every guardrail registered with it against the user's input and the agent's output:

| Guardrail | Detection Method | What It Catches |
|-----------|-----------------|-----------------|
| **[PII Redaction](https://docs.agentos.sh/features/safety-primitives)** | Regex patterns, an NLP prefilter and a local NER model; an LLM judge is optional and off by default | Names, emails, SSNs, credit cards, addresses |
| **[ML Classifiers](https://docs.agentos.sh/features/guardrails-architecture)** | A local ONNX model (`Xenova/toxic-bert`), with an LLM judge and keyword patterns as fallbacks when it can't load | Toxicity, NSFW content, threats; prompt injection only on the fallbacks, since the ONNX model has no injection label |
| **[Topicality](https://docs.agentos.sh/features/guardrails)** | Embedding-based topic matching on user input, with LLM and keyword fallbacks | Off-topic messages, scope violations |
| **[Code Safety](https://docs.agentos.sh/features/guardrails)** | OWASP pattern scanning | Command injection, XSS, SQL injection in generated code |
| **[Grounding Guard](https://docs.agentos.sh/features/citation-verification)** | NLI-based claim verification | Hallucinated facts not supported by RAG sources |
| **[Content Policy](https://docs.agentos.sh/features/creating-guardrails)** | Keyword pre-filter on the stream, LLM judge on the final reply | Policy violations, blocked or rewritten |

`agency()` reports the guardrail ids it is given as not enforced, so on that path too the packs need the full runtime.

## Full Example: 67 Lines

```typescript
import { agent, embedText } from '@framers/agentos';
import { WebSearchService, TavilyProvider } from '@framers/agentos/cognition/web-search';

// Needs OPENAI_API_KEY and TAVILY_API_KEY in the environment.
const search = new WebSearchService();
search.registerProvider(new TavilyProvider(process.env.TAVILY_API_KEY!));

const sources = async (query: string) =>
  (await search.search(query, { maxResults: 5 })).map((r) => ({
    content: r.content ?? r.snippet,
    title: r.title,
    url: r.url,
  }));

const myAgent = agent({
  // LLM, on the GMI runtime so that memory applies
  runtime: 'gmi',
  provider: 'openai',
  model: 'gpt-4o',
  instructions: `You are a knowledgeable research assistant.
    You search the web for current information
    and cite your sources.`,

  // Personality (HEXACO six-factor model)
  personality: {
    openness: 0.9,
    conscientiousness: 0.85,
    agreeableness: 0.7,
    extraversion: 0.6,
    emotionality: 0.3,
    honestyHumility: 0.95,
  },

  // Cognitive memory shared by this agent's sessions
  memory: true,

  // Tools
  tools: {
    web_search: {
      description: 'Search the web. Returns titles, URLs and snippets.',
      parameters: {
        type: 'object',
        properties: { query: { type: 'string' } },
        required: ['query'],
      },
      execute: async ({ query }) => sources(query),
    },
  },

  // Claim-by-claim check on generate() answers
  verifyCitations: {
    retrieve: sources,
    embedFn: async (texts) =>
      (await embedText({ provider: 'openai', input: texts })).embeddings,
  },
});

// A session: history, memory and tools
const session = myAgent.session('briefing', { userId: 'user-7f3a' });
const reply = await session.send('What happened in tech this week?');
console.log(reply.text);

// generate(): one turn without memory, plus the citation check
const answer = await myAgent.generate('Which chips launched this week?');
console.log(answer.grounding?.supportedRatio);

await myAgent.close();
```

## What's Next

- **[Deploy to messaging channels](https://docs.agentos.sh/features/channels)**: [37 adapters](https://docs.agentos.sh/features/channels) including Telegram, WhatsApp, Discord, Slack
- **[Add voice](https://docs.agentos.sh/features/voice-pipeline)**: [11 STT providers](https://docs.agentos.sh/features/voice-pipeline), [10 TTS providers](https://docs.agentos.sh/features/voice-pipeline), VAD, and [telephony](https://docs.agentos.sh/features/telephony-providers) via Twilio, Telnyx, Plivo
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

Yes. AgentOS auto-detects whichever provider key you set. Set `ANTHROPIC_API_KEY` for Claude, `GEMINI_API_KEY` for Gemini, or run [Ollama](https://ollama.ai/) locally with no key at all (set `OLLAMA_BASE_URL`). The runtime resolves models the same way regardless of source. Cognitive memory is the one piece that needs an embedding model, from OpenAI, Gemini or Ollama.

### How does cognitive memory persist between sessions?

In process memory. With `runtime: 'gmi'` and `memory` set, the agent keeps one memory manager, over an in-memory vector store and knowledge graph, and every session it opens shares it. A session opened with the same `userId` recalls what that user said in earlier sessions; a session opened without one recalls only its own. The memory ends when the process exits or you call `agent.close()`. To keep memory across restarts, give the agent a `memoryProvider` backed by your own store in place of `memory`: `agent()` calls its `getContext()` before each model call and its `observe()` after each turn. See the [cognitive memory docs](https://docs.agentos.sh/features/cognitive-memory) for the full memory architecture.

### Is HEXACO required, or opt-in?

Opt-in. Omit the `personality` block entirely and the agent runs with no trait shaping. When provided, every trait defaults to 0.5 (neutral) so partial profiles work too.

### Can I run this fully local with Ollama?

Yes, with `OLLAMA_BASE_URL` set (`http://localhost:11434` for a default install). Set `provider: 'ollama'` and `model` to any tag you have pulled (the default is `llama3.2`), and skip the API key entirely. Personality and tools work against local models, tools on models that support tool calling. With `runtime: 'gmi'`, memory embeds with `nomic-embed-text`, so pull that too. Guardrails need the full runtime, local or not. Latency depends on your hardware.

### What's the difference between AgentOS and other TypeScript agent frameworks?

The runtime ships cognitive memory, HEXACO personality, emergent tool forging, and guardrails as first-class primitives, not bolt-ons. Most TypeScript agent frameworks expose graph orchestration over an LLM and stop there. AgentOS treats the agent as a stateful runtime with measured memory and personality behavior. The [framework comparison](/blog/agentos-vs-langgraph-vs-crewai) writes the same agent in AgentOS, LangGraph, CrewAI, Mastra and VoltAgent and says where each one is the better pick.

---

**AgentOS** is built by [Frame](https://frame.dev). See [Wilds.ai](https://wilds.ai) for AI game worlds powered by AgentOS.
