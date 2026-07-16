export interface PostMetadata {
  title: string;
  slug: string;
  date: string;
  author: string;
  keywords: string[];
  description: string;
  image: string;
  categories: string[];
  /** Featured on the home page only. Ignored by the /blogs listing. */
  pinned?: boolean;
}

export interface Post {
  metadata: PostMetadata;
  content: string;
  folderName: string;
}
