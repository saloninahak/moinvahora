'use client';

import Image from 'next/image';
import { useRef, useState, type CSSProperties } from 'react';
import { gsap, MQ, pinned, useGSAP } from '@/lib/gsap';
import { home } from '@content/home';

const APERTURES = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16];
const ISOS = [100, 200, 400, 800, 1600, 3200, 6400];
const SHUTTERS = ['1/30', '1/60', '1/125', '1/250', '1/500', '1/1000', '1/4000'];

/**
 * Act II: a still pinned inside a viewfinder. Scroll racks focus, opens the
 * iris and pushes in from wide to close. The three camera controls change
 * softness (aperture), brightness (ISO) and grain (shutter).
 */
export function Frame() {
  const root = useRef<HTMLElement>(null);
  const [ap, setAp] = useState(5); // f/8
  const [iso, setIso] = useState(2); // ISO 400
  const [sh, setSh] = useState(3); // 1/250

  const vars = {
    '--ap-blur': `${Math.max(0, 4 - ap) * 1.5}px`,
    '--iso-bright': `${(0.76 + iso * 0.12).toFixed(2)}`,
    '--grain': `${(0.36 - sh * 0.05).toFixed(2)}`,
  } as CSSProperties;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const stage = root.current!.querySelector('.act__stage')!;
        gsap
          .timeline({ scrollTrigger: pinned(root.current!, 200), defaults: { ease: 'power2.out' } })
          .fromTo(stage, { opacity: 0 }, { opacity: 1, duration: 0.04, ease: 'none' }, 0)
          .fromTo('.frame__iris', { scale: 1 }, { scale: 15, duration: 0.28, ease: 'power2.in' }, 0.02)
          .to('.frame__iris', { opacity: 0, duration: 0.02, ease: 'none' }, 0.29)
          .fromTo('.frame__focus', { filter: 'blur(18px)' }, { filter: 'blur(0px)', duration: 0.37, ease: 'none' }, 0.08)
          .from('.frame__line', { opacity: 0, y: 18, duration: 0.12 }, 0.3)
          .fromTo('.frame__shot', { scale: 1 }, { scale: 1.5, duration: 0.4, ease: 'power1.inOut' }, 0.45)
          .from('.frame__controls', { opacity: 0, y: 18, duration: 0.1 }, 0.5)
          .to(stage, { opacity: 0, duration: 0.07, ease: 'none' }, 0.93);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="act act--frame" aria-label="Act two, the frame">
      <div className="act__stage frame" style={vars}>
        <div className="frame__shot">
          <div className="frame__focus">
            <Image className="frame__img" src={home.frame.image} alt={home.frame.alt} fill sizes="100vw" />
          </div>
        </div>
        <div className="frame__grain" aria-hidden="true" />
        <div className="frame__iris" aria-hidden="true" />

        {/* Viewfinder overlay: corner brackets, rule of thirds, centre mark. */}
        <svg className="frame__vf" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <g fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke">
            <path d="M0 8 V0 H8" vectorEffect="non-scaling-stroke" />
            <path d="M92 0 H100 V8" vectorEffect="non-scaling-stroke" />
            <path d="M100 92 V100 H92" vectorEffect="non-scaling-stroke" />
            <path d="M8 100 H0 V92" vectorEffect="non-scaling-stroke" />
          </g>
          <g stroke="currentColor" strokeWidth="1" opacity="0.35">
            <line x1="33.333" y1="0" x2="33.333" y2="100" vectorEffect="non-scaling-stroke" />
            <line x1="66.666" y1="0" x2="66.666" y2="100" vectorEffect="non-scaling-stroke" />
            <line x1="0" y1="33.333" x2="100" y2="33.333" vectorEffect="non-scaling-stroke" />
            <line x1="0" y1="66.666" x2="100" y2="66.666" vectorEffect="non-scaling-stroke" />
          </g>
          <g stroke="currentColor" strokeWidth="1" opacity="0.7">
            <line x1="48.8" y1="50" x2="51.2" y2="50" vectorEffect="non-scaling-stroke" />
            <line x1="50" y1="48.4" x2="50" y2="51.6" vectorEffect="non-scaling-stroke" />
          </g>
        </svg>
        <span className="frame__rec" aria-hidden="true">
          <i /> Rec
        </span>

        <p className="line frame__line">{home.frame.line}</p>

        <div className="frame__controls" role="group" aria-label="Camera settings">
          <label className="ctrl">
            <span className="ctrl__name">Aperture</span>
            <input type="range" min={0} max={APERTURES.length - 1} step={1} value={ap} onChange={(e) => setAp(Number(e.target.value))} aria-valuetext={`f/${APERTURES[ap]}`} />
            <output className="ctrl__val">f/{APERTURES[ap]}</output>
          </label>
          <label className="ctrl">
            <span className="ctrl__name">ISO</span>
            <input type="range" min={0} max={ISOS.length - 1} step={1} value={iso} onChange={(e) => setIso(Number(e.target.value))} aria-valuetext={`ISO ${ISOS[iso]}`} />
            <output className="ctrl__val">{ISOS[iso]}</output>
          </label>
          <label className="ctrl">
            <span className="ctrl__name">Shutter</span>
            <input type="range" min={0} max={SHUTTERS.length - 1} step={1} value={sh} onChange={(e) => setSh(Number(e.target.value))} aria-valuetext={`${SHUTTERS[sh]} second`} />
            <output className="ctrl__val">{SHUTTERS[sh]}</output>
          </label>
        </div>
      </div>
    </section>
  );
}
