import { NextRequest, NextResponse } from "next/server";
import { getAllProjects } from "@/lib/projects";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = (searchParams.get("q") || "").toLowerCase();
  const limit = parseInt(searchParams.get("limit") || "0", 10); // 0 = all

  let lang = request.cookies.get("language")?.value as "en" | "vi" | undefined;
  if (!lang) {
    const acceptLang = request.headers.get("accept-language") || "";
    lang = acceptLang.includes("vi") ? "vi" : "en";
  }

  let projects = getAllProjects(lang); // already sorted (pinned, then recent)

  if (query) {
    projects = projects.filter((p) => {
      const md = p.metadata;
      return (
        md.title.toLowerCase().includes(query) ||
        md.description.toLowerCase().includes(query) ||
        md.tags.some((t) => t.toLowerCase().includes(query)) ||
        md.langs.some((l) => l.toLowerCase().includes(query))
      );
    });
  }

  const total = projects.length;
  const data = limit > 0 ? projects.slice(0, limit) : projects;
  return NextResponse.json({ data, meta: { total } });
}
