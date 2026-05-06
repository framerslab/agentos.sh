'use client';

import Image from 'next/image';
import type { Post } from '@/lib/markdown';

/**
 * Blog post hero. Three layout paths, picked in this order:
 *
 *   1. Posts with `image` in frontmatter render the *image* layout:
 *      the post.image fills the canvas, the brand top-row stays
 *      overlaid for identity, and the post title sits over a
 *      dark-gradient scrim at the bottom for legibility. Matches
 *      the index card preview so navigating from the listing into
 *      the article keeps visual continuity.
 *
 *   2. Posts with `heroStat` + `heroLabel` in frontmatter (benchmarks,
 *      announcements with a headline number) get the *stat* layout:
 *      brand top-row, big gradient figures, summary under a hairline.
 *
 *   3. Every other post gets the *brand* layout: dark canvas with
 *      cyan + violet radial accents, brand top-row, post category
 *      as eyebrow, post title in gradient text, date as bottom-line.
 *
 * The brand wordmark in the top row defaults to "AgentOS" but can be
 * overridden per-post via the `heroBrand` frontmatter field (used by
 * launch posts for sister products like Paracosm).
 */
interface BlogPostHeroProps {
  post: Post;
}

interface ParsedStat {
  value: string;
  label: string;
}

function parseStats(heroStat: string, heroLabel: string): ParsedStat[] {
  const values = heroStat.split('/').map((v) => v.trim()).filter(Boolean);
  if (values.length <= 1) {
    return [{ value: heroStat.trim(), label: '' }];
  }
  // Try to split the label on " and " to give each figure its own
  // mini-label. Fall back to no per-figure label when the shape
  // doesn't fit so the figures don't get duplicate noisy labels.
  const labelParts = heroLabel.split(/\s+and\s+/i);
  if (labelParts.length === values.length) {
    return values.map((value, i) => ({ value, label: labelParts[i].trim() }));
  }
  return values.map((value) => ({ value, label: '' }));
}

/**
 * Strip the redundant "on " prefix from per-figure labels. Authors
 * write "on LongMemEval-S and -M" so the natural split produces
 * "on LongMemEval-S" / "-M". The leading "on" reads awkwardly under
 * a single figure so we trim it for the inline mini-label only.
 */
function trimMiniLabel(label: string): string {
  return label.replace(/^on\s+/i, '').trim();
}

/**
 * Reduce the heroLabel to a short post-figures summary. Drops the
 * variant list (everything before " (" or before " and ") since the
 * mini-labels under each figure already say which variant. What
 * remains is the parenthetical methodology hint, e.g. "(matched
 * gpt-4o reader)" → "matched gpt-4o reader".
 */
function trimSummaryLabel(heroLabel: string): string {
  const paren = heroLabel.match(/\(([^)]+)\)/);
  if (paren) return paren[1].trim();
  return heroLabel.trim();
}

/**
 * Brand top-row used by every layout: AgentOS icon on the left,
 * brand wordmark + eyebrow stacked next to it, optional right-meta
 * tag for the benchmark name / category. The wordmark defaults to
 * "AgentOS" but flips to the post's `heroBrand` field when set
 * (paracosm-launch and other sister-product launches).
 */
function BrandRow({
  brand,
  eyebrow,
  rightMeta,
  onImage,
}: {
  brand: string;
  eyebrow: string;
  rightMeta?: string;
  onImage?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Image
          src="/logos/agentos-icon.svg"
          alt=""
          width={32}
          height={32}
          className={`h-8 w-8 shrink-0 ${onImage ? 'drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]' : ''}`}
          aria-hidden
        />
        <div className="flex flex-col leading-tight">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200/60">
            {brand}
          </span>
          <span className="text-sm font-semibold text-white">{eyebrow}</span>
        </div>
      </div>
      {rightMeta && (
        <div className="hidden text-right text-[11px] font-medium uppercase tracking-[0.16em] text-white/50 sm:block">
          {rightMeta}
        </div>
      )}
    </div>
  );
}

/**
 * Shared shell: dark canvas, cyan + violet radial accents, brand
 * row at the top. Used by the stat layout and the typographic
 * brand layout so the visual identity is consistent. The image
 * layout uses its own shell (HeroImageShell) since the canvas
 * is the image itself rather than the dark gradient.
 */
