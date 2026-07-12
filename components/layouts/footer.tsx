"use client";

import { useLanguage } from "@/components/providers/providers";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="py-8 mt-16">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground mb-14 md:mb-0">
        {t("footer.introduce")} {" "}
        <a
          href={siteConfig.repo || "#"}
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-primary transition-colors"
        >
          GitHub
        </a>
        .
      </div>
    </footer>
  );
}