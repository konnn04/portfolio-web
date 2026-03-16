"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; 
import { useLanguage } from "@/components/providers/providers";
import { Home, FolderOpen, BookOpen, User } from "lucide-react";
import { motion } from "framer-motion";

const MOBILE_NAV_LINKS = [
  { href: "/", labelKey: "nav.home", icon: Home },
  { href: "/projects", labelKey: "nav.project", icon: FolderOpen },
  { href: "/blogs", labelKey: "nav.blogs", icon: BookOpen },
  { href: "/about", labelKey: "nav.about", icon: User },
];

export function MobileDock() {
  const pathname = "/" + usePathname().split("/")[1];
  const { t } = useLanguage();

  return (
    <div className="md:hidden fixed bottom-2 left-1/2 -translate-x-1/2 z-50 w-full px-4">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="mx-auto flex items-center justify-around bg-background/80 backdrop-blur-xl border border-border shadow-2xl rounded-full p-2 max-w-sm"
      >
        {MOBILE_NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-dock-active"
                  className="absolute inset-0 bg-primary/10 rounded-full scale-110"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              <Icon className={`w-5 h-5 mb-1 z-10 transition-transform duration-300 ${isActive ? "scale-110" : "scale-100"}`} />
              <span className="text-[10px] font-medium z-10">{t(link.labelKey)}</span>
            </Link>
          );
        })}
      </motion.div>
    </div>
  );
}
