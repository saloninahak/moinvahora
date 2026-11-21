'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { director } from '@/lib/director';
import { useReveal } from '@/lib/useReveal';
import { Haptic, buzz } from '@/lib/haptics';
import { categories, countFor, projects, type Category } from '@content/projects';

type Folder = Category | 'all';

const label = (id: Category) => categories.find((c) => c.id === id)?.label ?? id;
const IDLE = { dim: 0.82, focus: 0.5, burn: 0 };
const inFolder = (id: Folder) => projects.map((p, i) => ({ p, i })).filter(({ p }) => id === 'all' || p.cats.includes(id));
/** The kinds of work (every folder except "Everything"). */
const KINDS = categories.length - 1;

/**
 * All work, sorted into folders. The folders sit in a sidebar (a swipeable
 * strip on phones); each one shows the frames inside it peeking out, and a
 * project can live in several folders, so the range shows at a glance.
 * Hovering a folder or a project dissolves the stage behind to its frame.
 * The open folder is mirrored to ?c= so it can be shared.
 */
export function WorkIndex() {
  const [cat, setCat] = useState<Folder>('all');
  const root = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('c');
    if (q && categories.some((c) => c.id === q)) setCat(q as Category);
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (cat === 'all') url.searchParams.delete('c');
    else url.searchParams.set('c', cat);
    window.history.replaceState(null, '', url);
    // Phones: keep the open folder in view in the strip.
    const s = strip.current;
    const on = s?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (s && on && s.scrollWidth > s.clientWidth) {
      s.scrollTo({ left: on.offsetLeft - (s.clientWidth - on.offsetWidth) / 2, behavior: 'smooth' });
    }
  }, [cat]);

  const list = useMemo(() => inFolder(cat), [cat]);
  const folder = categories.find((c) => c.id === cat) ?? categories[0];
  // Every role across the open folder: the range of the work in one line.
  const roles = useMemo(() => [...new Set(list.flatMap(({ p }) => p.role))].slice(0, 10), [list]);
  useReveal(root, cat);

  const preview = (i: number | null) => {
    if (i === null) Object.assign(director, IDLE);
    else Object.assign(director, { shot: i, dim: 0.6, focus: 0.15, burn: 0 });
  };

  const pick = (id: Folder) => {
    if (id === cat) return;
    buzz(Haptic.step, { gesture: true });
    setCat(id);
  };

  return (
    <div className="index" ref={root}>
      <header className="index__head">
        <p className="kicker rv rv--fade" data-reveal>
          {projects.length} projects · {KINDS} kinds of work · 2016 – 2026
        </p>
        <h1 className="title title--xl rv" data-reveal>
          <span className="ln">
            <span>The work.</span>
          </span>
        </h1>
        <p className="index__sub rv rv--fade" data-reveal>
          Sport, tech, launches, brands, stage, music, film and festivals, in India and Australia. Open a folder.
        </p>
      </header>

      <div className="files">
        <nav className="files__side" aria-label="Folders">
          <div className="files__strip" ref={strip} role="group" aria-label="Folders" data-lenis-prevent-touch>
            {categories.map((c) => {
              const inside = inFolder(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  className="fold"
                  aria-pressed={cat === c.id}
                  onClick={() => pick(c.id)}
                  onMouseEnter={() => preview(inside[0]?.i ?? null)}
                  onMouseLeave={() => preview(null)}
                >
                  <span className="fold__peek" aria-hidden="true">
                    {inside.slice(0, 3).map(({ p }, k) => (
                      <img key={p.slug} src={p.image} alt="" loading="lazy" decoding="async" style={{ '--k': k } as CSSProperties} />
                    ))}
                  </span>
                  <span className="fold__body">
                    <span className="fold__name">{c.label}</span>
                    <span className="fold__n">{String(countFor(c.id)).padStart(2, '0')}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        <section className="files__main" aria-live="polite" aria-label={folder.label}>
          <header className="files__head" key={cat}>
            <p className="files__path">
              <span>Work</span>
              <span aria-hidden="true">/</span>
              <span>{folder.label}</span>
            </p>
            <h2 className="files__title">{folder.label}</h2>
            <p className="files__note">{folder.note}</p>
            <ul className="files__roles" aria-label="Roles in this folder">
              {roles.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </header>

          <ol className="rows" key={`rows-${cat}`} onMouseLeave={() => preview(null)}>
            {list.map(({ p, i }, n) => (
              <li key={p.slug} className="row" style={{ '--n': n } as CSSProperties}>
                <Link href={`/work/${p.slug}`} className="row__a" onMouseEnter={() => preview(i)} onFocus={() => preview(i)} onBlur={() => preview(null)}>
                  <span className="row__n">{String(n + 1).padStart(2, '0')}</span>
                  <span className="row__title">{p.title}</span>
                  <span className="row__client">{p.client}</span>
                  <span className="row__cats">{p.cats
                      .filter((c) => c !== cat)
                      .slice(0, 2)
                      .map(label)
                      .join(' · ')}</span>
                  <span className="row__year">{p.year || '—'}</span>
                  <span className="row__go" aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ol>

          <Link href="/work/film" className="work-cta index__film">
            Watch selected work as a film <span aria-hidden="true">→</span>
          </Link>
        </section>
      </div>
    </div>
  );
}
