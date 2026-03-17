"use client";

import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Code2, Layers, Database, Wrench } from "lucide-react";
import { useLanguage } from "@/components/providers/providers";

interface AboutSkillsProps {
  skills: {
    lang: string[];
    frameworks: string[];
    databases: string[];
    tools: string[];
  }
}

export function AboutSkills({ skills }: AboutSkillsProps) {
  const { t } = useLanguage();

  const skillGroups = [
    {
      id: "languages",
      title: "Languages",
      icon: Code2,
      items: skills.lang,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      id: "frameworks",
      title: "Frameworks & Libraries",
      icon: Layers,
      items: skills.frameworks,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20"
    },
    {
      id: "databases",
      title: "Databases",
      icon: Database,
      items: skills.databases,
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500/20"
    },
    {
      id: "tools",
      title: "Tools & DevOps",
      icon: Wrench,
      items: skills.tools,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20"
    }
  ];

  return (
    <section className="mb-16">
      <ScrollReveal>
        <div className="flex items-center justify-center text-center gap-4 mb-12">
          <h3 className="text-3xl font-bold tracking-tight">{t("about.skills")}</h3>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skillGroups.map((group, idx) => {
          const Icon = group.icon;
          return (
            <ScrollReveal key={group.id} delay={idx * 0.1}>
              <div className="h-full bg-secondary/30 backdrop-blur-sm border rounded-2xl p-6 transition-all hover:bg-secondary/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${group.bg} ${group.border} border`}>
                    <Icon className={`w-5 h-5 ${group.color}`} />
                  </div>
                  <h4 className="text-xl font-bold">{group.title}</h4>
                </div>
                
                <div className="flex flex-wrap gap-2.5">
                  {group.items.map((skill, i) => (
                    <span 
                      key={i}
                      className="px-3.5 py-1.5 bg-background border rounded-lg text-sm font-medium hover:border-primary/50 transition-colors cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
