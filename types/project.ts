export interface Project {
  title: string;
  slug: string;
  github: string;
  website: string;
  images?: string[];
  description: {
    en: string;
    vi: string;
  };
  langs: string[];
  contributors: string[];
  tags: string[];
  joinAt: string;
  pinned?: boolean;
}
