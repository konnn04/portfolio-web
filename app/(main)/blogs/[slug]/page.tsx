import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ShareSticky } from "@/components/blogs/share-sticky";
import { RelatedPosts } from "@/components/blogs/related-posts";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { Metadata } from "next";

import { cookies, headers } from "next/headers";

interface Props {
  params: {
    slug: string;
  };
}

// ================= META =================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; 

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
  const { slug } = await params;

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
              <Link
                key={cat}
                href={`/blogs?category=${encodeURIComponent(cat)}`}
                className="rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-sm font-medium text-primary transition hover:bg-primary/20"
              >
                {cat}
              </Link>
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
        <div className="prose dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl prose-img:border prose-code:before:content-none prose-code:after:content-none mb-12">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              code({ className, children, ...props }: { className?: string; children: React.ReactNode } & Record<string, unknown>) {
                const match = /language-(\w+)/.exec(className || "");
                const isInline = !match;

                const codeText = String(children).replace(/\n$/, "");

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
                  <div className="my-4 overflow-hidden rounded-xl bg-[#1E1E1E]">
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match?.[1]}
                      PreTag="div"
                      customStyle={{ margin: 0, padding: "1rem" }}
                      {...props}
                    >
                      {codeText}
                    </SyntaxHighlighter>
                  </div>
                );
              },

              pre({ children }: { children: React.ReactNode }) {
                return <>{children}</>;
              },

              p: ({ node, children, ...props }: { node?: { children?: Array<{ tagName?: string }> }; children: React.ReactNode } & Record<string, unknown>) => {
                const hasImageChild = node?.children?.some(
                  (child) => child.tagName === "img"
                );
                if (hasImageChild) {
                  return <div {...props} className="my-8">{children}</div>;
                }
                return <p {...props}>{children}</p>;
              },

              img: (props: { src?: string; alt?: string } & Record<string, unknown>) => {
                const imageProps = props as { src?: string; alt?: string };
                const imgSrc =
                  typeof imageProps.src === "string" ? imageProps.src : undefined;

                const src = imgSrc?.startsWith("assets/")
                  ? `/blogs/${slug}/${imgSrc}`
                  : imgSrc;

                return (
                  <figure className="my-8 flex flex-col items-center w-full">
                    <Zoom>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        {...props}
                        src={src}
                        className="rounded-xl border shadow-sm max-h-[70vh] w-auto object-contain"
                        alt={imageProps.alt || "Blog image"}
                        loading="lazy"
                      />
                    </Zoom>
                    {imageProps.alt && (
                      <figcaption className="mt-3 text-sm text-center text-muted-foreground">
                        {imageProps.alt}
                      </figcaption>
                    )}
                  </figure>
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