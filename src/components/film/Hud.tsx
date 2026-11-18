'use client';

import Link from 'next/link';
import { scrollToTarget } from '@/lib/lenis';

type Props = {
  name: string;
  /** Dock button: a page link (e.g. All work / Home) or an external reel. */
  primary: { label: string; href: string };
  contact: string;
};

/**
 * Fixed overlay: name and site nav on top (reachable from every page), the
 * current chapter and timecode in the centre, and a glass dock with the two
 * actions that matter. Chapter text and timecode are written per frame by
 * lib/timeline (no React re-renders). Page changes fade via PageTransition.
 */
export function Hud({ name, primary, contact }: Props) {
  const external = primary.href.startsWith('http');

  return (
    <>
      <header className="hud" aria-label="Site">
        <Link className="hud__name" href="/">
          {name}
        </Link>
        <div className="hud__chapter" aria-hidden="true">
          <span data-hud-index />
          <span data-hud-chapter />
          <span className="hud__tc">
            <i className="hud__rec" />
            <span data-hud-tc>00:00:00:00</span>
          </span>
        </div>
      </header>

      <nav className="dock" aria-label="Actions">
        {external ? (
          <a className="dock__btn dock__btn--ghost" href={primary.href} target="_blank" rel="noreferrer">
            <span className="dock__play" aria-hidden="true" />
            {primary.label}
          </a>
        ) : (
          <Link className="dock__btn dock__btn--ghost" href={primary.href}>
            {primary.label}
          </Link>
        )}
        <a
          className="dock__btn"
          href="#end"
          onClick={(e) => {
            e.preventDefault();
            scrollToTarget('#end');
          }}
        >
          {contact}
        </a>
      </nav>
    </>
  );
}
