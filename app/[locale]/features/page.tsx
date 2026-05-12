import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { canonical } from '@/lib/seo/canonical';
import { hreflangAlternates } from '@/lib/seo/hreflang';
import { CTASection } from '@/components/sections/cta-section';
import { SectionSkeleton } from '@/components/ui/section-skeleton';

/**
 * Features page — the mechanism deep-dives that previously crowded the
 * homepage. Each section explains one capability surface in detail. The
 * homepage links here for visitors who want the substance after the
 * benchmarks + live demo above the fold.
 *
 * Sections kept client-only because their first render reads browser-only
 * state (refs, theme via next-themes, framer-motion viewport observers).
 */
const AgencySectionLazy = dynamic(
  () => import('@/components/sections/agency-section').then((m) => m.AgencySection),
  { ssr: false, loading: () => <SectionSkeleton minHeight={600} contentHeightClass="h-96" /> },
);

const EmergentSectionLazy = dynamic(
  () => import('@/components/sections/emergent-section').then((m) => m.EmergentSection),
  { ssr: false, loading: () => <SectionSkeleton minHeight={600} contentHeightClass="h-96" /> },
);

const AdaptiveSectionLazy = dynamic(
  () => import('@/components/sections/adaptive-section').then((m) => m.AdaptiveSection),
  { ssr: false, loading: () => <SectionSkeleton minHeight={600} contentHeightClass="h-96" /> },
);

const CognitiveSectionLazy = dynamic(
  () => import('@/components/sections/cognitive-section').then((m) => m.CognitiveSection),
  { ssr: false, loading: () => <SectionSkeleton minHeight={600} contentHeightClass="h-96" /> },
);

const FeaturesGridClientLazy = dynamic(
  () => import('@/components/sections/features-grid-client'),
  { ssr: false, loading: () => <SectionSkeleton minHeight={600} contentHeightClass="h-96" /> },
);

const SkylineSectionLazy = dynamic(
  () => import('@/components/sections/skyline-section').then((m) => m.SkylineSection),
  { ssr: false, loading: () => <SectionSkeleton minHeight={500} contentHeightClass="h-80" /> },
);

const WorkbenchCTALazy = dynamic(
  () => import('@/components/sections/workbench-cta').then((m) => m.WorkbenchCTA),
  { ssr: false, loading: () => <SectionSkeleton minHeight={400} contentHeightClass="h-48" /> },
);

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const title = 'AgentOS Features: Multi-Agent Orchestration, Cognitive Memory, Runtime Tool Generation';
  const description =
    'AgentOS features for the open-source TypeScript AI agent framework: 6 multi-agent collaboration strategies, cognitive memory with Ebbinghaus decay, runtime tool generation, specialist spawning, voice pipelines, and 21 LLM providers.';
  const path = '/features';
  const url = canonical(locale, path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: hreflangAlternates(path),
    },
    openGraph: { title, description, url },
    twitter: { title, description },
  };
}

export default function FeaturesPage() {
  return (
    <main className="min-h-screen">
      {/* Page intro */}
      <section className="mx-auto max-w-5xl px-4 pt-24 pb-12 sm:pt-28">
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-primary)] mb-3">
          AgentOS · Open-source TypeScript AI agent framework
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Features
        </h1>
        <p className="mt-4 max-w-3xl text-base sm:text-lg text-[var(--color-text-secondary)]">
          Multi-agent orchestration, cognitive memory, runtime tool generation, specialist spawning,
          enterprise infrastructure, and the extension catalog. Each section explains one
          capability surface in detail.
        </p>
      </section>

      {/* Multi-agent orchestration — 6 strategies under agency() */}
      <div className="lazy-section-lg">
        <AgencySectionLazy />
      </div>

      {/* Emergent capabilities — runtime tool generation, specialist spawning, judge gate */}
      <div className="lazy-section-lg">
        <EmergentSectionLazy />
      </div>

      {/* Adaptive prompt intelligence — per-turn metaprompts, sentiment events, state surfaces */}
      <div className="lazy-section-lg">
        <AdaptiveSectionLazy />
      </div>

      {/* Cognitive memory — Ebbinghaus decay, reconsolidation, retrieval-induced forgetting */}
      <section className="lazy-section-lg">
        <CognitiveSectionLazy />
      </section>

      {/* Features grid with code popovers — full surface across LLM/RAG/voice/channels */}
      <div className="lazy-section-lg">
        <FeaturesGridClientLazy />
      </div>

      {/* Enterprise-ready infrastructure — guardrails, providers, channels */}
      <section className="lazy-section">
        <SkylineSectionLazy />
      </section>

      {/* Workbench CTA */}
      <div className="lazy-section-sm">
        <WorkbenchCTALazy />
      </div>

      {/* Bottom CTA */}
      <div className="lazy-section-sm">
        <CTASection />
      </div>
    </main>
  );
}
