---
title: "Agent Swarm Simulation for Structured World Modeling with LLMs: What Paracosm Is"
date: "2026-04-30"
featured: true
excerpt: "Paracosm runs a top-down agent swarm: one HEXACO-typed leader, five specialist departments, ~100 personality-typed cells, inside a structured, deterministic, forkable world model. The artifact is JSON, not pixels. Reproducible, grounded in research, built on AgentOS."
author: "AgentOS Team"
category: "Engineering"
audience: "evaluator"
image: "/img/blog/paracosm/paracosm-2026-overview-hero.png"
keywords: "agent swarm, agent swarm simulation, multi-agent simulation, structured world model, world model for AI agents, world modeling, LLM world model, paracosm, prompt to simulation, multi-agent simulation typescript, HEXACO simulation, deterministic kernel, node:vm sandbox, agentos paracosm, Mars Genesis simulation, civilization simulation AI, agent-based modeling LLM, JEPA, AMI Labs, Sora, Genie 3, Marble"
---

> "It's a poor sort of memory that only works backwards."
>
> — *Alice in Wonderland*, the Queen, 1865

The phrase "world model" in 2026 means two different things, and the people who use it most rarely specify which. Half are talking about Sora, Genie 3, Marble: text-to-video, text-to-3D, real-time interactive scenes. The other half are talking about the academic sense, the one that pre-dates LLMs by decades: an internal simulator an agent uses to imagine future states before acting. Both meanings are legitimate. They share a name and almost nothing else.

Paracosm is the second kind. The rest of this post is the long version of that sentence. If you only want the demo it's at [paracosm.agentos.sh/sim](https://paracosm.agentos.sh/sim) and the package is `npm install paracosm`. The API reference is at [paracosm.agentos.sh/docs](https://paracosm.agentos.sh/docs). What's below is for people deciding whether the project is doing something useful for them.

## Two world models

