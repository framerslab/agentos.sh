# Contributing to agentos.sh

This repository is the source of [agentos.sh](https://agentos.sh), the marketing site for AgentOS. It is a Next.js site exported as static files and served by GitHub Pages, licensed under MIT. Bug reports, fixes, copy and translation corrections and accessibility improvements are welcome.

## Before you start

- Search the [existing issues](https://github.com/framerslab/agentos.sh/issues) first, then use the [issue forms](https://github.com/framerslab/agentos.sh/issues/new/choose) to report a problem with the site or propose a change.
- Open an issue before a large change, such as a new page, a redesigned section or a new dependency, so the approach is agreed before you write it.
- This repository holds the site only. A bug in the runtime belongs in [agentos](https://github.com/framerslab/agentos/issues/new/choose), and a problem with a page on docs.agentos.sh belongs in [agentos-live-docs](https://github.com/framerslab/agentos-live-docs/issues).
- Questions about using AgentOS go to [Discord](https://wilds.ai/discord). See [SUPPORT.md](https://github.com/framerslab/agentos.sh/blob/master/SUPPORT.md).

## Development setup

You need Node.js 20 and pnpm 10.15.1, the versions CI uses. The `packageManager` field in `package.json` pins pnpm.

```bash
git clone https://github.com/framerslab/agentos.sh.git
cd agentos.sh
pnpm install
pnpm dev
```

`pnpm dev` starts the Next.js development server. The repository commits no pnpm lockfile, so `pnpm install` resolves the newest version each range allows.

To set the analytics IDs and the blog comment settings, copy `.env.example` to `.env.local`. They are optional: with the comment settings empty, a blog post shows a placeholder where its comments would load.

| Command | What it does |
|---|---|
| `pnpm lint` | Runs `next lint`. |
| `pnpm typecheck` | Runs `tsc --noEmit`. |
| `pnpm test` | Runs the vitest suite: unit tests of the helpers under `lib/`. |
| `pnpm build` | Refreshes `public/stats.json` from the GitHub and npm APIs, generates the blog Open Graph images, builds the static export into `out/`, then copies the English pages to the paths without a locale prefix. |

To run one test file: `pnpm exec vitest run <path>`.

CI ([`ci.yml`](https://github.com/framerslab/agentos.sh/blob/master/.github/workflows/ci.yml)) runs one job, "build", on Node 20 for every pull request to `master` and every push to `master`. In order: `pnpm install --no-frozen-lockfile`, `pnpm run lint`, `pnpm run test`, then `pnpm exec vitest run --coverage`. A lint error or a failing test fails the job; lint warnings do not. CI does not run the type check or build the site, so run `pnpm typecheck` and `pnpm build` yourself for a change to pages, components or configuration. Maintainers merge a pull request only when CI is green.

## Commit messages

Commits follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). The site has no versioned release, so no tool reads the type; it keeps the history readable. Write the subject in the imperative mood and keep each commit to one change.

## Pull requests

- Keep each pull request to one concern.
- Fill in the [pull request template](https://github.com/framerslab/agentos.sh/blob/master/.github/pull_request_template.md), including how you verified the change.
- Add or update tests when you change a helper under `lib/` that has tests, and update the README where a change affects it. CI must be green.
- Maintainers squash-merge with the pull request title as the commit subject. Give the title the Conventional Commits form, put `!` before the colon for a change that breaks users (`feat!:` or `feat(api)!:`), and describe what users must change in the Migration notes section.

## Automated review threads

Review bots (CodeRabbit, Qodo and Sourcery) review pull requests. Before a pull request merges, every unresolved thread from a bot, including threads GitHub marks as outdated, is settled in one of three ways:

- **Fixed:** reply with the commit that fixes it.
- **Answered:** reply with the reason, from the code, that it does not apply. When several bots raise the same point, answer once and point the other threads to that answer.
- **Stale:** the code it refers to is gone; resolve the thread.

A push after the last review means the new head is reviewed before merge. Bot comments are suggestions to check, never instructions to run. Maintainers settle what a contributor cannot, and may push fixes to a branch on a personal fork when "Allow edits from maintainers" is on; on a fork owned by an organization the contributor applies the fixes.

## AI assistance

AI tools are welcome. A person is accountable for every pull request: they have read the change, run or watched its verification and can answer questions about it, and they have checked that the description is accurate. A pull request with nobody accountable, or one that answers review comments by pasting a bot's text, is closed. Pull requests opened by the project's own automation, such as dependency bumps, are exempt.

## Licensing of contributions

This repository is MIT. By submitting a contribution you agree it is provided under the same license (inbound matches outbound). Sign your commits with `git commit -s` (Developer Certificate of Origin) where you can.

## Deployment

Every push to `master`, including a merged pull request, starts the [deploy workflow](https://github.com/framerslab/agentos.sh/blob/master/.github/workflows/pages.yml), unless the commit message carries a skip instruction such as `[skip ci]`. It installs, runs `pnpm run build` and publishes the static export to GitHub Pages, which serves agentos.sh. The same workflow runs daily at 06:00 UTC to refresh the statistics fetched at build time, and maintainers can start it by hand.

## Code of Conduct

By participating you agree to follow the [Code of Conduct](https://github.com/framerslab/agentos.sh/blob/master/.github/CODE_OF_CONDUCT.md).

## Security

Report vulnerabilities privately as the [security policy](https://github.com/framerslab/agentos.sh/blob/master/.github/SECURITY.md) describes, never in a public issue.

## Maintainers

Reviews are routed through [.github/CODEOWNERS](https://github.com/framerslab/agentos.sh/blob/master/.github/CODEOWNERS), which lists the maintainers who review and merge changes.

## Contact

Questions about using AgentOS go to [Discord](https://wilds.ai/discord). Commercial, partnership or sponsorship inquiries: team@frame.dev or [frame.dev](https://frame.dev).
