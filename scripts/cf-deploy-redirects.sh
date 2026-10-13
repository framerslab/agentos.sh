#!/usr/bin/env bash
# Deploys the agentos.sh Cloudflare redirect ruleset via the Cloudflare API.
#
# Auth (one of):
#   CLOUDFLARE_API_TOKEN=...                            # Bearer token
#   CLOUDFLARE_API_KEY=... CLOUDFLARE_EMAIL=...         # Global API Key
#
# Zone is hardcoded to agentos.sh. Override with CLOUDFLARE_ZONE_ID env var if needed.
#
# This zone is on the Free plan, which prohibits the `matches` regex operator and
# `regex_replace()` function in filter expressions / target URLs. The rules below
# therefore use only Free-plan-compatible operators (`ends_with`, `starts_with`,
# `in {}`) and static target URLs. /docs/* deep links redirect to docs.agentos.sh/
# without path preservation; on Business plan we could preserve the path via
# regex_replace, but the tradeoff isn't worth $250/mo for ~10 dead URLs.
#
# Re-running is safe: looks up the existing http_request_dynamic_redirect ruleset
# by phase, PUTs the updated rule list if found, POSTs a new ruleset if not.

set -euo pipefail

ZONE_ID="${CLOUDFLARE_ZONE_ID:-8daf539f0a3f95e759acceb758f82643}"
API="https://api.cloudflare.com/client/v4"

