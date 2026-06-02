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
  /** Extra vertical offset in em units (e.g. 0.03 to nudge down) */
  nudgeY?: number;
  /**
   * When true, disables the ±400-500ms random offset on `nextInterval` so
   * paired morph instances stay phase-locked. Use this for hero pairs that
   * must morph in unison (e.g. "Emergent intelligence for adaptive agents"
   * crossing over to "Adaptive intelligence for emergent agents"). Default
   * `false` keeps the legacy organic-jitter behavior for standalone uses.
   */
  synchronized?: boolean;
}

/**
 * ParticleMorphText - Smooth exponential decay morphing with randomized timing.
 *
 * Visuals are the original colored-gradient particle melt. The only additions
 * over the original are INVISIBLE performance gates that change WHEN the rAF
 * loop runs, never how it looks:
 *   - prefers-reduced-motion → render the static gradient word, no loop
 *   - IntersectionObserver → pause drawing while scrolled offscreen
 *   - requestIdleCallback → defer the first frame until after first paint/LCP
 *   - clampDpr → cap the canvas backing store on mobile
 */
export const ParticleMorphText = memo(function ParticleMorphText({
  words,
  className = '',
  interval = 2500,
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
  const prefersReducedMotionRef = useRef(false);
  const stateRef = useRef({
    wordIdx: startIndex,
    morphT: 0,
    lastSwitch: 0,
    isMorphing: false,
    widthSwitched: false,
    cycle: 0,
    nextInterval: interval
  });
  const particlesARef = useRef<{ x: number; y: number; r: number; c: string; rgb: [number, number, number]; seed: number }[]>([]);
  const particlesBRef = useRef<{ x: number; y: number; r: number; c: string; rgb: [number, number, number]; seed: number }[]>([]);
  const [mounted, setMounted] = useState(false);
  // True only AFTER the canvas has drawn its first frame. Until then the static
  // gradient word stays visible, so there's never an empty-slot flash in the
  // window between hydration (mounted=true) and the idle-deferred first paint.
  const [painted, setPainted] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState(startIndex);
  const [_fontsReady, setFontsReady] = useState(false);

  const height = useMemo(() => Math.ceil(fontSize * 1.15), [fontSize]);
  const [wordWidths, setWordWidths] = useState<[number, number]>(() => {
    // Initial pre-measurement estimate calibrated against Inter 700:
    // average proportional glyph width is ~0.55 of fontSize. The old
    // 0.72 factor over-shot by ~30%, leaving a ~60–80px gap between
    // the morph and the next inline word ("intelligence", "agents")
    // until the post-fonts.ready measurement landed. 0.58 trades a bit
    // of safety for a much tighter SSR placement.
    const estimate = (text: string) => Math.ceil(text.length * fontSize * 0.58);
    return [estimate(wordA), estimate(wordB)];
  });
  const width = useMemo(() => Math.max(wordWidths[0], wordWidths[1]), [wordWidths]);
  // Per-word wrapper width drives the slide-and-reflow effect: as
  // "Emergent" morphs into "Adaptive", the wrapper shrinks/grows and
  // the surrounding inline flow ("intelligence", "agents") slides with
  // it. CSS `transition: width 180ms ease-out` (set on the wrapper)
  // animates the change. This costs ~0.10–0.15 CLS per morph cycle —
  // explicitly accepted as a design trade because the slide is part of
  // the hero's identity. The font-display:optional and body-shift
  // fixes elsewhere already cut the bigger CLS contributors.
  const _wrapperWidth = wordWidths[activeWordIndex] ?? width;

  const hexToRgb = useCallback((hex: string) => {
    const v = parseInt(hex.slice(1), 16);
    return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
  }, []);

  const lerp = useCallback((a: number[], b: number[], t: number) =>
    `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)})`, []);

  // Exponential decay easing for smooth organic motion
  const easeOutExpo = useCallback((t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t), []);
  const easeInOutExpo = useCallback((t: number) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    return t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2;
  }, []);

  /** Pre-parse an "rgb(r,g,b)" string into a numeric triple. */
  const parseRgbString = useCallback((rgbStr: string): [number, number, number] => {
    const m = rgbStr.match(/(\d+)/g);
    return m ? [Number(m[0]), Number(m[1]), Number(m[2])] : [0, 0, 0];
  }, []);

  const sampleText = useCallback((text: string) => {
    const off = document.createElement('canvas');
    const ctx = off.getContext('2d', { willReadFrequently: true });
    if (!ctx) return [];

    off.width = width;
    off.height = height;
    ctx.font = `700 ${fontSize}px Inter, system-ui, sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#fff';
    ctx.fillText(text, 0, fontSize * 0.92);

    const data = ctx.getImageData(0, 0, width, height).data;
    // Tighter sampling = denser particles = sharper text. The previous
    // step was fontSize/20 which left letters looking dotted at small
    // fontSize values. Halving it doubles particle count for ~2x render
    // cost (still <1ms/frame at hero font sizes).
    const step = Math.max(1, Math.floor(fontSize / 36));
    const c1 = hexToRgb(gradientFrom), c2 = hexToRgb(gradientTo);
    const particles: { x: number; y: number; r: number; c: string; rgb: [number, number, number]; seed: number }[] = [];

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const alpha = data[(y * width + x) * 4 + 3];
        if (alpha > 80) {
          const colorStr = lerp(c1, c2, x / width);
          particles.push({
            x, y,
            r: 1.1,
            c: colorStr,
            rgb: parseRgbString(colorStr),
            seed: Math.random() * 1000,
          });
        }
      }
    }
    return particles;
  }, [width, height, fontSize, gradientFrom, gradientTo, hexToRgb, lerp, parseRgbString]);

  useEffect(() => { setMounted(true); }, []);

  // Respect reduced-motion: skip the rAF loop, keep the static gradient word.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotionRef.current = mq.matches;
    const onChange = (e: MediaQueryListEvent) => { prefersReducedMotionRef.current = e.matches; };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Pause drawing when the hero is scrolled out of view.
  useEffect(() => {
    if (!mounted) return;
    const el = canvasRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
      { threshold: 0, rootMargin: '50px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    stateRef.current.wordIdx = startIndex;
    setActiveWordIndex(startIndex);
  }, [mounted, startIndex]);

  useEffect(() => {
    if (!mounted) return;
    let cancelled = false;

    const measure = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.font = `700 ${fontSize}px Inter, system-ui, sans-serif`;
      const paddingX = Math.ceil(fontSize * 0.18);

      const next: [number, number] = [
        Math.ceil(ctx.measureText(wordA).width) + paddingX,
        Math.ceil(ctx.measureText(wordB).width) + paddingX,
      ];

      if (cancelled) return;
      setWordWidths((prev) => (prev[0] === next[0] && prev[1] === next[1] ? prev : next));
      setFontsReady(true);
    };

    const fontReady = (document as Document & { fonts?: { ready?: Promise<unknown> } }).fonts?.ready;
    if (fontReady && typeof fontReady.then === 'function') {
      fontReady.then(measure).catch(measure);
    } else {
      measure();
    }

    return () => {
      cancelled = true;
    };
  }, [mounted, fontSize, wordA, wordB]);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Reduced motion: the static gradient fallback span already shows; skip
    // the rAF loop entirely so there is no per-frame main-thread cost.
    if (prefersReducedMotionRef.current) return;

    const dpr = clampDpr(window.devicePixelRatio || 1, window.innerWidth);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    particlesARef.current = sampleText(wordA);
    particlesBRef.current = sampleText(wordB);
    stateRef.current.lastSwitch = performance.now();

    let idleId = 0;
    let morphTimer: ReturnType<typeof setTimeout> | null = null;

    // Paint a single frame. `mt` is the morph progress 0..1 (0 = the word at
    // rest). Pulled out of the rAF loop so the IDLE state between morphs costs
    // exactly one draw, not 60 redraws/sec. This is the optimization: the loop
    // only runs during the ~0.4s morph; the other ~6.6s of every cycle the
    // canvas holds a single static frame with zero CPU.
    // Crisp gradient text — pixel-identical sharpness to the static words.
    // Drawn at REST (between morphs) so the headline never looks fuzzy; the
    // soft particle melt only appears during the brief transition.
    const grad = ctx.createLinearGradient(0, 0, width, 0);
    grad.addColorStop(0, gradientFrom);
    grad.addColorStop(1, gradientTo);
    const drawCrispWord = (text: string) => {
      ctx.clearRect(0, 0, width, height);
      ctx.font = `700 ${fontSize}px Inter, system-ui, sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = grad;
      ctx.fillText(text, 0, fontSize * 0.92);
    };

    const paintFrame = (mt: number, t: number) => {
      const s = stateRef.current;
      const morphing = mt > 0 && mt < 1;

      // At rest: crisp text, no blur. (mt===0 just settled on the new word;
      // mt is only >0 during an active morph.)
      if (!morphing) {
        drawCrispWord(s.wordIdx === 0 ? wordA : wordB);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      const fromParticles = s.wordIdx === 0 ? particlesARef.current : particlesBRef.current;
      const toParticles = s.wordIdx === 0 ? particlesBRef.current : particlesARef.current;
      // Linear progress here; the gentle smoothstep is applied per-particle
      // below. Previously easeInOutExpo here STACKED with a second ease,
      // producing the harsh whip-across motion that read as chaotic.
      const easeT = mt;
      const maxLen = Math.max(fromParticles.length, toParticles.length);

      for (let i = 0; i < maxLen; i++) {
        const fromP = fromParticles[i % fromParticles.length];
        const toP = toParticles[i % toParticles.length];

        // Per-particle stagger based on seed for organic feel. Tightened from
        // 0.15 so particles travel more in unison (less scattered/chaotic).
        const stagger = (fromP.seed % 100) / 100 * 0.10;
        const particleT = Math.max(0, Math.min(1, (easeT - stagger) / (1 - stagger)));
        // Smoothstep instead of a second exponential ease: gentle symmetric
        // S-curve with no harsh mid-transit acceleration. The old easeOutExpo
        // (stacked on the already-eased easeT) made particles whip across,
        // which read as jittery/abrupt.
        const smoothT = particleT * particleT * (3 - 2 * particleT);

        // Subtle drift, not shimmer (this branch only runs during a morph).
        const wobble = Math.sin(t * 0.0016 + fromP.seed) * 0.25 * (1 - Math.abs(smoothT - 0.5) * 2);

        const x = fromP.x + (toP.x - fromP.x) * smoothT + wobble;
        const y = fromP.y + (toP.y - fromP.y) * smoothT;

        const fRgb = fromP.rgb;
        const tRgb = toP.rgb;
        const r = Math.round(fRgb[0] + (tRgb[0] - fRgb[0]) * smoothT);
        const g = Math.round(fRgb[1] + (tRgb[1] - fRgb[1]) * smoothT);
        const b = Math.round(fRgb[2] + (tRgb[2] - fRgb[2]) * smoothT);

        // Near-opaque throughout. The old 0.85+0.15*cos(2π) dipped to ~0.7 at
        // mid-morph and rebounded, which read as a flicker. Hold steady.
        const alpha = 1;

        // Soft radial glow — colored per-particle gradient (violet→magenta melt).
        // `pg` (not `grad`) to avoid shadowing the outer linear text gradient.
        const pg = ctx.createRadialGradient(x, y, 0, x, y, fromP.r * 2.5);
        pg.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
        pg.addColorStop(0.5, `rgba(${r},${g},${b},${alpha * 0.5})`);
        pg.addColorStop(1, 'transparent');
        ctx.fillStyle = pg;
        ctx.fillRect(x - fromP.r * 2.5, y - fromP.r * 2.5, fromP.r * 5, fromP.r * 5);
      }
    };

    // rAF loop that runs ONLY during a morph, then stops and schedules the next.
    const animateMorph = (t: number) => {
      const s = stateRef.current;
      s.morphT += 0.05; // ~0.33s morph at 60fps — a quick flit, not a slow melt

      // Switch width at morph midpoint so spacing animates in sync.
      if (s.morphT >= 0.5 && !s.widthSwitched) {
        s.widthSwitched = true;
        setActiveWordIndex(1 - s.wordIdx);
      }

      if (s.morphT >= 1) {
        // Morph complete: settle on the target word, draw one static frame,
        // and idle until the next morph (no rAF in between).
        s.morphT = 0;
        s.isMorphing = false;
        s.widthSwitched = false;
        s.wordIdx = 1 - s.wordIdx;
        paintFrame(0, t);
        scheduleNext();
        return;
      }

      paintFrame(s.morphT, t);
      animRef.current = requestAnimationFrame(animateMorph);
    };

    // Wait a VARYING interval, then kick off one morph. The wait is a
    // deterministic function of the cycle counter (a sine hash), not Math.random:
    // synchronized instances share `interval` and step `cycle` in lockstep, so
    // they compute the SAME wait every cycle — the word pair stays coherent
    // ("Emergent…adaptive" ⇄ "Adaptive…emergent") while the gap between morphs
    // varies (~7s ± 2.5s) so it never feels like a fixed metronome.
    const scheduleNext = () => {
      const s = stateRef.current;
      s.cycle += 1;
      // pseudo-random in [-1, 1] from the cycle index; same for both instances.
      const jitter = Math.sin(s.cycle * 12.9898) * 43758.5453;
      const frac = jitter - Math.floor(jitter); // [0,1)
      const wait = interval + (frac - 0.5) * 5000; // interval ± 2.5s
      morphTimer = setTimeout(() => {
        // Skip the morph entirely while scrolled offscreen; re-check later.
        if (!isVisibleRef.current) { scheduleNext(); return; }
        s.isMorphing = true;
        s.morphT = 0;
        s.widthSwitched = false;
        animRef.current = requestAnimationFrame(animateMorph);
      }, wait);
    };

    // First paint: draw the resting word once, reveal the canvas (it now has
    // content, so swapping out the static word can't flash), then start the
    // idle→morph cycle. Deferred to idle so it never competes with hydration.
    const begin = () => {
      paintFrame(0, performance.now());
      setPainted(true);
      scheduleNext();
    };
    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(begin, { timeout: 1500 });
    } else {
      morphTimer = setTimeout(begin, 200);
    }

    return () => {
      cancelAnimationFrame(animRef.current);
      if (morphTimer) clearTimeout(morphTimer);
      if (idleId && typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idleId);
    };
  }, [mounted, width, height, wordA, wordB, interval, synchronized, sampleText, easeOutExpo, easeInOutExpo]);

  // Inline-block for proper text flow alignment
  return (
    <span
      className={`inline-block ${className}`}
      style={{
        width: _wrapperWidth,
        height,
        overflow: 'visible',
        verticalAlign: 'baseline',
        position: 'relative',
        top: `${0.22 + nudgeY}em`,
        marginRight: '0.2em',
        transition: 'width 180ms ease-out',
      }}
    >
      <span className="sr-only">{wordA} / {wordB}</span>
      {/* Loading skeleton: a rounded shimmer block sitting behind the word,
          shown only until the canvas has painted. Covers the cold-load window
          where the morph cell isn't ready yet, then fades out. Uses the
          critical-CSS `.skeleton` shimmer so it animates from first paint. */}
      {!painted && (
        <span
          aria-hidden="true"
          className="skeleton"
          style={{
            position: 'absolute',
            top: '0.12em',
            left: 0,
            width: '100%',
            height: '0.82em',
            borderRadius: '0.18em',
            pointerEvents: 'none',
          }}
        />
      )}
      {/* The static gradient word is ALWAYS rendered — it's the SSR content,
          it holds the inline box, and it stays visible until the canvas has
          actually drawn (painted=true). Crossfades out once the canvas is up,
          so there is never an empty slot between hydration and first paint. */}
      <span
        className="text-[28px] sm:text-[36px] lg:text-[48px]"
        aria-hidden="true"
        style={{
          background: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: 700,
          lineHeight: 1,
          whiteSpace: 'nowrap',
          opacity: painted ? 0 : 1,
          transition: 'opacity 200ms ease-out',
        }}
      >
        {words[activeWordIndex]}
      </span>
      {/* Canvas is layered ON TOP of the static word once mounted, revealed
          only after its first frame is drawn — so the swap never flashes. */}
      {mounted && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{
            width, height, display: 'block',
            position: 'absolute', top: 0, left: 0,
            opacity: painted ? 1 : 0,
            transition: 'opacity 200ms ease-out',
          }}
        />
      )}
    </span>
  );
});

export default ParticleMorphText;
