'use client';

/**
 * The /work film: one project per screen over the WebGL stage.
 * (This was the first home page; kept as the full portfolio.)
 */
import { type CSSProperties, useRef } from 'react';
import { director, lerp, range, smooth, steps } from '@/lib/director';
import { Chapter, Lines, enterShot, showItem } from './kit';
import { home } from '@content/work';

/* ---------- 01 Signal ---------- */

function Signal() {
  const c = home.signal;
  return (
    <Chapter
      id="top"
      name={c.chapter}
      length={2.6}
      drive={(_p, l) => {
        director.shot = 0;
        director.static = lerp(0.45, 0.03, smooth(range(l, 0, 0.55)));
        director.warp = 0.35;
        director.pulse = 0;
        director.dim = lerp(0.5, 0.25, range(l, 0.55, 0.9));
        director.zoom = lerp(1.14, 1.0, l);
        director.fade = 1;
      }}
      className="ch--signal"
    >
      <div className="frame frame--bl">
        <p className="kicker rv rv--fade" data-at={0} data-out={0.62}>
          <span className="dot dot--live" /> {c.kicker}
        </p>
        <Lines lines={c.title} as="h1" className="title title--xl" at={0} out={0.62} />
        <p className="body rv rv--fade" data-at={0.12} data-out={0.62}>
          {c.body}
        </p>
      </div>
    </Chapter>
  );
}

/* ---------- 02 Timeline ---------- */

function Timeline() {
  const c = home.timeline;
  return (
    <Chapter
      name={c.chapter}
      length={3.2}
      drive={(p, l, el) => {
        director.shot = 0;
        director.static = 0;
        director.warp = lerp(0.35, 0.95, smooth(l));
        director.pulse = 0;
        director.dim = 0.6;
        director.zoom = lerp(1.0, 1.28, smooth(l));
        director.fade = 1;
        el.style.setProperty('--l', range(l, 0.05, 0.85).toFixed(4));
        void p;
      }}
      className="ch--timeline"
    >
      <div className="frame frame--tl">
        <Lines lines={[c.title[0]]} className="title title--lg" at={0} out={0.97} />
        <Lines lines={[c.title[1]]} className="title title--lg title--thin" at={0.7} out={0.97} />
      </div>
      <div className="career rv rv--fade" data-at={0} data-out={0.97}>
        <div className="career__rail" aria-hidden="true">
          <span className="career__head" />
        </div>
        <ol className="career__steps">
          {c.steps.map((s, i) => (
            <li key={s.year} className="career__step rv rv--fade" data-at={0.05 + i * 0.2} data-out={0.97}>
              <span className="career__year">{s.year}</span>
              <span className="career__company">{s.company}</span>
              <span className="career__role">{s.role}</span>
            </li>
          ))}
        </ol>
      </div>
    </Chapter>
  );
}

/* ---------- 03 Work ---------- */

function Work() {
  const c = home.work;
  const n = c.items.length;
  const counter = useRef<HTMLSpanElement>(null);
  return (
    <Chapter
      name={c.chapter}
      length={1 + n * 0.9}
      drive={(p, l, el) => {
        const s = steps(l, n);
        const entered = l > 0;
        director.shot = entered ? c.items[0].shot + s.value : enterShot(el, p, 0, c.items[0].shot);
        director.static = 0;
        director.warp = 0.22;
        director.pulse = 0;
        director.dim = 0.42;
        director.zoom = 1.03 + (s.value % 1) * 0.08;
        director.fade = 1;
        showItem(el, s.index, p > 0.08);
        if (counter.current) counter.current.textContent = String(s.index + 1).padStart(2, '0');
      }}
      className="ch--work"
    >
      <div className="work__head">
        <span className="kicker">{c.kicker}</span>
        <span className="work__count" aria-hidden="true">
          <span ref={counter}>01</span>
          <span className="work__of"> / {String(n).padStart(2, '0')}</span>
        </span>
      </div>
      <ol className="work__list">
        {c.items.map((w, i) => (
          <li key={w.title} className="work__item" data-item={i}>
            <p className="work__meta">
              <span>{w.client}</span>
              <span>{w.place}</span>
              <span>{w.year}</span>
            </p>
            <h3 className="work__title">
              <span className="ln">
                <span>{w.title}</span>
              </span>
            </h3>
            <p className="work__line">{w.line}</p>
          </li>
        ))}
      </ol>
    </Chapter>
  );
}

/* ---------- 04 Sound ---------- */

