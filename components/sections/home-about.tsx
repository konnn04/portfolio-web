"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { MapPin, Github, Linkedin, Facebook, Mail, Youtube, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/providers/providers";
import { useMyInfo } from "@/hooks/use-my-info";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ActivityBubble } from "@/components/sections/activity-bubble";
import { MoreAboutMe } from "@/components/sections/more-about-me";
import { siteConfig } from "@/lib/site-config";
import type { DiscordData } from "@/types/discord";

const SocialIcon = ({ Icon, href, label }: { Icon: React.ElementType; href: string; label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    aria-label={label}
    className="rounded-full border bg-background/50 p-2.5 shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-primary-foreground"
  >
    <Icon className="h-5 w-5" />
  </a>
);

const statusColor = (status?: string) => {
  switch (status) {
    case "online":
      return "bg-green-500";
    case "idle":
      return "bg-yellow-500";
    case "dnd":
      return "bg-destructive";
    default:
      return "bg-muted-foreground";
  }
};

export function HomeAbout() {
  const { lang, t } = useLanguage();
  const { profile } = useMyInfo();
  const [discord, setDiscord] = useState<DiscordData | null>(null);
  const [clicks, setClicks] = useState(0);
  const [moreOpen, setMoreOpen] = useState(false);
  const [flash, setFlash] = useState(0);
  const clicksRef = useRef(0);
  const avatarControls = useAnimationControls();

  const eggOn = siteConfig.features.easterEgg;

  const onAvatarClick = () => {
    if (!eggOn) return;
    avatarControls.start({
      scale: [1, 0.86, 1.14, 1],
      rotate: [0, -4, 4, 0],
      transition: { duration: 0.5, ease: "easeOut" },
    });
    const next = clicksRef.current + 1;
    if (next >= 5) {
      clicksRef.current = 0;
      setClicks(0);
      setMoreOpen((o) => !o); // pure updater — safe under Strict Mode
      setFlash(Date.now()); // fire the screen pulse
    } else {
      clicksRef.current = next;
      setClicks(next);
    }
  };

  const fullName = profile.fullName[lang as keyof typeof profile.fullName] || profile.fullName.en;
  const bio = profile.bio[lang as keyof typeof profile.bio] || profile.bio.en;
  const renderT = (key: string, params?: Record<string, string>) => {
    let str = t(key);
    if (params) for (const k of Object.keys(params)) str = str.replace(`{${k}}`, params[k]);
    return str;
  };

  useEffect(() => {
    if (!siteConfig.features.discord || !profile.discordDataUrl) return;
    const url = `/api/discord?url=${encodeURIComponent(profile.discordDataUrl)}`;
    const load = () =>
      fetch(url)
        .then((r) => r.json())
        .then((j) => {
          if (j.success && j.data?.data) setDiscord(j.data.data);
        })
        .catch(() => {});
    load();
    const id = setInterval(load, 5000); // near-realtime Discord presence (5s)
    return () => clearInterval(id);
  }, [profile.discordDataUrl]);

  const bubblePositions = [
    "top-[6%] right-[-8%] md:right-[-22%]",
    "bottom-[18%] left-[-10%] md:left-[-30%]",
    "bottom-[6%] right-[-6%] md:right-[-22%]",
  ];

  return (
    <section id="about" className="relative w-full scroll-mt-20 py-24 md:py-32">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading index="01" kicker={t("sections.about")} title={renderT("hero.greeting")} />

        <div className="flex flex-col items-center gap-14 md:flex-row md:items-center md:gap-20">
          {/* Avatar */}
          <ScrollReveal direction="right" className="flex-none">
            <div className="relative mx-auto h-60 w-60 sm:h-72 sm:w-72 md:h-80 md:w-80">
              <motion.div
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-primary/40 to-primary/5 blur-2xl"
              />
              <motion.button
                type="button"
                onClick={onAvatarClick}
                animate={avatarControls}
                whileHover={{ scale: 1.03 }}
                aria-label="Toggle secret bio"
                className={`relative block h-full w-full overflow-hidden rounded-[2rem] border-4 border-background shadow-2xl outline-none ${eggOn ? "cursor-pointer" : "cursor-default"}`}
              >
                <Image src="/avatar.jpg" alt={fullName} fill className="object-cover" priority />
              </motion.button>

              {/* interactivity hint: pulsing dashed ring + tooltip */}
              <AnimatePresence>
                {eggOn && !moreOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.25, 0.7, 0.25] }}
                    exit={{ opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                    className="pointer-events-none absolute -inset-2 rounded-[2.4rem] border-2 border-dashed border-brand/50"
                  />
                )}
              </AnimatePresence>
              <AnimatePresence>
                {eggOn && !moreOpen && (
                  <motion.span
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="pointer-events-none absolute -top-3 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-brand/40 bg-background/90 px-3 py-1 font-mono text-[10px] font-medium text-brand shadow-sm backdrop-blur-md"
                  >
                    <Sparkles className="h-3 w-3" /> {t("more.hint")}
                  </motion.span>
                )}
              </AnimatePresence>
              {clicks > 0 && !moreOpen && (
                <div className="absolute -bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 w-1.5 rounded-full transition-colors ${i < clicks ? "bg-brand" : "bg-muted-foreground/30"}`}
                    />
                  ))}
                </div>
              )}
              {discord && (
                <div
                  className={`absolute bottom-[7%] right-[7%] z-20 h-7 w-7 rounded-full border-4 border-background shadow-lg md:h-9 md:w-9 ${statusColor(discord.discord_status)}`}
                  title={`Discord: ${discord.discord_status}`}
                />
              )}
              {discord?.activities?.slice(0, 3).map((act, idx) => (
                <ActivityBubble
                  key={act.id || idx}
                  activity={act}
                  discordData={discord}
                  position={bubblePositions[idx]}
                  index={idx}
                />
              ))}
            </div>
          </ScrollReveal>

          {/* Info */}
          <ScrollReveal direction="left" className="flex-1">
            <div className="flex flex-col items-center gap-5 text-center md:items-start md:text-left">
              <div className="flex w-max items-center gap-2 rounded-full border bg-background/60 px-4 py-2 shadow-sm backdrop-blur-md">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  {renderT("hero.location", { city: profile.city, country: profile.country })}
                </span>
              </div>

              <h3 className="text-3xl font-bold tracking-tight md:text-4xl">
                {fullName}
              </h3>
              <Badge
                variant="secondary"
                className="w-fit border-primary/20 bg-primary/10 px-3 py-1.5 text-sm text-primary"
              >
                {profile.role}
              </Badge>

              <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {bio}
              </p>

              <div className="flex flex-wrap justify-center gap-3 pt-2 md:justify-start">
                <SocialIcon Icon={Github} href={profile.socials.github.href} label="Github" />
                <SocialIcon Icon={Linkedin} href={profile.socials.linkedin.href} label="LinkedIn" />
                <SocialIcon Icon={Facebook} href={profile.socials.facebook.href} label="Facebook" />
                <SocialIcon Icon={Youtube} href={profile.socials.youtube.href} label="Youtube" />
                <SocialIcon Icon={Mail} href={profile.socials.mail.href} label="Mail" />
              </div>
            </div>
          </ScrollReveal>
        </div>

        <AnimatePresence>
          {moreOpen && profile.more && <MoreAboutMe more={profile.more} />}
        </AnimatePresence>
      </div>

      {/* tech pulse when toggling the secret mode */}
      <AnimatePresence>
        {flash > 0 && (
          <motion.div
            key={flash}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            onAnimationComplete={() => setFlash(0)}
            className="pointer-events-none fixed inset-0 z-[60] bg-[radial-gradient(circle_at_center,rgba(255,90,42,0.55),rgba(255,90,42,0.12)_35%,transparent_65%)]"
          >
            <motion.span
              initial={{ scaleX: 0, opacity: 0.95 }}
              animate={{ scaleX: 1, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-[#ff9a5c] to-transparent"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
