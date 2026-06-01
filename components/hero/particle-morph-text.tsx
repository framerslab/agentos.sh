'use client';

import { useEffect, useRef, useState, useCallback, memo, useMemo } from 'react';
import { clampDpr } from '@/lib/hero/dpr';
import { slideOffsetPx } from '@/lib/hero/morph-geometry';

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
  /**
   * Fired with the horizontal offset (px, <= 0) the inline word FOLLOWING this
   * morph should translate by to reproduce the original slide without CLS. The
   * wrapper itself is pinned to the wider word's width (zero reflow); the slide
   * lives on the sibling word, which can only be reached from the parent — so
   * the parent lifts this value into state and applies the transform. Fires on
   * word-flip (~2x per interval), not per animation frame.
   */
  onSlideOffsetChange?: (px: number) => void;
}

/**
 * ParticleMorphText - Smooth exponential decay morphing with randomized timing
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
  onSlideOffsetChange,
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
    nextInterval: synchronized ? interval : interval + (Math.random() - 0.5) * 800
  });
  const particlesARef = useRef<{ x: number; y: number; r: number; c: string; rgb: [number, number, number]; seed: number }[]>([]);
  const particlesBRef = useRef<{ x: number; y: number; r: number; c: string; rgb: [number, number, number]; seed: number }[]>([]);
  const [mounted, setMounted] = useState(false);
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
  // The wrapper is pinned to the WIDER of the two words (`width`) and never
  // changes size, so it contributes zero CLS. To keep the original slide of
  // the surrounding inline flow ("intelligence", "agents"), we report this
  // offset (<= 0px) to the parent, which translates the sibling word by it
  // (a GPU transform that is not counted as layout shift). A CSS custom
  // property cannot reach a sibling, so the value must be lifted up.
  const slideOffset = slideOffsetPx(wordWidths, activeWordIndex);

  // Report the slide offset upward whenever it changes (on word-flip, ~2x per
  // interval — not per frame). The parent applies it to the trailing word.
  useEffect(() => {
    onSlideOffsetChange?.(slideOffset);
  }, [slideOffset, onSlideOffsetChange]);

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

    // Pre-render a soft white radial-glow sprite ONCE. The previous hot path
    // created a fresh createRadialGradient per particle per frame (~1.4s of
    // script exec in PSI). Now we stamp this cached sprite via drawImage and
    // tint with a solid arc underneath. SPRITE_R covers the old r*2.5 extent.
    const SPRITE_R = 3; // device-independent px
    const sprite = document.createElement('canvas');
    sprite.width = sprite.height = Math.ceil(SPRITE_R * 2 * dpr);
    const sctx = sprite.getContext('2d');
    if (sctx) {
      sctx.scale(dpr, dpr);
      const sg = sctx.createRadialGradient(SPRITE_R, SPRITE_R, 0, SPRITE_R, SPRITE_R, SPRITE_R);
      sg.addColorStop(0, 'rgba(255,255,255,1)');
      sg.addColorStop(0.5, 'rgba(255,255,255,0.5)');
      sg.addColorStop(1, 'rgba(255,255,255,0)');
      sctx.fillStyle = sg;
      sctx.fillRect(0, 0, SPRITE_R * 2, SPRITE_R * 2);
    }

    particlesARef.current = sampleText(wordA);
    particlesBRef.current = sampleText(wordB);
    stateRef.current.lastSwitch = performance.now();

    const draw = (t: number) => {
      // Keep the loop alive but skip heavy work while scrolled offscreen.
      if (!isVisibleRef.current) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }
      const s = stateRef.current;
      const elapsed = t - s.lastSwitch;

      ctx.clearRect(0, 0, width, height);

      // Trigger morph with randomized interval
      if (!s.isMorphing && elapsed > s.nextInterval) {
        s.isMorphing = true;
        s.morphT = 0;
      }

      // Faster morph (~0.4s) so the text spends more time fully readable.
      // Previous 0.008/frame meant ~2s in the unclear mid-transition.
      if (s.isMorphing) {
        s.morphT += 0.04;
        // Switch width at morph midpoint so spacing animates in sync with particles
        if (s.morphT >= 0.5 && !s.widthSwitched) {
          s.widthSwitched = true;
          setActiveWordIndex(1 - s.wordIdx);
        }
        if (s.morphT >= 1) {
          s.morphT = 0;
          s.isMorphing = false;
          s.widthSwitched = false;
          s.wordIdx = 1 - s.wordIdx;
          s.lastSwitch = t;
          s.nextInterval = synchronized ? interval : interval + (Math.random() - 0.5) * 1000;
        }
      }

      const fromParticles = s.wordIdx === 0 ? particlesARef.current : particlesBRef.current;
      const toParticles = s.wordIdx === 0 ? particlesBRef.current : particlesARef.current;
      
      // Use exponential easing for smooth organic motion
      const easeT = s.isMorphing ? easeInOutExpo(s.morphT) : 0;
      const maxLen = Math.max(fromParticles.length, toParticles.length);
      
      for (let i = 0; i < maxLen; i++) {
        const fromP = fromParticles[i % fromParticles.length];
        const toP = toParticles[i % toParticles.length];
        
        // Per-particle stagger based on seed for organic feel
        const stagger = (fromP.seed % 100) / 100 * 0.15;
        const particleT = Math.max(0, Math.min(1, (easeT - stagger) / (1 - stagger)));
        const smoothT = easeOutExpo(particleT);
        
        // Reduced wobble keeps letters readable during transit. Previously
        // 2px peak amplitude smeared the glyph shapes; 0.6px gives a hint
        // of organic motion without trashing legibility.
        const wobble = s.isMorphing ? Math.sin(t * 0.003 + fromP.seed) * 0.6 * (1 - Math.abs(smoothT - 0.5) * 2) : 0;
        
        const x = fromP.x + (toP.x - fromP.x) * smoothT + wobble;
        const y = fromP.y + (toP.y - fromP.y) * smoothT;
        
        // Use pre-cached RGB values instead of regex parsing per frame
        const fRgb = fromP.rgb;
        const tRgb = toP.rgb;
        const r = Math.round(fRgb[0] + (tRgb[0] - fRgb[0]) * smoothT);
        const g = Math.round(fRgb[1] + (tRgb[1] - fRgb[1]) * smoothT);
        const b = Math.round(fRgb[2] + (tRgb[2] - fRgb[2]) * smoothT);
        
        // Smoother alpha transition
        const alpha = s.isMorphing ? 0.85 + 0.15 * Math.cos(s.morphT * Math.PI * 2) : 1;
        
        // Soft glow: solid tinted dot + cached white sprite at the particle's
        // alpha. Replaces the per-particle createRadialGradient (the old hot
        // path). Same visual: colored core under a soft white halo.
        ctx.globalAlpha = alpha;
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.beginPath();
        ctx.arc(x, y, fromP.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.drawImage(sprite, x - SPRITE_R, y - SPRITE_R, SPRITE_R * 2, SPRITE_R * 2);
        ctx.globalAlpha = 1;
      }

      animRef.current = requestAnimationFrame(draw);
    };

    // Defer the first frame to idle so the morph loop does not compete with
    // hydration / LCP. Falls back to a short timeout where rIC is missing.
    let idleId = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const begin = () => { animRef.current = requestAnimationFrame(draw); };
    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(begin, { timeout: 1500 });
    } else {
      timer = setTimeout(begin, 200);
    }
    return () => {
      cancelAnimationFrame(animRef.current);
      if (timer) clearTimeout(timer);
      if (idleId && typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idleId);
    };
  }, [mounted, width, height, wordA, wordB, interval, sampleText, easeOutExpo, easeInOutExpo]);

  // The wrapper's width is defined by a HIDDEN real-text sizer rendering the
  // wider of the two words, NOT by the JS character-count estimate. Real glyph
  // metrics are identical at SSR (CSS) and post-hydration, so the wrapper width
  // never changes — eliminating the inline reflow that moved the second H1 line
  // and caused ~0.15 CLS. The canvas and static fallback are absolutely
  // positioned ON TOP of the sizer, so swapping them never affects layout.
  // (The visible word is whichever is widest; both gradients/animation are
  // unchanged. The longer word defines the box; the shorter just has slack.)
  const widestWord = wordWidths[0] >= wordWidths[1] ? wordA : wordB;
  return (
    <span
      className={`inline-block ${className}`}
      style={{
        height,
        overflow: 'visible',
        verticalAlign: 'baseline',
        position: 'relative',
        top: `${0.22 + nudgeY}em`,
        marginRight: '0.2em',
      }}
    >
      <span className="sr-only">{wordA} / {wordB}</span>
      {/* Width sizer: real glyphs, no estimate, defines the box at SSR + runtime
          identically. aria-hidden + visibility:hidden so it neither paints nor
          is announced; it only reserves horizontal space. */}
      <span
        aria-hidden="true"
        style={{ visibility: 'hidden', fontSize, fontWeight: 700, whiteSpace: 'nowrap', display: 'inline-block' }}
      >
        {widestWord}
      </span>
      {mounted ? (
        <canvas
          ref={canvasRef}
          style={{ width, height, display: 'block', position: 'absolute', top: 0, left: 0 }}
          aria-hidden="true"
        />
      ) : (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute', top: 0, left: 0,
            background: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize, fontWeight: 700, whiteSpace: 'nowrap',
          }}
        >
          {words[startIndex]}
        </span>
      )}
    </span>
  );
});

export default ParticleMorphText;
