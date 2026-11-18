'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { gsap, MQ, pinned, useGSAP } from '@/lib/gsap';
import { home } from '@content/home';

/**
 * Act III: an edit timeline. Desktop: pinned, clips slide under a fixed
 * playhead, a blade slices one shot in two, then a match cut carries the
 * round shape into the next image. Mobile / reduced motion: a vertical sequence.
 */
export function Cut() {
  const root = useRef<HTMLElement>(null);
  const { line, clips, splitIndex, next } = home.cut;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MQ.desktop, () => {
        const el = root.current!;
        const stage = el.querySelector<HTMLElement>('.act__stage')!;
        const split = el.querySelector<HTMLElement>('.cut__clip--split')!;
        // Distance that brings the split clip's centre under the playhead (stage centre).
        const endX = () => -(split.offsetLeft + split.offsetWidth / 2 - stage.clientWidth / 2);

        gsap
          .timeline({ scrollTrigger: pinned(el, 250), defaults: { ease: 'power2.out' } })
          .fromTo(stage, { opacity: 0 }, { opacity: 1, duration: 0.04, ease: 'none' }, 0)
          .from('.cut__line', { opacity: 0, y: 16, duration: 0.1 }, 0.04)
          .fromTo('.cut__track', { x: 0 }, { x: endX, duration: 0.45, ease: 'none' }, 0.05)
          // Blade drops, slices, lifts.
          .fromTo('.cut__blade', { yPercent: -160, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.06, ease: 'power3.in' }, 0.5)
          .to('.cut__half--l', { x: -28, rotate: -1.5, duration: 0.06 }, 0.56)
          .to('.cut__half--r', { x: 28, rotate: 1.5, duration: 0.06 }, 0.56)
          .to('.cut__blade', { yPercent: -160, opacity: 0, duration: 0.05, ease: 'power2.in' }, 0.62)
          // Match cut: the round shape grows into the next shot.
          .fromTo('.cut__circle', { scale: 0.06, opacity: 0 }, { scale: 0.06, opacity: 1, duration: 0.03, ease: 'none' }, 0.65)
          .to('.cut__circle', { scale: 1, duration: 0.2, ease: 'power2.in' }, 0.68)
          .fromTo('.cut__circle-img', { scale: 2.2 }, { scale: 1, duration: 0.2, ease: 'power2.in' }, 0.68)
          .to(['.cut__timeline', '.cut__line'], { opacity: 0, duration: 0.08, ease: 'none' }, 0.72)
          .to(stage, { opacity: 0, duration: 0.06, ease: 'none' }, 0.94);
      });

      mm.add(MQ.mobile, () => {
        gsap.utils.toArray<HTMLElement>('.cut__clip').forEach((clip) => {
          gsap.from(clip, {
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: clip, start: 'top 88%', toggleActions: 'play none none reverse' },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="act act--cut" aria-label="Act three, the cut">
      <div className="act__stage cut">
        <p className="line cut__line">{line}</p>

        <div className="cut__timeline">
          <div className="cut__rail">
            <ol className="cut__track">
              {clips.map((clip, i) =>
                i === splitIndex ? (
                  <li key={clip.label} className="cut__clip cut__clip--split">
                    {(['l', 'r'] as const).map((side) => (
                      <div key={side} className={`cut__half cut__half--${side}`}>
                        <div className="cut__half-inner">
                          <Image src={clip.src} alt={side === 'l' ? `${clip.label}, stand-in image` : ''} fill sizes="(min-width: 810px) 26vw, 100vw" />
                        </div>
                      </div>
                    ))}
                    <span className="cut__label">{clip.label}</span>
                  </li>
                ) : (
                  <li key={clip.label} className="cut__clip">
                    <Image src={clip.src} alt={`${clip.label}, stand-in image`} fill sizes="(min-width: 810px) 26vw, 100vw" />
                    <span className="cut__label">{clip.label}</span>
                  </li>
                ),
              )}
            </ol>
            <div className="cut__playhead" aria-hidden="true" />
            <svg className="cut__blade" viewBox="0 0 24 64" aria-hidden="true">
              <path d="M4 0 H20 V40 L12 64 L4 40 Z" fill="currentColor" />
              <rect x="9" y="6" width="6" height="18" rx="3" fill="#000" opacity="0.5" />
            </svg>
          </div>
        </div>

        <div className="cut__match" aria-hidden="true">
          <div className="cut__circle">
            <div className="cut__circle-img">
              <Image src={next.src} alt="" fill sizes="150vmax" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
