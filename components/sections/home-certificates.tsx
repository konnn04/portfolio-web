"use client";

import myInfo from "@/configs/data/my-info";
import { AboutTimeline } from "@/components/about/about-timeline";
import { SectionHeading } from "@/components/ui/section-heading";
import { useLanguage } from "@/components/providers/providers";

interface Cert {
  name: Record<string, string>;
  organization: Record<string, string>;
  issueDate: string;
}

export function HomeCertificates() {
  const { t } = useLanguage();
  const { profile } = myInfo;

  const certificateItems = (profile.certificates as Cert[])?.map((cert, i) => ({
    id: `cert-${i}`,
    type: "certificate" as const,
    title: cert.name,
    subtitle: cert.organization,
    startDate: cert.issueDate,
    endDate: "",
  })) || [];

  if (certificateItems.length === 0) return null;

  return (
    <section id="certificates" className="relative w-full scroll-mt-20 py-24 md:py-32">
      <div className="container mx-auto max-w-5xl px-4 md:px-6">
        <SectionHeading index="03" kicker={t("sections.certificates")} title={t("about.certificates")} />

        <AboutTimeline items={certificateItems} title={t("about.certificates")} icon="certificate" hideHeader />
      </div>
    </section>
  );
}
