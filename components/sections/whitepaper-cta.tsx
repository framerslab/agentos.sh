'use client';

import { motion } from 'framer-motion';
import { FileText, ArrowRight } from 'lucide-react';

/**
 * WhitepaperCTA renders a "coming soon" callout banner for the
 * AgentOS technical whitepaper. The whitepaper covers the full
 * architecture (cognitive memory pipeline, classifier-driven
 * dispatch, runtime tool forging, HEXACO personality model),
 * benchmark methodology, and reproducibility for research-oriented
 * readers who want a citable PDF rather than scrolling docs.
 *
 * Visual identity matches the OG card / BlogPostHero family: deep
 * navy gradient background, hex-grid texture, cyan→purple corner
 * brackets and gradient bar accents.
 *
 * Reused on:
 *   - agentos.sh landing page
 *   - agentos.sh docs page
 *   - github.com/framerslab/agentos README (mirrored markdown version)
 */
export function WhitepaperCTA() {
  return (
    <section
      aria-label="Whitepaper coming soon"
      className="relative w-full py-20"
    >
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[hsl(220,30%,8%)] via-[hsl(220,28%,10%)] to-[hsl(220,30%,8%)] p-8 sm:p-12"
        >
          {/* Hex-grid texture overlay */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='52' viewBox='0 0 60 52'><path d='M 30 0 L 60 17 L 60 35 L 30 52 L 0 35 L 0 17 Z' fill='none' stroke='hsl(180,95%,60%)' stroke-width='0.6' /></svg>\")",
              backgroundRepeat: 'repeat',
            }}
          />

          {/* Corner brackets (top + bottom, both sides) */}
          {([
            { className: 'left-3 top-3 border-l-2 border-t-2' },
            { className: 'right-3 top-3 border-r-2 border-t-2' },
            { className: 'left-3 bottom-3 border-l-2 border-b-2 opacity-60' },
            { className: 'right-3 bottom-3 border-r-2 border-b-2 opacity-60' },
          ] as const).map((bracket, i) => (
            <div
              key={i}
              aria-hidden
              className={`pointer-events-none absolute h-7 w-7 ${bracket.className}`}
              style={{
                borderImage:
                  'linear-gradient(135deg, hsl(180,95%,60%), hsl(270,85%,65%)) 1',
              }}
            />
          ))}

          <div className="relative">
            {/* Coming-soon pill */}
            <div className="mb-5 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/[0.08] px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] text-cyan-300">
                <FileText className="h-3.5 w-3.5" aria-hidden />
                WHITEPAPER · COMING SOON
              </span>
            </div>

            {/* Title */}
            <h2 className="mb-4 text-center text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    'linear-gradient(135deg, hsl(180, 95%, 60%) 0%, hsl(270, 85%, 65%) 100%)',
                }}
              >
                The AgentOS Technical Whitepaper
              </span>
            </h2>

            {/* Dek */}
            <p className="mx-auto mb-8 max-w-2xl text-center text-base sm:text-lg text-white/75 leading-relaxed">
              The full architecture and methodology, written for engineers
              and researchers who want a citable PDF instead of scrolling
              docs. Cognitive memory pipeline, classifier-driven dispatch,
              HEXACO personality modulation, runtime tool forging, full
              LongMemEval-S/M and LOCOMO benchmark methodology with
              bootstrap CI math, judge-FPR probes, per-stage retention
              metrics, and reproducibility recipes.
            </p>

            {/* What it covers — 3-column grid */}
            <div className="mb-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {[
                {
                  title: 'Architecture',
                  body: 'Generalized Mind Instances, IngestRouter / MemoryRouter / ReadRouter, 8 cognitive mechanisms with primary-source citations',
                },
                {
                  title: 'Benchmarks',
                  body: 'LongMemEval-S 85.6%, LongMemEval-M 70.2%, vendor landscape, bootstrap CI methodology, judge FPR probes, full transparency stack',
                },
                {
                  title: 'Reproducibility',
                  body: 'Per-case run JSONs at seed=42, single-CLI reproduction, MIT-licensed bench at github.com/framerslab/agentos-bench',
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
                >
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                    {card.title}
                  </div>
                  <div className="text-sm text-white/75 leading-relaxed">
                    {card.body}
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://wilds.ai/discord"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-white/90"
              >
                Join Discord for the announcement
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a
                href="https://github.com/framerslab/agentos-bench/blob/master/results/LEADERBOARD.md"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white transition-all hover:border-white/40 hover:bg-white/5"
              >
                Read the benchmarks while you wait
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>

          {/* Bottom gradient bar */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px]"
            style={{
              background:
                'linear-gradient(90deg, hsl(180, 95%, 60%) 0%, hsl(270, 85%, 65%) 100%)',
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
