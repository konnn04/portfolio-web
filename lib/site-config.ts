import { site } from "@/configs/data/my-info";

/**
 * Single source of truth for site identity + feature toggles.
 * Everything is read from `configs/data/my-info.ts > site`, so white-labelling
 * the whole app is a matter of editing that one file (no code changes).
 */
interface SiteFeatures {
  game: boolean;
  easterEgg: boolean;
  discord: boolean;
  github: boolean;
  titleScrambleEffect: boolean;
}
interface SiteSettings {
  name: string;
  url: string;
  description: string;
  author: string;
  githubUsername: string;
  githubExcludeLangs: string[];
  discordUserId: string;
  repo: string;
  features: SiteFeatures;
}

const DEFAULT_EXCLUDE_LANGS = ["HTML", "CSS", "SCSS", "Less", "Dockerfile", "Makefile", "Shell", "Batchfile"];

const raw = site as Partial<SiteSettings>;

export const siteConfig: SiteSettings = {
  name: raw.name ?? "Portfolio",
  url: raw.url ?? "https://example.com",
  description: raw.description ?? "",
  author: raw.author ?? raw.name ?? "Portfolio",
  githubUsername: raw.githubUsername ?? "",
  githubExcludeLangs: raw.githubExcludeLangs?.length ? raw.githubExcludeLangs : DEFAULT_EXCLUDE_LANGS,
  discordUserId: raw.discordUserId ?? "",
  repo: raw.repo ?? "",
  features: {
    game: raw.features?.game ?? true,
    easterEgg: raw.features?.easterEgg ?? true,
    discord: raw.features?.discord ?? true,
    github: raw.features?.github ?? true,
    titleScrambleEffect: raw.features?.titleScrambleEffect ?? false,
  },
};
