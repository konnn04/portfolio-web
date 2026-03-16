"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useLanguage } from "@/components/providers/providers";
import type { Project } from "@/types/project";
import { Github, ExternalLink, Users, Calendar, Code } from "lucide-react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

interface ProjectDetailModalProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectDetailModal({ project, open, onOpenChange }: ProjectDetailModalProps) {
  const { lang, t } = useLanguage();
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setActiveIndex(carouselApi.selectedScrollSnap());
    };

    carouselApi.on("select", onSelect);
    // Sync initial index via the event callback
    onSelect();

    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  if (!project) return null;

  const description = project.description[lang as keyof typeof project.description] || project.description.en;
  const images = project.images?.map((img) => img.replace(/^public\//, "/")) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-7xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {project.title}
          </DialogTitle>
          <DialogDescription className="text-base">
            {description}
          </DialogDescription>
        </DialogHeader>

        {/* Image Carousel */}
        {images.length > 0 && (
          <div className="px-6 mt-4">
            <Carousel className="w-full" opts={{ loop: true }} setApi={setCarouselApi}>
              <CarouselContent>
                {images.map((img, idx) => (
                  <CarouselItem key={idx}>
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted">
                      <Zoom>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt={`${project.title} screenshot ${idx + 1}`}
                          className="w-full h-full object-contain rounded-xl"
                          loading="lazy"
                        />
                      </Zoom>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {images.length > 1 && (
                <>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </>
              )}
            </Carousel>
            {images.length > 1 && (
              <div className="flex justify-center gap-2 mt-3">
                {images.map((img, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => carouselApi?.scrollTo(idx)}
                    className={`relative w-16 h-10 rounded-md overflow-hidden border-2 transition-all cursor-pointer ${
                      activeIndex === idx
                        ? "border-primary opacity-100 ring-2 ring-primary/30"
                        : "border-border opacity-60 hover:opacity-100 hover:border-primary/50"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Project Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-6">
          {/* Tags */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Code className="w-4 h-4" />
              {t("projects.technologies")}
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="rounded-full">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Code className="w-4 h-4" />
              {t("projects.languages")}
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.langs.map((l) => (
                <Badge key={l} variant="outline" className="rounded-full capitalize">
                  {l}
                </Badge>
              ))}
            </div>
          </div>

          {/* Contributors */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4" />
              {t("projects.contributors")}
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.contributors.map((c) => (
                <a
                  key={c}
                  href={`https://github.com/${c}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors text-sm"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://github.com/${c}.png?size=24`}
                    alt={c}
                    className="w-5 h-5 rounded-full"
                  />
                  {c}
                </a>
              ))}
            </div>
          </div>

          {/* Date */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {t("projects.joined")}
            </h4>
            <p className="text-sm">{format(new Date(project.joinAt), "MMMM dd, yyyy")}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 px-6 pb-6">
          {project.github && (
            <Button asChild variant="outline" className="gap-2">
              <a href={project.github} target="_blank" rel="noreferrer">
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </Button>
          )}
          {project.website && (
            <Button asChild className="gap-2">
              <a href={project.website} target="_blank" rel="noreferrer">
                <ExternalLink className="w-4 h-4" />
                {t("projects.visit_website")}
              </a>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
