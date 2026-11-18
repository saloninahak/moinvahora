'use client';

import { useRef } from 'react';
import { gsap, MQ, pinned, useGSAP } from '@/lib/gsap';
import { home, isPlaceholder } from '@content/home';

/** The name, huge, then end credits rolling up over it. Ends on black. */
export function Credits() {
  const root = useRef<HTMLElement>(null);
  const { name, roll } = home.credits;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const stage = root.current!.querySelector<HTMLElement>('.act__stage')!;
        const list = root.current!.querySelector<HTMLElement>('.credits__roll')!;

        gsap
          .timeline({ scrollTrigger: pinned(root.current!, 200) })
          .fromTo(stage, { opacity: 0 }, { opacity: 1, duration: 0.05, ease: 'none' }, 0)
          .fromTo(
            '.credits__name',
            { scale: 1.18, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.2, ease: 'power2.out' },
            0.02,
          )
          .to('.credits__name', { opacity: 0.07, scale: 0.96, duration: 0.12, ease: 'none' }, 0.3)
          .fromTo(
            list,
            { xPercent: -50, y: () => stage.clientHeight },
            { xPercent: -50, y: () => -list.offsetHeight, duration: 0.6, ease: 'none' },
            0.32,
          )
          .to(stage, { opacity: 0, duration: 0.06, ease: 'none' }, 0.94);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="act act--credits" aria-label="Name and credits">
      <div className="act__stage">
        <div className="center">
          <h2 className="display credits__name">
            {name.map((n) => (
              <span className="mask" key={n}>
                <span>{n}</span>
              </span>
            ))}
          </h2>
        </div>

        <ul className="credits__roll">
          {roll.map((block) => (
            <li key={block.role}>
              <span className="credits__role">{block.role}</span>
              <span className="credits__names">
                {block.names.map((n) =>
                  'href' in block && block.href && !isPlaceholder(block.href) ? (
                    <a key={n} href={block.href} target="_blank" rel="noreferrer">
                      {n}
                    </a>
                  ) : (
                    <span key={n}>{n}</span>
                  ),
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
