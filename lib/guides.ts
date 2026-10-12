import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Canonical docs live in packages/agentos/docs/ (the source of truth).
// Falls back to content/guides/ for standalone CI builds without the monorepo.
const CANONICAL_DOCS = path.join(process.cwd(), '../../packages/agentos/docs');
const FALLBACK_DOCS = path.join(process.cwd(), 'content/guides');
const GUIDES_DIR = fs.existsSync(CANONICAL_DOCS) ? CANONICAL_DOCS : FALLBACK_DOCS;
const _IS_CANONICAL = GUIDES_DIR === CANONICAL_DOCS;

/** Recursively collect all .md files from a directory tree. */
function collectMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectMarkdownFiles(full));
    } else if (entry.name.endsWith('.md') && entry.name !== 'README.md') {
      results.push(full);
    }
  }
  return results;
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  category: string;
  content: string;
  lastModified?: string;
  /** Path relative to the docs root, e.g. "architecture/ARCHITECTURE.md". */
  docsRelativePath: string;
}

// Map filenames to metadata
const GUIDE_METADATA: Record<string, { title: string; description: string; category: string }> = {
  'ARCHITECTURE': {
    title: 'Architecture Overview',
    description: 'Complete system architecture for AgentOS including module map, request lifecycle, and extension points.',
    category: 'Core'
  },
  'AGENTOS_ARCHITECTURE_DEEP_DIVE': {
    title: 'Architecture Deep Dive',
    description: 'In-depth technical details of the AgentOS architecture and implementation.',
    category: 'Core'
  },
  'PLANNING_ENGINE': {
    title: 'Planning Engine',
    description: 'Multi-step task planning and execution with the AgentOS planning system.',
    category: 'Features'
  },
  'HUMAN_IN_THE_LOOP': {
    title: 'Human-in-the-Loop',
    description: 'Approval workflows and human oversight patterns for AI agent systems.',
    category: 'Features'
  },
  'AGENT_COMMUNICATION': {
    title: 'Agent Communication',
    description: 'Inter-agent messaging and coordination protocols for multi-agent systems.',
    category: 'Features'
  },
  'STRUCTURED_OUTPUT': {
    title: 'Structured Output',
    description: 'JSON schema validation and structured response handling.',
    category: 'Features'
  },
  'RAG_MEMORY_CONFIGURATION': {
    title: 'RAG & Memory Configuration',
    description: 'Vector storage setup and retrieval-augmented generation configuration.',
    category: 'Integration'
  },
  'PROVENANCE_IMMUTABILITY': {
    title: 'Provenance & Immutability',
    description: 'Sealed storage policy, signed event ledger, and optional external anchoring (WORM, Rekor, OpenTimestamps, blockchains).',
    category: 'Operations'
  },
  'IMMUTABLE_AGENTS': {
    title: 'Immutable Agents (Sealed Mode)',
    description: 'How sealing works end-to-end: toolset pinning, secret rotation, append-only memory, and tamper evidence.',
    category: 'Operations'
  },
  'SQL_STORAGE_QUICKSTART': {
    title: 'SQL Storage Quickstart',
    description: 'Database integration guide for persistent agent storage.',
    category: 'Integration'
  },
  'CLIENT_SIDE_STORAGE': {
    title: 'Client-Side Storage',
    description: 'Browser persistence and IndexedDB integration for web applications.',
    category: 'Integration'
  },
  'MIGRATION_TO_STORAGE_ADAPTER': {
    title: 'Storage Adapter Migration',
    description: 'Upgrade guide for migrating to the new storage adapter system.',
    category: 'Integration'
  },
  'COST_OPTIMIZATION': {
    title: 'Cost Optimization',
    description: 'Token usage management and cost reduction strategies.',
    category: 'Operations'
  },
  'EVALUATION_FRAMEWORK': {
    title: 'Evaluation Framework',
    description: 'Testing and quality assurance for AI agent systems.',
    category: 'Operations'
  },
  'RECURSIVE_SELF_BUILDING_AGENTS': {
    title: 'Recursive Self-Building Agents',
    description: 'Advanced patterns for agents that can create and modify other agents.',
    category: 'Advanced'
  },
  'RFC_EXTENSION_STANDARDS': {
    title: 'Extension Standards (RFC)',
    description: 'Standards and guidelines for building AgentOS extensions.',
    category: 'Advanced'
  },
  'ECOSYSTEM': {
    title: 'Ecosystem',
    description: 'Related packages, tools, and resources in the AgentOS ecosystem.',
    category: 'Reference'
  },
  'PLATFORM_SUPPORT': {
    title: 'Platform Support',
    description: 'Supported environments and platform compatibility information.',
    category: 'Reference'
  },
  'RELEASING': {
    title: 'Releasing',
    description: 'Release automation and versioning guidelines.',
    category: 'Reference'
  },
  'COGNITIVE_MEMORY': {
    title: 'Cognitive Memory System',
    description: 'Observational memory with Ebbinghaus decay, working memory (Baddeley model), memory consolidation, and the AgentMemory high-level API.',
    category: 'Features'
  },
  'CAPABILITY_DISCOVERY': {
    title: 'Capability Discovery',
    description: 'Tiered semantic discovery engine — agents find tools, skills, and extensions by intent instead of static lists.',
    category: 'Features'
  },
  'QUERY_ROUTER': {
    title: 'Query Router',
    description: 'Tiered query classification, retrieval dispatch, keyword fallback, and grounded answer generation for doc-backed assistants.',
    category: 'Features'
  },
  'STREAMING_SEMANTICS': {
    title: 'Streaming Semantics',
    description: 'How raw live chunks, finalized approved output, and structured stream events differ across the Agency API.',
    category: 'Features'
  },
  'GUARDRAILS_USAGE': {
    title: 'Guardrails & Safety',
    description: 'Configuring safety guardrails, content filters, and tool restriction policies.',
    category: 'Operations'
  },
  'LOGGING': {
    title: 'Logging',
    description: 'Structured logging configuration, log levels, and observability integration.',
    category: 'Operations'
  },
  'MULTIMODAL_RAG': {
    title: 'Multimodal RAG',
    description: 'Retrieval-augmented generation with images, documents, and mixed media content.',
    category: 'Features'
  },
  'OAUTH_AUTH': {
    title: 'OAuth Authentication',
    description: 'OAuth 2.0 PKCE flows for LLM providers and social channel authentication.',
    category: 'Integration'
  },
  'OBSERVABILITY': {
    title: 'Observability',
    description: 'OpenTelemetry integration, distributed tracing, and metrics collection.',
    category: 'Operations'
  },
  'SAFETY_PRIMITIVES': {
    title: 'Safety Primitives',
    description: 'Circuit breaker, provider health, action deduplication, stuck detection, cost guard, spend meter and tool execution guard.',
    category: 'Operations'
  },
  'SKILLS': {
    title: 'Skills System',
    description: 'Creating, loading, and managing SKILL.md-based agent capabilities.',
    category: 'Features'
  },
  'TOOL_CALLING_AND_LOADING': {
    title: 'Tool Calling & Loading',
    description: 'How tools are discovered, loaded, and invoked during LLM turns — including lazy loading and schema-on-demand.',
    category: 'Features'
  },
  'VOICE_TTS_STT': {
    title: 'Voice: TTS & STT',
    description: 'Multi-provider text-to-speech and speech-to-text tools — OpenAI TTS, ElevenLabs, Whisper STT, and local Ollama.',
    category: 'Features'
  },
  'README': {
    title: 'Documentation Index',
    description: 'Quick links and overview of available documentation.',
    category: 'Reference'
  }
};

