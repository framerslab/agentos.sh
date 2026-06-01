'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { MessageSquare } from 'lucide-react';

/**
 * Giscus configuration. Set these via env vars in `.env.local` /
 * `.env.production`:
 *
 *   NEXT_PUBLIC_GISCUS_REPO        e.g. "framersai/agentos.sh"
 *   NEXT_PUBLIC_GISCUS_REPO_ID     from giscus.app configurator
 *   NEXT_PUBLIC_GISCUS_CATEGORY    e.g. "General"
 *   NEXT_PUBLIC_GISCUS_CATEGORY_ID from giscus.app configurator
 *
 * Configurator:  https://giscus.app
 * Setup steps:
 *   1. Make the repo public.
 *   2. Enable GitHub Discussions in repo settings.
 *   3. Install the giscus app:  https://github.com/apps/giscus
 *   4. Run the configurator and copy the four values above into .env.
 *
 * When env vars are absent, the component renders a small "comments
 * not configured" stub instead of an empty iframe shell, so missing
 * config is visible in dev without crashing the page.
 */
const GISCUS_REPO = process.env.NEXT_PUBLIC_GISCUS_REPO ?? '';
const GISCUS_REPO_ID = process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? '';
const GISCUS_CATEGORY = process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? 'General';
const GISCUS_CATEGORY_ID = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? '';

export function Comments({ slug }: { slug: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  const isConfigured =
    GISCUS_REPO && GISCUS_REPO_ID && GISCUS_CATEGORY_ID;

  useEffect(() => {
    if (!isConfigured || !ref.current) return;

    // Clear any prior giscus iframe so we don't stack on theme/route change
    ref.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';

    script.setAttribute('data-repo', GISCUS_REPO);
    script.setAttribute('data-repo-id', GISCUS_REPO_ID);
    script.setAttribute('data-category', GISCUS_CATEGORY);
    script.setAttribute('data-category-id', GISCUS_CATEGORY_ID);
    script.setAttribute('data-mapping', 'specific');
    script.setAttribute('data-term', slug);
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', resolvedTheme === 'dark' ? 'dark_dimmed' : 'light');
    script.setAttribute('data-lang', 'en');
    script.setAttribute('data-loading', 'lazy');

    ref.current.appendChild(script);
  }, [slug, resolvedTheme, isConfigured]);

  // Live theme toggle: send a postMessage so the iframe re-renders
  // without a full reload. Giscus exposes this contract publicly.
  useEffect(() => {
    if (!isConfigured) return;
    const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
    if (!iframe) return;
    iframe.contentWindow?.postMessage(
      {
        giscus: {
          setConfig: {
            theme: resolvedTheme === 'dark' ? 'dark_dimmed' : 'light',
          },
        },
      },
      'https://giscus.app',
    );
  }, [resolvedTheme, isConfigured]);

  return (
    <section
      aria-labelledby="comments-heading"
      className="mt-16 pt-8 border-t border-[var(--color-border-subtle)]"
    >
      <h2
        id="comments-heading"
        className="flex items-center gap-2 text-2xl font-bold text-[var(--color-text-primary)] mb-6"
      >
        <MessageSquare className="h-5 w-5" aria-hidden />
        Comments
      </h2>
      {isConfigured ? (
        <div ref={ref} className="giscus" />
      ) : (
        <p className="text-sm text-[var(--color-text-muted)]">
          Comments are powered by{' '}
          <a
            href="https://giscus.app"
            className="text-[var(--color-accent-primary)] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            giscus
          </a>{' '}
          and require GitHub Discussions to be enabled. Set the
          <code className="mx-1 rounded bg-[var(--color-background-tertiary)] px-1 py-0.5 text-xs">
            NEXT_PUBLIC_GISCUS_*
          </code>
          env vars in{' '}
          <code className="rounded bg-[var(--color-background-tertiary)] px-1 py-0.5 text-xs">
            .env.local
          </code>{' '}
          to enable them. See{' '}
          <a
            href="https://github.com/framerslab/agentos.sh/issues"
            className="text-[var(--color-accent-primary)] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Issues
          </a>{' '}
          for now to leave feedback.
        </p>
      )}
    </section>
  );
}
