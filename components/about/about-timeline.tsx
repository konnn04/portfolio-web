"use client";

import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useLanguage } from "@/components/providers/providers";
import { format, parseISO } from "date-fns";
import { Calendar, Briefcase, GraduationCap, ArrowUpRight, Award, ChevronRight, FileBadge } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Activity {
  id: string;
  name: string | Record<string, string>;
  description?: string | Record<string, string>;
  startDate: string;
  endDate: string;
  links?: string[];
}

interface TimelineItem {
  id: string;
  type: "work" | "education" | "certificate";
  title: string | Record<string, string>;
  subtitle: string | Record<string, string>;
  startDate: string; // YYYY-MM
  endDate?: string | undefined; // YYYY-MM or empty for present
  description?: string | Record<string, string>;
  links?: string[];
  gpa?: string;
  activities?: Activity[];
}

interface AboutTimelineProps {
  items: TimelineItem[];
  title: string;
  icon: "work" | "education" | "certificate";
}

export function AboutTimeline({ items, title, icon }: AboutTimelineProps) {
  const { lang, t } = useLanguage();

  const getLocalized = (field: string | Record<string, string> | undefined) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[lang] || field.en || Object.values(field)[0];
  };

  const formatTimelineDate = (dateStr: string | undefined) => {
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
    certificate: FileBadge,
  };
  const MainIcon = IconMap[icon];

  return (
    <section className="mb-16 w-full">
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
            <ScrollReveal direction="up" delay={idx * 0.15} className="w-full">
              <motion.div 
                whileHover={{ y: -5 }}
                className="group relative bg-secondary/30 hover:bg-secondary/50 backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 w-full"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-foreground">
                      {getLocalized(item.title)}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      <span className="text-lg font-medium text-primary inline-block">
                        {getLocalized(item.subtitle)}
                      </span>
                      {item.gpa && (
                        <div className="flex items-center gap-1.5 bg-accent/20 text-accent-foreground font-semibold px-2.5 py-0.5 rounded-full text-sm border border-accent/30">
                          <Award className="w-4 h-4" />
                          <span>{t("about.gpa")}: {item.gpa}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground bg-background/80 border rounded-full px-4 py-1.5 w-fit h-fit shadow-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{item.type === 'certificate' ? formatTimelineDate(item.startDate) : `${formatTimelineDate(item.startDate)} — ${formatTimelineDate(item.endDate)}`}</span>
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
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 transition-colors bg-background border px-4 py-1.5 rounded-full shadow-sm"
                      >
                         {new URL(url).hostname}
                         <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    ))}
                  </div>
                )}
                
                {/* Nested Activities Timeline */}
                {item.activities && item.activities.length > 0 && (
                   <div className="mt-8 pt-6 border-t border-primary/10 space-y-6">
                      <h5 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 ml-1">Activities & Honors</h5>
                      <div className="relative border-l-2 border-primary/10 ml-4 space-y-8 pb-2">
                        {item.activities.map((act) => (
                           <div key={act.id} className="relative pl-6 group/act">
                              <div className="absolute -left-[7px] top-2 w-3 h-3 rounded-full bg-background border-2 border-primary/50 group-hover/act:bg-primary/50 transition-colors z-10" />
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                                <h6 className="text-base font-semibold text-foreground/90 flex items-center gap-2">
                                  {getLocalized(act.name)}
                                </h6>
                                <span className="text-xs font-medium text-muted-foreground whitespace-nowrap bg-background/50 px-2 py-1 rounded-md border">
                                  {formatTimelineDate(act.startDate)} — {formatTimelineDate(act.endDate)}
                                </span>
                              </div>
                              {act.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {getLocalized(act.description)}
                                </p>
                              )}
                              {act.links && act.links.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {act.links.map((url, i) => (
                                    <Link 
                                      key={i} 
                                      href={url} 
                                      target="_blank" 
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors bg-background/50 border border-primary/10 px-2 py-1 rounded-md"
                                    >
                                      {new URL(url).hostname}
                                      <ChevronRight className="w-3 h-3" />
                                    </Link>
                                  ))}
                                </div>
                              )}
                           </div>
                        ))}
                      </div>
                   </div>
                )}
              </motion.div>
            </ScrollReveal>
          </div>
        ))}
      </div>
    </section>
  );
}
