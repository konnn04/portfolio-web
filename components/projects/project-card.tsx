"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/types/project";
import { Github, ExternalLink, Pin } from "lucide-react";

/** `assets/x.png` → served by the project's asset route; other srcs pass through. */
function assetUrl(slug: string, src?: string) {
  if (!src) return undefined;
  return src.startsWith("assets/") ? `/projects/${slug}/${src}` : src.replace(/^public\//, "/");
}

export function ProjectCard({ project }: { project: Project }) {
  const { title, slug, description, images, tags, joinAt, pinned, github, website } = project.metadata;
  const thumbnail = assetUrl(slug, images?.[0]);

  return (
    <Link href={`/projects/${slug}`} className="group block h-full w-full text-left">
      <article className="card-3d relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/50">
        {pinned && (
          <span className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full border border-primary/30 bg-background/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary backdrop-blur-md">
            <Pin className="h-3 w-3 fill-primary" />
            Pinned
          </span>
        )}
        {thumbnail ? (
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        ) : (
          <div className="relative flex aspect-[16/9] w-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
            <span className="text-4xl font-black text-primary/30">{title.charAt(0)}</span>
          </div>
        )}
        <div className="flex flex-1 flex-col space-y-3 p-5">
          <div className="flex flex-wrap items-center gap-2">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="rounded-full text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && <span className="text-xs text-muted-foreground">+{tags.length - 3}</span>}
          </div>
          <h3 className="line-clamp-1 text-lg font-bold tracking-tight transition-colors group-hover:text-primary">
            {title}
          </h3>
          <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">{description}</p>
          <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-3">
            <span className="text-xs text-muted-foreground">
              {joinAt ? format(new Date(joinAt), "MMM yyyy") : ""}
            </span>
            <div className="flex items-center gap-2">
              {github && <Github className="h-4 w-4 text-muted-foreground" />}
              {website && <ExternalLink className="h-4 w-4 text-muted-foreground" />}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
