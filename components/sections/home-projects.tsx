"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProjectCard } from "@/components/projects/project-card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { useLanguage } from "@/components/providers/providers";
import type { Project } from "@/types/project";

export function HomeProjects() {
  const { t, lang } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch("/api/projects?limit=3")
      .then((r) => r.json())
      .then((j) => {
        setProjects(j.data || []);
        setTotal(j.meta?.total || 0);
      })
      .catch(() => {});
  }, [lang]);

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
          {projects.map((project, idx) => (
            <ScrollReveal key={project.metadata.slug} delay={idx * 0.08} direction="up">
              <ProjectCard project={project} />
            </ScrollReveal>
          ))}
        </div>

        {total > projects.length && (
          <ScrollReveal direction="up" delay={0.15}>
            <div className="mt-12 flex justify-center">
              <Link
                href="/projects"
                className="group flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-6 py-3 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground active:scale-95"
              >
                {t("projects.view_all")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
