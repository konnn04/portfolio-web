import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import { cookies, headers } from "next/headers";
import "../globals.css";

import { Providers } from "@/components/providers/providers";
import { Header } from "@/components/layouts/header";
import { Footer } from "@/components/layouts/footer";
import { MobileDock } from "@/components/layouts/mobile-dock";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HeaderProvider } from "@/components/providers/header-provider";
import { siteConfig } from "@/lib/site-config";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | My Portfolio`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Konnn04",
    "portfolio",
    "web development",
    "software engineering",
    "open-source",
    "projects",
    "blogs",
    "about me",
  ],
  authors: [{ name: siteConfig.author, url: siteConfig.url }],
  creator: siteConfig.author,
  openGraph: {
    type: "website",
    locale: "vi_VN",
    alternateLocale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | My Portfolio`,
    description: siteConfig.description,
    images: [{ url: "/avatar.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | My Portfolio`,
    description: siteConfig.description,
    images: ["/avatar.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();

  let lang = cookieStore.get("language")?.value as "en" | "vi" | undefined;

  if (!lang) {
    const headersList = await headers();
    const acceptLang = headersList.get("accept-language") || "";
    lang = acceptLang.includes("vi") ? "vi" : "en";
  }

  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Providers initialLang={lang}>
          <HeaderProvider>
            <TooltipProvider>
              <Header />
              <main className="flex-1 mt-16 mb-20 md:mb-0">{children}</main>
              <Footer />
              <MobileDock />
            </TooltipProvider>
          </HeaderProvider>
        </Providers>
      </body>
    </html>
  );
}