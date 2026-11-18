'use client';

/**
 * The home page story: nine chapters over one WebGL stage. Each chapter has
 * one set-piece that uses the craft it is about:
 *   Hero    calm: who he is and the proof, on the first screen
 *   Cut     the sentence is edited down live as you scroll
 *   Scale   hard-cut montage that stops dead on the stadium
 *   Circle  a garba circle of frames that widens edition by edition
 *   Build   a brand is built on an artboard; the blurred event behind it
 *           comes into focus when the work is done
 *   Cross   live Ahmedabad and Melbourne clocks, a flight line, clients
 *   Stage   a playbill that scrolls past while the picture breathes to sound
 *   Moin    focus racks onto the person; his titles
 *   Contact his name, the links
 */
import { useEffect, useRef, type CSSProperties } from 'react';
import Link from 'next/link';
import { direct, lerp, range, smooth, steps } from '@/lib/director';
import { Chapter, Lines, enterShot, setVar, showItem, showSteps } from '@/components/film/kit';
import { story, storyShots } from '@content/story';

const shotSrc = (i: number) => storyShots[Math.max(0, Math.min(storyShots.length - 1, i))];
const pad2 = (n: number) => String(Math.round(n)).padStart(2, '0');
const ext = (href: string) => (href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {});

/* ======================================================================
   1 · Hero: the type is the screen. "brands." fills the width and his
   work plays inside the letters (crossfading frames, panning with the
   cursor). A normal page: the immersive film opens later, with the work.
   ====================================================================== */

const REEL_MS = 2400;

