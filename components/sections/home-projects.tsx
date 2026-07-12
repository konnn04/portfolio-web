"use client";

import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import myProjects from "@/configs/data/my-projects";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectDetailModal } from "@/components/projects/project-detail-modal";
import { AllProjectsModal } from "@/components/projects/all-projects-modal";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { useLanguage } from "@/components/providers/providers";
import { sortProjects } from "@/lib/projects";
import type { Project } from "@/types/project";

const MAX_FEATURED = 3;

export function HomeProjects() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<Project | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [allOpen, setAllOpen] = useState(false);

  const all = myProjects as Project[];
  const featured = useMemo(() => sortProjects(all).slice(0, MAX_FEATURED), [all]);
  const hasMore = all.length > featured.length;

  const openDetail = (project: Project) => {
    setSelected(project);
    setDetailOpen(true);
  };

  return (
    <section id="projects" className="relative w-full scroll-mt-20 py-24 md:py-32">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading
          index="06"
          kicker={t("sections.projects")}
          title={t("about.featured_projects")}
          subtitle={t("projects.description")}
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, idx) => (
            <ScrollReveal key={project.slug} delay={idx * 0.08} direction="up">
              <ProjectCard project={project} onClick={() => openDetail(project)} />
            </ScrollReveal>
          ))}
        </div>

        {hasMore && (
          <ScrollReveal direction="up" delay={0.15}>
            <div className="mt-12 flex justify-center">
              <button
                type="button"
                onClick={() => setAllOpen(true)}
                className="group flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-6 py-3 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground active:scale-95"
              >
                {t("projects.view_all")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </ScrollReveal>
        )}
      </div>

      <ProjectDetailModal project={selected} open={detailOpen} onOpenChange={setDetailOpen} />
      <AllProjectsModal projects={all} open={allOpen} onOpenChange={setAllOpen} />
    </section>
  );
}
