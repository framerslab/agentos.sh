'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import {
  Brain,
  Layers,
  Database,
  Zap,
  Shield,
  Mic,
  Server,
  Globe,
  Puzzle,
  Network,
  AudioWaveform,
  Fingerprint,
  Activity,
  Search,
  GitBranch,
  Radio
} from 'lucide-react'

interface ProductCard {
  id: string
  title: string
  description: string
  icon: React.ElementType
  stats: Array<{
    label: string
    value: string | number
    trend?: number
  }>
  features: string[]
  bgAnimation: 'neural' | 'flow' | 'pulse' | 'grid'
  accentColor: string
  capabilities: Array<{ name: string, icon?: React.ElementType }>
}

// Build card definitions with translated strings so we can easily swap locale
function getProductCards(t: ReturnType<typeof useTranslations>): ProductCard[] {
  return [
    {
      id: 'cognitive-memory',
      title: t('cards.cognitiveMemory.title'),
      description: t('cards.cognitiveMemory.description'),
      icon: Brain,
      stats: [
        { label: t('stats.mechanisms'), value: '8' },
        { label: t('stats.personalityAxes'), value: '6 HEXACO' },
        { label: t('stats.decayCurve'), value: 'Ebbinghaus' }
      ],
      features: [t('cards.cognitiveMemory.features.0'), t('cards.cognitiveMemory.features.1'), t('cards.cognitiveMemory.features.2'), t('cards.cognitiveMemory.features.3')],
      bgAnimation: 'neural',
      accentColor: '#FF00FF',
      capabilities: [
        { name: t('cards.cognitiveMemory.capabilities.0'), icon: Brain },
        { name: t('cards.cognitiveMemory.capabilities.1'), icon: Activity },
        { name: t('cards.cognitiveMemory.capabilities.2'), icon: Fingerprint }
      ]
    },
    {
      id: 'graph-rag',
      title: t('cards.graphRag.title'),
      description: t('cards.graphRag.description'),
      icon: Database,
      stats: [
        { label: t('stats.vectorBackends'), value: '7' },
        { label: t('stats.docLoaders'), value: '8' },
        { label: t('stats.chunkStrategies'), value: '4' }
      ],
      features: [t('cards.graphRag.features.0'), t('cards.graphRag.features.1'), t('cards.graphRag.features.2'), t('cards.graphRag.features.3')],
      bgAnimation: 'grid',
      accentColor: '#FFFF00',
      capabilities: [
        { name: t('cards.graphRag.capabilities.0'), icon: Search },
        { name: t('cards.graphRag.capabilities.1'), icon: Network },
        { name: t('cards.graphRag.capabilities.2'), icon: Database }
      ]
    },
    {
      id: 'multi-agent-orchestration',
      title: t('cards.orchestration.title'),
      description: t('cards.orchestration.description'),
      icon: Layers,
      stats: [
        { label: t('stats.strategies'), value: '6' },
        { label: t('stats.planningEngine'), value: 'ReAct' },
        { label: t('stats.workflowDsl'), value: 'TypeScript' }
      ],
      features: [t('cards.orchestration.features.0'), t('cards.orchestration.features.1'), t('cards.orchestration.features.2'), t('cards.orchestration.features.3')],
      bgAnimation: 'flow',
      accentColor: '#00FFFF',
      capabilities: [
        { name: t('cards.orchestration.capabilities.0'), icon: Layers },
        { name: t('cards.orchestration.capabilities.1'), icon: GitBranch },
        { name: t('cards.orchestration.capabilities.2'), icon: Puzzle }
      ]
    },
    {
      id: 'real-time-streaming',
      title: t('cards.streaming.title'),
      description: t('cards.streaming.description'),
      icon: Zap,
      stats: [
        { label: t('stats.protocols'), value: 'SSE + WS' },
        { label: t('stats.guardrailMode'), value: 'In-flight' },
        { label: t('stats.chunkTypes'), value: '11' }
      ],
      features: [t('cards.streaming.features.0'), t('cards.streaming.features.1'), t('cards.streaming.features.2'), t('cards.streaming.features.3')],
      bgAnimation: 'pulse',
      accentColor: '#00FF00',
      capabilities: [
        { name: t('cards.streaming.capabilities.0'), icon: Radio },
        { name: t('cards.streaming.capabilities.1'), icon: Zap },
        { name: t('cards.streaming.capabilities.2'), icon: Server }
      ]
    },
    {
      id: 'hexaco-personality',
      title: t('cards.hexaco.title'),
      description: t('cards.hexaco.description'),
      icon: Fingerprint,
      stats: [
        { label: t('stats.dimensions'), value: '6' },
        { label: t('stats.tunedMechanisms'), value: '7 of 8' },
        { label: t('stats.workingMemory'), value: '5-9 slots' }
      ],
      features: [t('cards.hexaco.features.0'), t('cards.hexaco.features.1'), t('cards.hexaco.features.2'), t('cards.hexaco.features.3')],
      bgAnimation: 'neural',
      accentColor: '#FF6B6B',
      capabilities: [
        { name: t('cards.hexaco.capabilities.0'), icon: Fingerprint },
        { name: t('cards.hexaco.capabilities.1'), icon: Brain },
        { name: t('cards.hexaco.capabilities.2'), icon: Activity }
      ]
    },
    {
      id: 'guardrails',
      title: t('cards.guardrails.title'),
      description: t('cards.guardrails.description'),
      icon: Shield,
      stats: [
        { label: t('stats.guardrailPacks'), value: '6' },
        { label: t('stats.piiLayers'), value: '4-tier' },
        { label: t('stats.mlClassifiers'), value: 'ONNX BERT' }
      ],
      features: [t('cards.guardrails.features.0'), t('cards.guardrails.features.1'), t('cards.guardrails.features.2'), t('cards.guardrails.features.3')],
      bgAnimation: 'grid',
      accentColor: '#4ECDC4',
      capabilities: [
        { name: t('cards.guardrails.capabilities.0'), icon: Shield },
        { name: t('cards.guardrails.capabilities.1'), icon: Search },
        { name: t('cards.guardrails.capabilities.2'), icon: Puzzle }
      ]
    },
    {
      id: 'voice-pipeline',
      title: t('cards.voice.title'),
      description: t('cards.voice.description'),
      icon: Mic,
      stats: [
        { label: t('stats.sttProviders'), value: '11' },
        { label: t('stats.ttsProviders'), value: '10' },
        { label: t('stats.telephony'), value: '3 carriers' }
      ],
      features: [t('cards.voice.features.0'), t('cards.voice.features.1'), t('cards.voice.features.2'), t('cards.voice.features.3')],
      bgAnimation: 'pulse',
      accentColor: '#A78BFA',
      capabilities: [
        { name: t('cards.voice.capabilities.0'), icon: Mic },
        { name: t('cards.voice.capabilities.1'), icon: AudioWaveform },
        { name: t('cards.voice.capabilities.2'), icon: Globe }
      ]
    },
    {
      id: 'llm-providers',
      title: t('cards.providers.title'),
      description: t('cards.providers.description'),
      icon: Server,
      stats: [
        { label: t('stats.providers'), value: '13' },
        { label: t('stats.fallbackChain'), value: 'Auto' },
        { label: t('stats.cliProviders'), value: '2' }
      ],
      features: [t('cards.providers.features.0'), t('cards.providers.features.1'), t('cards.providers.features.2'), t('cards.providers.features.3')],
      bgAnimation: 'flow',
      accentColor: '#F97316',
      capabilities: [
        { name: t('cards.providers.capabilities.0'), icon: Server },
        { name: t('cards.providers.capabilities.1'), icon: Globe },
        { name: t('cards.providers.capabilities.2'), icon: Zap }
      ]
    }
  ]
}

