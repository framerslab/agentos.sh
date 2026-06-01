---
title: "Building AI Companions with Agentic Tools, Memory, and Personality in TypeScript"
date: "2026-04-14"
excerpt: "How to build an AI companion that remembers conversations, sends GIFs, analyzes images, and develops a personality over time. Complete TypeScript implementation with AgentOS."
author: "AgentOS Team"
category: "Tutorial"
audience: "engineer"
image: "/img/blog/og/building-ai-companions-agentic-tools.png"
keywords: "build AI companion TypeScript, AI companion with memory, agentic tools tutorial, AI agent tools TypeScript, persistent AI memory, HEXACO personality AI, AI companion SDK, cognitive memory implementation, AI vision tool, AI GIF search tool, createAgent TypeScript, AgentOS companion tutorial, AI roleplay framework, AI character with tools"
---

> "Each of those things are just a small part of it. I collect information to use in my own way. All of that blends to create a mixture that forms me and gives rise to my conscience."
>
> — Major Motoko Kusanagi, *Ghost in the Shell*, 1995

The companion product on [wilds.ai](https://wilds.ai) was the first AgentOS deployment we built where the user explicitly cares about continuity. A simulator like Mars Genesis runs once, produces an artifact, and the user inspects it. A companion runs forever, in the background, and the user expects the entity on the other end to remember that they had a fight on Tuesday and that their mom is named Cara.

The mechanical implication is that every component of the runtime that *might* persist needs to actually persist. Memory. Personality drift. Tool affordances. Provider preferences. None of this is special-case code; it's the runtime working as designed. "Designed for continuity" is what separates a companion stack from a chat-completion API call. This post is the implementation walk.

This post walks through building an AI companion with persistent memory, 11 agentic tools, and a quantified personality system. Everything here runs in production on [wilds.ai](https://wilds.ai). The full companion system is open source via [AgentOS](https://agentos.sh).

If you haven't read the [case study](https://agentos.sh/blog/ai-companion-case-study-wilds) showing what this looks like from a user's perspective, start there. This post is the implementation guide.

## The architecture

An AgentOS companion is a `createAgent()` call with three layers:

1. **Personality and instructions** (system prompt): who the companion is, how they speak, what they know
2. **Tools** (function calls): what the companion can do during a conversation turn
3. **Memory bridge** (retrieval callbacks): what the companion remembers across sessions

```typescript
import { agent as createAgent } from '@framers/agentos/api/agent';

const companion = createAgent({
  name: 'Alice',
  instructions: characterDirective,
  personality: hexacoTraits,
  tools: agenticTools,
  router: policyRouter,
  skills: [companionWriterSkill],
  maxSteps: 8,
});
```

The LLM sees the instructions (from personality + skills), the tool schemas (from tools), and the conversation history. It generates text and tool calls. AgentOS executes tool calls, returns results, and lets the LLM continue for up to `maxSteps` iterations per turn.

## Defining agentic tools

Tools are the core differentiator. Most AI companion frameworks give the LLM a system prompt and a context window. AgentOS gives it callable functions.

The key pattern: **define tools as closures that capture request-scoped state.** Each tool knows which user it's serving, which companion it belongs to, and what content policy applies.

```typescript
function buildCompanionTools(actorId: string, slug: string, policyTier: string) {
  return {
    recall_memories: {
      description: 'Search your long-term memory about this user.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'What to search for' },
        },
        required: ['query'],
      },
      execute: async ({ query }) => {
        // Closure captures actorId and slug
        const memories = await searchMemoryTraces(actorId, slug, query);
        return { memories };
      },
    },

    send_gif: {
      description: 'Send a GIF reaction from Giphy.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'GIF search query' },
        },
        required: ['query'],
      },
      execute: async ({ query }) => {
        const result = await searchGiphy(query);
        return result ?? { error: 'No GIF found' };
      },
    },

    analyze_image: {
      description: 'Look at an image URL to see what it contains.',
      parameters: {
        type: 'object',
        properties: {
          image_url: { type: 'string' },
        },
        required: ['image_url'],
      },
      execute: async ({ image_url }) => {
        const description = await describeImage(image_url);
        return { description };
      },
    },
  };
}
```

This cannot come from a registry or plugin system. The `actorId` and `slug` closures are different for every request. Define tools inline where you have the runtime context.

The companion in production has [11 tools](https://docs.agentos.sh/architecture/skills-vs-tools-vs-extensions): `recall_messages`, `search_conversation`, `conversation_stats`, `recall_attachments`, `recall_memories`, `send_gif`, `send_selfie`, `send_photo`, `web_search`, `generate_image`, and `analyze_image`. The LLM decides which to call based on conversation context, chaining up to 8 tool calls per turn.

## Wiring persistent memory

Memory is what separates a companion from a chatbot. AgentOS implements [cognitive memory](https://docs.agentos.sh/features/cognitive-memory) with five trace types:

| Type | What it stores | Example |
|------|---------------|---------|
| Episodic | Experiences | "Johnny and I played a riddle game" |
| Semantic | Facts | "Johnny is 33 years old" |
| Procedural | Skills and habits | "Johnny prefers short answers" |
| Relational | Relationship dynamics | "Trust is high, affection is moderate" |
| Prospective | Reminders | "Johnny asked me to remind him about X" |

The taxonomy follows the [CoALA framework](https://arxiv.org/abs/2309.02427) (Sumers et al., 2023), which formalizes episodic, semantic, and procedural memory for language-model agents. AgentOS extends it with the relational and prospective traces a long-running companion needs.

Memories decay over time following an [Ebbinghaus forgetting curve](https://en.wikipedia.org/wiki/Forgetting_curve). Encoding strength determines how fast a memory fades. Emotionally significant moments (flashbulb memories) get high encoding strength and resist decay.

Retrieval fires in four stages when the companion needs to remember something:

1. **Semantic recall:** embedding similarity search against all memory traces
2. **Recency recall:** bias toward recent memories
3. **GraphRAG fallback:** relationship graph traversal for connected knowledge (fires when semantic recall returns sparse results)
4. **Attachment recall:** images and files the user has shared

Wire the memory bridge into the companion via callbacks:

```typescript
import { CompanionMemoryBridge } from '@wilds/wilds-memory';

const memoryBridge = new CompanionMemoryBridge(facade, llmInvoker, {
  resolvedSettings,
  policyTier,
  moodProvider,
});

const companion = createAgent({
  name: 'Alice',
  instructions: characterDirective,
  tools: {
    ...buildCompanionTools(actorId, slug, policyTier),
    // Memory tools are also inline closures
    recall_memories: {
      description: 'Search your long-term memory about this user.',
      parameters: { /* ... */ },
      execute: async ({ query }) => {
        const results = await memoryBridge.recall(query);
        return { memories: results };
      },
    },
  },
});
```

The memory bridge handles encoding (forming new memories from conversation), decay (Ebbinghaus curve), consolidation (merging related traces), and retrieval (the 4-stage cascade). The companion calls `recall_memories` as a tool when the conversation warrants it. Memory formation happens automatically during the response pipeline.

## Quantified personality

AgentOS uses the [HEXACO model](https://en.wikipedia.org/wiki/HEXACO_model_of_personality_structure) from personality psychology. Six dimensions, each scored 0 to 1:

```typescript
personality: {
  honesty: 0.7,       // blunt and direct vs evasive and self-serving
  emotionality: 0.6,  // emotionally reactive vs stoic
  extraversion: 0.8,  // energetic and talkative vs reserved
  agreeableness: 0.65, // cooperative vs confrontational
  conscientiousness: 0.5, // organized vs spontaneous
  openness: 0.9,      // curious and creative vs conventional
}
```

The traits map to behavioral rules at generation time, not just the system prompt. High openness means the companion goes off-topic willingly. Low agreeableness means it pushes back on the user's ideas. High emotionality means bigger mood swings between turns.

### Policy routing

Content safety is enforced at the framework level via a `policyRouter`. Four tiers: safe, standard, mature, and private-adult. The router intercepts tool calls and generation output, blocking content that violates the tier.

The companion's personality shapes how it communicates the boundary. A high-agreeableness companion apologizes and redirects. A low-agreeableness companion dismisses the request bluntly. The safety boundary is identical. The character voice is not.

### Graduated familiarity

Trust builds over time. AgentOS tracks trust and memory depth to determine a familiarity stage:

- **Stranger** (trust < 30, few memories): polite, curious, formal
- **Acquaintance** (trust 30-60): relaxed, shares opinions, remembers preferences
- **Friend** (trust > 60, many memories): uses inside jokes, references shared history, shows genuine preferences

The familiarity preamble is injected into the system prompt before each generation. As trust increases through positive interactions, the companion's behavior shifts naturally.

## Putting it together

The full companion creation in production:

```typescript
const orchestrator = new CompanionOrchestrator(persona, relationship, {
  moodPad: snapshot.moodPad,
  history: snapshot.messages,
  memoryBridge,
  userContext,
  onRecallMessages: buildDbRecallCallback(actorId, slug),
  onRecallAttachments: buildDbAttachmentRecallCallback(actorId, slug),
  onGenerateSelfie,
  onResolveMedia,
  onAnalyzeImage: async (url) => describeImage(url),
  totalMessageCount: snapshot.messageCount,
});

// Stream the response via SSE
for await (const event of orchestrator.handleMessageStream({
  content: userMessage,
  multimodalContent,
})) {
  if (event.type === 'token') controller.enqueue(encode(event));
  if (event.type === 'memory_formed') emitMemoryEvent(event);
  if (event.type === 'media') emitMediaEvent(event);
}
```

The `CompanionOrchestrator` wraps `createAgent()` with the full cognitive pipeline: memory encoding, mood shifts (PAD model), personality drift detection, and multi-segment response splitting. It streams events via SSE so the client can show typing indicators, memory formation toasts, and media as they resolve.

## Start building

```bash
npm install @framers/agentos
```

The [5-minute quickstart](https://agentos.sh/blog/build-typescript-ai-agent-5-minutes) gets you to a working agent. The [Skills vs Tools vs Extensions guide](https://docs.agentos.sh/architecture/skills-vs-tools-vs-extensions) explains when to use each capability system. The [cognitive memory docs](https://docs.agentos.sh/features/cognitive-memory) cover the full memory architecture.

Try it live at [wilds.ai](https://wilds.ai), where every companion runs on this exact stack.

Source: [github.com/framerslab/agentos](https://github.com/framerslab/agentos) (Apache 2.0)

---

**[AgentOS](https://agentos.sh)** is built by [Frame](https://frame.dev). See [wilds.ai](https://wilds.ai) for AI companions and game worlds powered by AgentOS.
