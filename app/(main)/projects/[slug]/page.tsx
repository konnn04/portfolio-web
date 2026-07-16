import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies, headers } from "next/headers";
import { format } from "date-fns";
import type { Metadata } from "next";
import { Github, ExternalLink, Users, Calendar, Code, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { ProjectContent } from "@/components/projects/project-content";
import { getAllProjects, getProjectBySlug, getRelatedProjects } from "@/lib/projects";

interface Props {
  params: Promise<{ slug: string }>;
}

async function resolveLang(): Promise<"en" | "vi"> {
  const cookieStore = await cookies();
  let lang = cookieStore.get("language")?.value as "en" | "vi" | undefined;
  if (!lang) {
    const headersList = await headers();
    lang = (headersList.get("accept-language") || "").includes("vi") ? "vi" : "en";
  }
  return lang;
}

const LABELS = {
  en: { back: "All projects", langs: "Languages", contributors: "Contributors", joined: "Joined", visit: "Visit website", related: "Related projects" },
  vi: { back: "Tất cả dự án", langs: "Ngôn ngữ", contributors: "Đóng góp", joined: "Tham gia", visit: "Xem website", related: "Dự án liên quan" },
};

const assetUrl = (slug: string, src: string) =>
  src.startsWith("assets/") ? `/projects/${slug}/${src}` : src.replace(/^public\//, "/");

export async function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.metadata.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lang = await resolveLang();
  const project = getProjectBySlug(slug, lang);
  if (!project) return { title: "Project Not Found" };
  const { title, description, images } = project.metadata;
  const image = images[0] ? assetUrl(slug, images[0]) : undefined;
  return {
    title,
    description,
    openGraph: { title, description, images: image ? [{ url: image }] : [] },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : [] },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const lang = await resolveLang();
  const project = getProjectBySlug(slug, lang);
  if (!project) notFound();

  const L = LABELS[lang];
  const { title, description, tags, langs, contributors, joinAt, github, website, images } = project.metadata;
  const galleryImages = images.map((img) => assetUrl(slug, img));
  const related = getRelatedProjects(getAllProjects(lang), project, 3);

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/projects"
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> {L.back}
      </Link>

      <header className="mb-8">
        <div className="mb-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="rounded-full">
              {tag}
            </Badge>
          ))}
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">{title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{description}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          {github && (
            <Button asChild variant="outline" className="gap-2">
              <a href={github} target="_blank" rel="noreferrer">
                <Github className="h-4 w-4" /> GitHub
              </a>
            </Button>
          )}
          {website && (
            <Button asChild className="gap-2">
              <a href={website} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" /> {L.visit}
              </a>
            </Button>
          )}
        </div>
      </header>

      {galleryImages.length > 0 && (
        <div className="mb-10">
          <ProjectGallery images={galleryImages} title={title} />
        </div>
      )}

      <div className="mb-10 grid grid-cols-1 gap-6 rounded-2xl border bg-card/50 p-6 sm:grid-cols-2">
        <div className="space-y-2">
          <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Code className="h-4 w-4" /> {L.langs}
          </h4>
          <div className="flex flex-wrap gap-2">
            {langs.map((l) => (
              <Badge key={l} variant="outline" className="rounded-full capitalize">
                {l}
              </Badge>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Calendar className="h-4 w-4" /> {L.joined}
          </h4>
          <p className="text-sm">{joinAt ? format(new Date(joinAt), "MMMM dd, yyyy") : ""}</p>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Users className="h-4 w-4" /> {L.contributors}
          </h4>
          <div className="flex flex-wrap gap-2">
            {contributors.map((c) => (
              <a
                key={c}
                href={`https://github.com/${c}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm transition-colors hover:bg-muted/80"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://github.com/${c}.png?size=24`} alt={c} className="h-5 w-5 rounded-full" />
                {c}
              </a>
            ))}
          </div>
        </div>
      </div>

      {project.content && (
        <div className="mb-12">
          <ProjectContent content={project.content} slug={slug} />
        </div>
      )}

      {related.length > 0 && (
        <section className="mt-16 border-t pt-10">
          <h3 className="mb-6 text-2xl font-bold tracking-tight">{L.related}</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProjectCard key={p.metadata.slug} project={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
