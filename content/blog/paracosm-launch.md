---
title: "Paracosm: A structured world-model engine for LLM agent swarms"
date: "2026-05-05"
featured: true
excerpt: "Paracosm is an open-source TypeScript engine that compiles a natural-language scenario into a typed deterministic world and runs HEXACO-typed AI agents through it. Same world, same kernel, same seed, divergent events and futures. This is what it does, how it works, and how I was inspired by interactive fiction, immersive sims, and game design mechanics to build it."
author: "Johnny Dunn"
category: "Engineering"
audience: "general"
image: "/img/blog/paracosm/sim-poster.jpg"
imageCaption: "Same Mars Genesis scenario, same seed, two divergent commanders. Aria Chen (The Visionary, left) and Dietrich Voss (The Engineer, right) face the same Landfall event with different HEXACO traits. Forged tools, judge verdicts, and side-by-side decisions all in one frame — captured live from paracosm.agentos.sh/sim, not generated."
heroBrand: "Paracosm"
keywords: "paracosm, agent swarm simulation, structured world model, LLM world model, HEXACO simulation, deterministic kernel, runtime tool forging, digital twin, counterfactual simulation, game ai, MiroFish, Sora, Genie, JEPA, AMI Labs, Sapir-Whorf, agentos, TypeScript ai agents, hacker news paracosm, npm install paracosm"
---

> "He thus creates, in this way, various futures, various times, which themselves also proliferate and fork."
>
> — Jorge Luis Borges, *The Garden of Forking Paths*, 1941

