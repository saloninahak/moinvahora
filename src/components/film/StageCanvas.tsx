'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { Stage } from '@/lib/stage';
import { director, resetDirector, type Direction } from '@/lib/director';
import { flags, tick, resetHud } from '@/lib/timeline';
import { resetScroll } from '@/lib/lenis';

/**
 * Fixed full-screen WebGL stage behind the page, driven by one ticker.
 *
 * Each mount creates its own <canvas>. A canvas whose WebGL context was
 * released (loseContext on unmount, or React dev's double mount) can't be
 * reused, so reusing one on client-side navigation left a blank white stage.
 */
export function StageCanvas({
  shots,
  gated = false,
  start,
}: {
  shots: readonly string[];
  /** Hold reveals until the Loader opens. */
  gated?: boolean;
  /** Initial stage look for pages without chapters (index, case studies). */
  start?: Partial<Direction>;
}) {
  const host = useRef<HTMLDivElement>(null);
  const key = shots.join('|');

  useEffect(() => {
    const box = host.current;
    if (!box) return;
    const html = document.documentElement;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    html.classList.add('film');
    html.classList.remove('no-webgl');
    // The Loader owns the gate (it may skip itself on repeat visits); pages without one open at once.
    if (!gated) flags.gated = false;
    resetDirector(start);
    resetScroll();

    const canvas = document.createElement('canvas');
    canvas.className = 'stage';
    canvas.setAttribute('aria-hidden', 'true');
    box.appendChild(canvas);

    let stage: Stage | null = null;
    try {
      stage = new Stage(canvas, shots, still);
    } catch (e) {
      console.warn('[stage] WebGL unavailable, using the static fallback.', e);
      html.classList.add('no-webgl');
    }

    resetHud();
    let last = performance.now();
    // The film window: clip the stage to a rectangle that opens from the
    // centre. Closed = a normal page; open = the immersive film.
    let win = director.win;
    let lastClip = '';
    const loop = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      tick();
      win += (director.win - win) * (1 - Math.exp(-dt * 6));
      if (Math.abs(director.win - win) < 0.001) win = director.win;
      const w = win * win * (3 - 2 * win);
      const inset = ((1 - w) * 50).toFixed(2);
      const clip = w >= 0.999 ? 'none' : `inset(${inset}% ${inset}% round ${Math.round((1 - w) * 28)}px)`;
      if (clip !== lastClip) {
        box.style.clipPath = clip;
        html.classList.toggle('film-on', w > 0.02);
        lastClip = clip;
      }
      // Fully closed: nothing to show, skip the GPU work.
      if (w > 0.001) stage?.render(dt);
    };
    gsap.ticker.add(loop);

    return () => {
      gsap.ticker.remove(loop);
      stage?.destroy();
      canvas.remove();
    };
    // `key` stands in for `shots`; `start` and `gated` are fixed per page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return <div ref={host} className="stage-host" aria-hidden="true" />;
}
