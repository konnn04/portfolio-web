"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useLanguage } from "@/components/providers/providers";
import { MapPin, Github, Linkedin, Facebook, Mail, Youtube, ArrowRight } from "lucide-react";
import { useMyInfo } from "@/hooks/use-my-info";
import type { DiscordData } from "@/types/discord";
import { ActivityBubble } from "@/components/sections/activity-bubble";
import { RetroGrid } from "@/components/sections/retro-grid";

const SocialIcon = ({ Icon, href, label }: { Icon: React.ElementType, href: string, label: string }) => (
  <a href={href} target="_blank" rel="noreferrer" aria-label={label} className="p-2.5 rounded-full bg-background/50 border shadow-sm backdrop-blur-md hover:bg-primary hover:text-white hover:scale-110 transition-all duration-300">
    <Icon className="w-5 h-5" />
  </a>
);

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { lang, t } = useLanguage();
  
  const [discordData, setDiscordData] = useState<DiscordData | null>(null);

  const { profile } = useMyInfo();
  const fullName = `${profile.firstName} ${profile.middleName} ${profile.lastName}`;

  const renderT = (key: string, params?: Record<string, string>) => {
    let str = t(key);
    if (params) {
      Object.keys(params).forEach(k => {
        str = str.replace(`{${k}}`, params[k]);
      });
    }
    return str;
  }

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 60, damping: 25, mass: 2 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const backgroundX = useTransform(smoothX, [-0.5, 0.5], [320, -320]);
  const backgroundY = useTransform(smoothY, [-0.5, 0.5], [80, -80]);

  const imageX = useTransform(smoothX, [-0.5, 0.5], [-20, 20]);
  const imageY = useTransform(smoothY, [-0.5, 0.5], [-20, 20]);

  const floatX = useTransform(smoothX, [-0.5, 0.5], [-35, 35]);
  const floatY = useTransform(smoothY, [-0.5, 0.5], [-35, 35]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);

    if (profile.discordDataUrl) {
      const fetchUrl = `/api/discord?url=${encodeURIComponent(profile.discordDataUrl)}`;
      fetch(fetchUrl)
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            setDiscordData(json.data);
          }
        })
        .catch(console.error);
    }
    
    const interval = setInterval(() => {
      if (profile.discordDataUrl) {
        const fetchUrl = `/api/discord?url=${encodeURIComponent(profile.discordDataUrl)}`;
        fetch(fetchUrl)
          .then((res) => res.json())
          .then((json) => {
            if (json.success) setDiscordData(json.data);
          }).catch(() => {});
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [profile.discordDataUrl]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  if (!isMounted) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500 opacity-100";
      case "idle": return "bg-yellow-500 opacity-100";
      case "dnd": return "bg-destructive opacity-100";
      default: return "bg-muted-foreground opacity-50";
    }
  };

  const bubblePositions = [
    "top-[10%] right-[-10%] md:top-[10%] md:right-[-25%]",
    "bottom-[15%] left-[-15%] md:bottom-[15%] md:left-[-35%]",
    "bottom-[10%] right-[-5%] md:bottom-[10%] md:right-[-25%]"
  ];

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex min-h-[95vh] w-full items-center justify-center overflow-hidden pt-20 pb-10"
    >
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 md:h-96 md:w-96 rounded-full bg-primary/20 blur-[100px] md:blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-48 w-48 md:h-80 md:w-80 rounded-full bg-accent/20 blur-[80px] md:blur-[100px]" />
      </div>

      <RetroGrid mouseX={mouseX} mouseY={mouseY} />

      <motion.div
        style={{ x: backgroundX, y: backgroundY }}
        className="absolute top-[5%] md:top-[10%] z-0 flex w-full select-none items-center justify-center text-center opacity-30 dark:opacity-40 pointer-events-none"
      >
        <h1
          className="whitespace-nowrap text-[10vw] font-black uppercase tracking-normal text-transparent"
          style={{ WebkitTextStroke: "2px var(--primary)" }}
        >
          {fullName}
        </h1>
      </motion.div>

      <div className="container relative z-10 mx-auto px-4 w-full max-w-7xl mt-8 pt-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-4 h-full">
          
          <motion.div 
            style={{ x: imageX, y: imageY }}
            className="order-2 md:order-1 flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-4 w-full mt-4 md:mt-0"
          >
            <div className="flex items-center gap-3 bg-secondary/50 backdrop-blur-md px-4 py-2 rounded-full border shadow-sm w-max mx-auto md:mx-0">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{renderT("hero.location", { city: profile.city, country: profile.country })}</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-4">
                <motion.div 
                  style={{ x: floatX, y: floatY }}
                  className="text-4xl md:text-5xl origin-bottom-left inline-block"
                  animate={{ rotate: [0, 20, -5, 20, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5, repeatType: "mirror" }}
                >
                  👋
                </motion.div>
                <h2 className="text-2xl font-bold lg:text-4xl md:text-3xl text-balance">
                  {renderT("hero.greeting")}
                </h2>
              </div>
              <h3 className="text-xl lg:text-3xl md:text-2xl font-bold text-primary italic">
                  {renderT("hero.role", { role: profile.role })}
              </h3>
              <p className="text-muted-foreground text-base md:text-lg max-w-sm mx-auto md:mx-0 mt-4">
                {profile.bio[lang as keyof typeof profile.bio] || profile.bio.en}
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
               <SocialIcon Icon={Github} href={profile.socials.github.href} label="Github" />
               <SocialIcon Icon={Linkedin} href={profile.socials.linkedin.href} label="LinkedIn" />
               <SocialIcon Icon={Facebook} href={profile.socials.facebook.href} label="Facebook" />
               <SocialIcon Icon={Youtube} href={profile.socials.youtube.href} label="Youtube" />
               <SocialIcon Icon={Mail} href={profile.socials.mail.href} label="Mail" />
            </div>
          </motion.div>

          <div className="order-1 md:order-2 flex-none relative mx-auto flex flex-col items-center justify-center -mt-8 md:mt-0 z-20">
            <motion.div 
              style={{ x: floatX, y: floatY }}
              className="relative w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96"
            >
              <div className="absolute inset-0 rounded-full bg-linear-to-br from-primary/40 to-secondary backdrop-blur-3xl animate-pulse [animation-duration:5s]" />
              
              <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-background shadow-2xl z-10 transition-transform duration-500 hover:scale-[1.02]">
                <Image
                  src="/avatar.jpg"
                  alt={fullName}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {discordData && (
                <div 
                  className={`absolute bottom-[8%] right-[8%] z-20 h-7 w-7 md:h-9 md:w-9 rounded-full border-4 border-background shadow-lg transition-transform hover:scale-110 cursor-help ${getStatusColor(discordData.discord_status)}`} 
                  title={`Status: ${discordData.discord_status}`}
                />
              )}

              {discordData?.activities?.slice(0, 3).map((act, idx) => (
                <ActivityBubble
                  key={act.id || idx}
                  activity={act}
                  discordData={discordData}
                  position={bubblePositions[idx]}
                  index={idx}
                />
              ))}
            </motion.div>
          </div>

          <motion.div 
            style={{ x: imageX, y: imageY }}
            className="order-3 md:order-3 flex-1 flex flex-col justify-center items-center md:items-end w-full space-y-4 mt-8 md:mt-0"
          >
            <Link href="/projects" className="group relative w-full max-w-64 p-0.5 rounded-2xl bg-linear-to-r from-primary to-accent overflow-hidden transition-transform hover:scale-[1.03] active:scale-95">
              <div className="absolute inset-0 bg-linear-to-r from-primary to-accent blur-sm opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center justify-between bg-background/90 backdrop-blur-md px-5 py-4 rounded-[14px]">
                <div className="flex flex-col text-left">
                  <span className="text-lg font-bold text-foreground">{renderT("nav.view_projects")}</span>
                  <span className="text-xs text-muted-foreground mt-1">Explore my works</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link href="/blogs" className="group relative w-full max-w-64 p-0.5 rounded-2xl bg-linear-to-r from-accent to-secondary overflow-hidden transition-transform hover:scale-[1.03] active:scale-95">
              <div className="relative flex items-center justify-between bg-background/90 backdrop-blur-md px-5 py-4 rounded-[14px] border border-transparent group-hover:border-accent/50 transition-colors">
                <div className="flex flex-col text-left">
                  <span className="text-lg font-bold text-foreground">{renderT("nav.read_blogs")}</span>
                  <span className="text-xs text-muted-foreground mt-1">Check out my insights</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
