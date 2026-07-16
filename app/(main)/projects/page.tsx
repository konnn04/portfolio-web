"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X, Filter } from "lucide-react";
import { ProjectCard } from "@/components/projects/project-card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useHeader } from "@/components/providers/header-provider";
import { useLanguage } from "@/components/providers/providers";
import type { Project } from "@/types/project";

export default function ProjectsPage() {
  const { t } = useLanguage();
  const { setConfig } = useHeader();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  useEffect(() => {
    setConfig({ isHiddenUntilScroll: false, noBGUntilScroll: false });
  }, [setConfig]);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((j) => setProjects(j.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const p of projects) for (const tag of p.metadata.tags) set.add(tag);
    return Array.from(set).sort();
  }, [projects]);

  // API returns sorted (pinned, recent); filtering preserves that order.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      const md = p.metadata;
      const matchesQuery =
        !q ||
        md.title.toLowerCase().includes(q) ||
        md.description.toLowerCase().includes(q) ||
        md.tags.some((tg) => tg.toLowerCase().includes(q)) ||
        md.langs.some((l) => l.toLowerCase().includes(q));
      const matchesTags = activeTags.length === 0 || activeTags.every((tg) => md.tags.includes(tg));
      return matchesQuery && matchesTags;
    });
  }, [projects, query, activeTags]);

  const toggleTag = (tag: string) =>
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((tg) => tg !== tag) : [...prev, tag]));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <ScrollReveal>
        <div className="mb-8 space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">{t("projects.title")}</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">{t("projects.description")}</p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <div className="mb-10 flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("projects.search_placeholder")}
              className="w-full rounded-full border bg-background py-2.5 pl-10 pr-10 text-sm outline-none transition-colors focus:border-primary"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {allTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              {allTags.map((tag) => {
                const active = activeTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-primary"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
              {activeTags.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTags([])}
                  className="text-xs font-medium text-primary underline-offset-2 hover:underline"
                >
                  {t("projects.clear_filters")}
                </button>
              )}
            </div>
          )}
        </div>
      </ScrollReveal>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-[320px] animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, idx) => (
            <ScrollReveal key={project.metadata.slug} delay={idx * 0.05} direction="up">
              <ProjectCard project={project} />
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed bg-muted/30 py-20 text-center">
          <p className="text-lg font-semibold">{t("projects.no_results_title")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("projects.no_results_desc")}</p>
        </div>
      )}

      {!loading && (
        <p className="mt-8 text-center text-xs text-muted-foreground">
          {filtered.length} / {projects.length}
        </p>
      )}
    </div>
  );
}