function HeroShell({
  brand,
  eyebrow,
  rightMeta,
  children,
}: {
  brand: string;
  eyebrow: string;
  rightMeta?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-label="Article hero"
      className="relative my-10 overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-gradient-to-br from-[hsl(220,30%,8%)] via-[hsl(220,28%,11%)] to-[hsl(220,32%,7%)]"
    >
      {/* Faint radial accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-30 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, hsla(180, 95%, 60%, 0.45), transparent 60%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full opacity-25 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, hsla(270, 85%, 65%, 0.45), transparent 60%)',
        }}
      />

      <div className="relative px-6 py-8 sm:px-10 sm:py-10">
        <div className="mb-8">
          <BrandRow brand={brand} eyebrow={eyebrow} rightMeta={rightMeta} />
        </div>
        {children}
      </div>
    </section>
  );
}

/**
 * Image-hero shell: post.image fills the canvas, brand row sits
 * overlaid at the top inside a dark scrim for legibility, post
 * title sits at the bottom over a darker scrim. Matches the
 * 16:9 aspect ratio used by the index card so navigating from
 * the listing into the article keeps visual continuity.
 */
function HeroImageShell({
  image,
  alt,
  brand,
  eyebrow,
  rightMeta,
  title,
  date,
  author,
}: {
  image: string;
  alt: string;
  brand: string;
  eyebrow: string;
  rightMeta?: string;
  title: string;
  date: string;
  author?: string;
}) {
  return (
    <section
      aria-label="Article hero"
      className="relative my-10 overflow-hidden rounded-2xl border border-[var(--color-border-subtle)]"
    >
      <div className="relative aspect-[16/9] w-full bg-[hsl(220,30%,8%)]">
        {/* Background image. Uses next/image fill to span the
            16:9 container; priority since this is the LCP element. */}
        <Image
          src={image}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 768px, 100vw"
          className="object-cover"
        />

        {/* Top scrim for the brand row legibility */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-24"
          style={{
            background:
              'linear-gradient(180deg, hsla(220, 30%, 8%, 0.78) 0%, hsla(220, 30%, 8%, 0.45) 60%, transparent 100%)',
          }}
        />

        {/* Bottom scrim for the title legibility */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
          style={{
            background:
              'linear-gradient(180deg, transparent 0%, hsla(220, 30%, 8%, 0.55) 45%, hsla(220, 32%, 6%, 0.92) 100%)',
          }}
        />

        {/* Brand row, top-overlaid */}
        <div className="absolute left-0 right-0 top-0 px-6 py-5 sm:px-8 sm:py-6">
          <BrandRow brand={brand} eyebrow={eyebrow} rightMeta={rightMeta} onImage />
        </div>

        {/* Title + meta, bottom-overlaid */}
        <div className="absolute inset-x-0 bottom-0 px-6 pb-6 sm:px-10 sm:pb-8">
          <h2
            className="bg-clip-text text-transparent text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)]"
            style={{
              backgroundImage:
                'linear-gradient(135deg, hsl(180, 95%, 70%) 0%, hsl(270, 85%, 78%) 100%)',
            }}
          >
            {title}
          </h2>
          {(date || author) && (
            <div className="mt-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">
              {date}
              {author ? ` · ${author}` : ''}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function BlogPostHero({ post }: BlogPostHeroProps) {
  const heroStat = post.heroStat as string | undefined;
  const heroLabel = post.heroLabel as string | undefined;
  const heroBrand = (post.heroBrand as string | undefined) || 'AgentOS';
  const date = post.date
    ? new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  // Path 1: image layout for posts with a frontmatter image. The
  // image becomes the hero canvas so the in-page hero matches the
  // listing card preview. Brand row stays overlaid for identity.
  if (post.image) {
    return (
      <HeroImageShell
        image={post.image}
        alt=""
        brand={heroBrand}
        eyebrow={post.category ? `${post.category} Notes` : 'Engineering Notes'}
        rightMeta={post.category || undefined}
        title={post.title}
        date={date}
        author={post.author}
      />
    );
  }

  // Path 2: stat layout for benchmark/headline-number posts.
  if (heroStat && heroLabel) {
    const stats = parseStats(heroStat, heroLabel);
    const summary = trimSummaryLabel(heroLabel);

    return (
      <HeroShell brand={heroBrand} eyebrow="Benchmark Result" rightMeta="LongMemEval">
        <div
          className={`grid items-end ${
            stats.length === 1
              ? 'grid-cols-1'
              : 'grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-x-12'
          }`}
        >
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center sm:text-left">
              <div
                className="bg-clip-text text-transparent text-6xl sm:text-7xl lg:text-[5.5rem] font-bold tracking-tight leading-none"
                style={{
                  backgroundImage:
                    'linear-gradient(135deg, hsl(180, 95%, 62%) 0%, hsl(270, 85%, 68%) 100%)',
                }}
              >
                {stat.value}
              </div>
              {stat.label && (
                <div className="mt-3 text-sm font-medium text-cyan-100/70">
                  {trimMiniLabel(stat.label)}
                </div>
              )}
            </div>
          ))}
        </div>

        {summary && (
          <div className="mt-8 border-t border-white/[0.06] pt-4 text-center text-xs font-medium uppercase tracking-[0.18em] text-white/45 sm:text-left">
            {summary}
          </div>
        )}
      </HeroShell>
    );
  }

  // Path 3: brand-only typographic layout (fallback for posts
  // without an image).
  return (
    <HeroShell brand={heroBrand} eyebrow="Engineering Notes" rightMeta={post.category || undefined}>
      <div className="text-center sm:text-left">
        <h2
          className="bg-clip-text text-transparent text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight"
          style={{
            backgroundImage:
              'linear-gradient(135deg, hsl(180, 95%, 62%) 0%, hsl(270, 85%, 68%) 100%)',
          }}
        >
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="mt-4 max-w-3xl text-sm sm:text-base text-cyan-100/70 leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        )}
      </div>

      {(date || post.author) && (
        <div className="mt-8 border-t border-white/[0.06] pt-4 text-center text-xs font-medium uppercase tracking-[0.18em] text-white/45 sm:text-left">
          {date}
          {post.author ? ` · ${post.author}` : ''}
        </div>
      )}
    </HeroShell>
  );
}
