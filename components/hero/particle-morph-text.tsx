'use client';

import { useEffect, useRef, useState, useCallback, memo, useMemo } from 'react';
import { clampDpr } from '@/lib/hero/dpr';

interface ParticleMorphTextProps {
  words: [string, string];
  className?: string;
  interval?: number;
  fontSize?: number;
  gradientFrom?: string;
  gradientTo?: string;
  startIndex?: number;
  /** Extra vertical offset in em units (e.g. 0.04 to nudge down). */
  nudgeY?: number;
  /**
   * When true, paired instances morph in lockstep on the SAME per-cycle varying
   * interval so the phrase stays coherent. The interval still varies per cycle
   * (deterministic hash of the cycle index) so it isn't a fixed metronome.
   */
  synchronized?: boolean;
}

type Particle = { x: number; y: number; r: number; rgb: [number, number, number]; seed: number };

/**
 * Particle-melt morphing word.
 *
 * AT REST: the word is REAL DOM gradient text — pixel-identical font, weight,
 * antialiasing and width to the surrounding headline (the headline uses the
 * `ui-sans-serif`/`system-ui` generic, which a <canvas> renders subtly
 * differently; so the resting word must be DOM text, not canvas).
 *
 * DURING A MORPH (~0.6s): a canvas overlay fades in and the letters dissolve
 * into colored particles and reflow into the next word. Glyph-rendering
 * differences are invisible while everything is in motion. When the morph
 * completes, the new DOM word fades back in and the canvas fades out.
 *
 * The inline box is defined by the visible DOM word itself (natural width), so
 * a narrower word never leaves a gap before the following word.
 */
