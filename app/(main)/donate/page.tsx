"use client";

import { useEffect, type ComponentType } from "react";
import Link from "next/link";
import { ArrowRight, Coffee, Landmark, Wallet } from "lucide-react";
import { useHeader } from "@/components/providers/header-provider";
import { useLanguage } from "@/components/providers/providers";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Button } from "@/components/ui/button";
import myInfo from "@/configs/data/my-info.json";

type DonatePlatform = string | { vi: string; en: string };

type DonateItem = {
  platform: DonatePlatform;
  accountName: string;
  accountNumber: string;
  icon: "wallet" | "landmark" | "coffee";
  link?: string;
};

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  wallet: Wallet,
  landmark: Landmark,
  coffee: Coffee,
};

export default function DonatePage() {
  const { t, lang } = useLanguage();
  const { setConfig } = useHeader();

  useEffect(() => {
    setConfig({ isHiddenUntilScroll: false, noBGUntilScroll: false });
  }, [setConfig]);

  const donateItems = (myInfo.profile.donate || []) as DonateItem[];

  const getPlatformLabel = (platform: string | { vi: string; en: string }) =>
    typeof platform === "string" ? platform : platform[lang] || platform.en;

  return (
    <div className="min-h-screen py-20">
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <ScrollReveal>
          <div className="max-w-3xl space-y-6 mb-12">
            <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 ring-1 ring-red-400/20">
              <ArrowRight className="w-4 h-4" />
              {t("donate.support_label")}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              {t("donate.title")}
            </h1>
            <p className="text-lg text-muted-foreground leading-8">
              {t("donate.description")}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {donateItems.map((item, idx) => {
              const Icon = iconMap[item.icon] || Wallet;
              return (
                <div key={`${item.platform}-${idx}`} className="rounded-3xl border border-border/70 bg-card p-6 shadow-xl transition hover:-translate-y-1 duration-300">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="grid h-14 w-14 place-items-center rounded-3xl bg-red-500/10 text-red-500">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-foreground">{getPlatformLabel(item.platform)}</p>
                        <p className="text-sm text-muted-foreground">{item.accountName}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                      {t("donate.support")}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {item.accountNumber ? (
                      <div className="rounded-3xl bg-muted/50 p-4 text-sm text-foreground">
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{t("donate.account_number")}</p>
                        <p className="mt-2 font-medium">{item.accountNumber}</p>
                      </div>
                    ) : null}

                    {item.link ? (
                      <Button asChild variant="secondary" className="w-full">
                        <Link href={item.link} target="_blank" rel="noreferrer">
                          {t("donate.visit_link")}
                        </Link>
                      </Button>
                    ) : (
                      <div className="rounded-3xl bg-muted/50 p-4 text-sm text-muted-foreground">
                        {t("donate.copy_info")}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
