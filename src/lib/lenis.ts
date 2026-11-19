import type Lenis from 'lenis';

/** The one Lenis instance, set by SmoothScroll. Null under reduced motion. */
let instance: Lenis | null = null;
/** Whether scrolling is locked (the intro gate). Applied when Lenis appears. */
let locked = false;

export const setLenis = (l: Lenis | null) => {
  instance = l;
  if (l && locked) l.stop();
};

export function lockScroll(on: boolean) {
  locked = on;
  document.documentElement.classList.toggle('is-locked', on);
  if (on) instance?.stop();
  else instance?.start();
}

/** Pause page scrolling under a modal (the contact panel) without hiding the chrome. */
export function pauseScroll(on: boolean) {
  document.documentElement.classList.toggle('is-modal', on);
  if (on) instance?.stop();
  else if (!locked) instance?.start();
}

export const scrollToTarget = (target: string | number) => {
  if (instance) instance.scrollTo(target, { duration: 2.2 });
  else if (typeof target === 'number') window.scrollTo({ top: target });
  else document.querySelector(target)?.scrollIntoView();
};

/** Jump to the top at once (on page change). */
export const resetScroll = () => {
  window.scrollTo(0, 0);
  instance?.scrollTo(0, { immediate: true, force: true });
};
