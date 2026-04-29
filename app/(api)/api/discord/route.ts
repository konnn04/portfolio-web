import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ success: false, error: "Missing Discord URL parameter", data: null }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      next: { revalidate: 15 }
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json({
        success: false,
        error: `Failed to fetch: ${res.status} - ${errorText}`,
        data: null
      }, { status: res.status });
    }

    const data = await res.json();

    return NextResponse.json({
      success: true,
      data,
      error: null
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=30'
      }
    });
  } catch (error) {
    console.error("Discord API Proxy Error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch Discord data",
      data: null
    }, { status: 500 });
  }
}