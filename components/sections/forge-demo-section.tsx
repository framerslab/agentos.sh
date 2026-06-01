/**
 * ForgeDemoSection. Full-width animated demo of runtime tool forging,
 * positioned directly under the hero. Server component, zero client JS:
 * the only dynamic element is the animated WebP/GIF, both lazy-loaded.
 *
 * Asset trail:
 *  - WebP (1.93 MB, lossless from GIF). Modern browsers pick this up.
 *  - GIF fallback (2.49 MB). Used by anything that can't parse <picture>
 *    or animated WebP. Both files live in public/img/blog/og/.
 *  - Section sits below the LCP element so neither file blocks first
 *    paint, even at full size.
 */
export function ForgeDemoSection() {
  return (
    <section
      id="forge-demo"
      className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8"
      aria-labelledby="forge-demo-heading"
    >
      <div className="mx-auto max-w-6xl">
        <header className="text-center mb-8">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-primary)] mb-2">
            Runtime tool forging
          </p>
          <h2 id="forge-demo-heading" className="text-3xl sm:text-4xl font-bold mb-3">
            <span className="gradient-text">Watch a tool get forged at runtime</span>
          </h2>
          <p className="text-base sm:text-lg max-w-3xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            Three HEXACO-distinct agents collaborate on a code review. When their static toolkit can&apos;t cover the task, the manager calls{' '}
            <code className="font-mono text-[var(--color-accent-primary)]">spawn_specialist</code>, an LLM judge approves the spec, and all three invoke the forged tool on the next turn.
          </p>
        </header>

        <figure
          className="rounded-2xl overflow-hidden border shadow-2xl shadow-violet-500/10"
          style={{ borderColor: 'var(--color-border-primary)' }}
        >
          {/* Was a 1.93 MB lossless animated WebP (+ 2.5 MB GIF fallback).
              Re-encoded to a 742 KB H.264 MP4, served as an autoplaying,
              looping, muted, inline <video>. preload="none" defers the load
              until it scrolls into view so it never competes with first paint.
              Same 1600x920 box + classes; WebP poster, GIF kept only as the
              ancient-browser fallback inside <video>. */}
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            poster="/img/blog/og/agentos-emergent-demo.webp"
            width={1600}
            height={920}
            aria-label="Three AgentOS agents with distinct HEXACO personalities collaborate on a code review, forge a new tool at runtime, the LLM judge approves the spec, and all three invoke it on the next turn."
            className="w-full h-auto block"
          >
            <source src="/img/blog/og/agentos-forge-demo.mp4" type="video/mp4" />
            {/* Fallback for the (essentially nonexistent) browsers that can't
                play H.264 MP4: a static 91KB WebP, NOT the 2.5MB animated GIF.
                The GIF was costing ~2.5MB on loads where the renderer fetched
                <video> fallback content; H.264 is universally supported so the
                animated path is always the MP4. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/blog/og/agentos-emergent-demo.webp"
              alt="Three AgentOS agents with distinct HEXACO personalities collaborate on a code review, forge a new tool at runtime, the LLM judge approves the spec, and all three invoke it on the next turn."
              width={1600}
              height={920}
              loading="lazy"
              decoding="async"
              className="w-full h-auto block"
            />
          </video>
          <figcaption
            className="px-4 py-3 text-xs sm:text-sm flex flex-wrap items-center justify-between gap-2"
            style={{
              color: 'var(--color-text-muted)',
              background: 'var(--color-background-secondary)',
            }}
          >
            <span>
              Captured from <code className="font-mono text-[var(--color-accent-primary)]">node examples/emergent-hierarchical-spawning.mjs</code>.
            </span>
            <a
              href="https://github.com/framerslab/agentos/blob/master/examples/emergent-hierarchical-spawning.mjs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent-primary)] hover:underline whitespace-nowrap"
            >
              View source on GitHub →
            </a>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
