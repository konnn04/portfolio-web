"use client";

import { useEffect } from "react";
import { useHeader } from "@/components/providers/header-provider";
import { HeroSection } from "@/components/sections/home-hero-section";

export default function Home() {
  const { setConfig } = useHeader();

  useEffect(() => {
    setConfig({ isHiddenUntilScroll: true, noBGUntilScroll: true });
  }, [setConfig]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <HeroSection />
    </main>
  );
}
