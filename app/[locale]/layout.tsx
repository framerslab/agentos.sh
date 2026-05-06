import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import type { Viewport } from 'next';
import { ThemeProvider } from '../../components/theme-provider';
import ScrollToTopButton from '../../components/ScrollToTopButton';
import dynamic from 'next/dynamic';
import { locales, type Locale } from '../../i18n';
import { canonical } from '@/lib/seo/canonical';
import { hreflangAlternates } from '@/lib/seo/hreflang';

// Enable SSR for SiteHeader to prevent layout shift
// The component handles hydration safely
const SiteHeaderDynamic = dynamic(
  () => import('../../components/site-header').then(mod => mod.SiteHeader),
  { 
    ssr: true,
    loading: () => (
      <header className="sticky top-0 z-50 w-full border-b border-[var(--color-border-subtle)] bg-[var(--color-background-primary)]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 animate-pulse" />
            <div className="h-5 w-24 rounded bg-[var(--color-background-secondary)] animate-pulse" />
          </div>
          <div className="hidden lg:flex items-center gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-4 w-16 rounded bg-[var(--color-background-secondary)] animate-pulse" />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-[var(--color-background-secondary)] animate-pulse" />
          </div>
        </div>
      </header>
    )
  }
);

const CookieConsentDynamic = dynamic(
  () => import('../../components/ui/cookie-consent').then(mod => mod.CookieConsent),
  { ssr: false }
);

const GoogleAnalyticsDynamic = dynamic(
  () => import('../../components/analytics/GoogleAnalytics').then(mod => mod.GoogleAnalytics),
  { ssr: false }
);

const MicrosoftClarityDynamic = dynamic(
  () => import('../../components/analytics/MicrosoftClarity').then(mod => mod.MicrosoftClarity),
  { ssr: false }
);

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function resolveLocaleMetadata(locale: Locale) {
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('title'),
    description: t('description'),
    metadataBase: new URL('https://agentos.sh'),
    alternates: {
      canonical: canonical(locale, '/'),
      languages: hreflangAlternates('/'),
    },
    keywords: [
      'AgentOS',
      'agentos',
      'AI agent framework',
      'TypeScript AI agent framework',
      'AI agent SDK TypeScript',
      'open source AI agent framework',
      'build AI agents',
      'build AI agents TypeScript',
      'AI agent engineering platform',
      'autonomous AI agents',
      'production-ready AI agents',
      'multi-agent orchestration',
      'multi-agent system',
      'agentic AI framework',
      'agentic workflows',
      'agent simulation framework',
      'AI agent simulation',
      'cognitive AI agent',
      'AI agent memory system',
      'adaptive intelligence',
      'emergent behaviors',
      'AI guardrails',
      'prompt injection defense',
      'cognitive memory',
      'multimodal RAG',
      'RAG pipeline TypeScript',
      'voice AI agents',
      'AI agent orchestration patterns',
      'graph orchestration',
      'AI workflow automation',
      'self-hosted AI agents',
      'agent runtime',
      'runtime tool forging',
      'self-improving agents',
      'type-safe AI agents',
      'LangGraph alternative',
      'CrewAI alternative',
      'AutoGen alternative',
      'Mastra alternative',
      'VoltAgent alternative',
      'Vercel AI SDK alternative',
      'OpenAI Agents SDK alternative',
    ],
    authors: [{ name: 'Frame.dev', url: 'https://frame.dev' }],
    creator: 'Frame.dev',
    publisher: 'Frame.dev',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/icon-128.png', sizes: '128x128', type: 'image/png' },
        { url: '/icon-256.png', sizes: '256x256', type: 'image/png' },
        { url: '/icon-512.png', sizes: '512x512', type: 'image/png' }
      ],
      shortcut: [{ url: '/favicon.svg' }],
      apple: [
        { url: '/icon-256.png', sizes: '256x256', type: 'image/png' }
      ]
    },
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url: canonical(locale, '/'),
      siteName: 'AgentOS',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'AgentOS - Build Autonomous AI Agents with Adaptive Intelligence'
        }
      ],
      locale: locale === 'en' ? 'en_US' : locale,
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: t('twitterTitle'),
      description: t('twitterDescription'),
      creator: '@framersai',
      site: '@framersai',
      images: ['/og-image.png']
    },
    // TODO: Add real verification codes when obtained
    // verification: {
    //   google: 'real-google-site-verification-code',
    //   yandex: 'real-yandex-verification-code',
    // }
  };
}

