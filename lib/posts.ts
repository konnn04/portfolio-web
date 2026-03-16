/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from "fs";
import path from "path";

const postsDirectory = path.join(process.cwd(), "posts");

import { Post, PostMetadata } from "@/types/blog";
export type { Post, PostMetadata };

export function parsePost(fileContents: string, folderName?: string): Post | null {
  const headerMatch = fileContents.match(/<!--\s*Header\s*-->\s*([\s\S]*?)\s*<!--\s*Content\s*-->/i);
  if (!headerMatch) return null;

  const headerRaw = headerMatch[1];
  const contentMatch = fileContents.split(/(<!--\s*Content\s*-->)/i);
  const content = contentMatch.length > 2 ? contentMatch.slice(2).join('').trim() : "";

  const lines = headerRaw.split('\n');
  const metadata: Partial<PostMetadata> = {};

  for (const line of lines) {
     const match = line.match(/^\s*-\s*([a-zA-Z0-9_]+)\s*:\s*(.*)$/);
     if (match) {
        const key = match[1].trim() as keyof PostMetadata;
        let valueRaw = match[2].trim();
        
        if (valueRaw.endsWith(',')) valueRaw = valueRaw.slice(0, -1).trim();

        if (valueRaw.startsWith('"') && valueRaw.endsWith('"')) {
            valueRaw = valueRaw.slice(1, -1);
            if (['title', 'slug', 'date', 'author', 'description', 'image'].includes(key as string)) {
               (metadata as Record<string, any>)[key as string] = valueRaw;
            }
        } 
        else if (key === 'date' || key === 'slug' || key === 'image' || key === 'author' || key === 'title') {
            (metadata as Record<string, any>)[key as string] = valueRaw;
        }
        else if (valueRaw.startsWith('[') && valueRaw.endsWith(']')) {
            try {
                const parsedArray = JSON.parse(valueRaw);
                if (Array.isArray(parsedArray)) {
                    if (key === 'keywords' || key === 'categories') {
                        (metadata as Record<string, any>)[key as string] = parsedArray;
                    }
                }
            } catch (_e) { 
                const items = valueRaw.slice(1, -1).split(',').map(i => {
                   const it = i.trim();
                   if (it.startsWith('"') && it.endsWith('"')) return it.slice(1, -1);
                   if (it.startsWith("'") && it.endsWith("'")) return it.slice(1, -1);
                   return it;
                });
                if (key === 'keywords' || key === 'categories') {
                    (metadata as any)[key] = items;
                }
            }
        }
     }
  }

  return {
     metadata: metadata as PostMetadata,
     content,
     folderName: folderName || metadata.slug || ""
  };
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) return [];
  const dirNames = fs.readdirSync(postsDirectory);
  const posts = dirNames
    .map((dirName) => {
      const fullDir = path.join(postsDirectory, dirName);
      if (fs.statSync(fullDir).isDirectory()) {
        const fullPath = path.join(fullDir, "content.md");
        if (fs.existsSync(fullPath)) {
            const fileContents = fs.readFileSync(fullPath, "utf8");
            return parsePost(fileContents, dirName);
        }
      }
      return null;
    })
    .filter((post): post is Post => post !== null);
  
  return posts.sort((a, b) => new Date(b.metadata.date || 0).getTime() - new Date(a.metadata.date || 0).getTime());
}

export function getPostBySlug(slug: string): Post | null {
    const posts = getAllPosts();
    return posts.find(p => p.metadata.slug === slug) || null;
}