function Hero() {
  const c = story.hero;
  const frames = story.loader.frames;
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const fills = [...el.querySelectorAll<HTMLElement>('.hx__layer')];
    const glows = [...el.querySelectorAll<HTMLElement>('.hx__glow')];
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let i = 0;
    const show = (n: number) => {
      fills.forEach((f, k) => f.classList.toggle('is-on', k === n));
      glows.forEach((g, k) => g.classList.toggle('is-on', k === n));
    };
    show(0);
    if (reduced) return;

    // The footage inside the letters drifts with the cursor (eased).
    let tx = 50;
    let ty = 50;
    let x = 50;
    let y = 50;
    const onMove = (e: PointerEvent) => {
      tx = 50 + (e.clientX / window.innerWidth - 0.5) * 18;
      ty = 50 + (e.clientY / window.innerHeight - 0.5) * 18;
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
      i = (i + 1) % frames.length;
      show(i);
    }, REEL_MS);
    return () => {
      window.clearInterval(id);
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      io.disconnect();
    };
  }, [frames]);

  return (
    <Chapter
      id="top"
      name={c.chapter}
      length={1}
      drive={() => direct({ shot: 0, win: 0 })}
      className="ch--hero ch--plain"
    >
      <div className="hx" ref={root}>
        {/* Atmosphere: a faint, blurred glow of the frame now playing. */}
        <div className="hx__glows" aria-hidden="true">
          {frames.map((f, k) => (
            <span key={f.src + f.label} className={`hx__glow${k === 0 ? ' is-on' : ''}`} style={{ backgroundImage: `url(${f.src})` }} />
          ))}
        </div>

        {/* Moin at work: the hero's right side, graded into the page. */}
        <figure className="hx__man rv rv--fade" data-at={0} style={{ '--d': '300ms' } as CSSProperties}>
          <img src={c.onset.src} alt={c.onset.alt} fetchPriority="high" />
          <span className="hx__vf hx__vf--tl" aria-hidden="true" />
          <span className="hx__vf hx__vf--tr" aria-hidden="true" />
          <span className="hx__vf hx__vf--br" aria-hidden="true" />
          <span className="hx__tag" aria-hidden="true">
            <i className="hud__rec" /> {c.onset.tag}
          </span>
          <figcaption className="hx__cap">{c.onset.caption}</figcaption>
        </figure>

        <p className="kicker hx__kicker rv rv--fade" data-at={0}>
          {c.kicker}
        </p>

        <h1 className="hx__title rv" data-at={0} aria-label={`${c.lead} ${c.word}`}>
          <span className="ln" style={{ '--i': 0 } as CSSProperties} aria-hidden="true">
            <span className="hx__lead">{c.lead}</span>
          </span>
          <span className="ln" style={{ '--i': 1 } as CSSProperties} aria-hidden="true">
            <span className="hx__fill">
              <span className="hx__base">{c.word}</span>
              {frames.map((f, k) => (
                <span key={f.src + f.label} className={`hx__layer${k === 0 ? ' is-on' : ''}`} style={{ backgroundImage: `url(${f.src})` }}>
                  {c.word}
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

/* ======================================================================
   2 · Cut: the live edit
   ====================================================================== */

function Cut() {
  const c = story.cut;
  const root = useRef<HTMLDivElement>(null);
  const runtime = useRef<HTMLSpanElement>(null);
  const ghost = useRef<HTMLSpanElement>(null);
  const last = useRef(-1);

  const cuts = c.sentence.map((w, i) => ({ ...w, i })).filter((w) => !('k' in w && w.k));
  // Strike left to right, then lift them all out at once.
  const order = new Map(cuts.map((w, n) => [w.i, n]));

  // Measure each token so it collapses from its real width to zero.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const measure = () =>
      el.querySelectorAll<HTMLElement>('.tok').forEach((t) => {
        t.style.maxWidth = 'none';
        t.style.setProperty('--w', `${t.scrollWidth + 1}px`);
        t.style.maxWidth = '';
      });
    measure();
    document.fonts?.ready.then(measure).catch(() => undefined);
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <Chapter
      name={c.chapter}
      length={2.6}
      drive={(p, l, el) => {
        // Still a normal page: the film window stays closed until the work.
        direct({ shot: 1, win: 0 });
        const cutP = range(l, 0.1, 0.62);
        if (Math.abs(cutP - last.current) < 0.002) return;
        last.current = cutP;
        const n = cuts.length;
        // Words and their timeline clips share data-i, so they cut together.
        el.querySelectorAll<HTMLElement>('.tok, .clip').forEach((t) => {
          const o = order.get(Number(t.dataset.i));
          if (o === undefined) {
            t.classList.toggle('is-kept', cutP >= 1);
            return;
          }
          t.classList.toggle('is-mark', range(cutP, 0, 0.7) * n > o);
          t.classList.toggle('is-gone', cutP > 0.82);
        });
        const secs = pad2(cutP > 0.82 ? c.runtime.to : c.runtime.from);
        if (runtime.current) runtime.current.textContent = `00:${secs}`;
        if (ghost.current) ghost.current.textContent = `00:${secs}`;
        // Playhead sweeps the strip while the razor works, then parks at the end.
        setVar(el, '--ph', range(cutP, 0, 0.72));
        el.classList.toggle('is-final', cutP >= 1);
      }}
      className="ch--cut ch--plain"
    >
      <div className="frame frame--bl cut">
        <div className="cut__top rv rv--fade" data-at={0}>
          <span className="kicker">
            <span className="dot dot--live" /> {c.kicker}
          </span>
          <span className="cut__runtime">
            <span className="cut__runtime-k">{c.runtime.label}</span>
            <span ref={runtime}>00:{pad2(c.runtime.from)}</span>
          </span>
        </div>
        <div ref={root} className="cut__sentence rv rv--fade" data-at={0}>
          <p aria-label="Cut to what matters.">
            {c.sentence.map((w, i) => (
              <span key={i} className="tok" data-i={i} aria-hidden="true">
                {w.t}
              </span>
            ))}
          </p>
        </div>
        {/* The edit itself: one clip per word on a timeline, cut in sync. */}
        <div className="tl rv rv--fade" data-at={0} style={{ '--d': '200ms' } as CSSProperties} aria-hidden="true">
          <div className="tl__ruler">
            {Array.from({ length: 7 }, (_, k) => (
              <span key={k}>00:{pad2(k * 5)}</span>
            ))}
          </div>
          <div className="tl__track">
            {c.sentence.map((w, i) =>
              w.t.trim().length > 1 || 'k' in w ? (
                <span
                  key={i}
                  className="clip"
                  data-i={i}
                  style={{ '--g': Math.max(2, w.t.trim().length), backgroundImage: `url(${shotSrc(CLIP_SHOTS[i % CLIP_SHOTS.length])})` } as CSSProperties}
                >
                  <em>{w.t.replace(/[^A-Za-z’']/g, '') || '·'}</em>
                </span>
              ) : null,
            )}
            <span className="tl__ph" />
          </div>
          <div className="tl__audio">
            {Array.from({ length: 64 }, (_, k) => (
              <span key={k} style={{ '--h': `${(0.25 + Math.abs(Math.sin(k * 1.7) * Math.cos(k * 0.6))).toFixed(2)}` } as CSSProperties} />
            ))}
          </div>
        </div>
        <p className="body rv rv--fade" data-at={0.66}>
          {c.after}
        </p>
      </div>
      {/* Atmosphere: a giant runtime behind the edit, and the monitor glow. */}
      <span className="cut__ghost" ref={ghost} aria-hidden="true">
        00:{pad2(c.runtime.from)}
      </span>
    </Chapter>
  );
}

/** Frames used as clip thumbnails on the timeline. */
const CLIP_SHOTS = [2, 3, 5, 7, 8, 9, 11, 12, 14, 4, 10, 13];

/* ======================================================================
   3 · Scale: hard-cut montage, then hold
   ====================================================================== */

function Scale() {
  const c = story.scale;
  const n = c.reel.length;
  const counter = useRef<HTMLSpanElement>(null);
  return (
    <Chapter
      name={c.chapter}
      length={3.2}
      drive={(p, l, el) => {
        const montage = l < 0.58;
        const t = range(l, 0.02, 0.58);
        // Twice through, faster the second time: rhythm, not a slideshow.
        const beat = t < 0.55 ? (t / 0.55) * n : n + ((t - 0.55) / 0.45) * n;
        const i = Math.min(2 * n - 1, Math.floor(beat)) % n;
        // Entering the work: the film window opens from the centre as the section rises.
        if (l <= 0) direct({ shot: c.reel[0].shot, dim: 0.5, win: smooth(range(p, 0.05, window.innerHeight / el.offsetHeight)) });
        else if (montage) direct({ shot: c.reel[i].shot, cut: 1, dim: 0.66, zoom: 1.05 + (beat % 1) * 0.05, warp: 0.08 });
        else direct({ shot: c.hold.shot, dim: lerp(0.3, 0.52, range(l, 0.68, 0.82)), zoom: lerp(1.0, 1.1, range(l, 0.58, 1)), warp: 0.06 });
        showItem(el, montage && l > 0 ? i : -1, true);
        el.classList.toggle('is-hold', !montage);
        if (counter.current) counter.current.textContent = `${pad2(montage ? i + 1 : n + 1)} / ${pad2(n + 1)}`;
      }}
      className="ch--scale"
    >
      <div className="scale__head">
        <span className="kicker">{c.kicker}</span>
        <span className="scale__count" ref={counter}>
          01 / {pad2(n + 1)}
        </span>
      </div>
      <ol className="scale__reel">
        {c.reel.map((r, i) => (
          <li key={r.title} className="scale__cut" data-item={i}>
            <span className="scale__title">{r.title}</span>
            <span className="scale__note">{r.note}</span>
          </li>
        ))}
      </ol>
      <div className="frame frame--bl scale__hold">
        <p className="kicker rv rv--fade" data-at={0.6}>
          {c.hold.note}
        </p>
        <Lines lines={[c.hold.title]} className="title title--xl" at={0.6} />
        <p className="lead rv rv--fade" data-at={0.74}>
          {c.after}
        </p>
      </div>
    </Chapter>
  );
}

/* ======================================================================
   4 · Circle: the garba thread
   ====================================================================== */

const RING = [8, 9, 12, 16, 11, 14, 8, 9, 12, 16, 11, 14, 9, 8];

function Circle() {
  const c = story.circle;
  const n = c.stops.length;
  return (
    <Chapter
      name={c.chapter}
      length={3}
      drive={(p, l, el) => {
        const s = steps(range(l, 0.06, 0.84), n, 0.35);
        direct({ shot: enterShot(el, p, 7, 8), focus: 0.75, warp: 0.35, dim: 0.72, zoom: 1.06 });
        setVar(el, '--spin', l * 200 - 20, 2);
        setVar(el, '--grow', smooth(s.value / (n - 1)));
        showItem(el, s.index, l > 0.02);
        showSteps(el, l > 0.02 ? s.index + 1 : 0);
        el.classList.toggle('is-out', l > 0.86);
      }}
      className="ch--circle"
    >
      <div className="ring" aria-hidden="true">
        <div className="ring__plane">
          <div className="ring__spin">
            {RING.map((shot, i) => (
              <span
                key={i}
                className="ring__card"
                data-step={Math.min(n, Math.floor(i / 3.5) + 1)}
                style={{ '--a': `${(i / RING.length) * 360}deg`, backgroundImage: `url(${shotSrc(shot)})` } as CSSProperties}
              />
            ))}
          </div>
        </div>
      </div>

      <p className="kicker circle__intro rv rv--fade" data-at={0} data-out={0.86}>
        {c.intro}
      </p>

      <ol className="circle__stops">
        {c.stops.map((s, i) => (
          <li key={s.year} className="circle__stop" data-item={i}>
            <span className="circle__year">
              <span className="ln">
                <span>{s.year}</span>
              </span>
            </span>
            <span className="circle__place">{s.place}</span>
            <span className="circle__line">{s.line}</span>
          </li>
        ))}
      </ol>

      <div className="frame frame--center circle__outro">
        <Lines lines={[c.outro]} className="title title--lg" at={0.87} />
      </div>
    </Chapter>
  );
}

/* ======================================================================
   5 · Build: one frame of the event, made in front of you.
   Everything happens on the full-screen film itself (no artboard):
   idea -> black and white scout frame with guides -> colour grade ->
   wordmark -> one crop window morphing through every format -> the night.
   ====================================================================== */

function Build() {
  const c = story.build;
  const total = c.steps.length;
  const crop = useRef<HTMLDivElement>(null);
  const fmtLabel = useRef<HTMLSpanElement>(null);
  const last = useRef({ step: -2, fmt: -1 });

  // Size the crop window for a format: as large as fits 84vw x 70vh.
  const sizeCrop = (r: number) => {
    const el = crop.current;
    if (!el) return;
    const maxW = window.innerWidth * 0.84;
    const maxH = window.innerHeight * 0.7;
    const w = Math.min(maxW, maxH * r);
    el.style.width = `${Math.round(w)}px`;
    el.style.height = `${Math.round(w / r)}px`;
  };

  return (
    <Chapter
      name={c.chapter}
      length={5}
      drive={(p, l, el) => {
        const t = range(l, 0.03, 0.92) * total;
        const step = l <= 0 ? -1 : Math.min(total - 1, Math.floor(t));
        const sub = t - Math.floor(t);
        const look = [
          { dim: 0.94, focus: 1, sat: 0, zoom: 1.16, warp: 0.1 }, // idea: almost black
          { dim: 0.5, focus: 0.35, sat: 0, zoom: 1.1, warp: 0.06 }, // frame: b&w scout
          { dim: 0.42, focus: 0.12, sat: 1, zoom: 1.07, warp: 0.06 }, // grade
          { dim: 0.58, focus: 0, sat: 1, zoom: 1.05, warp: 0.05 }, // mark
          { dim: 0.32, focus: 0, sat: 1, zoom: 1.03, warp: 0.04 }, // formats
          { dim: 0.32, focus: 0, sat: 1, zoom: lerp(1.0, 1.08, range(l, 0.9, 1)), warp: 0.1 }, // night
        ][Math.max(0, step)];
        direct({ shot: enterShot(el, p, 8, 9), burn: 1, ...look });

        // Formats: the crop window steps through ratios within its slot.
        const fmt = step === 4 ? Math.min(c.formats.length - 1, Math.floor(sub * c.formats.length)) : step > 4 ? -2 : -1;
        if (step !== last.current.step || fmt !== last.current.fmt) {
          last.current = { step, fmt };
          showSteps(el, step);
          showItem(el, step, step >= 0);
          el.classList.toggle('is-night', step >= total - 1);
          el.dataset.step = String(step);
          if (fmt >= 0) {
            sizeCrop(c.formats[fmt].r);
            if (fmtLabel.current) fmtLabel.current.textContent = `${c.formats[fmt].k} · ${c.formats[fmt].note}`;
          } else if (fmt === -2) {
            // Night: the window opens to the whole screen.
            if (crop.current) {
              crop.current.style.width = `${window.innerWidth + 4}px`;
              crop.current.style.height = `${window.innerHeight + 4}px`;
            }
          } else sizeCrop(c.formats[0].r);
        }
      }}
      className="ch--build"
    >
      {/* Step rail: where we are in the making. */}
      <div className="mk__rail rv rv--fade" data-at={0} data-out={0.9}>
        <span className="kicker">{c.kicker}</span>
        <ol className="mk__steps">
          {c.steps.map((s, i) => (
            <li key={s.k} className="mk__step" data-item={i}>
              <span className="mk__n">{pad2(i + 1)}</span>
              <span className="mk__k">{s.k}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* 0 · Idea: one sentence in the dark. */}
      <p className="mk__brief" data-step={0} data-until={1}>
        <span className="mk__over">The brief</span>
        <span className="mk__line">“{c.brief}”</span>
      </p>

      {/* 1 · Frame: thirds, centre mark and letterbox bars over the b&w scout. */}
      <div className="mk__guides" data-step={1} data-until={4} aria-hidden="true">
        <span className="mk__bar mk__bar--t" />
        <span className="mk__bar mk__bar--b" />
        <i className="mk__v" style={{ left: '33.333%' }} />
        <i className="mk__v" style={{ left: '66.666%' }} />
        <i className="mk__h" style={{ top: '33.333%' }} />
        <i className="mk__h" style={{ top: '66.666%' }} />
        <b className="mk__plus" />
        <span className="mk__tc">A001 · C014 · 25 fps · scout</span>
      </div>

      {/* 2 · Grade: the palette as grading chips. */}
      <ul className="mk__grade" data-step={2} data-until={3}>
        {c.palette.map((s, i) => (
          <li key={s.hex} style={{ '--i': i } as CSSProperties}>
            <span className="mk__chip" style={{ background: s.hex }} />
            <span className="mk__chip-k">{s.name}</span>
            <span className="mk__chip-v">{s.hex}</span>
          </li>
        ))}
      </ul>

      {/* 3 · Mark: the wordmark lands on the frame. */}
      <div className="mk__mark" data-step={3} data-until={5} aria-hidden="true">
        <span className="mk__word">{c.wordmark}</span>
        <span className="mk__tag">{c.tagline}</span>
      </div>

      {/* 4 · Formats: one window morphing over the same shot. */}
      <div className="mk__crop" ref={crop} data-step={4} aria-hidden="true">
        <span className="mk__corner mk__corner--tl" />
        <span className="mk__corner mk__corner--tr" />
        <span className="mk__corner mk__corner--bl" />
        <span className="mk__corner mk__corner--br" />
        <span className="mk__fmt" ref={fmtLabel} />
      </div>

      {/* Caption for the current step, bottom left. */}
      <ol className="mk__captions">
        {c.steps.slice(0, -1).map((s, i) => (
          <li key={s.k} className="mk__cap" data-item={i}>
            {s.v}
          </li>
        ))}
      </ol>

      {/* 5 · Night. */}
      <div className="frame frame--bl build__night">
        <Lines lines={[c.steps[total - 1].v]} className="title title--xl" at={0.84} />
        <p className="lead rv rv--fade" data-at={0.87}>
          {c.after}
        </p>
        <Link className="work-cta rv rv--fade" data-at={0.9} href={c.cta.href}>
          {c.cta.label} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </Chapter>
  );
}

/* ======================================================================
   6 · Cross: Australia
   ====================================================================== */

function useClock(tz: string) {
  const time = useRef<HTMLSpanElement>(null);
  const off = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const offFmt = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'shortOffset' });
    const update = () => {
      const now = new Date();
      if (time.current) time.current.textContent = fmt.format(now);
      if (off.current) off.current.textContent = offFmt.formatToParts(now).find((x) => x.type === 'timeZoneName')?.value ?? '';
    };
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, [tz]);
  return { time, off };
}

const ARC = 'M 40 150 C 300 -40, 700 -40, 960 150';

function Cross() {
  const c = story.cross;
  const a = useClock(c.from.tz);
  const b = useClock(c.to.tz);
  const path = useRef<SVGPathElement>(null);
  const dot = useRef<SVGCircleElement>(null);
  return (
    <Chapter
      name={c.chapter}
      length={3}
      drive={(p, l, el) => {
        direct({ shot: enterShot(el, p, 9, 10), warp: 0.22, dim: lerp(0.45, 0.74, range(l, 0.3, 0.46)), zoom: lerp(1.0, 1.12, l) });
        const d = smooth(range(l, 0.04, 0.3));
        setVar(el, '--draw', d);
        if (path.current && dot.current) {
          const pt = path.current.getPointAtLength(path.current.getTotalLength() * d);
          dot.current.setAttribute('cx', pt.x.toFixed(1));
          dot.current.setAttribute('cy', pt.y.toFixed(1));
        }
      }}
      className="ch--cross"
    >
      <div className="cross">
        <p className="kicker rv rv--fade" data-at={0}>
          {c.kicker}
        </p>
        <div className="cross__route rv rv--fade" data-at={0} data-out={0.4}>
          <div className="clock">
            <span className="clock__city">{c.from.city}</span>
            <span className="clock__time" ref={a.time}>
              --:--:--
            </span>
            <span className="clock__tz" ref={a.off} />
          </div>
          <svg className="cross__arc" viewBox="0 0 1000 170" preserveAspectRatio="none" aria-hidden="true">
            <path d={ARC} className="cross__arc-bg" />
            <path ref={path} d={ARC} className="cross__arc-fg" pathLength={1} />
            <circle ref={dot} r="5" cx="40" cy="150" className="cross__dot" />
          </svg>
          <div className="clock clock--to">
            <span className="clock__city">{c.to.city}</span>
            <span className="clock__time" ref={b.time}>
              --:--:--
            </span>
            <span className="clock__tz" ref={b.off} />
          </div>
          <span className="cross__distance">{c.distance}</span>
        </div>

        <div className="cross__wall">
          <Lines lines={c.title} className="title title--lg" at={0.42} />
          <ul className="clients">
            {c.clients.map((name, i) => (
              <li key={name} className="rv rv--fade" data-at={0.5 + i * 0.03}>
                {name}
              </li>
            ))}
          </ul>
          <p className="body rv rv--fade" data-at={0.64}>
            {c.more}
          </p>
          <p className="body rv rv--fade" data-at={0.76}>
            {c.after}
          </p>
        </div>
      </div>
    </Chapter>
  );
}

/* ======================================================================
   7 · Stage: the playbill
   ====================================================================== */

function Stage() {
  const c = story.stage;
  const n = c.bill.length;
  return (
    <Chapter
      name={c.chapter}
      length={4}
      drive={(p, l, el) => {
        const pos = range(l, 0.24, 0.96) * (n - 1);
        const active = Math.round(pos);
        const intro = l < 0.22;
        direct({
          shot: intro ? enterShot(el, p, 10, 11) : c.bill[active].shot,
          pulse: 1,
          warp: intro ? 0.55 : 0.3,
          dim: intro ? 0.7 : 0.66,
          zoom: 1.06,
          focus: intro ? 0.35 : 0.15,
        });
        setVar(el, '--pos', pos, 3);
        showItem(el, active, l >= 0.23);
      }}
      className="ch--stage"
    >
      <div className="frame frame--center stage__verse">
        <Lines lines={c.headline} as="h2" className="verse verse--stage" at={0} out={0.21} />
      </div>
      <div className="bill rv rv--fade" data-at={0.23}>
        <ol className="bill__list">
          {c.bill.map((b, i) => (
            <li key={b.title} className="bill__row" data-item={i}>
              <span className="bill__title">{b.title}</span>
              <span className="bill__meta">
                <span>{b.who}</span>
                <span className="bill__role">{b.role}</span>
                {b.year ? <span className="bill__year">{b.year}</span> : null}
              </span>
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

/* ======================================================================
   8 · Moin: out of the film. The window closes as this section rises,
   and Moin is introduced on a normal page.
   ====================================================================== */

function Self() {
  const c = story.self;
  return (
    <Chapter
      name={c.chapter}
      length={1.6}
      drive={(p, _l, el) => {
        direct({ shot: 14, dim: 0.6, win: 1 - smooth(range(p, 0.05, window.innerHeight / el.offsetHeight)) });
      }}
      className="ch--self ch--plain"
    >
      <div className="plain plain--self">
        <figure className="plain__frame plain__frame--portrait rv rv--fade" data-at={0}>
          <img src={shotSrc(15)} alt="Portrait of Moin Vahora" loading="lazy" />
          <figcaption>
            <span>Moin Vahora</span>
            <span>Ahmedabad</span>
          </figcaption>
        </figure>
        <div className="self__lead">
          <p className="kicker rv rv--fade" data-at={0} style={{ '--d': '120ms' } as CSSProperties}>
            {c.over}
          </p>
          <Lines lines={c.title} className="title title--lg" at={0} />
          <p className="body rv rv--fade" data-at={0} style={{ '--d': '300ms' } as CSSProperties}>
            {c.line}
          </p>
          <ol className="self__titles">
            {c.titles.map((t, i) => (
              <li key={t.role} className="rv rv--fade" data-at={0} style={{ '--d': `${420 + i * 90}ms` } as CSSProperties}>
                <span className="titles__role">{t.role}</span>
                <span className="titles__org">{t.org}</span>
              </li>
            ))}
          </ol>
          <dl className="facts">
            {c.facts.map((f, i) => (
              <div key={f.k} className="facts__row rv rv--fade" data-at={0} style={{ '--d': `${700 + i * 80}ms` } as CSSProperties}>
                <dt>{f.k}</dt>
                <dd>{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Chapter>
  );
}

/* ======================================================================
   9 · Contact: a normal page.
   ====================================================================== */

function End() {
  const c = story.end;
  return (
    <Chapter id="end" name={c.chapter} length={1} drive={() => direct({ shot: 16, win: 0 })} className="ch--end ch--plain">
      <div className="plain plain--end">
        <p className="kicker rv rv--fade" data-at={0}>
          {c.chapter}
        </p>
        <Lines lines={c.name} className="title title--name" at={0} />
        <p className="lead rv rv--fade" data-at={0} style={{ '--d': '260ms' } as CSSProperties}>
          {c.line}
        </p>
        <a className="contact__mail rv rv--fade" data-at={0} href={c.links[0].href} style={{ '--d': '360ms' } as CSSProperties}>
          vahoramoin2896@gmail.com
        </a>
        <ul className="links">
          {c.links.slice(1).map((link, i) => (
            <li key={link.label} className="rv rv--fade" data-at={0} style={{ '--d': `${440 + i * 60}ms` } as CSSProperties}>
              <a className="links__a" href={link.href} {...ext(link.href)}>
                {link.label}
                <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
        <Link className="work-cta rv rv--fade" data-at={0} href={c.work.href} style={{ '--d': '700ms' } as CSSProperties}>
          {c.work.label} <span aria-hidden="true">→</span>
        </Link>
        <p className="footer">{c.footer}</p>
      </div>
    </Chapter>
  );
}

export function Story() {
  return (
    <>
      <Hero />
      <Cut />
      <Scale />
      <Circle />
      <Build />
      <Cross />
      <Stage />
      <Self />
      <End />
    </>
  );
}
