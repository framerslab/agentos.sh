import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import '../styles/tokens.css';
import './globals.css';
import { defaultLocale } from '../i18n';
import DiagramZoom from '../components/DiagramZoom';

// `display: 'optional'` swaps fonts only on a fast first connection
// (within ~100ms). Slower connections render the fallback for the
// session, which avoids the layout shift caused by `swap` (Lighthouse
// called body-class swap out as ~0.29 CLS — the single biggest CLS
// contributor on the hero). next/font's auto adjustFontFallback also
// generates a metric-matched fallback so glyph widths stay close.
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'optional' });

export default function RootLayout({ children }: { children: ReactNode }) {
  const lang = defaultLocale;
  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        {/*
         * Synchronous theme bootstrap. Runs before <body> paints so the
         * page never flashes the wrong mode on first load.
         *
         * Reads two keys:
         *   - agentos-mode  ('light' | 'dark' | 'system'), set by
         *     next-themes (storageKey in components/theme-provider.tsx)
         *   - agentos-theme (the named theme: 'twilight-neo' etc.), set
         *     by lib/themes.ts applyTheme()
         *
         * Mirrors lib/themes.ts THEME_VERSION so a stale theme name is
         * cleared the first time a user lands after a version bump.
         * This is duplication on purpose: the body-side theme code
         * still runs on hydration (and is the source of truth for
         * subsequent changes), but the head-side bootstrap eliminates
         * the dark→light flash that was visible on first paint.
         */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var THEME_VERSION = '2026-04-29-twilight-default';
                  var modeKey = 'agentos-mode';
                  var themeKey = 'agentos-theme';
                  var versionKey = 'agentos-theme-version';

                  var ver = localStorage.getItem(versionKey);
                  if (ver !== THEME_VERSION) {
                    localStorage.setItem(versionKey, THEME_VERSION);
                    localStorage.removeItem(themeKey);
                  }

                  var mode = localStorage.getItem(modeKey);
                  if (!mode || mode === 'system') {
                    mode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  if (mode === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                  }

                  var theme = localStorage.getItem(themeKey) || 'twilight-neo';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) { /* swallow: localStorage may be unavailable in some embeds */ }
              })();
            `,
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
          * { box-sizing: border-box; }
          html, body { width: 100%; margin: 0; padding: 0; }
          html { height: 100%; overflow-x: clip; }
          body { min-height: 100vh; overflow-x: clip; }

          .skip-to-content { position: absolute; left: -9999px; z-index: 999; padding: 1rem 1.5rem; background: hsl(250, 95%, 55%); color: white; text-decoration: none; border-radius: 0.5rem; font-weight: 600; }
          .skip-to-content:focus { left: 1rem; top: 1rem; outline: 2px solid hsl(280, 85%, 60%); outline-offset: 2px; }
          .skeleton { position: relative; overflow: hidden; border-radius: 0.5rem; }
          .skeleton::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, transparent 0%, rgba(200,200,200,0.3) 50%, transparent 100%); animation: skeleton-shimmer 2s ease-in-out infinite; }
          @keyframes skeleton-shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }

          .hero-critical { display: flex; flex-direction: column; justify-content: center; position: relative; min-height: 100vh; overflow: hidden; }
          .hero-critical > * { position: relative; z-index: 1; }

          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
              scroll-behavior: auto !important;
            }
          }
        `
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} grainy min-h-screen antialiased transition-theme bg-background-primary text-text-primary`}
      >
        <DiagramZoom />
        {children}
      </body>
    </html>
  );
}

