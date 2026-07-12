"use client";

import { useMemo, useState } from "react";
import { Search, X, Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectDetailModal } from "@/components/projects/project-detail-modal";
import { useLanguage } from "@/components/providers/providers";
import { sortProjects } from "@/lib/projects";
import type { Project } from "@/types/project";

interface AllProjectsModalProps {
  projects: Project[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AllProjectsModal({ projects, open, onOpenChange }: AllProjectsModalProps) {
  const { lang, t } = useLanguage();
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [selected, setSelected] = useState<Project | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const p of projects) for (const tag of p.tags) set.add(tag);
    return Array.from(set).sort();
  }, [projects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = projects.filter((p) => {
      const desc = p.description[lang as keyof typeof p.description] || p.description.en;
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        desc.toLowerCase().includes(q) ||
        p.tags.some((tg) => tg.toLowerCase().includes(q)) ||
        p.langs.some((l) => l.toLowerCase().includes(q));
      const matchesTags = activeTags.length === 0 || activeTags.every((tg) => p.tags.includes(tg));
      return matchesQuery && matchesTags;
    });
    return sortProjects(list);
  }, [projects, query, activeTags, lang]);

  const toggleTag = (tag: string) =>
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((tg) => tg !== tag) : [...prev, tag]));

  const openDetail = (project: Project) => {
    setSelected(project);
    setDetailOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton
          className="flex h-[92vh] w-[96vw] max-w-[96vw] flex-col gap-0 overflow-hidden p-0 sm:max-w-[96vw]"
        >
          <DialogHeader className="border-b px-6 py-5">
            <DialogTitle className="text-2xl font-extrabold tracking-tight">
              {t("projects.title")}
            </DialogTitle>
            <DialogDescription>{t("projects.description")}</DialogDescription>

            {/* Search + tag filter */}
            <div className="mt-4 flex flex-col gap-3">
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
          </DialogHeader>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {filtered.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((project) => (
                  <ProjectCard key={project.slug} project={project} onClick={() => openDetail(project)} />
                ))}
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center py-20 text-center">
                <p className="text-lg font-semibold">{t("projects.no_results_title")}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t("projects.no_results_desc")}</p>
              </div>
            )}
          </div>

          <div className="border-t px-6 py-3 text-center text-xs text-muted-foreground">
            {filtered.length} / {projects.length}
          </div>
        </DialogContent>
      </Dialog>

      <ProjectDetailModal project={selected} open={detailOpen} onOpenChange={setDetailOpen} />
    </>
  );
}
