"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; 
import { useScrollHeader } from "@/hooks/use-scroll-header";
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

const NAV_LINKS = [
  { href: "/", labelKey: "nav.home" },
  { href: "/projects", labelKey: "nav.project" },
  { href: "/blogs", labelKey: "nav.blogs" },
  { href: "/about", labelKey: "nav.about" },
];

export function Header() {
  const pathname = "/" + usePathname().split("/")[1];
  const { config } = useHeader();
  
  const { scrolled, hidden: scrollHidden } = useScrollHeader(50, config.scrollThreshold); 
  const { lang, setLang, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        <div className="flex-1 text-xl font-bold tracking-tighter">
          <Link href="/">
            <Image src="/avatar.jpg" alt="Logo" width={48} height={48} className="inline-block mr-2 rounded-full" />
          </Link>
        </div>

        <nav className="hidden md:flex flex-1 justify-center items-center gap-6 text-sm font-medium">
          {NAV_LINKS.map((link, index) => {
            const isActive = pathname === link.href;
            
            return (
              <div key={link.href} className="flex items-center gap-6">
                {index > 0 && <span className="text-muted-foreground/50 font-normal not-italic">/</span>}
                <Link
                  href={link.href}
                  className={`transition-all duration-200 uppercase ${
                    isActive
                      ? "text-primary font-bold scale-105" 
                      : "text-muted-foreground hover:text-primary hover:font-bold scale-105"
                  }`}
                >
                  {t(link.labelKey)}
                </Link>
              </div>
            );
          })}
        </nav>

        <div className="flex-1 flex justify-end gap-2">
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
