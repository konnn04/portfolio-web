"use client";

import { useLanguage } from "@/components/providers/providers";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useHeader } from "@/components/providers/header-provider";
import { useEffect } from "react";
import { User } from "lucide-react";

export default function AboutPage() {
  const { t } = useLanguage();
  const { setConfig } = useHeader();

  useEffect(() => {
    setConfig({ isHiddenUntilScroll: false, noBGUntilScroll: false });
  }, [setConfig]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-[70vh] flex flex-col items-center justify-center text-center">
      <ScrollReveal>
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/20 shadow-sm">
           <User className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
          {t("about.title")}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground w-full max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          {t("about.description")}
        </p>
        
        <div className="flex gap-2 items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse delay-75"></span>
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150"></span>
        </div>
      </ScrollReveal>
    </div>
  );
}
