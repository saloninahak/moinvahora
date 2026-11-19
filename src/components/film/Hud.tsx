'use client';

import Link from 'next/link';
import { ContactPanel, openContact } from '@/components/ContactPanel';
import { Haptic, buzz } from '@/lib/haptics';

type Props = {
  name: string;
  /** Dock button: a page link (e.g. All work / Home) or an external reel. */
  primary: { label: string; href: string };
  contact: string;
};

/**
 * Fixed overlay: name on top, the current chapter and timecode in the centre,
 * and a glass dock with the two actions that matter. "Contact" opens the
 * contact panel out of the dock on every page. Chapter text and timecode are
 * written per frame by lib/timeline (no React re-renders).
 */
export function Hud({ name, primary, contact }: Props) {
  const external = primary.href.startsWith('http');
  const tap = () => buzz(Haptic.tick, { gesture: true });

  return (
    <>
      <header className="hud" aria-label="Site">
        <Link className="hud__name" href="/" onClick={tap}>
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
          <a className="dock__btn dock__btn--ghost" href={primary.href} target="_blank" rel="noreferrer" onClick={tap}>
            <span className="dock__play" aria-hidden="true" />
            {primary.label}
          </a>
        ) : (
          <Link className="dock__btn dock__btn--ghost" href={primary.href} onClick={tap}>
            {primary.label}
          </Link>
        )}
        <button type="button" className="dock__btn dock__btn--contact" onClick={openContact} aria-haspopup="dialog">
          <i className="dock__live" aria-hidden="true" />
          {contact}
          <kbd className="dock__kbd" aria-hidden="true">
            C
          </kbd>
        </button>
      </nav>

      <ContactPanel />
    </>
  );
}
