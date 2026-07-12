"use client";

import Image from "next/image";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/providers/providers";
import type { Project } from "@/types/project";
import { Github, ExternalLink, Pin } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const { lang } = useLanguage();
  const thumbnail = project.images?.[0]?.replace(/^public\//, "/");
  const description = project.description[lang as keyof typeof project.description] || project.description.en;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group block h-full w-full cursor-pointer text-left"
    >
      <article className="card-3d relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/50">
        {project.pinned && (
          <span className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full border border-primary/30 bg-background/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary backdrop-blur-md">
            <Pin className="h-3 w-3 fill-primary" />
            Pinned
          </span>
        )}
        {thumbnail ? (
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
            <Image
              src={thumbnail}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        ) : (
          <div className="relative flex aspect-[16/9] w-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
            <span className="text-4xl font-black text-primary/30">{project.title.charAt(0)}</span>
          </div>
        )}
        <div className="p-5 flex flex-col flex-1 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            {project.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="rounded-full text-xs">
                {tag}
              </Badge>
            ))}
            {project.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">+{project.tags.length - 3}</span>
            )}
          </div>
          <h3 className="text-lg font-bold tracking-tight group-hover:text-primary transition-colors line-clamp-1">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{description}</p>
          <div className="mt-auto pt-3 flex items-center justify-between border-t border-border/50">
            <span className="text-xs text-muted-foreground">
              {format(new Date(project.joinAt), "MMM yyyy")}
            </span>
            <div className="flex items-center gap-2">
              {project.github && (
                <Github className="w-4 h-4 text-muted-foreground" />
              )}
              {project.website && (
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>
      </article>
    </button>
  );
}
