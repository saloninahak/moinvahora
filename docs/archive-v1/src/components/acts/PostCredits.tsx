'use client';

import { useRef, useState } from 'react';
import { gsap, MQ, useGSAP } from '@/lib/gsap';
import { home } from '@content/home';

/**
 * After the credits: dark screen, a clapperboard. Clicking it snaps the
 * clapstick shut and reveals the contact links.
 */
export function PostCredits() {
  const root = useRef<HTMLElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const [shut, setShut] = useState(false);
  const { line, clapLabel, hint, links, footer } = home.postCredits;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          '.post__inner',
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            ease: 'none',
            scrollTrigger: { trigger: root.current!, start: 'top 75%', end: 'top 15%', scrub: 0.6 },
          },
        );
      });
    },
    { scope: root },
  );

  const clap = () => {
    if (shut) return;
    setShut(true);
    // Hand keyboard users straight to the revealed links.
    window.setTimeout(() => firstLink.current?.focus({ preventScroll: true }), 450);
  };

  return (
    <section ref={root} className="act act--post" aria-label="Post-credits scene">
      <div className="post">
        <div className="post__inner">
          <p className="line post__line">{line}</p>

          <button
            type="button"
            className={`clap${shut ? ' is-shut' : ''}`}
            onClick={clap}
            aria-label={clapLabel}
            aria-expanded={shut}
            aria-controls="post-links"
          >
            <svg viewBox="0 0 240 210" aria-hidden="true">
              {/* Clapstick (hinged at the left). */}
              <g className="clap__stick">
                <rect x="10" y="30" width="220" height="28" rx="2" fill="#f2ede4" />
                <path d="M30 30 L52 30 L36 58 L14 58 Z M78 30 L100 30 L84 58 L62 58 Z M126 30 L148 30 L132 58 L110 58 Z M174 30 L196 30 L180 58 L158 58 Z M222 30 L230 30 L230 44 L214 58 L206 58 Z" fill="#0a0a0a" />
              </g>
              {/* Board. */}
              <g className="clap__board">
                <rect x="10" y="60" width="220" height="24" fill="#f2ede4" />
                <path d="M14 60 L36 60 L52 84 L30 84 Z M62 60 L84 60 L100 84 L78 84 Z M110 60 L132 60 L148 84 L126 84 Z M158 60 L180 60 L196 84 L174 84 Z M206 60 L228 60 L230 63 L230 84 L222 84 Z" fill="#0a0a0a" />
                <rect x="10" y="84" width="220" height="116" fill="#141414" stroke="#f2ede4" strokeWidth="2" />
                <line x1="10" y1="124" x2="230" y2="124" stroke="#5f5a52" />
                <line x1="10" y1="162" x2="230" y2="162" stroke="#5f5a52" />
                <line x1="120" y1="124" x2="120" y2="200" stroke="#5f5a52" />
                <text x="22" y="112" className="clap__text clap__text--big">MOIN VAHORA</text>
                <text x="22" y="148" className="clap__text">SCENE</text>
                <text x="22" y="186" className="clap__text">CONTACT</text>
                <text x="132" y="148" className="clap__text">TAKE</text>
                <text x="132" y="186" className="clap__text">01</text>
              </g>
            </svg>
          </button>
          <p className="post__hint" aria-hidden={shut}>
            {hint}
          </p>

          <ul id="post-links" className={`post__links${shut ? ' is-open' : ''}`} aria-hidden={!shut}>
            {links.map((l, i) => (
              <li key={l.label} style={{ ['--i' as string]: i }}>
                <a
                  ref={i === 0 ? firstLink : undefined}
                  href={l.href}
                  className="post__link"
                  tabIndex={shut ? 0 : -1}
                  {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="post__footer">{footer}</p>
      </div>
    </section>
  );
}
