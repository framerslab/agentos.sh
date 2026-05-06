import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';
import { ExternalLink, BookOpen, Cpu, Rocket, Building2, GraduationCap } from 'lucide-react';
import type { Locale } from '../../../i18n';
import { canonical } from '@/lib/seo/canonical';
import { hreflangAlternates } from '@/lib/seo/hreflang';
import { DiscordCTA } from '@/components/sections/discord-cta';

/**
 * Map of inline citation text (as it appears in prose) to its DOI/URL.
 * Keys must match the parenthetical citation exactly, including surrounding parens.
 */
const CITATION_URLS: Record<string, string> = {
  '(Ebbinghaus, 1885)': 'https://psychclassics.yorku.ca/Ebbinghaus/index.htm',
  '(Baddeley, 2000)': 'https://doi.org/10.1016/S1364-6613(00)01538-2',
  '(Ashton & Lee, 2004)': 'https://doi.org/10.1207/s15327957pspr0802_1',
  '(Blondel et al., 2008)': 'https://doi.org/10.1088/1742-5468/2008/10/P10008',
  '(Malkov & Yashunin, 2018)': 'https://doi.org/10.1109/TPAMI.2018.2889473',
  '(Nader et al., 2000)': 'https://doi.org/10.1038/35021052',
  '(Anderson et al., 1994)': 'https://doi.org/10.1037/0096-3445.123.2.178',
  '(Berntsen, 2010)': 'https://doi.org/10.1177/1745691610370007',
};

/**
 * Escapes special regex characters so a literal string can be used in a
 * `new RegExp()` constructor safely.
 */
function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Splits a plain-text string on known academic citation patterns and returns
 * an array of React nodes where each citation is wrapped in an `<a>` tag
 * linking to its DOI / source URL. Non-citation segments remain as plain text.
 */
