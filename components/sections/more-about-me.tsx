"use client";

import { motion } from "framer-motion";
import { Gamepad2, Coffee, Music, FolderLock, ExternalLink, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/providers/providers";

interface MoreData {
  games: string[];
  hobbies: Record<string, string[]>;
  music: { title: string; url: string }[];
  secretProjects: { name: string; description: Record<string, string>; url: string }[];
}

const cardCls =
  "card-3d rounded-2xl border border-brand/20 bg-brand/[0.03] p-5 backdrop-blur-sm";

export function MoreAboutMe({ more }: { more: MoreData }) {
  const { lang, t } = useLanguage();
  const hobbies = more.hobbies[lang] || more.hobbies.en || [];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden"
    >
      <div className="mt-16 rounded-3xl border border-dashed border-brand/40 bg-gradient-to-b from-brand/[0.06] to-transparent p-6 md:p-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.35em] text-brand">
            <Sparkles className="h-3.5 w-3.5" /> {t("more.kicker")}
          </span>
          <h3 className="text-2xl font-bold tracking-tight md:text-3xl">{t("more.title")}</h3>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">{t("more.subtitle")}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Games */}
          <div className={cardCls}>
            <div className="mb-4 flex items-center gap-2 text-brand">
              <Gamepad2 className="h-5 w-5" />
              <h4 className="text-sm font-bold uppercase tracking-wider">{t("more.games")}</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {more.games.map((g) => (
                <span key={g} className="rounded-lg border bg-background px-3 py-1.5 text-sm font-medium">
                  {g}
                </span>
              ))}
            </div>
          </div>

          {/* Hobbies */}
          <div className={cardCls}>
            <div className="mb-4 flex items-center gap-2 text-brand">
              <Coffee className="h-5 w-5" />
              <h4 className="text-sm font-bold uppercase tracking-wider">{t("more.hobbies")}</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {hobbies.map((h) => (
                <span key={h} className="rounded-lg border bg-background px-3 py-1.5 text-sm font-medium">
                  {h}
                </span>
              ))}
            </div>
          </div>

          {/* Music */}
          <div className={cardCls}>
            <div className="mb-4 flex items-center gap-2 text-brand">
              <Music className="h-5 w-5" />
              <h4 className="text-sm font-bold uppercase tracking-wider">{t("more.music")}</h4>
            </div>
            <div className="flex flex-col gap-2">
              {more.music.map((m) => (
                <a
                  key={m.url}
                  href={m.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between gap-3 rounded-lg border bg-background px-3 py-2 text-sm transition-colors hover:border-brand/50 hover:text-brand"
                >
                  <span className="truncate font-medium">{m.title}</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-60 transition-opacity group-hover:opacity-100" />
                </a>
              ))}
            </div>
          </div>

          {/* Secret projects */}
          <div className={cardCls}>
            <div className="mb-4 flex items-center gap-2 text-brand">
              <FolderLock className="h-5 w-5" />
              <h4 className="text-sm font-bold uppercase tracking-wider">{t("more.secret_projects")}</h4>
            </div>
            <div className="flex flex-col gap-3">
              {more.secretProjects.map((p) => (
                <a
                  key={p.name}
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-lg border bg-background p-3 transition-colors hover:border-brand/50"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold group-hover:text-brand">
                    {p.name}
                    <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {p.description[lang] || p.description.en}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