The first meaning is generative and visual. [Sora](https://openai.com/sora) [^1] makes video. Google DeepMind's [Genie 3](https://deepmind.google/discover/blog/genie-3/) [^2] renders interactive 3D environments at 24 fps that stay coherent for a few minutes. Fei-Fei Li's [World Labs Marble](https://techcrunch.com/2025/11/12/fei-fei-lis-world-labs-speeds-up-the-world-model-race-with-marble-its-first-commercial-product/) [^3] generates persistent 3D scenes you can download and edit. These tools are evaluated on visual fidelity and physical plausibility. Filmmakers, 3D artists, and embodied-AI labs are the customers. Yann LeCun's AMI Labs [raised $1.03B in March 2026 at a $3.5B valuation](https://techcrunch.com/2026/03/09/yann-lecuns-ami-labs-raises-1-03-billion-to-build-world-models/) [^4] to do something adjacent: a [JEPA-based, non-LLM world model](https://www.technologyreview.com/2026/01/22/1131661/yann-lecuns-new-venture-ami-labs/) [^5] trained on sensor and video streams. Most of the funding and most of the press coverage live in this column.

The second meaning is academic and quieter. Eric Xing's [*Critiques of World Models*](https://arxiv.org/abs/2507.05169) [^6] reframes a world model as *an internal simulator an agent uses to imagine future states before acting*. No pixels. The job is to enumerate actionable possibilities so a decision can be made. The Tsinghua FIB Lab's [*Understanding World or Predicting Future?*](https://dl.acm.org/doi/full/10.1145/3746449) (ACM Computing Surveys 2025) [^7] formalizes the split: *understanding-world* models simulate counterfactuals for planning; *predicting-future* models generate perceptual continuations. Different jobs, different customers, same name.

Paracosm sits firmly on the understanding-world side. The reason it matters operationally is that planning agents need a substrate they can interrogate, not a video they can watch. [Yang et al's *Evaluating World Models with LLM for Decision Making*](https://openreview.net/pdf?id=XmYCERErcD) (ICLR 2025, [arXiv:2411.08794](https://arxiv.org/abs/2411.08794)) [^8] breaks the substrate into three measurable tasks: **policy verification** (does this plan work?), **action proposal** (what should I do next?), and **policy planning** (full plan synthesis). Across 31 environments they find GPT-4o-class models can already do the first two. Long-horizon planning is where the field is still struggling. A structured world model doesn't have to do all three to be useful; it has to give a planner (or a person) somewhere to ask *what if* and get a typed answer back.

The lineage of the second meaning runs through [Schmidhuber and Ha's 2018 *World Models* paper](https://arxiv.org/abs/1803.10122) [^9], classical reinforcement learning, and model-based control theory. It also runs through Borges, who wrote the design spec in 1941 without knowing it.

> "The Garden of Forking Paths is an enormous riddle, or parable, whose theme is time… He believed in an infinite series of times, in a growing, dizzying net of divergent, convergent and parallel times. This network of times which approached one another, forked, broke off, or were unaware of one another for centuries, embraces all possibilities of time."
>
> — Borges, *The Garden of Forking Paths*, 1941

A counterfactual simulator builds that network. Fork at any past turn, change one variable, see where the new branch ends up. Borges had the literary frame; the math is more recent; the engineering is a TypeScript package you can install today.

## What Paracosm actually is

Four inputs, one artifact:

```
prompt or brief or URL
                    ↓
              ScenarioPackage (Zod-validated JSON)
                    ↓
        + HEXACO leader profile
        + deterministic seed
        + agent roster (kernel-generated)
                    ↓
              Turn loop
              ├─ Mulberry32 PRNG drives state
              ├─ LLM generates events + specialist analyses
              ├─ Specialists may forge new TypeScript tools
              ├─ Hardened node:vm sandbox runs forged tools
              ├─ LLM judge approves forged tools before re-use
              └─ Kernel applies consequences; personalities drift
                    ↓
              RunArtifact (one schema, three modes)
```

The artifact is a Zod-validated JSON object. Every leader decision, every specialist note, every forge attempt (approved or rejected), every metric movement, every citation, every token. It exports cleanly to JSON Schema and from there to Python types via `datamodel-codegen`, so non-TypeScript consumers can read it.

Three modes share the same artifact:

- **`turn-loop`**: a multi-turn civilization simulation. Mars Genesis is the canonical example.
- **`batch-trajectory`**: digital-twin shape, labeled timepoints across a horizon. Useful when there's a real-world entity (a customer cohort, a product launch, a policy change) and you want to forecast its evolution under different interventions.
- **`batch-point`**: one-shot Monte-Carlo sweeps across N scenarios × M leaders for fast forecasting when the inner trajectory doesn't matter.

`turn-loop` came first. The other two followed because the artifact happened to be general enough to cover them.

## How a turn runs

The turn loop is the only piece of Paracosm that's interesting at the engineering level. Everything else is plumbing.

1. **State snapshot.** The kernel reads the current `ScenarioPackage` state: five JSON bags called `metrics`, `capacities`, `statuses`, `politics`, `environment`. No hidden fields. The shape *is* the API.
2. **Event generation.** An LLM is prompted with the state and the leader's HEXACO profile and proposes plausible events for this turn. Crucially the LLM doesn't just imagine; it consults research via AgentOS's `WebSearchService` (Firecrawl + Tavily + Serper + Brave in parallel, Cohere `rerank-v3.5` reranking on top). DOI-linked citations propagate into the artifact. Without research grounding, events drift toward LLM cliché.
3. **Specialist analyses.** Each specialist agent (economist, scientist, security officer) writes a short analysis given the events and the leader's profile. Specialists have personalities. They disagree.
4. **Tool forging.** A specialist may decide the next decision needs a tool that doesn't exist yet. They write a TypeScript function with a Zod-validated input/output schema and submit it. A forged tool from an actual run looks like `compute_resource_allocation_under_drought_constraint(state) → priorityList`.
5. **Sandbox execution.** Approved tools run in a hardened `node:vm` sandbox with a 5-second default wall clock and a 128 MB nominal memory budget (heap-delta heuristic, not preemptively enforced; preemptive limits via `isolated-vm` are queued for the hosted multi-tenant tier). The sandbox always bans `eval`, `Function`, `require`, dynamic `import`, `process`, `child_process`, and destructive `fs.*`. `fetch`, `fs.readFile`, and `crypto` are opt-in via allowlist; the default allowlist is empty, so by default a forged tool has no network, no filesystem, no crypto.
6. **LLM judge.** A separate LLM call examines each forged tool's output against the specialist's stated intent. Match approves it for inclusion in the decision context and adds it to a discoverable index for future turns. Mismatch rejects it. Reuse via `call_forged_tool(name, args)` costs tens of tokens; a fresh forge costs full LLM tokens for the proposal, body, test scaffolding, and judge. After turn three of a typical run most decisions invoke at least one previously-forged tool, and total run cost flattens.
7. **Decision.** The leader, equipped with events, analyses, and forged tools, makes a turn decision: an action category, a parameter set, a stated rationale, a confidence score.
8. **Kernel apply.** The kernel applies the decision's effects. Resources move. Statuses change. Agents are promoted, demoted, or lost.
9. **Personality drift.** Three forces apply: **leader-pull** (a leader's traits influence the agents who report to them), **role-activation** (an agent's role nudges their traits over time, a security officer drifts toward Conscientiousness), **outcome-reinforcement** (success reinforces the traits that produced it). The commander drifts alongside the agents.
10. **Artifact append.** Everything from this turn is appended to the `RunArtifact`. Next turn begins.

The clever parts (research grounding, tool forging, personality drift) exist because the simulation without them tells boring stories.

<img src="/img/blog/paracosm/branches-poster.jpg" alt="Paracosm dashboard Branches view: every fork point in a multi-leader run, color-coded by leader, where the same scenario produced a different action." style="width:100%;border-radius:8px;margin:1.5rem 0;" />

The video above is the dashboard's Branches view. Every fork point in a multi-leader run, color-coded by leader, where the same scenario produced a different action.

## Mars Genesis

The reference scenario is Mars Genesis: thirty colonists, six turns, two leaders chosen to differ on a single HEXACO axis, identical seed.

Atlas is the high-Conscientiousness, low-Openness archetype. Maria is the high-Openness, lower-Conscientiousness one. Atlas optimizes for survival; Maria optimizes for discovery. Both colonies face the same kernel-generated weather, the same opening resource pool, the same agent roster, the same seed.

By turn three the runs diverge. Atlas builds a redundant water reclamation pipeline. Maria funds an exobiology survey of a thermal anomaly her science specialist argued for. By turn five Atlas has a deployable lifeboat protocol; Maria has four named lichen-analog species and a paper draft. Both colonies are alive at turn six. They've spent comparable token counts. The artifact records the entire trajectory of both runs.

This isn't an if-then ruleset. The kernel doesn't know the difference between Atlas and Maria. The LLM events are seeded but not predetermined. The divergence emerges because the leaders' HEXACO profiles bias which specialists they listen to, which forged tools their specialists propose, and which decisions they sign off on. Personality is a real variable. The kernel measures what diverges.

<video autoplay loop muted playsinline controls preload="metadata" poster="/img/blog/paracosm/digital-twin-atlas-lab-poster.jpg" style="width:100%;border-radius:8px;margin:1.5rem 0;">
  <source src="/img/blog/paracosm/digital-twin-atlas-lab-hero.mp4" type="video/mp4">
</video>

The full Atlas walkthrough is the video above. The case-study post, [Inside Mars Genesis](/blog/inside-mars-genesis-ai-colony-simulation), has the per-turn breakdown.

## HEXACO is the leverage

Six factors: Honesty-Humility, Emotionality, Extraversion, Agreeableness, Conscientiousness, Openness. Lee and Ashton introduced HEXACO in their 2007 *Personality and Social Psychology Review* paper ([doi:10.1177/1088868306294907](https://doi.org/10.1177/1088868306294907)) [^10] as a six-factor extension of the Big Five, with Honesty-Humility split out as a separate axis because the data demanded it.

There's nothing magical about HEXACO. It's a measurement framework with extensive cross-cultural validation. Paracosm uses it because, after trying the alternatives, it's the smallest set of dimensions that produces visibly distinct simulator behavior. The Big Five works almost as well. The Big Five plus an honesty axis works better. HEXACO is the sweet spot of expressive-without-being-overfit.

Two things to note. First, HEXACO is *opt-in*. Many Paracosm scenarios (most of `batch-point`) don't touch personality at all. You can simulate a financial market without giving the market a Big Six profile. Second, when personality is on it doesn't act through prompt injection alone. Personality biases which specialists get consulted, which decisions get accepted, which tools get forged. The drift mechanism (leader-pull, role-activation, outcome-reinforcement) is encoded in the kernel, not in a prompt. Prompt-only personality dissolves under context pressure. Kernel-encoded personality survives.

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

Reuse turned out to be the largest cost lever in the system, which we didn't predict. We designed for forge-on-demand and assumed reuse would be a nice-to-have.

<video autoplay loop muted playsinline controls preload="metadata" poster="/img/blog/paracosm/digital-twin-maria-poster.jpg" style="width:100%;border-radius:8px;margin:1.5rem 0;">
  <source src="/img/blog/paracosm/digital-twin-maria-hero.mp4" type="video/mp4">
</video>

The Maria scenario above shows the discovery-bias path. She forges more tools because she takes more risks; she also discovers more reusable patterns, so her per-turn cost falls faster than Atlas's after turn four. The artifact records this. The dashboard renders it. The economics are visible to the user, not hidden in a metering API.

## Run a simulation in five minutes

```bash
npm install paracosm
```

```ts
import { WorldModel } from 'paracosm/world-model';

const wm = await WorldModel.fromPrompt({
  seedText: 'A coastal fishing town facing a regulatory shock that bans certain net types.',
}, { provider: 'anthropic' });

const atlas = await wm.simulate(
  {
    name: 'Atlas',
    archetype: 'The Engineer',
    unit: 'Town Council',
    hexaco: { openness: 0.3, conscientiousness: 0.9, extraversion: 0.45, agreeableness: 0.55, emotionality: 0.4, honestyHumility: 0.7 },
    instructions: '',
  },
  { maxTurns: 6, seed: 42 },
);

const maria = await wm.simulate(
  {
    name: 'Maria',
    archetype: 'The Visionary',
    unit: 'Town Council',
    hexaco: { openness: 0.95, conscientiousness: 0.35, extraversion: 0.85, agreeableness: 0.55, emotionality: 0.3, honestyHumility: 0.65 },
    instructions: '',
  },
  { maxTurns: 6, seed: 42 }, // same seed, different leader
);

console.log(atlas.finalState?.metrics, maria.finalState?.metrics);
```

This runs locally. A six-turn run with default specialists, default reranker, and default reader on a small scenario costs in the low tens of cents. The dashboard at [paracosm.agentos.sh/sim](https://paracosm.agentos.sh/sim) does the same thing without writing code, and the full API reference is at [paracosm.agentos.sh/docs](https://paracosm.agentos.sh/docs).

Inspecting the agent swarm afterward:

```ts
import { getSwarm, swarmByDepartment, moodHistogram } from 'paracosm/swarm';

const swarm = getSwarm(atlas);
if (swarm) {
  console.log(`T${swarm.turn} · ${swarm.population} alive`);
  console.log(swarmByDepartment(atlas));    // org chart by dept
  console.log(moodHistogram(swarm));        // { focused: 12, anxious: 5, ... }
}
```

Same data is on `RunArtifact.finalSwarm` directly, available via `WorldModel.swarm(atlas)`, and exposed at `GET /api/v1/runs/:runId/swarm` for HTTP consumers. The dashboard's living-swarm grid streams the same shape per-turn via SSE for live visualization.

## What Paracosm isn't

**Not a pixel generator.** Sora, Genie 3, World Labs Marble do that. Paracosm's output is a structured `RunArtifact`. There are diagrams in the dashboard, but they're renderings of the artifact, not the artifact.

**Not a trained model.** AMI Labs, V-JEPA, I-JEPA train weights. Paracosm uses existing frontier LLMs (configurable per run) plus existing embeddings and rerankers. No model weights produced.

**Not a replacement for real-world data.** A counterfactual simulator is a tool for thinking, not for forecasting in the strong sense. Every decision has a `confidence` score, every metric has a `derivedFrom` trace, every citation has a DOI when one exists. Treat a Paracosm run as ground truth at your own risk; the artifact is structured to make that harder than it would otherwise be.

**A top-down agent swarm, not a bottom-up emergent one.** [OASIS](https://openreview.net/forum?id=JBzTculaVV) [^11] and [MiroFish](https://github.com/666ghj/MiroFish) [^12] operate at 1k to 1M agents and do bottom-up emergent prediction; the swarm dynamics are the output. Paracosm runs a directed agent swarm: 1 commander, 5 specialist departments, ~100 personality-typed cells, and the trajectory is deterministic per seed. The cell population is rich (HEXACO traits, mood, family edges, persistent memory), but the cells react to leader decisions rather than acting autonomously. Both shapes are valid agent swarm architectures; paracosm's lane is the directed, replayable, decision-support side. The [Inside Mars Genesis](/en/blog/inside-mars-genesis-ai-colony-simulation/) has the engineering breakdown.

**Not a multi-agent task framework.** LangGraph, AutoGen, CrewAI, OpenAI Agents SDK, Mastra: those execute real tasks against real APIs. Their output reaches the world. Paracosm's output stays inside the simulation. Zero overlap on user job-to-be-done.

**Forging is not magic.** Forged tools fail. The judge rejects a meaningful fraction. The 128 MB / 5 s sandbox kills tools that try to do too much. The artifact records every forge attempt including the failed ones, on the theory that transparency is more valuable than a higher reported success rate.

## Where the field is in April 2026

Three threads of recent literature triangulate the structured world model category and explain why Paracosm exists in its current shape.

**Counterfactual semantics for LLM agents are getting formal.** Kirfel, Manktelow, and Lagnado's [*Counterfactual World Simulation Models*](https://link.springer.com/article/10.1007/s43681-025-00718-4) (*AI and Ethics*, 2025) [^13] is the philosophical foundation: a CWSM replays an event with one variable changed and surfaces the effect, with explicit ethical guardrails around how the result gets used. [*Integrating Counterfactual Simulations with Language Models*](https://arxiv.org/abs/2505.17801) (May 2025) [^14] introduces AXIS, an LLM-driven framework that interrogates a simulator with `whatif` and `remove` prompts to explain multi-agent policies. AXIS is roughly the API a downstream tool would call against a Paracosm `RunArtifact`. The artifact already exposes the right shape for it.

**Generative ABM is getting critical scrutiny.** The 2025 Springer review [*Validation is the central challenge for generative social simulation: a critical review of LLMs in agent-based modeling*](https://link.springer.com/article/10.1007/s10462-025-11412-6) [^15] makes the case bluntly: LLMs revive interest in agent-based models by enabling expressive generative agents, but stochasticity, cultural bias, and black-box behavior make calibration and validation harder than they were under classical (Mesa, NetLogo, MASON, ABIDES, AnyLogic) tooling. The [Nature HSSC 2024 survey on LLM-empowered ABM](https://www.nature.com/articles/s41599-024-03611-3) [^16] is the broader companion. [AgentSociety (SSRN 2026)](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5954414) [^17] and [WarAgent](https://github.com/agiresearch/WarAgent) [^18] are concrete examples at the population end. Paracosm runs ~100-agent civilizations specifically because the calibration problem is tractable at that scale and intractable at the millions-of-agents end.

**Agents are not yet good at using world models as tools.** [*Current Agents Fail to Leverage World Model as Tool for Foresight*](https://arxiv.org/html/2601.03905) (January 2026) [^19] finds that LLM agents often don't invoke world-model tools even when doing so would improve foresight, and when they do, they tend to misuse them: generating one deterministic future, overriding the simulation with their own internal reasoning, or skipping the counterfactual branches. That paper describes the failure mode a structured world model has to engineer against. Paracosm's answer is to keep the kernel deterministic, return the artifact in a typed shape that resists the "I bet the future is X" override, and surface fork-vs-trunk divergence visibly in the dashboard so a single-trajectory claim is harder to make.

The throughline: if the simulator hides its assumptions, an LLM agent will paper over the rest. A structured world model has to externalize the world into schema, citations, tools, snapshots, and seeded transitions, then let the LLM reason over that structure.

The [LLM Agents Papers tracker](https://github.com/AGI-Edgerunners/LLM-Agents-Papers) [^20] and the [Awesome World Models reading list](https://github.com/leofan90/Awesome-World-Models) [^21] are the two community-maintained lists worth bookmarking if you want to follow this from the outside.

## Where to go next

- The live demo at [paracosm.agentos.sh/sim](https://paracosm.agentos.sh/sim). One-click Mars Genesis run, no install.
- The package: `npm install paracosm`. Engine, compiler, dashboard, Mars Genesis + Lunar Outpost as built-in scenarios.
- The full API reference at [paracosm.agentos.sh/docs](https://paracosm.agentos.sh/docs).
- The Mars Genesis case study at [Inside Mars Genesis](/blog/inside-mars-genesis-ai-colony-simulation) for the per-turn narrative breakdown.
- The Mars Genesis case study at [Inside Mars Genesis](/en/blog/inside-mars-genesis-ai-colony-simulation/) for the head-to-head against bottom-up swarms.
- The repo at [github.com/framersai/paracosm](https://github.com/framersai/paracosm).
- The benchmark methodology at [framersai/agentos-bench](https://github.com/framersai/agentos-bench).

## FAQ

**Is Paracosm a digital twin?** It can be used as one. The `batch-trajectory` mode is specifically the digital-twin shape: real-world entity, labeled timepoints, counterfactual interventions. But Paracosm is broader: civilization simulations and one-shot forecasts also live in the artifact.

**How does Paracosm relate to agent-based modeling?** Classical ABM tooling (Mesa, NetLogo, MASON, AnyLogic, ABIDES) is rule-based or statistical, generally non-LLM. Paracosm uses LLMs for event generation and specialist reasoning while keeping a deterministic kernel for state transitions. The bridge literature is the [Nature HSSC 2024 survey on LLM-empowered ABM](https://www.nature.com/articles/s41599-024-03611-3) [^16] and MIT Media Lab's [*On the Limits of Agency in Agent-Based Models*](https://arxiv.org/abs/2409.10568) [^22].

**Can Paracosm replace Sora-style world models?** No. Different jobs. Sora-class models generate perceptual continuations; Paracosm enumerates actionable possibilities. You can run them together (Sora rendering the look of a Paracosm run, for example) but they don't substitute.

**Is Paracosm a physics simulator?** No. The kernel applies symbolic state transitions. No fluid dynamics, no rigid-body mechanics, no chemistry engine. If you need physics, use a physics simulator and feed Paracosm the resulting state through `ScenarioPackage` updates.

**What's different about Paracosm vs MiroFish or OASIS?** Direction (top-down vs bottom-up), scale (~100 vs 1k–1M agents), determinism (seeded vs emergent). Useful for different jobs.

**What's the cost of a typical run?** A six-turn `turn-loop` run on a small scenario with default settings runs in the low tens of cents. The artifact records every token spend. Reuse of forged tools after turn three is the largest cost lever.

**Does Paracosm need an internet connection?** Yes, for research grounding (web search) and for the LLM calls. Offline mode falls back to LLM-only event generation without research citations; the artifact records this so runs are auditable for whether they were grounded.

**Is Paracosm open source?** Apache 2.0. Code at [github.com/framersai/paracosm](https://github.com/framersai/paracosm). Built on AgentOS ([github.com/framersai/agentos](https://github.com/framersai/agentos)), also Apache 2.0.

**Where do I start?** With the live demo. If ten minutes there gives you the model you want, install the package and run a turn loop. If it doesn't, this isn't the tool for your job.

---

The structured-world-model category isn't one that markets itself. The visual side gets the funding, the press coverage, and the watercooler conversation. The other side (the one Eric Xing reframed in 2025, the one Borges anticipated in 1941, the one that lets an agent ask *what if* and get a typed answer back) is what Paracosm is for.

Full API reference: [paracosm.agentos.sh/docs](https://paracosm.agentos.sh/docs).

---

## References

[^1]: OpenAI. (2024). *Sora.* — Text-to-video generative model. <https://openai.com/sora>

[^2]: Google DeepMind. (2025). *Genie 3: A new frontier for world models.* — Real-time interactive 3D environment generation at 24 fps. <https://deepmind.google/discover/blog/genie-3/>

[^3]: TechCrunch. (2025, November 12). *Fei-Fei Li's World Labs speeds up the world model race with Marble, its first commercial product.* <https://techcrunch.com/2025/11/12/fei-fei-lis-world-labs-speeds-up-the-world-model-race-with-marble-its-first-commercial-product/>

[^4]: TechCrunch. (2026, March 9). *Yann LeCun's AMI Labs raises $1.03 billion to build world models.* <https://techcrunch.com/2026/03/09/yann-lecuns-ami-labs-raises-1-03-billion-to-build-world-models/>

[^5]: MIT Technology Review. (2026, January 22). *Yann LeCun's new venture: AMI Labs.* — Coverage of the JEPA-based, non-LLM world-model approach. <https://www.technologyreview.com/2026/01/22/1131661/yann-lecuns-new-venture-ami-labs/>

[^6]: Xing, E. P., et al. (2025). *Critiques of World Models.* arXiv preprint. <https://arxiv.org/abs/2507.05169>

[^7]: Tsinghua FIB Lab. (2025). *Understanding World or Predicting Future? A comprehensive survey of world models.* ACM Computing Surveys 2025. <https://dl.acm.org/doi/full/10.1145/3746449>

[^8]: Yang, Z., et al. (2025). *Evaluating World Models with LLM for Decision Making.* ICLR 2025. <https://openreview.net/pdf?id=XmYCERErcD> · arXiv: <https://arxiv.org/abs/2411.08794>

[^9]: Ha, D., & Schmidhuber, J. (2018). *World Models.* arXiv preprint. <https://arxiv.org/abs/1803.10122>

[^10]: Lee, K., & Ashton, M. C. (2007). *Empirical, theoretical, and practical advantages of the HEXACO model of personality structure.* *Personality and Social Psychology Review*, 11(2), 150–166. <https://doi.org/10.1177/1088868306294907>

[^11]: Yang, X., et al. *OASIS: Open agent-based social simulation of LLM-driven population-scale interactions.* OpenReview. <https://openreview.net/forum?id=JBzTculaVV>

[^12]: agiresearch / 666ghj. *MiroFish: Bottom-up multi-agent simulation framework.* GitHub. <https://github.com/666ghj/MiroFish>

[^13]: Kirfel, L., Manktelow, K., & Lagnado, D. (2025). *Counterfactual World Simulation Models.* *AI and Ethics*. <https://link.springer.com/article/10.1007/s43681-025-00718-4>

[^14]: Anonymous. (2025, May). *Integrating Counterfactual Simulations with Language Models (AXIS).* arXiv preprint. <https://arxiv.org/abs/2505.17801>

[^15]: Anonymous. (2025). *Validation is the central challenge for generative social simulation: a critical review of LLMs in agent-based modeling.* Springer (Artificial Intelligence Review). <https://link.springer.com/article/10.1007/s10462-025-11412-6>

[^16]: Anonymous. (2024). *LLM-empowered agent-based modeling: A comprehensive survey.* *Humanities and Social Sciences Communications* (Nature). <https://www.nature.com/articles/s41599-024-03611-3>

[^17]: Anonymous. (2026). *AgentSociety: Population-scale LLM-driven agent simulation.* SSRN preprint. <https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5954414>

[^18]: agiresearch. *WarAgent: Multi-agent LLM simulation of geopolitical conflict.* GitHub. <https://github.com/agiresearch/WarAgent>

[^19]: Anonymous. (2026, January). *Current Agents Fail to Leverage World Model as Tool for Foresight.* arXiv preprint. <https://arxiv.org/html/2601.03905>

[^20]: AGI Edgerunners. *LLM Agents Papers — community-maintained reading list.* GitHub. <https://github.com/AGI-Edgerunners/LLM-Agents-Papers>

[^21]: leofan90. *Awesome World Models — community-maintained reading list.* GitHub. <https://github.com/leofan90/Awesome-World-Models>

[^22]: MIT Media Lab. (2024). *On the Limits of Agency in Agent-Based Models.* arXiv preprint. <https://arxiv.org/abs/2409.10568>
