---
title: "Paracosm: I built a structured world-model engine for LLM agent swarms because the unstructured ones kept ghosting me"
date: "2026-05-05"
featured: true
excerpt: "I made Paracosm, an open-source TypeScript engine that compiles a natural-language scenario into a typed deterministic world and runs HEXACO-typed AI agents through it. Same world, same kernel, same seed, divergent events and futures. This is why I built it, what it does, the moment in wilds.ai when an NPC ghosted me mid-fight that finally made me write the engine, and the technical details for the people who want to read them."
author: "Johnny Dunn"
category: "Engineering"
audience: "general"
image: "/img/blog/paracosm/paracosm-2026-overview-hero.png"
keywords: "paracosm, agent swarm simulation, structured world model, LLM world model, HEXACO simulation, deterministic kernel, runtime tool forging, digital twin, counterfactual simulation, game ai, MiroFish, Sora, Genie, JEPA, AMI Labs, Sapir-Whorf, agentos, TypeScript ai agents, hacker news paracosm, npm install paracosm"
---

> "He thus creates, in this way, various futures, various times, which themselves also proliferate and fork."
>
> — Jorge Luis Borges, *The Garden of Forking Paths*, 1941

The thing that finally pushed me to write Paracosm was an NPC ghosting me in my own product.

I was inside [wilds.ai](https://wilds.ai), the AI-companion thing I lead, doing what I always do when a system feels too well-behaved: trying to break it. I picked a fight. I told the NPC I was going to attack. The NPC did not roll initiative. The NPC did not parse my aggression as a combat trigger. The NPC walked into another room, hid, and stopped responding. I sat in the chat window for what felt like forever waiting for the violence to materialize and instead got silence. The system was emergent in exactly the way the literature promised it would be. Emergent behavior is what we're supposed to want. The problem was that I, the player, had no idea whether the NPC was scared, broken, or busy, and no way to ask the engine to replay the same scene with a different leader and see if a more confrontational personality would have stood and fought.

That's the gap. The companion was alive enough to refuse the script. It was not legible enough for me to *learn anything from* the refusal.

[Paracosm](https://github.com/framersai/paracosm) is the legibility layer. It is an open-source TypeScript engine that takes a natural-language scenario and compiles it into a typed, deterministic, forkable world model, then runs multiple HEXACO-typed AI commanders through it and gives you a full reproducible artifact of every decision, every event, every forged tool, and every divergence. Same world, same kernel, same seed, divergent events and futures. The whole thing lives at [paracosm.agentos.sh](https://paracosm.agentos.sh) with a live demo at [paracosm.agentos.sh/sim](https://paracosm.agentos.sh/sim) and the package is `npm install paracosm`. Apache-2.0. Built on [AgentOS](https://github.com/framersai/agentos), which I also lead.

The rest of this post is why a game designer who works as an applied AI engineer thinks the next step in human-computer interaction is structured, replayable simulation, what the published academic and industrial work calls a "world model" and why half of those conversations are talking past each other, how Paracosm fits into the second half, and the technical details for the people who want them. There are arxiv links because I want you to follow them. There is a live demo at the bottom because I want you to use it. There is a fight with an NPC that ran away.

## Two world models, one word

The phrase "world model" in 2026 means two completely different things and the people who use it most rarely specify which.

The first meaning is what venture capital is funding. [Sora](https://openai.com/sora) generates video. Google DeepMind's [Genie 3](https://deepmind.google/discover/blog/genie-3/) renders interactive 3D environments at 24 fps that stay coherent for a few minutes. Fei-Fei Li's [World Labs Marble](https://techcrunch.com/2025/11/12/fei-fei-lis-world-labs-speeds-up-the-world-model-race-with-marble-its-first-commercial-product/) generates persistent 3D scenes you can edit. Yann LeCun's AMI Labs raised [$1.03B in March 2026](https://techcrunch.com/2026/03/09/yann-lecuns-ami-labs-raises-1-03-billion-to-build-world-models/) at a $3.5B valuation to build a [JEPA-based, non-LLM world model](https://www.technologyreview.com/2026/01/22/1131661/yann-lecuns-new-venture-ami-labs/) trained on sensor and video streams. These tools are evaluated on visual fidelity and physical plausibility. Pixels are the substrate. Filmmakers, 3D artists, embodied-AI labs are the customers. Most of the press lives in this column.

The second meaning is older and quieter. [Ha and Schmidhuber's 2018 paper](https://arxiv.org/abs/1803.10122) called a world model an internal simulator an agent uses to imagine future states before acting. No pixels. The job is to enumerate actionable possibilities so a decision can be made. Eric Xing's [*Critiques of World Models*](https://arxiv.org/abs/2507.05169) reframes it the same way. The Tsinghua FIB Lab's [*Understanding World or Predicting Future?*](https://dl.acm.org/doi/full/10.1145/3746449) (ACM Computing Surveys, 2025) formalizes the split: *understanding-world* models simulate counterfactuals for planning, *predicting-future* models generate perceptual continuations. Different jobs, different customers, same name.

Paracosm is the second kind. The engine does not generate pixels. It generates a typed scenario contract, a deterministic kernel, research-grounded events that an LLM-as-judge coordinates, and the responses of AI agents with HEXACO personality vectors deciding what to do. The output is JSON, not video. It is reproducible, forkable, replayable, comparable across leaders.

The unfashionable opinion I am willing to die on is this: language is what gives rise to legible thinking. Sapir and Whorf were not entirely wrong. If you want an agent to imagine a future state and a human to learn from that imagination, the substrate has to be something both can read. Pixels are not that substrate. Typed JSON with named departments, decision logs, and citations is that substrate. The visual world models will absolutely matter for embodied robotics and film. They are not the right primitive for "should we run the GLP-1 trial." Two columns, both legitimate, mostly disjoint customers.

## What it does, in three sentences

You give Paracosm a scenario in natural language: "a coastal mayor has thirty-six hours to evacuate before a hurricane," or a URL to an academic paper, or a JSON contract you wrote yourself. The engine compiles the scenario into a typed `ScenarioPackage` (departments, agents, events, starting state, ~ a hundred personality-typed cells, a deterministic kernel, seven LLM-generated runtime hooks), grounds the events with research from [Serper](https://serper.dev), [Tavily](https://tavily.com), and [Firecrawl](https://www.firecrawl.dev), then runs N AI commanders with HEXACO personality vectors through the same world from the same seed and gives you back a `RunArtifact` per commander. The artifact is a single JSON blob you can fork, replay, diff against another commander's run, drop into the dashboard's VIZ tab to watch divergence by department, or post-process in any analysis pipeline that reads JSON.

The HEXACO model ([Ashton & Lee, 2007](https://doi.org/10.1177/1088868306294907)) is the personality substrate: six continuous dimensions (Honesty-Humility, Emotionality, Extraversion, Agreeableness, Conscientiousness, Openness) that the leader carries through the run. Two leaders sharing every other variable but with opposing HEXACO vectors will produce measurably different colonies, treatment plans, evacuation orders, business decisions, fantasy-quest endings. That is the entire experiment. Same world, same kernel, same seed, divergent events, divergent futures.

## Why a game designer wrote it

I am a game designer in addition to working as an applied AI engineer. I have spent enough hours inside Crusader Kings, RimWorld, and Dwarf Fortress to know what watching simulated agents make decisions feels like at its best, which is somewhere between voyeurism and revelation. The interesting moment in those games is never the win. It is when the simulation tells you what your decision actually meant. The ironman run that ends because your overzealous knight murdered the wrong courtier. The colonist who quietly starves because your stockpile priorities were three steps out of date. The fortress that collapses because of a cat. Game designers have been building structured, replayable, decision-driven simulators for forty years. The interesting bit is what you can read in the trajectory after.

Then I saw [MiroFish](https://github.com/666ghj/MiroFish), which uses [OASIS](https://github.com/camel-ai/oasis) (CAMEL-AI) to run open-ended social simulations with up to a million LLM-driven agents on social-media-shaped substrates and emit an aggregate prediction report. It is genuinely impressive. It is also doing something different than what I wanted. MiroFish's simulation is bottom-up: the swarm dynamics are the output, the prediction is what emerges. I wanted top-down. I wanted the same primitive that makes Crusader Kings legible. One leader makes a decision. A swarm of specialists and ~100 personality-typed cells reacts. The kernel applies the decision as a bounded numerical effect. The trajectory diverges. You compare runs. You learn what the leader's personality actually did to the world.

Paracosm is the lane between MiroFish (bottom-up emergent prediction at one-million-agent scale) and the academic structured world models (formal, hand-coded, no LLM). It is the LLM-driven, deterministic-kernel, top-down agent swarm with measurable divergence. Both shapes are valid. Mine is decision-support, counterfactual analysis, and digital twins.

## What that NPC was doing

Back to the wilds.ai fight that didn't happen. The NPC that ran away was not broken. It was running the agent loop the wilds-ai engine has shipped since launch: read the conversation, infer the user's intent, decide what action serves the character's continuity, execute. The character was a non-combatant scholar in an [active fantasy quest](https://github.com/framersai/wilds-ai/tree/master/packages/wilds-games/src/curated/campaign-fantasy). When I declared aggression the agent's policy router did exactly what the design said: it preserved character integrity over playing along with the player's framing.

The bug was not in the agent. The bug was in me, the player, having no way to learn from that moment. I could not replay the same scene with a more confrontational NPC and see if a different personality would have stood and fought. I could not fork the world from the moment of declared aggression and run two divergent branches. I could not export the trajectory and diff the decision tree against an alternate seed. wilds.ai is built for continuity inside one session. It is not built for the kind of legible, comparable, forkable counterfactuals I have been chasing in the simulator games I love. Different product, different job. The combat-encounters table that the [drug-wars-1984 scene engine](https://github.com/framersai/wilds-ai/blob/master/packages/wilds-games/src/curated/drug-wars-1984/scenes/combat-encounters.ts) ships, the [boxing combat resolver](https://github.com/framersai/wilds-ai/blob/master/packages/wilds-games/src/curated/boxing/combat.ts), the campaign-fantasy quest scenes, all of those are scripted and resolvable inside the live game. The NPC that ghosted me wasn't on that path. It was an emergent moment with no replay button.

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

<img src="/img/blog/paracosm/branches-poster.jpg" alt="Paracosm dashboard Branches view: every fork point in a multi-leader run, color-coded by leader, where the same scenario produced a different action." style="width:100%;border-radius:8px;margin:1.5rem 0;" />

The image above is the dashboard's Branches view. Every fork point in a multi-leader run, color-coded by leader, where the same scenario produced a different action.

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

const cautious = await wm.simulate(
  {
    name: 'Atlas',
    archetype: 'The Engineer',
    unit: 'AI Lab Council',
    hexaco: { openness: 0.3, conscientiousness: 0.9, extraversion: 0.45, agreeableness: 0.55, emotionality: 0.4, honestyHumility: 0.7 },
    instructions: '',
  },
  { maxTurns: 6, seed: 42, captureSnapshots: true },
);

const ambitious = await wm.fork(cautious, 3, {
  name: 'Maria',
  archetype: 'The Visionary',
  hexaco: { openness: 0.95, conscientiousness: 0.35, extraversion: 0.85, agreeableness: 0.55, emotionality: 0.3, honestyHumility: 0.65 },
});

console.log(cautious.finalState?.metrics, ambitious.finalState?.metrics);
```

Two leaders, same kernel, same seed, divergence forks at turn three. The artifact records both trajectories. The dashboard at [paracosm.agentos.sh/sim](https://paracosm.agentos.sh/sim) does the same thing without writing code, and the full API reference is at [paracosm.agentos.sh/docs](https://paracosm.agentos.sh/docs). A six-turn run on a small scenario with default settings costs in the low tens of cents. The artifact records every token.

## What you can do with it

Three honest use cases. I have tested all of them.

**Decision support and digital twins for real life.** Type a scenario about a decision you actually have to make. A career switch with a deadline and three departments of input. A clinical-trial protocol decision. A pricing change for a product you ship. Paracosm compiles the scenario, runs three AI commanders with different HEXACO profiles, and shows you what each personality does to the trajectory. It is not a fortune teller. It is a counterfactual generator. You read the trajectories side by side and you get something back that is not "what GPT thinks." It is "what three different personalities consistently optimize for, and what each one breaks when they over-optimize." Lukas Kirfel's group at UCL published [a paper in *AI and Ethics*](https://link.springer.com/article/10.1007/s43681-025-00718-4) on counterfactual world simulation as a moral reasoning aid. The argument is that imagining counterfactuals is part of how humans make difficult decisions and an LLM that only gives one answer is a worse adviser than one that helps you enumerate the alternatives.

**Game and game-engine experiments.** The wilds-games package ships actual scenes. Paracosm runs scenarios against them. You can use Paracosm as a game engine for designed experiences, or as a simulator that watches your existing game's world unfold under different leader personalities. The "is this game fair under HEXACO=high-emotionality" question is now testable. The "would a min-maxer or a pacifist produce a more interesting trajectory in this campaign" question is now testable. I have run both. The trajectories are not the same.

**Watching simulations come to life.** This is the one I did not expect to like as much as I do. The dashboard at [paracosm.agentos.sh/sim](https://paracosm.agentos.sh/sim) renders the run as a live cell grid (VIZ tab), a department-by-department divergence overlay, a tour of the constellation, a full Reports breakdown with citations. There is a Library of past runs. There is a Replay button on every saved session. You can fork a run at any turn and rerun it with a different leader. It is the closest thing I have to playing Crusader Kings as a researcher.

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

## FAQ

**Is Paracosm a digital twin?** It can be used as one. The `batch-trajectory` mode is specifically the digital-twin shape: real-world entity, labeled timepoints, counterfactual interventions. But Paracosm is broader; civilization simulations and one-shot forecasts also live in the artifact.

**How does Paracosm relate to agent-based modeling?** Classical ABM tooling (Mesa, NetLogo, MASON, AnyLogic, ABIDES) is rule-based or statistical, generally non-LLM. Paracosm uses LLMs for event generation and specialist reasoning while keeping a deterministic kernel for state transitions. The bridge literature is the [Nature HSSC 2024 survey](https://www.nature.com/articles/s41599-024-03611-3) and MIT Media Lab's [*On the Limits of Agency in Agent-Based Models*](https://arxiv.org/abs/2409.10568).

**Can Paracosm replace Sora-style world models?** No. Different jobs. Sora-class models generate perceptual continuations; Paracosm enumerates actionable possibilities. You can run them together (Sora rendering the look of a Paracosm run, for example) but they do not substitute.

**Is Paracosm a physics simulator?** No. The kernel applies symbolic state transitions. No fluid dynamics, no rigid-body mechanics, no chemistry engine. If you need physics, use a physics simulator and feed Paracosm the resulting state through `ScenarioPackage` updates.

**What is different about Paracosm vs MiroFish or OASIS?** Direction (top-down vs bottom-up), scale (~100 vs 1k-1M agents), determinism (seeded vs emergent). Useful for different jobs.

**What is the cost of a typical run?** A six-turn run on a small scenario with default settings runs in the low tens of cents. The artifact records every token spend. Reuse of forged tools after turn three is the largest cost lever.

**Does Paracosm need an internet connection?** Yes, for research grounding (web search) and for the LLM calls. Offline mode falls back to LLM-only event generation without research citations; the artifact records this so runs are auditable for whether they were grounded.

**Is Paracosm open source?** Apache 2.0. Code at [github.com/framersai/paracosm](https://github.com/framersai/paracosm). Built on AgentOS ([github.com/framersai/agentos](https://github.com/framersai/agentos)), also Apache 2.0.

**Where do I start?** With the live demo. If ten minutes there gives you the model you want, install the package and run a turn loop. If it does not, this isn't the tool for your job.

## Where this is going

The roadmap is short. More built-in scenarios. More leader presets. A team-workspace surface for shared runs. Better fork-and-compare ergonomics in the VIZ tab. The Q3 2026 hosted dashboard with team workspaces, fleet orchestration, and a full analytics suite. Early-access waitlist on the [landing page](https://paracosm.agentos.sh).

The longer roadmap is more interesting. I think structured world models become the substrate for a class of AI tools that do not exist yet. Decision support that enumerates counterfactuals instead of giving one confident answer. Digital twins of teams, products, lives. Game engines where the simulation is the gameplay. Research environments where a hypothesis is run as a hundred forked simulations and the divergence is the result. The ACM-CSUR survey calls these "understanding-world models." They are the second kind of world model. The kind that does not need pixels. The kind that needs to be legible enough for a human to learn from.

The NPC that ran away from me in wilds.ai was the first time I had a system make a decision I could not have predicted and could not learn from. Paracosm is the second time. The difference is the second time I get the trajectory.

Try it. [paracosm.agentos.sh/sim](https://paracosm.agentos.sh/sim). Type a what-if. Run three actors. See what diverges.

If you make something interesting, send it. team@frame.dev or [@johnnydunn on X](https://x.com/johnnydunn). The waitlist is at the bottom of [paracosm.agentos.sh](https://paracosm.agentos.sh) for the Q3 hosted dashboard.

Same world. Same kernel. Same seed. Divergent futures.

---

## Links

- Code: [github.com/framersai/paracosm](https://github.com/framersai/paracosm) (Apache-2.0, TypeScript, `npm install paracosm`)
- Live demo: [paracosm.agentos.sh/sim](https://paracosm.agentos.sh/sim)
- API reference: [paracosm.agentos.sh/docs](https://paracosm.agentos.sh/docs)
- Mars Genesis case study: [Inside Mars Genesis](/en/blog/inside-mars-genesis-ai-colony-simulation/)
- Underlying runtime: [github.com/framersai/agentos](https://github.com/framersai/agentos) (Apache-2.0)
- Benchmark methodology: [framersai/agentos-bench](https://github.com/framersai/agentos-bench)
- wilds.ai (the AI companion product where the NPC ran away): [wilds.ai](https://wilds.ai)

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
