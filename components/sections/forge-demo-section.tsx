/**
 * ForgeDemoSection. Full-width animated demo of runtime agent spawning,
 * positioned directly under the hero. Server component, zero client JS:
 * the only dynamic element is an autoplaying inline <video>.
 *
 * Asset trail:
 *  - MP4 (742 KB, H.264). The animated source; universally supported, so
 *    this is what every visitor actually sees.
 *  - WebP poster (91 KB). Shown before the MP4 plays AND used as the static
 *    <video> fallback for the (essentially nonexistent) browsers that can't
 *    play H.264. The 2.5 MB animated GIF is no longer referenced — fetching
 *    it as fallback content was costing ~2.5 MB on some renders.
 *  - preload="none" + below the LCP element, so neither file blocks paint.
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
            Runtime agent spawning
          </p>
          <h2 id="forge-demo-heading" className="text-3xl sm:text-4xl font-bold mb-3">
            <span className="gradient-text">Watch an agent get spawned at runtime</span>
          </h2>
          <p className="text-base sm:text-lg max-w-3xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            A manager coordinates a researcher and a writer. When the task needs a role neither covers, the manager calls{' '}
            <code className="font-mono text-[var(--color-accent-primary)]">spawn_specialist</code>, an LLM judge approves the new agent&apos;s spec, and the specialist joins the roster for the manager&apos;s next turn.
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
              Same 1600x920 box + classes; the 91 KB WebP serves as both the
              poster and the static fallback inside <video> for browsers that
              can't play H.264 (the 2.5 MB GIF is no longer referenced). */}
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            poster="/img/blog/og/agentos-emergent-demo.webp"
            width={1600}
            height={920}
            aria-label="A hierarchical AgentOS agency spawns a security_auditor specialist at runtime after the LLM judge approves its spec."
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
              alt="A hierarchical AgentOS agency spawns a security_auditor specialist at runtime after the LLM judge approves its spec."
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
              Run it yourself with <code className="font-mono text-[var(--color-accent-primary)]">node examples/emergent-hierarchical-spawning.mjs</code> in a built clone.
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
