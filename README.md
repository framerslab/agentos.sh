<!-- BRANDING-LOGOS -->
<p align="center">
  <a href="https://agentos.sh"><img src="public/logos/agentos-primary-no-tagline.svg" alt="AgentOS" height="64" /></a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://frame.dev"><img src="public/logos/frame-logo-no-subtitle.svg" alt="Frame.dev" height="40" /></a>
</p>

<p align="center">
  <strong><a href="https://agentos.sh">agentos.sh</a></strong> is
  the marketing site for <strong>AgentOS</strong>, an open-source TypeScript AI agent framework with cognitive memory, runtime tool generation, multi-agent orchestration, multimodal RAG, voice pipelines, and 13 LLM providers.
</p>

<p align="center">
  <a href="https://agentos.sh">Website</a> ·
  <a href="https://docs.agentos.sh">Documentation</a> ·
  <a href="https://github.com/framerslab/agentos">Runtime repo</a> ·
  <a href="https://www.npmjs.com/package/@framers/agentos">npm</a> ·
  <a href="https://agentos.sh/blog/">Blog</a> ·
  <a href="https://wilds.ai/discord">Discord</a>
</p>

---

## About AgentOS

AgentOS is [Frame.dev](https://frame.dev)'s open-source TypeScript runtime for AI agents. [Wilds.ai](https://wilds.ai) and [Paracosm](https://paracosm.agentos.sh) run their agents on it. Highlights:

- **85.6%** on LongMemEval-S at $0.0090 per correct answer with a per-category reader router (gpt-4o and gpt-5-mini); **84.2%** with gpt-4o answering every question
- **70.2%** on LongMemEval-M (about 1.5M tokens of history per question) with the same reader router
- **8 memory mechanisms** from cognitive science, on top of Ebbinghaus decay and active when `cognitiveMechanisms` is set: reconsolidation, retrieval-induced forgetting, involuntary recall, feeling-of-knowing, temporal gist extraction, schema encoding, source-confidence decay, emotion regulation
- **6 multi-agent orchestration strategies**: sequential, parallel, debate, review-loop, hierarchical, graph DAG
- **HEXACO personality**: traits add style directives to the prompt and, with cognitive memory, tune encoding, working-memory capacity and seven of the eight memory mechanisms
- **6 opt-in guardrail packs**, run by the full AgentOS runtime on input and output: PII redaction, ML classifiers, topicality, code safety, grounding, content policy
- **Runtime tool forging**: with `emergent: true` on the full AgentOS runtime, an agent writes JavaScript tools mid-task; an LLM judge reviews each one before it registers, and a tool with 5 uses at 0.8 confidence can be promoted from the session to the agent
- **13 LLM providers** including Ollama for local models; **37 channel adapters** (Telegram, Discord, Slack, WhatsApp, webchat and 32 more)
- **Apache-2.0** and self-hostable

Get started:
```bash
npm install @framers/agentos
```

→ [Documentation](https://docs.agentos.sh/getting-started) · [Examples](https://github.com/framerslab/agentos/tree/master/examples) · [Benchmarks](https://docs.agentos.sh/benchmarks)

---

## About this repository

This repo is the **marketing site** at [agentos.sh](https://agentos.sh) — Next.js + Tailwind, statically exported, served from GitHub Pages behind Cloudflare. It is intentionally decoupled from the runtime (`framerslab/agentos`) so the marketing surface can ship independently.

### Stack

- **Next.js 14** App Router with locale-prefixed routing (`app/[locale]/...`)
- **Tailwind CSS** design system, dark mode via `next-themes`, twilight-neo default theme
- **next-intl 4.x** for 8 locales (en is canonical at `/`; the rest at `/es/`, `/fr/`, …)
- **Framer Motion** for hero animations; **Lucide** for iconography
- **Static export** (`output: 'export'`), served by GitHub Pages + Cloudflare CDN
- **JSON-LD** structured data per page (SoftwareApplication, Organization "Frame", WebSite, Article on blog posts, BreadcrumbList, FAQPage on `/faq`)

### Local development

```bash
pnpm install
pnpm dev         # next dev server
pnpm build       # GitHub and npm stats into public/stats.json, blog OG images, next build, then out/en/ mirrored to out/
npx serve@latest out   # serve the static export (next start does not run with output: 'export')
pnpm lint        # next lint
pnpm typecheck   # tsc --noEmit
pnpm test        # vitest
```

### Layout

- [`app/[locale]/page.tsx`](app/[locale]/page.tsx) — primary landing experience
- [`app/sitemap.ts`](app/sitemap.ts) — sitemap source (English-only with hreflang alternates)
- [`lib/seo/canonical.ts`](lib/seo/canonical.ts) — canonical URL helper (default locale drops `/en/` prefix)
- [`components/sections/`](components/sections/) — landing-page sections (hero, benchmarks, paracosm-banner, etc.)
- [`components/seo/`](components/seo/) — per-page JSON-LD (FAQ lives on `/faq` page itself, not here)
- [`scripts/post-export.mjs`](scripts/post-export.mjs) — post-build step that mirrors `out/en/<page>/` to `out/<page>/` so the canonical bare paths serve real content
- [`scripts/cf-deploy-redirects.sh`](scripts/cf-deploy-redirects.sh) — deploys the Cloudflare redirect ruleset (handles renamed blog slugs, `/en/*` → `/*` collapse, `/docs/*` → docs.agentos.sh)

### Search

The header search (`/` or `Ctrl/⌘ + K`) fetches a lightweight `search-docs.json` manifest from `https://docs.agentos.sh` rather than loading the full TypeDoc bundle into the marketing site. The API reference is at [docs.agentos.sh/api](https://docs.agentos.sh/api), and `agentos.sh/docs` redirects to the docs site.

---

## Other AgentOS surfaces

- [`framerslab/agentos`](https://github.com/framerslab/agentos) — the runtime
- [`framerslab/agentos-live-docs`](https://github.com/framerslab/agentos-live-docs) → [docs.agentos.sh](https://docs.agentos.sh)
- [`framerslab/agentos-bench`](https://github.com/framerslab/agentos-bench) → published benchmarks + leaderboards
- [`framerslab/agentos-extensions`](https://github.com/framerslab/agentos-extensions) — extension registry
- [`framerslab/agentos-skills`](https://github.com/framerslab/agentos-skills) — SKILL.md community registry
- [`framerslab/paracosm`](https://github.com/framerslab/paracosm) → [paracosm.agentos.sh](https://paracosm.agentos.sh) — agent-swarm world simulation

## Contributing and support

| Guide | What |
|---|---|
| [Contributing](https://github.com/framerslab/agentos.sh/blob/master/CONTRIBUTING.md) | Development setup, commit and pull request rules, review threads, contribution licensing |
| [Agent instructions](https://github.com/framerslab/agentos.sh/blob/master/AGENTS.md) | Commands and conventions for coding agents |
| [Code of Conduct](https://github.com/framerslab/agentos.sh/blob/master/.github/CODE_OF_CONDUCT.md) | Community standards |
| [Security Policy](https://github.com/framerslab/agentos.sh/blob/master/.github/SECURITY.md) | Reporting vulnerabilities privately |
| [Support](https://github.com/framerslab/agentos.sh/blob/master/SUPPORT.md) | Where to get help |

---

<p align="center">
  Built by <a href="https://frame.dev">Frame</a><br>
  Contact: <a href="mailto:team@frame.dev">team@frame.dev</a>
</p>
