"use client";

import { useLanguage } from "@/components/providers/providers";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useHeader } from "@/components/providers/header-provider";
import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";

import myInfo from "../../../configs/data/my-info.json";
import myProjects from "../../../configs/data/my-projects.json";

import { AboutHero } from "@/components/about/about-hero";
import { AboutTimeline } from "@/components/about/about-timeline";
import { AboutSkills } from "@/components/about/about-skills";
import { ProjectCard } from "@/components/projects/project-card";
import type { Project } from "@/types/project";
import { ProjectDetailModal } from "@/components/projects/project-detail-modal";
import { useState } from "react";

export default function AboutPage() {
  const { t } = useLanguage();
  const { setConfig } = useHeader();
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setConfig({ isHiddenUntilScroll: false, noBGUntilScroll: false });
  }, [setConfig]);

  const { profile } = myInfo;
  
  interface School {
    name: Record<string, string>;
    majors: { name: Record<string, string>; startDate: string; endDate: string; gpa?: string }[];
    activities?: { name: Record<string, string>; startDate: string; endDate: string; description: Record<string, string>; links?: string[] }[];
  }

  interface Exp {
    position: Record<string, string>;
    company: Record<string, string>;
    startDate: string;
    endDate?: string;
    description: Record<string, string>;
    links?: string[];
  }

  interface Cert {
    name: Record<string, string>;
    organization: Record<string, string>;
    issueDate: string;
  }

  // Format education and experience into timeline items
  const educationItems = profile.schools.map((school: School, i: number) => ({
    id: `edu-${i}`,
    type: "education" as const,
    title: school.name,
    subtitle: school.majors[0]?.name,
    startDate: school.majors[0]?.startDate,
    endDate: school.majors[0]?.endDate,
    gpa: school.majors[0]?.gpa,
    activities: school.activities?.map((act, j) => ({
      id: `act-${i}-${j}`,
      name: act.name,
      description: act.description,
      startDate: act.startDate,
      endDate: act.endDate,
      links: act.links
    }))
  }));

  const experienceItems = profile.experiences.map((exp: Exp, i: number) => ({
    id: `exp-${i}`,
    type: "work" as const,
    title: exp.position,
    subtitle: exp.company,
    startDate: exp.startDate,
    endDate: exp.endDate,
    description: exp.description,
    links: exp.links
  }));

  const certificateItems = profile.certificates?.map((cert: Cert, i: number) => ({
    id: `cert-${i}`,
    type: "certificate" as const,
    title: cert.name,
    subtitle: cert.organization,
    startDate: cert.issueDate,
    endDate: "", 
  })) || [];

  const topProjects = (myProjects as Project[])
    .filter(p => p.pinned)
    .sort((a, b) => new Date(b.joinAt).getTime() - new Date(a.joinAt).getTime())
    .slice(0, 3);

  const handleOpenProject = (project: Project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AboutHero profile={profile} />
      
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col gap-24">
        
        {/* Timeline Section */}
        <div className="flex flex-col gap-20">
          <AboutTimeline items={experienceItems} title={t("about.experience")} icon="work" />
          <AboutTimeline items={educationItems} title={t("about.education")} icon="education" />
          {certificateItems.length > 0 && (
            <AboutTimeline items={certificateItems} title={t("about.certificates")} icon="certificate" />
          )}
        </div>

        {/* Skills Section */}
        <AboutSkills skills={profile.skills} />

        {/* Featured Projects Section */}
        <section className="mb-20">
          <ScrollReveal>
             <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
                <h3 className="text-3xl font-bold tracking-tight">{t("about.featured_projects")}</h3>
                <Link 
                  href="/projects" 
                  className="group flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                   {t("about.view_all_projects")}
                   <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
             </div>
          </ScrollReveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {topProjects.map((project, idx) => (
              <ScrollReveal key={project.slug} delay={idx * 0.1} direction="up">
                <ProjectCard
                  project={project}
                  onClick={() => handleOpenProject(project)}
                />
              </ScrollReveal>
            ))}
          </div>
          
          <ScrollReveal direction="up" delay={0.2}>
            <div className="mt-20 flex flex-col items-center justify-center text-center border-t border-border/50 pt-16">
              <h3 className="text-2xl font-bold mb-4">{t("about.donate_cta_title")}</h3>
              <p className="text-muted-foreground max-w-lg mb-8 text-balance">
                {t("about.donate_cta_description")}
              </p>
              <Link 
                href="/donate" 
                className="group relative px-8 py-4 rounded-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-bold border border-red-500/30 overflow-hidden transition-all duration-300 shadow-[0_0_20px_rgba(239,68,68,0.2)] flex items-center gap-3 active:scale-95"
              >
                <Heart className="w-5 h-5 animate-pulse" />
                <span>{t("about.donate_cta_button")}</span>
              </Link>
            </div>
          </ScrollReveal>

          <ProjectDetailModal
            project={selectedProject}
            open={modalOpen}
            onOpenChange={setModalOpen}
          />
        </section>

      </div>
    </div>
  );
}
