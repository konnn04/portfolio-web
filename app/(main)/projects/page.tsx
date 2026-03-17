"use client";

import { useState, useEffect } from "react";
import projects from "@/configs/data/my-projects.json";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectDetailModal } from "@/components/projects/project-detail-modal";
import { useLanguage } from "@/components/providers/providers";
import type { Project } from "@/types/project";
import { useHeader } from "@/components/providers/header-provider";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export default function ProjectsPage() {
  const { t } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { setConfig } = useHeader();

  const handleOpenProject = (project: Project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  useEffect(() => {
    setConfig({ isHiddenUntilScroll: false, noBGUntilScroll: false });
  }, [setConfig]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ScrollReveal>
        <div className="space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            {t("projects.title")}
          </h1>
          <p className="text-lg text-muted-foreground w-full max-w-2xl">
            {t("projects.description")}
          </p>
        </div>
      </ScrollReveal>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(projects as Project[]).map((project, idx) => (
          <ScrollReveal key={project.slug} delay={idx * 0.1} direction="up">
            <ProjectCard
              project={project}
              onClick={() => handleOpenProject(project)}
            />
          </ScrollReveal>
        ))}
      </div>

      <ProjectDetailModal
        project={selectedProject}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
