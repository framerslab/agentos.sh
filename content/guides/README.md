# Guide files

`lib/guides.ts` reads guides from `../../packages/agentos/docs` when the site is built inside the monorepo, and from this directory otherwise. This directory holds no guides, so the standalone build that `pages.yml` deploys lists none: `/guides` links to the guide pages on [docs.agentos.sh](https://docs.agentos.sh) instead. For the `/guides/<slug>` route that build generates one page per locale, `/guides/placeholder/`, which answers 200 with a "Guide Not Found" page: `generateStaticParams` in `app/[locale]/guides/[slug]/page.tsx` returns that slug when there are no guides, and `dynamicParams` is `false`, so every other slug answers 404.

To render guides from a standalone build, copy Markdown files from [framerslab/agentos `docs/`](https://github.com/framerslab/agentos/tree/master/docs) into this directory; `lib/guides.ts` maps file names such as `ARCHITECTURE.md` to titles and categories.