export function ParticleMorphTextImpl({
  words,
  className = '',
  interval = 7000,
  fontSize = 48,
  gradientFrom = '#8b5cf6',
  gradientTo = '#06b6d4',
  startIndex = 0,
  nudgeY = 0,
  synchronized = false,
}: ParticleMorphTextProps) {
  const [wordA, wordB] = words;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const isVisibleRef = useRef(true);
  const reduceMotionRef = useRef(false);
  const cycleRef = useRef(0);
  const particlesARef = useRef<Particle[]>([]);
  const particlesBRef = useRef<Particle[]>([]);
  const stateRef = useRef({ wordIdx: startIndex });

  const [mounted, setMounted] = useState(false);
  // Which word the invisible width-definer shows (tracks the active word so the
  // box width is always correct). The visible render is always the canvas dots.
  const [activeWordIndex, setActiveWordIndex] = useState(startIndex);
  // True once the canvas has drawn its first dotted frame (fade it in, no flash).
  const [painted, setPainted] = useState(false);
  // Generous canvas backing size — covers the wider word; canvas is centered on
  // the box and always visible (the word is always shown as dots).
  const canvasW = useMemo(() => Math.ceil(Math.max(wordA.length, wordB.length) * fontSize * 0.66) + 8, [wordA, wordB, fontSize]);
  const height = useMemo(() => Math.ceil(fontSize * 1.18), [fontSize]);

  const hexToRgb = useCallback((hex: string): [number, number, number] => {
    const v = parseInt(hex.slice(1), 16);
    return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
  }, []);
  const lerpRgb = useCallback((a: [number, number, number], b: [number, number, number], t: number): [number, number, number] =>
    [Math.round(a[0] + (b[0] - a[0]) * t), Math.round(a[1] + (b[1] - a[1]) * t), Math.round(a[2] + (b[2] - a[2]) * t)], []);
  const smoothstep = useCallback((t: number) => t * t * (3 - 2 * t), []);

  const resolveFont = useCallback(() => {
    const el = canvasRef.current;
    let fam = el ? getComputedStyle(el).fontFamily : 'system-ui, sans-serif';
    // CRITICAL: <canvas> resolves the `ui-sans-serif` generic to a DIFFERENT
    // concrete font than the DOM does (measured: DOM renders the system UI font
    // at one width, canvas's ui-sans-serif resolves to Inter/SF at a narrower
    // one). So the sampled particles traced the wrong typeface. Drop the leading
    // `ui-sans-serif` token so canvas falls through to `system-ui`, which it
    // resolves identically to the DOM — the dots then form the exact headline font.
    fam = fam.replace(/^\s*ui-sans-serif\s*,\s*/i, '');
    return `700 ${fontSize}px ${fam}`;
  }, [fontSize]);

  const sampleText = useCallback((text: string, fontStr: string): Particle[] => {
    const off = document.createElement('canvas');
    const ctx = off.getContext('2d', { willReadFrequently: true });
    if (!ctx) return [];
    off.width = canvasW; off.height = height;
    ctx.font = fontStr;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#fff';
    ctx.fillText(text, canvasW / 2, fontSize * 0.94);
    const data = ctx.getImageData(0, 0, canvasW, height).data;
    const step = Math.max(1, Math.floor(fontSize / 38));
    const c1 = hexToRgb(gradientFrom), c2 = hexToRgb(gradientTo);
    const out: Particle[] = [];
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < canvasW; x += step) {
        if (data[(y * canvasW + x) * 4 + 3] > 90) {
          out.push({ x, y, r: 1.15, rgb: lerpRgb(c1, c2, x / canvasW), seed: Math.random() * 1000 });
        }
      }
    }
    return out;
  }, [canvasW, height, fontSize, gradientFrom, gradientTo, hexToRgb, lerpRgb]);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reduceMotionRef.current = mq.matches;
    const on = (e: MediaQueryListEvent) => { reduceMotionRef.current = e.matches; };
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const el = canvasRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { isVisibleRef.current = e.isIntersecting; }, { rootMargin: '50px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [mounted]);

  // Morph scheduler + particle animation. The canvas only paints during a melt.
  useEffect(() => {
    if (!mounted || reduceMotionRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = clampDpr(window.devicePixelRatio || 1, window.innerWidth);
    canvas.width = canvasW * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const fontStr = resolveFont();
    particlesARef.current = sampleText(wordA, fontStr);
    particlesBRef.current = sampleText(wordB, fontStr);

    let idleId = 0;
    let morphTimer: ReturnType<typeof setTimeout> | null = null;
    let morphT = 0;
    let fromIdx = stateRef.current.wordIdx;

    const drawParticles = (mt: number, t: number) => {
      ctx.clearRect(0, 0, canvasW, height);
      const from = fromIdx === 0 ? particlesARef.current : particlesBRef.current;
      const to = fromIdx === 0 ? particlesBRef.current : particlesARef.current;
      const len = Math.max(from.length, to.length);
      for (let i = 0; i < len; i++) {
        const fp = from[i % from.length];
        const tp = to[i % to.length];
        const stagger = (fp.seed % 100) / 100 * 0.12;
        const pt = Math.max(0, Math.min(1, (mt - stagger) / (1 - stagger)));
        const e = smoothstep(pt);
        const wob = Math.sin(t * 0.0018 + fp.seed) * 0.35 * (1 - Math.abs(e - 0.5) * 2);
        const x = fp.x + (tp.x - fp.x) * e + wob;
        const y = fp.y + (tp.y - fp.y) * e;
        const r = Math.round(fp.rgb[0] + (tp.rgb[0] - fp.rgb[0]) * e);
        const g = Math.round(fp.rgb[1] + (tp.rgb[1] - fp.rgb[1]) * e);
        const b = Math.round(fp.rgb[2] + (tp.rgb[2] - fp.rgb[2]) * e);
        const pg = ctx.createRadialGradient(x, y, 0, x, y, fp.r * 2.4);
        pg.addColorStop(0, `rgb(${r},${g},${b})`);
        pg.addColorStop(0.6, `rgba(${r},${g},${b},0.55)`);
        pg.addColorStop(1, 'transparent');
        ctx.fillStyle = pg;
        ctx.fillRect(x - fp.r * 2.4, y - fp.r * 2.4, fp.r * 4.8, fp.r * 4.8);
      }
    };

    const animateMorph = (t: number) => {
      morphT += 0.028; // ~0.6s melt at 60fps
      if (morphT >= 1) {
        // Settle: flip the word, draw it as STILL dots (mt=0), then idle.
        stateRef.current.wordIdx = 1 - fromIdx;
        fromIdx = stateRef.current.wordIdx;
        setActiveWordIndex(stateRef.current.wordIdx); // resize box to new word
        drawParticles(0, t); // resting dotted word
        scheduleNext();
        return;
      }
      drawParticles(morphT, t);
      animRef.current = requestAnimationFrame(animateMorph);
    };

    const scheduleNext = () => {
      cycleRef.current += 1;
      const hash = Math.sin(cycleRef.current * 12.9898) * 43758.5453;
      const frac = hash - Math.floor(hash);
      const wait = Math.max(2500, interval + (frac - 0.5) * 5000);
      morphTimer = setTimeout(() => {
        if (!isVisibleRef.current) { scheduleNext(); return; }
        fromIdx = stateRef.current.wordIdx;
        morphT = 0;
        animRef.current = requestAnimationFrame(animateMorph);
      }, wait);
    };

    // First paint: draw the resting word AS DOTS immediately (the word is always
    // particles), reveal the canvas, then start the idle→morph cycle. Deferred
    // to idle so it doesn't compete with LCP.
    const begin = () => {
      drawParticles(0, performance.now());
      setPainted(true);
      scheduleNext();
    };
    if (typeof window.requestIdleCallback === 'function') idleId = window.requestIdleCallback(begin, { timeout: 1500 });
    else morphTimer = setTimeout(begin, 400);

    return () => {
      cancelAnimationFrame(animRef.current);
      if (morphTimer) clearTimeout(morphTimer);
      if (idleId && typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idleId);
    };
  }, [mounted, canvasW, height, wordA, wordB, fontSize, interval, synchronized, sampleText, resolveFont, smoothstep]);

  return (
    <span
      className={`relative inline-block align-baseline ${className}`}
      // Box is exactly the word width, so add ONE normal word-space before the
      // next word (JSX collapses the source whitespace). 0.25em ≈ a space glyph.
      style={{ verticalAlign: 'baseline', marginRight: '0.25em', top: nudgeY ? `${nudgeY}em` : undefined }}
      aria-label={`${wordA} / ${wordB}`}
    >
      {/* INVISIBLE width-definer: the real DOM word sizes the inline box exactly
          (so spacing is correct) but is never shown — the visible rendering is
          ALWAYS the canvas dots. Also carries no a11y (the wrapper has the
          aria-label). visibility:hidden keeps layout but paints nothing. */}
      <span
        aria-hidden="true"
        style={{
          fontWeight: 700,
          whiteSpace: 'nowrap',
          visibility: 'hidden',
        }}
      >
        {words[activeWordIndex]}
      </span>
      {/* The word is ALWAYS rendered as particles/dots (matching font). At rest
          it's a still dotted word; during a morph the dots flow to the next
          word. The canvas is always visible. Before first paint, the SSR sizer
          above reserves the slot so there's no layout flash. */}
      {mounted && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: canvasW,
            height,
            pointerEvents: 'none',
            opacity: painted ? 1 : 0,
            transition: 'opacity 200ms ease-out',
          }}
        />
      )}
    </span>
  );
}

export const ParticleMorphText = memo(ParticleMorphTextImpl);

export default ParticleMorphText;
