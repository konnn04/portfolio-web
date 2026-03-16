import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Blog Insights | ${siteConfig.name}`,
  description:
    "Thoughts, learnings, and tutorials on web development, software engineering, and more.",
  openGraph: {
    title: `Blog Insights | ${siteConfig.name}`,
    description:
      "Thoughts, learnings, and tutorials on web development, software engineering, and more.",
    url: `${siteConfig.url}/blogs`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `Blog Insights | ${siteConfig.name}`,
    description:
      "Thoughts, learnings, and tutorials on web development, software engineering, and more.",
  },
};

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
