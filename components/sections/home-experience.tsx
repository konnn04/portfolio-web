"use client";

import myInfo from "@/configs/data/my-info";
import { AboutTimeline } from "@/components/about/about-timeline";
import { SectionHeading } from "@/components/ui/section-heading";
import { useLanguage } from "@/components/providers/providers";

interface School {
  name: Record<string, string>;
  majors: { name: Record<string, string>; startDate: string; endDate: string; gpa?: string }[];
  activities?: {
    name: Record<string, string>;
    startDate: string;
    endDate: string;
    description: Record<string, string>;
    links?: string[];
  }[];
}
interface Exp {
  position: Record<string, string>;
  company: Record<string, string>;
  startDate: string;
  endDate?: string;
  description: Record<string, string>;
  links?: string[];
}

export function HomeExperience() {
  const { t } = useLanguage();
  const { profile } = myInfo;

  const educationItems = profile.schools.map((school: School, i: number) => ({
    id: `edu-${i}`,
    type: "education" as const,
    title: school.name,
    subtitle: school.majors[0]?.name,
    startDate: school.majors[0]?.startDate,
    endDate: school.majors[0]?.endDate,
    gpa: school.majors[0]?.gpa,
    activities: school.activities?.map((act, j) => ({
      id: `act-${i}-${j}`,
      name: act.name,
      description: act.description,
      startDate: act.startDate,
      endDate: act.endDate,
      links: act.links,
    })),
  }));

  const experienceItems = profile.experiences.map((exp: Exp, i: number) => ({
    id: `exp-${i}`,
    type: "work" as const,
    title:exp.company,
    subtitle:  exp.position,
    startDate: exp.startDate,
    endDate: exp.endDate,
    description: exp.description,
    links: exp.links,
  }));

  return (
    <section id="experience" className="relative w-full scroll-mt-20 py-24 md:py-32">
      <div className="container mx-auto max-w-5xl px-4 md:px-6">
        <SectionHeading
          index="02"
          kicker={t("sections.experience")}
          title={`${t("about.experience")} & ${t("about.education")}`}
        />

        <div className="flex flex-col gap-16">
          <AboutTimeline items={experienceItems} title={t("about.experience")} icon="work" />
          <AboutTimeline items={educationItems} title={t("about.education")} icon="education" />
        </div>
      </div>
    </section>
  );
}
