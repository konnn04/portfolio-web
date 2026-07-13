import { NextRequest, NextResponse } from "next/server";

/**
 * Resolves a game hero image by name via RAWG (https://rawg.io/apidocs).
 * One GET, key in the query, returns `background_image` — works for any game.
 * Set RAWG_API_KEY (free key). The upstream fetch is cached for a day, so a
 * handful of games costs only a few RAWG requests per day.
 * Missing key / no match → `{cover:null}` and the UI shows its gamepad tile.
 */
async function fromRawg(name: string): Promise<string | null> {
  const key = process.env.RAWG_API_KEY;
  if (!key) return null;
  const url = `https://api.rawg.io/api/games?key=${key}&search=${encodeURIComponent(name)}&page_size=1`;
  const res = await fetch(url, { next: { revalidate: 86400 } }); // cache 1 day
  if (!res.ok) return null;
  const d = await res.json();
  return (d?.results?.[0]?.background_image as string | null) ?? null;
}

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name");
  if (!name) return NextResponse.json({ success: false, error: "bad_query" }, { status: 400 });

  const hasKey = !!process.env.RAWG_API_KEY;
  let cover: string | null = null;
  try {
    cover = await fromRawg(name);
  } catch {
    cover = null;
  }

  // Explain a null so misconfig is obvious when hitting the route directly.
  const reason = cover ? undefined : hasKey ? "no_result" : "no_api_key";
  return NextResponse.json({ success: true, data: { cover, source: cover ? "rawg" : null, reason } });
}
