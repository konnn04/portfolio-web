import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/lib/site-config";

interface Repo {
  language: string | null;
  stargazers_count: number;
  fork: boolean;
}
interface ContribDay {
  date: string;
  count: number;
  level: number;
}

/**
 * Aggregates public GitHub activity for the code-skills section. No auth needed
 * (optionally uses GITHUB_TOKEN to raise the rate limit). Cached for an hour.
 *   - user + repos → GitHub REST
 *   - contribution calendar → github-contributions-api.jogruber.de
 */
export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username") || siteConfig.githubUsername;
  if (!username) return NextResponse.json({ success: false, error: "no_username" }, { status: 400 });

  const exclude = new Set(siteConfig.githubExcludeLangs.map((s) => s.toLowerCase()));
  const headers: Record<string, string> = { Accept: "application/vnd.github+json", "User-Agent": "portfolio" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  try {
    const [userRes, reposRes, contribRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers, next: { revalidate: 3600 } }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&type=owner&sort=pushed`, { headers, next: { revalidate: 3600 } }),
      fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`, { next: { revalidate: 3600 } }),
    ]);

    const user = userRes.ok ? await userRes.json() : {};
    const repos: Repo[] = reposRes.ok ? await reposRes.json() : [];
    const contrib = contribRes.ok ? await contribRes.json() : { contributions: [] };

    const langCount: Record<string, number> = {};
    let stars = 0;
    for (const r of repos) {
      if (r.fork) continue;
      stars += r.stargazers_count || 0;
      const l = r.language;
      if (l && !exclude.has(l.toLowerCase())) langCount[l] = (langCount[l] || 0) + 1;
    }
    const totalLang = Object.values(langCount).reduce((a, b) => a + b, 0) || 1;
    const languages = Object.entries(langCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, count, pct: Math.round((count / totalLang) * 100) }));

    const days: ContribDay[] = Array.isArray(contrib.contributions) ? contrib.contributions : [];
    const contributions = days.reduce((a, d) => a + (d.count || 0), 0);

    return NextResponse.json(
      {
        success: true,
        data: {
          stats: { repos: user.public_repos || 0, followers: user.followers || 0, stars, contributions },
          languages,
          days,
        },
      },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" } },
    );
  } catch (error) {
    console.error("GitHub stats error:", error);
    return NextResponse.json({ success: false, error: "fetch_failed" }, { status: 500 });
  }
}