Inside [wilds.ai](https://wilds.ai), an AI roleplaying and gaming platform I lead development on, I was less than 15 minutes in doing the best thing to do as a game developer when a system feels too well-behaved: Try to break it. 

There's a game that was generated from a seed prompt I wrote, with NPCs, objectives, environments, and lore all set by a LLM (Opus), which allows each run to start from a static deterministic setting. In *Dead Air*, you're a radio host navigating a post-apocalyptic world, attempting to find the surviving fringes of society to share their stories on-air, aiming to keep some semblance of art left while everything else decays. It's meant to be an interactive journaling game (in the vein of [Thousand Year Old Vampire](https://thousandyearoldvampire.com/)) mixed with a narrative-based, roleplaying game with combat, survival mechanics, and the ability to shape the storyline in anyway you can imagine, while a LLM judge as a game director controls what's feasible and transpires the same way die affects DnD-style games.

I spawned in a vast desert, with just two known NPCs in the current region (though there is more that potentially could be discovered I don't know about yet), and as far as I could see for many miles, there was simply nothingness intercut with the characters of a hardended combat vet and the older woman accompanying him in his travels as nearby waypoints to start interacting with in the beginning of the story.

I picked a fight, a deadly one. I wrote in the game that I was going to attack. The game director, the AI, warned me that this could affect the objectives and outcomes of the game; I could potentially break things like in a [Fallout](https://fallout.bethesda.net/) game or [Morrowind](https://elderscrolls.bethesda.net/en/morrowind), where you could kill a NPC and get locked out of a mission. I continued.

The war vet fought back, and being more experienced, injured but chose not to maim me or take me out for good. He gave a verbal warning not to try again. I roleplayed a bit, explaining to the fellow wanderers that my party had been attacked, hence why I was so combative and immediately on-edge. They were sympathetic, asked for more details, and decided to take me to a camp they had set up, for food, shelter, and probably some quest-giving.

Once inside a cavern, I wrote that I wanted to betray them then and there, attacking once again while their guards were down. The LLM judge / game director evaluated, and decided I had the edge catching the vet by surprise, who had no chance to fight back, *but*, had enough skill and the luck to push himself and his companion inside a room that was a vault I did not see, sealing themselves in, away from me and away from the outside world.

Dead silence rang after, in which I could not break in, or hear anything inside, or make any of my words known to them despite efforts, as the game director decided that every move I made lacked efficacy. Continuing the bastard playthrough, I made threats, left boobytraps all around the vault, and waited and waited for someone to come out, whilst my hunger and thirst stats gradually ticked away, and nothing happened. For all I know, the people inside were also starving and gradually perishing as well, with nothing but emptiness inside the room (or maybe there were other rooms interconnected there?), and I had sent all of us to a fate of doom and lonliness. 

When I exited the cavern, there was nobody else, nothing in sight, and I had no resources, food, water, or transportation, meaning that in all likeliness of a continued playthrough (unless I forcibly tried to get the game director to spawn a deus ex machina for me), my path then would result in nothing but death and nothingness. I had locked myself out of anything more interesting having taken the easiest path of violence and violation, and each occurence of gameplay had made perfect sense for the characters, mechanics, and resources the characters were working with.

The NPCs were probably running down a clock inside the vault, having to decide in a split-second that locked-in starvation on a slow timeline was a better fate than dying from my sword then and there. I was probably running down a faster clock outside, having decided nothing because I had nothing to decide with. The two outcomes were correlated and unobservable. And I would never know what would happen to the characters inside that vault, whether they found an escape or had a secret way of re-opening it.

That was a moment that was not a NPC or game refusing to do combat with my character. It was a LLM evaluates a multi-step strategic move, executing it, and producing an emergent failure mode nobody saw coming, since I opted to go for a dark and fate-sealing path too soon, before gaining any knowledge of the world or gathering any proper resources to gainfully continue a difficult journey.

Emergent behavior in AI has been a desirable and incredibly ambiguous achievement to solve, up until the point of language models becoming coherent and good enough to make some sensible, new output. Yes, all training data in a LLM has to come from somewhere, whether it's another generative model or taken from humanity, but what they produce is just as novel as a person thinking of a new idea or new sentence that's never been uttered before. At our most stripped down functionality, we are all simply monkeys chittering away at metaphorical typewriters to produce our thoughts and actions; every utterance that will ever be said and every action done is already stored in an infinite palace like the Library of Babel. And in fact, every single language model in existence is functionally another iteration of the Library of Babel.

[Paracosm](https://github.com/framersai/paracosm) is the legibility layer of a LLM. It is an open-source TypeScript engine that takes a natural-language scenario and compiles it into a typed, deterministic, forkable world model, then runs multiple AI actors, with their own traits, like HEXACO personalities and / or specialized goals and objectives, and gives full reproducible artifact of every decision, every event, every forged reusable tool, and every divergence. Same world, same kernel, same seed, divergent events and futures.

Live at [paracosm.agentos.sh](https://paracosm.agentos.sh) with a demo available to try at [paracosm.agentos.sh/sim](https://paracosm.agentos.sh/sim) and the package is `npm install paracosm`. Apache-2.0. Built on [AgentOS](https://github.com/framersai/agentos), an agent orchestration runtime for adaptive intelligence and emergent behavior through creating new validated functions needed by agents at runtime, which I also lead.

The rest of this post revolves around the next step in human-computer interaction being structured, replayable but dynamic simulations with language models, rather than a typical chatbot-like interaction, and what current "world models" mean and involve, why half of those conversations are talking past each other, and how Paracosm fits into the second half. There are arxiv links because I want you to follow them. There is a live demo at the bottom because I want you to use it. There is a fight that ended with both sides locked into different rooms of the same crisis.

## Two world models, one word

The phrase "world model" in 2026 means two completely different things that aim to achieve the same goals.

The first meaning is generative and visual. [Sora](https://openai.com/sora) generates video. Google DeepMind's [Genie 3](https://deepmind.google/discover/blog/genie-3/) renders interactive 3D environments at 24 fps that stay coherent for a few minutes. Fei-Fei Li's [World Labs Marble](https://techcrunch.com/2025/11/12/fei-fei-lis-world-labs-speeds-up-the-world-model-race-with-marble-its-first-commercial-product/) generates persistent 3D scenes you can edit. Yann LeCun's AMI Labs is building a [JEPA-based, non-LLM world model](https://www.technologyreview.com/2026/01/22/1131661/yann-lecuns-new-venture-ami-labs/) trained on sensor and video streams. These tools are evaluated on visual fidelity and physical plausibility. Pixels are the substrate. Filmmakers, 3D artists, and embodied-AI labs are the natural customers. Both this lane and the structured-world-model lane below have serious commercial traction; the categories solve different problems and the markets compound rather than substitute.

The second meaning is older, more academic, and its commercial moment is just starting. [Ha and Schmidhuber's 2018 paper](https://arxiv.org/abs/1803.10122), the earliest publication referencing the subject, called a world model an internal simulator an agent uses to imagine future states before acting. No pixels. The job is to enumerate actionable possibilities so a decision can be made. Eric Xing's [*Critiques of World Models*](https://arxiv.org/abs/2507.05169) reframes it the same way. The Tsinghua FIB Lab's [*Understanding World or Predicting Future?*](https://dl.acm.org/doi/full/10.1145/3746449) (ACM Computing Surveys, 2025) formalizes the split: *understanding-world* models simulate counterfactuals for planning, *predicting-future* models generate perceptual continuations. Different jobs, different customers, same name.

Paracosm is the second kind. The engine does not generate pixels. It generates a typed scenario contract, a deterministic kernel, research-grounded events that an LLM-as-judge coordinates, and the responses of AI agents with optional HEXACO personality vectors or specific directives that affect what those agents, referred to as `actors`, decide what to do, how to lead the subagents and swarms spawned. The output is JSON, not video. It is reproducible, forkable, replayable, and comparable across actors (leader agents).

Language is what gives rise to legible thinking (Sapir and Whorf), though it may not always involve text and words as we and LLMs know of it.

If you want an agent to imagine a future state and a human to learn from that imagination, the substrate has to be something both can read. Pixels are not that substrate. Typed JSON with named departments, decision logs, and citations is that substrate. The visual world models will absolutely matter for embodied robotics and film, but they may not be the right primitive for creating worlds and scenarios like a human for humans. Two columns, both legitimate, mostly disjoint customers.

<aside style="border:1px solid var(--border,#3a3225); border-radius:12px; padding:1.5rem 1.75rem; margin:2.5rem 0; background:var(--bg-card,rgba(40,32,24,0.55));">

**Paracosm, in one card.**

`paracosm` *(n.)* — an open-source TypeScript engine that compiles a natural-language scenario, document, or URL into a typed, deterministic, forkable world model and runs N AI actors through it from the same seed. Every run returns a Zod-validated `RunArtifact`: every event, every decision, every forged tool, every citation, every divergence. Apache-2.0. Built on AgentOS.

- **Input.** Plain English brief, document, URL, or hand-written `ScenarioPackage` JSON.
- **World.** Five typed bags (`metrics`, `capacities`, `statuses`, `politics`, `environment`), a deterministic Mulberry32-seeded kernel, and seven LLM-generated runtime hooks per scenario.
- **Actors.** AI commanders with measurable HEXACO personality vectors (or any registered trait model — `ai-agent`, custom). Same seed, opposing traits → divergent futures.
- **Tools.** Specialists forge new TypeScript functions at runtime inside a hardened `node:vm` sandbox; an LLM judge approves; reuse costs tens of tokens.
- **Output.** A `RunArtifact` you can fork from any captured turn, replay byte-equal, diff against another actor's run, or feed into any JSON pipeline.

`npm install paracosm` · [paracosm.agentos.sh/sim](https://paracosm.agentos.sh/sim) · [`framersai/paracosm`](https://github.com/framersai/paracosm) · [API docs](https://paracosm.agentos.sh/docs)

</aside>

## What it does, in three sentences

<img src="/img/blog/paracosm/quickstart-prompt.png" alt="Paracosm Quickstart with a hurricane-evacuation prompt typed into the WRITE tab. The cost preview shows ~$0.70 for a 7-11 minute run; the loaded Mars Genesis scenario sits above as a one-click alternative." style="width:100%;border-radius:8px;margin:1.5rem 0;" />

*Quickstart's WRITE tab. Paste a brief, drop a PDF, supply a URL. Below the textarea: cost preview, actor count, and a one-click "run the loaded scenario" path for users who don't want to compile from scratch.*

You give Paracosm a scenario in natural language: "a coastal mayor has thirty-six hours to evacuate before a hurricane," or a URL to an academic paper, or a JSON contract you wrote yourself. The engine compiles the scenario into a typed `ScenarioPackage` (departments, agents, events, starting state, ~ a hundred personality-typed cells, a deterministic kernel, seven LLM-generated runtime hooks), grounds the events with research from [Serper](https://serper.dev), [Tavily](https://tavily.com), and [Firecrawl](https://www.firecrawl.dev) (all through AgentOS's current mechanism for [grounding citations](https://docs.agentos.sh/features/citation-verification)) then runs N AI commanders with different traits through the same world from the same seed and gives you back a `RunArtifact` per commander. The artifact is a single JSON blob you can fork, replay, diff against another commander's run, drop into the dashboard's VIZ tab to watch divergence by department, or post-process in any analysis pipeline that reads JSON.

The HEXACO model ([Ashton & Lee, 2007](https://doi.org/10.1177/1088868306294907)) is the personality substrate: six continuous dimensions (Honesty-Humility, Emotionality, Extraversion, Agreeableness, Conscientiousness, Openness) that the leader carries through the run. Two actors / leaders sharing every other variable but with opposing HEXACO vectors will produce measurably different colonies, treatment plans, evacuation orders, business decisions, fantasy-quest endings. Or, to generalize beyond human leaders and into any type of scenario that can be simulated, leaders can be given different directives, objectives, and focuses, all described through natural language and weights.

Same world, same kernel, same seed, divergent events, divergent futures.

## Why a game designer wrote it

I am a game designer in addition to working as an applied AI engineer. I have spent enough hours inside [Crusader Kings](https://www.paradoxinteractive.com/games/crusader-kings-iii/about), [RimWorld](https://rimworldgame.com/), and [Dwarf Fortress](https://www.bay12games.com/dwarves/) to know what watching simulated agents make decisions feels like at its best, which is somewhere between voyeurism and revelation. The interesting moment in those games is never the win. It is when the simulation tells you what your decision actually meant. The ironman run that ends because your overzealous knight murdered the wrong courtier. The colonist who quietly starves because your stockpile priorities were three steps out of date. The fortress that collapses because of a cat. Game designers have been building structured, replayable, decision-driven simulators for forty years. The interesting bit is what you can read in the trajectory after.

One day I saw [MiroFish](https://github.com/666ghj/MiroFish), which uses [OASIS](https://github.com/camel-ai/oasis) (CAMEL-AI) to run open-ended social simulations with up to a million LLM-driven agents on social-media-shaped substrates and emit an aggregate prediction report. It is impressive, novel, and also doing something different than what I wanted. MiroFish's simulation is bottom-up: The swarm dynamics are the output, the prediction is what emerges. I wanted to build something top-down. I wanted the same primitive that makes Crusader Kings legible. One leader makes a decision. A swarm of specialists and ~100 personality-typed cells reacts. The kernel applies the decision as a bounded numerical effect, and the trajectory diverges. You compare runs. You learn what the leader's personality or goals actually did to affect and influence the world, and how different events or crises or influences spawned reacting to those lead actors.

Paracosm is the lane between MiroFish (bottom-up emergent prediction at one-million-agent scale) and the academic structured world models (formal, hand-coded, no LLM). It is the LLM-driven, deterministic-kernel, top-down agent swarm with measurable divergence. Paracosm revolves around counterfactual analysis and digital twins, and as such can emulate and support simulation of any type of digital twin, human, event, or any object with action or motion.

## What those NPCs were doing in the vault

Back to the wilds.ai fight that didn't happen. The NPCs that retreated were not broken. They were running the agent loop the wilds-ai engine has shipped since launch: read the conversation, infer the user's intent, decide what action serves the character's continuity, execute. The characters were non-combatant residents in an active fantasy quest. When I declared aggression the agent's policy router did exactly what the design said—it preserved character integrity over playing along with the player's framing. The vault was the locally optimal play. The LLM saw an attacker, weighed the cost of fighting against the cost of hiding, and locked the door.

The behavior was right at the per-character level and produced a globally absurd world state. Two factions optimizing for short-term survival inside a resource-bounded environment can both end up in failure modes that look obvious only from outside the simulation. That is the lesson games like Crusader Kings, RimWorld, and Dwarf Fortress have been teaching for decades, but it lands differently when an LLM is the one making the choice.

The bug was not in the agent. The bug was in me, the player, having no way to learn from that moment. I could not replay the same scene with a more confrontational NPC and see if a different personality would have stood and fought rather than retreated. I could not fork the world from the moment of declared aggression and run two divergent branches in parallel. I could not export the trajectory and diff the decision tree against an alternate seed. I could not even verify whether the NPCs starved in the vault before I starved in the desert, because the simulation does not surface that kind of post-game accounting. wilds.ai is built for continuity inside one session. It is not built for the kind of legible, comparable, forkable counterfactuals I have been chasing in the simulator games I love. Different product, different job. The vault was not on that path. It was an emergent moment with no replay button.

Paracosm is the replay button.

## How a turn runs

The turn loop is the only piece of Paracosm interesting at the engineering level. Everything else is plumbing.

1. **State snapshot.** The kernel reads the current `ScenarioPackage` state: five JSON bags called `metrics`, `capacities`, `statuses`, `politics`, `environment`. No hidden fields. The shape is the API.
2. **Event generation.** An LLM is prompted with the state and the leader's HEXACO profile and proposes plausible events for this turn. The LLM does not just imagine; it consults research via AgentOS's `WebSearchService` (Firecrawl, Tavily, Serper, Brave in parallel, Cohere `rerank-v3.5` reranking on top). DOI-linked citations propagate into the artifact. Without research grounding, events drift toward LLM cliché.
3. **Specialist analyses.** Each specialist agent (economist, scientist, security officer) writes a short analysis given the events and the leader's profile. Specialists have personalities. They disagree.
4. **Tool forging.** A specialist may decide the next decision needs a tool that does not exist yet. They write a TypeScript function with a Zod-validated input/output schema and submit it. A forged tool from an actual run looks like `compute_resource_allocation_under_drought_constraint(state) → priorityList`.
5. **Sandbox execution.** Approved tools run in a hardened `node:vm` sandbox with a 5-second default wall clock and a 128 MB nominal memory budget (heap-delta heuristic, not preemptively enforced; preemptive limits via `isolated-vm` are queued for the hosted multi-tenant tier). The sandbox always bans `eval`, `Function`, `require`, dynamic `import`, `process`, `child_process`, and destructive `fs.*`. `fetch`, `fs.readFile`, and `crypto` are opt-in via allowlist; the default allowlist is empty, so by default a forged tool has no network, no filesystem, no crypto.
6. **LLM judge.** A separate LLM call examines each forged tool's output against the specialist's stated intent. Match approves it for inclusion in the decision context and adds it to a discoverable index for future turns. Mismatch rejects it. Reuse via `call_forged_tool(name, args)` costs tens of tokens; a fresh forge costs full LLM tokens for the proposal, body, test scaffolding, and judge. After turn three of a typical run most decisions invoke at least one previously-forged tool, and total run cost flattens.
7. **Decision.** The leader, equipped with events, analyses, and forged tools, makes a turn decision: an action category, a parameter set, a stated rationale, a confidence score.
8. **Kernel apply.** The kernel applies the decision's effects. Resources move. Statuses change. Agents are promoted, demoted, or lost.
9. **Personality drift.** Three forces apply: **leader-pull** (a leader's traits influence the agents who report to them), **role-activation** (an agent's role nudges their traits over time, a security officer drifts toward Conscientiousness), **outcome-reinforcement** (success reinforces the traits that produced it). The commander drifts alongside the agents.
10. **Artifact append.** Everything from this turn is appended to the `RunArtifact`. Next turn begins.

The clever parts (research grounding, tool forging, personality drift) exist because the simulation without them tells boring stories.

<img src="/img/blog/paracosm/compare-view.png" alt="Paracosm Compare bundle modal: 'crow-village · 2 actors' header, total cost $0.52, mean run time 3m 8s, a trajectory overlay charting both runs, and two side-by-side leader cards — Dietrich Voss (The Engineer, $0.23, 187s) on the left and Aria Chen (The Visionary, $0.29, 189s) on the right." style="width:100%;border-radius:8px;margin:1.5rem 0;" />

*Compare bundle modal. Same scenario, same kernel, two leaders. The trajectory overlay normalizes a representative metric (population → morale → first-available) across both runs so divergence is visible at a glance; the per-actor cards drill into the individual artifacts. The Library tab seeds this view from any saved bundle.*

## Why the events have citations

The grounded citations earn their place by stopping a specific failure mode. Ungrounded LLMs default to the statistical center of their training data the moment the prompt gets vague, which means every hurricane scenario eventually generates the same archetypal storm-surge-and-power-loss events, every Mars colony runs into the same regolith and radiation problems, every clinical-trial decision lands somewhere near an average compliance committee meeting. Plausible. Predictable. Useless for actually testing what would happen in a *specific* decision a *specific* leader is making against *specific* current conditions.

So at compile time the engine pulls in real research from [Serper](https://serper.dev), [Tavily](https://tavily.com), [Firecrawl](https://www.firecrawl.dev), and [Brave](https://brave.com/search/api/) in parallel, dedupes by URL, runs the result through Cohere's `rerank-v3.5` to surface the highest-signal snippets per topic, and writes them into the scenario's research bundle. The same pipeline runs again per turn during event generation if `liveSearch` is on, so the events that get proposed are anchored in the most recent literature the model can find rather than its training-cutoff memory.

The citations don't just sit in the bundle. They thread into the department prompts, so each specialist's analysis quotes actual literature instead of inventing a believable-sounding number. The Medical department on a Mars run cites real radiation studies. The Engineering department on a coastal-evacuation scenario points at real FEMA protocols. The Communications department on an AI-lab decision references real AI Safety Institute statements. And every commander decision and specialist note in the resulting `RunArtifact` carries the source list it was reasoning over, so a downstream researcher reading the artifact can audit which sources drove which conclusion. AgentOS's [citation-verification](https://docs.agentos.sh/features/citation-verification) feature is the primitive doing this; Paracosm wires it into the turn loop and the artifact schema.

The reason this is worth its API spend: a Paracosm run with grounding generates plausible inferences a researcher can audit. A Paracosm run without it generates plausible nonsense. The first is research. The second is fiction. The artifact format makes the difference visible — a decision with three citations attached is something you can argue with; a decision without any is something you can only feel about.

## HEXACO is the leverage

Six factors: Honesty-Humility, Emotionality, Extraversion, Agreeableness, Conscientiousness, Openness. Lee and Ashton introduced HEXACO in their 2007 *Personality and Social Psychology Review* paper ([doi:10.1177/1088868306294907](https://doi.org/10.1177/1088868306294907)) as a six-factor extension of the Big Five with Honesty-Humility split out as a separate axis because the data demanded it.

There is nothing magical about HEXACO. It is a measurement framework with extensive cross-cultural validation. Paracosm uses it because, after trying the alternatives, it is the smallest set of dimensions that produces visibly distinct simulator behavior. The Big Five works almost as well. The Big Five plus an honesty axis works better. HEXACO is the sweet spot of expressive-without-being-overfit.

Two things to note. First, HEXACO is opt-in. Many Paracosm scenarios do not touch personality at all. You can simulate a financial market without giving the market a Big Six profile. Second, when personality is on it does not act through prompt injection alone. Personality biases which specialists get consulted, which decisions get accepted, which tools get forged. The drift mechanism (leader-pull, role-activation, outcome-reinforcement) is encoded in the kernel, not in a prompt. Prompt-only personality dissolves under context pressure. Kernel-encoded personality survives.

The microbenchmark for this lives in agentos-bench: [`HexacoEncodingBias`](https://github.com/framersai/agentos-bench/blob/master/src/micro/HexacoEncodingBias.ts). It asserts that each HEXACO trait modulates encoding in the direction the literature predicts. Pass criterion is in the source.

## Tool forging at runtime

A specialist agent in Paracosm can write code at runtime that the kernel executes. The pipeline:

```
Specialist proposes a tool
       ↓
Zod-validated function signature (input, output)
       ↓
TypeScript body authored by the LLM
       ↓
Hardened node:vm sandbox: 5s wall clock default, 128 MB nominal heap (not preempted), default-empty allowlist
       ↓
LLM judge: does the output match the stated intent?
   ↓ approve            ↓ reject
   Tool added         Tool dropped
   to forge cache     from this turn
```

The economics matter more than the mechanism. Forging is expensive: full LLM tokens for the proposal, the body, the test scaffolding, the judge. Reuse is nearly free, tens of tokens to dispatch. After turn three of a typical run most decisions invoke at least one previously-forged tool, and total run cost stops climbing linearly. The asymptote is set by the rate at which new situations arise that no previously-forged tool covers.

Reuse turned out to be the largest cost lever in the system, which I did not predict. I designed for forge-on-demand and assumed reuse would be a nice-to-have.

## Run a simulation in five minutes

```bash
npm install paracosm
```

```ts
import { runMany } from 'paracosm';

const { runs } = await runMany(
  'A coastal fishing town facing a regulatory shock that bans certain net types.',
  { count: 3, seed: 42 },
);

runs.forEach(({ actor, artifact }) => {
  console.log(actor.name, artifact.fingerprint);
});
```

Three actors. Three trajectories. Same seed. Same kernel. Different HEXACO vectors generated by the engine. The artifact for each one carries every decision, every forged tool, every citation, every cost line.

For the deeper case where you want to fork the world from a specific turn and rerun with a different leader:

```ts
import { WorldModel } from 'paracosm';

const wm = await WorldModel.fromPrompt({
  seedText: 'Two AI labs, one frontier model, six weeks of safety review left.',
});

// Trunk run. captureSnapshots: true is required so the artifact
// carries per-turn kernel state for forking later.
const cautious = await wm.simulate({
  actor: {
    name: 'Atlas',
    archetype: 'The Engineer',
    unit: 'AI Lab Council',
    hexaco: { openness: 0.3, conscientiousness: 0.9, extraversion: 0.45, agreeableness: 0.55, emotionality: 0.4, honestyHumility: 0.7 },
    instructions: '',
  },
  maxTurns: 6,
  seed: 42,
  captureSnapshots: true,
});

// Branch from turn 3 of the trunk artifact. forkFromArtifact restores
// the kernel snapshot at that turn into a new WorldModel, then we run
// .simulate() on it with a different leader. maxTurns is the absolute
// final turn index, not the branch length.
const branchWm = await wm.forkFromArtifact(cautious, 3);
const ambitious = await branchWm.simulate({
  actor: {
    name: 'Maria',
    archetype: 'The Visionary',
    unit: 'AI Lab Council',
    hexaco: { openness: 0.95, conscientiousness: 0.35, extraversion: 0.85, agreeableness: 0.55, emotionality: 0.3, honestyHumility: 0.65 },
    instructions: '',
  },
  maxTurns: 6,
  seed: 42,
});

console.log(cautious.finalState?.metrics, ambitious.finalState?.metrics);
console.log(ambitious.metadata.forkedFrom);
// → { parentRunId: '...', atTurn: 3 }
```

Two leaders, same kernel, same seed, divergence forks at turn three. The artifact records both trajectories.

<img src="/img/blog/paracosm/sim-fullpage.png" alt="Paracosm SIM tab full-page view of a four-actor parallel run. Four leader columns (A, B, C, D) at top, each with their own event stream below, every column reacting to the same scenario but producing different decisions, forging different tools." style="width:100%;border-radius:8px;margin:1.5rem 0;" />

*Four-actor parallel run on the same scenario. Each column gets its own leader, its own event stream, its own forged tools. Same world, same seed, four divergent trajectories — the divergence is the data.* The dashboard at [paracosm.agentos.sh/sim](https://paracosm.agentos.sh/sim) does the same thing without writing code, and the full API reference is at [paracosm.agentos.sh/docs](https://paracosm.agentos.sh/docs). A six-turn run on a small scenario with default settings costs in the low tens of cents. The artifact records every token.

## What you can do with it

**Decision support and digital twins for real life.** Type a scenario about a decision you actually have to make. A career switch with a deadline and three departments of input. A clinical-trial protocol decision. A pricing change for a product you ship. Paracosm compiles the scenario, runs three AI commanders with different HEXACO profiles, and shows you what each personality does to the trajectory. It is not a fortune teller. It is a counterfactual generator. You read the trajectories side by side and you get something back that is not "what GPT thinks." It is "what three different personalities consistently optimize for, and what each one breaks when they over-optimize." Lukas Kirfel's group at UCL published [a paper in *AI and Ethics*](https://link.springer.com/article/10.1007/s43681-025-00718-4) on counterfactual world simulation as a moral reasoning aid. The argument is that imagining counterfactuals is part of how humans make difficult decisions and an LLM that only gives one answer is a worse adviser than one that helps you enumerate the alternatives.

**Game and game-engine experiments.** For sim games, you can use Paracosm as a game engine for designed experiences, or as a simulator that watches your existing game's world unfold under different leader personalities. The "is this game fair under HEXACO=high-emotionality" question is now testable. The "would a min-maxer or a pacifist produce a more interesting trajectory in this campaign" question is now testable.

**Watching simulations come to life.** This is the one I did not expect to like as much as I do. The dashboard at [paracosm.agentos.sh/sim](https://paracosm.agentos.sh/sim) renders the run as a live cell grid (VIZ tab), a department-by-department divergence overlay, a tour of the constellation, a full Reports breakdown with citations. There is a Library of past runs. There is a Replay button on every saved session. You can fork a run at any turn and rerun it with a different leader. It is the closest thing I have to playing Crusader Kings as a researcher.

<img src="/img/blog/paracosm/sim-current.png" alt="Paracosm SIM tab constellation view. Four actors arranged on a constellation graph (Captain Mara Voss at top, Aria Chen on the right, Ilya Soren on the left, Dr. Nia Calder at the bottom) with edges showing pairwise divergence. Below: a Distribution panel charting Morale and Population over six turns." style="width:100%;border-radius:8px;margin:1.5rem 0;" />

*SIM tab, constellation view. Four actors on the same scenario, edges weighted by pairwise divergence, Distribution panel charting morale and population trajectories. The view scales 2 → 50 actors; the larger-N versions cluster by trait similarity instead of pinning one position per actor.*

<img src="/img/blog/paracosm/library-current.png" alt="Paracosm Library tab. Eight saved runs across multiple scenarios (generation-ship-reactor-leak, mars-genesis), with bundles, actor names, archetypes, costs, and timestamps. Header shows 8 runs, $2.04 total spent, $0.26 per-run average, 25.9 minutes total time." style="width:100%;border-radius:8px;margin:1.5rem 0;" />

*Library tab. Every saved run gets a card with the bundle tag, actor list, archetypes, run cost, and timestamp. Replays don't re-cost the LLM — the dashboard streams the cached event log back at original pacing. The header surfaces the running totals for the local run history.*

## What Paracosm isn't

**Not a pixel generator.** Sora, Genie 3, World Labs Marble do that. Paracosm's output is a structured `RunArtifact`. There are diagrams in the dashboard, but they are renderings of the artifact, not the artifact.

**Not a trained model.** AMI Labs, V-JEPA, I-JEPA train weights. Paracosm uses existing frontier LLMs (configurable per run) plus existing embeddings and rerankers. No model weights produced.

**Not a replacement for real-world data.** A counterfactual simulator is a tool for thinking, not for forecasting in the strong sense. Every decision has a `confidence` score, every metric has a `derivedFrom` trace, every citation has a DOI when one exists. Treat a Paracosm run as ground truth at your own risk; the artifact is structured to make that harder than it would otherwise be.

**A top-down agent swarm, not a bottom-up emergent one.** [OASIS](https://openreview.net/forum?id=JBzTculaVV) and [MiroFish](https://github.com/666ghj/MiroFish) operate at 1k to 1M agents and do bottom-up emergent prediction; the swarm dynamics are the output. Paracosm runs a directed agent swarm: 1 commander, 5 specialist departments, ~100 personality-typed cells, and the trajectory is deterministic per seed. Both shapes are valid agent swarm architectures; paracosm's lane is the directed, replayable, decision-support side. The [Inside Mars Genesis case study](/en/blog/inside-mars-genesis-ai-colony-simulation/) has the engineering breakdown.

**Not a multi-agent task framework.** LangGraph, AutoGen, CrewAI, OpenAI Agents SDK, Mastra: those execute real tasks against real APIs. Their output reaches the world. Paracosm's output stays inside the simulation. Zero overlap on user job-to-be-done.

**Forging is not magic.** Forged tools fail. The judge rejects a meaningful fraction. The 128 MB / 5s sandbox kills tools that try to do too much. The artifact records every forge attempt including the failed ones, on the theory that transparency is more valuable than a higher reported success rate.

## Where the field is in May 2026

Three threads of recent literature triangulate the structured world model category and explain why Paracosm exists in its current shape.

**Counterfactual semantics for LLM agents are getting formal.** Kirfel, Manktelow, and Lagnado's [*Counterfactual World Simulation Models*](https://link.springer.com/article/10.1007/s43681-025-00718-4) (*AI and Ethics*, 2025) is the philosophical foundation: a CWSM replays an event with one variable changed and surfaces the effect, with explicit ethical guardrails around how the result gets used. [*Integrating Counterfactual Simulations with Language Models*](https://arxiv.org/abs/2505.17801) (May 2025) introduces AXIS, an LLM-driven framework that interrogates a simulator with `whatif` and `remove` prompts to explain multi-agent policies. AXIS is roughly the API a downstream tool would call against a Paracosm `RunArtifact`. The artifact already exposes the right shape for it.

**Generative ABM is getting critical scrutiny.** The 2025 Springer review [*Validation is the central challenge for generative social simulation*](https://link.springer.com/article/10.1007/s10462-025-11412-6) makes the case bluntly: LLMs revive interest in agent-based models by enabling expressive generative agents, but stochasticity, cultural bias, and black-box behavior make calibration and validation harder than they were under classical Mesa, NetLogo, MASON, ABIDES, AnyLogic tooling. The [Nature HSSC 2024 survey on LLM-empowered ABM](https://www.nature.com/articles/s41599-024-03611-3) is the broader companion. [AgentSociety (SSRN 2026)](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5954414) and [WarAgent](https://github.com/agiresearch/WarAgent) are concrete examples at the population end. Paracosm runs ~100-agent civilizations specifically because the calibration problem is tractable at that scale and intractable at the millions-of-agents end.

**Agents are not yet good at using world models as tools.** [*Current Agents Fail to Leverage World Model as Tool for Foresight*](https://arxiv.org/html/2601.03905) (January 2026) finds that LLM agents often do not invoke world-model tools even when doing so would improve foresight, and when they do, they tend to misuse them: generating one deterministic future, overriding the simulation with their own internal reasoning, or skipping the counterfactual branches. That paper describes the failure mode a structured world model has to engineer against. Paracosm's answer is to keep the kernel deterministic, return the artifact in a typed shape that resists the "I bet the future is X" override, and surface fork-vs-trunk divergence visibly in the dashboard so a single-trajectory claim is harder to make.

The throughline: if the simulator hides its assumptions, an LLM agent will paper over the rest. A structured world model has to externalize the world into schema, citations, tools, snapshots, and seeded transitions, then let the LLM reason over that structure.

The [LLM Agents Papers tracker](https://github.com/AGI-Edgerunners/LLM-Agents-Papers) and the [Awesome World Models reading list](https://github.com/leofan90/Awesome-World-Models) are the two community-maintained lists worth bookmarking if you want to follow this from the outside.

## Where this is going

I think structured world models become the substrate for a class of AI tools that do not exist yet. Decision support that enumerates counterfactuals instead of giving one confident answer. Digital twins of teams, products, lives. Game engines where the simulation is the gameplay. Research environments where a hypothesis is run as a hundred forked simulations and the divergence is the result. The ACM-CSUR survey calls these "understanding-world models." They are the second kind of world model. The kind that does not need pixels. The kind that needs to be legible enough for a human to learn from.

Try it. [paracosm.agentos.sh/sim](https://paracosm.agentos.sh/sim). Type a what-if. Run three actors. See what diverges.

If you make something interesting, [send us a thought](https://agentos.sh/contact). The waitlist is at the bottom of [paracosm.agentos.sh](https://paracosm.agentos.sh) for the Q3 hosted dashboard.

---

## Links

- Code: [github.com/framersai/paracosm](https://github.com/framersai/paracosm) (Apache-2.0, TypeScript, `npm install paracosm`)
- Live demo: [paracosm.agentos.sh/sim](https://paracosm.agentos.sh/sim)
- API reference: [paracosm.agentos.sh/docs](https://paracosm.agentos.sh/docs)
- Mars Genesis case study: [Inside Mars Genesis](/en/blog/inside-mars-genesis-ai-colony-simulation/)
- Underlying runtime: [github.com/framersai/agentos](https://github.com/framersai/agentos) (Apache-2.0)
- Benchmark methodology: [framersai/agentos-bench](https://github.com/framersai/agentos-bench)
- wilds.ai (the AI companion product where the NPCs locked themselves in a vault): [wilds.ai](https://wilds.ai)

## References

- HEXACO: Lee, K., & Ashton, M. C. (2007). *Empirical, theoretical, and practical advantages of the HEXACO model of personality structure.* *Personality and Social Psychology Review*, 11(2), 150-166. [doi:10.1177/1088868306294907](https://doi.org/10.1177/1088868306294907)
- World models, the original sense: Ha, D., & Schmidhuber, J. (2018). *World Models.* [arXiv:1803.10122](https://arxiv.org/abs/1803.10122)
- World models, the survey: Tsinghua FIB Lab. (2025). *Understanding World or Predicting Future? A comprehensive survey of world models.* *ACM Computing Surveys*. [doi:10.1145/3746449](https://dl.acm.org/doi/full/10.1145/3746449)
- World models, the critique: Xing, E. P., et al. (2025). *Critiques of World Models.* [arXiv:2507.05169](https://arxiv.org/abs/2507.05169)
- World models for decision making: Yang, Z., et al. (2025). *Evaluating World Models with LLM for Decision Making.* ICLR 2025. [arXiv:2411.08794](https://arxiv.org/abs/2411.08794)
- Counterfactual simulation as moral reasoning aid: Kirfel, L., Manktelow, K., & Lagnado, D. (2025). *Counterfactual World Simulation Models.* *AI and Ethics*. [doi:10.1007/s43681-025-00718-4](https://link.springer.com/article/10.1007/s43681-025-00718-4)
- AXIS counterfactual API: Anonymous. (2025, May). *Integrating Counterfactual Simulations with Language Models.* [arXiv:2505.17801](https://arxiv.org/abs/2505.17801)
- Generative ABM critique: Springer review (2025). *Validation is the central challenge for generative social simulation.* [doi:10.1007/s10462-025-11412-6](https://link.springer.com/article/10.1007/s10462-025-11412-6)
- LLM-empowered ABM survey: *Nature Humanities and Social Sciences Communications* (2024). [s41599-024-03611-3](https://www.nature.com/articles/s41599-024-03611-3)
- World-model tool failure mode: *Current Agents Fail to Leverage World Model as Tool for Foresight* (January 2026). [arXiv:2601.03905](https://arxiv.org/html/2601.03905)
- MiroFish (the bottom-up agent swarm I am NOT competing with): [github.com/666ghj/MiroFish](https://github.com/666ghj/MiroFish)
- OASIS (MiroFish's substrate): [CAMEL-AI](https://github.com/camel-ai/oasis)
- LLM Agents Papers tracker: [AGI-Edgerunners/LLM-Agents-Papers](https://github.com/AGI-Edgerunners/LLM-Agents-Papers)
- Awesome World Models reading list: [leofan90/Awesome-World-Models](https://github.com/leofan90/Awesome-World-Models)
