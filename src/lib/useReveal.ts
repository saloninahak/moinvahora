'use client';

import { useEffect, type RefObject } from 'react';

/**
 * For normal-flow pages (index, case studies): add .is-in to every
 * [data-reveal] inside `root` once it scrolls into view. Uses the same
 * .rv / .rv--fade styles as the pinned chapters. Re-scans when `key` changes
 * (e.g. after filtering a list).
 */
export function useReveal(root: RefObject<HTMLElement | null>, key: unknown = 0) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
    );
    el.querySelectorAll('[data-reveal]:not(.is-in)').forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [root, key]);
}
