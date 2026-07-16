/**
 * Projects are authored exactly like blog posts: one folder per slug under
 * `data/projects/<slug>/` with `content_{en,vi}.md` (header block + body) and an
 * `assets/` folder for images/videos. Metadata below is resolved for one
 * language by the loader in `lib/projects.ts`.
 */
export interface ProjectMetadata {
  title: string;
  slug: string;
  github: string;
  website: string;
  images: string[];
  langs: string[];
  contributors: string[];
  tags: string[];
  joinAt: string;
  pinned?: boolean;
  description: string;
}

export interface Project {
  metadata: ProjectMetadata;
  content: string;
  folderName: string;
}
