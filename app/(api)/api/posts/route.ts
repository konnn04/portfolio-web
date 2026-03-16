import { NextRequest, NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "12", 10);
  const sortBy = searchParams.get("sortBy") || "date"; // 'date' | 'name'
  const sortOrder = searchParams.get("sortOrder") || "desc"; // 'asc' | 'desc'
  const category = searchParams.get("category") || "";

  let posts = getAllPosts();

  if (query) {
    const lowercaseQuery = query.toLowerCase();
    posts = posts.filter(
      (post) =>
        post.metadata.title?.toLowerCase().includes(lowercaseQuery) ||
        post.metadata.description?.toLowerCase().includes(lowercaseQuery)
    );
  }

  if (category) {
    posts = posts.filter((post) => 
        post.metadata.categories?.some((c: string) => c.toLowerCase() === category.toLowerCase())
    );
  }

  posts = posts.sort((a, b) => {
    let comparison = 0;
    if (sortBy === "name") {
      comparison = (a.metadata.title || "").localeCompare(b.metadata.title || "");
    } else {
      comparison =
        new Date(a.metadata.date || 0).getTime() - new Date(b.metadata.date || 0).getTime();
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const total = posts.length;
  const totalPages = Math.ceil(total / limit);
  
  const start = (page - 1) * limit;
  const paginatedPosts = posts.slice(start, start + limit);

  return NextResponse.json({
    data: paginatedPosts,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  });
}
