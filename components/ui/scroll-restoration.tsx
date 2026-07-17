"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Scrolls to the top of the page whenever the route (pathname) changes, e.g.
 * navigating from the projects list into a project detail page. Skips the
 * very first mount and any hash-only navigation on the same path (the home
 * page handles #section scrolling itself).
 */
export function ScrollRestoration() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
