"use client";

import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useLanguage } from "@/components/providers/providers";
import { format, parseISO } from "date-fns";
import { Calendar, Briefcase, GraduationCap, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface TimelineItem {
  id: string;
  type: "work" | "education";
  title: string | Record<string, string>;
  subtitle: string | Record<string, string>;
  startDate: string; // YYYY-MM
  endDate: string; // YYYY-MM or empty for present
  description?: string | Record<string, string>;
  links?: string[];
}

interface AboutTimelineProps {
  items: TimelineItem[];
  title: string;
  icon: "work" | "education";
}

export function AboutTimeline({ items, title, icon }: AboutTimelineProps) {
  const { lang, t } = useLanguage();

  const getLocalized = (field: string | Record<string, string> | undefined) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[lang] || field.en || Object.values(field)[0];
  };

  const formatTimelineDate = (dateStr: string) => {
    if (!dateStr) return t("about.present");
    try {
      const date = parseISO(`${dateStr}-01`);
      return format(date, "MM/yyyy");
    } catch {
      return dateStr;
    }
  };

  const IconMap = {
    work: Briefcase,
    education: GraduationCap,
  };
  const MainIcon = IconMap[icon];

  return (
    <section className="mb-16">
      <ScrollReveal>
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <MainIcon className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-3xl font-bold tracking-tight">{title}</h3>
        </div>
      </ScrollReveal>

      <div className="relative border-l-2 border-primary/20 ml-6 md:ml-8 space-y-12 pb-4">
        {items.map((item, idx) => (
          <div key={item.id} className="relative pl-8 md:pl-12">
            {/* Timeline Dot */}
            <ScrollReveal 
              delay={idx * 0.15 + 0.1}
              className="absolute -left-[11px] top-1.5 w-5 h-5 rounded-full bg-background border-4 border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] z-10"
            >
               <div />
            </ScrollReveal>

            {/* Content card */}
            <ScrollReveal direction="up" delay={idx * 0.15}>
              <div className="group relative bg-secondary/30 hover:bg-secondary/50 backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-foreground">
                      {getLocalized(item.title)}
                    </h4>
                    <span className="text-lg font-medium text-primary mt-1 inline-block">
                      {getLocalized(item.subtitle)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground bg-background/50 border rounded-full px-3 py-1 w-fit h-fit">
                    <Calendar className="w-4 h-4" />
                    <span>{formatTimelineDate(item.startDate)} — {formatTimelineDate(item.endDate)}</span>
                  </div>
                </div>

                {item.description && (
                  <p className="text-muted-foreground leading-relaxed mt-4">
                     {getLocalized(item.description)}
                  </p>
                )}

                {item.links && item.links.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-5">
                    {item.links.map((url, i) => (
                      <Link 
                        key={i} 
                        href={url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors bg-background border px-3 py-1.5 rounded-full"
                      >
                         {new URL(url).hostname}
                         <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>
        ))}
      </div>
    </section>
  );
}
