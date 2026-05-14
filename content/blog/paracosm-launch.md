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

<img src="/img/diagrams/paracosm-world-model-split.svg" alt="Two world-model paths: native/visual outputs pixels (Sora, Genie 3, World Labs Marble); structured/LLM-based outputs typed JSON state (Paracosm, Yang et al 2026)." style="width:100%;border-radius:8px;margin:1.5rem 0;" />

*The clean split: pixels are what humans watch, typed state is what agents reason inside. Both lanes are legitimate, mostly disjoint customers.*

Paracosm is the second kind. The engine does not generate pixels. It generates a typed scenario contract, a deterministic kernel, research-grounded events that an LLM-as-judge coordinates, and the responses of AI agents with optional HEXACO personality vectors or specific directives that affect what those agents, referred to as `actors`, decide what to do, how to lead the subagents and swarms spawned. The output is JSON, not video. It is reproducible, forkable, replayable, and comparable across actors (leader agents).

Language is what gives rise to legible thinking (Sapir and Whorf), though it may not always involve text and words as we and LLMs know of it.

If you want an agent to imagine a future state and a human to learn from that imagination, the substrate has to be something both can read. Pixels are not that substrate. Typed JSON with named departments, decision logs, and citations is that substrate. The visual world models will absolutely matter for embodied robotics and film, but they may not be the right primitive for creating worlds and scenarios like a human for humans. Two columns, both legitimate, mostly disjoint customers.

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

I want to show the actual prompts. Most posts in this lane describe their architecture and gesture at "the prompt is carefully tuned" and call it done. That is not useful. The actual strings going to the model are the part that took months and they're all auditable from the repo. Five LLM calls happen on every turn — Director, Department, Commander, Judge (conditional, fires inside Department analysis on a forge), Reactions. Four of them have stable templates; the judge has a separate rubric I'll cover in the forging section because it conceptually belongs there. Here are the four turn-loop prompts trimmed to the structural skeleton with the dynamic interpolations called out.

### The Event Director

