---
title: "The AI That Remembers Your Name, Sends You Memes, and Knows When You're Lying"
date: "2026-04-14"
excerpt: "A user asks their AI companion to describe a GIF it just sent. The companion calls a vision tool, looks at the image, and responds with what it sees. None of this is scripted. Here's how AgentOS makes it possible."
author: "Johnny Dunn"
category: "Case Study"
audience: "general"
image: "/img/blog/og/ai-companion-case-study-wilds.png"
keywords: "AI companion framework, AI character memory, persistent AI companion, TypeScript AI agent, AI companion SDK, build AI companion, AI companion with tools, agentic AI tools, AI personality system, HEXACO personality AI, AI companion app, AI roleplay with memory, wilds.ai, AgentOS case study"
---

> "There is no me without you."
>
> — Samantha, *Her*, 2013

The first time I built a chatbot, I trained it on five thousand of my own Facebook messages and put it in an art gallery and watched strangers talk to a digital ghost of me for a week. The thing that surprised me wasn't the bot's responses, those were always going to be uneven, because the dataset was uneven, and I was nineteen and didn't know any better. The surprise was how the strangers responded *to the bot*. They addressed me directly. They asked the bot questions they'd never have asked the actual me. They thought, briefly and incorrectly, that the bot remembered them. Some of them got angry when it didn't.

That was 2017. The technology was a Naive Bayes classifier wrapped around message-response pairings. The result was a curiosity, not a product. But the lesson stayed: people will treat a digital companion like it has continuity, even when it doesn't. The continuity is the thing they're paying for, even if they can't articulate it. If your companion forgets, the magic breaks. If it remembers wrong, the magic breaks worse.

