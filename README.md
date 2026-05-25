<!-- BRANDING-LOGOS -->
<p align="center">
  <a href="https://agentos.sh"><img src="public/logos/agentos-primary-no-tagline.svg" alt="AgentOS" height="64" /></a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://frame.dev"><img src="public/logos/frame-logo-no-subtitle.svg" alt="Frame.dev" height="40" /></a>
</p>

<p align="center">
  <strong><a href="https://agentos.sh">agentos.sh</a></strong> —
  the marketing site for <strong>AgentOS</strong>, an open-source TypeScript AI agent framework with cognitive memory, runtime tool generation, multi-agent orchestration, multimodal RAG, voice pipelines, and 21 LLM providers.
</p>

<p align="center">
  <a href="https://agentos.sh">Website</a> ·
  <a href="https://docs.agentos.sh">Documentation</a> ·
  <a href="https://github.com/framersai/agentos">Runtime repo</a> ·
  <a href="https://www.npmjs.com/package/@framers/agentos">npm</a> ·
  <a href="https://docs.agentos.sh/blog">Blog</a> ·
  <a href="https://wilds.ai/discord">Discord</a>
</p>

---

## About AgentOS

AgentOS is the open-source TypeScript runtime that powers production AI agents at [Wilds.ai](https://wilds.ai), [Paracosm](https://paracosm.agentos.sh), and other projects under [Frame.dev](https://frame.dev). Highlights:

- **85.6%** on LongMemEval-S at $0.0090/correct (matched-reader leaderboard, gpt-4o)
- **70.2%** on LongMemEval-M (1.5M-token variant)
- **8 neuroscience-backed memory mechanisms**: Ebbinghaus decay, reconsolidation, retrieval-induced forgetting, involuntary recall, feeling-of-knowing, temporal gist extraction, schema encoding, source-confidence decay
- **6 multi-agent orchestration strategies**: sequential, parallel, debate, review-loop, hierarchical, graph DAG
- **HEXACO personality system** that modulates retrieval, response style, and memory consolidation per agent
- **5 security tiers** + 6 guardrail packs: PII redaction, ML classifiers, topicality, code safety, grounding, content policy
- **Runtime tool forging**: agents write their own functions mid-task; tiered promotion across the swarm
- **21 LLM providers** including Ollama for offline / self-hosted; **37 channel adapters** (Telegram, Discord, Slack, WhatsApp, webchat)
- **Apache-2.0**, self-hostable, production-ready

Get started:
```bash
npm install @framers/agentos
```

→ [Documentation](https://docs.agentos.sh/getting-started) · [Examples](https://github.com/framersai/agentos/tree/master/examples) · [Benchmarks](https://docs.agentos.sh/benchmarks)

---

## About this repository

This repo is the **marketing site** at [agentos.sh](https://agentos.sh) — Next.js + Tailwind, statically exported, served from GitHub Pages behind Cloudflare. It is intentionally decoupled from the runtime (`framersai/agentos`) so the marketing surface can ship independently.

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
pnpm dev:full    # next dev + TypeDoc watcher (doc-search hot reload)
pnpm build       # regenerates docs, copies to public/docs-generated, then next build
pnpm start       # serve the production build
pnpm lint        # next lint
pnpm typecheck   # tsc --noEmit
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

The header search (`/` or `Ctrl/⌘ + K`) fetches a lightweight `search-docs.json` manifest from `https://docs.agentos.sh` rather than loading the full TypeDoc bundle into the marketing site. The TypeDoc search index under `public/docs-generated/...` still backs the API docs experience hosted here.

### Media assets

Some sections render optional media. When files are missing, a placeholder appears so deploys stay safe.

| Location | Expected path | Notes |
|---|---|---|
| Hero loop | `public/media/landing/voice-hero-loop.mp4` (+ optional `.webm`, `voice-hero-poster.jpg`) | 8–12 s clip highlighting the voice pipeline |
| Architecture diagram | `public/media/diagrams/agentos-architecture-{light,dark}.png` | Used in architecture overview |
| GMI layers diagram | `public/media/diagrams/gmi-layers-{light,dark}.png` | Illustrates GMI = persona + memory + guardrails + tools |
| Voice pipeline diagram | `public/media/landing/voice-pipeline-{light,dark}.svg` | Capture → AgentOS → tool flow |

---

## Other AgentOS surfaces

- [`framersai/agentos`](https://github.com/framersai/agentos) — the runtime
- [`framersai/agentos-live-docs`](https://github.com/framersai/agentos-live-docs) → [docs.agentos.sh](https://docs.agentos.sh)
- [`framersai/agentos-bench`](https://github.com/framersai/agentos-bench) → published benchmarks + leaderboards
- [`framersai/agentos-extensions`](https://github.com/framersai/agentos-extensions) — extension registry
- [`framersai/agentos-skills`](https://github.com/framersai/agentos-skills) — SKILL.md community registry
- [`framersai/paracosm`](https://github.com/framersai/paracosm) → [paracosm.agentos.sh](https://paracosm.agentos.sh) — agent-swarm world simulation

## Contributing & Security

- [Contributing](https://github.com/manicinc/voice-chat-assistant/blob/master/.github/CONTRIBUTING.md)
- [Code of Conduct](https://github.com/manicinc/voice-chat-assistant/blob/master/.github/CODE_OF_CONDUCT.md)
- [Security policy](https://github.com/manicinc/voice-chat-assistant/blob/master/.github/SECURITY.md)

---

<p align="center">
  Built by <a href="https://manic.agency">Manic Agency LLC</a> / <a href="https://frame.dev">Frame.dev</a><br>
  Contact: <a href="mailto:team@frame.dev">team@frame.dev</a>
</p>
