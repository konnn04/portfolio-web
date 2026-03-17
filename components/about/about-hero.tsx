"use client";

import Image from "next/image";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useLanguage } from "@/components/providers/providers";
import { MapPin, Mail, Github, Linkedin, Facebook, Youtube } from "lucide-react";

interface AboutHeroProps {
  profile: {
    firstName: string;
    middleName?: string;
    lastName: string;
    role: string;
    city: string;
    country: string;
    bio: Record<string, string>;
    socials: Record<string, { href: string; label: string }>;
  };
}

const SocialIcon = ({ Icon, href, label }: { Icon: React.ElementType, href: string, label: string }) => (
  <a href={href} target="_blank" rel="noreferrer" aria-label={label} className="p-2.5 rounded-full bg-background/50 border shadow-sm backdrop-blur-md hover:bg-primary hover:text-white hover:scale-110 transition-all duration-300">
    <Icon className="w-5 h-5" />
  </a>
);

export function AboutHero({ profile }: AboutHeroProps) {
  const { lang, t } = useLanguage();
  const fullName = `${profile.lastName} ${profile.middleName} ${profile.firstName}`;

  const renderT = (key: string, params?: Record<string, string>) => {
    let str = t(key);
    if (params) {
      Object.keys(params).forEach(k => {
        str = str.replace(`{${k}}`, params[k]);
      });
    }
    return str;
  }

  return (
    <section className="relative w-full py-12 md:py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="container px-4 md:px-6 relative z-10 mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          
          {/* Avatar side */}
          <FilterScrollReveal direction="left" delay={0.1} className="flex-shrink-0 relative">
            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-3xl overflow-hidden border-4 border-background shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
               <Image 
                 src="/avatar.jpg" 
                 alt={fullName} 
                 fill 
                 className="object-cover"
                 priority
               />
               <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl" />
            </div>
            
            {/* Floating decoration */}
            <div className="absolute -bottom-6 -left-6 bg-background/80 backdrop-blur-md p-3 rounded-2xl border shadow-lg animate-bounce [animation-duration:3s]">
               <span className="text-3xl">🐬</span>
            </div>
          </FilterScrollReveal>

          {/* Info side */}
          <FilterScrollReveal direction="right" delay={0.2} className="flex-col flex gap-4 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
               {fullName}
            </h1>
            <h2 className="text-xl md:text-2xl text-primary font-bold">
               {profile.role}
            </h2>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-muted-foreground mt-2">
               <div className="flex items-center gap-1.5 bg-secondary/50 px-3 py-1.5 rounded-full text-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{renderT("hero.location", { city: profile.city, country: profile.country })}</span>
               </div>
            </div>

            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mt-4 leading-relaxed">
               {profile.bio[lang] || profile.bio.en}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-6">
               <SocialIcon Icon={Github} href={profile.socials.github.href} label="Github" />
               <SocialIcon Icon={Linkedin} href={profile.socials.linkedin.href} label="LinkedIn" />
               <SocialIcon Icon={Facebook} href={profile.socials.facebook.href} label="Facebook" />
               <SocialIcon Icon={Youtube} href={profile.socials.youtube.href} label="Youtube" />
               <SocialIcon Icon={Mail} href={profile.socials.mail.href} label="Mail" />
            </div>
          </FilterScrollReveal>

        </div>
      </div>
    </section>
  );
}

interface FilterProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
}
const FilterScrollReveal = ({children, className = "", direction, delay = 0}: FilterProps) => {
   return <ScrollReveal className={className} direction={direction} delay={delay}>{children}</ScrollReveal>
};
