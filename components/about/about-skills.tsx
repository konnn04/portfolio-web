"use client";

import { useState, useEffect } from "react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Code2, Layers, Database, Wrench, ExternalLink, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/providers/providers";
import { motion } from "framer-motion";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface AboutSkillsProps {
  skills: {
    lang: string[];
    frameworks: string[];
    databases: string[];
    tools: string[];
  }
}

function normalizeIconName(skill: string) {
  const mapping: Record<string, string> = {
    "react native": "react",
    "next.js": "nextdotjs",
    "node.js": "nodedotjs",
    "vue.js": "vuedotjs",
    "tailwind css": "tailwindcss",
    "golang": "go",
    // just some common exceptions
  };
  const lower = skill.toLowerCase();
  if (mapping[lower]) return mapping[lower];
  return lower.replace(/\.js$/, "dotjs").replace(/[^a-z0-9]/g, "");
}

function TechTooltip({ keyword }: { keyword: string }) {
  const [data, setData] = useState<{ title: string; snippet: string; pageid: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWiki() {
      try {
        setLoading(true);
        
        let targetWikiTitle = "";
        
        // 1. Map directly if we know the exact precise page title
        const exactMap: Record<string, string> = {
          "React": "React (software)",
          "NodeJS": "Node.js",
          "NextJS": "Next.js",
          "Next.js": "Next.js",
          "TailwindCSS": "Tailwind CSS",
          "ExpressJS": "Express.js",
          "Cloudflare": "Cloudflare",
          "PostgreSQL": "PostgreSQL",
          "MongoDB": "MongoDB",
          "Firebase": "Firebase",
          "Zustand": "Zustand",
          "Redux": "Redux (JavaScript library)",
          "Prisma": "Prisma (database tools)",
          "TypeScript": "TypeScript",
          "JavaScript": "JavaScript",
          "Golang": "Go (programming language)",
          "Go": "Go (programming language)",
          "PHP": "PHP",
          "Laravel": "Laravel",
          "Fastify": "Fastify",
          "Django": "Django (web framework)",
          "Flask": "Flask (web framework)",
          "Gin": "Gin (web framework)",
          "MySQL": "MySQL",
          "Redis": "Redis",
          "Supabase": "Supabase",
          "Git": "Git",
          "Docker": "Docker (software)",
          "Apache": "Apache HTTP Server",
          "Nginx": "Nginx"
        };
        
        type WikiSearchItem = {
          title: string;
          snippet: string;
          pageid: number;
        };

        let dataFound: WikiSearchItem | null = null;

        if (exactMap[keyword]) {
          targetWikiTitle = exactMap[keyword];
          const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=intitle:"${targetWikiTitle}"&utf8=&format=json&origin=*`;
          const res = await fetch(url);
          const json = await res.json() as { query?: { search?: WikiSearchItem[] } };
          if (json.query?.search?.length) {
            dataFound = json.query.search.find((item) => item.title.toLowerCase() === targetWikiTitle.toLowerCase()) || json.query.search[0];
          }
        }

        if (!dataFound) {
          // 2. Try generic search with refined keywords matching exact phrase first
          const refinedSearch = encodeURIComponent(`"${keyword}" AND (software OR programming OR framework OR platform OR computing OR IT)`);
          const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${refinedSearch}&utf8=&format=json&origin=*`);
          const json = await res.json();
          
          if (json.query && json.query.search.length > 0) {
            dataFound = json.query.search[0];
          } else {
            // 3. Fallback simple search
            const fbRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(keyword)}&utf8=&format=json&origin=*`);
            const fbJson = await fbRes.json();
            if (fbJson.query && fbJson.query.search.length > 0) {
              dataFound = fbJson.query.search[0];
            }
          }
        }

        setData(dataFound);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchWiki();
  }, [keyword]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return <div className="text-sm text-muted-foreground p-2">Không tìm thấy thông tin trên Wikipedia.</div>;
  }

  return (
    <div className="flex flex-col gap-2 p-1">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">{data.title}</h4>
        <a 
          href={`https://en.wikipedia.org/?curid=${data.pageid}`} 
          target="_blank" 
          rel="noreferrer"
          className="text-xs text-primary flex items-center gap-1 hover:underline"
        >
          <ExternalLink className="w-3 h-3" /> Wiki
        </a>
      </div>
      <p 
        className="text-xs text-muted-foreground line-clamp-4 leading-relaxed [&>span.searchmatch]:font-bold [&>span.searchmatch]:text-foreground"
        dangerouslySetInnerHTML={{ __html: data.snippet + "..." }}
      />
    </div>
  );
}

export function AboutSkills({ skills }: AboutSkillsProps) {
  const { t } = useLanguage();

  const skillGroups = [
    {
      id: "languages",
      title: "Languages",
      icon: Code2,
      items: skills.lang,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      shadow: "hover:shadow-blue-500/10"
    },
    {
      id: "frameworks",
      title: "Frameworks & Libraries",
      icon: Layers,
      items: skills.frameworks,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      shadow: "hover:shadow-purple-500/10"
    },
    {
      id: "databases",
      title: "Databases",
      icon: Database,
      items: skills.databases,
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
      shadow: "hover:shadow-green-500/10"
    },
    {
      id: "tools",
      title: "Tools & DevOps",
      icon: Wrench,
      items: skills.tools,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
      shadow: "hover:shadow-orange-500/10"
    }
  ];

  return (
    <section className="mb-16">
      <ScrollReveal>
        <div className="flex items-center justify-center text-center gap-4 mb-12">
          <h3 className="text-3xl font-bold tracking-tight">{t("about.skills")}</h3>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skillGroups.map((group, idx) => {
          const Icon = group.icon;
          return (
            <ScrollReveal key={group.id} delay={idx * 0.1}>
              <motion.div 
                whileHover={{ y: -5 }}
                className={`h-full bg-secondary/30 backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 hover:bg-secondary/50 hover:shadow-xl ${group.shadow}`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${group.bg} ${group.border} border`}>
                    <Icon className={`w-5 h-5 ${group.color}`} />
                  </div>
                  <h4 className="text-xl font-bold">{group.title}</h4>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {group.items.map((skill, i) => (
                    <HoverCard key={i}>
                      <HoverCardTrigger asChild>
                        <button 
                          onClick={() => window.open(`https://google.com/search?q=${encodeURIComponent(skill + ' technology')}`, '_blank')}
                          className="px-4 py-2 bg-background border rounded-lg text-sm font-medium hover:border-primary/60 hover:text-primary hover:shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex items-center gap-2"
                        >
                          <img 
                            src={`https://cdn.simpleicons.org/${normalizeIconName(skill)}`} 
                            alt={skill} 
                            className="w-4 h-4 dark:invert transition-all group-hover:scale-110" 
                            onError={(e) => {
                              // If icon not found, just hide it safely
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <span>{skill}</span>
                        </button>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80" align="start" side="bottom">
                        <TechTooltip keyword={skill} />
                      </HoverCardContent>
                    </HoverCard>
                  ))}
                </div>
              </motion.div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
