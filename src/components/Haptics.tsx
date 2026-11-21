'use client';

import { useEffect, useState } from 'react';
import { flags } from '@/lib/timeline';
import { HAPTICS_EVENT, Haptic, buzz, hapticsOn, isIOS, needsFirstTap } from '@/lib/haptics';

const HOSTS = 'a[href], button, [role="button"], summary';
const SKIP = '[data-no-tick], .hx, label, input, select, textarea';

/**
 * iPhone taps. Safari's only page haptic is the tick of a native switch, and
 * since iOS 26.5 only when the visitor's own tap toggles it. So every button
 * and link gets a transparent <label> on top, wired to a hidden switch: the
 * tap lands on the label, the label toggles the switch, the phone ticks.
 *
 * The label then hands the click to its host (host.click()) and stops the
 * original click there. That keeps the tick even when the host's handler
 * cancels the click (Next.js links do, to route without a reload), and links
 * still open: a click on a label inside a link would not follow the link.
 */
export function HapticTaps() {
  useEffect(() => {
    if (!isIOS()) return;

    const arm = (host: HTMLElement) => {
      if (host.matches(SKIP) || host.closest('label') || host.querySelector(':scope > .hx')) return;
      const label = document.createElement('label');
      label.className = 'hx';
      label.setAttribute('aria-hidden', 'true');
      const sw = document.createElement('input');
      sw.type = 'checkbox';
      sw.setAttribute('switch', '');
      sw.tabIndex = -1;
      // The label's forwarded click on the switch must not reach the host a second time.
      sw.addEventListener('click', (e) => e.stopPropagation());
      label.addEventListener('click', (e) => {
        if (e.target !== label) return;
        e.stopPropagation();
        // Haptics off: cancel the toggle (no tick); the host still gets its click.
        if (!hapticsOn()) e.preventDefault();
        host.click();
      });
      label.append(sw);
      if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
      host.append(label);
    };

    let raf = 0;
    const scan = () => {
      raf = 0;
      document.querySelectorAll<HTMLElement>(HOSTS).forEach(arm);
    };
    scan();
    // React re-renders (and route changes) replace nodes: re-arm on the next frame.
    const mo = new MutationObserver(() => {
      if (!raf) raf = requestAnimationFrame(scan);
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}

/**
 * Android: Chrome refuses vibration until the page has had a tap, and a
 * scroll is not a tap. The loader asks for one on first visit; when the
 * loader is skipped (a reload, a direct link), this small hint asks instead
 * and disappears on the first tap anywhere, which also plays a confirming buzz.
 */
export function HapticHint({ label }: { label: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timer = 0;
    const check = () => {
      // Wait while the loader is up: it asks for the tap itself.
      if (flags.gated) {
        timer = window.setTimeout(check, 400);
        return;
      }
      setShow(needsFirstTap());
    };
    timer = window.setTimeout(check, 900);

    const onTap = () => {
      setShow(false);
      // The tap has unlocked vibration by now: confirm it.
      window.setTimeout(() => buzz(Haptic.success, { gesture: true }), 0);
      window.removeEventListener('pointerup', onTap);
    };
    window.addEventListener('pointerup', onTap, { passive: true });
    const onToggle = () => setShow(needsFirstTap());
    window.addEventListener(HAPTICS_EVENT, onToggle);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('pointerup', onTap);
      window.removeEventListener(HAPTICS_EVENT, onToggle);
    };
  }, []);

  return (
    <div className={`hhint${show ? ' is-on' : ''}`} aria-hidden="true">
      <i className="hhint__dot" />
      {label}
    </div>
  );
}
