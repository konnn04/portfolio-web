"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which of the given section ids is currently centered in the viewport.
 * Returns the active id (or null). Pass enabled=false to disable (e.g. off the home page).
 */
export function useScrollSpy(ids: string[], enabled: boolean): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    // Keep a live map of currently-intersecting sections + their ratio so we
    // can always resolve the *best* one — and, crucially, fall back to null
    // when nothing is on screen (e.g. after "scroll to top" leaves Contact).
    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) ratios.set(e.target.id, e.intersectionRatio);
          else ratios.delete(e.target.id);
        }
        let best: string | null = null;
        let bestRatio = -1;
        for (const [id, r] of ratios) {
          if (r > bestRatio) {
            bestRatio = r;
            best = id;
          }
        }
        setActive(best);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.2, 0.5] },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [ids, enabled]);

  return active;
}
