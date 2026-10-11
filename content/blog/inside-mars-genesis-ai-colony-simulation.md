---
title: "Inside Mars Genesis: A HEXACO AI Agent Case Study in Emergent Simulation"
date: "2026-04-17"
excerpt: "Mars Genesis is a six-turn, hundred-colonist AI civilization simulation where two commanders with opposing HEXACO personality profiles run the same seed and produce different outcomes. This is the end-to-end case study: how the forge-and-reuse economy, HEXACO decision cues and personality drift combine so the Visionary's colony diverges from the Engineer's while both share identical starting conditions."
author: "AgentOS Team"
category: "Engineering"
audience: "evaluator"
image: "/img/blog/og/inside-mars-genesis-ai-colony-simulation.png"
keywords: "mars colony ai simulation, agent swarm simulation, multi-agent simulation, structured world model, hexaco ai agents, cognitive memory ai agents, emergent tool forging llm, call forged tool reuse, typescript ai agent framework, personality driven llm agents, llm as judge, runtime tool generation llm, agent based simulation, two leader one seed"
---

> "Mars is there, waiting to be reached."
>
> — Buzz Aldrin

Mars Genesis is a six-turn, hundred-colonist civilization simulation that runs on AgentOS and Paracosm. Two AI commanders with opposing HEXACO personality profiles share an identical seed, an identical agent roster, and identical starting resources, and produce measurably different colonies by turn six. This post is the end-to-end case study: turn-by-turn, what the Engineer commander did, what the Visionary commander did, why their colonies diverged, and how to read the run artifact. A shorter comparison against the other major open-source multi-agent simulation framework (MiroFish) is appended at the end.

A representative moment from a recent run: turn three, year 2051. Dietrich Voss's chief medical officer faces a solar-storm radiation event that her existing toolbox doesn't cover. She doesn't pick an option from a menu. She writes a tool. The function is reviewed by an LLM judge, approved, executed in a sandbox, and returns a projected exposure number. Her commander reads that number three seconds later. By turn four every other department in the session can call the same tool for tens of tokens of dispatch. The runtime didn't script the path; it made the tool discoverable and the agents found it.

This post is the case study companion to [the long-form Paracosm launch post](/blog/paracosm-launch). The launch post is the structured-world-model framing and engine reference; this is the autopsy.

<video autoplay loop muted playsinline controls preload="metadata" poster="/img/blog/paracosm/digital-twin-atlas-lab-poster.jpg" style="width:100%;border-radius:8px;margin:1.5rem 0;">
  <source src="/img/blog/paracosm/digital-twin-atlas-lab-hero.mp4" type="video/mp4">
</video>

The video above shows the same engine on a different world: a digital-twin run of Atlas Lab, a fictional AI lab, testing a 90-day release delay over two turns, captured from the dashboard.

## The moment a colonist writes a tool

Turn three. Year 2051. A solar storm rolls across the newly-settled Mars colony and the cumulative radiation dose for the outdoor crew crosses the threshold in the scenario's research packet. Dr. Priya Singh, the Chief Medical Officer in Dietrich Voss's colony, is the department agent assigned to analyze the event. She has HEXACO scores 0.88 Conscientiousness, 0.71 Emotionality, 0.42 Openness. Her department's agent session still holds its prompts and reports from the two turns before. Her agent carries two meta-tools: `forge_tool` to write a new tool, and `call_forged_tool` to run one the judge already approved.

Her first move is not to pick an option from a menu. She looks at the already-forged toolbox. A `landing_site_suitability_index` from turn one does not apply. She writes a new tool.

