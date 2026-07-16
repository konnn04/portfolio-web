/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import path from "path";
import type { Project, ProjectMetadata } from "@/types/project";
export type { Project, ProjectMetadata };

const projectsDirectory = path.join(process.cwd(), "data", "projects");

const STRING_KEYS = ["title", "github", "website", "description", "joinAt"];
const ARRAY_KEYS = ["images", "langs", "contributors", "tags"];

export function parseProject(fileContents: string, folderName: string): Project | null {
  const headerMatch = fileContents.match(/<!--\s*Header\s*-->\s*([\s\S]*?)\s*<!--\s*Content\s*-->/i);
  if (!headerMatch) return null;
  const headerRaw = headerMatch[1];
  const parts = fileContents.split(/(<!--\s*Content\s*-->)/i);
  const content = parts.length > 2 ? parts.slice(2).join("").trim() : "";

  const metadata: Record<string, any> = {};
  for (const line of headerRaw.split(/\r?\n/)) {
    const match = line.trim().match(/^\s*-\s*([a-zA-Z0-9_]+)\s*:\s*(.*)$/);
    if (!match) continue;
    const key = match[1].trim();
    let valueRaw = match[2].trim();
    if (valueRaw.endsWith(",")) valueRaw = valueRaw.slice(0, -1).trim();

    if (key === "pinned") {
      metadata.pinned = valueRaw.replace(/"/g, "") === "true";
    } else if (ARRAY_KEYS.includes(key) && valueRaw.startsWith("[")) {
      try {
        metadata[key] = JSON.parse(valueRaw);
      } catch {
        metadata[key] = valueRaw
          .slice(1, -1)
          .split(",")
          .map((i) => i.trim().replace(/^["']|["']$/g, ""))
          .filter(Boolean);
      }
    } else if (STRING_KEYS.includes(key)) {
      metadata[key] = valueRaw.startsWith('"') && valueRaw.endsWith('"') ? valueRaw.slice(1, -1) : valueRaw;
    }
  }

  const meta: ProjectMetadata = {
    title: metadata.title || folderName,
    slug: folderName,
    github: metadata.github || "",
    website: metadata.website || "",
    images: metadata.images || [],
    langs: metadata.langs || [],
    contributors: metadata.contributors || [],
    tags: metadata.tags || [],
    joinAt: metadata.joinAt || "",
    pinned: !!metadata.pinned,
    description: metadata.description || "",
  };
  return { metadata: meta, content, folderName };
}

function readProjectFolder(folderName: string, lang?: string): Project | null {
  const fullDir = path.join(projectsDirectory, folderName);
  if (!fs.existsSync(fullDir) || !fs.statSync(fullDir).isDirectory()) return null;

  let fullPath = path.join(fullDir, "content.md");
  const pathLang = path.join(fullDir, `content_${lang}.md`);
  if (lang && fs.existsSync(pathLang)) fullPath = pathLang;
  else if (!fs.existsSync(fullPath)) {
    if (fs.existsSync(path.join(fullDir, "content_vi.md"))) fullPath = path.join(fullDir, "content_vi.md");
    else if (fs.existsSync(path.join(fullDir, "content_en.md"))) fullPath = path.join(fullDir, "content_en.md");
  }
  if (!fs.existsSync(fullPath)) return null;
  return parseProject(fs.readFileSync(fullPath, "utf8"), folderName);
}

export function getAllProjects(lang?: string): Project[] {
  if (!fs.existsSync(projectsDirectory)) return [];
  return sortProjects(
    fs
      .readdirSync(projectsDirectory)
      .filter((d) => !d.startsWith("_"))
      .map((d) => readProjectFolder(d, lang))
      .filter((p): p is Project => p !== null),
  );
}

export function getProjectBySlug(slug: string, lang?: string): Project | null {
  if (!fs.existsSync(projectsDirectory)) return null;
  const dirName = fs.readdirSync(projectsDirectory).find((d) => d === slug);
  if (!dirName) return null;
  return readProjectFolder(dirName, lang);
}

/** Default ordering: pinned first, then most-recent joinAt. */
export function sortProjects(list: Project[]): Project[] {
  return [...list].sort((a, b) => {
    if (!!b.metadata.pinned !== !!a.metadata.pinned) return b.metadata.pinned ? 1 : -1;
    return new Date(b.metadata.joinAt).getTime() - new Date(a.metadata.joinAt).getTime();
  });
}

/** Related projects: score by shared tags/langs, then recency. */
export function getRelatedProjects(list: Project[], current: Project, limit = 3): Project[] {
  const tagSet = new Set(current.metadata.tags.map((t) => t.toLowerCase()));
  const langSet = new Set(current.metadata.langs.map((l) => l.toLowerCase()));
  return list
    .filter((p) => p.metadata.slug !== current.metadata.slug)
    .map((p) => {
      const tagScore = p.metadata.tags.filter((t) => tagSet.has(t.toLowerCase())).length;
      const langScore = p.metadata.langs.filter((l) => langSet.has(l.toLowerCase())).length;
      return { p, score: tagScore * 2 + langScore };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.p.metadata.joinAt).getTime() - new Date(a.p.metadata.joinAt).getTime();
    })
    .slice(0, limit)
    .map((x) => x.p);
}
