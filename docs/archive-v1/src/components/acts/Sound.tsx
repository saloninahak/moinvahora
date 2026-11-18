'use client';

import { useRef } from 'react';
import { gsap, MQ, pinned, useGSAP } from '@/lib/gsap';
import { home } from '@content/home';

const W = 1400;
const H = 320;
const MID = H / 2;
const BARS = 180;

/**
 * Deterministic waveform (integers only), so the server and client render
 * identical markup. One continuous zig-zag path, so stroke-dashoffset
 * draws it in a single sweep.
 */
function buildWave(): string {
  let d = `M0 ${MID}`;
  for (let i = 0; i < BARS; i++) {
    const t = i / (BARS - 1);
    const env = Math.pow(Math.sin(Math.PI * t), 0.7) * (0.55 + 0.45 * Math.pow(Math.sin(t * 9.4), 2));
    const mix = 0.45 + 0.55 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.33));
    const a = Math.round(4 + (MID - 16) * env * mix);
    const x = Math.round(((i + 0.5) / BARS) * W);
    d += ` L${x} ${i % 2 ? MID + a : MID - a}`;
  }
  return `${d} L${W} ${MID}`;
}

const WAVE = buildWave();

/** Act IV: the waveform draws itself as you scroll. */
export function Sound() {
  const root = useRef<HTMLElement>(null);
  const { line, titles } = home.sound;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const el = root.current!;
        const stage = el.querySelector('.act__stage')!;
        const path = el.querySelector<SVGPathElement>('.sound__path')!;
        const wave = el.querySelector<HTMLElement>('.sound__wave')!;
        const len = Math.ceil(path.getTotalLength());
        gsap.set(path, { strokeDasharray: len });

        gsap
          .timeline({ scrollTrigger: pinned(el, 150), defaults: { ease: 'power2.out' } })
          .fromTo(stage, { opacity: 0 }, { opacity: 1, duration: 0.05, ease: 'none' }, 0)
          .from('.sound__line', { opacity: 0, y: 16, duration: 0.1 }, 0.05)
          .fromTo(path, { strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.72, ease: 'none' }, 0.08)
          .fromTo('.sound__head', { x: 0, opacity: 1 }, { x: () => wave.clientWidth, duration: 0.72, ease: 'none' }, 0.08)
          .to('.sound__head', { opacity: 0, duration: 0.04 }, 0.8)
          .from('.sound__title', { opacity: 0, y: 14, duration: 0.1, stagger: 0.14 }, 0.3)
          .to(stage, { opacity: 0, duration: 0.07, ease: 'none' }, 0.93);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="act act--sound" aria-label="Act four, the sound">
      <div className="act__stage sound">
        <p className="line sound__line">{line}</p>

        <div className="sound__wave" aria-hidden="true">
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
            <line x1="0" y1={MID} x2={W} y2={MID} className="sound__axis" vectorEffect="non-scaling-stroke" />
            {/* No non-scaling-stroke here: dash lengths must stay in path units. */}
            <path d={WAVE} className="sound__path" />
          </svg>
          <span className="sound__head" />
        </div>

        <ul className="sound__titles">
          {titles.map((t) => (
            <li key={t} className="sound__title">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
