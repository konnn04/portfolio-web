"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useHeader } from "@/components/providers/header-provider";
import { HomeAbout } from "@/components/sections/home-about";
import { HomeExperience } from "@/components/sections/home-experience";
import { HomeCertificates } from "@/components/sections/home-certificates";
import { HomeSkills } from "@/components/sections/home-skills";
import { HomeCodeStats } from "@/components/sections/home-code";
import { HomeProjects } from "@/components/sections/home-projects";
import { HomeBlog } from "@/components/sections/home-blog";
import { ContactSection } from "@/components/sections/contact-section";

// three.js hero must be client-only
const HeroUniverse = dynamic(
  () => import("@/components/sections/hero-universe").then((m) => m.HeroUniverse),
  { ssr: false, loading: () => <div className="min-h-[100dvh] w-full bg-[#05060d]" /> },
);

export default function Home() {
  const { setConfig } = useHeader();

  useEffect(() => {
    setConfig({ isHiddenUntilScroll: true, noBGUntilScroll: true });
  }, [setConfig]);

  // Auto snap-scroll between the hero (#home) and the intro (#about).
  // Custom rAF animation so it is genuinely smooth (native wheel + CSS smooth
  // together were causing an instant jump).
  useEffect(() => {
    let locked = false;
    const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

    const animateTo = (to: number, duration = 780) => {
      locked = true;
      const html = document.documentElement;
      const prevBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto"; // avoid fighting the global smooth rule
      const start = window.scrollY;
      const delta = to - start;
      const t0 = performance.now();
      const step = (now: number) => {
        const p = Math.min((now - t0) / duration, 1);
        window.scrollTo(0, start + delta * easeInOut(p));
        if (p < 1) requestAnimationFrame(step);
        else {
          html.style.scrollBehavior = prevBehavior;
          window.setTimeout(() => (locked = false), 80);
        }
      };
      requestAnimationFrame(step);
    };

    const onWheel = (e: WheelEvent) => {
      if (document.body.dataset.game === "1") return;
      if (locked) {
        e.preventDefault();
        return;
      }
      const home = document.getElementById("home");
      const about = document.getElementById("about");
      if (!home || !about) return;
      const y = window.scrollY;
      const heroH = home.offsetHeight;
      const aboutTop = about.getBoundingClientRect().top + y;

      if (e.deltaY > 4 && y < heroH - 100) {
        e.preventDefault();
        animateTo(aboutTop);
      } else if (e.deltaY < -4 && y >= heroH - 140 && y < aboutTop + about.offsetHeight * 0.45) {
        e.preventDefault();
        animateTo(0);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  // Cross-page hash scroll (e.g. clicking "Contact" from /blogs → /#contact).
  // Sections mount progressively and the hero is loaded dynamically, so the
  // native hash jump fires before the target exists. Retry until it's there,
  // then keep re-correcting for a bit: HomeProjects/HomeBlog fetch their data
  // after mount and grow the page, pushing #contact down after we already
  // scrolled to it.
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const id = decodeURIComponent(hash.slice(1));
      let tries = 0;
      let settled = 0;
      const attempt = () => {
        const el = document.getElementById(id);
        if (!el) {
          if (tries++ < 50) window.setTimeout(attempt, 100);
          return;
        }
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        if (Math.abs(el.getBoundingClientRect().top) < 2) settled++;
        else settled = 0;
        if (settled < 3 && tries++ < 30) window.setTimeout(attempt, 150);
      };
      window.setTimeout(attempt, 80);
    };
    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  return (
    <div className="-mt-16 flex w-full flex-col">
      <HeroUniverse />
      <HomeAbout />
      <HomeExperience />
      <HomeCertificates />
      <HomeSkills />
      <HomeCodeStats />
      <HomeProjects />
      <HomeBlog />
      <ContactSection />
    </div>
  );
}
