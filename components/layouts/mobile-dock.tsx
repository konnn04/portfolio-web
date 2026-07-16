"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/providers/providers";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { Home, Mail, BookOpen, FolderGit2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LINKS = [
  { key: "sections.home", icon: Home, href: "/#home", section: "home" as const },
  { key: "sections.projects", icon: FolderGit2, href: "/projects", section: null },
  { key: "nav.blogs", icon: BookOpen, href: "/blogs", section: null },
  { key: "sections.contact", icon: Mail, href: "/#contact", section: "contact" as const },
];

export function MobileDock() {
  const pathname = "/" + usePathname().split("/")[1];
  const isHome = pathname === "/";
  const { t } = useLanguage();
  const activeSection = useScrollSpy(["contact"], isHome);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-0 left-1/2 z-10 w-full -translate-x-1/2 md:hidden">
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: 80, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="pointer-events-auto mx-auto mb-3 flex w-max items-center gap-1 rounded-full border border-border bg-background/80 p-1.5 shadow-2xl backdrop-blur-xl"
          >
            {LINKS.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.section === "home"
                  ? isHome && activeSection !== "contact"
                  : link.section === "contact"
                    ? isHome && activeSection === "contact"
                    : pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex h-11 w-11 flex-col items-center justify-center rounded-full transition-all duration-300 ${
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="mobile-dock-active"
                      className="absolute inset-0 rounded-full bg-primary/10"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                  <Icon className={`z-10 h-4 w-4 transition-transform duration-300 ${isActive ? "scale-110" : "scale-100"}`} />
                  <span className="z-10 mt-0.5 text-[8px] font-medium leading-none">{t(link.key)}</span>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
