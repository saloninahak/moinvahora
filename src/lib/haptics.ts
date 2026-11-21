'use client';

/**
 * Haptics for phones.
 *
 * - Android (Chrome, Samsung Internet, Edge): navigator.vibrate. Chrome
 *   blocks it until the visitor has tapped the page once; a scroll does not
 *   count as a tap. The loader asks for one tap on touch phones, and a small
 *   hint asks again when the loader is skipped (see HapticGate).
 * - iPhone: Safari has no vibrate API. The only haptic a page can play is
 *   the system tick of a native <input switch>, and since iOS 26.5 only when
 *   the visitor's own tap lands on a label for it. HapticTaps lays such a
 *   label over every button and link, so every tap ticks. Scrolling can't.
 * - Off by default under reduced motion; the visitor can switch it on or
 *   off in the contact panel, and the choice is remembered.
 */

const KEY = 'moin.haptics';
const MIN_GAP_MS = 85;
/** Fired on window when the visitor turns haptics on or off. */
export const HAPTICS_EVENT = 'moin:haptics';

/**
 * Patterns in ms: [buzz, pause, buzz, ...]. The web can only set duration,
 * not motor strength (the phone's intensity setting decides that), so the
 * pulses are deliberately long and punchy: even the lightest tick is felt
 * clearly, and the big moments hit hard.
 */
export const Haptic = {
  /** A word struck, a row passing, a tap. */
  tick: [45],
  /** A hard cut in the montage: a punch. */
  cut: [75],
  /** A new step or stop. */
  step: [80],
  /** Something lands: the stadium, the night, touchdown. */
  land: [170],
  /** Opening into the film: a rising triple hit. */
  rise: [60, 50, 100, 50, 200],
  /** The film closing behind you: heavy, then fading. */
  fall: [170, 60, 70],
  /** Copied, sent: a double knock. */
  success: [80, 70, 140],
  /** The test button in the contact panel: unmistakable on any phone. */
  test: [450],
} as const;

type Pattern = readonly number[];

let enabled: boolean | null = null;
let last = 0;
let primed = false;
const seen = new Map<string, number>();

const hasWindow = () => typeof window !== 'undefined';
export const canVibrate = () => hasWindow() && typeof navigator.vibrate === 'function';
const touch = () => hasWindow() && window.matchMedia('(pointer: coarse)').matches;

/** iPhone / iPad (iPadOS reports itself as a Mac with touch). */
export function isIOS() {
  if (!hasWindow() || canVibrate()) return false;
  const ua = navigator.userAgent;
  return /iP(hone|ad|od)/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
}

/** What this device can do: 'vibrate' (Android), 'tap' (iPhone, taps only) or 'none'. */
export function hapticsSupport(): 'vibrate' | 'tap' | 'none' {
  if (canVibrate() && touch()) return 'vibrate';
  if (isIOS()) return 'tap';
  return 'none';
}

export function hapticsOn(): boolean {
  if (enabled !== null) return enabled;
  if (!hasWindow()) return false;
  try {
    const v = localStorage.getItem(KEY);
    if (v === '1' || v === '0') return (enabled = v === '1');
  } catch {
    /* private mode */
  }
  return (enabled = !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}

export function setHapticsOn(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(KEY, on ? '1' : '0');
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(HAPTICS_EVENT));
}

/** Forget per-section state (on page change), so a return visit starts clean. */
export const resetHaptics = () => seen.clear();

/** Whether the browser will accept a vibration now (the page has had a tap). */
export function vibrationUnlocked() {
  const ua = (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation;
  return ua ? ua.hasBeenActive : primed;
}

/** Android phone with haptics on that still needs its first tap. */
export function needsFirstTap() {
  return hasWindow() && hapticsOn() && hapticsSupport() === 'vibrate' && !vibrationUnlocked();
}

/**
 * Play a pattern on Android. `gesture: true` when called from a tap handler.
 * On iPhone this does nothing: the tap itself ticks through HapticTaps.
 */
export function buzz(pattern: Pattern, opts: { gesture?: boolean } = {}) {
  if (!hasWindow() || !hapticsOn() || !canVibrate()) return;
  if (!opts.gesture && !vibrationUnlocked()) return;
  const now = performance.now();
  if (now - last < MIN_GAP_MS) return;
  last = now;
  try {
    navigator.vibrate([...pattern]);
  } catch {
    /* never worth an exception */
  }
}

/**
 * Test from a tap: one long pulse, ignoring the on/off switch. Returns
 * 'ok' when the browser accepted it, 'blocked' when it refused, 'tap' on
 * iPhone (the tap on the button ticks) and 'none' with no vibration at all.
 */
export function testBuzz(): 'ok' | 'blocked' | 'tap' | 'none' {
  if (!hasWindow()) return 'none';
  if (canVibrate()) {
    try {
      return navigator.vibrate([...Haptic.test]) ? 'ok' : 'blocked';
    } catch {
      return 'blocked';
    }
  }
  return isIOS() ? 'tap' : 'none';
}

/**
 * Fire `pattern` when a section's value changes (a new cut, step or row).
 * The first reading is stored silently; negative values mean "not active"
 * and never fire, so leaving a section is quiet.
 */
export function hapticOnChange(key: string, value: number, pattern: Pattern) {
  const prev = seen.get(key);
  seen.set(key, value);
  if (prev === undefined || prev === value || value < 0) return;
  buzz(pattern);
}

// Browsers without navigator.userActivation: remember the first real tap.
if (hasWindow()) {
  const prime = () => {
    primed = true;
  };
  window.addEventListener('pointerup', prime, { once: true, passive: true });
  window.addEventListener('keydown', prime, { once: true, passive: true });
}