function AnimatedSVGBackground({ type, color }: { type: string; color: string }) {
  // Intricate monochromatic patterns - more visible, detailed
  const uid = `${type}-${color.replace('#', '')}`;
  
  if (type === 'neural') {
    return (
      <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id={`neural-glow-${uid}`} cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="70%" stopColor={color} stopOpacity="0.1" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <filter id={`neural-blur-${uid}`}>
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
        </defs>
        {/* Central glow */}
        <ellipse cx="200" cy="150" rx="90" ry="70" fill={`url(#neural-glow-${uid})`} />
        {/* Intricate neural network - 3 layers */}
        {[40, 80, 120].map((radius, layer) => (
          <g key={layer} filter={`url(#neural-blur-${uid})`}>
            {Array.from({ length: 8 + layer * 2 }).map((_, i) => {
              const angle = (i * 360) / (8 + layer * 2);
              const x = 200 + Math.cos(angle * Math.PI / 180) * radius;
              const y = 150 + Math.sin(angle * Math.PI / 180) * radius * 0.7;
              return (
                <g key={i}>
                  {/* Node */}
                  <circle cx={x} cy={y} r={4 - layer * 0.5} fill={color} opacity={0.5 - layer * 0.1}>
                    <animate attributeName="opacity" values={`${0.3};${0.6};${0.3}`} dur={`${2 + i * 0.2}s`} repeatCount="indefinite" />
                  </circle>
                  {/* Connection to center */}
                  <line x1="200" y1="150" x2={x} y2={y} stroke={color} strokeWidth="0.5" opacity={0.2 - layer * 0.05} />
                  {/* Cross connections */}
                  {i % 2 === 0 && layer < 2 && (
                    <line 
                      x1={x} y1={y} 
                      x2={200 + Math.cos(((i + 3) * 360) / (8 + layer * 2) * Math.PI / 180) * (radius + 40)}
                      y2={150 + Math.sin(((i + 3) * 360) / (8 + layer * 2) * Math.PI / 180) * (radius + 40) * 0.7}
                      stroke={color} strokeWidth="0.3" opacity="0.15" strokeDasharray="2,2"
                    />
                  )}
                </g>
              );
            })}
          </g>
        ))}
        {/* Central brain icon */}
        <path d="M200 130 Q185 140 190 155 Q180 165 195 175 Q200 180 205 175 Q220 165 210 155 Q215 140 200 130" 
          stroke={color} strokeWidth="1" fill="none" opacity="0.4" />
      </svg>
    );
  } else if (type === 'flow') {
    return (
      <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={`flow-grad-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0" />
            <stop offset="50%" stopColor={color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Intricate flow network */}
        {[50, 100, 150, 200, 250].map((y, i) => (
          <g key={i}>
            {/* Main flow line */}
            <path
              d={`M -20,${y} C 80,${y - 20 + i * 5} 150,${y + 15} 200,${y} S 320,${y - 10} 420,${y + 5}`}
              stroke={color} strokeWidth={1.5 - i * 0.2} fill="none" opacity={0.35 - i * 0.05}
              strokeLinecap="round"
            />
            {/* Data packets */}
            {[0, 1, 2].map((p) => (
              <circle key={p} r={3 - p * 0.5} fill={color} opacity={0.6 - p * 0.15}>
                <animateMotion
                  dur={`${3 + i + p}s`}
                  repeatCount="indefinite"
                  begin={`${p * 1.2}s`}
                  path={`M -20,${y} C 80,${y - 20 + i * 5} 150,${y + 15} 200,${y} S 320,${y - 10} 420,${y + 5}`}
                />
              </circle>
            ))}
          </g>
        ))}
        {/* Vertical connectors */}
        {[80, 160, 240, 320].map((x, i) => (
          <line key={i} x1={x} y1="40" x2={x} y2="260" stroke={color} strokeWidth="0.5" opacity="0.15" strokeDasharray="4,8" />
        ))}
        {/* Node clusters */}
        {[{x: 120, y: 100}, {x: 280, y: 150}, {x: 180, y: 220}].map((pos, i) => (
          <g key={i}>
            <circle cx={pos.x} cy={pos.y} r="12" stroke={color} strokeWidth="1" fill="none" opacity="0.3" />
            <circle cx={pos.x} cy={pos.y} r="5" fill={color} opacity="0.4" />
          </g>
        ))}
      </svg>
    );
  } else if (type === 'pulse') {
    return (
      <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id={`pulse-center-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.5" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Central energy source */}
        <circle cx="200" cy="150" r="15" fill={`url(#pulse-center-${uid})`}>
          <animate attributeName="r" values="12;18;12" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="200" cy="150" r="6" fill={color} opacity="0.6">
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="1s" repeatCount="indefinite" />
        </circle>
        {/* Multiple pulse rings */}
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx="200" cy="150" r="20" stroke={color} strokeWidth={1.5 - i * 0.2} fill="none">
            <animate attributeName="r" values="20;140;20" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.4}s`} />
            <animate attributeName="opacity" values="0.5;0;0.5" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.4}s`} />
          </circle>
        ))}
        {/* Signal rays */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <line key={i}
            x1={200 + Math.cos(angle * Math.PI / 180) * 25}
            y1={150 + Math.sin(angle * Math.PI / 180) * 25}
            x2={200 + Math.cos(angle * Math.PI / 180) * 130}
            y2={150 + Math.sin(angle * Math.PI / 180) * 100}
            stroke={color} strokeWidth="0.8" opacity="0.2" strokeDasharray="3,6"
          >
            <animate attributeName="opacity" values="0.1;0.35;0.1" dur={`${1.5 + i * 0.1}s`} repeatCount="indefinite" />
          </line>
        ))}
        {/* Lightning bolt */}
        <path d="M195 115 L212 145 L198 148 L218 190 L185 155 L202 152 L185 125 Z"
          fill={color} opacity="0.25" />
      </svg>
    );
  } else {
    // Grid pattern - database/storage themed
    return (
      <svg className="absolute inset-0 w-full h-full opacity-25" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id={`grid-${uid}`} width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke={color} strokeWidth="0.3" opacity="0.3" />
          </pattern>
        </defs>
        {/* Grid background */}
        <rect width="400" height="300" fill={`url(#grid-${uid})`} opacity="0.5" />
        {/* Database cylinders */}
        {[{x: 100, y: 80}, {x: 200, y: 150}, {x: 300, y: 100}, {x: 150, y: 200}].map((pos, i) => (
          <g key={i} opacity={0.4 - i * 0.05}>
            <ellipse cx={pos.x} cy={pos.y - 20} rx="35" ry="12" fill={color} opacity="0.3" />
            <rect x={pos.x - 35} y={pos.y - 20} width="70" height="45" fill={color} opacity="0.2" />
            <ellipse cx={pos.x} cy={pos.y + 25} rx="35" ry="12" fill={color} opacity="0.35" />
            {/* Data lines */}
            <line x1={pos.x - 20} y1={pos.y - 5} x2={pos.x + 20} y2={pos.y - 5} stroke={color} strokeWidth="2" opacity="0.4" />
            <line x1={pos.x - 15} y1={pos.y + 5} x2={pos.x + 15} y2={pos.y + 5} stroke={color} strokeWidth="2" opacity="0.3" />
          </g>
        ))}
        {/* Connection lines between databases */}
        <path d="M135 80 Q200 60 265 100" stroke={color} strokeWidth="1" fill="none" opacity="0.2" strokeDasharray="4,4" />
        <path d="M200 150 L150 200" stroke={color} strokeWidth="1" fill="none" opacity="0.2" strokeDasharray="4,4" />
        {/* Database cylinder silhouette */}
        <ellipse cx="200" cy="100" rx="80" ry="25" fill={color} opacity="0.15" />
        <rect x="120" y="100" width="160" height="100" fill={color} opacity="0.15" />
        <ellipse cx="200" cy="200" rx="80" ry="25" fill={color} opacity="0.2" />
        {/* Grid lines inside */}
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1="130"
            y1={120 + i * 25}
            x2="270"
            y2={120 + i * 25}
            stroke={color}
            strokeWidth="0.5"
            opacity="0.3"
          >
            <animate
              attributeName="opacity"
              values="0.2;0.4;0.2"
              dur={`${2 + i * 0.5}s`}
              repeatCount="indefinite"
            />
          </line>
        ))}
        {/* Data blocks */}
        {[0, 1, 2].map((row) => 
          [0, 1, 2].map((col) => (
            <rect
              key={`${row}-${col}`}
              x={140 + col * 45}
              y={115 + row * 30}
              width="35"
              height="20"
              rx="2"
              fill={color}
              opacity="0.1"
            >
              <animate
                attributeName="opacity"
                values="0.05;0.2;0.05"
                dur={`${2 + (row + col) * 0.3}s`}
                repeatCount="indefinite"
              />
            </rect>
          ))
        )}
      </svg>
    )
  }
}

