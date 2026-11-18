'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { lerp, range, smooth } from '@/lib/director';
import { register, type Drive } from '@/lib/timeline';

/**
 * A chapter: a tall section with a sticky full-screen stage. `length` is the
 * section height in viewports; the extra beyond 1 is how long it stays pinned.
 * `drive(p, local, el)` runs every frame while the chapter is on screen.
 */
export function Chapter(props: {
  id?: string;
  name: string;
  length: number;
  drive: Drive;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const drive = useRef(props.drive);
  drive.current = props.drive;

  useEffect(() => {
    if (!ref.current) return;
    return register(ref.current, props.name, (p, l, el) => drive.current(p, l, el));
  }, [props.name]);

  return (
    <section
      id={props.id}
      ref={ref}
      className={`ch ${props.className ?? ''}`}
      style={{ '--len': props.length } as CSSProperties}
      aria-label={props.name}
    >
      <div className="ch__stage">{props.children}</div>
    </section>
  );
}

/** Lines that rise out of a mask and pull focus while their element is .is-in. */
export function Lines({
  lines,
  className,
  as: Tag = 'h2',
  at,
  out,
}: {
  lines: readonly string[];
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p';
  at: number;
  out?: number;
}) {
  return (
    <Tag className={`rv ${className ?? ''}`} data-at={at} data-out={out}>
      {lines.map((line, i) => (
        <span className="ln" key={i} style={{ '--i': i } as CSSProperties}>
          <span>{line}</span>
        </span>
      ))}
    </Tag>
  );
}

/** Ease from `from` to `to` while the section scrolls up into view. */
export function enterShot(el: HTMLElement, p: number, from: number, to: number) {
  const e = window.innerHeight / el.offsetHeight;
  return lerp(from, to, smooth(range(p, 0, e)));
}

/** Toggle .is-in / .is-past on [data-item] children for the item on screen. */
export function showItem(el: HTMLElement, index: number, entered: boolean) {
  el.querySelectorAll<HTMLElement>('[data-item]').forEach((node) => {
    const i = Number(node.dataset.item);
    node.classList.toggle('is-in', entered && i === index);
    node.classList.toggle('is-past', entered && i < index);
  });
}

/** Mark children [data-step=n] with .is-on once step >= n (cumulative build). */
export function showSteps(el: HTMLElement, step: number) {
  el.querySelectorAll<HTMLElement>('[data-step]').forEach((node) => {
    const n = Number(node.dataset.step);
    const until = node.dataset.until ? Number(node.dataset.until) : Infinity;
    node.classList.toggle('is-on', step >= n && step < until);
    node.classList.toggle('is-gone', step >= until);
  });
}

/** Set a CSS custom property only when it changes (avoids style churn). */
export function setVar(el: HTMLElement, name: string, value: number, digits = 4) {
  const v = value.toFixed(digits);
  if (el.style.getPropertyValue(name) !== v) el.style.setProperty(name, v);
}
