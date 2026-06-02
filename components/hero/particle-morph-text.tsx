'use client';

import { useEffect, useRef, useState, useMemo, memo } from 'react';

interface ParticleMorphTextProps {
  words: [string, string];
  className?: string;
  /** Base ms between word swaps. */
  interval?: number;
  fontSize?: number;
  gradientFrom?: string;
  gradientTo?: string;
  startIndex?: number;
  /** Extra vertical offset in em units (kept for API compatibility). */
  nudgeY?: number;
  /**
   * When true, both paired instances swap in lockstep on the SAME varying
   * interval so the phrase stays coherent ("Emergent…adaptive" ⇄
   * "Adaptive…emergent"). The interval still varies per cycle (deterministic
   * hash of the cycle index, identical across synced instances) so it never
   * feels like a fixed metronome.
   */
  synchronized?: boolean;
}

/**
 * Animated gradient word that crossfades between two words.
 *
 * This renders REAL DOM text (not a canvas), so it is pixel-for-pixel the same
 * font, weight, and antialiasing as the surrounding headline — always crisp,
 * no font mismatch, no load flash, near-zero cost. The two words are stacked;
 * the active one fades/eases in while the other fades out, and the inline box
 * holds the wider word's width so surrounding copy never reflows (no CLS).
 *
 * (Replaced an earlier canvas particle-morph: canvas-drawn text could never
 * match the DOM font — Next.js hashes the Inter family name, so the canvas
 * silently fell back to a heavier system font, which looked wrong next to the
 * real headline text.)
 */
export function ParticleMorphTextImpl({
  words,
  className = '',
  interval = 7000,
  gradientFrom = '#8b5cf6',
  gradientTo = '#06b6d4',
  startIndex = 0,
  synchronized = false,
}: ParticleMorphTextProps) {
  const [wordA, wordB] = words;
  const [active, setActive] = useState(startIndex);
  const [reduceMotion, setReduceMotion] = useState(false);
  const cycleRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const gradient = useMemo(
    () => `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})`,
    [gradientFrom, gradientTo]
  );

  // Honor reduced-motion: hold the starting word, never swap.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const schedule = () => {
      cycleRef.current += 1;
      // Deterministic per-cycle jitter (same for synced instances): interval ± 2.5s.
      const hash = Math.sin(cycleRef.current * 12.9898) * 43758.5453;
      const frac = hash - Math.floor(hash);
      const wait = synchronized ? interval + (frac - 0.5) * 5000 : interval + (Math.random() - 0.5) * 5000;
      timerRef.current = setTimeout(() => {
        setActive((a) => (a === 0 ? 1 : 0));
        schedule();
      }, Math.max(2500, wait));
    };
    schedule();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [reduceMotion, interval, synchronized]);

  // Shared style for each stacked word layer.
  const wordStyle = (visible: boolean): React.CSSProperties => ({
    gridArea: '1 / 1',
    background: gradient,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    whiteSpace: 'nowrap',
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0) scale(1)' : 'translateY(0.08em) scale(0.98)',
    transition: 'opacity 420ms ease, transform 420ms ease',
    transitionProperty: 'opacity, transform',
  });

  return (
    <span
      className={`inline-grid align-baseline ${className}`}
      // marginRight gives the morph a normal word-space so it never jams against
      // the next word ("Emergent intelligence", "adaptive agents"); JSX collapses
      // the source whitespace between the component and the following <span>.
      style={{ gridAutoColumns: '1fr', marginRight: '0.28em' }}
      aria-label={`${wordA} / ${wordB}`}
    >
      {/* Both words occupy the same grid cell; the wider one defines the box so
          neighbouring text never reflows. Only the active word is opaque. */}
      <span aria-hidden="true" style={wordStyle(active === 0)}>{wordA}</span>
      <span aria-hidden="true" style={wordStyle(active === 1)}>{wordB}</span>
    </span>
  );
}

// Memoized export — same name the hero imports.
export const ParticleMorphText = memo(ParticleMorphTextImpl);

export default ParticleMorphText;
