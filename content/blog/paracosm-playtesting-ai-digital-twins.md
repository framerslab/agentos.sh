---
title: "Playtesting a Game with AI Digital Twins in Paracosm"
date: "2026-11-17"
featured: false
excerpt: "Five digital twins of game players spent a simulated first week in Drug Wars: 1984 for $7.57. Here is the Paracosm code, what each twin did, and how the results compare with browser playtests of the same game."
author: "AgentOS Team"
category: "Case Study"
audience: "evaluator"
image: "/img/blog/paracosm/drug-wars-1984-first-dashboard.png"
imageCaption: "The first dashboard of Drug Wars: 1984 on Normal, captured in a browser. The digital twins in this post never saw it."
heroBrand: "Paracosm"
keywords: "ai playtesting, playtesting with ai, digital twin playtesting, ai player personas, synthetic playtesters, game playtesting simulation, hexaco personas, paracosm, paracosm playtesting, player retention simulation, ai game testing, wilds.ai, agentos"
---

We gave five kinds of player a simulated first week of [Drug Wars: 1984](https://wilds.ai/@wildsai/drug-wars-1984), a turn-based trading and crime game on [wilds.ai](https://wilds.ai), using [Paracosm](https://github.com/framerslab/paracosm). Four of the five digital twins ended the week less willing to come back than they started. One ended it more willing. None quit.

| The run | |
|---|---|
| Engine | Paracosm 0.9.1132, `WorldModel.simulate` |
| Twins | 5, one for each kind of player |
| Length | 6 visits each, seed 42, 100 simulated city residents |
| Decisions | 30, of which 28 took the safe option |
| API calls | 552, with zero API errors |
| Run time | 40 minutes, one twin after another |
| Spend | $7.57 for the five twins |

Every player line in this post is simulated. No real player took part, and the twins never touched the game's screens.

## What can a digital twin of a player tell a game team?

A digital twin of a player is a simulated person with a stated temperament, goals and reasons to leave, placed in a model of your game. It rehearses a week of return visits in minutes and writes down why it made each choice, and a team can use that record to decide which questions to test first. A twin built this way knows only what you told it about the game. It cannot see a screen, press a key, run into a hidden price rule, or tell you what real people will do.

## How the game became a scenario

This is the scenario draft, cut to one of each repeating part:

```json5
{
  "id": "drug-wars-1984-player-week",
  "labels": {
    "name": "Drug Wars: 1984, One Player's First Week",
    "populationNoun": "street contacts",
    "timeUnitNoun": "visit",
    "actorNoun": "player"
  },
  "setup": { "defaultTurns": 6, "defaultSeed": 42 },
  "departments": [
    {
      "id": "patience-sense",
      "label": "Patience sense",
      "role": "Weighs screen friction against the time this visit has",
      "instructions": "Judge the cost of the log-in wall, the intro, the creator, the 12-step tour, small text and waiting against the minutes this visit allows. Propose how many in-game days to play, when to stop for today, or whether to quit for good."
    }
    // money sense, risk sense, curiosity sense, screen reader
  ],
  "metrics": [
    { "id": "intent-to-return", "label": "Intent to come back", "format": "percent", "better": "higher", "unit": "%", "initial": 60, "min": 0, "max": 100 }
    // fun, frustration, cash, debt, HP, two kinds of heat, game day, minutes played
  ],
  "effects": [
    {
      "category": "debt-interest",
      "entries": [
        { "metric": "debt", "change": 60000 },
        { "metric": "frustration", "change": 4 },
        { "metric": "intent-to-return", "change": -3 }
      ]
    }
    // trade, encounter, story beat, screen friction, render error, big score, federal raid
  ]
}
```

Effect sizes are table entries that the engine scales, which is why a debt event moved a twin's debt by thousands of dollars and never by the full 60,000.

Paracosm's usual frame is a leader who runs departments. We gave that frame a different meaning. The actor is one player, each turn is one visit, and the five departments are the player's own inner voices: money, risk, patience, curiosity and a screen reader. Nobody in the simulation can change the game. An earlier attempt framed the scenario as a game studio, and the actor became a design lead, so we threw that run away.

Beside the draft, the engine reads a seed document of game facts:

- New York in 1984, six boroughs, 14 drugs, and 30 in-game days to pay a loan shark.
- $2,000 in cash against a $50,000 debt at 12% a day, compounding, and payable only in full.
- Street heat, federal heat, fights, crew, bases and turf.
- The first session as a new player meets it, about six short visits over a week, and the breakages known at the time, including a render error screen whose retry key returns to the same error.

<img src="/img/blog/paracosm/drug-wars-1984-first-dashboard.png" alt="The Drug Wars: 1984 dashboard on day 1: a green terminal status rail showing net worth of minus $47,850 and $2,150 in cash, a map of New York boroughs on the left, tabs for game, inventory, market and skills, and step 1 of a 13-step guided tour in the centre." style="width:100%;border-radius:8px;margin:1.5rem 0;" />

*The first dashboard a new player meets on Normal, captured in a browser. The twins received a text description of this dashboard and never saw it. That description calls the tour 12 steps, and the game shows 13.*

## How a kind of player became an actor

The listing below is a sketch of the run's script, cut to the library's public calls and checked against the README and type definitions of `paracosm` 0.9.1132:

```typescript
import { readFile } from 'node:fs/promises';
import { compileScenario, WorldModel } from 'paracosm';

const world = JSON.parse(await readFile('./player-week.scenario.json', 'utf8'));
const seedText = await readFile('./seed.md', 'utf8');

const scenario = await compileScenario(world, {
  provider: 'anthropic',
  model: 'claude-sonnet-5-5',
  seedText,
  webSearch: false,
});
const wm = WorldModel.fromScenario(scenario);

const guest = {
  name: 'Dana Okafor',
  archetype: 'First-time guest who half remembers Dope Wars from a TI-83 and has twenty minutes at lunch',
  unit: 'first-time-guest',
  hexaco: {
    honestyHumility: 0.60, emotionality: 0.35, extraversion: 0.40,
    agreeableness: 0.50, conscientiousness: 0.85, openness: 0.55,
  },
  instructions: [
    "You played Dope Wars on a TI-83 in 1999 and followed a Reddit link from your laptop at lunch.",
    "You have twenty minutes and want to beat your high-school score with the rules and the debt's interest understood.",
    // The full text goes on to list what this player wants and what makes them leave.
    'Decide each session whether to keep playing and whether to come back tomorrow.',
  ].join(' '),
};

const run = await wm.simulate({
  actor: guest,
  maxTurns: 6,
  seed: 42,
  provider: 'anthropic',
  liveSearch: false,
  costPreset: 'economy',
  models: {
    departments: 'claude-sonnet-5-5',
    commander: 'claude-haiku-5-5',
    director: 'claude-haiku-5-5',
    judge: 'claude-haiku-5-5',
    agentReactions: 'claude-haiku-5-5',
  },
  onEvent(e) { console.log(guest.name, e.type, e.data.summary); },
});

console.log(run.fingerprint, run.finalState?.metrics);
```

Our script does two more things. It turns the hand-written draft into `player-week.scenario.json` with a helper the package does not export, so all five twins play one compiled scenario. It passes six scripted visit beats through `customEvents`, a typed option of `simulate`. With `webSearch` and `liveSearch` off, a twin learns about the game only from the seed, the draft and those six beats.

### The five player personas

| Kind of player | Simulated person | Honesty-humility | Emotionality | Extraversion | Agreeableness | Conscientiousness | Openness |
|---|---|---|---|---|---|---|---|
| First-time guest with twenty minutes at lunch | Dana Okafor | 0.60 | 0.35 | 0.40 | 0.50 | 0.85 | 0.55 |
| Dope Wars veteran checking for "the real one" | Dana Okafor (veteran) | 0.65 | 0.35 | 0.30 | 0.40 | 0.85 | 0.30 |
| Sim and tycoon optimizer with a spreadsheet of margins | Marcus Bell | 0.55 | 0.30 | 0.30 | 0.40 | 0.90 | 0.55 |
| Run-game player, one run each way on the subway | Priya | 0.65 | 0.40 | 0.30 | 0.55 | 0.85 | 0.55 |
| Casual phone sim player on the couch, sound off | Dana | 0.70 | 0.40 | 0.35 | 0.55 | 0.85 | 0.40 |

The six numbers are a [HEXACO](https://hexaco.org/scaledescriptions) profile on Paracosm's 0 to 1 scale. The names are invented.

The kinds of player come from research into what gamers write in public, including app store reviews, Steam discussions, Reddit threads and review sites. A separate citation pass then went back to the sources. Of 1,413 quoted strings in the persona research, 1,135 were confirmed at their source, 236 could not be reached (226 of them on Reddit), 26 had no URL, 3 were wrong and 13 were the files' own wording. We reprint none of those quotes here.

## What came out

Intent to come back, fun and frustration run from 0 to 100, and start at 60, 40 and 15. "First fun" is the first visit where fun rose by 3 points or more.

| Kind of player | First fun | Sharpest fall in intent | Intent at end | Fun at end | Frustration at end | Cash | Debt | Engine's label |
|---|---|---|---|---|---|---|---|---|
| First-time guest | Visit 3 (+7.3) | Visit 4 (-8.6) | 55.3 | 61.8 | 21.6 | $1,729 | $62,916 | lukewarm |
| Dope Wars veteran | Visit 2 (+3.3) | Visit 4 (-8.7) | 52.4 | 35.1 | 20.5 | $1,682 | $55,065 | lukewarm |
| Sim and tycoon optimizer | Visit 2 (+3.3) | Visit 5 (-1.6) | 63.9 | 44.2 | 17.0 | $1,598 | $62,684 | hooked |
| Run-game player | Visit 3 (+8.0) | Visit 6 (-2.9) | 51.9 | 42.7 | 18.3 | $1,593 | $54,453 | lukewarm |
| Casual phone sim player | Visit 3 (+5.0) | Visit 4 (-8.7) | 52.6 | 45.6 | 14.5 | $2,033 | $63,118 | lukewarm |

No twin quit, so "where they would have left" below means the point of greatest pull away from the game.

- **First-time guest:** visit 4, as the debt went from $53,650 to $65,588. By the last visit the curiosity voice had named a sharper threat, the broken ending: "If that's real, it removes the strongest reason to return, because the payoff is withheld."
- **Dope Wars veteran:** visit 4, a contact menu that asked again. Intent fell 8.7 points and fun fell 9.7, the worst single visit of the five runs.
- **Sim and tycoon optimizer:** no visit came close. The largest fall was 1.6 points, and this is the only twin the engine labelled "hooked".
- **Run-game player:** no single moment. Intent slid in three steps of 2.6 to 2.9 points, at visits 2, 5 and 6, and ended lowest of the five.
- **Casual phone sim player:** visit 4, as the debt went from $53,798 to $65,861. The player stayed and asked for the terms in writing.

## Two first weeks, visit by visit

The event titles and the quoted choices are the engine's own words. The event director invents people and side offers, so names such as Teodoro and Marisol appear here and nowhere in the game facts we supplied. Its titles can also disagree with the scores: "Ledger Ticks Up 5,880" sits on a visit where the recorded debt rose $3,881.

### First-time guest

**Visit 1: First Visit: The Bronx Pavement and the Loan Shark's Ledger.** Intent 63.3, fun 40.4, debt $50,000.

> Simulated choice: "Trade small and watch the board: make modest first buys in one or two low-priced goods, log price ranges across boroughs, keep each sale under 40 units and under $5,000, and hold most cash in reserve. Do not pay down the debt yet and do not chase the rumored spike."

**Visit 2: The Ledger Starts Compounding.** Intent 60.7, fun 40.4, debt $53,650.

> Simulated choice: "Pay the vig in full from cash on hand this week. Keep every sale under $5,000 and fight a subway encounter only at good odds, since cash will be nearly empty and HP and heat must stay protected. Do not make a partial payment and do not take the street-corner spread."

**Visit 3: The Board Jumps on Cheap Lots.** Intent 62.7, fun 47.7, debt $53,650.

> Simulated choice: "Buy a modest lot at the dip, spending no more than about $1,350 and keeping about $500 in reserve. Ask Big Tony for the extension rather than paying the $2,000 drop. Hold the mafia contract until its terms are confirmed."

**Visit 4: The Shark's Ledger Doubles Its Teeth.** Intent 54.1, fun 47.7, debt $65,588.

> Simulated choice: "Pay today's accrued vig and hold the remaining cash as a buffer. Decline Teodoro's double-or-nothing wager. Keep every sale under $5,000 and under 40 units per drug per place, and re-run the heat advisor before any large sale or any raid response."

**Visit 5: A Rival Crew Blocks the Stairwell.** Intent 55.1, fun 58.5, debt $65,588. This was the guest's one bold choice, and fun rose 10.8 points.

> Simulated choice: "Stand your ground and bargain with the rival crew leader, offering a future favor and a fair price on the next lot instead of cash. Keep the full $2,050 in play, flee below about 60 HP, and rest below 30 HP. Re-run the heat advisor after the exchange."

**Visit 6: Final Visit: The Week's Ledger Comes Due.** Intent 55.3, fun 61.8, debt $62,916.

> Simulated choice: "Split the close: sell enough inventory to cover most of the debt and keep a small position for the final price update. Keep the cash reserve, avoid any wager or sale of $5,000 or more, and stop for today. Use the plain-text fallback score so the settlement figures survive a RENDER ERROR."

### Dope Wars veteran

**Visit 1: First Visit: The Bronx Pavement and the Loan Shark's Ledger.** Intent 63.3, fun 40.1, debt $50,000.

> Simulated choice: "Open with option_a: small diversified trades across two or three drugs, learning two boroughs' prices, with no all-in bet and no payment to the loan shark on day 1. Keep each sale under $5,000 and under 40 units per drug per market."

**Visit 2: Ledger Ticks Up 5,880.** Intent 63.9, fun 43.4, debt $53,881.

> Simulated choice: "Negotiate a fixed weekly payment plan through a street contact, keep the $1,836 as trading float, take the first subway encounter now while enemy scaling is low, and make no bulk-lot purchase on borrowed money."

**Visit 3: The Ledger Screen Scrolls Sideways.** Intent 64.0, fun 43.8, debt $53,881.

> Simulated choice: "Work from the on-screen balance of $53,881.17 without digging out the paper tally. Accept the extension from Big Tony rather than the unaffordable $2,000 drop. Decline the mafia $30,000 advance until its failure penalty, unit cost and drug are stated. Play about 3 in-game days and stop for today."

**Visit 4: The Contact Menu Asks Again.** Intent 55.3, fun 34.1, debt $53,881.

> Simulated choice: "Page through the contact list one screen at a time, read the tip before acting on it, and back out at any point rather than committing before the timeout. Keep every sale under $5,000 and under 40 units. Stop for today once the menu is done."

**Visit 5: Marisol Slides a New Schedule.** Intent 53.5, fun 34.1, debt $57,745.

> Simulated choice: "Keep the fixed weekly repayment plan with Marisol, hold the cash at about $1,836, and read the revised sheet for extension cost and terms before any new commitment. Make no lump payment and no refinance. Keep heat at zero by holding sales under $5,000 and 40 units, and avoid any single all-in bet."

**Visit 6: Final Visit: The Week's Ledger Comes Due.** Intent 52.4, fun 35.1, debt $55,065. The patience voice gave its verdict on this visit: "Don't quit for good yet, but this is the last point where quitting is easy to justify."

> Simulated choice: "Liquidate remaining inventory at the current board prices in sales under $5,000 and under 40 units of any one drug, record final cash, debt and HP before any further screen, and report the unpaid balance honestly. Make no all-in bet and no crew or territory spending. Stop if a RENDER ERROR retry loops."

## Twins beside browser plays

A model also played the real game in a real browser as the same five kinds of player, acting through what the screen showed for up to 200 actions a person, so these plays are simulated as well. [How wilds.ai runs AI playtests with personas and real browsers](https://wilds.ai/blog/ai-playtesting) covers that side of our testing. The row below is the careful first person of each group, who has the same HEXACO profile as the twin.

| Kind of player | Twin at the end of the week | Browser play | Browser: would have left at | Browser: return? |
|---|---|---|---|---|
| First-time guest | Intent 55.3, fun 61.8, net -$61,187 | Normal, day 3, debt cleared, net +$7,949. Fun 5 of 10, difficulty 4 of 10 | Action 96, lunch over | Maybe once |
| Dope Wars veteran | Intent 52.4, fun 35.1, net -$53,383 | Hard, day 4, net -$119,949. Fun 2, difficulty 9 | Action 78, the day 2 interest | No |
| Sim and tycoon optimizer | Intent 63.9, fun 44.2, net -$61,086 | Nightmare, two games, net -$298,884 in the second. Fun 3, difficulty 10 | Action 75, a day 2 report with no word of a $31,000 charge | No on nightmare, once on Normal |
| Run-game player | Intent 51.9, fun 42.7, net -$52,860 | Hard, day 3, net -$97,270. Fun 4, difficulty 9 | Action 71, the day 2 interest | Only for the Records board, if day 1 could be won |
| Casual phone sim player | Intent 52.6, fun 45.6, net -$61,085 | Easy, two games. The first ended in a DEA raid at net +$46,700. Fun 5, difficulty 7 | Action 135, that raid | Maybe once |

The difficulty differs by row. The twins played the seed's Normal numbers, and Normal was the only preset a player could reach when we ran this. The browser test harness applied easy, hard or nightmare to four of the five, so the guest row is the closest match.

<img src="/img/blog/paracosm/drug-wars-1984-day-2-morning-report.png" alt="The Drug Wars: 1984 morning report panel for day 2, listing a cold snap, two street rumours, a Harlem note and today's oracle. No line mentions the loan shark's debt or interest." style="width:100%;border-radius:8px;margin:1.5rem 0;" />

*The day 2 morning report from the guest's browser play on Normal. The debt had gone from $50,000 to $56,000 overnight, and the report does not mention it. A twin has no way to notice this.*

**Where the two agree.** Both point at the debt. The browser veteran and run-game player would have left over the day 2 interest, and the guest and casual twins took their sharpest falls on the visit when the debt jumped. The twins took the safe option in 28 of 30 decisions, and the browser's careful players read the screens closely. The casual player's first sale was a high point in the browser, and the casual twin's fun first rose on a small first buy.

**Where they differ.** Every simulated browser player in the table reached a point where they would have left, and no twin quit. The browser guest cleared the debt on day 2, after an achievement paid $50,000, and the seed never mentioned that payout. No twin ever held more than $2,184 in cash. The optimizer twin ended the week most willing to return, while the browser optimizer found no profitable trade on a preset whose buy and sell markup the seed left out. The two faced different presets, so this row says as much about the test setup as about the player.

The clock differs too. At 12% a day, six game days would take $50,000 to about $98,700. The twins' debts ended between $54,453 and $63,118 and their game day reached only 1.00 to 1.36, so their debts do not track the game's real interest.

| What the test can see | Digital twin | Browser play |
|---|---|---|
| Returning over a week | Simulated intent to return across six scripted visits | One sitting per game, so returning is a stated answer |
| Why a simulated person chose | Written reasons and the advice of five voices | Partly, from a diary written during play |
| Real screens, keys, pop-ups and phone layout | Never | Yes |
| Real prices and economy | Only what the seed and draft say | Yes, including markups and payouts |
| Crashes and broken endings | Only as a warning from the seed | Yes, when one is hit |

## What it cost

| Kind of player | Spend | Run time | API calls |
|---|---|---|---|
| First-time guest | $1.61 | 488 s | 115 |
| Dope Wars veteran | $1.44 | 486 s | 112 |
| Sim and tycoon optimizer | $1.35 | 418 s | 98 |
| Run-game player | $1.49 | 439 s | 114 |
| Casual phone sim player | $1.69 | 571 s | 113 |
| **All five** | **$7.57** | **2,402 s** | **552** |

Each row and the total are rounded separately. That averages $1.51 and 8 minutes a person. Claude Sonnet 5.5 ran the five inner voices and took $7.27 of the spend. Claude Haiku 5.5 ran the decision, the event director, the judge and the city's reactions for $0.30. Compiling the scenario on Sonnet cost another $0.13.

The whole effort cost $11.59, because $3.89 went to attempts we discarded: one whose process died during its first person, the game studio framing, and a scenario drafted from a prompt that gave cash and debt a default start of $1,000,000. Pinning a hand-written draft fixed the last one.

Spend comes from our script's count of tokens in each API response, because the library prices these two models at a fallback rate. The README estimates $3 to $5 for an `economy` run on Anthropic with its default models. This post gives no dollar figure for the browser plays.

## What we do with it

The twins help us choose what to test. A browser play or real players' return data is what answers it. This run raises three questions:

1. **Does the day 2 debt jump end the session for careful players?** Two simulated browser players said they would leave over it. The guest and casual twins took their sharpest falls on a debt visit and stayed. Real players' return data can settle it.
2. **Does a spreadsheet-minded player stay on Normal?** The optimizer twin ended with the highest intent, 63.9. The browser optimizer, on nightmare, would not return on that preset and would try Normal once. A browser play on Normal would test it.
3. **Does the ending reward the week?** The guest and optimizer twins raised it from the seed's description of a broken ending. A play that reaches day 30 would test it.

The browser side of our testing, including persona players, rule checks and phone and desktop runs, is in [our write-up of AI playtesting at wilds.ai](https://wilds.ai/blog/ai-playtesting). wilds.ai is a platform for AI characters and AI-created games, built on AgentOS by the same team. [Drug Wars: 1984 has its own page there](https://wilds.ai/@wildsai/drug-wars-1984).

## Limits

- Every twin is a simulated person, with one person standing for each kind of player. Nothing here is a claim about what real players do.
- The twins know the game only through the seed, the scenario draft and six scripted beats.
- The five are alike. All score 0.85 or 0.90 on conscientiousness, the trait HEXACO's authors tie to people who ["deliberate carefully when making decisions"](https://hexaco.org/scaledescriptions). The impatient and anxious people from the browser groups have no twin here.
- With one seed, visits 1 and 4 ended as "conservative failure" for all five, and much of the week matched.
- We wrote the table of score changes, and the engine scales it. The size of every fall reflects that table, the falls of about 8.7 points at visit 4 included, so read them as direction and never as measurement.
- The event director invents. Some of its offers include part payments on a debt the game takes only in full, and several twins noticed that rule and refused.
- Two scores barely worked. The in-game day stayed between 1.00 and 1.36, and minutes played stayed at 0 for the run-game player. We draw no finding from either.
- The simulated city residents came out with staff-style roles such as "Lead Money sense Specialist", so we use none of their reactions.
- We ran each profile once with one seed, so we cannot estimate how much scores vary between runs.

## Run your own

```bash
npm install paracosm
```

Start from the [Paracosm site](https://paracosm.agentos.sh), the [source on GitHub](https://github.com/framerslab/paracosm) or the [live demo](https://paracosm.agentos.sh/sim). The [launch post](/blog/paracosm-launch/) explains the engine, and [Inside Mars Genesis](/blog/inside-mars-genesis-ai-colony-simulation/) walks through a full run with two opposing leaders.

## Sources

- Paracosm 0.9.1132, Apache-2.0: [framerslab/paracosm](https://github.com/framerslab/paracosm), [paracosm.agentos.sh](https://paracosm.agentos.sh)
- HEXACO scale descriptions: [hexaco.org](https://hexaco.org/scaledescriptions)
- Browser playtesting at wilds.ai: [AI Playtesting: How Our Agents Test Games](https://wilds.ai/blog/ai-playtesting)
- The game: [Drug Wars: 1984 on wilds.ai](https://wilds.ai/@wildsai/drug-wars-1984)
