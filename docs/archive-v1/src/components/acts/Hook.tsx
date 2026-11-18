'use client';

import { useRef } from 'react';
import { gsap, MQ, pinned, useGSAP } from '@/lib/gsap';
import { home } from '@content/home';

/** Opening: huge display type on black. Fades to black as you scroll. */
export function Hook() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const stage = root.current!.querySelector('.act__stage')!;

        // Title rises out of its masks on load.
        gsap.from('.hook__title .mask > span', {
          yPercent: 110,
          duration: 1.4,
          ease: 'expo.out',
          stagger: 0.12,
          delay: 0.2,
        });
        gsap.from('.hook__sub', { opacity: 0, y: 12, duration: 1.2, delay: 1.1, ease: 'power2.out' });

        // Scroll: the title settles back and the screen fades to black.
        gsap
          .timeline({ scrollTrigger: pinned(root.current!, 100) })
          .to('.hook__title', { scale: 0.9, ease: 'none', duration: 1 }, 0)
          .to('.hook__sub', { opacity: 0, duration: 0.3 }, 0.2)
          .to(stage, { opacity: 0, duration: 0.35, ease: 'power1.in' }, 0.65);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="act act--hook" aria-label="Opening">
      <div className="act__stage">
        <div className="center">
          <h1 className="display hook__title">
            {home.hook.title.map((t) => (
              <span className="mask" key={t}>
                <span>{t}</span>
              </span>
            ))}
          </h1>
          <p className="line hook__sub">{home.hook.sub}</p>
        </div>
      </div>
    </section>
  );
}