function Sound() {
  const c = home.sound;
  const first = c.items[0].shot;
  return (
    <Chapter
      name={c.chapter}
      length={4.4}
      drive={(p, l, el) => {
        const t = range(l, 0.3, 1);
        const s = steps(t, c.items.length);
        director.shot = l > 0 ? first + s.value : enterShot(el, p, first - 1, first);
        director.static = 0;
        director.warp = l < 0.3 ? 0.65 : 0.3;
        director.pulse = 1;
        director.dim = l < 0.3 ? 0.68 : 0.45;
        director.zoom = 1.06;
        director.fade = 1;
        showItem(el, s.index, l >= 0.3);
      }}
      className="ch--sound"
    >
      <div className="frame frame--center">
        <Lines lines={[c.verse]} as="p" className="verse" at={0} out={0.28} />
        <p className="body body--center rv rv--fade" data-at={0.06} data-out={0.28}>
          {c.verseNote}
        </p>
      </div>
      <div className="frame frame--bl">
        <p className="kicker rv rv--fade" data-at={0.3} data-out={1.1}>
          {c.title}
        </p>
        <ol className="sound__list">
          {c.items.map((s, i) => (
            <li key={s.title} className="work__item" data-item={i}>
              <h3 className="work__title work__title--thin">
                <span className="ln">
                  <span>{s.title}</span>
                </span>
              </h3>
              <p className="work__line">{s.note}</p>
            </li>
          ))}
        </ol>
      </div>
      <div className="eq" aria-hidden="true">
        {Array.from({ length: 48 }, (_, i) => (
          <span key={i} style={{ '--i': i, '--d': `${(0.45 + ((i * 37) % 11) / 14).toFixed(2)}s` } as CSSProperties} />
        ))}
      </div>
    </Chapter>
  );
}

/* ---------- 05 Trust ---------- */

function Trust() {
  const c = home.trust;
  return (
    <Chapter
      name={c.chapter}
      length={2.6}
      drive={(p, l, el) => {
        director.shot = enterShot(el, p, 11, 12);
        director.static = 0;
        director.warp = lerp(0.6, 1, smooth(range(l, 0, 0.5)));
        director.pulse = 0;
        director.dim = 0.66;
        director.zoom = lerp(1.08, 1.32, l);
        director.fade = 1;
      }}
      className="ch--trust"
    >
      <div className="frame frame--center">
        <Lines lines={c.quote} as="p" className="quote" at={0} out={0.62} />
        <p className="kicker kicker--center rv rv--fade" data-at={0.12} data-out={0.62}>
          {c.cite}
        </p>
        <p className="lead rv rv--fade" data-at={0.66} data-out={1.1}>
          {c.after}
        </p>
      </div>
    </Chapter>
  );
}

/* ---------- 06 Moin ---------- */

function Self() {
  const c = home.self;
  return (
    <Chapter
      name={c.chapter}
      length={2.8}
      drive={(p, l, el) => {
        director.shot = enterShot(el, p, 12, 13);
        director.static = 0;
        // The melt from the last chapter settles into his face.
        director.warp = lerp(0.9, 0.08, smooth(range(l, 0, 0.45)));
        director.pulse = 0;
        director.dim = 0.5;
        director.zoom = lerp(1.15, 1.02, smooth(l));
        director.fade = 1;
      }}
      className="ch--self"
    >
      <div className="frame frame--split">
        <Lines lines={c.title} className="title title--lg" at={0.08} out={1.1} />
        <dl className="facts">
          {c.facts.map((f, i) => (
            <div key={f.k} className="facts__row rv rv--fade" data-at={0.25 + i * 0.08} data-out={1.1}>
              <dt>{f.k}</dt>
              <dd>{f.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Chapter>
  );
}

/* ---------- 07 Cut ---------- */

function End() {
  const c = home.end;
  return (
    <Chapter
      id="end"
      name={c.chapter}
      length={2.2}
      drive={(p, l, el) => {
        director.shot = enterShot(el, p, 13, 14);
        director.static = lerp(0, 0.4, smooth(range(l, 0.55, 1)));
        director.warp = 0.3;
        director.pulse = 0;
        director.dim = 0.62;
        director.zoom = lerp(1.0, 1.1, l);
        director.fade = lerp(1, 0.75, range(l, 0.6, 1));
      }}
      className="ch--end"
    >
      <div className="frame frame--end">
        <Lines lines={c.name} className="title title--name" at={0} />
        <p className="lead rv rv--fade" data-at={0.1}>
          {c.line}
        </p>
        <ul className="links">
          {c.links.map((link, i) => (
            <li key={link.label} className="rv rv--fade" data-at={0.16 + i * 0.04}>
              <a
                className="links__a"
                href={link.href}
                {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
              >
                {link.label}
                <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="footer">{c.footer}</p>
      </div>
    </Chapter>
  );
}

export function Chapters() {
  return (
    <>
      <Signal />
      <Timeline />
      <Work />
      <Sound />
      <Trust />
      <Self />
      <End />
    </>
  );
}