if [[ -n "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  AUTH=("-H" "Authorization: Bearer $CLOUDFLARE_API_TOKEN")
elif [[ -n "${CLOUDFLARE_API_KEY:-}" && -n "${CLOUDFLARE_EMAIL:-}" ]]; then
  AUTH=("-H" "X-Auth-Email: $CLOUDFLARE_EMAIL" "-H" "X-Auth-Key: $CLOUDFLARE_API_KEY")
else
  echo "Set CLOUDFLARE_API_TOKEN, or CLOUDFLARE_API_KEY + CLOUDFLARE_EMAIL" >&2
  exit 1
fi
AUTH+=("-H" "Content-Type: application/json")

command -v jq >/dev/null || { echo "jq required (brew install jq)" >&2; exit 1; }
command -v python3 >/dev/null || { echo "python3 required" >&2; exit 1; }
cd "$(dirname "$0")/.."

# ---------------------------------------------------------------------------
# Build the ruleset JSON inline. Python avoids quoting hell across the 14
# ends_with() calls in rule 2.
# ---------------------------------------------------------------------------
BODY=$(python3 <<'PY'
import json

def ends_with_clause(slugs):
    parts = []
    for slug in slugs:
        parts.append(f'ends_with(http.request.uri.path, "{slug}")')
        parts.append(f'ends_with(http.request.uri.path, "{slug}/")')
    return "(" + " or ".join(parts) + ")"

deleted_slugs = [
    "build-ai-civilization-simulation-paracosm",
    "cognitive-memory-beyond-rag",
    "emergent-tools-hexaco-leaders",
    "longmemeval-m-70-with-topk5",
    "longmemeval-m-first-published-number",
    "longmemeval-s-85-pareto-win",
    "paracosm-structured-world-model",
]

PREFIXES = [""] + [f"/{l}" for l in ("en","es","fr","de","pt","ja","ko","zh")]
docs_clause = "(" + " or ".join(
    f'starts_with(http.request.uri.path, "{p}/docs/")' for p in PREFIXES
) + ")"

redirect = lambda url: {
    "from_value": {
        "status_code": 301,
        "target_url": {"value": url},
        "preserve_query_string": True,
    }
}

dynamic_redirect = lambda expr: {
    "from_value": {
        "status_code": 301,
        "target_url": {"expression": expr},
        "preserve_query_string": True,
    }
}

print(json.dumps({
    "name": "agentos.sh redirects",
    "description": "Managed by scripts/cf-deploy-redirects.sh",
    "kind": "zone",
    "phase": "http_request_dynamic_redirect",
    "rules": [
        {
            "action": "redirect",
            "description": "paracosm-2026-overview rename",
            "expression": ends_with_clause(["paracosm-2026-overview"]),
            "action_parameters": redirect("https://agentos.sh/blog/paracosm-launch/"),
        },
        {
            "action": "redirect",
            "description": "deleted blog posts",
            "expression": ends_with_clause(deleted_slugs),
            "action_parameters": redirect("https://agentos.sh/blog/"),
        },
        {
            "action": "redirect",
            "description": "mars-genesis post moved to docs",
            "expression": ends_with_clause(["mars-genesis-vs-mirofish-multi-agent-simulation"]),
            "action_parameters": redirect("https://docs.agentos.sh/blog/2026/04/13/mars-genesis-vs-mirofish-multi-agent-simulation"),
        },
        {
            "action": "redirect",
            "description": "/docs/* deep links to docs site",
            "expression": docs_clause,
            "action_parameters": redirect("https://docs.agentos.sh/"),
        },
        {
            "action": "redirect",
            "description": "/docs-generated/* to api docs",
            "expression": '(starts_with(http.request.uri.path, "/docs-generated/"))',
            # No trailing slash: docs.agentos.sh/api answers 200 and
            # docs.agentos.sh/api/ answers 404.
            "action_parameters": redirect("https://docs.agentos.sh/api"),
        },
        # /en/... → /... so the default-locale prefix collapses into the
        # canonical bare path. lib/seo/canonical.ts emits English URLs
        # without the locale prefix; the static export still writes
        # /en/<page>/ HTML files (and post-export.mjs mirrors them to
        # bare paths). This rule makes any inbound link to /en/<page>/
        # 301 to /<page>/ so Google consolidates them. Non-default
        # locales (/es/, /fr/, ...) keep their prefix and are not
        # affected. substring(path, 3) strips the leading "/en"
        # (length 3); concat() prepends the host.
        {
            "action": "redirect",
            "description": "/en/* collapse to canonical bare path",
            "expression": '(starts_with(http.request.uri.path, "/en/") or http.request.uri.path eq "/en")',
            "action_parameters": dynamic_redirect(
                'concat("https://agentos.sh", '
                'substring(http.request.uri.path, 3))'
            ),
        },
    ],
}))
PY
)

# ---------------------------------------------------------------------------
# Deploy: find existing dynamic_redirect ruleset, PUT-update if found, else POST-create.
# ---------------------------------------------------------------------------
echo "→ Looking for existing http_request_dynamic_redirect ruleset on zone $ZONE_ID"
EXISTING_ID=$(curl -fsS "${AUTH[@]}" "$API/zones/$ZONE_ID/rulesets" \
  | jq -r '.result[] | select(.phase=="http_request_dynamic_redirect") | .id' | head -1)

if [[ -n "$EXISTING_ID" ]]; then
  echo "  found $EXISTING_ID — backing up and updating in place"
  mkdir -p .cf-backups
  BACKUP=".cf-backups/redirect-ruleset-$(date -u +%Y%m%dT%H%M%SZ).json"
  curl -fsS "${AUTH[@]}" "$API/zones/$ZONE_ID/rulesets/$EXISTING_ID" > "$BACKUP"
  echo "  backup → $BACKUP"
  # PUT requires only `rules` (not the wrapper metadata)
  PUT_BODY=$(echo "$BODY" | jq '{rules}')
  RESPONSE=$(curl -sS -X PUT "${AUTH[@]}" -d "$PUT_BODY" \
    "$API/zones/$ZONE_ID/rulesets/$EXISTING_ID")
else
  echo "  none found — creating new ruleset"
  RESPONSE=$(curl -sS -X POST "${AUTH[@]}" -d "$BODY" \
    "$API/zones/$ZONE_ID/rulesets")
fi

if [[ "$(echo "$RESPONSE" | jq -r '.success')" != "true" ]]; then
  echo "✗ deploy failed:" >&2
  echo "$RESPONSE" | jq '.errors' >&2
  exit 1
fi
echo "✓ ruleset $(echo "$RESPONSE" | jq -r '.result.id') deployed with $(echo "$RESPONSE" | jq -r '.result.rules | length') rule(s)"

# ---------------------------------------------------------------------------
# Verify each rule with a representative URL.
# ---------------------------------------------------------------------------
echo "→ Waiting 5s for propagation"
sleep 5

echo "→ Verifying"
fails=0
# verify <url> <expected location> [exact]
# Passes when <url> answers 301 and its Location header contains the
# expected text, or, with "exact", equals it.
verify() {
  local url="$1" expect="$2" mode="${3:-contains}"
  local r=$(curl -sI "$url")
  local s=$(echo "$r" | head -1 | awk '{print $2}')
  local loc=$(echo "$r" | grep -i '^location:' | head -1 | tr -d '\r' | awk '{print $2}')
  local matched=false
  if [[ "$mode" == "exact" && "$loc" == "$expect" ]]; then
    matched=true
  elif [[ "$mode" != "exact" && "$loc" == *"$expect"* ]]; then
    matched=true
  fi
  if [[ "$s" == "301" && "$matched" == true ]]; then
    printf "  ✓ %s → %s\n" "$url" "$loc"
  else
    printf "  ✗ %s  status=%s loc=%s (expected %s: %s)\n" "$url" "$s" "$loc" "$mode" "$expect"
    fails=$((fails + 1))
  fi
}
verify "https://agentos.sh/blog/paracosm-2026-overview"                            "agentos.sh/blog/paracosm-launch"
verify "https://agentos.sh/en/blog/paracosm-2026-overview/"                        "agentos.sh/blog/paracosm-launch"
verify "https://agentos.sh/blog/cognitive-memory-beyond-rag"                       "agentos.sh/blog/"
verify "https://agentos.sh/blog/longmemeval-s-85-pareto-win/"                      "agentos.sh/blog/"
verify "https://agentos.sh/blog/mars-genesis-vs-mirofish-multi-agent-simulation"   "docs.agentos.sh"
verify "https://agentos.sh/docs/getting-started"                                   "docs.agentos.sh"
verify "https://agentos.sh/en/docs/install"                                        "docs.agentos.sh"
# Exact: docs.agentos.sh/api/ (with the slash) answers 404.
verify "https://agentos.sh/docs-generated/library/index.html"                      "https://docs.agentos.sh/api" exact
verify "https://agentos.sh/en/about"                                               "agentos.sh/about"
verify "https://agentos.sh/en/features/"                                           "agentos.sh/features/"
verify "https://agentos.sh/en/"                                                    "agentos.sh/"

if [[ "$fails" -gt 0 ]]; then
  echo "✗ $fails verification(s) failed" >&2
  exit 1
fi
echo
echo "✓ all redirects verified. Next: GSC → Indexing → Pages → 'Not found (404)' → Validate fix."
