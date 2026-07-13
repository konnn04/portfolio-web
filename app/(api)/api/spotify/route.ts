import { NextRequest, NextResponse } from "next/server";

/**
 * Resolves Spotify metadata (title, thumbnail) for a track / playlist / album
 * URL via the public oEmbed endpoint — no auth or API key required. Cached for a
 * day. Note: oEmbed does not expose the artist name, only the title + thumbnail.
 */
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url || !/^https?:\/\/(open\.)?spotify\.com\//.test(url)) {
    return NextResponse.json({ success: false, error: "bad_url" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return NextResponse.json({ success: false, error: "fetch_failed" });
    const d = await res.json();
    return NextResponse.json({
      success: true,
      data: {
        title: d.title as string,
        author: (d.provider_name as string) || "Spotify",
        thumbnail: (d.thumbnail_url as string) || null,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "fetch_failed" });
  }
}
