"use client";

import { type CSSProperties } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const syntaxHighlighterStyle = vscDarkPlus as unknown as Record<string, CSSProperties>;

const buildComponents = (slug?: string): Components => ({
  code: ({ className, children, ...props }) => {
    const match = /language-(\w+)/.exec(String(className || ""));
    const isInline = !match;
    const codeText = String(children).replace(/\n$/, "");
    if (isInline) {
      return (
        <code className="px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 font-mono text-sm" {...props}>
          {codeText}
        </code>
      );
    }
    return (
      <div className="my-4 overflow-hidden rounded-xl bg-[#1E1E1E]">
        <SyntaxHighlighter
          // @ts-expect-error react-syntax-highlighter style type mismatch
          style={syntaxHighlighterStyle}
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
  pre: ({ children }) => <>{children}</>,
  // Markdown wraps `![]()` in a <p>, but our image renders a <figure> (block
  // element with figcaption) — invalid nested in <p> and triggers a hydration
  // error. Swap to a <div> whenever the paragraph's only content is an image.
  p: ({ node, children, ...props }) => {
    const hasImageChild =
      Array.isArray(node?.children) &&
      node.children.some(
        (child) => typeof child === "object" && child !== null && "tagName" in child && (child as { tagName?: string }).tagName === "img",
      );
    if (hasImageChild) return <div {...props} className="my-8">{children}</div>;
    return <p {...props}>{children}</p>;
  },
  img: ({ src, alt, ...props }) => {
    let imgSrc = typeof src === "string" ? src.replace(/\\/g, "/") : undefined; // normalize Windows-style paths
    if (imgSrc?.startsWith("assets/") && slug) imgSrc = `/projects/${slug}/${imgSrc}`;
    else if (imgSrc) imgSrc = imgSrc.replace(/^public\//, "/");
    const altText = typeof alt === "string" ? alt : undefined;
    return (
      <figure className="my-8 flex w-full flex-col items-center">
        <Zoom>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            {...props}
            src={imgSrc}
            className="max-h-[70vh] w-auto rounded-xl border object-contain shadow-sm"
            alt={altText || "Project image"}
            loading="lazy"
          />
        </Zoom>
        {altText && <figcaption className="mt-3 text-center text-sm text-muted-foreground">{altText}</figcaption>}
      </figure>
    );
  },
});

export function ProjectContent({ content, slug }: { content: string; slug?: string }) {
  return (
    <div className="prose dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl prose-img:border prose-code:before:content-none prose-code:after:content-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={buildComponents(slug)}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
