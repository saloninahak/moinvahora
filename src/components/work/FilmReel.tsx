'use client';

import { type CSSProperties, useRef } from 'react';
import Link from 'next/link';
import { director, lerp, steps } from '@/lib/director';
import { Chapter, Lines, enterShot, showItem } from '@/components/film/kit';
import { Haptic, hapticOnChange } from '@/lib/haptics';
import { home } from '@content/work';
import { projects } from '@content/projects';

const pad2 = (n: number) => String(n).padStart(2, '0');

/**
 * Cinema mode reel. Each project gets a full-screen slate:
 * - A wide film-gate crop line across the top (cinematic ratio)
 * - A project counter in enormous type, bottom left
 * - The title, client and year on the frame
 * No global HUD; a minimal "← All work" exits in the corner.
 * The film ends on a black title card.
 */
export function FilmReel() {
  const c = home.work;
  const n = c.items.length;
  const counter = useRef<HTMLSpanElement>(null);

  return (
    <div className="reel">
      {/* Exit: always visible, unobtrusive. */}
      <Link href="/work" className="reel__exit" prefetch>
        <span className="reel__exit-arrow" aria-hidden="true">←</span>
        <span>All work</span>
      </Link>

      {/* One chapter: all items scroll within the same pinned stage. */}
      <Chapter
        id="top"
        name="Reel"
        length={1 + n * 1.1}
        drive={(p, l, el) => {
          const s = steps(l, n, 0.4);
          const entered = l > 0.02;
          director.shot = entered ? c.items[0].shot + s.value : enterShot(el, p, 0, c.items[0].shot);
          director.static = 0;
          director.warp = entered ? 0.08 : 0.3;
          director.pulse = 0;
          director.dim = entered ? lerp(0.08, 0.26, s.value % 1) : 0.5;
          director.zoom = entered ? 1.02 + (s.value % 1) * 0.04 : 1.1;
          director.fade = 1;
          director.cut = 0;
          showItem(el, s.index, entered);
          if (counter.current) counter.current.textContent = pad2(s.index + 1);
          hapticOnChange('reel', entered ? s.index : -1, Haptic.land);
        }}
        className="ch--reel"
      >
        {/* Film-gate bars: letterbox crop that feels like a cinema frame. */}
        <div className="reel__gate" aria-hidden="true">
          <span className="reel__bar reel__bar--t" />
          <span className="reel__bar reel__bar--b" />
        </div>

        {/* Counter: enormous, bottom left, inside the gate. */}
        <div className="reel__counter" aria-hidden="true">
          <span ref={counter}>01</span>
          <span className="reel__total">/ {pad2(n)}</span>
        </div>

        {/* Slates: one per project. */}
        <ol className="reel__slates">
          {c.items.map((w, i) => (
            <li key={w.title} className="reel__slate" data-item={i}>
              {/* Top: project info, inside the gate. */}
              <div className="reel__info">
                <p className="reel__meta">
                  <span className="reel__client">{w.client}</span>
                  <span>{w.place}</span>
                  <span>{w.year}</span>
                </p>
                <Lines lines={[w.title]} as="h2" className="reel__title" at={0} />
              </div>
              {/* Bottom: the description line. */}
              <p className="reel__line">{w.line}</p>
            </li>
          ))}
        </ol>
      </Chapter>

      {/* End card: black screen, name and a way out. */}
      <section className="reel__end" aria-label="End">
        <div className="reel__end-inner">
          <p className="reel__end-title" style={{ '--i': 0 } as CSSProperties}>Moin</p>
          <p className="reel__end-title reel__end-title--light" style={{ '--i': 1 } as CSSProperties}>Vahora</p>
          <Link href="/work" className="reel__end-cta">
            See all {projects.length} projects <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
