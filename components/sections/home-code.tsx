"use client";

import { useEffect, useMemo, useState } from "react";
import { FolderGit2, Users, Star, GitCommitHorizontal, Github, Loader2, AlertCircle, Trophy, Crown, Medal, Award } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useLanguage } from "@/components/providers/providers";
import { siteConfig } from "@/lib/site-config";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  LabelList,
} from "recharts";

interface CodeData {
  stats: { repos: number; followers: number; stars: number; contributions: number };
  languages: { name: string; count: number; pct: number }[];
  days: { date: string; count: number; level: number }[];
}

const LEVEL_CLS = [
  "border border-border/70",
  "commit-cube bg-brand/30",
  "commit-cube bg-brand/55",
  "commit-cube bg-brand/80",
  "commit-cube bg-brand",
];

function StatCard({ icon: Icon, value, label }: { icon: React.ElementType; value: number; label: string }) {
  return (
    <div className="card-3d flex flex-col gap-1 rounded-xl border bg-card/60 p-4 backdrop-blur-sm">
      <Icon className="h-5 w-5 text-brand" />
      <span className="mt-1 text-2xl font-bold tabular-nums tracking-tight">{value.toLocaleString()}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

interface WireframeBarShapeProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
}

function WireframeBarShape(props: WireframeBarShapeProps) {
  const { x = 0, y = 0, width = 0, height = 0, fill = "currentColor" } = props;
  if (width <= 0 || height <= 0) return null;

  const gap = 4;

  return (
    <g className="transition-all duration-300 hover:opacity-80">
      <circle cx={x} cy={y} r={2} fill={fill} />
      <circle cx={x + width} cy={y} r={2} fill={fill} />
      <circle cx={x} cy={y + height} r={2} fill={fill} />
      <circle cx={x + width} cy={y + height} r={2} fill={fill} />

      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="none"
        stroke={fill}
        strokeWidth={1.5}
        rx={2}
        ry={2}
      />

      <line
        x1={x + width}
        y1={y}
        x2={x + width + gap}
        y2={y - gap}
        stroke={fill}
        strokeWidth={1}
        opacity={0.6}
      />
      <line
        x1={x + width + gap}
        y1={y - gap}
        x2={x + gap}
        y2={y - gap}
        stroke={fill}
        strokeWidth={1}
        strokeDasharray="2 2"
        opacity={0.4}
      />
    </g>
  );
}

export function HomeCodeStats() {
  const { t } = useLanguage();
  const [data, setData] = useState<CodeData | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/github-stats")
      .then((r) => r.json())
      .then((j) => {
        if (!alive) return;
        if (j.success && j.data) {
          setData(j.data);
          setStatus("ok");
        } else setStatus("error");
      })
      .catch(() => alive && setStatus("error"));

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      alive = false;
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const cells = useMemo(() => {
    if (!data?.days?.length) return [];
    const first = new Date(data.days[0].date).getDay();
    return [...Array(first).fill(null), ...data.days] as (CodeData["days"][number] | null)[];
  }, [data]);

  const chartData = useMemo(() => {
    if (!data?.languages?.length) return [];
    const maxPct = Math.max(...data.languages.map(l => l.pct));
    return data.languages.map(l => ({
      ...l,
      normalizedPct: maxPct > 0 ? Math.round((l.pct / maxPct) * 100) : 0,
    }));
  }, [data]);

  if (!siteConfig.features.github) return null;

  return (
    <section id="code" className="relative w-full scroll-mt-20 py-24 md:py-32">
      <div className="container mx-auto max-w-5xl px-4 md:px-6">
        <SectionHeading index="05" kicker={t("sections.code")} title={t("code.title")} subtitle={t("code.subtitle")} />

        <ScrollReveal direction="up">
          <div className="card-3d rounded-3xl border bg-card/40 p-6 backdrop-blur-md md:p-8">
            {status === "loading" && (
              <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" /> <Github className="h-5 w-5" />
              </div>
            )}

            {status === "error" && (
              <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" /> {t("code.unavailable")}
              </div>
            )}

            {status === "ok" && data && (
              <div className="flex flex-col gap-8">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <StatCard icon={FolderGit2} value={data.stats.repos} label={t("code.repos")} />
                  <StatCard icon={Users} value={data.stats.followers} label={t("code.followers")} />
                  <StatCard icon={Star} value={data.stats.stars} label={t("code.stars")} />
                  <StatCard icon={GitCommitHorizontal} value={data.stats.contributions} label={t("code.contributions")} />
                </div>

                {cells.length > 0 && (
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">{t("code.commit_grid")}</span>
                      <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        {t("code.less")}
                        {LEVEL_CLS.map((cls, i) => (
                          <span key={i} className={`h-[10px] w-[10px] rounded-[2px] ${cls}`} />
                        ))}
                        {t("code.more")}
                      </span>
                    </div>
                    <div className="overflow-x-auto pb-1">
                      <div className="grid grid-flow-col grid-rows-7 gap-[3px]" style={{ width: "max-content" }}>
                        {cells.map((d, i) =>
                          d ? (
                            <span
                              key={i}
                              title={`${d.date}: ${d.count}`}
                              className={`h-[11px] w-[11px] rounded-[2px] ${LEVEL_CLS[d.level] || LEVEL_CLS[0]}`}
                            />
                          ) : (
                            <span key={i} className="h-[11px] w-[11px]" />
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {chartData.length > 0 && (
                  <div>
                    <span className="mb-4 block font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                      <Trophy className="mr-1.5 inline-block h-3.5 w-3.5 text-amber-500" />
                      {t("code.top_langs")}
                    </span>

                    <div className="rounded-xl border bg-card/40 p-4 backdrop-blur-sm">
                      <ResponsiveContainer width="100%" height={chartData.length * 52 + 24}>
                        <BarChart
                          data={chartData}
                          layout="vertical"
                          margin={{ top: 10, right: 15, bottom: 10, left: isMobile ? 10 : 20 }}
                          barSize={16}
                        >
                          <XAxis type="number" hide domain={[0, 100]} />
                          <YAxis
                            type="category"
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            width={isMobile ? 90 : 120}
                            tick={(tickProps) => {
                              const { x, y, payload, index } = tickProps;
                              const rank = (index ?? 0) + 1;
                              const RankIcon = rank === 1 ? Crown : rank === 2 ? Medal : rank === 3 ? Award : null;

                              return (
                                <g transform={`translate(${x}, ${y})`}>
                                  <foreignObject
                                    x={isMobile ? -95 : -120}
                                    y={-12}
                                    width={isMobile ? 100 : 115}
                                    height={24}
                                    style={{ overflow: "visible" }}
                                  >
                                    <div className="flex h-full items-center justify-end gap-1.5 pr-2">
                                      {RankIcon ? (
                                        <RankIcon
                                          className={`h-3.5 w-3.5 shrink-0 ${rank === 1
                                              ? "text-amber-400"
                                              : rank === 2
                                                ? "text-slate-400"
                                                : "text-orange-500"
                                            }`}
                                        />
                                      ) : (
                                        <span className="text-[9px] font-bold tabular-nums text-muted-foreground/40 font-mono">
                                          #{rank}
                                        </span>
                                      )}
                                      <span className="truncate font-mono text-[11px] sm:text-xs font-semibold text-foreground/90">
                                        {payload.value}
                                      </span>
                                    </div>
                                  </foreignObject>
                                </g>
                              );
                            }}
                          />
                          <Bar
                            dataKey="normalizedPct"
                            shape={<WireframeBarShape />}
                            isAnimationActive={true}
                            animationDuration={1000}
                          >
                            {chartData.map((_, i) => {
                              const palette = [
                                "#818cf8",
                                "#34d399",
                                "#fbbf24",
                                "#f472b6",
                                "#22d3ee",
                                "#a78bfa",
                              ];
                              return <Cell key={i} fill={palette[i % palette.length]} />;
                            })}

                            { }
                            <LabelList
                              dataKey="normalizedPct"
                              content={(labelProps) => {
                                const { x = 0, y = 0, index } = labelProps;
                                const orig = chartData[index ?? 0]?.pct ?? 0;

                                return (
                                  <g transform={`translate(${Number(x) + 4}, ${Number(y) - 2})`}>
                                    <text
                                      className="font-mono text-[10px] font-bold fill-foreground/60 select-none"
                                      textAnchor="start"
                                    >
                                      {orig}%
                                    </text>
                                  </g>
                                );
                              }}
                            />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}