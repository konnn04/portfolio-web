"use client";

import myInfo from "@/configs/data/my-info";
import { AboutSkills } from "@/components/about/about-skills";
import { SectionHeading } from "@/components/ui/section-heading";
import { useLanguage } from "@/components/providers/providers";

export function HomeSkills() {
  const { t } = useLanguage();
  const { profile } = myInfo;

  return (
    <section id="skills" className="relative w-full scroll-mt-20 py-24 md:py-32">
      <div className="container mx-auto max-w-5xl px-4 md:px-6">
        <SectionHeading index="04" kicker={t("sections.skills")} title={t("about.skills")} />

        <AboutSkills skills={profile.skills} hideHeader />
      </div>
    </section>
  );
}