export function getAllGuides(): Guide[] {
  try {
    if (!fs.existsSync(GUIDES_DIR)) {
      console.warn('Guides directory not found:', GUIDES_DIR);
      return [];
    }

    // Canonical docs are organized into subfolders — scan recursively.
    // Fallback (content/guides/) is flat — still works with recursive scan.
    const filePaths = collectMarkdownFiles(GUIDES_DIR);

    const guides = filePaths.map(filePath => {
      const file = path.basename(filePath);
      const slug = file.replace('.md', '');
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { content } = matter(fileContent);
      const stats = fs.statSync(filePath);

      const metadata = GUIDE_METADATA[slug] || {
        title: slug.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        description: 'AgentOS documentation guide.',
        category: 'Other'
      };

      return {
        slug: slug.toLowerCase(),
        title: metadata.title,
        description: metadata.description,
        category: metadata.category,
        content,
        lastModified: stats.mtime.toISOString(),
        docsRelativePath: path.relative(GUIDES_DIR, filePath),
      };
    });

    // Sort by category, then by title
    const categoryOrder = ['Core', 'Features', 'Integration', 'Operations', 'Advanced', 'Reference', 'Other'];
    return guides.sort((a, b) => {
      const catDiff = categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
      if (catDiff !== 0) return catDiff;
      return a.title.localeCompare(b.title);
    });
  } catch (error) {
    console.error('Error loading guides:', error);
    return [];
  }
}

export function getGuideBySlug(slug: string): Guide | null {
  try {
    // Search recursively for the file (canonical docs are in subfolders).
    const target = slug.toUpperCase() + '.md';
    const allFiles = collectMarkdownFiles(GUIDES_DIR);
    const filePath = allFiles.find(f => path.basename(f).toLowerCase() === target.toLowerCase());

    if (!filePath) return null;

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { content } = matter(fileContent);
    const stats = fs.statSync(filePath);
    const slugKey = slug.toUpperCase();

    const metadata = GUIDE_METADATA[slugKey] || {
      title: slug.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      description: 'AgentOS documentation guide.',
      category: 'Other'
    };

    return {
      slug: slug.toLowerCase(),
      title: metadata.title,
      description: metadata.description,
      category: metadata.category,
      content,
      lastModified: stats.mtime.toISOString(),
      docsRelativePath: path.relative(GUIDES_DIR, filePath),
    };
  } catch (error) {
    console.error('Error loading guide:', slug, error);
    return null;
  }
}

export function getGuideCategories(): string[] {
  const guides = getAllGuides();
  const categories = [...new Set(guides.map(g => g.category))];
  const categoryOrder = ['Core', 'Features', 'Integration', 'Operations', 'Advanced', 'Reference', 'Other'];
  return categories.sort((a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b));
}
