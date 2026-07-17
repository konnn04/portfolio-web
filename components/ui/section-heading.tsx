"use client";

import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ScrambleText } from "@/components/ui/scramble-text";
import { siteConfig } from "@/lib/site-config";

interface SectionHeadingProps {
  index?: string;
  kicker: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}

/**
 * Unified section heading: a monospaced kicker with an index + accent rule,
 * a display-font title, and an optional subtitle. Gives every section a
 * consistent, intentional signature.
 */
export function SectionHeading({ index, kicker, title, subtitle, align = "center" }: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <ScrollReveal>
      <div className={`mb-14 flex flex-col ${centered ? "items-center text-center" : "items-start text-left"}`}>
        <div className="mb-4 flex items-center gap-3">
          {centered && <span className="h-px w-8 bg-gradient-to-r from-transparent to-brand/70" />}
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.35em] text-brand">
            {index && <span className="text-brand/45">{index} — </span>}
            {kicker}
          </span>
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-brand/70" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
          {siteConfig.features.titleScrambleEffect ? <ScrambleText text={title} /> : title}
        </h2>
        {subtitle && (
          <p className={`mt-4 max-w-2xl text-muted-foreground ${centered ? "" : "text-left"}`}>{subtitle}</p>
        )}
      </div>
    </ScrollReveal>
  );
}