Source: [`src/runtime/orchestrator/director.ts`](https://github.com/framersai/paracosm/blob/master/src/runtime/orchestrator/director.ts), function `buildDirectorPrompt` at [line 142](https://github.com/framersai/paracosm/blob/master/src/runtime/orchestrator/director.ts#L142).

The Director decides what happens this turn. Reads kernel state, the leader's HEXACO profile, recent decision history, the agent mood roll-up, and the research-bundle topics, returns one to three events with options the commander will pick from. The actual prompt:

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

Two phrases in there earned their place after embarrassing failures.

**"Use this profile to colour (not determine) the next event."** Without that line the Director just rigged every Visionary run with high-Openness-friendly events ("a creative breakthrough opportunity arrives") and the Engineer with the inverse, which felt patronizing and produced caricature instead of divergence. Coloring instead of determining means the event picks SHOULD be biased but the leader is still tested against pressures the colony would face anyway.

**"MUST be exactly one of these"** for the category. Earlier I had "prefer", and the model would pick generic narrative categories ("founding", "legacy") that didn't exist in the scenario's effects map, silently bypassing every metric update. Three runs in a row produced unchanged metrics over six turns until I traced it to the off-list categories. The constraint is now hard.

### The Department Analysis

Source: [`src/runtime/orchestrator/departments.ts`](https://github.com/framersai/paracosm/blob/master/src/runtime/orchestrator/departments.ts), function `buildDepartmentContext` at [line 17](https://github.com/framersai/paracosm/blob/master/src/runtime/orchestrator/departments.ts#L17).

Every active department gets its own prompt. The dept head's CURRENT (drift-adjusted) HEXACO profile lives at the top, followed by **conditional behavioral cues that only fire when a trait is on a pole**. A dept head with Openness 0.45 doesn't get any forge-vs-reuse advice; one with Openness 0.95 reads:

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

Six axes × pole-conditional cues = up to six firing cues per dept head per turn. The exact phrasing for each pole on each axis is in [`departments.ts:38-94`](https://github.com/framersai/paracosm/blob/master/src/runtime/orchestrator/departments.ts#L38-L94). Earlier I tried listing every axis's high-low guidance unconditionally and asking the model to weight them. The dept heads converged on the same forge counts. Conditional firing is sharper, and a dept head with mostly-mid HEXACO produces baseline-neutral reports, which is exactly the right behavior for the personality model the dept head has.

The full department prompt also carries the prior-turn memory ("YOUR PREVIOUS ANALYSES"), the research-grounded canonical facts and counterpoints from the citation bundle, the current colony state line, and a domain-specific block from the scenario's `departmentPromptHook`. None of this is a prompt-engineering parlor trick. It's the difference between a dept head that reads as a generic AI assistant and one that reads as a department under the influence of a leader they've worked with for three turns.

### The Commander Decision

Source: [`src/runtime/orchestrator/index.ts:1598-1615`](https://github.com/framersai/paracosm/blob/master/src/runtime/orchestrator/index.ts#L1598-L1615) for the prompt template, [`src/runtime/validators/commander.ts:14-54`](https://github.com/framersai/paracosm/blob/master/src/runtime/validators/commander.ts#L14-L54) for the response Zod schema.

The commander gets the event, the dept reports, the forged toolbox, the kernel state, and a five-step REASONING block they're instructed to populate in the JSON response BEFORE choosing an option:

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

This is where chain-of-thought scaffolding is most explicit. Nothing about CoT here is novel — explicit step-by-step reasoning has been standard since [Wei et al. 2022](https://arxiv.org/abs/2201.11903). What earned its keep is the **BEFORE**: the Zod schema places `reasoning` as a populated-first field on the response, so the model writes the deliberation before choosing the option, not after. That's the difference between CoT-as-thinking and CoT-as-rationalization that [Turpin et al. 2023](https://arxiv.org/abs/2305.04388) flagged as a real failure mode of post-hoc CoT — where the model picks an answer for unrelated reasons and then writes a CoT chain that makes the answer look principled. Schema-ordered CoT closes that loophole at the structural level: the model has to commit ink to step (5) "Final choice" only after step (1) through (4) are filled.

The commander's `reasoning` field threads into the artifact. The dashboard renders it behind a "Show full analysis" expand on the decision card. A reader can audit not just what the commander decided but the full ordered deliberation that led there, including which forged-tool output they cited, which dept they overrode, and which trait pole they referenced.

There's a second CoT lever I lean on: **schema-guided retry**. The framework's `generateValidatedObject` ([packages/agentos/src/api/generateObject.ts](https://github.com/framersai/agentos/blob/master/packages/agentos/src/api/generateObject.ts)) runs the response through the Zod schema; on validation failure the original response and the validation error get appended to the conversation and the model gets a second shot. The model sees its own structural mistake and self-corrects. Up to 3 attempts per call before the configured fallback fires. This is CoT-adjacent in that the second attempt is meaningfully different from the first — the model has new information (its own error) to reason over.

### The Reactions

Source: [`src/runtime/agents/agent-reactions.ts:82-95`](https://github.com/framersai/paracosm/blob/master/src/runtime/agents/agent-reactions.ts#L82-L95) for the system prompt, [`buildBatchSituationContext`](https://github.com/framersai/paracosm/blob/master/src/runtime/agents/agent-reactions.ts#L104) for the dynamic per-turn block.

Last LLM stage of the turn. Runs in parallel batches of ~10 colonists per call (so a 100-agent colony fires roughly 10 reaction calls per turn after dedupe and inactive-skip filtering). Static system prompt — cached once, reused across every batch in the run:

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

The "Do NOT start any reaction with I can't believe" line is in the prompt because every model in 2025 had a trained reflex to start emotional reactions with that exact phrase. I banned it after a run produced 30 colonists all opening with "I can't believe", which read as a Greek chorus instead of 30 individuals. Now each reaction goes through the personality + memory block in the user prompt and the model has to produce something that doesn't sound like a stock LLM reaction. It mostly works. Sometimes a Visionary leader's reactions still sound a little Hallmark-card. That's a tuning problem, not an architectural one.

The split between **static system prompt** (cached on the provider) and **dynamic situation context** (in the user prompt) is deliberate. AgentOS's prompt-cache integration means the system block hits cache on every reaction call after the first batch in a run. On a 100-agent colony × 6 turns × 10 batches per turn, that's 599 cache hits and 1 cache miss for the static block, which on Anthropic's pricing brings the reaction-stage cost down by roughly 75% versus running the same prompt without the split.

## HEXACO is the leverage

Six factors: Honesty-Humility, Emotionality, Extraversion, Agreeableness, Conscientiousness, Openness. Lee and Ashton introduced HEXACO in their 2007 *Personality and Social Psychology Review* paper ([doi:10.1177/1088868306294907](https://doi.org/10.1177/1088868306294907)) as a six-factor extension of the Big Five with Honesty-Humility split out as a separate axis because the data demanded it.

There is nothing magical about HEXACO. It is a measurement framework with extensive cross-cultural validation. Paracosm uses it because, after trying the alternatives, it is the smallest set of dimensions that produces visibly distinct simulator behavior. The Big Five works almost as well. The Big Five plus an honesty axis works better. HEXACO is the sweet spot of expressive-without-being-overfit.

Two things to note. First, HEXACO is opt-in. Many Paracosm scenarios do not touch personality at all. You can simulate a financial market without giving the market a Big Six profile. Second, when personality is on it does not act through prompt injection alone. Personality biases which specialists get consulted, which decisions get accepted, which tools get forged. The drift mechanism (leader-pull, role-activation, outcome-reinforcement) is encoded in the kernel, not in a prompt. Prompt-only personality dissolves under context pressure. Kernel-encoded personality survives.

The microbenchmark for this lives in agentos-bench: [`HexacoEncodingBias`](https://github.com/framersai/agentos-bench/blob/master/src/micro/HexacoEncodingBias.ts). It asserts that each HEXACO trait modulates encoding in the direction the literature predicts. Pass criterion is in the source.

## Where the agents come from

A scenario starts with a roster — the key personnel the user (or the compiler) seeded — and the engine fills in the rest of the population from a deterministic generator with a fixed name pool, a department distribution weighted toward life-critical roles, and a HEXACO profile sampled in the [0.2, 0.8] range so no agent starts pinned to a pole. The generator lives in [`src/engine/core/agent-generator.ts`](https://github.com/framersai/paracosm/blob/master/src/engine/core/agent-generator.ts), function `generateInitialPopulation` at [line 63](https://github.com/framersai/paracosm/blob/master/src/engine/core/agent-generator.ts#L63). It is intentionally boring: pull a name, pull a department, pull a specialization, pull an age, pull a HEXACO. The interesting part happens after.

What turns ~100 boring colonists into a colony with internal lifecycle dynamics is [`src/engine/core/progression.ts`](https://github.com/framersai/paracosm/blob/master/src/engine/core/progression.ts), which runs every turn and does the following in order:

1. **Aging.** Birthdays accumulate. Agents over 60 face natural-causes mortality at an age-stepped probability.
2. **Cause-attributed mortality.** Six independent causes — natural, radiation cancer, starvation, despair, fatal fracture, accident — each fire on their own conditions. Every death carries the cause as a string, threaded into the artifact and the dashboard's stats card. `DEATHS 8 (3 radiation · 2 accident · 1 despair / 5 age)` is the rendering; the LLM verdict at end-of-run sees the same per-leader breakdown and writes about the specific pattern.
3. **Partnership formation.** Unpartnered adults aged 20-60 with HEXACO compatibility above 0.4 — six-axis distance scaled by age delta, with an Extraversion boost on the initiator — form partnerships at a morale-gated probability. ([`progression.ts:344-378`](https://github.com/framersai/paracosm/blob/master/src/engine/core/progression.ts#L344-L378))
4. **Births.** Partnered couples reproduce at 3× the unpartnered base rate when morale > 40% and food reserves > 6 months. The child inherits HEXACO at the **mid-parent value plus a small jitter** (`±0.05` per trait), Mars-born and clamped to [0.05, 0.95]. That's the heritability model — boring but explicit, documented at [`progression.ts:419-446`](https://github.com/framersai/paracosm/blob/master/src/engine/core/progression.ts#L419-L446).
5. **Career progression.** Junior → Senior at 5 years experience, Senior → Lead at 12 years, both behind a low-probability roll. Promotion events fire on the SSE stream so the dashboard renders the badges live.
6. **Relationship-driven psych effects.** Partner deaths cost 0.25 psych score, child deaths cost 0.35, friend deaths cost 0.08 each. Having a partner provides a slow positive psych regeneration. Isolation — no partner, no friends, no Earth contacts — costs psych over time.

That is the spawn-and-evolve loop in one sweep. The reason it's not behind a generic "population dynamics" knob is that every coefficient in there came from a specific failure of the previous version. The 0.4 HEXACO compatibility floor came from runs producing partnerships between Honesty-Humility 0.95 colonists and Honesty-Humility 0.10 colonists who would never have spoken to each other. The mid-parent + jitter heritability came from runs where Mars-born children all converged on the population mean by generation three, eliminating divergence. The fatal-fracture cause exists because Mars-born crew over 40 with bone density under 60% were dying generic deaths in the artifact and the stats card couldn't tell you that low-G childhood was the killer. Each coefficient is documented in the source comments at the line they fire, with the failure mode they fix.

The other lifecycle lever is **promotion from cell to dept head**. Turn 0 of a Mars Genesis run runs one extra LLM call per department: the commander reads the candidate roster and picks who runs medical, engineering, agriculture, science, administration. The chosen colonist gets `agent.promotion = { department, role, reason }` set in their state and inherits the dept-head prompt path on every subsequent turn. Promotion is one-way per session — a dept head doesn't get demoted unless they die — but **HEXACO drift on dept heads is faster than on regular cells** because leader-pull specifically targets agents in the commander's reporting chain. By turn six a Visionary's chief medical officer has measurably higher Openness than the same role on the Engineer's side, even when both started at the population mean.

The full pool of ~100 cells matters for two reasons that aren't obvious until you watch a run. First, the chat panel against any individual colonist after the run is a chat against a fully-instantiated AgentOS agent with the cell's HEXACO, their event-encoded memory traces, their relationship graph, their mood. A user who asks "what happened during the storm" gets a different answer from a sergeant in engineering than from a junior in agriculture, because the encoding strength on each input depended on each cell's traits and the mood they were in when the storm landed. Second, the kernel's roll-up effects (mortality probability, morale propagation, knowledge transfer) reads from the full cohort statistics, not from the dept heads only — so a colony that loses six unfeatured cells to despair on turn three sees a measurable morale drop on the dept reports of turn four, and the Director picks the next event accordingly. The cells aren't background props. They're the substrate the dept heads and the commander are governing.

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

The forge-time judge is a single LLM call with a stable system prompt that runs once per forged tool and returns a JSON verdict. The prompt lives in [`packages/agentos/src/cognition/emergent/EmergentJudge.ts:435-475`](https://github.com/framersai/agentos/blob/master/packages/agentos/src/cognition/emergent/EmergentJudge.ts#L435-L475) (Paracosm wires the forge loop, AgentOS owns the judge). The system block:

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

The "Do NOT reject because" rules look defensive because they are. The first version of this prompt ran rejection rates over 60% on Mars Genesis runs even when the forged tools were objectively fine — the judge would reject for "I can't fully verify the calculation under all edge cases", "would prefer additional test coverage", "stylistic concerns about error handling". Those aren't safety violations. Those are wishes. Naming each rejection anti-pattern explicitly cut the false-reject rate to roughly 5-15% depending on model. The rejections that survive are the ones with a concrete cause the prompt asks the judge to point at.

A real verdict from a recent Mars Genesis run on seed 950 — Dietrich's chief medical officer forged `radiation_dose_calculator` on turn three:

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

Approved at confidence 0.87, comfortably above the promotion threshold of 0.8. The tool became reusable by every other dept on turn four for tens of tokens of dispatch. After five reuses at that confidence the tool moves from `session` tier to `agent` tier via the separate two-judge promotion panel (one safety, one correctness, both must approve — different prompt in the same file at [line 478](https://github.com/framersai/agentos/blob/master/packages/agentos/src/cognition/emergent/EmergentJudge.ts#L478) and [line 502](https://github.com/framersai/agentos/blob/master/packages/agentos/src/cognition/emergent/EmergentJudge.ts#L502)) and survives beyond the run.

A failed verdict from the same run, two turns later, when a different dept tried to forge a tool that called `Math.random` inside its return value:

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

That's the kind of rejection the prompt is designed to surface. The forge attempt lands in the artifact's `forgeAttempts` array including the failed reasoning, so the user can see in the dashboard exactly which tool failed and why. The cost-modal counts the judge spend toward the run total even on rejections; reforging counts again. Engineer profiles produce more of these because their dept heads hold tools to a stricter evidence bar. The asymmetry is the entire reason HEXACO is wired this deep.

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
