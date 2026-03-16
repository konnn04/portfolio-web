export interface PostMetadata {
  title: string;
  slug: string;
  date: string;
  author: string;
  keywords: string[];
  description: string;
  image: string;
  categories: string[];
}

export interface Post {
  metadata: PostMetadata;
  content: string;
  folderName: string;
}
