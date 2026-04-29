import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ShareSticky } from "@/components/blogs/share-sticky";
import { RelatedPosts } from "@/components/blogs/related-posts";
import { Badge } from "@/components/ui/badge";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { Metadata } from "next";

// ❗ thiếu import này sẽ lỗi
import { cookies, headers } from "next/headers";

interface Props {
  params: {
    slug: string;
  };
}

// ================= META =================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;

  const cookieStore = await cookies();

  let lang = cookieStore.get("language")?.value as "en" | "vi" | undefined;

  if (!lang) {
    const headersList = await headers();
    const acceptLang = headersList.get("accept-language") || "";
    lang = acceptLang.includes("vi") ? "vi" : "en";
  }

  const post = getPostBySlug(slug, lang);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const { title, description, image, keywords, author } = post.metadata;

  const imageUrl = image?.startsWith("assets/")
    ? `/blogs/${slug}/${image}`
    : image;

  return {
    title,
    description,
    keywords: keywords?.join(", "),
    authors: author ? [{ name: author }] : [],
    openGraph: {
      title,
      description,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

// ================= STATIC PARAMS =================
export async function generateStaticParams() {
  const postsEn = getAllPosts("en");
  const postsVi = getAllPosts("vi");

  const allSlugs = new Set([
    ...postsEn.map((post) => post.metadata.slug),
    ...postsVi.map((post) => post.metadata.slug),
  ]);

  return Array.from(allSlugs).map((slug) => ({
    slug,
  }));
}

// ================= PAGE =================
export default async function BlogPostPage({ params }: Props) {
  const { slug } = params;

  const cookieStore = await cookies();

  let lang = cookieStore.get("language")?.value as "en" | "vi" | undefined;

  if (!lang) {
    const headersList = await headers();
    const acceptLang = headersList.get("accept-language") || "";
    lang = acceptLang.includes("vi") ? "vi" : "en";
  }

  const post = getPostBySlug(slug, lang);

  if (!post) {
    notFound();
  }

  const { title, date, author, image, categories } = post.metadata;

  const imageUrl = image?.startsWith("assets/")
    ? `/blogs/${slug}/${image}`
    : image;

  return (
    <article className="relative min-h-screen pb-20">
      {/* Hero */}
      {imageUrl && (
        <div className="relative w-full h-[33vh] min-h-[300px] max-h-[400px]">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Header */}
        <header className="mb-10 text-center">
          <div className="flex justify-center flex-wrap gap-2 mb-6">
            {categories?.map((cat: string) => (
              <Badge
                key={cat}
                variant="secondary"
                className="rounded-full px-4 py-1 text-sm bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                {cat}
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            {title}
          </h1>

          <div className="flex items-center justify-center gap-4 text-muted-foreground font-medium">
            {author && <span>{author}</span>}

            {author && date && (
              <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
            )}

            {date && (
              <time dateTime={date}>
                {format(new Date(date), "MMMM dd, yyyy")}
              </time>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="prose dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl prose-img:border mb-12">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                const isInline =
                  !className || !className.includes("language-");

                const codeText =
                  typeof children === "string"
                    ? children.replace(/^`+/, "").replace(/`+$/, "")
                    : children;

                if (isInline) {
                  return (
                    <code
                      className="px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 font-mono text-sm"
                      {...props}
                    >
                      {codeText}
                    </code>
                  );
                }

                return (
                  <pre className="overflow-x-auto rounded-xl bg-zinc-900 p-4 my-4 text-zinc-100 font-mono text-sm">
                    {codeText}
                  </pre>
                );
              },

              pre({ children }) {
                return <>{children}</>;
              },

              img: ({ ...props }) => {
                const imgSrc =
                  typeof props.src === "string" ? props.src : undefined;

                const src = imgSrc?.startsWith("assets/")
                  ? `/blogs/${slug}/${imgSrc}`
                  : imgSrc;

                return (
                  <span className="flex justify-center w-full my-8">
                    <Zoom>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        {...props}
                        src={src}
                        className="rounded-xl border shadow-sm max-h-[70vh] w-auto object-contain"
                        alt={props.alt || "Blog image"}
                        loading="lazy"
                      />
                    </Zoom>
                  </span>
                );
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        <ShareSticky title={title} />
        <RelatedPosts
          currentSlug={slug}
          categories={categories || []}
        />
      </div>
    </article>
  );
}