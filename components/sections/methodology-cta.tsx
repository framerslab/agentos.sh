'use client';

import { motion } from 'framer-motion';
import { FileText, ArrowRight } from 'lucide-react';

/**
 * MethodologyCTA points research-minded readers at how the memory
 * benchmarks were run: the agentos-bench leaderboard, which lists the
 * runs with their reader model, memory configuration, confidence
 * interval, latency and cost, and the transparency audit post.
 *
 * Visual identity matches the OG card / BlogPostHero family: deep
 * navy gradient background, hex-grid texture, cyan→purple corner
 * brackets and gradient bar accents.
 *
 * Used on:
 *   - agentos.sh landing page
 *   - agentos.sh docs page
 */
export function MethodologyCTA() {
  return (
    <section
      aria-label="Benchmark methodology"
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
            {/* Label pill */}
            <div className="mb-5 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/[0.08] px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] text-cyan-300">
                <FileText className="h-3.5 w-3.5" aria-hidden />
                BENCHMARK METHODOLOGY
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
                How the memory numbers were measured
              </span>
            </h2>

            {/* Dek */}
            <p className="mx-auto mb-8 max-w-2xl text-center text-base sm:text-lg text-white/75 leading-relaxed">
              agentos-bench is the Apache-2.0 harness behind the memory
              benchmarks on this site. Its leaderboard lists the 85.6% and
              70.2% runs with the reader model, memory configuration, 95%
              confidence interval, latency and cost per correct answer, and
              the footnote to the 85.6% row gives the 84.2% gpt-4o-only run.
              Runs that made a score worse stay on the list.
            </p>

            {/* What the leaderboard covers: 3-column grid */}
            <div className="mb-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {[
                {
                  title: 'Results',
                  body: '85.6% on LongMemEval-S and 70.2% on LongMemEval-M with a per-category reader router; 84.2% on S with gpt-4o answering every question',
                },
                {
                  title: 'Judge checks',
                  body: 'The gpt-4o judge accepted 1% of deliberately wrong answers on LongMemEval-S, 2% on M and 0% on LOCOMO',
                },
                {
                  title: 'Reproducibility',
                  body: 'One CLI reruns the benchmarks, --seed fixes the bootstrap resampling behind each interval, and the bench is Apache-2.0 at github.com/framerslab/agentos-bench',
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
                href="https://github.com/framerslab/agentos-bench/blob/master/results/LEADERBOARD.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-white/90"
              >
                Read the leaderboard
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a
                href="https://agentos.sh/blog/memory-benchmark-transparency-audit/"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white transition-all hover:border-white/40 hover:bg-white/5"
              >
                Read the transparency audit
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
