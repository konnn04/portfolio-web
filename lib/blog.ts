/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from "fs";
import path from "path";

export interface Post {
  title: string;
  slug: string;
  date: string;
  author: string;
  keywords: string[];
  description: string;
  image?: string;
  categories: string[];
  content: string;
}

const postsDirectory = path.join(process.cwd(), "posts");

function parsePostData(fileContents: string, folderName: string): Post | null {
  const headerMatch = fileContents.match(/<-help  Header -->([\s\S]*?)<-help  Content -->([\s\S]*)/);
  if (!headerMatch) {
    return null;
  }

  const headerString = headerMatch[1];
  const content = headerMatch[2].trim();
  
  const lines = headerString.split('\n');
  const data: any = {};
  let currentKey = '';
  
  lines.forEach(line => {
    const match = line.match(/^-\s*([\w]+):\s*(.*)$/);
    if (match) {
      currentKey = match[1];
      let rawValue = match[2].trim();
      if (rawValue.endsWith(',')) {
        rawValue = rawValue.slice(0, -1);
      }
      try {
        if (rawValue.startsWith('[') || rawValue.startsWith('"')) {
          data[currentKey] = JSON.parse(rawValue);
        } else {
          data[currentKey] = rawValue;
        }
      } catch (e) {
        data[currentKey] = rawValue.replace(/^"|"$/g, '');
      }
    } else if (currentKey && line.trim() && !line.startsWith('- ') && !line.startsWith('<!--')) {
      const extra = line.trim();
      if (typeof data[currentKey] === 'string') {
        data[currentKey] += " " + extra;
      }
    }
  });

  return {
    title: data.title || folderName,
    slug: data.slug || folderName,
    date: data.date || "1970-01-01",
    author: data.author || "Unknown",
    keywords: Array.isArray(data.keywords) ? data.keywords : [],
    description: data.description || "",
    image: data.image || "/avatar.jpg",
    categories: Array.isArray(data.categories) ? data.categories : [],
    content,
  };
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const folders = fs.readdirSync(postsDirectory, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
    
  const posts: Post[] = [];

  for (const folder of folders) {
    const fullPath = path.join(postsDirectory, folder, "content.md");
    if (fs.existsSync(fullPath)) {
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const post = parsePostData(fileContents, folder);
      if (post) {
        posts.push(post);
      }
    }
  }

  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export function getPostBySlug(slug: string): Post | undefined {
  const posts = getAllPosts();
  return posts.find((post) => post.slug === slug);
}
