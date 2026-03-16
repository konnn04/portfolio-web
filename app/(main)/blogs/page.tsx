"use client";

import { useEffect, useState } from "react";
import { BlogCard } from "@/components/blogs/blog-card";
import { BlogFilters } from "@/components/blogs/blog-filters";
import { BlogPagination } from "@/components/blogs/blog-pagination";
import { Post } from "@/lib/posts";
import { useSearchParams } from "next/navigation";
import { useHeader } from "@/components/providers/header-provider";
import { useLanguage } from "@/components/providers/providers";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export default function BlogsClientPage() {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "card">("card");
  const { setConfig } = useHeader();
  const { t } = useLanguage();

  useEffect(() => {
    setConfig({ isHiddenUntilScroll: false, noBGUntilScroll: false });
  }, [setConfig]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams(searchParams.toString());
        if (!queryParams.has("limit")) {
          queryParams.set("limit", "12");
        }
        const res = await fetch(`/api/posts?${queryParams.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch posts");
        const json = await res.json();

        setPosts(json.data);
        setCurrentPage(json.meta.page);
        setTotalPages(json.meta.totalPages);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [searchParams]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ScrollReveal>
        <div className="space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{t("blogs.title")}</h1>
          <p className="text-lg text-muted-foreground w-full max-w-2xl">
            {t("blogs.description")}
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <BlogFilters viewMode={viewMode} setViewMode={setViewMode} />
      </ScrollReveal>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-[400px] rounded-2xl bg-muted animate-pulse"></div>
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div
          className={
            viewMode === "card"
              ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              : "flex flex-col gap-6"
          }
        >
          {posts.map((post, idx) => (
            <ScrollReveal key={post.metadata.slug} delay={idx * 0.08} direction="up">
              <BlogCard post={post} viewMode={viewMode} />
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed">
          <h3 className="text-2xl font-bold tracking-tight mb-2">{t("blogs.no_posts_title")}</h3>
          <p className="text-muted-foreground mb-6">{t("blogs.no_posts_desc")}</p>
        </div>
      )}

      {!loading && <BlogPagination currentPage={currentPage} totalPages={totalPages} />}
    </div>
  );
}
