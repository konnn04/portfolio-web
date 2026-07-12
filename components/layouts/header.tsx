"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useScrollHeader } from "@/hooks/use-scroll-header";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { useHeader } from "@/components/providers/header-provider";
import { useLanguage } from "@/components/providers/providers";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, Globe, Monitor } from "lucide-react";
import Image from "next/image";

export function Header() {
  const pathname = "/" + usePathname().split("/")[1];
  const isHome = pathname === "/";
  const { config } = useHeader();

  const { scrolled, hidden: scrollHidden } = useScrollHeader(50, config.scrollThreshold);
  const { lang, setLang, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const activeSection = useScrollSpy(["contact"], isHome);
  const contactActive = isHome && activeSection === "contact";
  const blogActive = pathname === "/blogs";

  const navLinks = [
    { href: "/#home", label: t("sections.home"), active: isHome && !contactActive },
    { href: "/#contact", label: t("sections.contact"), active: contactActive },
    { href: "/blogs", label: t("nav.blogs"), active: blogActive },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const isHidden = (config.isHiddenUntilScroll && !scrolled) || scrollHidden;
  const hasBackground = config.noBGUntilScroll ? scrolled : true;

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isHidden ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
      } ${
        hasBackground
          ? "bg-background/80 backdrop-blur-md shadow-sm"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4">
        <Link href="/#home" className="shrink-0">
          <Image src="/avatar.jpg" alt="Logo" width={44} height={44} className="rounded-full" />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-x-8 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`uppercase tracking-wide transition-all duration-200 ${
                link.active
                  ? "font-bold text-primary"
                  : "text-muted-foreground hover:font-semibold hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 justify-end gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Toggle language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLang("vi")}>
                Tiếng Việt {lang === "vi" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLang("en")}>
                English {lang === "en" && "✓"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" onClick={cycleTheme} title="Toggle theme">
            {mounted ? (
              <>
                {theme === "light" && <Sun className="h-[1.2rem] w-[1.2rem]" />}
                {theme === "dark" && <Moon className="h-[1.2rem] w-[1.2rem]" />}
                {theme === "system" && <Monitor className="h-[1.2rem] w-[1.2rem]" />}
              </>
            ) : (
              <span className="h-[1.2rem] w-[1.2rem]"></span>
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
