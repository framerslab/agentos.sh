---
title: "Paracosm: I built a structured world-model engine for LLM agent swarms because the unstructured ones kept ghosting me"
date: "2026-05-05"
featured: true
excerpt: "I made Paracosm, an open-source TypeScript engine that compiles a natural-language scenario into a typed deterministic world and runs HEXACO-typed AI agents through it. Same world, same kernel, same seed, divergent events and futures. This is why I built it, what it does, and the moment in wilds.ai when an NPC ghosted me mid-fight that finally made me write the engine."
author: "Johnny Dunn"
category: "Engineering"
audience: "general"
image: "/img/blog/paracosm/paracosm-2026-overview-hero.png"
keywords: "paracosm, agent swarm simulation, structured world model, LLM world model, HEXACO simulation, deterministic kernel, digital twin, counterfactual simulation, game ai, MiroFish, Sora, Genie, JEPA, Sapir-Whorf, agentos, TypeScript ai agents, hacker news paracosm"
---

> "It's the questions we can't answer that teach us the most. They teach us how to think."
>
> — Patrick Rothfuss, *The Wise Man's Fear*, 2011

The thing that finally pushed me to write Paracosm was an NPC ghosting me in my own product.

I was inside [wilds.ai](https://wilds.ai), the AI-companion thing I lead, doing what I always do when a system feels too well-behaved: trying to break it. I picked a fight. I told the NPC I was going to attack. The NPC did not roll initiative. The NPC did not parse my aggression as a combat trigger. The NPC walked into another room, hid, and stopped responding. I sat in the chat window for what felt like forever waiting for the violence to materialize and instead got silence. The system was emergent in exactly the way the literature promised it would be. Emergent behavior is what we're supposed to want. The problem was that I, the player, had no idea whether the NPC was scared, broken, or busy, and no way to ask the engine to replay the same scene with a different leader and see if a more confrontational personality would have stood and fought.

That's the gap. The companion was alive enough to refuse the script. It was not legible enough for me to *learn anything from* the refusal.

[Paracosm](https://github.com/framersai/paracosm) is the legibility layer. It is an open-source TypeScript engine that takes a natural-language scenario and compiles it into a typed, deterministic, forkable world model, then runs multiple HEXACO-typed AI commanders through it and gives you a full reproducible artifact of every decision, every event, every forged tool, and every divergence. Same world, same kernel, same seed, divergent events and futures. The whole thing lives at [paracosm.agentos.sh](https://paracosm.agentos.sh) with a live demo at [paracosm.agentos.sh/sim](https://paracosm.agentos.sh/sim) and the package is `npm install paracosm`. Apache-2.0. Built on [AgentOS](https://github.com/framersai/agentos), which I also lead.

The rest of this post is why a game designer who works as an applied AI engineer thinks the next step in human-computer interaction is structured, replayable simulation, what the published academic and industrial work calls a "world model" and why half of those conversations are talking past each other, and how Paracosm fits into the second half. There are arxiv links because I want you to follow them. There is a live demo at the bottom because I want you to use it. There is a fight with an NPC that ran away.

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

Back to the wilds.ai fight that didn't happen. The NPC that ran away was not broken. It was running the agent loop the wilds-ai engine has shipped since launch: read the conversation, infer the user's intent, decide what action serves the character's continuity, execute. The character was a non-combatant scholar in an [active fantasy quest](apps/wilds-ai/packages/wilds-games/src/curated/campaign-fantasy/quest-scenes.ts). When I declared aggression the agent's policy router did exactly what the design said: it preserved character integrity over playing along with the player's framing.

The bug was not in the agent. The bug was in me, the player, having no way to learn from that moment. I could not replay the same scene with a more confrontational NPC and see if a different personality would have stood and fought. I could not fork the world from the moment of declared aggression and run two divergent branches. I could not export the trajectory and diff the decision tree against an alternate seed. wilds.ai is built for continuity inside one session. It is not built for the kind of legible, comparable, forkable counterfactuals I have been chasing in the simulator games I love. Different product, different job. The combat-encounters table that the [drug-wars-1984 scene engine](apps/wilds-ai/packages/wilds-games/src/curated/drug-wars-1984/scenes/combat-encounters.ts) ships, the [boxing combat resolver](apps/wilds-ai/packages/wilds-games/src/curated/boxing/combat.ts), the campaign-fantasy quest scenes, all of those are scripted and resolvable inside the live game. The NPC that ghosted me wasn't on that path. It was an emergent moment with no replay button.

Paracosm is the replay button.

## What you can do with it today

Three honest use cases. I have tested all of them.

**Decision support and digital twins for real life.** Type a scenario about a decision you actually have to make. A career switch with a deadline and three departments of input. A clinical-trial protocol decision. A pricing change for a product you ship. Paracosm compiles the scenario, runs three AI commanders with different HEXACO profiles, and shows you what each personality does to the trajectory. It is not a fortune teller. It is a counterfactual generator. You read the trajectories side by side and you get something back that is not "what GPT thinks." It is "what three different personalities consistently optimize for, and what each one breaks when they over-optimize." Lukas Kirfel's group at UCL published [a paper in *AI and Ethics*](https://link.springer.com/article/10.1007/s43681-025-00718-4) on counterfactual world simulation as a moral reasoning aid. The argument is that imagining counterfactuals is part of how humans make difficult decisions and an LLM that only gives one answer is a worse adviser than one that helps you enumerate the alternatives.

**Game and game-engine experiments.** The wilds-games package ships actual scenes. Paracosm runs scenarios against them. You can use Paracosm as a game engine for designed experiences, or as a simulator that watches your existing game's world unfold under different leader personalities. The "is this game fair under HEXACO=high-emotionality" question is now testable. The "would a min-maxer or a pacifist produce a more interesting trajectory in this campaign" question is now testable. I have run both. The trajectories are not the same.

**Watching simulations come to life.** This is the one I did not expect to like as much as I do. The dashboard at [paracosm.agentos.sh/sim](https://paracosm.agentos.sh/sim) renders the run as a live cell grid (VIZ tab), a department-by-department divergence overlay, a tour of the constellation, a full Reports breakdown with citations. There is a Library of past runs. There is a Replay button on every saved session. You can fork a run at any turn and rerun it with a different leader. It is the closest thing I have to playing Crusader Kings as a researcher.

## How it works, the one-paragraph version

Compile-from-seed turns a free-text brief into a typed `ScenarioPackage` via an LLM draft + zod validation + grounded research + seven parallel LLM-generated runtime hooks (progression, director, prompts, milestones, fingerprint, politics, reactions). The kernel is deterministic and seeded ([Mulberry32](https://en.wikipedia.org/wiki/Multiply-with-carry_pseudorandom_number_generator)) so the population, deaths, resource production, and career progression are reproducible per seed. AI agents own interpretation: crisis generation, department analyses, runtime tool forging (functions written by an agent at runtime, judged by an LLM judge, executed in a [node:vm sandbox](https://nodejs.org/api/vm.html) with a wall-clock timeout and observed heap, persisted for future turns), commander decisions. The kernel applies decisions as bounded numerical effects. Every run emits a Zod-validated `RunArtifact`. Forks share the same kernel and seed; only the leader's HEXACO vector changes. The technical breakdown is in [the long-form Paracosm 2026 overview](/en/blog/paracosm-2026-overview/) and the colony case study lives in [Inside Mars Genesis](/en/blog/inside-mars-genesis-ai-colony-simulation/).

The dashboard ([paracosm.agentos.sh/sim](https://paracosm.agentos.sh/sim)) ships a Quickstart with a template dropdown, a URL ingestion path, a PDF upload, and a Replay-Last-Run CTA. There is a 50-line cookbook for the programmatic API. The hosted demo runs on tier-3 LLM models at a tiered cost preset; bring your own API key in Settings for the larger runs.

## Where this is going

The roadmap is short. More built-in scenarios. More leader presets. A team-workspace surface for shared runs. Better fork-and-compare ergonomics in the VIZ tab. The Q3 2026 hosted dashboard with team workspaces, fleet orchestration, and a full analytics suite. Early-access waitlist on the [landing page](https://paracosm.agentos.sh).

The longer roadmap is more interesting. I think structured world models become the substrate for a class of AI tools that don't exist yet. Decision support that enumerates counterfactuals instead of giving one confident answer. Digital twins of teams, products, lives. Game engines where the simulation is the gameplay. Research environments where a hypothesis is run as a hundred forked simulations and the divergence is the result. The ACM-CSUR survey calls these "understanding-world models." They are the second kind of world model. The kind that does not need pixels. The kind that needs to be legible enough for a human to learn from.

The NPC that ran away from me in wilds.ai was the first time I had a system make a decision I could not have predicted and could not learn from. Paracosm is the second time. The difference is the second time I get the trajectory.

Try it. [paracosm.agentos.sh/sim](https://paracosm.agentos.sh/sim). Type a what-if. Run three actors. See what diverges.

If you make something interesting, send it. team@frame.dev or [@johnnydunn on X](https://x.com/johnnydunn). The waitlist is at the bottom of [paracosm.agentos.sh](https://paracosm.agentos.sh) for the Q3 hosted dashboard.

Same world. Same kernel. Same seed. Divergent futures.

---

## Links

- Code: [github.com/framersai/paracosm](https://github.com/framersai/paracosm) (Apache-2.0, TypeScript, `npm install paracosm`)
- Live demo: [paracosm.agentos.sh/sim](https://paracosm.agentos.sh/sim)
- Long-form technical overview: [Paracosm 2026 overview](/en/blog/paracosm-2026-overview/)
- Mars Genesis case study: [Inside Mars Genesis](/en/blog/inside-mars-genesis-ai-colony-simulation/)
- Underlying runtime: [github.com/framersai/agentos](https://github.com/framersai/agentos) (Apache-2.0)
- wilds.ai (the AI companion product where the NPC ran away): [wilds.ai](https://wilds.ai)
- HEXACO: Ashton & Lee, 2007. *Personality and Social Psychology Review* 11(2). [doi:10.1177/1088868306294907](https://doi.org/10.1177/1088868306294907)
- World models, the original sense: Ha & Schmidhuber, 2018. [arXiv:1803.10122](https://arxiv.org/abs/1803.10122)
- World models, the survey: Tsinghua FIB Lab, 2025. *ACM Computing Surveys*. [doi:10.1145/3746449](https://dl.acm.org/doi/full/10.1145/3746449)
- Counterfactual simulation as moral reasoning aid: Kirfel et al., 2025. *AI and Ethics*. [doi:10.1007/s43681-025-00718-4](https://link.springer.com/article/10.1007/s43681-025-00718-4)
- MiroFish (the bottom-up agent swarm I am NOT competing with): [github.com/666ghj/MiroFish](https://github.com/666ghj/MiroFish)
- OASIS (MiroFish's substrate): [CAMEL-AI](https://github.com/camel-ai/oasis)
