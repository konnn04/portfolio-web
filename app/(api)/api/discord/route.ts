import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing Discord URL parameter" }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      next: { revalidate: 15 } // Cache for 15 seconds
    });
    
    if (!res.ok) {
        throw new Error(`Failed to fetch from Lanyard: ${res.statusText}`);
    }
    
    const data = await res.json();
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=30'
      }
    });
  } catch (error) {
    console.error("Discord API Proxy Error:", error);
    return NextResponse.json({ error: "Failed to fetch Discord data" }, { status: 500 });
  }
}
