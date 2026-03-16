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
    // Mark current post as read
    const readPosts = JSON.parse(localStorage.getItem("read_posts") || "[]");
    if (!readPosts.includes(currentSlug)) {
      readPosts.push(currentSlug);
      localStorage.setItem("read_posts", JSON.stringify(readPosts));
    }

    const fetchRelated = async () => {
      try {
        const catQuery = categories.length > 0 ? categories[0] : "";
        const res = await fetch(`/api/posts?limit=100&category=${catQuery}`);
        if (!res.ok) return;
        
        const json = await res.json();
        const allPosts: Post[] = json.data;

        // Filter out the current post and already read posts
        const unreadRelated = allPosts.filter(
          (p) => p.metadata.slug !== currentSlug && !readPosts.includes(p.metadata.slug)
        );

        // Take up to 3 random posts
        const shuffled = unreadRelated.sort(() => 0.5 - Math.random());
        setRelated(shuffled.slice(0, 3));
      } catch (e) {
        console.error("Error fetching related posts", e);
      }
    };

    fetchRelated();
  }, [currentSlug, categories]);

  if (related.length === 0) return null;

  return (
    <div className="mt-16 border-t pt-10">
      <h3 className="text-2xl font-bold mb-6 tracking-tight">Read Next</h3>
      <div className="grid gap-6 md:grid-cols-3">
        {related.map((post) => (
          <Link key={post.metadata.slug} href={`/blogs/${post.metadata.slug}`} className="group block h-full">
            <article className="h-full flex flex-col rounded-xl border bg-card shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-primary/50">
              {post.metadata.image && (
                 <div className="relative w-full aspect-video overflow-hidden">
                   <Image
                     src={post.metadata.image}
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
        ))}
      </div>
    </div>
  );
}
