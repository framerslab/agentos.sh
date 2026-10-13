# Cloudflare Redirect Rules — agentos.sh

The site is served by GitHub Pages behind Cloudflare. `netlify.toml` is inert
in production; all redirect rules are owned by Cloudflare → Rules → Redirect
Rules on the `agentos.sh` zone.

## Deploy

```bash
export CLOUDFLARE_API_KEY=...
export CLOUDFLARE_EMAIL=team@manic.agency
./scripts/cf-deploy-redirects.sh
```

The script:
1. Finds the existing `http_request_dynamic_redirect` ruleset on the zone.
2. Backs it up to `.cf-backups/redirect-ruleset-<timestamp>.json` (gitignored).
3. PUT-updates in place if found, POSTs a new ruleset if not.
4. Curl-verifies each redirect target.

Bearer token auth (`CLOUDFLARE_API_TOKEN`) also works if the token has
**Account → Account Rulesets → Edit** + **Zone → Zone WAF → Edit** scoped to
both the manic.agency account and the agentos.sh zone. The Global API Key
path is simpler and bypasses the per-permission scoping.

## What the rules do

The agentos.sh zone is on **Cloudflare Free plan**, which prohibits the
`matches` regex operator and `regex_replace()` function. The rules below match
with `ends_with`, `starts_with` and `eq`, and rule 6 builds its target with
`concat()` and `substring()`.

| # | Description | Match | Target |
|---|---|---|---|
| 1 | paracosm-2026-overview rename | path ends with `paracosm-2026-overview` (any locale prefix) | `https://agentos.sh/blog/paracosm-launch/` |
| 2 | deleted blog posts | path ends with any of 7 deleted slugs (any locale prefix) | `https://agentos.sh/blog/` |
| 3 | mars-genesis moved to docs | path ends with `mars-genesis-vs-mirofish-multi-agent-simulation` | `https://docs.agentos.sh/blog/2026/04/13/mars-genesis-vs-mirofish-multi-agent-simulation` |
| 4 | `/docs/*` deep links | path starts with `/docs/` or `/{locale}/docs/` | `https://docs.agentos.sh/` |
| 5 | `/docs-generated/*` | path starts with `/docs-generated/` | `https://docs.agentos.sh/api` (no trailing slash: `https://docs.agentos.sh/api/` answers 404) |
| 6 | `/en/*` collapse | path starts with `/en/` or is `/en` | `https://agentos.sh` followed by the path after `/en` |

### Path-preservation tradeoff

Rules 4 and 5 redirect to a static destination — `https://docs.agentos.sh/`
and `https://docs.agentos.sh/api` respectively — without preserving the trailing path. On
Business plan ($250/mo) we'd use `regex_replace()` to forward
`/docs/getting-started` to `https://docs.agentos.sh/getting-started`, but the
inbound traffic on these old paths is too small to justify the upgrade.
Visitors land on the docs home and use its search/nav.

## Adding rules

Edit the Python block in [scripts/cf-deploy-redirects.sh](scripts/cf-deploy-redirects.sh)
and re-run. Each run replaces the zone's redirect rule list with the rules the
script defines, so a rule added in the dashboard and missing from the script is
removed on the next run.

Free plan allows 10 rules total; the script defines 6. Avoid adding rules that need:
- `matches` regex operator → use `ends_with` / `starts_with` instead
- `regex_replace()` in target → use static URLs
- `like` wildcard operator → use `starts_with` or `ends_with` with explicit prefixes/suffixes

## After deploying

1. Verify the curls printed at the end of the script all show ✓ with 301
   responses. The `/docs-generated/` check requires the exact target
   `https://docs.agentos.sh/api`; the others check that the target contains
   the expected text.
2. In Google Search Console → Indexing → Pages → click **Not found (404)** →
   click **Validate fix**. Google will re-crawl over the next few days; the
   110-page NotFound bucket should drop to near zero.
3. Same for **Page with redirect** (40 pages) — those were already 301s, but
   Google might re-crawl them now that the broader pattern is fixed.

## Manual fallback (UI)

If the API ever stops working, the same rules can be entered manually at
https://dash.cloudflare.com → agentos.sh zone → Rules → Redirect Rules →
+ Create rule. Each rule uses **Custom filter expression** mode.
