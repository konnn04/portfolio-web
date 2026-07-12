/* ─── Site ─── */
export interface SiteFeatures {
  game: boolean;
  easterEgg: boolean;
  discord: boolean;
  github: boolean;
}

export interface Site {
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

/* ─── Socials ─── */
export interface SocialLink {
  href: string;
  label: string;
}

export interface Socials {
  github: SocialLink;
  linkedin: SocialLink;
  facebook: SocialLink;
  mail: SocialLink;
  youtube: SocialLink;
}

/* ─── Localized strings ─── */
export interface Localized {
  [key: string]: string;
  vi: string;
  en: string;
}

/* ─── School / Education ─── */
export interface Major {
  name: Localized;
  gpa: string;
  startDate: string;
  endDate: string;
}

export interface Activity {
  name: Localized;
  startDate: string;
  endDate: string;
  description: Localized;
  links?: string[];
}

export interface School {
  name: Localized;
  majors: Major[];
  activities?: Activity[];
}

/* ─── Experience ─── */
export interface Experience {
  type: "work" | "freelance" | "volunteer";
  company: Localized;
  position: Localized;
  startDate: string;
  endDate?: string;
  description: Localized;
  links?: string[];
}

/* ─── Skills ─── */
export interface Skills {
  lang: string[];
  frameworks: string[];
  databases: string[];
  tools: string[];
}

/* ─── Language ─── */
export interface Language {
  name: Localized;
  level: Localized;
}

/* ─── Certificate ─── */
export interface Certificate {
  name: Localized;
  organization: Localized;
  issueDate: string;
}

/* ─── More (about me extras) ─── */
export interface MusicItem {
  title: string;
  url: string;
}

export interface SecretProject {
  name: string;
  description: Localized;
  url: string;
}

export interface More {
  games: string[];
  hobbies: Record<string, string[]>;
  music: MusicItem[];
  secretProjects: SecretProject[];
}

/* ─── Profile ─── */
export interface Profile {
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: Localized;
  role: string;
  country: string;
  city: string;
  address: string;
  discordDataUrl: string;
  bio: Localized;
  slogan: Localized;
  socials: Socials;
  schools: School[];
  publish: string[];
  experiences: Experience[];
  achievements: string[];
  skills: Skills;
  languages: Language[];
  certificates: Certificate[];
  donate: string[];
  more: More;
}

/* ─── Root ─── */
export interface MyInfo {
  site: Site;
  profile: Profile;
}
