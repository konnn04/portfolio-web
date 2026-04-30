"use client";

import { useLanguage } from "@/components/providers/providers";

export function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="py-8 mt-16">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground mb-14 md:mb-0">
        {t("footer.introduce")} {" "}
        <a
          href="https://github.com/konnn04/portfolio-web"
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