'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const OUT_MS = 360;

/**
 * Smooth page changes for every internal link (header nav, dock, project
 * rows, next project): fade a dark veil in, navigate underneath it, then fade
 * it out on the new page. Links keep working without JS; modified clicks,
 * new-tab links, hashes and external URLs are left alone.
 */
export function PageTransition() {
  const router = useRouter();
  const path = usePathname();
  const busy = useRef(false);

  // Arrived on a new page: lift the veil.
  useEffect(() => {
    const html = document.documentElement;
    busy.current = false;
    const id = requestAnimationFrame(() => html.classList.remove('is-leaving'));
    return () => cancelAnimationFrame(id);
  }, [path]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest('a');
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return; // same page (hash, filter): no veil
      e.preventDefault();
      if (busy.current) return;
      busy.current = true;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      document.documentElement.classList.add('is-leaving');
      window.setTimeout(() => router.push(url.pathname + url.search + url.hash), reduced ? 0 : OUT_MS);
    };
    // Capture phase so we run before Next's Link handler.
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [router]);

  return <div className="veil" aria-hidden="true" />;
}
