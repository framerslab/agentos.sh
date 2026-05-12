import { CTASection } from '../../components/sections/cta-section'
import dynamic from 'next/dynamic'
import { HeroSection } from '../../components/sections/hero-section'
import { BenchmarkBanner } from '../../components/sections/benchmark-banner'
import { DiscordCTA } from '../../components/sections/discord-cta'
import { ParacosmBanner } from '../../components/sections/paracosm-banner'
import { WorkbenchCTA } from '../../components/sections/workbench-cta'
import { SchemaMarkup } from '../../components/seo/seo-metadata'
import { SectionSkeleton } from '../../components/ui/section-skeleton'

// Enable static generation for faster initial loads
export const dynamicParams = false

// Animated background is purely decorative (no semantic content), so we
// keep it client-only with no SSR shell.
const AnimatedBackgroundLazy = dynamic(
  () => import('../../components/ui/animated-background').then(m => m.AnimatedBackground),
  { ssr: false, loading: () => null }
)

// Three sections are kept client-only because their first render reads
// browser-only state (refs, video element, theme via next-themes) and
// would otherwise produce hydration warnings or duplicate work. Each
// gets a server-rendered SSR shell below containing the H2 and intro
// copy so search engines see the section title regardless of hydration.
const DemoVideoPlayerLazy = dynamic(
  () => import('../../components/video/DemoVideoPlayer').then(m => m.DemoVideoPlayer),
  { ssr: false, loading: () => <div className="aspect-video bg-slate-900/50 rounded-xl animate-pulse" /> }
)

// Below-fold sections stay `ssr: false`. We previously experimented with
// `ssr: true` to put their text content in static HTML for crawlers, but
// that flipped mobile TBT from ~1.4s to ~6.2s on desktop and dropped mobile
// perf 67 → 23. Hydrating multiple framer-motion + next-intl client
// components in series is too costly for marginal SEO gain.
//
// Mechanism deep-dives previously hosted on the homepage (AgencySection,
// EmergentSection, CognitiveSection, FeaturesGrid, SkylineSection,
// WorkbenchCTA) now live on /features. Product / ecosystem / social-proof
// sections (GMISection, ProductCards, EcosystemSection, SocialProofSection)
// live on /about. The homepage stays focused on the conversion path:
// hero → demo → benchmarks → live run gallery → code → CTAs.

const CodeExamplesSectionLazy = dynamic(
  () => import('../../components/sections/code-examples-section').then(m => m.CodeExamplesSection),
  {
    ssr: false,
    loading: () => <SectionSkeleton minHeight={400} contentHeightClass="h-64" />,
  }
)

const BenchmarksSectionLazy = dynamic(
  () => import('../../components/sections/benchmarks-section').then(m => m.BenchmarksSection),
  {
    ssr: false,
    loading: () => <SectionSkeleton minHeight={600} contentHeightClass="h-96" />,
  }
)

const LiveRunDemoSectionLazy = dynamic(
  () => import('../../components/sections/live-run-demo-section').then(m => m.LiveRunDemoSection),
  {
    ssr: false,
    loading: () => <SectionSkeleton minHeight={600} contentHeightClass="h-96" />,
  }
)

const RuntimeIntelligenceSectionLazy = dynamic(
  () => import('../../components/sections/runtime-intelligence-section').then(m => m.RuntimeIntelligenceSection),
  {
    ssr: false,
    loading: () => <SectionSkeleton minHeight={700} contentHeightClass="h-96" />,
  }
)

const WhitepaperCTALazy = dynamic(
  () => import('../../components/sections/whitepaper-cta').then(m => m.WhitepaperCTA),
  {
    ssr: false,
    loading: () => <SectionSkeleton minHeight={400} contentHeightClass="h-48" />,
  }
)

export default function LandingPageRedesigned() {
  return (
    <>
      {/* JSON-LD: Organization, FAQPage, BreadcrumbList (server-rendered).
          The SoftwareApplication block lives in app/[locale]/layout.tsx. */}
      <SchemaMarkup />

      {/* Animated Background - deferred client-side */}
      <AnimatedBackgroundLazy />

      {/* Main Content */}
      <div>
        {/* Latest benchmark headline - dismissible per visit */}
        <BenchmarkBanner />

        {/* Hero Section - SSR enabled for faster LCP */}
        <HeroSection />

        {/* Discord CTA — official Wilds AI community for AgentOS + Paracosm support */}
        <DiscordCTA />

        {/* Paracosm — AI Agent Swarm Simulation. SSR'd directly so the banner
            renders on first paint instead of fading in after JS hydrates. */}
        <ParacosmBanner />

        {/* Live Demo Videos with Captions — SSR shell wraps client-only video player */}
        <section className="lazy-section">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">See AgentOS in action</h2>
          <p className="text-center text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10">
            Watch a live AgentOS agent handle a real workload end-to-end: tool use, memory recall, multi-step planning. Every clip is captured from a running runtime, no edits.
          </p>
          <DemoVideoPlayerLazy />
        </section>

        {/* Workbench CTA — the demos above are recorded inside Workbench.
            MIT-licensed companion to the Apache 2.0 runtime; visitors can
            grab it from GitHub or the latest release. */}
        <WorkbenchCTA />

        {/* Memory Benchmarks SOTA — matched gpt-4o reader on LongMemEval-S/M */}
        <div className="lazy-section-lg">
          <BenchmarksSectionLazy />
        </div>

        {/* Live run demo — real script + captured output side-by-side */}
        <div id="live-demo" style={{ scrollMarginTop: '80px' }}>
          <LiveRunDemoSectionLazy />
        </div>

        {/* Runtime intelligence pillars — emergent tools + adaptive prompt
            intelligence side-by-side. The two adaptation surfaces the
            framework leans on most are the only ones that get a dedicated
            section on the homepage; everything else lives on /features. */}
        <div id="runtime-intelligence-pillar" style={{ scrollMarginTop: '80px' }}>
          <RuntimeIntelligenceSectionLazy />
        </div>

        {/* Code Examples — production-ready code patterns. Hoisted up the page next
            to the live run demo so the narrative flows: benchmarks (proof of quality)
            → live run (proof it works) → code examples (here's how to write it). The
            wrapping `id="code"` keeps the hero "See code examples" CTA href="#code"
            scroll target stable. */}
        <div id="code" style={{ scrollMarginTop: '80px' }}>
          <CodeExamplesSectionLazy />
        </div>

        {/* Whitepaper coming-soon CTA — full architecture + benchmark methodology.
            Mechanism deep-dives (multi-agent orchestration, emergent capabilities,
            cognitive memory, enterprise infrastructure, features grid, workbench)
            live on /features. Generalized Mind Instances, product showcase, ecosystem,
            and social proof live on /about. */}
        <div className="lazy-section">
          <WhitepaperCTALazy />
        </div>

        {/* CTA Section */}
        <div className="lazy-section-sm">
          <CTASection />
        </div>
      </div>
    </>
  )
}
