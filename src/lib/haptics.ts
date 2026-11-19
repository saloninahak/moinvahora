'use client';

/**
 * Haptics for phones.
 *
 * - Android browsers: navigator.vibrate. Browsers only allow it after the
 *   visitor has tapped the page once, so scroll haptics start after the
 *   first tap (any tap: the dock, a link, the page).
 * - iPhone: Safari has no vibrate API. iOS 18+ plays a light system tick
 *   when a native switch toggles, so taps (not scrolling) use that.
 * - Off by default under reduced motion; the visitor can switch it on or
 *   off in the contact panel, and the choice is remembered.
 */

const KEY = 'moin.haptics';
const MIN_GAP_MS = 70;

/**
 * Patterns in ms: [buzz, pause, buzz, ...]. Many Android vibration motors
 * cannot produce a felt pulse under ~20-30 ms, so even the lightest tick is
 * long enough to register; the heavier moments are clearly stronger.
 */
export const Haptic = {
  /** A word struck, a row passing. */
  tick: [24],
  /** A hard cut in the montage. */
  cut: [38],
  /** A new step or stop. */
  step: [45],
  /** Something lands: the stadium, the night, the window settling. */
  land: [80],
  /** Opening into the film: a short rising pulse. */
  rise: [30, 70, 45, 70, 90],
  /** The film closing behind you. */
  fall: [80, 70, 35],
  /** Copied, sent. */
  success: [40, 80, 65],
  /** The test button in the contact panel: long enough to feel on any phone. */
  test: [220],
} as const;

type Pattern = readonly number[];

let enabled: boolean | null = null;
let last = 0;
let primed = false;
let iosSwitch: HTMLLabelElement | null = null;
const seen = new Map<string, number>();

const hasWindow = () => typeof window !== 'undefined';
const canVibrate = () => hasWindow() && typeof navigator.vibrate === 'function';
const isIOS = () => hasWindow() && /iP(hone|ad|od)/.test(navigator.userAgent) && !canVibrate();

/** What this device can do: 'vibrate' (Android), 'tap' (iPhone, taps only) or 'none'. */
export function hapticsSupport(): 'vibrate' | 'tap' | 'none' {
  if (canVibrate() && window.matchMedia('(pointer: coarse)').matches) return 'vibrate';
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
}

/** Forget per-section state (on page change), so a return visit starts clean. */
export const resetHaptics = () => seen.clear();

function activated() {
  const ua = (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation;
  return ua ? ua.hasBeenActive : primed;
}

function iosTick() {
  if (!iosSwitch) {
    const label = document.createElement('label');
    label.setAttribute('aria-hidden', 'true');
    label.style.cssText = 'position:fixed;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.setAttribute('switch', '');
    input.tabIndex = -1;
    label.appendChild(input);
    document.body.appendChild(label);
    iosSwitch = label;
  }
  iosSwitch.click();
}

/**
 * Play a pattern. `gesture: true` when called from a tap handler, which also
 * lets iPhones play their tap tick.
 */
export function buzz(pattern: Pattern, opts: { gesture?: boolean } = {}) {
  if (!hasWindow() || !hapticsOn()) return;
  const now = performance.now();
  if (now - last < MIN_GAP_MS) return;
  if (canVibrate()) {
    if (!opts.gesture && !activated()) return;
    last = now;
    navigator.vibrate([...pattern]);
  } else if (opts.gesture && isIOS()) {
    last = now;
    iosTick();
  }
}

/**
 * Test from a tap: one long pulse, ignoring the on/off switch. Returns
 * 'ok' when the browser accepted it, 'blocked' when it refused, 'tap' on
 * iPhone (tap tick only) and 'none' when there is no vibration API.
 */
export function testBuzz(): 'ok' | 'blocked' | 'tap' | 'none' {
  if (!hasWindow()) return 'none';
  if (canVibrate()) return navigator.vibrate([...Haptic.test]) ? 'ok' : 'blocked';
  if (isIOS()) {
    iosTick();
    return 'tap';
  }
  return 'none';
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

// Browsers without navigator.userActivation: remember the first tap.
if (hasWindow()) {
  window.addEventListener(
    'pointerdown',
    () => {
      primed = true;
    },
    { once: true, passive: true },
  );
}
