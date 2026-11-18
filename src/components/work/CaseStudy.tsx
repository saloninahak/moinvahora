'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import Link from 'next/link';
import { gsap } from '@/lib/gsap';
import { director, lerp, range } from '@/lib/director';
import { useReveal } from '@/lib/useReveal';
import { categories, showreelUrl, type Project } from '@content/projects';

const label = (id: string) => categories.find((c) => c.id === id)?.label ?? id;

/**
 * A case study. The project's frame fills the stage behind the hero and
 * darkens and pushes in as you read; hovering the next project dissolves the
 * stage to its frame before you click.
 */
export function CaseStudy({ project: p, next }: { project: Project; next: Project }) {
  const root = useRef<HTMLDivElement>(null);
  const nextHover = useRef(false);
  useReveal(root);

  useEffect(() => {
    const drive = () => {
      const vh = window.innerHeight;
      const t = range(window.scrollY, 0, vh * 0.9);
      if (nextHover.current) {
        Object.assign(director, { shot: 1, dim: 0.45, zoom: 1.04, focus: 0 });
        return;
      }
      Object.assign(director, { shot: 0, dim: lerp(0.6, 0.86, t), zoom: lerp(1.08, 1.0, t), focus: lerp(0, 0.6, t), warp: 0.06, burn: 0 });
    };
    gsap.ticker.add(drive);
    return () => gsap.ticker.remove(drive);
  }, []);

  const meta = [
    { k: 'Client', v: p.client },
    { k: 'Year', v: p.year },
    { k: 'Location', v: p.place },
    { k: 'Category', v: p.cats.map(label).join(', ') },
  ].filter((m) => m.v);

  return (
    <article className="case" ref={root}>
      <header className="case__hero">
        <nav className="case__crumbs rv rv--fade" data-reveal aria-label="Breadcrumb">
          <Link href="/work">All work</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/work?c=${p.cats[0]}`}>{label(p.cats[0])}</Link>
        </nav>
        <h1 className="title title--xl rv case__title" data-reveal>
          <span className="ln">
            <span>{p.title}</span>
          </span>
        </h1>
        <p className="lead rv rv--fade" data-reveal style={{ '--d': '200ms' } as CSSProperties}>
          {p.summary}
        </p>
        <dl className="case__meta rv rv--fade" data-reveal style={{ '--d': '320ms' } as CSSProperties}>
          {meta.map((m) => (
            <div key={m.k}>
              <dt>{m.k}</dt>
              <dd>{m.v}</dd>
            </div>
          ))}
        </dl>
      </header>

      <section className="case__body">
        <aside className="case__side">
          <h2 className="kicker">Role</h2>
          <ul className="case__roles">
            {p.role.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </aside>

        <div className="case__main">
          <h2 className="kicker rv rv--fade" data-reveal>
            The story
          </h2>
          {p.story.map((s, i) => (
            <p key={i} className="case__p rv rv--fade" data-reveal>
              {s}
            </p>
          ))}

          {p.process ? (
            <>
              <h2 className="kicker case__h rv rv--fade" data-reveal>
                Concept to creation
              </h2>
              <ol className="case__process">
                {p.process.map((s, i) => (
                  <li key={s.k} className="rv rv--fade" data-reveal>
                    <span className="case__pn">{String(i + 1).padStart(2, '0')}</span>
                    <span className="case__pk">{s.k}</span>
                    <span className="case__pv">{s.v}</span>
                  </li>
                ))}
              </ol>
            </>
          ) : null}

          <figure className="case__figure rv rv--fade" data-reveal>
            <img src={p.image} alt={`${p.title}`} loading="lazy" decoding="async" />
          </figure>

          {p.draft ? (
            <p className="case__note rv rv--fade" data-reveal>
              The full case study, with frames and the film, is being put together. Until then, the work is in the showreel.
            </p>
          ) : null}
          <a className="work-cta rv rv--fade" data-reveal href={showreelUrl} target="_blank" rel="noreferrer">
            Watch the showreel <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <Link
        href={`/work/${next.slug}`}
        className="case__next"
        onMouseEnter={() => (nextHover.current = true)}
        onMouseLeave={() => (nextHover.current = false)}
        onFocus={() => (nextHover.current = true)}
        onBlur={() => (nextHover.current = false)}
      >
        <span className="kicker">Next project</span>
        <span className="case__next-title">{next.title}</span>
        <span className="case__next-sum">{next.summary}</span>
      </Link>
    </article>
  );
}
