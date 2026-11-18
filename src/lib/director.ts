/**
 * Target values for the WebGL stage. Chapters write these from scroll
 * progress; the stage eases its live uniforms toward them every frame, so
 * scroll stays smooth even when targets jump.
 */
export type Direction = {
  /** Float index into the page's shots: 2.4 = 40% of the way from shot 2 to shot 3. */
  shot: number;
  /** Analog TV static, 0 to 1. */
  static: number;
  /** Liquid warp strength, 0 to 1. */
  warp: number;
  /** Concentric sound ripples, 0 to 1. */
  pulse: number;
  /** Darkening behind text, 0 to 1. */
  dim: number;
  /** Slow push-in, 1 = none. */
  zoom: number;
  /** Overall exposure, 0 = black. */
  fade: number;
  /** Lens defocus (bokeh), 0 = sharp. */
  focus: number;
  /** 1 = hard cuts: the shot jumps instead of easing and dissolving. */
  cut: number;
  /** Film-burn dissolve strength. 0 = a plain, soft crossfade (calm pages). */
  burn: number;
  /** Colour saturation, 0 = black and white (a scout frame), 1 = graded. */
  sat: number;
  /** How far the film window is open: 0 = closed (normal page), 1 = full screen. */
  win: number;
};

const OPEN: Direction = { shot: 0, static: 0, warp: 0.2, pulse: 0, dim: 0.4, zoom: 1.02, fade: 1, focus: 0, cut: 0, burn: 1, sat: 1, win: 1 };

export const director: Direction = { ...OPEN };

/** Reset targets when a page mounts. `d` overrides the neutral start. */
export const resetDirector = (d: Partial<Direction> = {}) => Object.assign(director, OPEN, d);

/** Write a full set of targets; omitted keys fall back to neutral values. */
export const direct = (d: Partial<Direction>) => Object.assign(director, OPEN, d);

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** 0 to 1 over the [a, b] slice of p. */
export const range = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
export const smooth = (t: number) => t * t * (3 - 2 * t);

/**
 * Walk through `count` shots over progress p, holding on each one and
 * dissolving in the last `blend` fraction of its slot.
 * Returns a float offset 0..count-1 and the index currently on screen.
 */
export function steps(p: number, count: number, blend = 0.45) {
  const x = clamp01(p) * count;
  const i = Math.min(count - 1, Math.floor(x));
  const f = x - i;
  const t = i === count - 1 ? 0 : smooth(range(f, 1 - blend, 1));
  return { value: i + t, index: t > 0.5 ? i + 1 : i };
}
