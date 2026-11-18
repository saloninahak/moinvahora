'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { flags } from '@/lib/timeline';
import { lockScroll } from '@/lib/lenis';

const SEEN = 'moin.loaded';
/** Minimum time on screen: long enough to read as intentional, short enough not to annoy. */
const MIN_FIRST = 1900;
const MIN_REPEAT = 600;
/** One frame every ~65ms: fast enough to read as motion, slow enough to see each picture. */
const FLIP_MS = 65;
/** Background tints the whole screen drifts through (dark, low-chroma). */
const TINTS = ['#07090c', '#170b10', '#0b1022', '#18110a', '#09140f', '#120b19'];

type Frame = { src: string; label: string };

/**
 * First-visit loader. Every frame is mounted once, stacked and preloaded, and
 * the flip only changes which one is visible: no image decoding and no React
 * re-render per frame, so it stays smooth. The background colour drifts
 * continuously. When the real preload finishes, the hero shot shows in the
 * window and the window opens to the edges of the screen, lining up exactly
 * with the WebGL stage behind. Rendered on the server, so nothing flashes first.
 */
export function Loader({ frames, hero, name }: { frames: readonly Frame[]; hero: string; name: string }) {
  const [phase, setPhase] = useState<'load' | 'open' | 'gone'>('load');
  const root = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const skip = useRef(false);

  // Already seen this session (e.g. coming back to Home from Work): no loader
  // at all. Runs before paint, so it never flashes on client navigation.
  useLayoutEffect(() => {
    try {
      skip.current = sessionStorage.getItem(SEEN) === '1';
    } catch {
      skip.current = false;
    }
    if (skip.current) {
      flags.gated = false;
      setPhase('gone');
    }
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el || skip.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    flags.gated = true;
    lockScroll(true);

    const imgs = [...el.querySelectorAll<HTMLImageElement>('.loader__img')];
    const heroImg = el.querySelector<HTMLImageElement>('.loader__img--hero');
    const min = reduced ? MIN_REPEAT : MIN_FIRST;
    const t0 = performance.now();

    // Real preload: decode every frame before counting it.
    let loaded = 0;
    const total = imgs.length;
    imgs.forEach((img) => {
      const done = () => {
        loaded += 1;
      };
      if (img.complete && img.naturalWidth) {
        img.decode().then(done, done);
        return;
      }
      img.addEventListener('load', () => img.decode().then(done, done), { once: true });
      img.addEventListener('error', done, { once: true });
    });

    let raf = 0;
    let shown = 0;
    let lastFlip = 0;
    let idx = 0;
    let finished = false;
    const flipFrames = imgs.filter((img) => img !== heroImg);

    const show = (i: number) => {
      flipFrames.forEach((img, k) => img.classList.toggle('is-on', k === i));
      if (labelRef.current) labelRef.current.textContent = frames[i]?.label ?? '';
    };
    show(0);

    const loop = (now: number) => {
      const real = loaded / total;
      const time = Math.min(1, (now - t0) / min);
      // Never run ahead of the real preload, never finish before `min`.
      const target = Math.min(real, time);
      shown += (target - shown) * 0.16;
      if (target >= 1 && shown > 0.996) shown = 1;
      if (pctRef.current) pctRef.current.textContent = String(Math.round(shown * 100)).padStart(3, '0');
      // Continuous colour drift: hue walks through the tints with the counter.
      const tf = (now - t0) / 700;
      const a = TINTS[Math.floor(tf) % TINTS.length];
      el.style.setProperty('--tint', a);

      if (!reduced && now - lastFlip > FLIP_MS && shown < 1) {
        lastFlip = now;
        idx = (idx + 1) % flipFrames.length;
        show(idx);
      }
      if (shown >= 1 && !finished) {
        finished = true;
        finish();
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    function finish() {
      // The hero fades in under the last flip frame; the flipbook drops when the window opens.
      heroImg?.classList.add('is-on');
      if (labelRef.current) labelRef.current.textContent = '';
      // Let the hero frame land for a beat, then open the window.
      window.setTimeout(() => setPhase('open'), reduced ? 0 : 160);
      try {
        sessionStorage.setItem(SEEN, '1');
      } catch {
        /* ignore */
      }
      window.setTimeout(
        () => {
          flags.gated = false;
          lockScroll(false);
        },
        reduced ? 0 : 420,
      );
      window.setTimeout(() => setPhase('gone'), reduced ? 300 : 1200);
    }

    return () => {
      cancelAnimationFrame(raf);
      flags.gated = false;
      lockScroll(false);
    };
    // Frames come from static content; run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === 'gone') return null;

  return (
    <div ref={root} className={`loader${phase === 'open' ? ' is-open' : ''}`} role="status" aria-label="Loading">
      {/* Hero: full-screen behind a clip window, so opening it lines up with the stage. */}
      <div className="loader__frame">
        <img className="loader__img loader__img--hero" src={hero} alt="" decoding="async" fetchPriority="high" />
      </div>
      {/* Flipbook: small frames in a box the size of the window (cheap to paint). */}
      <div className="loader__flip">
        {frames.map((f, i) => (
          <img key={f.src + f.label} className={`loader__img${i === 0 ? ' is-on' : ''}`} src={f.src} alt="" decoding="async" fetchPriority="high" />
        ))}
      </div>
      <div className="loader__meta" aria-hidden="true">
        <span className="loader__name">{name}</span>
        <span className="loader__label" ref={labelRef} />
        <span className="loader__pct" ref={pctRef}>
          000
        </span>
      </div>
    </div>
  );
}
