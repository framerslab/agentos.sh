'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Github, ExternalLink, Package,
  Puzzle, Database, Users, BookOpen,
  Terminal, Brain, Code2, GitBranch, Globe
} from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { loadPublicStats } from '@/lib/public-stats'

interface Repository {
  name: string
  description: string
  url: string
  category: 'core' | 'tools' | 'apps' | 'infrastructure' | 'community'
  icon: React.ElementType
  language?: string
  stars?: number
  status: 'stable' | 'beta' | 'experimental'
  lastUpdated?: string
}

type LiveStats = {
  repos: number
  stars: number | null
  downloads: number | null
  loading: boolean
}

type RepoStat = {
  stars: number
  updatedAt: string
}

const repositories: Repository[] = [
  /* ── Core Frameworks ─────────────────────────────────────────────── */
  {
    name: 'AgentOS',
    description: 'TypeScript runtime for adaptive AI agent intelligence. Core framework for building autonomous agents.',
    url: 'https://github.com/framersai/agentos',
    category: 'core',
    icon: Brain,
    language: 'TypeScript',
    status: 'stable',
    lastUpdated: '12 hours ago'
  },
  {
    name: 'Paracosm',
    description: 'AI agent swarm simulation engine. Emergent tool forging, HEXACO personality evolution, deterministic divergence kernels. Built on AgentOS.',
    url: 'https://github.com/framersai/paracosm',
    category: 'core',
    icon: Globe,
    language: 'TypeScript',
    status: 'stable',
    lastUpdated: 'recently'
  },
  {
    name: 'AgentOS Skills',
    description: '88 curated SKILL.md prompt modules -- web search, coding, research, social media, and more. Data-only package with zero runtime dependencies.',
    url: 'https://github.com/framersai/agentos-skills',
    category: 'core',
    icon: BookOpen,
    language: 'Markdown',
    status: 'stable',
    lastUpdated: 'recently'
  },
  {
    name: 'AgentOS Extensions',
    description: '45+ tool extensions, channel adapters, voice providers, and browser automation packs.',
    url: 'https://github.com/framersai/agentos-extensions',
    category: 'core',
    icon: Puzzle,
    language: 'TypeScript',
    status: 'stable',
    lastUpdated: '6 hours ago'
  },

  /* ── Infrastructure ──────────────────────────────────────────────── */
  {
    name: 'SQL Storage Adapter',
    description: `Universal SQL storage for cross-platform builds with smart fallbacks and syncing.${process.env.NEXT_PUBLIC_SQL_ADAPTER_VERSION ? ` Latest: v${process.env.NEXT_PUBLIC_SQL_ADAPTER_VERSION}` : ''}`,
    url: 'https://github.com/framersai/sql-storage-adapter',
    category: 'infrastructure',
    icon: Database,
    language: 'TypeScript',
    status: 'stable',
    lastUpdated: '12 hours ago'
  },
  {
    name: 'AgentOS Skills Registry',
    description: 'Catalog SDK -- SKILLS_CATALOG, query helpers, factories, and workspace discovery for lazy-loading skills into agents.',
    url: 'https://github.com/framersai/agentos-skills-registry',
    category: 'infrastructure',
    icon: Package,
    language: 'TypeScript',
    status: 'stable',
    lastUpdated: 'recently'
  },
  {
    name: 'AgentOS Extensions Registry',
    description: 'Extension catalog -- channel, tool, and provider metadata with createCuratedManifest() for dynamic loading.',
    url: 'https://github.com/framersai/agentos-extensions-registry',
    category: 'infrastructure',
    icon: Package,
    language: 'TypeScript',
    status: 'stable',
    lastUpdated: 'recently'
  },

  /* ── Tools ───────────────────────────────────────────────────────── */
  {
    name: 'AgentOS Workbench',
    description: 'Developer cockpit for AgentOS sessions: inspect personas, debug tool calls, and replay streaming transcripts.',
    url: 'https://github.com/framersai/agentos-workbench',
    category: 'tools',
    icon: Terminal,
    language: 'TypeScript',
    status: 'stable',
    lastUpdated: 'yesterday'
  },

  /* ── Apps ─────────────────────────────────────────────────────────── */
  {
    name: 'Wunderland',
    description: 'Wunderbot SDK + autonomous agent social network (wunderland.sh). Built on AgentOS.',
    url: 'https://wunderland.sh',
    category: 'apps',
    icon: Globe,
    language: 'TypeScript',
    status: 'beta',
    lastUpdated: 'recently'
  },
  {
    name: 'AgentOS.sh',
    description: 'Marketing site and documentation hub for AgentOS. This website!',
    url: 'https://github.com/framersai/agentos.sh',
    category: 'apps',
    icon: BookOpen,
    language: 'TypeScript',
    status: 'stable',
    lastUpdated: '48 minutes ago'
  },

  /* ── Community ───────────────────────────────────────────────────── */
  {
    name: 'Discussions',
    description: 'Public discourse forum for the Framers community. Ask questions and share ideas.',
    url: 'https://github.com/framersai/discussions',
    category: 'community',
    icon: Users,
    status: 'stable',
    lastUpdated: '3 days ago'
  }
]

