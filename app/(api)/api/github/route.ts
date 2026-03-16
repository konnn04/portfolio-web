import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username") || "konnn04";
  const url = `https://profile-summary-for-github.com/api/user/${username}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 } 
    });
    
    if (!res.ok) {
        throw new Error(`Failed to fetch from Github Profile Summary: ${res.statusText}`);
    }
    
    const data = await res.json();
    
    return NextResponse.json({ success: true, data }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
      }
    });
  } catch (error) {
    console.error("Github API Proxy Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch Github data" }, { status: 500 });
  }
}
