import { NextRequest, NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const readSlugs: string[] = body.readSlugs || [];
    const currentSlug: string = body.currentSlug || "";
    const limit = parseInt(body.limit || "3", 10);

    let lang = request.cookies.get("language")?.value as "en" | "vi" | undefined;
    if (!lang) {
      const acceptLang = request.headers.get("accept-language") || "";
      lang = acceptLang.includes("vi") ? "vi" : "en";
    }

    const posts = getAllPosts(lang);

    // Filter out current post
    let availablePosts = posts.filter(p => p.metadata.slug !== currentSlug);

    // Separate into unread and read
    const unreadPosts = availablePosts.filter(p => !readSlugs.includes(p.metadata.slug));
    const readPosts = availablePosts.filter(p => readSlugs.includes(p.metadata.slug));

    // Shuffle each group
    const shuffledUnread = unreadPosts.sort(() => 0.5 - Math.random());
    const shuffledRead = readPosts.sort(() => 0.5 - Math.random());

    // Take from unread first, then fill from read if needed
    const recommended = [...shuffledUnread, ...shuffledRead].slice(0, limit);

    return NextResponse.json({
      data: recommended,
      meta: {
        total: recommended.length,
        unreadCount: unreadPosts.length,
      },
    });
  } catch (error) {
    console.error("Error in POST /api/posts/recommend:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}