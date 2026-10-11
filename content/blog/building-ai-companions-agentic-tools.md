---
title: "Building AI Companions with Agentic Tools, Memory, and Personality in TypeScript"
date: "2026-04-14"
excerpt: "Build an AI companion in TypeScript on AgentOS: agent() with inline tools, HEXACO personality and cognitive memory, and the layer wilds.ai adds on top."
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

The mechanical implication is that everything that *might* persist needs to actually persist. Memory. Personality drift. Tool affordances. Provider preferences. In wilds.ai, a companion layer written on top of AgentOS's `agent()` keeps all of that, and this post shows where the line between the two runs. "Designed for continuity" is what separates a companion stack from a chat-completion API call. This post is the implementation walk.

This post walks through building an AI companion with persistent memory, agentic tools, and a quantified personality system, with the companions on [wilds.ai](https://wilds.ai) as the worked example. The AgentOS pieces (`agent()`, inline tools, HEXACO personality, cognitive memory, the policy router) are open source in [AgentOS](https://github.com/framerslab/agentos). The companion layer on top of them (`CompanionOrchestrator`, `CompanionMemoryBridge`, the recall pipeline and the companion's tools) is wilds.ai's own application code. Its `@wilds/*` packages are not published, so the samples taken from it show its shape and do not run outside wilds.ai.

If you haven't read the [case study](https://agentos.sh/blog/ai-companion-case-study-wilds) showing what this looks like from a user's perspective, start there. This post is the implementation guide.

## The architecture

An AgentOS companion is a `createAgent()` call with three layers:

1. **Personality and instructions** (system prompt): who the companion is, how they speak, what they know
2. **Tools** (function calls): what the companion can do during a conversation turn
3. **Memory** (retrieval callbacks): what the companion remembers across sessions, through `agent()`'s `memoryProvider` hooks or tools that query a memory store

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

`characterDirective`, `hexacoTraits`, `agenticTools`, `policyRouter` and `companionWriterSkill` are yours to build; the sections below show the tools, the personality and the router. The LLM sees one system prompt that `agent()` assembles from `instructions`, `name`, the personality and each skill's content, plus the tool schemas and the conversation history. It generates text and tool calls. AgentOS executes the tool calls, returns the results, and lets the LLM continue for up to `maxSteps` steps per turn (5 when unset).

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

This cannot come from a registry or plugin system. The `actorId` and `slug` closures are different for every request. Define tools inline where you have the runtime context. `searchMemoryTraces`, `searchGiphy` and `describeImage` stand in for your own lookups.

wilds.ai's companion builds all of its tools this way, in three factories that close over the request's state. Five recall tools are always on (`recall_messages`, `search_conversation`, `conversation_stats`, `recall_attachments`, `recall_memories`), and so is `export_conversation`. The other twelve register only when wilds.ai's chat route passes in the callback behind them: `send_selfie`, `send_gif`, `send_photo`, `web_search`, `generate_image`, `generate_video`, `analyze_image`, `deep_research`, `verify_claims`, `news_search`, `recall_other_companions` and `remember_moment`. The LLM decides which to call from the conversation, across up to `maxSteps` model steps per turn, each of which can call tools; wilds.ai's companion runs with `maxSteps: 12`.

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

In wilds.ai, the memory bridge's `assembleContext` gathers recall from six sources at once and ranks the results as one set:

1. **Semantic recall:** embedding similarity search over the companion's memory traces
2. **Recency:** the five most recent traces
3. **Shared memory:** facts, preferences and relationships from the account's shared memory layer
4. **Documents:** chunks of files the user uploaded
5. **Images:** multimodal recall over images the user attached
6. **Word match:** a full-text search over the traces, for exact words that embedding recall misses

When semantic recall returns fewer than two traces and the user has a recent game session, a GraphRAG query over that game's world adds world knowledge. Duplicates collapse across sources before the recall reaches the prompt.

wilds.ai wires its memory bridge into the companion through a tool. Condensed from its chat route and its `recall_memories` tool:

```typescript
import { CompanionMemoryBridge } from '@wilds/memory';

// memoryFacade: wilds.ai's facade over AgentOS's CognitiveMemoryManager,
// leased per account and companion
const memoryBridge = new CompanionMemoryBridge(memoryFacade, (event) => {
  memoryEvents.push(event); // memory_formed events for the client
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
        const ctx = await memoryBridge.assembleContext(query, 10);
        return { memories: ctx.systemPromptSection };
      },
    },
  },
});
```

The bridge has two jobs. Before generating each reply, wilds.ai's orchestrator calls `assembleContext` and puts the result in the system prompt; the `recall_memories` tool calls the same method when the companion decides to look something up. After each reply, `syncAfterTurn` writes one episodic trace for the exchange and passes both messages to the observer, whose reflector turns accumulated conversation into typed traces once enough of it builds up. Decay (the Ebbinghaus curve) and hourly consolidation run in AgentOS's `CognitiveMemoryManager` under the facade.

For a markdown-native take on the same substrate, [`souledAgent()`](https://docs.agentos.sh/getting-started/high-level-api) loads a `SOUL.md` workspace and wires its [`memory/` wiki](https://docs.agentos.sh/features/soul-files) as the companion's long-term memory: the agent reads `memory/index.md` from its prelude, opens pages with a `read_memory_page` tool, and folds new conversation back into entity and concept pages on consolidation. Same cognitive store underneath; the markdown is the source of truth you can read, edit, and commit.

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

`agent()` turns each trait above 0.65 or below 0.35 into one directive in the system prompt and adds nothing for a trait in between, so in the profile above honesty, extraversion and openness speak while the other three stay quiet. High openness tells the model to explore creative angles and draw unexpected connections. Low agreeableness tells it to question assumptions and push back when something seems wrong. High emotionality asks for emotional awareness and empathy. On the default runtime, `agent()` keeps no mood from one turn to the next.

wilds.ai goes further in its own layer. It keeps the companion's mood as a PAD-model state (the `moodPad` below), and it lets the personality drift: AgentOS's `analyzePersonaDrift` reads the companion's memory traces and relationship changes and proposes bounded trait changes, and wilds.ai applies them to its own copy of the traits. wilds.ai also writes its companions' system prompt itself, through `agent()`'s `systemBlocks` option, which replaces the prompt `agent()` would assemble; its trait phrases come from the live, drifted values.

### Policy routing

The `router` option takes a model router. AgentOS's `PolicyAwareRouter` routes on the conversation's content tier, one of four: safe, standard, mature, and private-adult (the agent's `policyTier`, or the router's default tier). Mature and private-adult conversations go to a per-tier override or a model from its uncensored catalog; safe and standard ones go to the base router you hand it, or stay on the agent's own model. It picks models and blocks nothing.

The boundary itself is wilds.ai's. Its content-policy guardrail checks the user's message against the tier before generation and the companion's reply after it (through `agent()`'s `onAfterGeneration` hook), and swaps a blocked reply for a fallback message. AgentOS's guardrail packs run on the full AgentOS runtime; `agent()` applies none. With `agent()`'s directives, the personality shapes how the companion words a refusal: a high-agreeableness companion is told to validate the other perspective and stay supportive, a low-agreeableness one to push back. The safety boundary is identical. The character voice is not.

### Graduated familiarity

Trust builds over time. wilds.ai builds graduated familiarity on top of the runtime: its relationship engine keeps a trust score from 0 to 100, and a stage needs both enough trust and enough memory traces, so a few intense messages can't make a companion "bonded" without the history, and a long history can't do it without the trust:

- **Stranger** (below the acquaintance gate): first meeting, warm but not presumptuous, no references to past events
- **Acquaintance** (trust 15+, 10+ memories): recognizes the user, remembers basic facts, friendly without assuming familiarity
- **Familiar** (trust 35+, 40+ memories): inside references and shared context, brings up past conversations when relevant
- **Close** (trust 60+, 100+ memories): knows the user's patterns, moods and preferences, brings up shared memories naturally
- **Bonded** (trust 80+, 200+ memories): shorthand-heavy, deeply personal

wilds.ai resolves the stage each time it builds the companion's agent for a message and adds that stage's preamble to the system prompt. As trust and memories accumulate, the companion moves up the stages and its behavior shifts with them.

## Putting it together

The companion creation in wilds.ai's chat route, condensed:

```typescript
const orchestrator = new CompanionOrchestrator(persona, snapshot.relationship, {
  moodPad: snapshot.moodPad,
  history,
  memoryBridge,
  userContext,
  onRecallMessages: buildDbRecallCallback(actorId, slug, branchId, personaId),
  onRecallAttachments: buildDbAttachmentRecallCallback(actorId, slug),
  onGenerateSelfie,
  onResolveMedia,
  onMediaResolved,
  onAnalyzeImage,
  onRememberMoment,
  totalMessageCount: snapshot.messageCount,
});

// Stream the reply via SSE
for await (const event of orchestrator.handleMessageStream({
  content: userMessage,
  multimodalContent,
})) {
  if (event.type === 'text') controller.enqueue(encode(event));
  if (event.type === 'done') finalReply = event.reply;
}
```

wilds.ai's `CompanionOrchestrator` wraps `createAgent()` with the companion pipeline: trust and mood updates (the PAD model), memory recall and encoding through the bridge, persona drift checks, and a prompt that has the model break a reply into up to five chat bubbles with `[msg_break]` markers. `handleMessageStream` yields `text` chunks and one `done` event with the complete reply. The route streams the text over SSE as it arrives; after `done` it sends the `memory_formed` events the bridge queued, splits the reply into its bubbles, and sends the media `onMediaResolved` collected, so the client can show the reply as it streams, memory formation toasts, and media as it resolves.

## Start building

```bash
npm install @framers/agentos
```

The [5-minute quickstart](https://agentos.sh/blog/build-typescript-ai-agent-5-minutes) gets you to a working agent. The [Skills vs Tools vs Extensions guide](https://docs.agentos.sh/architecture/skills-vs-tools-vs-extensions) explains when to use each capability system. The [cognitive memory docs](https://docs.agentos.sh/features/cognitive-memory) cover the full memory architecture.

Try a companion at [wilds.ai](https://wilds.ai), where companion chat runs on `agent()` and the companion layer described above.

AgentOS source: [github.com/framerslab/agentos](https://github.com/framerslab/agentos) (Apache 2.0). The companion layer described above is wilds.ai's and is not part of it.

---

**[AgentOS](https://agentos.sh)** is built by [Frame](https://frame.dev). See [wilds.ai](https://wilds.ai) for AI companions and game worlds powered by AgentOS.
