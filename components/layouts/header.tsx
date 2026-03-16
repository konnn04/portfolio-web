"use client";

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
import { Moon, Sun, Globe } from "lucide-react";
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
  const { setTheme } = useTheme();

  const isHidden = (config.isHiddenUntilScroll && !scrolled) || scrollHidden;

  const hasBackground = config.noBGUntilScroll ? scrolled : true;

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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                {t("theme.light")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                {t("theme.dark")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                {t("theme.system")}
              </DropdownMenuItem>
            </DropdownMenuContent>
           </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