She emits a JSON object describing a radiation dose calculator: an input schema, a JavaScript function, three test cases, and an expected output shape. A static check rejects `eval`, `Function`, `require`, `import`, `process` and `child_process` before anything runs, along with `fetch`, `fs` and `crypto`, because paracosm grants a forged tool none of them. The test cases then run in a `node:vm` context inside the host process, with paracosm's 10-second wall clock (AgentOS defaults to 5) and a 128 MB budget that AgentOS measures and does not enforce. Node's own documentation says `node:vm` is not a security mechanism, and AgentOS marks this executor `isolates: false`. An [LLM-as-judge](https://arxiv.org/abs/2306.05685) reviews the code and the test runs for safety, correctness, determinism and boundedness. The verdict comes back approved, confidence 0.87. The calculator runs on the storm's numbers and returns a projected exposure. That number lands in the report her commander reads three seconds later. By turn four the same tool is callable by every other department in the session without a second judge review, because `call_forged_tool` dispatches to it directly.

This is the interior of [Mars Genesis](https://paracosm.agentos.sh), the reference scenario for [Paracosm](https://paracosm.agentos.sh), an AI agent swarm simulation engine built on [AgentOS](https://agentos.sh). The rest of this post is the case study. Two commanders with opposing HEXACO profiles run the same seed, and their colonies diverge in ways the deterministic kernel alone cannot explain.

## Two commanders, one seed

The scenario defaults to six turns, eight years apart, from 2035 to 2075, with a starting population of one hundred. The seed is 950. The two default leaders have opposing HEXACO profiles:

- **Aria Chen, the Visionary.** Openness 0.95, Conscientiousness 0.35, Extraversion 0.85, Agreeableness 0.55, Emotionality 0.30, Honesty-Humility 0.65. Leads from the front with public comms; favors novel approaches; accepts casualties for strategic gain.
- **Dietrich Voss, the Engineer.** Openness 0.25, Conscientiousness 0.97, Extraversion 0.30, Agreeableness 0.60, Emotionality 0.70, Honesty-Humility 0.90. Works through technical channels; demands evidence before committing; reports failures transparently.

The kernel is deterministic. Given identical seed, identical roster, identical starting resources, it produces identical numerical outcomes per decision. What diverges is every language model call in between. Nine stages per turn, four of them LLM-driven, five deterministic:

```
1. EVENT DIRECTOR      LLM   Observes state, generates events
2. KERNEL ADVANCE      det.  Aging, births, deaths, resource deltas
3. DEPARTMENT ANALYSIS LLM   Each dept may forge or reuse a tool
4. COMMANDER DECISION  LLM   Reads all reports, picks an option
5. OUTCOME             det.  Seeded RNG + option risk probability
6. EFFECTS             det.  Colony deltas via the EffectRegistry
7. PERSONALITY DRIFT   det.  HEXACO traits shift under three forces
8. AGENT REACTIONS     LLM   Every alive agent reacts in parallel
9. MEMORY              det.  Short-term consolidates, stances drift
```

Given the same inputs, stages 2, 5, 6, 7 and 9 produce the same numbers on the same seed. The LLM stages diverge because every prompt carries the leader's HEXACO profile and the accumulated state it has shaped. The asymmetry is the entire point. This post goes into how the three cognitive systems (personality, mood, memory) and two economic systems (forge, reuse) combine to make the Visionary's run read differently from the Engineer's even when their populations track nearly identically.

## Personality: six traits that do work

Every colonist in Paracosm carries a [HEXACO](https://hexaco.org/) profile: six trait values clamped to the range 0.05 to 0.95. The model is from [Ashton and Lee (2007)](https://psycnet.apa.org/record/2007-06785-003) and their [2014 review of the Honesty-Humility dimension](https://journals.sagepub.com/doi/abs/10.1177/1088868314523838). The six dimensions are Honesty-Humility, Emotionality, Extraversion, Agreeableness, Conscientiousness, and Openness.

The engine-side profile lives at `HexacoProfile` in [src/engine/core/state.ts](https://github.com/framerslab/paracosm/blob/master/src/engine/core/state.ts). The framework-side profile lives at `HexacoTraits` in [src/cognition/memory/core/config.ts](https://github.com/framerslab/agentos/blob/master/src/cognition/memory/core/config.ts). Inside the simulation the profile works through prompts and the kernel. It writes the decision-style cues below into the commander's and the department heads' prompts, each colonist's own scores go into every reaction prompt, and the kernel drifts the department heads' values each turn. When paracosm turns a colonist into a chat agent, it hands the profile to AgentOS's `agent()` as `personality`, which adds one behavior directive to the system prompt for each trait above 0.65 or below 0.35.

AgentOS can also let traits shape what an agent remembers, in an agent that runs as a GMI (`agent({ runtime: 'gmi' })` with `memory` on). Its cognitive memory takes the persona's traits, and [EncodingModel.ts](https://github.com/framerslab/agentos/blob/master/src/cognition/memory/core/encoding/EncodingModel.ts) maps each trait to an attention weight on one class of input feature:

```typescript
export function computeEncodingWeights(traits: HexacoTraits): EncodingWeights {
  const o = clamp01(traits.openness);
  const c = clamp01(traits.conscientiousness);
  const e = clamp01(traits.emotionality);
  const x = clamp01(traits.extraversion);
  const a = clamp01(traits.agreeableness);
  const h = clamp01(traits.honesty);

  return {
    noveltyAttention:     0.3 + o * 0.7,
    proceduralAttention:  0.3 + c * 0.7,
    emotionalSensitivity: 0.2 + e * 0.8,
    socialAttention:      0.2 + x * 0.8,
    cooperativeAttention: 0.2 + a * 0.8,
    ethicalAttention:     0.2 + h * 0.8,
  };
}
```

In a GMI with a high-Conscientiousness persona, procedural content encodes stronger, and a high-Openness persona amplifies novelty. Paracosm's colonists don't run this path. Their agents run on AgentOS's default runtime, and what they remember is paracosm's own memory, covered below.

The commander's HEXACO also writes a decision-style block into the bootstrap prompt. Six axes, both poles, each cue naming a concrete downstream behavior rather than the trait label. Aria reads `You favor novel, untested approaches over proven ones; the unknown is an opportunity, not a threat` and `You lead from the front: public announcements, rallying speeches, visible command presence`. Dietrich reads `You demand evidence and contingency plans before committing; you would rather be slow and right than fast and wrong` and `You report failures transparently, accept blame, and refuse to spin bad outcomes`. The dept prompt gets a matching six-axis cue that shapes the report itself: assertive tone versus measured tradeoffs-first, data-certainty presentation, cross-department framing. Two dept heads with different profiles on the same event get different instructions for how to write the report.

### Personality drifts, with known coefficients

HEXACO is not fixed for the run. Each turn, every promoted colonist's traits shift under three named forces. The function lives at [src/engine/core/progression.ts](https://github.com/framerslab/paracosm/blob/master/src/engine/core/progression.ts):

```typescript
for (const trait of HEXACO_TRAITS) {
  let pull = 0;
  // Leader pull: traits converge toward commander
  pull += (commanderHexaco[trait] - c.hexaco[trait]) * 0.02;
  // Role pull: department activates specific traits (Tett & Burnett 2003)
  if (activation[trait] !== undefined) {
    pull += (activation[trait]! - c.hexaco[trait]) * 0.01;
  }
  // Outcome pull: success or failure reinforces specific traits
  // (openness: +0.03 on a risky success, -0.04 on a risky failure, ...)
  if (turnOutcome) pull += outcomePullForTrait(trait, turnOutcome);
  // Rate cap, then scale by the years the turn covers
  const delta = Math.max(-0.05, Math.min(0.05, pull)) * timeDelta;
  c.hexaco[trait] = Math.max(0.05, Math.min(0.95, c.hexaco[trait] + delta));
}
```

The role-pull coefficients come from [trait activation theory](https://scholarworks.iu.edu/dspace/handle/2022/24014), the Tett and Burnett (2003) account of how certain situations activate certain traits and pull an occupant's observable personality toward the role's demand profile. Paracosm encodes role archetypes for medical, engineering, agriculture, psychology, and governance, each with a target trait vector, and moves a colonist's traits toward the archetype by a capped fraction per year. Leader pull draws on workplace research about personality similarity and team cohesion. The coefficients are small and cite their sources inline. Drift rolls no dice of its own. The same commander, department and turn outcome move the traits the same way on any run, so two runs on one seed drift apart only where their outcomes differ.

## Mood: a running affect state with concrete consequences

Personality says who the colonist is. Mood says how they feel right now. Every AgentOS GMI carries a [`GMIMood`](https://github.com/framerslab/agentos/blob/master/src/cognition/substrate/IGMI.ts) value, one of eight states: neutral, focused, empathetic, curious, assertive, analytical, frustrated, creative. Each mood maps to a [Pleasure-Arousal-Dominance](https://en.wikipedia.org/wiki/PAD_emotional_state_model) vector in [CognitiveMemoryBridge.ts](https://github.com/framerslab/agentos/blob/master/src/cognition/substrate/CognitiveMemoryBridge.ts):

```typescript
public getPadState(): PADState {
  switch (this.getMood()) {
    case GMIMood.FRUSTRATED: return { valence: -0.65, arousal: 0.6,  dominance: 0.2  };
    case GMIMood.CURIOUS:    return { valence: 0.35,  arousal: 0.45, dominance: 0.15 };
    case GMIMood.EMPATHETIC: return { valence: 0.55,  arousal: 0.15, dominance: 0.25 };
    // ...
  }
}
```

In a GMI, mood does three concrete things. It shapes encoding strength through the [Yerkes-Dodson](https://en.wikipedia.org/wiki/Yerkes%E2%80%93Dodson_law) arousal curve, which peaks at moderate arousal and degrades at both ends. It triggers flashbulb encoding when emotional intensity exceeds 0.8, a phenomenon first described by [Brown and Kulik (1977)](https://psycnet.apa.org/record/1977-27787-001) for events like the Kennedy assassination and replicated for other high-salience events since. Flashbulb memories land in the store at 2x base strength and 5x stability, so they survive decay cycles that ordinary memories do not. And mood biases retrieval through mood-congruent recall: a frustrated agent preferentially retrieves memories tagged with negative valence.

When a persona turns sentiment tracking on, the GMI's `SentimentTracker` ([cognition/substrate/SentimentTracker.ts](https://github.com/framerslab/agentos/blob/master/src/cognition/substrate/SentimentTracker.ts)) scores each user message with the GMI's utility AI: lexicon scoring in the statistical utility, an LLM call in the LLM utility, whatever the persona's `method` setting says. It keeps a sliding window of sentiment and emits events to the metaprompt system when it detects patterns like accumulating frustration or rising confusion. Those events run the persona's recovery metaprompts, which can change the GMI's mood, its read of the user's skill level and of the task's complexity, and the notes it keeps in working memory.

Paracosm doesn't run GMIs, and it keeps a simpler mood of its own that reaches the simulation through two channels. Each colonist's reaction comes back with a mood (positive, negative, neutral, anxious, defiant, hopeful or resigned) and an intensity, and both land in that colonist's memory. A summary of the turn's moods then goes into the next Event Director prompt, so a scared colony sees different events than a hopeful one. Aria's Extraversion of 0.85 puts the lead-from-the-front cue in her prompt. Dietrich's 0.30 sits on the cue threshold, so his prompt carries no extraversion cue at all, and his rationale reads measured. The Event Director on the next turn reads each colony's state and mood summary when it picks events, which is how one run on this seed produced a solar storm for Aria and a perchlorate contamination suspicion for Dietrich at turn two.

## Cognitive memory: the pipeline

Memory is where personality and mood become durable. In AgentOS that is the cognitive memory manager ([CognitiveMemoryManager.ts](https://github.com/framerslab/agentos/blob/master/src/cognition/memory/CognitiveMemoryManager.ts)), which ties together encoding, decay, working memory, the store and prompt assembly, plus observer, reflector, graph, prospective-memory and consolidation modules that switch on when configured. A GMI with memory on runs this pipeline:

```mermaid
flowchart TD
    A[Input: user msg / tool output / system event] --> B[Observer]
    B --> C[Encoder: HEXACO weights + Yerkes-Dodson arousal]
    C --> D{Intensity > 0.8?}
    D -->|yes| E[Flashbulb: strength 2.0x, stability 5.0x]
    D -->|no| F[Standard encoding]
    E --> G[Memory Store]
    F --> G
    G --> H[Graph: spreading activation]
    G --> I[Ebbinghaus decay]
    H --> J[Retrieval: query + mood]
    I --> J
    J --> K[Prompt Assembler, token budget]
    K --> L[LLM call]
    L --> M[Reflector: consolidate > 40k tokens]
    M --> G
```

Three pieces are worth pulling apart.

**Encoding is personality-modulated.** `computeEncodingStrength` in [EncodingModel.ts](https://github.com/framerslab/agentos/blob/master/src/cognition/memory/core/encoding/EncodingModel.ts) combines HEXACO-derived attention weights with a Yerkes-Dodson arousal multiplier, a mood-congruence boost, and flashbulb detection. Same input, different traits, different moods: different memory traces. That is the requirement for a memory system that claims to model humans instead of describing a featureless buffer.

**Retrieval is graph-aware.** The memory store sits behind either [Graphology](https://graphology.github.io/) or a custom KnowledgeGraph backend. On a query, the system runs classical similarity retrieval over the store and walks the graph for [spreading activation](https://psycnet.apa.org/record/1972-10293-001), the mechanism Collins and Quillian (1969) described and Anderson's [ACT-R](http://act-r.psy.cmu.edu/) architecture formalized. A recent memory tagged "storm" pulls in older memories tagged the same way even when embedding similarity alone would not surface them. [Hebbian co-activation](https://en.wikipedia.org/wiki/Hebbian_theory) strengthens edges between co-retrieved nodes, so graph traversal improves the longer a session runs.

**Forgetting is real.** Memories decay along an [Ebbinghaus](https://en.wikipedia.org/wiki/Forgetting_curve) curve. `DecayModel.ts` also has an interference function, and nothing calls it. Traces below a strength of 0.05 (the default threshold) are soft-deleted. Flashbulb memories get 5x stability, so they stay. That is the cognitive-science reason a GMI that lived through a solar storm would still recall it after an unremarkable briefing has faded.

Paracosm's colonists don't run this pipeline. During a run, each colonist's memory is paracosm's own ([src/runtime/agents/agent-memory.ts](https://github.com/framerslab/paracosm/blob/master/src/runtime/agents/agent-memory.ts)), and it is plain arithmetic. After every turn the colonist's reaction becomes a short-term entry whose valence comes from the reaction's mood and whose salience is its intensity. Past fifteen entries, the five that score highest on salience and recency stay, and the rest fold into one-line beliefs per crisis category, positive, negative or mixed by how those reactions leaned. A stance per category moves with each outcome, and two colonists who reacted intensely with the same mood grow closer. The next turn's reaction prompt includes the latest beliefs, memories and strong stances, beside the colonist's HEXACO scores.

When Paracosm turns a colonist into a chat agent in [src/runtime/agents/chat-agents.ts](https://github.com/framerslab/paracosm/blob/master/src/runtime/agents/chat-agents.ts), it builds an AgentOS `agent()` with the colonist's HEXACO as `personality` and a SQLite memory store seeded after the run ends: the turns' crises, department reports, decisions and outcomes and that colonist's own reactions, each at importance 0.8, plus one line per fellow colonist at 0.95 so a name in the question finds the right person. That agent runs AgentOS's default runtime, so the trait-weighted encoding and mood above play no part in what it remembers. A user asking "what happened during the storm" still gets a different reply from each colonist, because each one answers in their own personality and from their own recorded reactions.

## Emergent tool forging: the runtime loop

Dr. Singh's dose calculator is not a stored-procedure call. It is a tool that did not exist before turn three. The machinery is the `EmergentCapabilityEngine` in [EmergentCapabilityEngine.ts](https://github.com/framerslab/agentos/blob/master/src/cognition/emergent/EmergentCapabilityEngine.ts), fronted by the meta-tool `forge_tool` from [ForgeToolMetaTool.ts](https://github.com/framerslab/agentos/blob/master/src/cognition/emergent/ForgeToolMetaTool.ts).

```mermaid
sequenceDiagram
    participant A as Department Agent
    participant F as forge_tool (meta)
    participant E as EmergentCapabilityEngine
    participant S as SandboxedToolForge (node:vm)
    participant J as EmergentJudge (LLM)
    participant R as ToolRegistry
    participant O as ToolOrchestrator

    A->>F: forge(name, schema, code, tests)
    F->>E: forge(request, {agentId, sessionId})
    E->>S: validateCode + run tests
    S-->>E: test results
    E->>J: reviewCreation(candidate)
    J-->>E: {approved, confidence, reasoning}
    alt approved
        E->>R: register(tool, tier='session')
        E-->>O: onToolForged callback
        O-->>A: tool callable next turn via call_forged_tool
    else rejected
        E-->>A: failure + judge reasoning
    end
```

Two modes are supported. **Compose mode** chains existing tools by input-to-output mapping, so no new code runs. **Sandbox mode** runs agent-written JavaScript on AgentOS's default executor, a [`node:vm`](https://nodejs.org/api/vm.html) context inside the host process. Node's documentation says `node:vm` is not a security mechanism, AgentOS marks the executor `isolates: false`, and the context shares the host's heap, so memory is measured as a heap delta and never capped. AgentOS also has a QuickJS executor, behind two optional peer dependencies, that runs each call in its own WebAssembly memory capped at the call's budget; paracosm uses the default. AgentOS defaults to a 5-second wall clock (paracosm passes 10) and a 128 MB budget, and grants a forged tool nothing by default: `fetch` (optionally limited to listed domains), file reads (1 MB, inside configured roots), file writes and deletes, and `crypto` (hash and HMAC only) each need an explicit grant, and paracosm grants none. Static validation in `SandboxedToolForge.validateCode` rejects known-dangerous patterns (`eval`, `Function`, `require`, dynamic `import`, `process`, `child_process`, destructive `fs.*`) before a byte of code runs.

The forge pipeline is strict about one thing: every forged tool in paracosm has an input schema, an output schema, and at least two test cases. AgentOS's `forge_tool` declares its request shape on the meta-tool itself (see `inputSchema` in [ForgeToolMetaTool.ts](https://github.com/framerslab/agentos/blob/master/src/cognition/emergent/ForgeToolMetaTool.ts)), and the `wrapForgeTool` wrapper paracosm puts around it rejects a request whose schemas declare no properties or that carries fewer than two test cases, before the judge sees it. So the model has to describe the tool as well as write it. At the framework level, where AgentOS requests a structured payload from the model, [api/generateObject.ts](https://github.com/framerslab/agentos/blob/master/src/api/generateObject.ts) uses a [Zod](https://zod.dev/) schema; invalid JSON triggers a retry with the validation error appended to the conversation so the model can self-correct. The forge loop uses declared test cases as the correctness check rather than a pure schema match, because schema validity alone does not prove a calculator calculates.

On judge approval the tool registers at the `session` tier, under paracosm's 50-tool ceiling per run. The engine's optional `onToolForged` callback fires at the same moment, and paracosm uses it to put the new tool's executable into the shared map `call_forged_tool` reads. In Paracosm this happens inside the same turn, which is why Dr. Singh's calculator is callable by the Chief Engineer on the next department analysis. After five uses with a success rate of at least 0.8, the promotion panel runs. On panel approval, the tool moves to the `agent` tier, which outlives the session when the registry has a storage adapter. Paracosm gives it none, so a run's tools end with the run.

### The reuse economy: call_forged_tool

`forge_tool` is only half the loop. The other half is `call_forged_tool`, a meta-tool that lets a department in a later turn execute an already-approved forge on new inputs. No second judge review, no re-forging, no re-allocating sandbox time. A dose calculator approved on turn three returns a fresh number on turn four when the situation calls for it.

The machinery is small. The `onToolForged` callback pushes every approved tool's executable into a shared `Map<string, ITool>`. The `call_forged_tool` meta-tool closes over that map and dispatches by name. Every department sees an ALREADY-FORGED TOOLS block in its system context listing the current session inventory with last outputs, and the HEXACO-aware system prompt tells each profile when to reach for reuse versus when to forge fresh.

Personality drives the ratio, though not the way a surface reading of HEXACO would predict. A live six-turn run on the default seed produced three unique tools per side, same toolbox width. The asymmetry showed up in what happened AFTER a forge: Aria's Visionary profile accepted first-pass tools and invoked them ten times across the run via `call_forged_tool`. Dietrich's Engineer profile, with Conscientiousness 0.97, held tools to a higher evidence bar, and one of his three forges failed the judge outright. He reforged three times. He reused seven times. The Engineer demands perfection and rebuilds; the Visionary accepts good-enough and extracts more value from the tools he has.

Cost follows. A fresh forge costs a judge LLM call plus sandbox execution; a reuse via `call_forged_tool` costs essentially nothing. A rejected forge still costs the judge review, and the reforge that follows costs another. So the Engineer's perfectionism is visibly more expensive per run: more judge reviews, more sandbox executions, the same or fewer productive tool outputs downstream. The Visionary's looser standards produce comparable analytical coverage for less API spend. The dashboard's cost breakdown splits a run's spend by stage, with the judge as its own line, so the price of each extra forge shows up there.

### Do skills auto-pick up forged tools?

Within a process and session, yes, via the `onToolForged` callback plus `call_forged_tool`. The tool is immediately callable by every agent sharing that orchestrator for the rest of the run.

Across processes and sessions, no, not automatically. The bridge is one-way and explicit. The `SkillExporter` in [cognition/emergent/SkillExporter.ts](https://github.com/framerslab/agentos/blob/master/src/cognition/emergent/SkillExporter.ts) writes a promoted `EmergentTool` as a SKILL.md plus CAPABILITY.yaml directory, the format AgentOS's `SkillLoader` and capability manifest scanner read, so a later process can discover it beside hand-authored skills. The export describes the tool and leaves a sandboxed tool's source out, so the tool runs again only after it is re-forged or its source is supplied separately. To ship a tool as a maintained capability, write it as an extension package; the curated ones live in [agentos-extensions](https://github.com/framerslab/agentos-extensions). The trade-off is intentional: automatic within a session so agents solve novel problems live, reviewable across processes so the persistent capability surface stays a human decision. The judge's full prompt and two of its verdicts from a real run are in the launch post's [What the judge actually checks](/blog/paracosm-launch#what-the-judge-actually-checks).

## Cost safety: demo caps, BYO keys, abort gates

Paracosm ships as open source and is hosted at [paracosm.agentos.sh](https://paracosm.agentos.sh) for public access. A visitor who opens the site and clicks Run burns LLM credits. Keeping that footprint predictable takes three guards wired into the runtime.

**Demo caps, toggled by environment.** When `PARACOSM_HOSTED_DEMO=true` is set on the host, every request without a session API key runs against the host's credentials under a clamped configuration: 6 turns (configurable via `PARACOSM_DEMO_MAX_TURNS`), 30 colonists, 3 active departments, and paracosm's economy models (on OpenAI, `gpt-5.4-mini` for the departments and the judge and `gpt-5.4-nano` for the rest; on Anthropic, `claude-haiku-4-5` throughout). The dashboard's Settings panel reflects this: the Turns and Population inputs lock with a `demo:N` label and unlock the moment a user pastes their own OpenAI or Anthropic key into the API Keys field. Changing the turn cap takes an environment variable and a restart, with no code push, and the server applies the same caps to whatever a request sends.

**Per-IP rate limit, persistent.** One simulation per IP per day for demo-mode requests (the `RATE_LIMIT` default), tracked in a JSON file that survives pm2 restarts. The host's keys pay for at most one demo run per distinct IP a day. Users who want more runs paste their own key and bypass the limit entirely.

**Abort gates.** When all SSE clients stay disconnected through a 30-second grace period, the server fires an AbortController that the runtime checks at every major call site: the Event Director, each department's parallel fan-out, the commander decision, the reaction step, and the Turn 0 promotions. At most one in-flight LLM call completes after the abort fires; the rest of the turn short-circuits with a `sim_aborted` SSE event. The dashboard renders an "Unfinished" badge when the user returns, with partial results preserved. An abandoned demo run stops making new LLM calls 30 seconds after its last tab closes.

The full run breakdown is visible in the dashboard's cost modal, tagged by pipeline stage: director, commander, departments, judge, reactions. Every fresh forge adds a judge call to that breakdown and a reuse adds none, which is why the reuse economy matters to total cost.

## Case study: how turn two diverges

Turn one is deterministic in framing. Both Aria and Dietrich face the same Landfall milestone, the first permanent settlement decision. The Event Director returns a milestone payload; the kernel has not advanced. Both commanders pick Arcadia Planitia over the canyon rim, the safer plain over mineral-rich terrain.

Turn two is where the runs diverge. The Director this time is not anchored to a milestone. It reads the colony's post-Turn-1 state: the metrics, the turn-one event with each commander's decision on it, the mood summary from every colonist's reaction, the already-forged tools and their latest outputs, and knowledge topics from the seed's research packet. It returns different events per side.

Aria draws a solar storm. Her Chief Engineer and Chief Medical Officer both forge new tools on the spot: a shielding compliance scorer, a solar storm radiation risk index. High-Openness leaders lean exploratory, and her dept heads have been pulled toward that profile by leader-pull across the first turn.

Dietrich draws a different event profile: his high-Conscientiousness commander bias steers the Director toward events that reward procedure and expose improvisation gaps. His dept heads forge tools to the same specifications Aria's do, but the evidence bar on each is higher. At least one forge in a typical Engineer run fails the judge's correctness check, forcing a reforge. His reports read tighter and more cautious than Aria's, but his judge spend is higher because the perfectionism costs API calls.

By turn three the aggregate forged-toolbox inventory has diverged. By turn six the runs have different survivor counts and different HEXACO drift profiles for promoted colonists. Open a chat panel against any colonist after both runs complete. A colonist on Aria's side was seeded with the solar storm, her decisions about it and their own reactions to it; a colonist on Dietrich's side with the contamination scare and his. Same HEXACO profile at birth, different memories, because each chat agent's store holds the crises, reports, decisions and reactions of its own run.

The dashboard's colony visualization clusters survivors into family pods, floats featured colonists into a top row with their HEXACO badges, and lays out a ghost layer for the deceased so attrition reads as the visible field of pod outlines thinning over turns. Click any tile to open the drilldown: HEXACO radar with the colony mean overlaid, mood trajectory across turns annotated with crisis titles, family tree with clickable spouse and children thumbnails, reaction quotes per turn, chat handoff straight into the Chat tab pre-selected. Forge events tint by leader side, so at a glance which column invented a tool on which turn is obvious without reading any text.

## Deaths have causes

Mortality in Paracosm is not a single age-stepped roll. The kernel simulates six independent causes and attributes each death to the specific one that killed the colonist. Natural causes fire for colonists over 60 on an age-stepped probability. Radiation cancer fires for colonists over 30 with cumulative exposure above 1000 mSv and escalates above 2000 and 3500. Starvation fires colony-wide when food reserves drop below one month; everyone shares the risk. Despair fires for colonists with psychological scores below 0.2 and is weighted by Emotionality, high-Em colonists feel isolation harder. Fatal fractures fire for Mars-born crew over 40 with bone density below 60 percent. Accidents fire at a small baseline, department-weighted so engineering and medical take more hazardous positions than governance.

Every death carries the cause as a string in the event stream. The stats bar's DEATHS pill shows both leaders' counts, then each leader's top causes, leader A's before the slash: `(3 radiation · 2 accident · 1 despair / 5 age)`. The verdict LLM at the end of a run sees the per-leader breakdown and writes about the specific pattern, a Visionary whose crew died to accidents reads very differently from an Engineer whose crew died to despair. Partnerships form during progression between unpartnered adults whose affinity (HEXACO similarity, discounted for the age gap) clears 0.4, more often when morale is above 0.35; partnered couples have children at three times the base birth rate (capped at 0.6 a turn) and unpartnered pairs at three tenths of it; conditions clear at different rates depending on severity. The population dynamics are not props in the story. They are the story the HEXACO-driven decisions leave behind.

## Reproduce this yourself

Three steps, with an `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` in your environment.

```bash
npm install paracosm
```

```ts
import { WorldModel, marsScenario } from 'paracosm';
import { getSwarm, swarmFamilyTree } from 'paracosm/swarm';

const wm = WorldModel.fromScenario(marsScenario); // bundled preset

const dietrich = await wm.simulate({
  actor: {
    name: 'Dietrich Voss',
    archetype: 'The Engineer', // high Conscientiousness, low Openness
    unit: 'Colony Alpha',
    hexaco: { openness: 0.3, conscientiousness: 0.95, extraversion: 0.4, agreeableness: 0.6, emotionality: 0.5, honestyHumility: 0.8 },
    instructions: '',
  },
  maxTurns: 6,
  seed: 950,
});

const aria = await wm.simulate({
  actor: {
    name: 'Aria Chen',
    archetype: 'The Visionary', // high Openness, low Conscientiousness
    unit: 'Colony Alpha',
    hexaco: { openness: 0.95, conscientiousness: 0.35, extraversion: 0.85, agreeableness: 0.55, emotionality: 0.3, honestyHumility: 0.65 },
    instructions: '',
  },
  maxTurns: 6,
  seed: 950, // SAME seed
});

// Same starting roster (same seed) → divergence is leader-driven.
console.log('Dietrich final:', dietrich.finalState?.metrics, getSwarm(dietrich)?.population);
console.log('Aria final:', aria.finalState?.metrics, getSwarm(aria)?.population);
console.log('Aria family tree:', swarmFamilyTree(aria));
```

The artifact captures per-turn divergence: which decisions differed, which tools were forged in one run but not the other, which mortality causes hit. The dashboard renders a Compare-modal swarm-diff that highlights "alive in Dietrich's colony but not Aria's" and which colonists' moods diverged across the runs. Read the dashboard for the visual version. Read the artifact for the programmatic one.

## FAQ

**Is Mars Genesis the only scenario?** No. Mars Genesis is the *reference* scenario shipped with paracosm. The same kernel runs any scenario you can express in the five-bag JSON shape (`metrics`, `capacities`, `statuses`, `politics`, `environment`).

**Why HEXACO instead of Big Five?** HEXACO is the smallest set of dimensions that produces visibly distinct simulator behavior in our hands. Big Five works almost as well; the Lee & Ashton 2007 paper makes the case that Honesty-Humility deserves to be a separate axis, and the data backs that up. We added their sixth axis and the simulator got better.

**Are deaths actually deterministic?** The rolls are. Each death has a kernel-attributed cause (natural / radiation / accident / starvation / despair / fatal fracture) and the cause is recorded in the artifact. The same seed and the same colony state produce the same death sequence: every roll, every cause, every name. The LLM calls sit outside that seed, so two runs with the same leader can still part where a decision came out differently. That's what makes the compare modal useful: the kernel adds no noise of its own, so divergence between two leaders traces back to their decisions.

**If it's deterministic, isn't it just probability rolls dressed up?** Partially, and it's worth being honest about which is which. Three rolls are honest background noise: natural mortality past 60, the role-weighted accident rate (0.003 per year of the turn at base), and junior-to-senior promotion chances. Old people die independent of how the colony is doing. Engineers EVA more than governance staff regardless of commander. The workforce ages. The rest of the mortality table (starvation, despair, radiation cancer, fatal fracture) is gated on state that only exists because of cumulative LLM decisions. Starvation requires `foodMonthsReserve < 1.0`, which requires multiple resource-event failures or aggressive forge spending that drained power for hydroponics. Despair requires `psychScore < 0.2`, which comes from grief cascades after earlier named deaths, isolation, or a department report's `featuredAgentUpdates` lowering a featured colonist's psych score. The probability is state-driven; the roll picks the named individual. The launch post's [Deterministic doesn't mean scripted](/blog/paracosm-launch#deterministic-doesnt-mean-scripted) section unpacks this in full.

**Why doesn't the kernel pick the narratively-right victim?** Architectural choice. The kernel never asks an LLM a question, and the LLM lane reaches kernel state only through typed JSON contracts: decisions and their effects, and a department report's `featuredAgentUpdates`, which set a featured colonist's psych score and conditions mid-turn. No contract carries a death; deaths happen only in the kernel's between-turn progression. That separation is what lets `WorldModel.replay` re-run a run's kernel transitions and check them, and it's the same rule that prevents the kernel from singling out the engineer-who-chose-the-bypass for narrative cause-and-effect. Paracosm picks "100 cells get statistical agency conditioned on state" over "every cell gets individual narrative agency, with an LLM call of its own." Bottom-up sims ([MiroFish](https://github.com/666ghj/MiroFish) on [OASIS](https://github.com/camel-ai/oasis), [Stanford Generative Agents](https://arxiv.org/abs/2304.03442)) make the other choice. Both are valid; they answer different questions.

**Can I run more than two commanders?** Yes. `wm.batch({ actors: [...], turns: 6, seed: 950 })` runs N leaders against one world and returns a batch manifest. The dashboard renders an N-column timeline.

**How much does a run cost?** It depends on the provider, the models and how many tools get forged. The dashboard shows the spend per stage while a run goes, and the hosted demo runs on paracosm's economy models. Each fresh forge costs a proposal and a judge call; a reuse costs a tool call inside the department's own turn.

**What's "leader-pull" and how is it different from prompting?** Leader-pull is a kernel-encoded drift force that nudges department heads' HEXACO traits toward their commander's profile over turns. It's not a prompt, it's a numerical update applied at turn boundaries to the trait vectors the kernel uses for downstream decision biasing. Prompt-only personality dissolves under pressure; kernel-encoded personality survives across turns.

**Can I see the full artifact?** Yes. Every run writes a `RunArtifact` JSON object covering scenario, leader, seed, turns, decisions, forges, judge verdicts, mortality events, citations, and cost. The dashboard renders it; the schema is exported via Zod and re-exportable to JSON Schema for non-TypeScript consumers.

## Run your own

Paracosm ships as an npm package. The engine, compiler, dashboard, and the two built-in scenarios (Mars Genesis and Lunar Outpost) come with the install:

```bash
npm install paracosm
```

A scenario is a JSON file. You define departments (the specialist AI agents that will analyze each crisis), metrics (what gets tracked), labels (domain vocabulary), and setup defaults. The compiler turns that JSON into a runnable scenario by generating its hooks with LLM calls, and caches the result to disk, so a scenario compiles once.

```typescript
import { readFile } from 'node:fs/promises';
import { WorldModel, compileScenario } from 'paracosm';

const worldJson = JSON.parse(await readFile('./my-world.json', 'utf8')); // your scenario JSON
const scenario = await compileScenario(worldJson, {
  provider: 'anthropic',
  model: 'claude-sonnet-4-6',
});
const wm = WorldModel.fromScenario(scenario);

const visionary = {
  name: 'Captain Okafor',
  archetype: 'The Innovator',
  unit: 'Station Beta',
  hexaco: { openness: 0.9, conscientiousness: 0.4, extraversion: 0.8, agreeableness: 0.5, emotionality: 0.3, honestyHumility: 0.6 },
  instructions: 'You lead by experimentation. Push boundaries.',
};
const engineer = {
  name: 'Captain Reyes',
  archetype: 'The Pragmatist',
  unit: 'Station Alpha',
  hexaco: { openness: 0.4, conscientiousness: 0.9, extraversion: 0.3, agreeableness: 0.6, emotionality: 0.5, honestyHumility: 0.8 },
  instructions: 'You lead by protocol. Safety margins first.',
};

const results = await Promise.all(
  [visionary, engineer].map((actor) =>
    wm.simulate({ actor, maxTurns: 8, seed: 42 })
  )
);
```

Each `simulate()` call returns a `RunArtifact` (its Zod schema is exported from `paracosm/schema`) with cost, forged tools, citations, final state, and the per-turn decision log. The dashboard renders two artifacts side-by-side. `simulate()` takes one actor per call, so the same `Promise.all` sweeps ten or twenty leaders if you want.

For the no-code path, [paracosm.agentos.sh/sim](https://paracosm.agentos.sh/sim) runs the same engine from the browser with a one-click Mars Genesis demo, under the demo caps above unless you paste your own key.

## Comparison: Mars Genesis vs MiroFish

Two open-source multi-agent simulation frameworks shipped in early 2026. Both descend from the [Generative Agents](https://arxiv.org/abs/2304.03442) lineage (Park et al., Stanford 2023). They answer different questions.

[**MiroFish**](https://github.com/666ghj/MiroFish) is a prediction engine. The user uploads a real-world seed (a news article, a policy draft, a financial signal). MiroFish extracts entities into a [Zep Cloud](https://www.getzep.com/) knowledge graph, generates MBTI-style agent profiles from each entity, and runs a Twitter / Reddit social-media simulation on [OASIS](https://github.com/camel-ai/oasis) with up to a million agents. A ReportAgent with retrieval tools synthesizes the post-simulation graph into a structured prediction report. The graph owns truth; agents update it; the report queries it. The emergence is *social*: information cascades, opinion polarization, herd behavior.

**Mars Genesis** is a counterfactual-history engine. The user configures two commanders with continuous HEXACO trait vectors (not categorical MBTI types) and runs both through the same six-turn deterministic kernel from an identical seed. A deterministic kernel (a [Mulberry32 PRNG](https://github.com/framerslab/paracosm/blob/master/src/engine/core/rng.ts)) owns canonical state (population, deaths, resource production, career progression). AI agents own interpretation (crisis generation, department analyses, tool forging, commander decisions). The kernel applies decisions as bounded numerical effects. The emergence is *capability-driven*: forged tools persist within a session, personality drift compounds across turns, and the colony at turn six reflects what the leader decided rather than what was on the menu when the run started.

| Dimension | MiroFish | Mars Genesis |
|---|---|---|
| Owns truth | Knowledge graph | Deterministic kernel |
| Personality model | MBTI (categorical, static) | HEXACO (continuous, drift each turn) |
| Agent scale | Thousands to millions | ~107 per turn (commander + 5 departments + director + ~100 colonists) |
| Determinism | Stochastic | Seeded kernel + stochastic agents |
| Output | Prediction reports | Side-by-side civilization comparison |
| Stack | Python + Vue + Flask + Docker, file-system IPC | TypeScript single-process, in-process SSE streaming |
| Emergence mechanism | Social dynamics on a platform replica | Tool forging + personality drift + crisis generation |

What builders take from each: MiroFish's GraphRAG-as-ground-truth design is strong for prediction use cases where the seed is a real-world document. Mars Genesis's separation of deterministic kernel from AI interpretation makes the divergence claim testable, because the same seed under different leaders is the entire experiment. Both are open source. Both are past chatbot demos.

## What to read next

- [Paracosm launch post](/blog/paracosm-launch). The long-form essay on counterfactual world simulation as a category, plus the engine reference.
- [Announcing AgentOS](/blog/announcing-agentos). The runtime underneath.

Paracosm and AgentOS are open source. The Mars Genesis scenario ships as a default and runs on `npm install paracosm`, or hosted at [paracosm.agentos.sh](https://paracosm.agentos.sh) with a one-click demo. The engine doesn't care who leads the colony or which traits they carry. It cares how they decide, what they remember, what tools they forge, and how aggressively they reuse. Two leaders under the same seed produce different histories because those four questions resolve differently for each of them.
