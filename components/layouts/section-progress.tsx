"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/components/providers/providers";
import { useScrollSpy } from "@/hooks/use-scroll-spy";

const IDS = ["home", "about", "experience", "certificates", "skills", "code", "projects", "blog", "contact"];

/**
 * Sticky left-edge progress rail: one dot per section, highlights the current
 * one via scroll-spy, click to jump. Stays hidden while the visitor is in the
 * hero and slides in once they scroll into the content. Desktop only.
 */
export function SectionProgress() {
  const pathname = "/" + usePathname().split("/")[1];
  const isHome = pathname === "/";
  const { t } = useLanguage();
  const active = useScrollSpy(IDS, isHome);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setRevealed(window.scrollY > window.innerHeight * 0.55);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  if (!isHome) return null;

  return (
    <AnimatePresence>
      {revealed && (
        <motion.nav
          aria-label="Section progress"
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -14 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-1 lg:flex"
        >
          {/* connecting spine */}
          <span className="absolute left-[4px] top-2 bottom-2 w-px bg-border" aria-hidden />
          {IDS.map((id, i) => {
            const on = active === id || (active === null && i === 0);
            return (
              <Link key={id} href={`/#${id}`} className="group relative flex items-center gap-3 py-1.5" aria-current={on ? "true" : undefined}>
                <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                  <span
                    className={`rounded-full border transition-all duration-300 ${
                      on
                        ? "h-2.5 w-2.5 border-brand bg-brand shadow-[0_0_10px_var(--brand)]"
                        : "h-2 w-2 border-muted-foreground/40 bg-background group-hover:border-brand"
                    }`}
                  />
                </span>
                <span
                  className={`font-mono text-[11px] uppercase tracking-widest transition-all duration-300 ${
                    on
                      ? "translate-x-0 text-brand opacity-100"
                      : "-translate-x-1 text-muted-foreground opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                  }`}
                >
                  {t(`sections.${id}`)}
                </span>
              </Link>
            );
          })}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
