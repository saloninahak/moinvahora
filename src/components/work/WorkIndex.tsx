'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { director } from '@/lib/director';
import { useReveal } from '@/lib/useReveal';
import { resetScroll } from '@/lib/lenis';
import { Haptic, buzz } from '@/lib/haptics';
import { categories, countFor, projects, type Category } from '@content/projects';

type Folder = Category | 'all';

const label = (id: Category) => categories.find((c) => c.id === id)?.label ?? id;
const IDLE = { dim: 0.82, focus: 0.5, burn: 0 };
const inFolder = (id: Folder) => projects.map((p, i) => ({ p, i })).filter(({ p }) => id === 'all' || p.cats.includes(id));
/** The kinds of work (every folder except "Everything"). */
const KINDS = categories.length - 1;
/** "Everything" goes last: the folders lead with the range, not a list. */
const FOLDERS = [...categories.filter((c) => c.id !== 'all'), ...categories.filter((c) => c.id === 'all')];

const readFolder = (): Folder | null => {
  const q = new URLSearchParams(window.location.search).get('c');
  return q && categories.some((c) => c.id === q) ? (q as Folder) : null;
};

/**
 * All work as folders. The page opens on the folders only, each with the
 * frames inside peeking out; the project list lives inside a folder. A
 * project can sit in several folders, so the range shows at a glance.
 * Opening a folder is a history entry (?c=), so the phone's back button
 * closes it again, and a folder can be shared by link.
 */
export function WorkIndex() {
  const [open, setOpen] = useState<Folder | null>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(readFolder());
    const onPop = () => setOpen(readFolder());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useReveal(root, open);

  const preview = (i: number | null) => {
    if (i === null) Object.assign(director, IDLE);
    else Object.assign(director, { shot: i, dim: 0.6, focus: 0.15, burn: 0 });
  };

  const go = (id: Folder | null) => {
    buzz(id ? Haptic.step : Haptic.tick, { gesture: true });
    const url = new URL(window.location.href);
    if (id) url.searchParams.set('c', id);
    else url.searchParams.delete('c');
    window.history.pushState(null, '', url);
    setOpen(id);
    preview(null);
    // New content in place of the old: start it at the top.
    resetScroll();
  };

  return (
    <div className="index" ref={root}>
      {open ? <Opened id={open} go={go} preview={preview} /> : <Shelf go={go} preview={preview} />}

      <Link href="/work/film" className="work-cta index__film">
        Watch selected work as a film <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

type Nav = { go: (id: Folder | null) => void; preview: (i: number | null) => void };

/** Closed: every folder, nothing else. */
function Shelf({ go, preview }: Nav) {
  return (
    <>
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

      <ul className="shelf" aria-label="Folders">
        {FOLDERS.map((c, n) => {
          const inside = inFolder(c.id);
          return (
            <li key={c.id} className="shelf__item" style={{ '--n': n } as CSSProperties}>
              <button
                type="button"
                className={`tile${c.id === 'all' ? ' tile--all' : ''}`}
                onClick={() => go(c.id)}
                onMouseEnter={() => preview(inside[0]?.i ?? null)}
                onMouseLeave={() => preview(null)}
                onFocus={() => preview(inside[0]?.i ?? null)}
                onBlur={() => preview(null)}
              >
                <span className="tile__tab" aria-hidden="true" />
                <span className="tile__peek" aria-hidden="true">
                  {inside.slice(0, 3).map(({ p }, k) => (
                    <img key={p.slug} src={p.image} alt="" loading="lazy" decoding="async" style={{ '--k': k } as CSSProperties} />
                  ))}
                </span>
                <span className="tile__body">
                  <span className="tile__n">{String(countFor(c.id)).padStart(2, '0')}</span>
                  <span className="tile__name">{c.label}</span>
                  <span className="tile__note">{c.note}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}

/** Open: one folder's projects, with a way back and on to the next folder. */
function Opened({ id, go, preview }: Nav & { id: Folder }) {
  const folder = categories.find((c) => c.id === id) ?? categories[0];
  const list = useMemo(() => inFolder(id), [id]);
  // Every role across the folder: its range in one line.
  const roles = useMemo(() => [...new Set(list.flatMap(({ p }) => p.role))].slice(0, 10), [list]);
  const at = FOLDERS.findIndex((c) => c.id === id);
  const next = FOLDERS[(at + 1) % FOLDERS.length];

  return (
    <section className="opened" aria-label={folder.label}>
      <button type="button" className="opened__back" onClick={() => go(null)}>
        <span aria-hidden="true">←</span> All folders
      </button>

      <header className="files__head">
        <p className="files__path">
          <span>Work</span>
          <span aria-hidden="true">/</span>
          <span>{folder.label}</span>
          <span aria-hidden="true">·</span>
          <span>{String(list.length).padStart(2, '0')} projects</span>
        </p>
        <h1 className="files__title">{folder.label}</h1>
        <p className="files__note">{folder.note}</p>
        <ul className="files__roles" aria-label="Roles in this folder">
          {roles.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </header>

      <ol className="rows" onMouseLeave={() => preview(null)}>
        {list.map(({ p, i }, n) => (
          <li key={p.slug} className="row" style={{ '--n': n } as CSSProperties}>
            <Link href={`/work/${p.slug}`} className="row__a" onMouseEnter={() => preview(i)} onFocus={() => preview(i)} onBlur={() => preview(null)}>
              <span className="row__n">{String(n + 1).padStart(2, '0')}</span>
              <span className="row__title">{p.title}</span>
              <span className="row__client">{p.client}</span>
              <span className="row__cats">
                {p.cats
                  .filter((c) => c !== id)
                  .slice(0, 2)
                  .map(label)
                  .join(' · ')}
              </span>
              <span className="row__year">{p.year || '—'}</span>
              <span className="row__go" aria-hidden="true">
                →
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <button type="button" className="opened__next" onClick={() => go(next.id)}>
        <span className="opened__nextk">Next folder</span>
        <span className="opened__nextv">
          {next.label} <span aria-hidden="true">→</span>
        </span>
      </button>
    </section>
  );
}
