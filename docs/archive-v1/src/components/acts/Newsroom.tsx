'use client';

import { useRef } from 'react';
import { gsap, MQ, pinned, useGSAP } from '@/lib/gsap';
import { home } from '@content/home';

/** Act I: where it began. Teleprompter, scanlines, an on-air lower third and a ticker. */
export function Newsroom() {
  const root = useRef<HTMLElement>(null);
  const { title, line, onAir, ticker } = home.newsroom;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const stage = root.current!.querySelector('.act__stage')!;
        gsap
          .timeline({ scrollTrigger: pinned(root.current!, 150), defaults: { ease: 'power2.out' } })
          .fromTo(stage, { opacity: 0 }, { opacity: 1, duration: 0.08, ease: 'none' }, 0)
          .fromTo('.news__prompter', { yPercent: 8 }, { yPercent: -45, duration: 1, ease: 'none' }, 0)
          .fromTo('.news__ticker-row', { xPercent: 0 }, { xPercent: -50, duration: 1, ease: 'none' }, 0)
          .from('.news__title .mask > span', { yPercent: 110, stagger: 0.05, duration: 0.2 }, 0.06)
          .from('.news__line', { opacity: 0, y: 16, duration: 0.14 }, 0.24)
          .from('.news__lower', { opacity: 0, x: -48, duration: 0.12 }, 0.3)
          .to(stage, { opacity: 0, duration: 0.08, ease: 'none' }, 0.92);
      });
    },
    { scope: root },
  );

  // Ticker items are doubled so a -50% slide loops seamlessly.
  const tickerItems = [...ticker, ...ticker];

  return (
    <section ref={root} className="act act--news" aria-label="Act one, the newsroom">
      <div className="act__stage">
        <div className="news__prompter" aria-hidden="true">
          {['Stand by', 'Three, two, one', 'You are live', 'Cue the package', 'Roll VT', 'Back to studio', 'Clear'].map((p) => (
            <span key={p}>{p}</span>
          ))}
        </div>
        <div className="news__scan" aria-hidden="true" />

        <div className="center">
          <h2 className="display news__title">
            {title.map((t) => (
              <span className="mask" key={t}>
                <span>{t}</span>
              </span>
            ))}
          </h2>
          <p className="line news__line">{line}</p>
        </div>

        <div className="news__lower" aria-hidden="true">
          <span className="news__onair">{onAir}</span>
        </div>
        <div className="news__ticker" aria-hidden="true">
          <div className="news__ticker-row">
            {tickerItems.map((t, i) => (
              <span key={`${t}-${i}`}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
