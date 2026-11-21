'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as RPointerEvent } from 'react';
import { pauseScroll } from '@/lib/lenis';
import { Haptic, buzz, hapticsOn, hapticsSupport, setHapticsOn, testBuzz } from '@/lib/haptics';
import { story } from '@content/story';

const EVENT = 'moin:contact';

/** Open the contact panel from anywhere (dock, links, the C key). */
export const openContact = () => window.dispatchEvent(new CustomEvent(EVENT));

/**
 * The contact panel. It grows out of the dock as a glass sheet: live studio
 * time, the email with one-tap copy, a three-tap brief builder that writes
 * the email for you, and the links. Esc, the backdrop or a swipe down close
 * it; focus is trapped while open and returned to the opener after.
 */
export function ContactPanel() {
  const c = story.contactPanel;
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [needs, setNeeds] = useState<string[]>([]);
  const [when, setWhen] = useState<string>('');
  const [haptic, setHaptic] = useState(true);
  const [support, setSupport] = useState<'vibrate' | 'tap' | 'none'>('none');
  const sheet = useRef<HTMLElement>(null);
  const clock = useRef<HTMLSpanElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const drag = useRef({ y0: 0, dy: 0, on: false });

  const close = useCallback(() => setOpen(false), []);

  // Open requests from anywhere.
  useEffect(() => {
    const onOpen = () => {
      opener.current = document.activeElement as HTMLElement | null;
      setOpen(true);
    };
    window.addEventListener(EVENT, onOpen);
    setSupport(hapticsSupport());
    setHaptic(hapticsOn());
    return () => window.removeEventListener(EVENT, onOpen);
  }, []);

  // Keyboard: C opens, Esc closes, Tab stays inside.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = t.closest('input, textarea, select, [contenteditable="true"]');
      if (!open && !typing && !e.metaKey && !e.ctrlKey && !e.altKey && e.key.toLowerCase() === 'c') {
        opener.current = document.activeElement as HTMLElement | null;
        setOpen(true);
        return;
      }
      if (!open) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'Tab' && sheet.current) {
        const f = [...sheet.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input')].filter((n) => n.offsetParent !== null);
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  // Open / close side effects: pause the page, move focus, play a haptic.
  useEffect(() => {
    pauseScroll(open);
    if (open) {
      buzz(Haptic.rise, { gesture: true });
      const id = window.setTimeout(() => sheet.current?.querySelector<HTMLElement>('.cp__close')?.focus(), 60);
      return () => window.clearTimeout(id);
    }
    setCopied(false);
    opener.current?.focus?.();
    return undefined;
  }, [open]);

  // Live studio time while open.
  useEffect(() => {
    if (!open) return;
    const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: c.tz, hour: '2-digit', minute: '2-digit', hour12: false });
    const tick = () => {
      if (clock.current) clock.current.textContent = `${c.city} · ${fmt.format(new Date())} IST`;
    };
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, [open, c.city, c.tz]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(c.email);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = c.email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    buzz(Haptic.success, { gesture: true });
    window.setTimeout(() => setCopied(false), 2200);
  };

  const toggleNeed = (n: string) => {
    buzz(Haptic.tick, { gesture: true });
    setNeeds((v) => (v.includes(n) ? v.filter((x) => x !== n) : [...v, n]));
  };

  const pickWhen = (w: string) => {
    buzz(Haptic.tick, { gesture: true });
    setWhen((v) => (v === w ? '' : w));
  };

  const mailto = useMemo(() => {
    const subject = needs.length ? `${c.subject} · ${needs.join(', ')}` : c.subject;
    const body = [
      'Hi Moin,',
      '',
      needs.length ? `I need: ${needs.join(', ')}` : 'I need: ',
      when ? `When: ${when}` : 'When: ',
      '',
      'About the project:',
      '',
    ].join('\n');
    return `mailto:${c.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [needs, when, c.email, c.subject]);

  // Swipe down to close (phones): drag from the grab bar or the header.
  const onDragStart = (e: RPointerEvent) => {
    if (e.pointerType === 'mouse' || (e.target as HTMLElement).closest('button, a, label')) return;
    drag.current = { y0: e.clientY, dy: 0, on: true };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onDragMove = (e: RPointerEvent) => {
    if (!drag.current.on || !sheet.current) return;
    drag.current.dy = Math.max(0, e.clientY - drag.current.y0);
    sheet.current.style.transform = `translateY(${drag.current.dy}px)`;
  };
  const onDragEnd = () => {
    if (!drag.current.on || !sheet.current) return;
    drag.current.on = false;
    sheet.current.style.transform = '';
    if (drag.current.dy > 90) close();
  };

  const toggleHaptics = () => {
    const next = !haptic;
    setHapticsOn(next);
    setHaptic(next);
    if (next) buzz(Haptic.success, { gesture: true });
  };

  const [testNote, setTestNote] = useState('');
  const runTest = () => {
    const r = testBuzz();
    setTestNote(
      r === 'ok'
        ? 'Sent. Nothing? Take the phone off Silent / Do Not Disturb and turn on touch vibration.'
        : r === 'blocked'
          ? 'This browser blocked vibration. Open the site in Chrome.'
          : r === 'tap'
            ? 'iPhone ticks on every tap. Nothing? Settings › Sounds & Haptics › System Haptics.'
            : 'No vibration on this device.',
    );
  };

  return (
    <div className={`cp${open ? ' is-open' : ''}`} aria-hidden={!open}>
      <button type="button" className="cp__scrim" tabIndex={-1} aria-label="Close contact" onClick={close} />
      <section ref={sheet} className="cp__sheet" role="dialog" aria-modal="true" aria-labelledby="cp-title" data-lenis-prevent>
        <div className="cp__grab" onPointerDown={onDragStart} onPointerMove={onDragMove} onPointerUp={onDragEnd} onPointerCancel={onDragEnd} aria-hidden="true">
          <i />
        </div>

        <header className="cp__head" onPointerDown={onDragStart} onPointerMove={onDragMove} onPointerUp={onDragEnd} onPointerCancel={onDragEnd}>
          <span className="cp__status">
            <i className="cp__live" /> {c.status}
          </span>
          <span className="cp__clock" ref={clock} />
          <button type="button" className="cp__close" onClick={close} aria-label="Close contact">
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <h2 id="cp-title" className="cp__title cp__in" style={{ '--k': 1 } as CSSProperties}>
          {c.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>

        <div className="cp__mail cp__in" style={{ '--k': 2 } as CSSProperties}>
          <a href={`mailto:${c.email}`} className="cp__addr">
            {c.email}
          </a>
          <button type="button" className={`cp__copy${copied ? ' is-done' : ''}`} onClick={copy} aria-live="polite">
            {copied ? `✓ ${c.copied}` : c.copy}
          </button>
        </div>

        <div className="cp__brief cp__in" style={{ '--k': 3 } as CSSProperties}>
          <p className="cp__kicker">{c.briefKicker}</p>
          <fieldset className="cp__set">
            <legend>{c.needLabel}</legend>
            <div className="cp__chips">
              {c.needs.map((n) => (
                <button key={n} type="button" className="cp__chip" aria-pressed={needs.includes(n)} onClick={() => toggleNeed(n)}>
                  {n}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="cp__set">
            <legend>{c.whenLabel}</legend>
            <div className="cp__chips">
              {c.whens.map((w) => (
                <button key={w} type="button" className="cp__chip" aria-pressed={when === w} onClick={() => pickWhen(w)}>
                  {w}
                </button>
              ))}
            </div>
          </fieldset>
          <a className={`cp__send${needs.length ? ' is-ready' : ''}`} href={mailto} onClick={() => buzz(Haptic.success, { gesture: true })}>
            <span>{c.send}</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <ul className="cp__links cp__in" style={{ '--k': 4 } as CSSProperties}>
          {c.links.map((l) => (
            <li key={l.label}>
              <a href={l.href} target="_blank" rel="noreferrer">
                {l.label} <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>

        <footer className="cp__foot cp__in" style={{ '--k': 5 } as CSSProperties}>
          {support !== 'none' ? (
            <span className="cp__hap">
              <label className="cp__toggle">
                <input type="checkbox" role="switch" {...{ switch: '' }} checked={haptic} onChange={toggleHaptics} />
                <span className="cp__track" aria-hidden="true">
                  <i />
                </span>
                {c.haptics}
              </label>
              <button type="button" className="cp__test" onClick={runTest}>
                Test
              </button>
            </span>
          ) : (
            <span />
          )}
          <span className="cp__hint">{c.hint}</span>
        </footer>
        {testNote ? (
          <p className="cp__note" role="status">
            {testNote}
          </p>
        ) : null}
      </section>
    </div>
  );
}
