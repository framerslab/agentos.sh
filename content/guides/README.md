# Guide files

`lib/guides.ts` reads guides from `../../packages/agentos/docs` when the site is built inside the monorepo, and from this directory otherwise. This directory holds no guides, so the standalone build that `pages.yml` deploys lists none: `/guides` links to the guide pages on [docs.agentos.sh](https://docs.agentos.sh) instead, and the `/guides/<slug>` route renders only a placeholder.

To render guides from a standalone build, copy Markdown files from [framerslab/agentos `docs/`](https://github.com/framerslab/agentos/tree/master/docs) into this directory; `lib/guides.ts` maps file names such as `ARCHITECTURE.md` to titles and categories.
