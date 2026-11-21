'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { direct } from '@/lib/director';
import { Chapter } from '@/components/film/kit';
import { story } from '@content/story';

const ext = (href: string) => (href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {});
/** How long each word holds before the next rolls in. */
const HOLD_MS = 2600;

/* ======================================================================
   1 · Hero: "I build ___." The word rolls through what he builds
   (brands, launches, stages, nights, stories), each one playing its own
   work inside the letters and drifting with the cursor. In the open space,
   end credits roll slowly: the roles he has held, from Creative Head to
   Chief Editor. A normal page: the immersive film opens later.
   ====================================================================== */

export function Hero() {
  const c = story.hero;
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const words = [...el.querySelectorAll<HTMLElement>('.hx__word')];
    const glows = [...el.querySelectorAll<HTMLElement>('.hx__glow')];
    const tag = el.querySelector<HTMLElement>('[data-hx-of]');
    const count = el.querySelector<HTMLElement>('[data-hx-n]');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let at = 0;

    const show = (n: number) => {
      words.forEach((w, k) => {
        w.classList.toggle('is-on', k === n);
        // The word leaving rolls up and out; the others wait below.
        w.classList.toggle('is-out', k === (n - 1 + words.length) % words.length && k !== n);
      });
      glows.forEach((g, k) => g.classList.toggle('is-on', k === n));
      if (tag) tag.textContent = c.words[n].of;
      if (count) count.textContent = `${String(n + 1).padStart(2, '0')} / ${String(words.length).padStart(2, '0')}`;
    };
    show(0);
    if (reduced) return;

    // The footage inside the letters drifts with the cursor (eased).
    let tx = 50;
    let ty = 50;
    let x = 50;
    let y = 50;
    const onMove = (e: PointerEvent) => {
      tx = 50 + (e.clientX / window.innerWidth - 0.5) * 22;
      ty = 50 + (e.clientY / window.innerHeight - 0.5) * 22;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    let raf = 0;
    const loop = () => {
      x += (tx - x) * 0.06;
      y += (ty - y) * 0.06;
      el.style.setProperty('--px', `${x.toFixed(2)}%`);
      el.style.setProperty('--py', `${y.toFixed(2)}%`);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    const id = window.setInterval(() => {
      if (!visible || document.hidden) return;
      at = (at + 1) % words.length;
      show(at);
    }, HOLD_MS);
    return () => {
      window.clearInterval(id);
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      io.disconnect();
    };
  }, [c.words]);

  const all = c.words.map((w) => w.w.replace('.', '')).join(', ');
  // Two copies, so the roll loops without a seam.
  const roll = [...c.credits.list, ...c.credits.list];

  return (
    <Chapter id="top" name={c.chapter} length={1} drive={() => direct({ shot: 0, win: 0 })} className="ch--hero ch--plain">
      <div className="hx hx--roll" ref={root}>
        {/* Atmosphere: a faint, blurred glow of the word's work. */}
        <div className="hx__glows" aria-hidden="true">
          {c.words.map((w, k) => (
            <span key={w.w} className={`hx__glow${k === 0 ? ' is-on' : ''}`} style={{ backgroundImage: `url(${w.img})` }} />
          ))}
        </div>

        <div className="hx__top">
          <p className="kicker hx__kicker rv rv--fade" data-at={0}>
            {c.kicker}
          </p>

          {/* End credits: the roles, rolling slowly upward. */}
          <aside className="hx__credits rv rv--fade" data-at={0} style={{ '--d': '500ms' } as CSSProperties} aria-label={c.credits.title}>
            <p className="hx__creditsk">{c.credits.title}</p>
            <div className="hx__rollwin">
              <ul className="hx__roll" style={{ '--rows': c.credits.list.length } as CSSProperties}>
                {roll.map((r, k) => (
                  <li key={k} aria-hidden={k >= c.credits.list.length || undefined}>
                    <span className="hx__role">{r.role}</span>
                    <span className="hx__what">{r.what}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        <h1 className="hx__title rv" data-at={0} aria-label={`${c.lead} ${all}.`}>
          <span className="ln" style={{ '--i': 0 } as CSSProperties} aria-hidden="true">
            <span className="hx__lead">{c.lead}</span>
            <span className="hx__meta">
              <span data-hx-n>01 / 05</span>
              <span className="hx__of">
                <i className="hud__rec" /> <span data-hx-of>{c.words[0].of}</span>
              </span>
            </span>
          </span>
          <span className="ln" style={{ '--i': 1 } as CSSProperties} aria-hidden="true">
            <span className="hx__slot">
              {c.words.map((w, k) => (
                <span key={w.w} className={`hx__word${k === 0 ? ' is-on' : ''}`}>
                  <span className="hx__base">{w.w}</span>
                  <span className="hx__layer" style={{ backgroundImage: `url(${w.img})` }}>
                    {w.w}
                  </span>
                </span>
              ))}
            </span>
          </span>
        </h1>

        <div className="hx__foot">
          <p className="hero__sub rv rv--fade" data-at={0} style={{ '--d': '420ms' } as CSSProperties}>
            {c.sub}
          </p>
          <a className="credit-line hx__credit rv rv--fade" data-at={0} href={c.imdb.href} {...ext(c.imdb.href)} style={{ '--d': '560ms' } as CSSProperties}>
            <b className="credit-line__badge">{c.imdb.badge}</b>
            <span className="credit-line__label">{c.imdb.label}</span>
            <span className="credit-line__cta">
              {c.imdb.cta} <span aria-hidden="true">↗</span>
            </span>
          </a>
        </div>
      </div>
    </Chapter>
  );
}
