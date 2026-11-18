/**
 * Per-frame scroll director. Each chapter registers its section element and a
 * drive function. Every frame we measure each section, compute its progress
 * and let the chapter on screen write the director and its reveal classes.
 * Doing this per frame (instead of on scroll events) means state is always
 * correct, also right after the intro gate opens without any scroll.
 *
 * Progress per chapter:
 *  - p: 0 when the section's top enters the bottom of the viewport,
 *       1 when its bottom reaches the bottom of the viewport.
 *  - local: 0..1 over the part where the sticky stage is pinned.
 * Elements with data-at / data-out (in local units) get .is-in between the
 * two and .is-past after data-out.
 */
import { range } from './director';

export type Drive = (p: number, local: number, el: HTMLElement) => void;

type Chapter = { el: HTMLElement; name: string; drive: Drive; reveals: HTMLElement[] };

const chapters: Chapter[] = [];

export const flags = { gated: true, gate: 0 };

export function register(el: HTMLElement, name: string, drive: Drive) {
  const reveals = [...el.querySelectorAll<HTMLElement>('[data-at]')];
  const ch = { el, name, drive, reveals };
  chapters.push(ch);
  chapters.sort((a, b) => (a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
  return () => {
    const i = chapters.indexOf(ch);
    if (i >= 0) chapters.splice(i, 1);
  };
}

let hud: { chapter: Element | null; index: Element | null; tc: Element | null } | null = null;
let lastName = '';

const pad = (n: number) => String(Math.floor(n)).padStart(2, '0');

/** Timecode at 25 fps, the whole page maps to a 3:00 reel. */
function timecode(progress: number) {
  const total = progress * 180 * 25;
  const f = total % 25;
  const s = Math.floor(total / 25);
  return `00:${pad(s / 60)}:${pad(s % 60)}:${pad(f)}`;
}

export function tick() {
  const vh = window.innerHeight;
  let active: Chapter | null = null;
  let activeIndex = 0;

  chapters.forEach((ch, i) => {
    const r = ch.el.getBoundingClientRect();
    const h = r.height;
    const p = range(vh - r.top, 0, h);
    const local = range(-r.top, 0, Math.max(1, h - vh));
    const onScreen = r.top < vh && r.bottom > 0;

    // The chapter whose section covers the bottom edge of the viewport drives.
    if (r.top < vh && r.bottom >= vh - 1) {
      active = ch;
      activeIndex = i;
      ch.drive(p, local, ch.el);
    }

    // Hold every reveal until the loader opens, so the hero animates in as it lifts.
    if (!flags.gated && (onScreen || ch.reveals.some((el) => el.classList.contains('is-in')))) {
      for (const el of ch.reveals) {
        const at = Number(el.dataset.at);
        const out = el.dataset.out ? Number(el.dataset.out) : 2;
        el.classList.toggle('is-in', local >= at && local < out);
        el.classList.toggle('is-past', local >= out);
      }
    }
  });

  hud ??= {
    chapter: document.querySelector('[data-hud-chapter]'),
    index: document.querySelector('[data-hud-index]'),
    tc: document.querySelector('[data-hud-tc]'),
  };
  const max = document.documentElement.scrollHeight - vh;
  const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
  document.documentElement.style.setProperty('--progress', progress.toFixed(4));
  if (hud.tc) hud.tc.textContent = timecode(progress);
  const name = (active as Chapter | null)?.name ?? '';
  if (name !== lastName) {
    lastName = name;
    if (hud.chapter) hud.chapter.textContent = name;
    if (hud.index) hud.index.textContent = chapters.length ? `${pad(activeIndex + 1)} / ${pad(chapters.length)}` : '';
  }
}

/** Forget cached HUD nodes (on remount). */
export const resetHud = () => {
  hud = null;
  lastName = '';
};
