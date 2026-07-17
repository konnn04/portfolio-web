"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BlogCard } from "@/components/blogs/blog-card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { useLanguage } from "@/components/providers/providers";
import type { Post } from "@/lib/posts";

export function HomeBlog() {
  const { t, lang } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/posts?pinned=1&limit=3")
      .then((r) => r.json())
      .then((j) => setPosts(j.data || []))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [lang]);

  // nothing to show → render nothing (keeps the section out of the flow)
  if (loaded && posts.length === 0) return null;

  return (
    <section id="blog" className="relative w-full scroll-mt-20 py-24 md:py-32">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading
          index="07"
          kicker={t("sections.blog")}
          title={t("blogs.featured_title")}
          subtitle={t("blogs.description")}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, idx) => (
            <ScrollReveal key={post.metadata.slug} delay={idx * 0.08} direction="up">
              <BlogCard post={post} viewMode="card" />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal direction="up" delay={0.15}>
          <div className="mt-12 flex justify-center">
            <Link
              href="/blogs"
              className="group flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-6 py-3 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground active:scale-95"
            >
              {t("blogs.view_all")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
