"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Post } from "@/lib/posts";
import { Badge } from "@/components/ui/badge";

export function RelatedPosts({ currentSlug, categories }: { currentSlug: string; categories: string[] }) {
  const [related, setRelated] = useState<Post[]>([]);

  useEffect(() => {
    // Get read posts from localStorage
    const readPosts = JSON.parse(localStorage.getItem("read_posts") || "[]");

    // Add current post to read list if not already there
    if (!readPosts.includes(currentSlug)) {
      const updatedReadPosts = [...readPosts, currentSlug];
      localStorage.setItem("read_posts", JSON.stringify(updatedReadPosts));
    }

    const fetchRelated = async () => {
      try {
        const res = await fetch("/api/posts/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            readSlugs: readPosts,
            currentSlug: currentSlug,
            limit: 3,
          }),
        });
        if (!res.ok) return;

        const json = await res.json();
        setRelated(json.data || []);
      } catch (e) {
        console.error("Error fetching related posts", e);
      }
    };

    fetchRelated();
  }, [currentSlug, categories]);

  if (related.length === 0) return null;

  return (
    <div className="mt-16 border-t pt-10">
      <h3 className="text-2xl font-bold mb-6 tracking-tight">Đọc thêm các bài khác?</h3>
      <div className="grid gap-6 md:grid-cols-3">
        {related.map((post) => {
          const imageUrl = post.metadata.image?.startsWith("assets/") 
            ? `/blogs/${post.metadata.slug}/${post.metadata.image}` 
            : post.metadata.image;

          return (
          <Link key={post.metadata.slug} href={`/blogs/${post.metadata.slug}`} className="group block h-full">
            <article className="h-full flex flex-col rounded-xl border bg-card shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-primary/50">
              {imageUrl && (
                 <div className="relative w-full aspect-video overflow-hidden">
                   <Image
                     src={imageUrl}
                     alt={post.metadata.title}
                     fill
                     className="object-cover transition-transform duration-500 group-hover:scale-105"
                   />
                 </div>
              )}
              <div className="p-4 flex flex-col flex-1">
                 <div className="flex items-center gap-2 flex-wrap mb-2">
                   {post.metadata.categories?.slice(0, 1).map((cat) => (
                     <Badge key={cat} variant="outline" className="text-xs rounded-full">{cat}</Badge>
                   ))}
                 </div>
                 <h4 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                    {post.metadata.title}
                 </h4>
                 <div className="mt-auto pt-3 flex text-xs text-muted-foreground">
                   {format(new Date(post.metadata.date || 0), "MMM dd, yyyy")}
                 </div>
              </div>
            </article>
          </Link>
          );
        })}
      </div>
    </div>
  );
}