export function ProductCards() {
  const t = useTranslations('productCards')
  const productCards = useMemo(() => getProductCards(t), [t])

  return (
    <section id="capabilities" className="py-12 sm:py-14 px-4 sm:px-6 lg:px-8 perspective-1000">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-muted max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {productCards.map((card, index) => (
            <div key={card.id} className="relative group h-[440px] cursor-pointer perspective-1000">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="w-full h-full relative preserve-3d transition-transform duration-700 group-hover:rotate-y-180"
              >
                {/* FRONT FACE */}
                <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden">
                   <div className="holographic-card h-full p-6 flex flex-col border-2 border-white/10 dark:border-white/10 border-[var(--color-border-subtle)] group-hover:border-accent-primary/50 transition-colors shadow-xl bg-[var(--color-background-glass)] backdrop-blur-xl">
                    {/* Background Animation — content-visibility skips rendering when offscreen */}
                    <div className="absolute inset-0 overflow-hidden rounded-2xl opacity-30 dark:opacity-40" style={{ contentVisibility: 'auto' }}>
                      <AnimatedSVGBackground type={card.bgAnimation} color={card.accentColor} />
                    </div>

                    {/* Card Content */}
                    <div className="relative z-10 flex flex-col h-full">
                      {/* Icon */}
                      <div className="mb-4">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-md"
                          style={{
                            background: `linear-gradient(135deg, ${card.accentColor}20, ${card.accentColor}10)`,
                            boxShadow: `0 4px 20px ${card.accentColor}20`,
                            border: `1px solid ${card.accentColor}40`
                          }}
                        >
                          <card.icon className="w-7 h-7" style={{ color: card.accentColor }} />
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-xl font-bold mb-2 tracking-tight text-[var(--color-text-primary)]">{card.title}</h3>
                      <p className="text-sm text-[var(--color-text-secondary)] mb-6 leading-relaxed font-medium">{card.description}</p>

                      {/* Stats */}
                      <div className="space-y-3 mt-auto">
                        {card.stats.map((stat, i) => {
                          return (
                            <div key={i} className="flex items-center justify-between bg-[var(--color-background-primary)]/50 dark:bg-white/5 p-2 rounded-lg border border-[var(--color-border-subtle)] backdrop-blur-sm hover:bg-[var(--color-background-secondary)] transition-colors">
                              <span className="text-xs font-bold text-[var(--color-text-muted)]">{stat.label}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold tracking-tight text-[var(--color-text-primary)]">
                                  {stat.value}
                                </span>
                                {stat.trend && (
                                  <span className={`text-xs font-semibold ${stat.trend > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                    {stat.trend > 0 ? '↑' : '↓'} {Math.abs(stat.trend)}%
                                  </span>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* BACK FACE (Tech Stack) */}
                <div 
                  className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl overflow-hidden"
                >
                  <div className="holographic-card h-full p-6 flex flex-col items-center justify-center border-2 border-accent-primary/30 bg-[var(--color-background-elevated)] backdrop-blur-xl">
                    <AnimatedSVGBackground type={card.bgAnimation} color={card.accentColor} />
                    
                    <div className="grid grid-cols-1 gap-3 w-full relative z-10 mb-4">
                      {card.capabilities.map((tech, i) => (
                        <div 
                          key={i}
                          className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-[var(--color-background-secondary)] to-transparent border border-[var(--color-border-subtle)] hover:border-[var(--color-accent-primary)]/50 transition-colors"
                        >
                          {tech.icon && <tech.icon className="w-5 h-5 text-[var(--color-accent-primary)]" />}
                          <span className="font-mono text-sm font-semibold text-[var(--color-text-primary)]">{tech.name}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 relative z-10">
                      {card.features.map((feature, i) => (
                        <span
                          key={i}
                          className="text-[11px] px-3 py-1.5 rounded-full font-semibold bg-gradient-to-r from-[var(--color-accent-primary)]/20 to-[var(--color-accent-secondary)]/20 border border-[var(--color-accent-primary)]/30 text-[var(--color-text-primary)]"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
