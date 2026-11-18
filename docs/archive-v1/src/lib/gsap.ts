'use client';

/**
 * Single place where GSAP plugins are registered. Every component imports
 * gsap / ScrollTrigger / useGSAP from here, so registration happens once.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/** Media queries shared by every act (used with gsap.matchMedia). */
export const MQ = {
  /** Full cinematic version: motion allowed. */
  motion: '(prefers-reduced-motion: no-preference)',
  /** Desktop and up: horizontal pinning allowed. */
  desktop: '(min-width: 810px) and (prefers-reduced-motion: no-preference)',
  /** Mobile with motion: no horizontal pin. */
  mobile: '(max-width: 809px) and (prefers-reduced-motion: no-preference)',
} as const;

/**
 * Standard pinned-act ScrollTrigger config.
 * `length` is the extra scroll distance in % of the viewport height, so the
 * act occupies roughly (100 + length)vh of scrolling.
 */
export function pinned(trigger: Element, length: number): ScrollTrigger.Vars {
  return {
    trigger,
    start: 'top top',
    end: `+=${length}%`,
    pin: true,
    scrub: 0.6,
    anticipatePin: 1,
    invalidateOnRefresh: true,
  };
}

export { gsap, ScrollTrigger, useGSAP };
