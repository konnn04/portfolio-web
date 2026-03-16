import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { getPostBySlug } from "@/lib/posts";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string, path: string[] }> }
) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const imagePathArray = resolvedParams.path;
  
  if (!slug || !imagePathArray || imagePathArray.length === 0) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const post = getPostBySlug(slug);
  if (!post) {
      return new NextResponse("Post Not Found", { status: 404 });
  }

  const fileName = imagePathArray[imagePathArray.length - 1];
  const potentialImagePath = path.join(process.cwd(), "posts", post.folderName, "assets", ...imagePathArray);

  try {
    if (fs.existsSync(potentialImagePath)) {
        const fileBuffer = fs.readFileSync(potentialImagePath);
        let contentType = "image/jpeg";
        if (fileName.endsWith('.png')) contentType = "image/png";
        else if (fileName.endsWith('.gif')) contentType = "image/gif";
        else if (fileName.endsWith('.svg')) contentType = "image/svg+xml";
        else if (fileName.endsWith('.webp')) contentType = "image/webp";

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    }
  } catch (error) {
    console.error("Error serving image:", error);
  }

  return new NextResponse("Image Not Found", { status: 404 });
}
