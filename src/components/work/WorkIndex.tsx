'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { director } from '@/lib/director';
import { useReveal } from '@/lib/useReveal';
import { categories, countFor, projects, type Category } from '@content/projects';

type View = 'list' | 'grid';
const label = (id: Category) => categories.find((c) => c.id === id)?.label ?? id;
const IDLE = { dim: 0.82, focus: 0.5, burn: 0 };

/**
 * All work. Filter by category, switch list / grid. In the list, hovering or
 * focusing a project dissolves the stage behind to that project's frame.
 * The filter is mirrored to ?c= so a filtered view can be shared.
 */
export function WorkIndex() {
  const [cat, setCat] = useState<Category | 'all'>('all');
  const [view, setView] = useState<View>('list');
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('c');
    if (q && categories.some((c) => c.id === q)) setCat(q as Category);
    if (window.matchMedia('(max-width: 809px)').matches) setView('grid');
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (cat === 'all') url.searchParams.delete('c');
    else url.searchParams.set('c', cat);
    window.history.replaceState(null, '', url);
  }, [cat]);

  const list = useMemo(() => projects.map((p, i) => ({ p, i })).filter(({ p }) => cat === 'all' || p.cats.includes(cat)), [cat]);
  useReveal(root, `${cat}-${view}`);

  const preview = (i: number | null) => {
    if (i === null) Object.assign(director, IDLE);
    else Object.assign(director, { shot: i, dim: 0.6, focus: 0.15, burn: 0 });
  };

  return (
    <div className="index" ref={root}>
      <header className="index__head">
        <p className="kicker rv rv--fade" data-reveal>
          {projects.length} projects · 2016 – 2026
        </p>
        <h1 className="title title--xl rv" data-reveal>
          <span className="ln">
            <span>The work.</span>
          </span>
        </h1>
        <p className="index__sub rv rv--fade" data-reveal>
          Brands, events, artists and films, in India and Australia. Pick a thread, or open any project for the full story.
        </p>
      </header>

      <div className="index__bar" role="toolbar" aria-label="Filter and view">
        <div className="chips" role="group" aria-label="Category">
          {categories.map((c) => (
            <button key={c.id} type="button" className="chip" aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>
              {c.label}
              <span className="chip__n">{countFor(c.id)}</span>
            </button>
          ))}
        </div>
        <div className="views" role="group" aria-label="View">
          {(['list', 'grid'] as View[]).map((v) => (
            <button key={v} type="button" className="view" aria-pressed={view === v} onClick={() => setView(v)}>
              {v === 'list' ? 'List' : 'Grid'}
            </button>
          ))}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {list.length} projects shown
      </p>

      {view === 'list' ? (
        <ol className="rows" key={`l-${cat}`} onMouseLeave={() => preview(null)}>
          {list.map(({ p, i }, n) => (
            <li key={p.slug} className="row" style={{ '--n': n } as CSSProperties}>
              <Link href={`/work/${p.slug}`} className="row__a" onMouseEnter={() => preview(i)} onFocus={() => preview(i)} onBlur={() => preview(null)}>
                <span className="row__n">{String(n + 1).padStart(2, '0')}</span>
                <span className="row__title">{p.title}</span>
                <span className="row__client">{p.client}</span>
                <span className="row__cats">{p.cats.map(label).join(' · ')}</span>
                <span className="row__year">{p.year || '—'}</span>
                <span className="row__go" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <ol className="cards" key={`g-${cat}`}>
          {list.map(({ p }, n) => (
            <li key={p.slug} className="card" style={{ '--n': n } as CSSProperties}>
              <Link href={`/work/${p.slug}`} className="card__a">
                <span className="card__img">
                  <img src={p.image} alt="" loading="lazy" decoding="async" />
                </span>
                <span className="card__meta">
                  <span>{p.cats.map(label).join(' · ')}</span>
                  <span>{p.year}</span>
                </span>
                <span className="card__title">{p.title}</span>
                <span className="card__sum">{p.summary}</span>
              </Link>
            </li>
          ))}
        </ol>
      )}

      <Link href="/work/film" className="work-cta index__film">
        Watch selected work as a film <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
