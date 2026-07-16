import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

const TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string; path: string[] }> },
) {
  const { slug, path: imagePathArray } = await params;
  if (!slug || !imagePathArray?.length) return new NextResponse("Not Found", { status: 404 });

  const assetsRoot = path.join(process.cwd(), "data", "projects", slug, "assets");
  const target = path.join(assetsRoot, ...imagePathArray);
  if (!target.startsWith(assetsRoot)) return new NextResponse("Forbidden", { status: 403 });

  try {
    if (fs.existsSync(target) && fs.statSync(target).isFile()) {
      const ext = path.extname(target).toLowerCase();
      return new NextResponse(fs.readFileSync(target), {
        headers: {
          "Content-Type": TYPES[ext] || "application/octet-stream",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }
  } catch (error) {
    console.error("Error serving project asset:", error);
  }
  return new NextResponse("Not Found", { status: 404 });
}