const CATEGORY_COLORS: Record<string, string> = {
  core: 'from-blue-500 to-cyan-500',
  tools: 'from-purple-500 to-pink-500',
  apps: 'from-green-500 to-emerald-500',
  infrastructure: 'from-orange-500 to-red-500',
  community: 'from-indigo-500 to-purple-500'
}

export function EcosystemSection() {
  const t = useTranslations('ecosystem')
  const locale = useLocale()
  const [liveStats, setLiveStats] = useState<LiveStats>({
    repos: repositories.length,
    stars: null,
    downloads: null,
    loading: true
  })
  const [repoStats, setRepoStats] = useState<Record<string, RepoStat>>({})

  useEffect(() => {
    let cancelled = false
    // Read from the build-time-generated /stats.json blob via the shared
    // loader (in-process + localStorage + HTTP cache layers). Avoids the
    // unauthenticated GitHub API rate limit that was 403-ing every visitor.
    loadPublicStats().then((blob) => {
      if (cancelled) return
      const orgRepos: { stargazers_count?: number; fork?: boolean; stars?: number }[] =
        (blob?.orgRepos as { stargazers_count?: number; fork?: boolean; stars?: number }[]) ?? []
      const realRepos = orgRepos.filter((r) => !r.fork)
      const stars = realRepos.reduce(
        (sum, repo) => sum + (repo.stars ?? repo.stargazers_count ?? 0),
        0,
      )
      const repoCount = realRepos.length || repositories.length

      const npm = blob?.npm ?? {}
      const total = Object.values(npm).reduce<number>(
        (sum, v) => sum + (typeof v === 'number' ? v : 0),
        0,
      )
      const downloads = total > 0 ? total : null

      setLiveStats({
        repos: repoCount,
        stars,
        downloads,
        loading: false,
      })
    }).catch(() => {
      if (!cancelled) setLiveStats((prev) => ({ ...prev, loading: false }))
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const slugs = Array.from(
      new Set(
        repositories
          .map((repo) => repo.url.match(/github.com\/framersai\/([^/]+)/)?.[1])
          .filter((slug): slug is string => Boolean(slug))
      )
    )

    const fetchRepoStats = async () => {
      try {
        const blob = await loadPublicStats()
        // Build a lookup over BOTH the curated repo entries and the org-wide list
        // so per-card stats are populated regardless of which list a slug is in.
        const lookup: Record<string, { stars?: number; pushedAt?: string }> = {}
        for (const r of (blob?.orgRepos ?? [])) {
          if (r?.name) lookup[r.name] = { stars: r.stars, pushedAt: r.pushedAt }
        }
        if (blob?.repos) {
          for (const slug of Object.keys(blob.repos)) {
            const r = blob.repos[slug]
            const name = slug.split('/').pop() ?? slug
            lookup[name] = { stars: r?.stars, pushedAt: r?.pushedAt }
          }
        }
        const responses = slugs.map((slug) => {
          const entry = lookup[slug]
          if (!entry) return null
          return {
            slug,
            stars: entry.stars ?? 0,
            updatedAt: entry.pushedAt ?? new Date().toISOString(),
          }
        })
        if (!cancelled) {
          const next: Record<string, RepoStat> = {}
          responses.forEach((entry) => {
            if (!entry) return
            next[entry.slug] = { stars: entry.stars, updatedAt: entry.updatedAt }
          })
          setRepoStats(next)
        }
      } catch {
        // swallow; we already have fallback copy
      }
    }
    fetchRepoStats()
    return () => {
      cancelled = true
    }
  }, [])

  const statsConfig = [
    { label: t('stats.repositories'), value: liveStats.repos, icon: GitBranch },
    { label: t('stats.weeklyDownloads'), value: liveStats.downloads, icon: Package },
    { label: t('stats.githubStars'), value: liveStats.stars, icon: Github }
  ] as const

  const formatNumber = (value: number | null) => {
    if (value === null || Number.isNaN(value)) return null
    return new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(value)
  }

  const categoryInfo = useMemo(() => ({
    core: { title: t('categories.core.title'), description: t('categories.core.description'), color: CATEGORY_COLORS.core },
    infrastructure: { title: t('categories.infrastructure.title'), description: t('categories.infrastructure.description'), color: CATEGORY_COLORS.infrastructure },
    tools: { title: t('categories.tools.title'), description: t('categories.tools.description'), color: CATEGORY_COLORS.tools },
    apps: { title: t('categories.apps.title'), description: t('categories.apps.description'), color: CATEGORY_COLORS.apps },
    community: { title: t('categories.community.title'), description: t('categories.community.description'), color: CATEGORY_COLORS.community }
  }), [t])

  return (
    <section className="py-12 sm:py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-theme" aria-labelledby="ecosystem-heading">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, var(--color-accent-primary) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 id="ecosystem-heading" className="text-4xl sm:text-5xl font-bold mb-4 leading-[1.2] pb-2 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-accent-primary dark:to-accent-secondary bg-clip-text text-transparent">
            {t('title')}
          </h2>
          <p className="text-lg text-text-muted max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Quick Stats with real-time data */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {statsConfig.map((stat, i) => {
            const StatIcon = stat.icon
            const formatted = formatNumber(stat.value)
            const displayValue = formatted ?? (liveStats.loading ? '…' : '—')
            return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-background-glass backdrop-blur-md rounded-xl p-6 border border-border-subtle text-center"
            >
              <StatIcon className="w-8 h-8 mx-auto mb-2 text-accent-primary" />
              <div className="text-2xl font-bold text-text-primary">{displayValue}</div>
              <div className="text-sm text-text-muted">{stat.label}</div>
            </motion.div>
          )})}
        </div>

        {/* Repository Grid by Category */}
        {Object.entries(categoryInfo).map(([category, info]) => {
          const categoryRepos = repositories.filter(r => r.category === category)
          if (categoryRepos.length === 0) return null

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${info.color}`} />
                <div>
                  <h3 className="text-2xl font-bold text-text-primary">{info.title}</h3>
                  <p className="text-sm text-text-muted">{info.description}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryRepos.map((repo, index) => (
                  <motion.a
                    key={repo.name}
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative bg-background-glass backdrop-blur-md rounded-xl p-6 border border-border-subtle hover:border-accent-primary transition-all duration-300 hover:shadow-neumorphic-hover"
                  >
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        repo.status === 'stable' ? 'bg-green-500/10 text-green-500' :
                        repo.status === 'beta' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-purple-500/10 text-purple-500'
                      }`}>
                        {repo.status}
                      </span>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${info.color} opacity-10 group-hover:opacity-20 transition-opacity`}>
                        <repo.icon className="w-6 h-6 text-accent-primary" />
                      </div>

                      <div className="flex-1">
                        <h4 className="font-semibold text-text-primary mb-1 flex items-center gap-2">
                          {repo.name}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h4>
                        <p className="text-sm text-text-muted line-clamp-2 mb-3">
                          {repo.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
                          {repo.language && (
                            <span className="flex items-center gap-1">
                              {(() => {
                                const colorVars = ['var(--color-accent-primary)', 'var(--color-accent-secondary)', 'var(--color-success)', 'var(--color-warning)', 'var(--color-error)']
                                const dotColor = colorVars[index % colorVars.length]
                                return <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor }} />
                              })()}
                              {repo.language}
                            </span>
                          )}
                          {(() => {
                            const slug = repo.url.match(/github.com\/framersai\/([^/]+)/)?.[1]
                            const live = slug ? repoStats[slug] : undefined
                            const starsDisplay = live?.stars != null ? formatNumber(live.stars) : null
                            const updatedDisplay = live?.updatedAt
                              ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(live.updatedAt))
                              : repo.lastUpdated
                            return (
                              <>
                                {starsDisplay && (
                                  <span className="flex items-center gap-1">
                                    <Github className="w-3 h-3" />
                                    {starsDisplay} {t('starsSuffix')}
                                  </span>
                                )}
                                {updatedDisplay && (
                                  <span>{t('updatedLabel', { date: updatedDisplay })}</span>
                                )}
                              </>
                            )
                          })()}
                        </div>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )
        })}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center p-8 rounded-3xl bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 border border-accent-primary/20"
        >
          <h3 className="text-2xl font-bold mb-3">{t('cta.title')}</h3>
          <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
            {t('cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://github.com/framersai"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-background-primary rounded-xl font-semibold border-2 border-accent-primary hover:bg-accent-primary/10 transition-all flex items-center justify-center gap-2"
            >
              <Github className="w-5 h-5" />
              {t('cta.followOnGithub')}
            </a>
            <a
              href="https://wilds.ai/discord"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-accent-primary dark:to-accent-secondary rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2 border border-purple-500/20"
            >
              <Users className="w-5 h-5" />
              {t('cta.joinDiscord')}
            </a>
            <a
              href="https://github.com/framersai/agentos"
              className="px-6 py-3 bg-background-glass backdrop-blur-md rounded-xl font-semibold border border-border-interactive hover:border-accent-primary transition-all flex items-center justify-center gap-2"
            >
              <Code2 className="w-5 h-5" />
              {t('cta.contributeCode')}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
