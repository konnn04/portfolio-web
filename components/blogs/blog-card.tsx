import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Post } from "@/lib/posts";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/providers/providers";

interface BlogCardProps {
  post: Post;
  viewMode: "list" | "card";
}

export function BlogCard({ post, viewMode }: BlogCardProps) {
  const { t } = useLanguage();
  const { title, slug, date, description, image, categories } = post.metadata;
  const imageUrl = image?.startsWith("assets/") ? `/blogs/${slug}/${image}` : image;
  const formattedDate = date ? format(new Date(date), "MMMM dd, yyyy") : "";

  if (viewMode === "list") {
    return (
      <Link href={`/blogs/${slug}`} className="group block">
        <article className="p-6 rounded-2xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/50 flex flex-col sm:flex-row gap-6">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              {categories?.map((cat) => (
                <Badge key={cat} variant="secondary" className="rounded-full">
                  {cat}
                </Badge>
              ))}
              <span className="text-sm text-muted-foreground ml-auto">{formattedDate}</span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-muted-foreground line-clamp-2">{description}</p>
          </div>
        </article>
      </Link>
    );
  }

  // Card View
  return (
    <Link href={`/blogs/${slug}`} className="group block h-full">
      <article className="h-full flex flex-col rounded-2xl border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-primary/50">
        {imageUrl && (
          <div className="relative w-full aspect-[16/9] overflow-hidden">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
        <div className="p-6 flex flex-col flex-1 space-y-3">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {categories?.slice(0, 2).map((cat) => (
              <Badge key={cat} variant="secondary" className="rounded-full">
                {cat}
              </Badge>
            ))}
          </div>
          <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-muted-foreground line-clamp-3 flex-1">{description}</p>
          <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50">
            <span className="text-sm text-muted-foreground">{formattedDate}</span>
            <span className="text-sm font-medium text-primary group-hover:underline">{t("blogs.read_more")} &rarr;</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
