'use client';

import { useCallback, useEffect, useMemo, useState, memo } from 'react';
import { ArrowRight, Github, Terminal, Star, GitBranch, Shield, Check, Code2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
// Toast removed — copy feedback is inline (icon swap + text change)
import { LinkButton } from '../ui/LinkButton';
import { Button } from '../ui/Button';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { applyVisualTheme } from '@/lib/visual-design-system';
import { loadPublicStats } from '@/lib/public-stats';
import { useTheme } from 'next-themes';

// Lazy load heavy animation components - deferred for better LCP
const ResponsiveNeuralConstellation = dynamic(() => import('../hero/neural-constellation').then(m => ({ default: m.ResponsiveNeuralConstellation })), {
  ssr: false,
  loading: () => null
});

const ParticleMorphText = dynamic(() => import('../hero/particle-morph-text').then(m => ({ default: m.ParticleMorphText })), {
  ssr: false,
  loading: () => null
});

const HeroSectionInner = memo(function HeroSectionInner() {
  const t = useTranslations('hero');
  const locale = useLocale();
  const { theme: currentTheme, resolvedTheme } = useTheme();
  const { copied: showToast, copy: copyToClipboard } = useCopyToClipboard();
  const [githubStars, setGithubStars] = useState<number | null>(null);
  const [githubForks, setGithubForks] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [morphFontSize, setMorphFontSize] = useState(40);
  const isDark = resolvedTheme === 'dark';

  // Mark as mounted after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Match ParticleMorphText font size to the CSS clamp breakpoints used
  // on the H1 (text-[28px] sm:text-[36px] lg:text-[48px]). The canvas
  // fills the invisible text box, so the canvas font size must track the
  // CSS one or the morph clips/floats away from the surrounding inline
  // copy ("intelligence", "agents").
  useEffect(() => {
    if (!mounted) return;
    const update = () => {
      const w = window.innerWidth;
      setMorphFontSize(w >= 1024 ? 48 : w >= 640 ? 36 : 28);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const themeMap: Record<string, string> = {
      'sakura-sunset': 'sakura-sunset', 'twilight-neo': 'twilight-neo',
      'aurora-daybreak': 'aurora-daybreak', 'warm-embrace': 'warm-embrace', 'retro-terminus': 'retro-terminus'
    };
    applyVisualTheme(themeMap[currentTheme || ''] || 'aurora-daybreak', isDark);
  }, [currentTheme, isDark, mounted]);

  const productStats = useMemo(() => [
    { label: t('stats.githubStars'), value: githubStars ?? '—', icon: Star },
    { label: t('stats.forks'), value: githubForks ?? '—', icon: GitBranch }
  ], [githubStars, githubForks, t]);

  // Read GitHub stats from the build-time-generated /stats.json blob via the
  // shared loader (which adds in-process + localStorage layers on top of the
  // browser HTTP cache). Avoids the api.github.com 403 storm that hit every
  // visitor at the unauthenticated 60/hr/IP rate limit.
  useEffect(() => {
    let cancelled = false;
    loadPublicStats().then(blob => {
      if (cancelled) return;
      const repo = blob?.repos?.['framersai/agentos'];
      if (repo && typeof repo.stars === 'number') {
        setGithubStars(repo.stars);
        setGithubForks(repo.forks ?? null);
      }
    });
    return () => { cancelled = true; };
  }, []);

  const copyCommand = useCallback(() => {
    copyToClipboard('npm install @framers/agentos');
  }, [copyToClipboard]);

  const highlights = [
    { title: 'Agents that write their own tools', detail: 'Mid-task TS function generation, judge-approved, sandboxed' },
    { title: 'Specialist spawning', detail: 'spawn_specialist mints new agents at runtime' },
    { title: 'Cognitive memory', detail: 'Ebbinghaus decay, reconsolidation, neuroscience-grounded' },
    { title: '85.6% LongMemEval-S', detail: '0.4 below Emergence.ai (closed SaaS), +1.4 above Mastra' }
  ];


  return (
    <section className="relative min-h-screen flex items-center bg-[var(--color-background-primary)] overflow-hidden" itemScope itemType="https://schema.org/SoftwareApplication">
      <meta itemProp="name" content="AgentOS" />
      <meta itemProp="applicationCategory" content="AI Framework" />
      <meta itemProp="operatingSystem" content="Any" />
      
      {/* Skeleton overlay removed — hero text renders immediately for faster LCP */}
      
      {/* Background gradient - CSS only */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 100% 80% at 70% 30%, rgba(139,92,246,0.12) 0%, transparent 50%)'
            : 'radial-gradient(ellipse 100% 80% at 70% 30%, rgba(139,92,246,0.06) 0%, transparent 50%)'
        }}
        aria-hidden="true"
      />

      {/* Neural Constellation - right side, single responsive instance */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15 sm:opacity-25 lg:opacity-40"
        style={{ marginLeft: 'calc(15% + 40px)', marginTop: '-8%' }} 
        aria-hidden="true"
      >
        <ResponsiveNeuralConstellation />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-18">
        <article className="max-w-2xl">
          {/* Reserve the H1's rendered height up-front so the canvas
              hydrate doesn't reflow the rest of the page. Two lines of
              text at leading-1.2: 28px*2.4=68px mobile, 36px*2.4=87px,
              48px*2.4=116px desktop. Slight overshoot is intentional —
              undershoot causes CLS, overshoot is just whitespace. */}
          <h1
            className="font-bold tracking-tight mb-3 text-[28px] sm:text-[36px] lg:text-[48px] leading-[1.2] min-h-[72px] sm:min-h-[92px] lg:min-h-[120px]"
            itemProp="name"
          >
            {/* Visually-hidden full-text H1 for crawlers and screen readers.
                The aria-hidden canvas siblings render the visual particle
                morph between "Emergent" and "Adaptive"; this sr-only span
                guarantees the full string is in the DOM regardless of
                canvas hydration state, and keeps the H1 text accessible
                to screen readers (the morph is decorative). */}
            <span className="sr-only">Emergent intelligence for adaptive agents</span>
            <span aria-hidden="true">
              <ParticleMorphText words={['Emergent', 'Adaptive']} interval={4000} fontSize={morphFontSize} gradientFrom={isDark ? '#7b66ff' : '#6024f3'} gradientTo={isDark ? '#d27bfc' : '#a538e5'} startIndex={0} />
              <span className="text-[var(--color-text-primary)]">intelligence</span>
              <br />
              <span className="text-[var(--color-text-secondary)]">for </span>
              <ParticleMorphText words={['adaptive', 'emergent']} interval={5200} fontSize={morphFontSize} gradientFrom={isDark ? '#d27bfc' : '#a538e5'} gradientTo={isDark ? '#f87bb8' : '#f25b8c'} startIndex={0} nudgeY={0.04} />
              <span className="text-[var(--color-text-primary)]">agents</span>
            </span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-primary)] mb-3">
            Open-source TypeScript AI agent framework
          </p>

          <p className="sr-only">
            AgentOS is an open-source TypeScript AI agent framework for building production-ready autonomous agents with multi-agent orchestration, cognitive memory, multimodal RAG, AI guardrails, voice pipelines, and 21 LLM providers. A type-safe alternative to LangGraph, CrewAI, Mastra, and AutoGen.
          </p>

          <p className="text-sm sm:text-base text-[var(--color-text-secondary)] mb-4 max-w-lg" itemProp="abstract">
            {t('subtitle')}
          </p>

          {/* CTAs */}
          <nav className="flex flex-wrap gap-2 mb-4" aria-label="Primary actions">
            <LinkButton href="https://docs.agentos.sh/getting-started" variant="primary" size="lg" className="group text-sm">
              {t('getStarted')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </LinkButton>
            <a href="https://github.com/framersai/agentos" target="_blank" rel="noopener noreferrer" 
               className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] dark:text-white font-medium text-sm hover:border-[var(--color-accent-primary)] hover:bg-[var(--color-background-elevated)] transition-all"
               itemProp="codeRepository">
              <Github className="w-4 h-4 text-[var(--color-text-primary)]" aria-hidden="true" />
              <span className="text-[var(--color-text-primary)]">View on GitHub</span>
            </a>
          </nav>

          {/* Install command + scroll CTA */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Button type="button" onClick={copyCommand} variant="secondary" className="gap-2 text-xs sm:text-sm">
              {showToast ? (
                <Check className="w-4 h-4 text-green-400" aria-hidden="true" />
              ) : (
                <Terminal className="w-4 h-4 text-[var(--color-accent-primary)]" aria-hidden="true" />
              )}
              <code className="font-mono">{showToast ? 'Copied!' : 'npm install @framers/agentos'}</code>
            </Button>
            <a href="#code"
               className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold border border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)]/20 transition-all cursor-pointer group">
              <Code2 className="w-4 h-4" aria-hidden="true" />
              See code examples
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 mb-3" aria-label="GitHub statistics">
            {productStats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-1.5 text-sm">
                <stat.icon className="w-4 h-4 text-[var(--color-accent-primary)]" aria-hidden="true" />
                <span className="font-semibold text-[var(--color-text-primary)]">{stat.value}</span>
                <span className="text-[var(--color-text-muted)]">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Badges - hidden on mobile to reduce external requests, explicit dimensions to prevent CLS */}
          <div className="hidden sm:flex flex-wrap gap-2 mb-5" aria-label="Package badges">
            <a href="https://www.npmjs.com/package/@framers/agentos" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://img.shields.io/npm/v/@framers/agentos?logo=npm&color=cb3837" alt="npm version" width={106} height={20} className="h-5 w-auto" loading="lazy" decoding="async" />
            </a>
            <a href="https://codecov.io/gh/framersai/agentos" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://img.shields.io/codecov/c/github/framersai/agentos?logo=codecov" alt="test coverage" width={120} height={20} className="h-5 w-auto" loading="lazy" decoding="async" />
            </a>
            <a href="https://github.com/framersai/agentos/actions/workflows/ci.yml" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://img.shields.io/github/actions/workflow/status/framersai/agentos/ci.yml?logo=github" alt="CI status" width={100} height={20} className="h-5 w-auto" loading="lazy" decoding="async" />
            </a>
            <a href="https://github.com/framersai/agentos/actions/workflows/ci.yml" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://img.shields.io/badge/tests-3%2C866%2B_passed-2ea043?logo=vitest&logoColor=white" alt="tests" width={134} height={20} className="h-5 w-auto" loading="lazy" decoding="async" />
            </a>
            <span className="hover:opacity-80 transition-opacity">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://img.shields.io/badge/TypeScript-5.4+-3178c6?logo=typescript&logoColor=white" alt="TypeScript" width={120} height={20} className="h-5 w-auto" loading="lazy" decoding="async" />
            </span>
            <a href="https://github.com/framersai/agentos/blob/master/LICENSE" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://img.shields.io/badge/License-Apache_2.0-blue?logo=apache&logoColor=white" alt="Apache 2.0 License" width={128} height={20} className="h-5 w-auto" loading="lazy" decoding="async" />
            </a>
          </div>

          {/* Features — click navigates to /features. The first card highlights
              the headline differentiator (runtime tool generation) with the
              brand gradient on its title; the others stay plain so the visual
              hierarchy reads as one lead + three supporting facts. */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2" role="group" aria-label="Key features">
            {highlights.map((h, i) => {
              const featuresHref = `/${locale}/features`;
              return (
                <a key={h.title}
                    href={featuresHref}
                    className="p-2 rounded-md bg-[var(--color-background-secondary)]/40 border border-[var(--color-border-subtle)]/30 cursor-pointer hover:border-[var(--color-accent-secondary)]/50 hover:bg-[var(--color-accent-primary)]/5 transition-all text-left block">
                  <div className={`text-xs font-medium ${i === 0 ? 'brand-gradient-text' : 'text-[var(--color-text-primary)]'}`}>{h.title}</div>
                  <div className="text-[10px] text-[var(--color-text-muted)]">{h.detail}</div>
                </a>
              );
            })}
          </div>

          {/* Compliance badges */}
          <div className="mt-4 flex items-center gap-3 text-[10px] text-[var(--color-text-muted)]">
            <span className="flex items-center gap-1"><Shield className="w-3 h-3" aria-hidden="true" />{t('compliance.gdpr')}</span>
            <span aria-hidden="true">•</span>
            <span>{t('compliance.soc2')}</span>
          </div>
        </article>
      </div>

      {/* No toast — copy feedback is inline via icon swap in the button */}
    </section>
  );
});

export function HeroSection() {
  return <HeroSectionInner />;
}
