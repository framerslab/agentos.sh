'use client';

import { useState, useEffect, useRef } from 'react';
import { Monitor } from 'lucide-react';
import { themes, ThemeName, applyTheme, getDefaultTheme } from '@/lib/themes';
import { revealInScrollingAncestor } from '@/lib/ui/reveal-in-scroller';
import { useTheme } from 'next-themes';

/* ── Per-theme SVG icons ─────────────────────────────────────────────── */

/** Cherry blossom petal — Sakura Sunset */
function SakuraIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 2c-1.5 4-5 6-5 10s3.5 8 5 10c1.5-2 5-6 5-10S13.5 6 12 2z" fill="#ec4899" opacity="0.85" />
      <path d="M12 6c-1 2.5-3 4-3 6.5s2 5 3 6.5c1-1.5 3-4 3-6.5S13 8.5 12 6z" fill="#f9a8d4" opacity="0.6" />
    </svg>
  );
}

/** Electric circuit node — Twilight Neo */
function TwilightIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="4" fill="#06b6d4" opacity="0.9" />
      <circle cx="12" cy="12" r="8" fill="none" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.5" />
      <line x1="12" y1="4" x2="12" y2="1" stroke="#06b6d4" strokeWidth="1.5" opacity="0.7" />
      <line x1="20" y1="12" x2="23" y2="12" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.7" />
      <line x1="12" y1="20" x2="12" y2="23" stroke="#06b6d4" strokeWidth="1.5" opacity="0.7" />
      <line x1="4" y1="12" x2="1" y2="12" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.7" />
    </svg>
  );
}

/** Sun with rays — Aurora Daybreak */
function AuroraIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="14" r="5" fill="#f59e0b" opacity="0.85" />
      <path d="M4 20h16" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <path d="M2 20c2-6 5-10 10-10s8 4 10 10" fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.3" />
      <line x1="12" y1="3" x2="12" y2="6" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="5.6" y1="7.6" x2="7.7" y2="9.7" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="18.4" y1="7.6" x2="16.3" y2="9.7" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

/** Warm flame — Warm Embrace */
function WarmIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 22c-4 0-7-3-7-7 0-3 2-5 4-8 1-1.5 2-3 3-5 1 2 2 3.5 3 5 2 3 4 5 4 8 0 4-3 7-7 7z" fill="#d97706" opacity="0.8" />
      <path d="M12 22c-2 0-4-2-4-4 0-2 1-3 2-5 .5-1 1.2-2 2-3 .8 1 1.5 2 2 3 1 2 2 3 2 5 0 2-2 4-4 4z" fill="#fbbf24" opacity="0.7" />
    </svg>
  );
}

/** Terminal cursor — Retro Terminus */
function RetroIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.7" />
      <text x="7" y="15" fontSize="8" fontFamily="monospace" fill="#22c55e" opacity="0.9">&gt;_</text>
    </svg>
  );
}

const THEME_ICONS: Record<ThemeName, (props: { className?: string }) => React.ReactElement> = {
  'sakura-sunset': SakuraIcon,
  'twilight-neo': TwilightIcon,
  'aurora-daybreak': AuroraIcon,
  'warm-embrace': WarmIcon,
  'retro-terminus': RetroIcon,
};

/* ── ThemeSelector ───────────────────────────────────────────────────── */

/**
 * Theme palette picker — shows a unique SVG icon for the active theme.
 * Clicking expands a dropdown with all 5 themes, their names, color
 * swatches, and descriptions.
 */
export function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('twilight-neo');
  const [isOpen, setIsOpen] = useState(false);
  const [flipUp, setFlipUp] = useState(false);
  const { theme: mode, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const defaultTheme = getDefaultTheme();
    setCurrentTheme(defaultTheme);
  }, []);

  // Flip the dropdown UP when there isn't enough room below the trigger.
  // Same pattern as LanguageSwitcher: estimate the menu height (~5 rows
  // × ~80px each + padding for the descriptive theme cards) and compare
  // against the available space, on the click that opens the dropdown.
  const toggle = () => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const estimatedHeight = Object.keys(themes).length * 80 + 24;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setFlipUp(spaceBelow < estimatedHeight && spaceAbove > spaceBelow);
    }
    setIsOpen(!isOpen);
  };

  // Inside a container that scrolls (the header menu on a screen 20rem tall
  // or less) the dropdown can open past the container's edge: scroll it into
  // view.
  useEffect(() => {
    if (isOpen && popupRef.current) revealInScrollingAncestor(popupRef.current);
  }, [isOpen]);

  useEffect(() => {
    if (mounted) {
      const actualMode = mode === 'system' ? systemTheme : mode;
      const isDark = actualMode === 'dark';
      applyTheme(currentTheme, isDark);
    }
  }, [mode, systemTheme, currentTheme, mounted]);

  /* Close on outside click */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const handleThemeChange = (themeName: ThemeName) => {
    setCurrentTheme(themeName);
    const actualMode = mode === 'system' ? systemTheme : mode;
    const isDark = actualMode === 'dark';
    applyTheme(themeName, isDark);
    setIsOpen(false);
  };

  const ActiveIcon = THEME_ICONS[currentTheme] ?? AuroraIcon;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={triggerRef}
        onClick={toggle}
        className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white/80 p-2 text-sm text-slate-700 shadow-sm transition hover:bg-white hover:shadow-md dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-800"
        aria-label="Select theme"
        aria-expanded={isOpen}
      >
        <ActiveIcon className="h-5 w-5" />
      </button>

      {isOpen && (
        <div
          ref={popupRef}
          className={`absolute right-0 z-[60] w-72 max-w-[calc(100vw-2rem)] max-h-[min(80vh,calc(100vh-6rem))] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900 ${
            flipUp ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
          role="listbox"
          aria-label="Theme presets"
        >
          <div className="p-1.5 max-h-[inherit] overflow-y-auto">
            {Object.entries(themes).map(([key, theme]) => {
              const themeName = key as ThemeName;
              const isActive = currentTheme === themeName;
              const actualMode = mode === 'system' ? systemTheme : mode;
              const isDark = actualMode === 'dark';
              const palette = isDark ? theme.dark : theme.light;
              const Icon = THEME_ICONS[themeName];
              return (
                <button
                  key={key}
                  onClick={() => handleThemeChange(themeName)}
                  role="option"
                  aria-selected={isActive}
                  className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                    isActive
                      ? 'bg-[var(--color-accent-primary)]/10'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-semibold truncate ${isActive ? 'text-[var(--color-accent-primary)]' : 'text-slate-900 dark:text-white'}`}>
                      {theme.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {theme.description}
                    </div>
                  </div>
                  {/* Color swatches */}
                  <div className="flex gap-1 shrink-0">
                    <div
                      className="h-3 w-3 rounded-full border border-slate-300 dark:border-slate-600"
                      style={{ backgroundColor: palette.accent.primary }}
                    />
                    <div
                      className="h-3 w-3 rounded-full border border-slate-300 dark:border-slate-600"
                      style={{ backgroundColor: palette.accent.secondary }}
                    />
                  </div>
                  {isActive && (
                    <span className="shrink-0 text-[10px] font-medium text-[var(--color-accent-primary)] uppercase tracking-wider">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="border-t border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Monitor className="h-3 w-3" />
              <span>Themes adapt to light/dark mode</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