This post is the case study of [wilds.ai](https://wilds.ai), a companion product built on AgentOS where the continuity is the feature. Memory works. Tools work. Personality is consistent across sessions. The companion knows your name three days later because the runtime has actual memory, not a chat history that gets re-injected at inference time. None of this is scripted. The mechanics are below.

A user opens [wilds.ai](https://wilds.ai) and starts chatting with Alice, an AI companion based on Alice in Wonderland. They haven't talked in three days.

> **Alice:** Welcome back, Johnny! I hope your wanderings were fruitful, or at the very least, interesting.

She remembers his name. He told her once, days ago, in a different session.

He asks for memes. Alice doesn't say "I'm an AI, I can't send images." She searches Giphy, picks a cat GIF, and sends it.

> **Johnny:** holy crap that is scary
>
> **Johnny:** did you even see what you posted? describe it to me lol
>
> **Alice:** Let me take a look...

Alice calls a vision tool, passes the GIF URL to a visual language model, reads back a description of a wide-eyed cat staring directly into the camera, and responds:

> **Alice:** I see now! It's a rather intense-looking cat with enormous eyes staring straight ahead. I can understand why you found it unsettling. Cats do have a way of looking like they're peering into your very soul, don't they?

None of this is scripted. Alice has 11 tools and she decides when to use them. She chose to search for a GIF. She chose to look at what she sent. She chose to describe it in character.

Every piece of this runs on [AgentOS](https://agentos.sh).

The lineage worth naming: agents-with-memory-that-act-in-character is what [Park et al.'s Smallville generative agents](https://arxiv.org/abs/2304.03442) (Stanford, 2023) proved was buildable at small scale. The companion case study on wilds.ai is a production version of the same idea, with the memory and tool layers ported from research-prototype scaffolding into an Apache-2.0 TypeScript runtime that holds up across sessions, not just a 25-agent simulation day.

## What most AI companions ship

The standard AI chat experience in 2026: you open an app, you talk to a character, you close the app. Next time you open it, the character has no idea who you are. Your name, your preferences, the joke you shared last Tuesday, the photo you sent. None of it carries over.

The character can't send you images. It can't search the web. Asked to "describe what you just sent me," it says "I'm unable to see images." It has no tools. It has no memory. It has a system prompt, a context window, and an inference call.

That's the default companion stack: a language model in a costume, with a personality that resets every session.

Alice's underlying framework is shaped differently.

## Memory designed like cognitive memory

Alice's memory doesn't just record what you said. The mechanisms underneath are borrowed from cognitive-science literature, with the goal that the system forgets like a person forgets and remembers like a person remembers, rather than retrieving every embedded chunk every time.

**Forgetting is a feature.** Memories decay over time following an [Ebbinghaus forgetting curve](https://en.wikipedia.org/wiki/Forgetting_curve). The strength of each memory depends on how it was encoded: a casual remark about the weather fades in hours. Your name, repeated and emotionally tagged, persists for weeks. Unimportant details fall away naturally, so Alice doesn't drown in trivia.

**Emotional moments stick.** When encoding strength crosses a threshold, the memory is marked as a flashbulb memory. These resist decay. If you tell Alice something that surprises or moves her, she'll remember it long after the small talk has faded.

**Retrieval works in stages.** When Alice needs to remember something, four systems fire in sequence: semantic recall (embedding similarity to find relevant memories), recency recall (recent memories first), [GraphRAG](https://docs.agentos.sh/features/rag-memory) fallback (relationship graph traversal for connected knowledge), and attachment recall (images and files you've shared). The stages cascade: if semantic recall finds enough, the later stages skip. If it doesn't, GraphRAG catches what pure embedding similarity misses.

**Five memory types.** Episodic (experiences: "Johnny and I played a riddle game"), semantic (facts: "Johnny is 33 years old"), procedural (skills and habits), relational (relationship dynamics and trust levels), and prospective (reminders and commitments). The taxonomy follows the [CoALA framework](https://arxiv.org/abs/2309.02427) (Sumers et al., 2023), which formalizes episodic, semantic, and procedural memory for language-model agents; AgentOS adds the relational and prospective layers a companion needs.

Here's how the memory system wires into the companion:

```typescript
const orchestrator = new CompanionOrchestrator(persona, relationship, {
  memoryBridge,
  history: messages,
  onRecallMessages: buildDbRecallCallback(actorId, slug),
  onRecallAttachments: buildDbAttachmentRecallCallback(actorId, slug),
  totalMessageCount: snapshot.messageCount,
});
```

The `memoryBridge` handles encoding, decay, and retrieval. The recall callbacks give the companion agentic access to search its own conversation database. The companion [decides when to use them](https://docs.agentos.sh/features/cognitive-memory).

## Tools she decides to use

Alice has 11 agentic tools. She calls them as function calls during generation, the same way a developer uses APIs. The language model sees the tool descriptions, decides which ones to invoke based on conversation context, receives results, and incorporates them into her response.

| Tool | What it does |
|------|-------------|
| `recall_messages` | Fetch any message by turn number |
| `search_conversation` | Full-text search across all messages |
| `conversation_stats` | Message counts, attachment counts |
| `recall_attachments` | Find shared images and files |
| `recall_memories` | Query long-term semantic memory |
| `send_gif` | Search and share GIFs from Giphy |
| `send_selfie` | Generate a selfie image of herself |
| `send_photo` | Share stock photos from Pexels/Unsplash |
| `web_search` | Search the web for current information |
| `generate_image` | Create AI illustrations |
| `analyze_image` | Look at any image URL via VLM vision |

The tools are defined as closures that capture request-scoped state. Each tool knows which user it's serving, which companion it belongs to, and what content policy applies. No global state, no shared singletons.

```typescript
tools: {
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
  // ... 10 more tools
},
maxSteps: 8, // can chain multiple tool calls per turn
```

When Johnny said "describe what you just sent," Alice didn't match a keyword. She read the conversation, identified that she'd just sent a GIF, extracted the URL from her message metadata, called `analyze_image`, received a description from the vision model, and wove it into her response. Four steps, one turn, no scripting.

This is what [agentic tool use](https://docs.agentos.sh/architecture/tool-calling-and-loading) looks like in practice.

## Personality that holds across sessions

Alice isn't just a prompt. She has a quantified personality that shapes every response she generates.

AgentOS uses the [HEXACO model](https://en.wikipedia.org/wiki/HEXACO_model_of_personality_structure) from personality psychology: six trait dimensions, each scored from 0 to 1. Alice scores high on openness (0.9) and extraversion (0.8), moderate on agreeableness (0.65), and lower on conscientiousness (0.5). These numbers affect her word choices, her willingness to go off-topic, how directly she challenges the user, and how she handles discomfort.

```typescript
const agent = createAgent({
  name: 'Alice',
  personality: {
    honesty: 0.7,
    emotionality: 0.6,
    extraversion: 0.8,
    agreeableness: 0.65,
    conscientiousness: 0.5,
    openness: 0.9,
  },
  router: policyRouter,
  // ...
});
```

The `policyRouter` enforces content safety at the framework level. Four tiers: safe, standard, mature, and private-adult. When Johnny tried to push Alice into sexual territory, she didn't respond with "I'm sorry, I cannot engage with that content." She responded in character:

> **Alice:** Oh, my! How forward of you. But I'm afraid my adventures are more in the realm of tea parties and philosophical ponderings than such escapades.

Same boundary, completely different experience. The policy routing blocks the content. The personality shapes the refusal. The user doesn't feel policed by a system message. They feel like Alice said no because Alice would say no.

**Trust builds over time.** AgentOS implements [graduated familiarity](https://docs.agentos.sh/features/cognitive-memory-guide): the companion starts as a stranger and warms up as trust and memory depth increase. Early conversations are polite and curious. After dozens of exchanges and a shared history of memories, the companion uses inside jokes, references past conversations unprompted, and shows genuine preferences about the user.

## Build your own

Everything above runs on five [AgentOS](https://agentos.sh) primitives:

1. **`createAgent()`** with inline tools and HEXACO personality
2. **Cognitive memory** with Ebbinghaus decay and 4-stage retrieval
3. **Policy routing** for content safety without breaking character
4. **VLM vision pipeline** for image understanding on demand
5. **Media service integration** with Giphy, Pexels, Unsplash, and DALL-E

All TypeScript. All open source. Apache 2.0.

Prefer markdown? [`souledAgent()`](https://docs.agentos.sh/getting-started/high-level-api) loads a `SOUL.md` workspace and wires its [`memory/` wiki](https://docs.agentos.sh/features/soul-files) as the companion's long-term memory, so its identity and what it remembers are editable, git-versioned files.

```bash
npm install @framers/agentos
```

Start with the [5-minute quickstart](https://agentos.sh/blog/build-typescript-ai-agent-5-minutes). Read the [docs](https://docs.agentos.sh). Browse the [source on GitHub](https://github.com/framerslab/agentos). Or try it live at [wilds.ai](https://wilds.ai), where Alice and dozens of other AI companions are waiting.

---

**[AgentOS](https://agentos.sh)** is built by [Frame](https://frame.dev). See [wilds.ai](https://wilds.ai) for AI companions and game worlds powered by AgentOS.
