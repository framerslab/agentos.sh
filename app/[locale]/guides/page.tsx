import Link from 'next/link';
import { BookOpen, ChevronRight, Clock, Layers, Cpu, Database, Settings, Sparkles, FileText } from 'lucide-react';
import { getAllGuides, getGuideCategories } from '../../../lib/guides';
import { canonical } from '@/lib/seo/canonical';
import { hreflangAlternates } from '@/lib/seo/hreflang';

const categoryIcons: Record<string, typeof BookOpen> = {
  Core: Layers,
  Features: Sparkles,
  Integration: Database,
  Operations: Settings,
  Advanced: Cpu,
  Reference: FileText,
  Other: BookOpen
};

const categoryColors: Record<string, string> = {
  Core: 'from-violet-500 to-purple-600',
  Features: 'from-pink-500 to-rose-600',
  Integration: 'from-blue-500 to-cyan-600',
  Operations: 'from-amber-500 to-orange-600',
  Advanced: 'from-emerald-500 to-teal-600',
  Reference: 'from-slate-500 to-gray-600',
  Other: 'from-gray-500 to-slate-600'
};

/**
 * Guide pages on docs.agentos.sh. The standalone build of this site has no
 * guide files (lib/guides.ts finds packages/agentos/docs only inside the
 * monorepo), so the page links to these instead of listing local guides.
 */
const DOCS_SITE_GUIDES: { title: string; description: string; href: string }[] = [
  { title: 'Getting Started', description: 'Install the package and run a first agent.', href: 'https://docs.agentos.sh/getting-started' },
  { title: 'Architecture Overview', description: 'The system architecture and how a request moves through it.', href: 'https://docs.agentos.sh/architecture/system-architecture' },
  { title: 'Planning Engine', description: 'How agents plan and run multi-step tasks.', href: 'https://docs.agentos.sh/features/planning-engine' },
  { title: 'Human-in-the-Loop', description: 'Approval gates and human review of agent actions.', href: 'https://docs.agentos.sh/features/human-in-the-loop' },
  { title: 'RAG & Memory', description: 'Retrieval and memory configuration.', href: 'https://docs.agentos.sh/features/rag-memory' },
  { title: 'Cognitive Memory', description: 'Memory types, decay and the eight memory mechanisms.', href: 'https://docs.agentos.sh/features/cognitive-memory' },
  { title: 'Agent Communication', description: 'Messages between agents on the communication bus.', href: 'https://docs.agentos.sh/features/agent-communication' },
  { title: 'Guardrails', description: 'The guardrail packs and how to enable them.', href: 'https://docs.agentos.sh/features/guardrails' },
  { title: 'Voice Pipeline', description: 'Streaming speech-to-text, the agent and text-to-speech in one loop.', href: 'https://docs.agentos.sh/features/voice-pipeline' },
];

type Props = {
  params: {
    locale: string;
  };
};

export async function generateMetadata({ params: { locale } }: Props) {
  const path = '/guides';
  const url = canonical(locale, path);
  return {
    title: 'Guides | AgentOS Documentation',
    description: 'AgentOS guides on architecture, planning, human-in-the-loop approvals, RAG and memory, agent communication, guardrails and voice, with the API reference.',
    alternates: {
      canonical: url,
      languages: hreflangAlternates(path),
    },
    openGraph: {
      title: 'Guides | AgentOS Documentation',
      description: 'AgentOS guides on architecture, planning, memory, guardrails and voice.',
      url,
      siteName: 'AgentOS',
      type: 'website',
    },
  };
}

export default function GuidesPage({ params }: Props) {
  const guides = getAllGuides();
  const categories = getGuideCategories();

  return (
    <div className="min-h-screen bg-[var(--color-background-primary)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-morphism mb-6">
            <BookOpen className="w-4 h-4 text-accent-primary" />
            <span className="text-sm font-semibold text-text-secondary">Documentation</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold gradient-text mb-4">Guides & Tutorials</h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            In-depth guides covering architecture, features, integrations, and best practices for building with AgentOS.
          </p>
        </div>

        {/* Quick Stats (only when this build has guide files) */}
        {guides.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
            <div className="holographic-card p-4 text-center">
              <div className="text-2xl font-bold text-[var(--color-accent-primary)]">{guides.length}</div>
              <div className="text-sm text-[var(--color-text-secondary)]">Total Guides</div>
            </div>
            <div className="holographic-card p-4 text-center">
              <div className="text-2xl font-bold text-[var(--color-accent-primary)]">{categories.length}</div>
              <div className="text-sm text-[var(--color-text-secondary)]">Categories</div>
            </div>
            <div className="holographic-card p-4 text-center">
              <div className="text-2xl font-bold text-[var(--color-accent-primary)]">TypeDoc</div>
              <div className="text-sm text-[var(--color-text-secondary)]">API Reference</div>
            </div>
          </div>
        )}

        {/* Without local guide files, link to the guides on docs.agentos.sh */}
        {guides.length === 0 && (
          <section className="mb-12">
            <div className="grid gap-4 md:grid-cols-2">
              {DOCS_SITE_GUIDES.map(guide => (
                <a
                  key={guide.href}
                  href={guide.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group holographic-card p-6 transition-all hover:scale-[1.02] hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-primary)] transition-colors mb-2">
                        {guide.title}
                      </h3>
                      <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
                        {guide.description}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent-primary)] group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Guides by Category */}
        {categories.map(category => {
          const categoryGuides = guides.filter(g => g.category === category);
          const Icon = categoryIcons[category] || BookOpen;
          const colorClass = categoryColors[category] || categoryColors.Other;

          return (
            <section key={category} className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClass} text-white`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">{category}</h2>
                <span className="text-sm text-[var(--color-text-muted)]">({categoryGuides.length} guides)</span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {categoryGuides.map(guide => (
                  <Link
                    key={guide.slug}
                    href={`/${params.locale}/guides/${guide.slug}`}
                    className="group holographic-card p-6 transition-all hover:scale-[1.02] hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-primary)] transition-colors mb-2">
                          {guide.title}
                        </h3>
                        <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
                          {guide.description}
                        </p>
                        {guide.lastModified && (
                          <div className="flex items-center gap-1 mt-3 text-xs text-[var(--color-text-muted)]">
                            <Clock className="w-3 h-3" />
                            <span>Updated {new Date(guide.lastModified).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent-primary)] group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        {/* API Reference CTA */}
        <div className="mt-16 holographic-card p-8 text-center">
          <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">Looking for API Reference?</h3>
          <p className="text-[var(--color-text-secondary)] mb-6 max-w-xl mx-auto">
            The TypeDoc reference lists the classes, functions and interfaces that @framers/agentos exports, generated from the TypeScript source.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://docs.agentos.sh/api"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] text-white font-semibold hover:brightness-110 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              API Reference
            </a>
            <a
              href="https://github.com/framerslab/agentos/tree/master/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-[var(--color-border-primary)] text-[var(--color-text-primary)] font-semibold hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)] transition-all"
            >
              View on GitHub
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
