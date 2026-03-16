import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Projects | ${siteConfig.name}`,
  description:
    "A showcase of projects I've built or contributed to. Explore open-source tools, web apps, browser extensions, and more.",
  openGraph: {
    title: `Projects | ${siteConfig.name}`,
    description:
      "A showcase of projects I've built or contributed to. Explore open-source tools, web apps, browser extensions, and more.",
    url: `${siteConfig.url}/projects`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `Projects | ${siteConfig.name}`,
    description:
      "A showcase of projects I've built or contributed to. Explore open-source tools, web apps, browser extensions, and more.",
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