export async function generateMetadata({ params: { locale } }: Props) {
  return resolveLocaleMetadata(locale as Locale);
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: Props) {
  if (!locales.includes(locale as Locale)) notFound();

  const tFooter = await getTranslations({ locale: locale as Locale, namespace: 'footer' });
  const tNav = await getTranslations({ locale: locale as Locale, namespace: 'nav' });

  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <ThemeProvider>
        {/* Preconnect to critical external origins — limit to 4 max */}
        <link rel="preconnect" href="https://api.github.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://img.shields.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.npmjs.org" />
        <link rel="dns-prefetch" href="https://static.cloudflareinsights.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
        {/* JSON-LD Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'AgentOS',
              alternateName: ['AgentOS Framework', 'AgentOS Runtime', 'AgentOS by Manic Agency'],
              description: 'Open-source TypeScript AI agent framework. Build autonomous agents with cognitive memory, runtime tool generation, multi-agent orchestration, multimodal RAG, voice pipelines, and 21 LLM providers.',
              url: 'https://agentos.sh',
              applicationCategory: 'DeveloperApplication',
              applicationSubCategory: 'AI Agent Framework',
              operatingSystem: 'Any',
              programmingLanguage: 'TypeScript',
              keywords: 'TypeScript AI agent framework, AI agent runtime, open-source agent framework, multi-agent orchestration, cognitive memory, agent SDK, autonomous agents, AgentOS',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                description: 'Free and open-source (Apache 2.0)',
              },
              author: {
                '@type': 'Organization',
                name: 'Manic Agency LLC',
                url: 'https://manic.agency',
              },
              downloadUrl: 'https://www.npmjs.com/package/@framers/agentos',
              installUrl: 'https://www.npmjs.com/package/@framers/agentos',
              softwareVersion: '0.1.x',
              license: 'https://opensource.org/licenses/Apache-2.0',
              image: 'https://agentos.sh/og-image.png',
              screenshot: 'https://agentos.sh/og-image.png',
              featureList: [
                'TypeScript-first AI agent framework',
                'Multi-agent orchestration with 6 collaboration strategies',
                'Cognitive memory with Ebbinghaus decay and reconsolidation',
                'Runtime tool generation: agents write their own functions mid-task',
                'Specialist spawning: spawn_specialist mints new agents at runtime',
                'Multimodal RAG (text, image, audio, video)',
                '21 LLM providers (OpenAI, Anthropic, Google, Ollama, OpenRouter)',
                '37 channel adapters (Telegram, WhatsApp, Discord, Slack)',
                'Built-in safety: PII redaction, prompt injection defense, content moderation',
                'HEXACO personality system',
                'Voice pipeline (STT, TTS, VAD)',
                '80+ curated skills and extensions',
                'Self-hostable, production-ready, Apache 2.0',
              ],
              sameAs: [
                'https://github.com/framersai/agentos',
                'https://www.npmjs.com/package/@framers/agentos',
                'https://docs.agentos.sh',
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Manic Agency LLC',
              url: 'https://manic.agency',
              logo: 'https://agentos.sh/logo.png',
              email: 'mailto:team@frame.dev',
              sameAs: [
                'https://github.com/manicinc',
                'https://github.com/framersai',
                'https://frame.dev',
                'https://twitter.com/framersai',
                'https://www.linkedin.com/company/framersai',
                'https://vca.chat',
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'AgentOS',
              url: 'https://agentos.sh',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://docs.agentos.sh/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />

        {/* Analytics with consent integration */}
        <GoogleAnalyticsDynamic />
        <MicrosoftClarityDynamic />
        <CookieConsentDynamic />
        <a href="#main-content" className="skip-to-content">Skip to content</a>
        <SiteHeaderDynamic />
        {/* Duplicate JSON-LD removed — consolidated in head above */}
        
        {/* The theme is bootstrapped by an inline <script> in the
            root layout's <head> (app/layout.tsx). It reads the
            'agentos-mode' and 'agentos-theme' localStorage keys
            synchronously before <body> paints, so there is no FOIT.
            next-themes (mounted in <ThemeProvider> below) keeps the
            theme reactive to subsequent toggles. The old 'theme'
            localStorage key is no longer used. */}

        {/* Scroll to hash target after lazy sections mount */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (window.location.hash) {
                  var id = window.location.hash.slice(1);
                  var attempts = 0;
                  var poll = setInterval(function() {
                    var el = document.getElementById(id);
                    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); clearInterval(poll); }
                    if (++attempts >= 20) clearInterval(poll);
                  }, 200);
                }
              } catch(e) {}
            `
          }}
        />

        <main id="main-content" tabIndex={-1} className="focus:outline-none scroll-mt-24">{children}</main>
        <ScrollToTopButton />
        <footer className="border-t border-purple-200/30 dark:border-purple-500/20 bg-gradient-to-br from-white/90 via-purple-50/30 to-pink-50/30 dark:from-black/80 dark:via-purple-950/40 dark:to-pink-950/40 backdrop-blur-lg py-12">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-text-primary mb-3">AgentOS</h3>
                <p className="text-sm text-text-secondary mb-3">
                  {tFooter('tagline')}
                </p>
                <div className="flex gap-3">
                  <a href="https://github.com/framersai" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors" aria-label="FramersAI on GitHub">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    <span className="sr-only">GitHub</span>
                  </a>
                  <a href="https://www.linkedin.com/company/framersai" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors" aria-label="FramersAI on LinkedIn">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    <span className="sr-only">LinkedIn</span>
                  </a>
                  <a href="https://twitter.com/framersai" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors" aria-label="FramersAI on Twitter">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                    <span className="sr-only">Twitter</span>
                  </a>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-text-primary mb-3">{tFooter('resources')}</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="https://docs.agentos.sh" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors">{tFooter('docsGuides')}</a></li>
                  <li><a href="https://docs.agentos.sh/api" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors">{tFooter('apiReferenceTSDoc')}</a></li>
                  <li><a href={`/${locale}/#code`} className="text-text-secondary hover:text-accent-primary transition-colors">{tFooter('examples')}</a></li>
                  <li><a href="https://github.com/framersai/agentos/releases" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors">{tFooter('releaseNotes')}</a></li>
                  <li><a href="https://github.com/framersai/agentos" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors">{tNav('github')}</a></li>
                  <li><a href="https://discord.gg/usEkfCeQxs" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors">{tFooter('discord')}</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-text-primary mb-3">{tFooter('company')}</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="https://manic.agency" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors">Manic Agency</a></li>
                  <li><a href="https://frame.dev" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors">Frame.dev</a></li>
                  <li><a href="https://wilds.ai" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors">Wilds.ai</a></li>
                  <li><a href="https://paracosm.agentos.sh" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors">Paracosm</a></li>
                  <li><a href={`/${locale}/about`} className="text-text-secondary hover:text-accent-primary transition-colors">{tNav('about')}</a></li>
                  <li><a href={`/${locale}/faq`} className="text-text-secondary hover:text-accent-primary transition-colors">{tNav('faq')}</a></li>
                  <li><a href={`/${locale}/contact`} className="text-text-secondary hover:text-accent-primary transition-colors">{tFooter('contact')}</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-text-primary mb-3">{tFooter('legal')}</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href={`/${locale}/legal/terms`} className="text-text-secondary hover:text-accent-primary transition-colors">{tFooter('terms')}</a></li>
                  <li><a href={`/${locale}/legal/privacy`} className="text-text-secondary hover:text-accent-primary transition-colors">{tFooter('privacy')}</a></li>
                  <li><a href={`/${locale}/legal/security`} className="text-text-secondary hover:text-accent-primary transition-colors">Security</a></li>
                  <li><a href={`/${locale}/legal/cookies`} className="text-text-secondary hover:text-accent-primary transition-colors">Cookies</a></li>
                  <li><span className="text-text-secondary">{tFooter('license')}</span></li>
                </ul>
              </div>
            </div>
            <div className="pt-6 border-t border-purple-200/30 dark:border-purple-500/20 text-center">
              <p className="text-text-secondary">{tFooter('copyright', { 
                year: new Date().getFullYear() 
              })}</p>
            </div>
          </div>
        </footer>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}