function linkCitations(text: string): ReactNode[] {
  /* Build a single regex that matches any known citation. */
  const pattern = new RegExp(
    `(${Object.keys(CITATION_URLS).map(escapeRegExp).join('|')})`,
    'g',
  );
  const parts = text.split(pattern);

  return parts.map((part, i) => {
    const url = CITATION_URLS[part];
    if (url) {
      return (
        <a
          key={i}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="citation-link"
        >
          {part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

type Props = {
  params: {
    locale: string;
  };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'faq' });
  const path = '/faq';
  const url = canonical(locale, path);

  return {
    title: `${t('title')} | AgentOS - TypeScript AI Agent Framework`,
    description: t('subtitle'),
    alternates: {
      canonical: url,
      languages: hreflangAlternates(path),
    },
    openGraph: {
      title: `${t('title')} | AgentOS - TypeScript AI Agent Framework`,
      description: t('subtitle'),
      url,
      siteName: 'AgentOS',
      images: [{ url: '/og-image.png' }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t('title')} | AgentOS - TypeScript AI Agent Framework`,
      description: t('subtitle'),
    },
    authors: [{ name: 'Frame.dev', url: 'https://frame.dev' }],
  };
}

/** Structured data for SEO — Google-compatible FAQPage schema. */
function FAQJsonLd({ locale: _locale }: { locale: string }) {
  /**
   * We hardcode the structured data to avoid runtime translation calls in a
   * non-client component. These mirror the en.json FAQ content for the
   * default locale; Google reads the rendered HTML regardless of locale.
   */
  const faqs = [
    {
      q: 'What is AgentOS?',
      a: 'AgentOS is an open-source TypeScript runtime for building production AI agents with multi-agent orchestration, cognitive memory, multimodal RAG, built-in safety guardrails, voice pipelines, 37 channel adapters, and 21 LLM providers.',
    },
    {
      q: 'Is AgentOS free and open source?',
      a: 'Yes. The core runtime is Apache 2.0 licensed. Agent presets, extensions, and guardrails are MIT licensed.',
    },
    {
      q: 'What LLM providers are supported?',
      a: 'AgentOS supports 21 LLM providers including OpenAI, Anthropic, Google Gemini, Mistral, Cohere, Ollama, OpenRouter, and more.',
    },
    {
      q: 'How does cognitive memory work?',
      a: 'AgentOS implements 8 neuroscience-backed memory mechanisms with Ebbinghaus forgetting curves and HEXACO personality modulation.',
    },
    {
      q: 'How do I install AgentOS?',
      a: 'Install via npm: npm install @framers/agentos. Requires Node.js 18 or higher.',
    },
    {
      q: 'Does AgentOS work offline?',
      a: 'Yes. AgentOS works fully offline when paired with Ollama for local LLM inference.',
    },
    {
      q: 'Is AgentOS production-ready?',
      a: 'Yes. AgentOS blocks prompt injection, redacts personal data, moderates content in real time, and includes tool call approvals, budget limits, and circuit breakers.',
    },
    {
      q: 'Is there enterprise support?',
      a: 'Yes. Contact team@frame.dev for production deployments, enterprise licensing, and dedicated support.',
    },
    {
      q: 'What is adaptive intelligence?',
      a: 'Adaptive intelligence in AgentOS means agents continuously improve their behavior without retraining — via meta-reflective prompt adaptation, self-evaluating response quality, HEXACO personality-modulated cognition, autonomous memory consolidation, and tiered query routing.',
    },
    {
      q: 'What are emergent behaviors?',
      a: 'Emergent behaviors are capabilities agents develop at runtime — including runtime tool forging, self-improving personality traits, dynamic skill management, composable workflow creation, and tiered tool promotion for cross-agent reuse.',
    },
    {
      q: 'Can I use an LLM as a judge instead of a human?',
      a: 'Yes. AgentOS supports LLM-as-judge approval flows through hitl.llmJudge() at the agency level and the judge option on humanNode() in graph orchestration.',
    },
    {
      q: 'Can guardrails override HITL approvals?',
      a: 'Yes. When hitl.guardrailOverride is enabled, post-approval guardrails such as code-safety and pii-redaction can still block an action after HITL approval.',
    },
  ];

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  );
}

/** Section wrapper with an icon badge and collapsible group of Q&A items. */
function FAQSection({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <span
          className="inline-flex items-center justify-center w-10 h-10 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, color-mix(in oklab, var(--color-accent-primary) 20%, transparent), color-mix(in oklab, var(--color-accent-secondary) 14%, transparent))',
          }}
        >
          {icon}
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">{title}</h2>
      </div>
      <div className="space-y-5 ml-0 md:ml-13">{children}</div>
    </section>
  );
}

/** Single FAQ item rendered as a details/summary element for native expand/collapse. */
function FAQItem({ question, children }: { question: string; children: ReactNode }) {
  return (
    <details className="group rounded-2xl border border-[var(--color-border-subtle)]/60 bg-white/70 dark:bg-white/5 shadow-sm transition-shadow hover:shadow-md">
      <summary className="cursor-pointer select-none list-none px-6 py-5 text-lg font-semibold text-[var(--color-text-primary)] flex items-center justify-between gap-4">
        <span>{question}</span>
        <span
          className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] transition-transform group-open:rotate-45"
          aria-hidden="true"
        >
          +
        </span>
      </summary>
      <div className="px-6 pb-6 text-[var(--color-text-secondary)] leading-relaxed space-y-3">
        {children}
      </div>
    </details>
  );
}

/** A single academic reference row with a DOI/URL link. */
function ReferenceItem({
  label,
  title,
  detail,
  url,
}: {
  label: string;
  title: string;
  detail: string;
  url: string;
}) {
  return (
    <li className="rounded-xl border border-[var(--color-border-subtle)]/60 bg-white/70 dark:bg-white/5 p-5 space-y-1">
      <p className="text-sm font-semibold text-[var(--color-text-primary)]">{label}</p>
      <p className="text-sm italic text-[var(--color-text-secondary)]">{title}</p>
      <p className="text-xs text-[var(--color-text-secondary)]">{detail}</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-accent-primary)] hover:underline mt-1"
      >
        View source <ExternalLink className="w-3 h-3" />
      </a>
    </li>
  );
}

export default async function FAQPage({ params: { locale } }: Props) {
  const t = await getTranslations({ locale: locale as Locale, namespace: 'faq' });

  const PAPER_KEYS = [
    'ebbinghaus',
    'baddeley',
    'hexaco',
    'louvain',
    'hnsw',
    'reconsolidation',
    'rif',
    'involuntaryRecall',
  ] as const;

  return (
    <main
      id="main-content"
      className="relative overflow-x-hidden bg-[var(--color-background-primary)] text-[var(--color-text-primary)]"
    >
      <FAQJsonLd locale={locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://agentos.sh' },
              { '@type': 'ListItem', position: 2, name: 'FAQ', item: `https://agentos.sh/${locale}/faq/` },
            ],
          }),
        }}
      />

      {/* Subtle gradient backdrop matching the about page */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-accent-primary/10 to-transparent blur-3xl opacity-40" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-16">
        {/* Hero */}
        <header className="space-y-4 text-center">
          <p className="uppercase tracking-[0.5em] text-xs text-accent-primary">
            {t('sections.general')}
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight gradient-text">
            {t('title')}
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </header>

        <DiscordCTA variant="section" className="!py-0" />

        {/* ---------------------------------------------------------------- */}
        {/*  General                                                         */}
        {/* ---------------------------------------------------------------- */}
        <FAQSection
          icon={<BookOpen className="w-5 h-5 text-[var(--color-accent-primary)]" />}
          title={t('sections.general')}
        >
          <FAQItem question={t('general.whatIsAgentOS.question')}>
            <p>{t('general.whatIsAgentOS.answer')}</p>
          </FAQItem>
          <FAQItem question={t('general.isOpenSource.question')}>
            <p>{t('general.isOpenSource.answer')}</p>
          </FAQItem>
          <FAQItem question={t('general.llmProviders.question')}>
            <p>{t('general.llmProviders.answer')}</p>
          </FAQItem>
          <FAQItem question={t('general.language.question')}>
            <p>{t('general.language.answer')}</p>
          </FAQItem>
          <FAQItem question={t('general.comparison.question')}>
            <p>{t('general.comparison.answer')}</p>
          </FAQItem>
          <FAQItem question={t('general.whatIsParacosm.question')}>
            <p>{t('general.whatIsParacosm.answer')}</p>
          </FAQItem>
          <FAQItem question={t('general.whatIsWildsAi.question')}>
            <p>{t('general.whatIsWildsAi.answer')}</p>
          </FAQItem>
          <FAQItem question={t('general.whatIsWunderland.question')}>
            <p>{t('general.whatIsWunderland.answer')}</p>
          </FAQItem>
        </FAQSection>

        {/* ---------------------------------------------------------------- */}
        {/*  Technical                                                       */}
        {/* ---------------------------------------------------------------- */}
        <FAQSection
          icon={<Cpu className="w-5 h-5 text-[var(--color-accent-primary)]" />}
          title={t('sections.technical')}
        >
          <FAQItem question={t('technical.whatIsGMI.question')}>
            <p>{t('technical.whatIsGMI.answer')}</p>
          </FAQItem>
          <FAQItem question={t('technical.hexaco.question')}>
            <p>{linkCitations(t('technical.hexaco.answer'))}</p>
          </FAQItem>
          <FAQItem question={t('technical.cognitiveMemory.question')}>
            <p>{linkCitations(t('technical.cognitiveMemory.answer'))}</p>
          </FAQItem>
          <FAQItem question={t('technical.guardrails.question')}>
            <p>{t('technical.guardrails.answer')}</p>
          </FAQItem>
          <FAQItem question={t('technical.capabilityDiscovery.question')}>
            <p>{t('technical.capabilityDiscovery.answer')}</p>
          </FAQItem>
          <FAQItem question={t('technical.queryRouter.question')}>
            <p>{t('technical.queryRouter.answer')}</p>
          </FAQItem>
          <FAQItem question={t('technical.adaptiveIntelligence.question')}>
            <p>{t('technical.adaptiveIntelligence.answer')}</p>
          </FAQItem>
          <FAQItem question={t('technical.emergentBehaviors.question')}>
            <p>{t('technical.emergentBehaviors.answer')}</p>
          </FAQItem>
          <FAQItem question={t('technical.llmJudge.question')}>
            <p>{t('technical.llmJudge.answer')}</p>
          </FAQItem>
          <FAQItem question={t('technical.guardrailOverride.question')}>
            <p>{t('technical.guardrailOverride.answer')}</p>
          </FAQItem>
        </FAQSection>

        {/* ---------------------------------------------------------------- */}
        {/*  Getting Started                                                 */}
        {/* ---------------------------------------------------------------- */}
        <FAQSection
          icon={<Rocket className="w-5 h-5 text-[var(--color-accent-primary)]" />}
          title={t('sections.gettingStarted')}
        >
          <FAQItem question={t('gettingStarted.install.question')}>
            <p>{t('gettingStarted.install.answer')}</p>
            <div className="mt-2 rounded-lg bg-[var(--color-background-tertiary)] px-4 py-3 font-mono text-sm">
              npm install @framers/agentos
            </div>
          </FAQItem>
          <FAQItem question={t('gettingStarted.firstAgent.question')}>
            <p>Import the <code className="px-1.5 py-0.5 rounded bg-[var(--color-background-tertiary)] text-sm font-mono">agent</code> function and configure it with a provider, instructions, and optional personality traits:</p>
            <pre className="mt-2 rounded-lg bg-[var(--color-background-tertiary)] px-4 py-3 text-sm font-mono overflow-x-auto leading-relaxed">
{`import { agent } from '@framers/agentos'

const myAgent = agent({
  provider: 'openai',
  instructions: 'You are a helpful assistant.',
  personality: {
    openness: 0.8,
    conscientiousness: 0.9,
  },
  memory: { enabled: true },
})

const reply = await myAgent.send('Hello!')
console.log(reply.text)`}
            </pre>
          </FAQItem>
          <FAQItem question={t('gettingStarted.voice.question')}>
            <p>{t('gettingStarted.voice.answer')}</p>
          </FAQItem>
          <FAQItem question={t('gettingStarted.deploy.question')}>
            <p>{t('gettingStarted.deploy.answer')}</p>
          </FAQItem>
          <FAQItem question={t('gettingStarted.offline.question')}>
            <p>{t('gettingStarted.offline.answer')}</p>
          </FAQItem>
        </FAQSection>

        {/* ---------------------------------------------------------------- */}
        {/*  Enterprise                                                      */}
        {/* ---------------------------------------------------------------- */}
        <FAQSection
          icon={<Building2 className="w-5 h-5 text-[var(--color-accent-primary)]" />}
          title={t('sections.enterprise')}
        >
          <FAQItem question={t('enterprise.productionReady.question')}>
            <p>{t('enterprise.productionReady.answer')}</p>
          </FAQItem>
          <FAQItem question={t('enterprise.compliance.question')}>
            <p>{t('enterprise.compliance.answer')}</p>
          </FAQItem>
          <FAQItem question={t('enterprise.support.question')}>
            <p>{t('enterprise.support.answer')}</p>
            <p className="mt-2">
              <a
                href="mailto:team@frame.dev"
                className="inline-flex items-center gap-1 font-semibold text-[var(--color-accent-primary)] hover:underline"
              >
                team@frame.dev <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </p>
          </FAQItem>
          <FAQItem question={t('enterprise.selfHosted.question')}>
            <p>{t('enterprise.selfHosted.answer')}</p>
          </FAQItem>
        </FAQSection>

        {/* ---------------------------------------------------------------- */}
        {/*  Academic References                                             */}
        {/* ---------------------------------------------------------------- */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, color-mix(in oklab, var(--color-accent-primary) 20%, transparent), color-mix(in oklab, var(--color-accent-secondary) 14%, transparent))',
              }}
            >
              <GraduationCap className="w-5 h-5 text-[var(--color-accent-primary)]" />
            </span>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">
                {t('references.title')}
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {t('references.subtitle')}
              </p>
            </div>
          </div>
          <ul className="grid gap-4 md:grid-cols-2 ml-0 md:ml-13">
            {PAPER_KEYS.map((key) => (
              <ReferenceItem
                key={key}
                label={t(`references.papers.${key}.label`)}
                title={t(`references.papers.${key}.title`)}
                detail={t(`references.papers.${key}.detail`)}
                url={t(`references.papers.${key}.url`)}
              />
            ))}
          </ul>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/*  See Also                                                        */}
        {/* ---------------------------------------------------------------- */}
        <section className="rounded-3xl bg-gradient-to-r from-accent-primary/10 via-transparent to-accent-secondary/10 p-8 border border-[var(--color-border-subtle)]/60">
          <h2 className="text-2xl font-bold mb-4 text-[var(--color-text-primary)]">{t('seeAlso')}</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            <li>
              <a
                href="https://docs.agentos.sh/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[var(--color-accent-primary)] hover:underline font-semibold"
              >
                Documentation <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </li>
            <li>
              <a
                href="https://github.com/framersai/agentos"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[var(--color-accent-primary)] hover:underline font-semibold"
              >
                GitHub Repository <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </li>
            <li>
              <a
                href="https://vca.chat/faq"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[var(--color-accent-primary)] hover:underline font-semibold"
              >
                {t('links.vcaFaq')} <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </li>
            <li>
              <a
                href="https://frame.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[var(--color-accent-primary)] hover:underline font-semibold"
              >
                {t('links.frameDev')} <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
