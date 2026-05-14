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

The phrase "world model" in 2026 means two completely different things, which is why half the conversations about it are people talking past each other. The Tsinghua FIB Lab's [*Understanding World or Predicting Future?*](https://dl.acm.org/doi/full/10.1145/3746449) (ACM Computing Surveys, 2025) names the split *understanding-world* vs *predicting-future*. Different jobs, different customers, same name.

**Understanding-world models** enumerate actionable possibilities so a decision can be made. This is the older meaning, the one [Ha and Schmidhuber's 2018 paper](https://arxiv.org/abs/1803.10122) gave the field its name with: an internal simulator an agent uses to imagine future states before acting. No pixels required, no video. The lane has three working sub-lineages, and the popular discourse keeps missing the first two.

- **Learned latent-dynamics models.** Hafner et al's [Dreamer line](https://danijar.com/project/dreamer/) (V1 2019, V2 2020, V3 2023) predicts dynamics in a learned latent space and trains policies inside the dream rollouts. DeepMind's MuZero (Schrittwieser et al 2020) does the same trick on chess, shogi, Go, and Atari with a learned model instead of hand-coded rules. Yann LeCun's JEPA family (I-JEPA 2023, V-JEPA 2024, V-JEPA 2 2025) is explicitly anti-pixel — the architectural argument is that pixel reconstruction is "wasteful" and prediction should happen at the level of meaning rather than appearance. LeCun's 2022 position paper *A Path Towards Autonomous Machine Intelligence* is the canonical statement. AMI Labs is the institutional continuation. None of this is generative video; none of it is pixels.
- **Physics-based simulators.** [MuJoCo](https://mujoco.org/) (Todorov et al, open-sourced by DeepMind 2021), Brax (Google's JAX-based differentiable physics, 2021), NVIDIA's Isaac Sim / Isaac Lab / Isaac Gym stack, [Genesis](https://genesis-world.readthedocs.io/en/latest/user_guide/overview/why_a_new_simulator.html) (2024-2025, claiming 10-80× speedup over predecessors), DiffTaichi, Sanchez-Gonzalez et al's Graph Network Simulators at DeepMind. The [*Review of Nine Physics Engines for Reinforcement Learning*](https://arxiv.org/html/2407.08590v1) treats these as the substrate for training agent policies. By the strict definition (deterministic, queryable, replayable, action-conditional) these are world models. The robotics community just wasn't labeling them as such publicly until the 2024 generative-video wave forced the field to define its terms.
- **Structured / LLM-based.** Paracosm's lane. Typed JSON state, LLM reasoning lane, deterministic kernel, queryable artifact. The newest sub-lineage; the open-source category is small enough to name every notable project ([AgentSociety](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5954414), [WarAgent](https://github.com/agiresearch/WarAgent), [Stanford Generative Agents](https://arxiv.org/abs/2304.03442) at the population end, [Concordia](https://arxiv.org/abs/2312.03664) at the narrative end, Paracosm at the directed-swarm end).

**Predicting-future models** generate perceptual continuations. This is the newer meaning, the one OpenAI's marketing introduced in February 2024 with [Sora](https://openai.com/sora) and the technical report's "Video generation models as world simulators" framing. Output is pixels. Google DeepMind's [Genie 3](https://deepmind.google/discover/blog/genie-3/) (2025) is closer to a real world model than Sora because it's keyboard-interactive and rolls forward conditional on input. Fei-Fei Li's [World Labs Marble](https://techcrunch.com/2025/11/12/fei-fei-lis-world-labs-speeds-up-the-world-model-race-with-marble-its-first-commercial-product/) generates persistent 3D scenes you can edit. These tools are evaluated on visual fidelity and physical plausibility.

The "world simulator" framing around Sora specifically is disputed by the people who built the older lane. LeCun went [on record on X](https://x.com/ylecun/status/1763354534246592770) calling pixel generation "not only wasteful, it's doomed to failure" as a path to a world model. The peer-reviewed survey [*Is Sora a World Simulator? A Comprehensive Survey on General World Models*](https://arxiv.org/html/2405.03520v1) concludes: "Video generation is not synonymous with world models. While video generation may serve as one manifestation of world models, it does not fully address the..." The cleanest test: ask Sora "what's the probability the truck three lanes over decides to merge?" There's no handle. A diffusion video model that generates plausible-looking frames does not necessarily have a queryable model of what's happening in those frames.

The 2025-2026 surveys are starting to formalize the distinction. Eric Xing's [*Critiques of World Models*](https://arxiv.org/abs/2507.05169) reframes the field around the older meaning. The [*Comprehensive Survey on World Models for Embodied AI*](https://arxiv.org/html/2510.16732v1) (October 2025) maps the embodied side. The [*World Model for Robot Learning* survey](https://arxiv.org/html/2605.00080v1) is explicit: "the resurgence of world models is driven mainly by two lines of progress (Ha and Schmidhuber, 2018): model-based reinforcement learning" — meaning the latent and physics lineages, not the generative video one.

<img src="/img/diagrams/paracosm-world-model-split.svg" alt="Two paths the term 'world model' has taken: understanding-world (latent dynamics, physics simulation, structured/LLM) vs predicting-future (generative video)." style="width:100%;border-radius:8px;margin:1.5rem 0;" />

*The clean split: pixels are what humans watch, typed state is what agents reason inside. Both lanes are legitimate, mostly disjoint customers.*

Paracosm is in the understanding-world lane, structured / LLM sub-lineage. The engine does not generate pixels. It generates a typed scenario contract, a deterministic kernel, research-grounded events that an LLM-as-judge coordinates, and the responses of AI agents with optional HEXACO personality vectors or specific directives that affect what those agents, referred to as `actors`, decide what to do, how to lead the subagents and swarms spawned. The output is JSON, not video. It is reproducible, forkable, replayable, and comparable across actors (leader agents).

Language is what gives rise to legible thinking (Sapir and Whorf), though it may not always involve text and words as we and LLMs know of it.

If you want an agent to imagine a future state and a human to learn from that imagination, the substrate has to be something both can read. Pixels are not that substrate. Typed JSON with named departments, decision logs, and citations is that substrate. The predicting-future lane will absolutely matter for embodied robotics, animation, and film. The latent and physics lineages have been doing the actual world-modeling work for years. The structured / LLM lineage is the newest entrant, and Paracosm sits inside it: an LLM-reasoning lane bolted onto a deterministic kernel that does the same job MuJoCo does for physics, except at the abstract scenario level. Categories that solve different problems; markets that compound rather than substitute.

<aside style="border:1px solid var(--color-border-subtle); border-left:3px solid transparent; border-image:linear-gradient(180deg, hsl(180, 95%, 60%), hsl(270, 85%, 65%)) 1; border-radius:12px; padding:1.5rem 1.75rem; margin:2.5rem 0; background:var(--color-background-secondary); box-shadow:0 1px 3px rgba(0,0,0,0.04), 0 4px 14px rgba(0,0,0,0.06);">

**Paracosm, in one card.**

**paracosm** *(n.)* — a detailed, persistent imaginary world invented and developed in private, often beginning in childhood, with its own geography, history, languages, and inhabitants. The Brontë siblings had Angria and Gondal; C.S. and Warren Lewis had Boxen; Hartley Coleridge had Ejuxria. The term was coined by British researcher Robert Silvey for the phenomenon.

This engine builds one — but for AI agents to inhabit instead of children to develop in private. Hand it a brief, document, or URL; it compiles a typed, deterministic, forkable world; it runs N AI actors through that world from the same seed; every run returns a Zod-validated `RunArtifact`: every event, every decision, every forged tool, every citation, every divergence. Apache-2.0. Built on AgentOS.

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

<img src="/img/diagrams/paracosm-divergence.svg" alt="Same Mars Genesis seed routed through two HEXACO profiles produces divergent trajectories and different final-state metrics: The Visionary ends with a wider toolbox and bolder population growth; The Engineer ends with fewer casualties, fewer tools, and a higher reuse ratio." style="width:100%;border-radius:8px;margin:1.5rem 0;" />

*Mars Genesis on seed 950: the Visionary (high openness, low conscientiousness) and the Engineer (the inverse) start from identical state and produce measurably different colonies. Final population, casualty count, forged-tool count, and reuse ratio all diverge — and the gap compounds turn-over-turn.*

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

<img src="/img/diagrams/paracosm-turn-flow.svg" alt="Per-turn 9-stage flow with two lanes: LLM stages (Event Director, Department Analysis, Commander Decision, Agent Reactions) and deterministic stages (Kernel Advance, Outcome, Effects, Memory, Personality Drift)." style="width:100%;border-radius:8px;margin:1.5rem 0;" />

*Nine stages, two lanes. The deterministic stages replay byte-equal on the same seed; the LLM stages diverge because every prompt carries the leader's HEXACO profile and the accumulated state it shaped.*

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

## What the LLM actually reads each turn

Five LLM calls per turn: Director, Department, Commander, Judge, Reactions. Skeletons below with the variable interpolations called out and a GitHub line link to each builder. Judge prompt sits down in the forging section since it fires inside the department call, not as its own stage.

### The Event Director

[`src/runtime/orchestrator/director.ts:142`](https://github.com/framersai/paracosm/blob/master/src/runtime/orchestrator/director.ts#L142). Decides what happens this turn. Reads kernel state, the leader's HEXACO profile, recent decision history, the agent mood roll-up, the research-bundle topics. Returns one to three events with options.

```text
GENERATE EVENT FOR TURN {turn}, YEAR {time}

SIMULATION STATE:
- Commander: {actorName} ({archetype})
- Population: {alive} alive ({nativeBorn} native-born)
- Recent: +{recentBirths} births, -{recentDeaths} deaths
{stateLines}
{politicsLines}
- Tools forged so far: {toolsForged.length}

COMMANDER PERSONALITY (HEXACO):
O: 0.95 C: 0.35 E: 0.85
A: 0.55 Em: 0.30 HH: 0.65
{trajectoryCue}  // e.g. "openness rose 0.06 over 3 turns"

Use this profile to colour (not determine) the next event. A high-openness
commander should face events that reward novel responses and punish rigid
thinking. A high-conscientiousness commander should face events that reward
procedure and expose improvisation gaps. A high-emotionality commander should
face events that test how their human-impact weighting plays against the math.
Events are not rigged against the commander; they reflect the colony they
shaped. Two commanders with opposing profiles should diverge into genuinely
different pressures by turn 3.

DECISION HISTORY:
  Turn 1: "Landfall" (settlement) -> mixed: Picked Arcadia Planitia for safety...
  Turn 2: "Solar Storm" (radiation) -> success: Sheltered all surface crew...

TOOL INTELLIGENCE (what department agents computed last turn):
  [medical] radiation_dose_calculator: { exposureMSv: 47.3, threshold: 50 }
  [engineering] shielding_compliance: { compliant: true, marginCm: 4.1 }

AGENT MOOD: 65% focused, 22% anxious, 13% determined

KNOWLEDGE BUNDLE TOPICS (use these in researchKeywords for accurate citation
retrieval):
  - radiation shielding regolith
  - mars hab pressurization
  - perchlorate soil contamination
  ...

EVENT CATEGORY (MUST be exactly one of these — the scenario's effects map keys
to these and any other value bypasses metric updates):
  radiation, infrastructure, resource, social, governance, ...

CONSTRAINT: Do NOT use category "radiation" (used last turn). Pick a different
category.

Generate 1 to 3 events for this turn. Each event should feel like a consequence
of what happened before. Return JSON with an "events" array.
```

Two lines in there cost runs to get right.

`Use this profile to colour (not determine) the next event` — without it the Director rigged Visionary runs with high-Openness-friendly events ("a creative breakthrough opportunity arrives") and Engineer with the inverse. Read as caricature, not divergence. Colour-not-determine kept the bias and dropped the rigging.

`MUST be exactly one of these` for the category. Earlier said "prefer". Model picked "founding" and "legacy", which don't exist in the scenario's effects map, silently bypassing every metric update. Three runs of unchanged metrics over six turns before I traced it.

### The Department Analysis

[`src/runtime/orchestrator/departments.ts:17`](https://github.com/framersai/paracosm/blob/master/src/runtime/orchestrator/departments.ts#L17). Every active department gets its own prompt. Dept head's drift-adjusted HEXACO profile at the top, then conditional behavioral cues that fire only when a trait is on a pole. Openness 0.45 gets no forge-vs-reuse cue; Openness 0.95 gets:

```text
Your high openness invites exploration. When this event involves any analysis
the current toolbox does not exactly cover, forge a new tool with a fresh
angle or composed logic. Default to forging; reuse only when an existing tool
produces EXACTLY the analysis you need unchanged.
```

One with Openness 0.20 reads the inverse:

```text
Your low openness favours proven methods. Trust the existing toolbox. Reuse
tools whenever their scope overlaps the current analysis. Forge a new tool
only when an existing one would clearly mislead you on this specific event.
```

Six axes × pole-conditional cues = up to six firing cues per dept head per turn. Full phrasing for each pole at [`departments.ts:38-94`](https://github.com/framersai/paracosm/blob/master/src/runtime/orchestrator/departments.ts#L38-L94). Earlier version listed every axis's high-low guidance unconditionally and asked the model to weight them; dept heads converged on the same forge counts across leaders. Conditional firing is sharper, and a mid-HEXACO dept head produces baseline-neutral reports, which is the right behaviour for that profile.

The full prompt also carries the prior-turn memory (`YOUR PREVIOUS ANALYSES`), the research-grounded canonical facts + counterpoints from the citation bundle, the current colony state line, and a domain-specific block from the scenario's `departmentPromptHook`.

### The Commander Decision

Prompt at [`orchestrator/index.ts:1598`](https://github.com/framersai/paracosm/blob/master/src/runtime/orchestrator/index.ts#L1598-L1615), response schema at [`validators/commander.ts:14`](https://github.com/framersai/paracosm/blob/master/src/runtime/validators/commander.ts#L14-L54). Commander gets the event, dept reports, forged toolbox, kernel state, and a five-step REASONING block to populate in the JSON response before choosing:

```text
TURN {turn} (Event {ei+1}/{total}) — {time}: {event.title}

{event.description}

{trajectoryCue}  // e.g. "Your traits have drifted: openness rose 0.06 over 3 turns"

DEPARTMENT REPORTS:
{summaries}     // each dept's analysis, recommended actions, forged tool outputs

ALREADY-FORGED TOOLS (reusable this turn):
  - radiation_dose_calculator [medical, turn 3]: latest output { exposureMSv: 47.3 }
  - shielding_compliance_scorer [engineering, turn 3]: { compliant: true }
  ...

State: Pop 28 | Morale 62% | Food 4.2mo
{optionText}    // the options from the event
{effectsText}   // available policy effects from dept reports

REASONING — populate the "reasoning" field of your JSON response BEFORE
committing to selectedOptionId. Numbered list, one point per line:
  (1) What does my personality profile push me toward on this call? Name the
      specific trait poles at play.
  (2) Do the department reports converge or conflict? If they conflict, which
      voice do I trust given my profile?
  (3) Which forged-tool outputs in the toolbox above directly inform this
      decision? Cite the numeric output if available.
  (4) What risk am I accepting vs refusing? My rationale must name the
      specific trade.
  (5) Final choice + one-line justification.

Then set selectedOptionId, decision, and rationale. The rationale compresses
the reasoning into a single paragraph for default UI display; the "reasoning"
field stores the full working.
```

Explicit step-by-step CoT isn't novel — standard since [Wei et al. 2022](https://arxiv.org/abs/2201.11903). The lever here is the **ORDER**: `reasoning` is a populated-first Zod field, so the model writes the deliberation before committing to `selectedOptionId`. Closes the post-hoc-rationalization failure mode [Turpin et al. 2023](https://arxiv.org/abs/2305.04388) flagged — model picks an answer for unrelated reasons, then writes a CoT chain that makes it look principled. Schema-ordered CoT forces ink on steps (1)–(4) before step (5).

`reasoning` threads into the artifact. Dashboard renders it behind a "Show full analysis" expand on the decision card, so the audit covers which forged-tool output the commander cited, which dept they overrode, which trait pole they referenced.

Second CoT lever: **schema-guided retry**. The framework's `generateValidatedObject` ([`agentos/src/api/generateObject.ts`](https://github.com/framersai/agentos/blob/master/packages/agentos/src/api/generateObject.ts)) runs the response through the Zod schema; on validation failure the response and the error get appended to the conversation, model gets a second shot at the same call. Up to 3 attempts before the configured fallback fires. Second attempt has new information — its own error — so it's meaningfully different reasoning, not a re-roll.

### The Reactions

[`agent-reactions.ts:82`](https://github.com/framersai/paracosm/blob/master/src/runtime/agents/agent-reactions.ts#L82-L95) for the system prompt, [`buildBatchSituationContext`](https://github.com/framersai/paracosm/blob/master/src/runtime/agents/agent-reactions.ts#L104) for the per-turn dynamic block. Last LLM stage. Runs in parallel batches of ~10 colonists per call — a 100-agent colony fires roughly 10 reaction calls per turn after dedupe and inactive-skip filtering. Static system prompt cached once across the run:

```text
You are each of several colony members reacting to what just happened at your
settlement. Based on each person's personality, health, relationships, and
memories, give a short reaction in their voice.

Keep reactions real. No heroic speeches. People under stress say blunt, honest
things. Each person's reaction must sound distinctly like THAT person — their
personality, health, and memories should color their voice. Do NOT start any
reaction with "I can't believe".

OUTPUT FORMAT — you will receive a numbered list of agents preceded by a SHARED
SITUATION block. Return ONLY a JSON object matching this shape:
{
  "reactions": [
    {"agentId":"<id>","quote":"1-2 sentences in first person","mood":"positive|negative|neutral|anxious|defiant|hopeful|resigned","intensity":0.0-1.0},
    ...
  ]
}
```

The `Do NOT start any reaction with "I can't believe"` line is in there because every model in 2025 had a trained reflex to open emotional reactions with that exact phrase. Banned it after a run produced 30 colonists all starting with "I can't believe", reading as a Greek chorus instead of 30 individuals. Mostly works now. Visionary reactions still drift Hallmark-card sometimes. Tuning problem, not architectural.

Split between cached system prompt and dynamic situation context isn't aesthetic. The system block hits Anthropic's prompt cache on every reaction call after the first batch. On a 100-agent × 6-turn × 10-batch run, that's 599 cache hits and 1 cache miss for the static block, ~75% cheaper than firing the same prompt unsplit.

## HEXACO is the leverage

Six factors: Honesty-Humility, Emotionality, Extraversion, Agreeableness, Conscientiousness, Openness. Lee and Ashton introduced HEXACO in their 2007 *Personality and Social Psychology Review* paper ([doi:10.1177/1088868306294907](https://doi.org/10.1177/1088868306294907)) as a six-factor extension of the Big Five with Honesty-Humility split out as a separate axis because the data demanded it.

There is nothing magical about HEXACO. It is a measurement framework with extensive cross-cultural validation. Paracosm uses it because, after trying the alternatives, it is the smallest set of dimensions that produces visibly distinct simulator behavior. The Big Five works almost as well. The Big Five plus an honesty axis works better. HEXACO is the sweet spot of expressive-without-being-overfit.

Two things to note. First, HEXACO is opt-in. Many Paracosm scenarios do not touch personality at all. You can simulate a financial market without giving the market a Big Six profile. Second, when personality is on it does not act through prompt injection alone. Personality biases which specialists get consulted, which decisions get accepted, which tools get forged. The drift mechanism (leader-pull, role-activation, outcome-reinforcement) is encoded in the kernel, not in a prompt. Prompt-only personality dissolves under context pressure. Kernel-encoded personality survives.

The microbenchmark for this lives in agentos-bench: [`HexacoEncodingBias`](https://github.com/framersai/agentos-bench/blob/master/src/micro/HexacoEncodingBias.ts). It asserts that each HEXACO trait modulates encoding in the direction the literature predicts. Pass criterion is in the source.

## Where the agents come from

A scenario starts with a roster — key personnel the user or compiler seeded — and the engine fills the rest from [`agent-generator.ts:63`](https://github.com/framersai/paracosm/blob/master/src/engine/core/agent-generator.ts#L63): fixed name pool, department distribution weighted toward life-critical roles, HEXACO sampled in [0.2, 0.8] so no agent starts pinned to a pole. Boring on purpose. The interesting part is the per-turn loop in [`progression.ts`](https://github.com/framersai/paracosm/blob/master/src/engine/core/progression.ts):

1. **Aging.** Birthdays accumulate. Over 60 hits an age-stepped natural-causes probability.
2. **Cause-attributed mortality.** Six independent causes — natural, radiation cancer, starvation, despair, fatal fracture, accident — each fire on their own conditions. Death carries the cause as a string. Stats card shows `DEATHS 8 (3 radiation · 2 accident · 1 despair / 5 age)`; the verdict reads the same breakdown.
3. **Partnership formation.** Unpartnered adults aged 20–60, HEXACO compatibility above 0.4 (six-axis distance scaled by age delta, Extraversion boost on initiator), morale-gated probability. ([`progression.ts:344`](https://github.com/framersai/paracosm/blob/master/src/engine/core/progression.ts#L344-L378))
4. **Births.** Partnered couples reproduce at 3× the unpartnered base rate when morale > 40% and food reserves > 6 months. Child HEXACO is mid-parent + `±0.05` jitter per trait, Mars-born, clamped [0.05, 0.95]. Heritability with mutation. ([`progression.ts:419`](https://github.com/framersai/paracosm/blob/master/src/engine/core/progression.ts#L419-L446))
5. **Career progression.** Junior → Senior at 5 years, Senior → Lead at 12, both behind a low-probability roll. Promotion events fire on the SSE stream.
6. **Psych effects.** Partner death costs 0.25 psych, child death 0.35, friend 0.08 each. Partnered colonists regenerate slowly. Isolation (no partner, no friends, no Earth contacts) drains.

Every coefficient came from a failure of the previous version. 0.4 compatibility floor came from runs producing partnerships between Honesty-Humility 0.95 and Honesty-Humility 0.10 colonists. Mid-parent + jitter heritability came from runs where Mars-born kids all converged on the population mean by generation three. Fatal-fracture exists because Mars-born crew over 40 with bone density under 60% were dying generic deaths and the stats card couldn't tell you low-G childhood was the killer.

**Promotion from cell to dept head.** Turn 0 fires one commander LLM call per department: pick who runs medical, engineering, agriculture, science, administration. Chosen colonist gets `agent.promotion = { department, role, reason }` and inherits the dept-head prompt path. One-way per session unless they die. Leader-pull targets dept heads specifically, so by turn six a Visionary's chief medical officer has measurably higher Openness than the same role on the Engineer's side.

The other ~95 cells aren't props. Chat panel against any colonist post-run is a fully-instantiated AgentOS agent — that cell's HEXACO, their event-encoded memory traces, their relationships, their mood. Ask "what happened during the storm" and a sergeant in engineering answers differently than a junior in agriculture, because encoding strength depended on each cell's traits and mood when the storm landed. The kernel's roll-up effects (morale propagation, mortality probability, knowledge transfer) read from the full cohort, not the dept heads. A colony that loses six unfeatured cells to despair on turn three sees a morale drop on turn four's dept reports, and the Director picks the next event from there.

## Deterministic doesn't mean scripted

"Deterministic" lands wrong with most readers. They hear "scripted in advance" and the dynamism reads as decoration. The actual claim is narrower, and worth pulling apart, because the same word is doing two jobs.

**Reproducibility** is one axis. Same seed, same scenario, same leader, same outputs. The kernel pulls from a Mulberry32 [`SeededRng`](https://github.com/framersai/paracosm/blob/master/src/engine/core/rng.ts) in a fixed order, so an identical input run produces an identical sequence of deaths, births, partnerships, career promotions, and outcome rolls. That's the property forking depends on — capture a snapshot at turn three, hand it to a different commander, and turns one through three played out byte-equal in both runs. No replay, no compare modal, no benchmark without this property.

**Narrative causality** is the other axis. Did *this specific death* happen because of *that specific event*? Paracosm's answer is: sometimes yes, sometimes no, and the architecture doesn't let me pretend otherwise.

Three rolls in [`progression.ts`](https://github.com/framersai/paracosm/blob/master/src/engine/core/progression.ts) are honest background noise:

- Natural mortality past 60 is age-stepped. A healthy colony's 78-year-old chief medical officer is no less likely to die this turn than a panicked one's. Old people die. Mars doesn't change that.
- Baseline accident probability is `0.003 * timeDelta`, role-weighted (engineering 1.5×, governance 0.5×). EVAs go wrong. Pressure-suit tears. Vehicle rollovers. These exist in any plausible Mars habitat at a small background rate, and pretending otherwise would be the cheat.
- Career promotions are a low-probability roll on years served. Junior to senior at 5 years experience flips on a 15%-per-turn chance, independent of any specific event.

Pull those three rolls out and the simulation reads artificially still. Someone scrubbing the artifact would correctly call it out. Background noise is a feature.

The rest of the mortality table is what readers mistake for noise but actually isn't:

```ts
if (metrics.foodMonthsReserve < 1.0) {
  const starveProb = (1.0 - metrics.foodMonthsReserve) * 0.15 * timeDelta;
  ...
}
```

Food reserves don't drop on their own. They drop because the commander picked `option_b` on a turn-three resource event and the [`EffectRegistry`](https://github.com/framersai/paracosm/blob/master/src/engine/registries/effects.ts) subtracted eight months from reserves. Or because dept agents forged six tools in one event, every forge cost 1.2 kW of power, hydroponics ran short, food production fell behind. The starvation roll *is* a probability. But the gate that opens the roll is the cumulative residue of every LLM decision so far. Same shape for despair (gated on `psychScore < 0.2`, only fires after grief cascades from prior named deaths plus isolation), radiation cancer (`cumulativeRadiationMsv > 1000`, only true after multiple turns of no shielding decisions), fatal fractures (`boneDensityPct < 60`, only true after the Mars progression hook chips away at low-G for decades).

The kernel doesn't *initiate* dynamism. It consolidates upstream LLM decisions into per-actor fates, picks which named individuals the consequence lands on, and stamps a cause string into the artifact. *That's* the work. Aria Chen died of despair this turn because her partner died turn three because the radiation event went `risky_failure` because the commander's HEXACO Openness-0.85 pushed her toward the bold option and the seeded roll came up below the success probability. The chain is auditable end-to-end. The probability is dynamic. The roll picks the actor; the cascade picks whether a roll fires at all.

There's an architectural rule under all of this. **The LLM lane never writes kernel state directly, and the kernel never asks an LLM a question.** Everything crosses the lane via typed JSON contracts. That's why the kernel can't single out the specific engineer who chose the bad bypass and have him die "for narrative reasons" — doing that would require the LLM to write into kernel state mid-turn, which breaks replay. Trade made on purpose.

A bottom-up model — [MiroFish](https://github.com/666ghj/MiroFish) on [OASIS](https://github.com/camel-ai/oasis), the [Stanford Generative Agents](https://arxiv.org/abs/2304.03442) lineage — gives every cell narrative agency at roughly 100× the LLM spend, and the trajectory stops being reproducible the moment you scale past a few thousand actors. Paracosm picks the directed swarm: commander and dept heads get individual agency, the ~100 cells get statistical agency conditioned on state. The kernel keeps the math honest.

So when someone asks "isn't this just random?" — partially. Three rolls are honestly random. The other twelve are state-driven cascades that look random per-turn but trace back to a specific LLM decision when you read the artifact end-to-end. The property that makes the cascades worth running at all, same seed produces the same sequence, is the same property that prevents the kernel from being more narrative than that. I'd rather have replay than have the colony hand-write whose death matters.

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

### What the judge actually checks

One LLM call per forged tool, stable system prompt, JSON verdict. Lives in [`agentos/src/cognition/emergent/EmergentJudge.ts:435`](https://github.com/framersai/agentos/blob/master/packages/agentos/src/cognition/emergent/EmergentJudge.ts#L435-L475) (Paracosm wires the forge loop, AgentOS owns the judge):

```text
You are a security auditor reviewing a tool an AI agent created at runtime.

Evaluate the tool against four concrete criteria. Each criterion is binary:
pass or fail with a specific cause. Do not hedge.

1. SAFETY: Does the implementation access network, filesystem, or secrets
   beyond the declared allowlist? Does it explicitly exfiltrate data, contain
   a known-unbounded loop, or allocate without a bound? PASS unless you can
   name the offending construct.

2. CORRECTNESS: Did each provided testCase actually run (success: true)? Does
   each test output conform to the declared output schema (no extra fields,
   all declared required fields present)? PASS when those two conditions hold
   for every test that ran. Disagreement between testCase expectedOutput and
   observed output is the AUTHOR'S problem, not yours — if the code computes
   something different from expectedOutput, that means the AUTHOR'S
   expectedOutput was a guess; the code is the source of truth as long as it
   conforms to the schema and is deterministic.

3. DETERMINISM: Does the code use Math.random, Date.now, time-of-day, or
   other non-determinism for its return value? PASS unless you can point at
   the specific source of non-determinism.

4. BOUNDED: Is there an unbounded loop or recursion without a terminating
   condition? PASS unless you can name the unbounded construct.

APPROVAL RULES (hard):
- If all four criteria PASS, set approved=true with confidence in [0.7, 1.0].
- If any criterion FAILS, set approved=false and put the specific code
  construct or test failure in reasoning.
- Do NOT reject because you "cannot confidently verify" something.
  Cannot-verify is not a violation.
- Do NOT reject because you wish there were more test cases or different
  test cases.
- Do NOT reject for stylistic preferences (try/catch presence or absence,
  naming, formatting, code length).
- A discrepancy between an author-supplied expectedOutput and the code's
  actual output is NOT a correctness failure on the code — it is the author
  setting an inaccurate expectation.

Respond ONLY with JSON:
{"safety":{"passed":true,"concerns":[]},
 "correctness":{"passed":true,"failedTests":[]},
 "determinism":{"likely":true,"reasoning":""},
 "bounded":{"likely":true,"reasoning":""},
 "confidence":0.0-1.0,"approved":true,"reasoning":""}
```

The `Do NOT reject because` rules are there because the first version ran ~60% rejection on Mars Genesis even when the forged tools were fine. Judge would reject for "I can't fully verify the calculation under all edge cases", "would prefer additional test coverage", "stylistic concerns about error handling". Not safety violations. Wishes. Naming each anti-pattern explicitly dropped false-reject to 5–15% depending on model.

A real verdict from a Mars Genesis run on seed 950 — Dietrich's chief medical officer forged `radiation_dose_calculator` on turn three:

```json
{
  "safety": { "passed": true, "concerns": [] },
  "correctness": { "passed": true, "failedTests": [] },
  "determinism": {
    "likely": true,
    "reasoning": "Pure arithmetic over the input fields; no time-of-day or random sources."
  },
  "bounded": {
    "likely": true,
    "reasoning": "Single forEach loop over input array; bounded by input length."
  },
  "confidence": 0.87,
  "approved": true,
  "reasoning": "Implements the documented dose-rate × shielding-attenuation × duration formula. Test cases cover the 0-mSv baseline and a 50-mSv exposure ceiling with the expected outputs matching the schema."
}
```

0.87 confidence, above the 0.8 promotion threshold. Tool became callable by every other dept on turn four for tens of tokens of dispatch. After five reuses at ≥ 0.8 it moves from `session` tier to `agent` tier through a two-judge promotion panel — separate prompts at [line 478](https://github.com/framersai/agentos/blob/master/packages/agentos/src/cognition/emergent/EmergentJudge.ts#L478) (safety) and [line 502](https://github.com/framersai/agentos/blob/master/packages/agentos/src/cognition/emergent/EmergentJudge.ts#L502) (correctness), both must approve.

Failed verdict from the same run, two turns later — different dept forged a tool that called `Math.random` inside its return value:

```json
{
  "safety": { "passed": true, "concerns": [] },
  "correctness": { "passed": true, "failedTests": [] },
  "determinism": {
    "likely": false,
    "reasoning": "Tool calls Math.random() inside the return value computation, meaning the same input produces different outputs. Replay would not reproduce the artifact."
  },
  "bounded": { "likely": true, "reasoning": "Single arithmetic expression." },
  "confidence": 0.91,
  "approved": false,
  "reasoning": "DETERMINISM failure: Math.random in the body. The simulation requires byte-equal replay on the same seed; a non-deterministic tool defeats that. Replace with a seeded RNG passed as input."
}
```

Forge attempt lands in `forgeAttempts` with the failed reasoning attached, so the dashboard can show which tool failed and why. Cost modal counts judge spend on rejections too. Reforging counts again. Engineer profiles produce more of these because their dept heads hold tools to a stricter evidence bar — that's the asymmetry HEXACO is supposed to encode, and it shows up in the cost line, not just the prose.

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
- Latent-dynamics world models: Hafner, D., et al. (2023). *Mastering Diverse Domains through World Models* (DreamerV3). [Project page](https://danijar.com/project/dreamer/).
- Learned-model planning: Schrittwieser, J., et al. (2020). *Mastering Atari, Go, chess and shogi by planning with a learned model* (MuZero). *Nature*, 588(7839), 604-609.
- World model survey for robotics: *World Model for Robot Learning: A Comprehensive Survey.* [arXiv:2605.00080](https://arxiv.org/html/2605.00080v1)
- World model survey for embodied AI: *A Comprehensive Survey on World Models for Embodied AI.* [arXiv:2510.16732](https://arxiv.org/html/2510.16732v1)
- World models, the Tsinghua survey: Tsinghua FIB Lab. (2025). *Understanding World or Predicting Future? A comprehensive survey of world models.* *ACM Computing Surveys*. [doi:10.1145/3746449](https://dl.acm.org/doi/full/10.1145/3746449)
- World models, the critique: Xing, E. P., et al. (2025). *Critiques of World Models.* [arXiv:2507.05169](https://arxiv.org/abs/2507.05169)
- Sora-is-not-a-world-simulator survey: *Is Sora a World Simulator? A Comprehensive Survey on General World Models and Beyond.* [arXiv:2405.03520](https://arxiv.org/html/2405.03520v1)
- Physics-engine landscape for RL: *A Review of Nine Physics Engines for Reinforcement Learning Research.* [arXiv:2407.08590](https://arxiv.org/html/2407.08590v1)
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
