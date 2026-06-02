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
   * interval so the phrase stays coherent ("Emergent…adaptive" ⇄
   * "Adaptive…emergent"). Interval varies (deterministic hash of cycle index,
   * identical across synced instances) so it isn't a fixed metronome.
   */
  synchronized?: boolean;
}

type Particle = { x: number; y: number; r: number; rgb: [number, number, number]; seed: number };

/**
 * Particle-melt morphing word. Letters dissolve into colored particles and
 * reflow into the next word, then settle as crisp gradient text at rest.
 *
 * Two fixes over earlier versions:
 *  - Glyphs are sampled with the element's REAL computed font (read at runtime),
 *    not a hardcoded "Inter" — Next.js hashes the Inter family name, so the old
 *    hardcoded value fell back to a heavier system font that didn't match the
 *    surrounding headline. Now the melt matches the static words exactly.
 *  - The inline box tracks the ACTIVE word's width (with a width transition),
 *    so a narrower word doesn't leave a big gap before the next word.
 *
 * Performance: at rest the canvas holds one static frame (no rAF); the loop
 * runs only during the ~0.6s morph. Idle-deferred first paint, paused offscreen,
 * honors reduced-motion, mobile DPR cap.
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
  const stateRef = useRef({ wordIdx: startIndex, morphT: 0, isMorphing: false, widthSwitched: false });

  const [mounted, setMounted] = useState(false);
  const [painted, setPainted] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState(startIndex);
  const [wordWidths, setWordWidths] = useState<[number, number]>(() => {
    const est = (t: string) => Math.ceil(t.length * fontSize * 0.6);
    return [est(wordA), est(wordB)];
  });

  const height = useMemo(() => Math.ceil(fontSize * 1.18), [fontSize]);
  const maxWidth = useMemo(() => Math.max(wordWidths[0], wordWidths[1]), [wordWidths]);
  // Inline box tracks the ACTIVE word's width (not the max) so a narrower word
  // doesn't leave dead space before the following word. Animated for a smooth slide.
  const boxWidth = wordWidths[activeWordIndex] ?? maxWidth;

  const gradientCss = useMemo(
    () => `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})`,
    [gradientFrom, gradientTo]
  );

  const hexToRgb = useCallback((hex: string): [number, number, number] => {
    const v = parseInt(hex.slice(1), 16);
    return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
  }, []);
  const lerpRgb = useCallback((a: [number, number, number], b: [number, number, number], t: number): [number, number, number] =>
    [Math.round(a[0] + (b[0] - a[0]) * t), Math.round(a[1] + (b[1] - a[1]) * t), Math.round(a[2] + (b[2] - a[2]) * t)], []);
  const smoothstep = useCallback((t: number) => t * t * (3 - 2 * t), []);

  // The exact font the headline renders in — read from the live canvas element's
  // computed style so the sampled glyphs match the surrounding text precisely.
  const resolveFont = useCallback(() => {
    const el = canvasRef.current;
    const fam = el ? getComputedStyle(el).fontFamily : 'ui-sans-serif, system-ui, sans-serif';
    return `700 ${fontSize}px ${fam}`;
  }, [fontSize]);

  const sampleText = useCallback((text: string, fontStr: string, w: number): Particle[] => {
    const off = document.createElement('canvas');
    const ctx = off.getContext('2d', { willReadFrequently: true });
    if (!ctx) return [];
    off.width = w; off.height = height;
    ctx.font = fontStr;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#fff';
    ctx.fillText(text, 0, fontSize * 0.94);
    const data = ctx.getImageData(0, 0, w, height).data;
    const step = Math.max(1, Math.floor(fontSize / 38));
    const c1 = hexToRgb(gradientFrom), c2 = hexToRgb(gradientTo);
    const out: Particle[] = [];
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < w; x += step) {
        if (data[(y * w + x) * 4 + 3] > 90) {
          out.push({ x, y, r: 1.15, rgb: lerpRgb(c1, c2, x / w), seed: Math.random() * 1000 });
        }
      }
    }
    return out;
  }, [height, fontSize, gradientFrom, gradientTo, hexToRgb, lerpRgb]);

  useEffect(() => { setMounted(true); }, []);

  // reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reduceMotionRef.current = mq.matches;
    const on = (e: MediaQueryListEvent) => { reduceMotionRef.current = e.matches; };
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  // pause offscreen
  useEffect(() => {
    if (!mounted) return;
    const el = canvasRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { isVisibleRef.current = e.isIntersecting; }, { rootMargin: '50px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [mounted]);

  // measure real word widths once fonts are ready (using the real computed font)
  useEffect(() => {
    if (!mounted) return;
    let cancelled = false;
    const measure = () => {
      const off = document.createElement('canvas').getContext('2d');
      if (!off || cancelled) return;
      off.font = resolveFont();
      const pad = Math.ceil(fontSize * 0.12);
      const next: [number, number] = [
        Math.ceil(off.measureText(wordA).width) + pad,
        Math.ceil(off.measureText(wordB).width) + pad,
      ];
      setWordWidths(prev => (prev[0] === next[0] && prev[1] === next[1] ? prev : next));
    };
    const fr = (document as Document & { fonts?: { ready?: Promise<unknown> } }).fonts?.ready;
    if (fr && typeof fr.then === 'function') fr.then(measure).catch(measure); else measure();
    return () => { cancelled = true; };
  }, [mounted, fontSize, wordA, wordB, resolveFont]);

  // main draw: crisp text at rest, particle melt during the morph; loop only while morphing
  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    if (reduceMotionRef.current) { setPainted(true); return; }

    const dpr = clampDpr(window.devicePixelRatio || 1, window.innerWidth);
    canvas.width = maxWidth * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const fontStr = resolveFont();
    particlesARef.current = sampleText(wordA, fontStr, maxWidth);
    particlesBRef.current = sampleText(wordB, fontStr, maxWidth);

    let idleId = 0;
    let morphTimer: ReturnType<typeof setTimeout> | null = null;

    // Crisp gradient text — identical sharpness to the static headline words.
    const linGrad = ctx.createLinearGradient(0, 0, maxWidth, 0);
    linGrad.addColorStop(0, gradientFrom);
    linGrad.addColorStop(1, gradientTo);
    const drawCrisp = (text: string) => {
      ctx.clearRect(0, 0, maxWidth, height);
      ctx.font = fontStr;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = linGrad;
      ctx.fillText(text, 0, fontSize * 0.94);
    };

    const drawParticles = (mt: number, t: number) => {
      const s = stateRef.current;
      ctx.clearRect(0, 0, maxWidth, height);
      const from = s.wordIdx === 0 ? particlesARef.current : particlesBRef.current;
      const to = s.wordIdx === 0 ? particlesBRef.current : particlesARef.current;
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
      const s = stateRef.current;
      s.morphT += 0.028; // ~0.6s melt at 60fps
      if (s.morphT >= 0.5 && !s.widthSwitched) {
        s.widthSwitched = true;
        setActiveWordIndex(1 - s.wordIdx); // slide the box to the new word at the midpoint
      }
      if (s.morphT >= 1) {
        s.morphT = 0; s.isMorphing = false; s.widthSwitched = false;
        s.wordIdx = 1 - s.wordIdx;
        drawCrisp(s.wordIdx === 0 ? wordA : wordB);
        scheduleNext();
        return;
      }
      drawParticles(s.morphT, t);
      animRef.current = requestAnimationFrame(animateMorph);
    };

    const scheduleNext = () => {
      cycleRef.current += 1;
      const hash = Math.sin(cycleRef.current * 12.9898) * 43758.5453;
      const frac = hash - Math.floor(hash);
      const wait = Math.max(2500, (synchronized ? interval : interval) + (frac - 0.5) * 5000);
      morphTimer = setTimeout(() => {
        if (!isVisibleRef.current) { scheduleNext(); return; }
        stateRef.current.isMorphing = true;
        stateRef.current.morphT = 0;
        stateRef.current.widthSwitched = false;
        animRef.current = requestAnimationFrame(animateMorph);
      }, wait);
    };

    const begin = () => {
      drawCrisp(stateRef.current.wordIdx === 0 ? wordA : wordB);
      setPainted(true);
      scheduleNext();
    };
    if (typeof window.requestIdleCallback === 'function') idleId = window.requestIdleCallback(begin, { timeout: 1500 });
    else morphTimer = setTimeout(begin, 200);

    return () => {
      cancelAnimationFrame(animRef.current);
      if (morphTimer) clearTimeout(morphTimer);
      if (idleId && typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idleId);
    };
  }, [mounted, maxWidth, height, wordA, wordB, fontSize, interval, synchronized, gradientFrom, gradientTo, sampleText, resolveFont, smoothstep]);

  return (
    <span
      className={`inline-block align-baseline ${className}`}
      style={{
        position: 'relative',
        width: boxWidth,
        height,
        overflow: 'visible',
        verticalAlign: 'baseline',
        top: `${0.22 + nudgeY}em`,
        marginRight: '0.18em',
        transition: 'width 220ms ease-out',
      }}
      aria-label={`${wordA} / ${wordB}`}
    >
      {/* SSR / pre-paint: crisp gradient word, holds the slot until the canvas
          paints its first frame, then crossfades out. No empty-slot flash. */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute', left: 0, top: 0, whiteSpace: 'nowrap',
          fontWeight: 700, lineHeight: 1,
          background: gradientCss,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          opacity: painted ? 0 : 1,
          transition: 'opacity 200ms ease-out',
        }}
      >
        {words[activeWordIndex]}
      </span>
      {mounted && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{
            position: 'absolute', left: 0, top: 0, display: 'block',
            width: maxWidth, height,
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
