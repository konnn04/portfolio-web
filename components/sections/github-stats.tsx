"use client";

import { useEffect, useState } from "react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useLanguage } from "@/components/providers/providers";
import { GitCommit, Users, BookOpen } from "lucide-react";
import { useMyInfo } from "@/hooks/use-my-info";

interface GithubData {
  user: {
    followers: number;
    publicRepos: number;
    login: string;
  };
  langCommitCount: Record<string, number>;
}

export function GithubStats() {
  const { t } = useLanguage();
  const [data, setData] = useState<GithubData | null>(null);
  const [loading, setLoading] = useState(true);

  const { profile } = useMyInfo();


  const username = profile?.socials?.github?.label;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/github?username=${username}`);
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (error) {
        console.error("Error fetching github stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  const totalCommits = data
    ? Object.values(data.langCommitCount).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <section className="w-full py-20 bg-background relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[800px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="flex flex-col items-center justify-center text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              {t("github.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {t("github.description")}
            </p>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-8 animate-pulse">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl mx-auto">
              {[1, 2, 3].map(i => <div key={i} className="h-24 bg-muted/30 rounded-2xl" />)}
            </div>
            <div className="w-full h-[200px] bg-muted/30 rounded-2xl max-w-4xl mx-auto" />
          </div>
        ) : (
          <div className="space-y-12">
            <ScrollReveal delay={0.1}>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl mx-auto">
                <div className="bg-secondary/40 backdrop-blur-md border rounded-2xl p-6 flex flex-col items-center text-center hover:bg-secondary/60 transition-colors">
                  <Users className="w-6 h-6 text-primary mb-3" />
                  <span className="text-3xl font-bold mb-1">{data?.user.followers || 0}</span>
                  <span className="text-sm text-muted-foreground">{t("github.followers")}</span>
                </div>
                <div className="bg-secondary/40 backdrop-blur-md border rounded-2xl p-6 flex flex-col items-center text-center hover:bg-secondary/60 transition-colors">
                  <BookOpen className="w-6 h-6 text-primary mb-3" />
                  <span className="text-3xl font-bold mb-1">{data?.user.publicRepos || 0}</span>
                  <span className="text-sm text-muted-foreground">{t("github.repositories")}</span>
                </div>
                <div className="bg-secondary/40 backdrop-blur-md border rounded-2xl p-6 flex flex-col items-center text-center hover:bg-secondary/60 transition-colors">
                  <GitCommit className="w-6 h-6 text-primary mb-3" />
                  <span className="text-3xl font-bold mb-1">{totalCommits}</span>
                  <span className="text-sm text-muted-foreground">{t("github.total_commits")}</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Widgets Section */}
            <div className="flex flex-col gap-8 items-center max-w-4xl mx-auto">
              <ScrollReveal delay={0.2} className="w-full">
                <div className="bg-secondary/20 backdrop-blur-sm border rounded-2xl p-4 overflow-hidden w-full">
                  <h2 className="text-xl font-bold text-center">{t("github.trophies")}</h2>
                  <div className="w-full mt-4 flex justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://trophygh.kolioaris.xyz/?username=${username}&theme=onedark&no-bg=true&margin-w=15&margin-h=15&no-frame=true`}
                      alt="GitHub Trophies"
                      loading="lazy"
                      className="w-full max-w-full object-contain"
                    />
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.3} className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-secondary/20 backdrop-blur-sm border rounded-2xl p-4 flex justify-center w-full min-h-[180px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://github-readme-stats.vercel.app/api?username=${username}&hide_border=true&bg_color=00000000&title_color=A855F7&text_color=9CA3AF&icon_color=A855F7&show_icons=true&disable_animations=true&custom_title=${t("github.my_stats")}`}
                      alt="GitHub Stats"
                      loading="lazy"
                      className="w-full object-contain max-h-[200px]"
                    />
                  </div>
                  <div className="bg-secondary/20 backdrop-blur-sm border rounded-2xl p-4 flex justify-center w-full min-h-[180px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&hide_border=true&bg_color=00000000&title_color=A855F7&text_color=9CA3AF&custom_title=${t("github.top_lang")}&hide=html,css,shell`}
                      alt="Top Languages"
                      loading="lazy"
                      className="w-full object-contain max-h-[200px]"
                    />
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
