"use client";

import { useEffect, useState } from "react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useLanguage } from "@/components/providers/providers";
import { format, parseISO } from "date-fns";
import { Briefcase, GraduationCap, ArrowUpRight, Award, ChevronRight, FileBadge } from "lucide-react";
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
  hideHeader?: boolean;
}

export function WireCube({ icon: Icon }: { icon: React.ElementType }) {
  const [rot, setRot] = useState({ x: -20, y: 26 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      setRot({ x: -20 - ny * 16, y: 26 + nx * 26 });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const Z = 28;
  const faceBase =
    "absolute inset-0 border border-brand/50 bg-background/70 backdrop-blur-sm [backface-visibility:hidden]";
  const faces = [
    { t: `translateZ(${Z}px)`, front: true },
    { t: `rotateY(180deg) translateZ(${Z}px)` },
    { t: `rotateY(90deg) translateZ(${Z}px)` },
    { t: `rotateY(-90deg) translateZ(${Z}px)` },
    { t: `rotateX(90deg) translateZ(${Z}px)` },
    { t: `rotateX(-90deg) translateZ(${Z}px)` },
  ];

  return (
    <div className="h-14 w-14 shrink-0 [perspective:640px]">
      <div
        className="relative h-full w-full [transform-style:preserve-3d]"
        style={{ transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`, transition: "transform 120ms linear" }}
      >
        {faces.map((f, i) => (
          <span
            key={i}
            className={`${faceBase} ${f.front ? "flex items-center justify-center" : ""}`}
            style={{ transform: f.t }}
          >
            {f.front && <Icon className="h-6 w-6 text-brand" />}
          </span>
        ))}
      </div>
    </div>
  );
}

export function AboutTimeline({ items, title, icon, hideHeader = false }: AboutTimelineProps) {
  const { lang, t } = useLanguage();

  const getLocalized = (field: string | Record<string, string> | undefined) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[lang] || field.en || Object.values(field)[0];
  };

  const formatTimelineDate = (dateStr: string | undefined) => {
    if (!dateStr) return t("about.present");
    try {
      return format(parseISO(`${dateStr}-01`), "MM/yyyy");
    } catch {
      return dateStr;
    }
  };

  const IconMap = { work: Briefcase, education: GraduationCap, certificate: FileBadge };
  const MainIcon = IconMap[icon];

  return (
    <section className="w-full">
      {!hideHeader && (
        <ScrollReveal>
          <div className="mb-12 flex items-center gap-4">
            <WireCube icon={MainIcon} />
            <h3 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h3>
          </div>
        </ScrollReveal>
      )}

      <div className="relative mx-auto max-w-4xl">
        <span
          aria-hidden
          className="absolute left-[7px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent md:left-1/2"
        />

        <div className="flex flex-col gap-8">
          {items.map((item, idx) => {
            const cardRight = idx % 2 === 0; 
            const dateLabel =
              item.type === "certificate"
                ? formatTimelineDate(item.startDate)
                : `${formatTimelineDate(item.startDate)} — ${formatTimelineDate(item.endDate)}`;

            return (
              <div key={item.id} className="relative md:grid md:grid-cols-2 md:items-start md:gap-10">
                <ScrollReveal
                  delay={idx * 0.12 + 0.05}
                  className="absolute left-0 top-2 z-10 h-3.5 w-3.5 -translate-x-0 rotate-45 border border-brand bg-background shadow-[0_0_10px_var(--brand)] md:left-1/2 md:-translate-x-1/2"
                >
                  <div />
                </ScrollReveal>

                <ScrollReveal
                  direction={cardRight ? "right" : "left"}
                  delay={idx * 0.12}
                  className={`mb-2 pl-8 md:mb-0 md:pl-0 ${
                    cardRight ? "md:col-start-1 md:pr-12 md:text-right" : "md:col-start-2 md:order-2 md:pl-12 md:text-left"
                  }`}
                >
                  <div
                    className={`inline-flex flex-col ${
                      cardRight ? "md:items-end" : "md:items-start"
                    }`}
                  >
                    <span className="font-mono text-sm font-semibold text-brand">{dateLabel}</span>
                    <span className="mt-0.5 text-xs text-muted-foreground">{getLocalized(item.subtitle)}</span>
                  </div>
                </ScrollReveal>

                <ScrollReveal
                  direction="up"
                  delay={idx * 0.12}
                  className={`pl-8 md:pl-0 ${
                    cardRight ? "md:col-start-2 md:pl-12" : "md:col-start-1 md:order-1 md:pr-12"
                  }`}
                >
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="card-3d group relative rounded-xl border bg-secondary/30 p-4 backdrop-blur-sm transition-colors duration-300 hover:border-brand/40 hover:bg-secondary/50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-base font-bold leading-snug text-foreground">{getLocalized(item.title)}</h4>
                      {item.gpa && (
                        <span className="flex shrink-0 items-center gap-1 rounded-full border border-brand/30 bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
                          <Award className="h-3 w-3" />
                          {item.gpa}
                        </span>
                      )}
                    </div>

                    {item.description && (
                      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                        {getLocalized(item.description)}
                      </p>
                    )}

                    {item.links && item.links.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.links.map((url, i) => (
                          <Link
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-full border bg-background px-3 py-1 text-xs font-medium text-foreground transition-colors hover:border-brand/40 hover:text-brand"
                          >
                            {new URL(url).hostname.replace(/^www\./, "")}
                            <ArrowUpRight className="h-3 w-3" />
                          </Link>
                        ))}
                      </div>
                    )}

                    {item.activities && item.activities.length > 0 && (
                      <div className="mt-4 space-y-3 border-t border-border/60 pt-3">
                        {item.activities.map((act) => (
                          <div key={act.id} className="relative pl-3">
                            <span className="absolute left-0 top-1.5 h-1.5 w-1.5 rounded-full bg-brand/60" />
                            <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                              <h6 className="text-sm font-semibold text-foreground/90">{getLocalized(act.name)}</h6>
                              <span className="font-mono text-[10px] text-muted-foreground">
                                {formatTimelineDate(act.startDate)} — {formatTimelineDate(act.endDate)}
                              </span>
                            </div>
                            {act.description && (
                              <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-muted-foreground">
                                {getLocalized(act.description)}
                              </p>
                            )}
                            {act.links && act.links.length > 0 && (
                              <div className="mt-1.5 flex flex-wrap gap-1.5">
                                {act.links.map((url, i) => (
                                  <Link
                                    key={i}
                                    href={url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-brand"
                                  >
                                    {new URL(url).hostname.replace(/^www\./, "")}
                                    <ChevronRight className="h-3 w-3" />
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </ScrollReveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
