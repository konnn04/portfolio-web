"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Coffee, Music, FolderLock, ExternalLink, Sparkles, User, Trophy, Fingerprint, ChevronRight, Film, BookOpen } from "lucide-react";
import { useLanguage } from "@/components/providers/providers";
import type { More } from "@/types/my-info";
import Image from "next/image";

type SpotifyMeta = { title: string; author: string; thumbnail: string | null };

const cardBase = "card-3d shrink-0 snap-start rounded-2xl border border-brand/20 bg-brand/[0.03] backdrop-blur-sm";

function ScrollRow({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const check = () => setOverflow(el.scrollWidth > el.clientWidth + 4);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const advance = () => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const atEnd = el.scrollLeft >= max - 8;
    const page = el.clientWidth * 0.85;
    el.scrollTo({ left: atEnd ? 0 : Math.min(el.scrollLeft + page, max), behavior: "smooth" });
  };

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-brand">
          <Icon className="h-5 w-5" />
          <h4 className="text-sm font-bold uppercase tracking-wider">{title}</h4>
        </div>
        {overflow && (
          <button
            type="button"
            onClick={advance}
            aria-label={`${title}: next`}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-brand/30 bg-brand/5 text-brand transition-colors hover:bg-brand hover:text-brand-foreground active:scale-90"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
      <div
        ref={trackRef}
        className="-ml-3 flex snap-x scroll-smooth gap-4 overflow-x-auto scroll-pl-3 pl-3 pr-6 pt-3 pb-10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
    </section>
  );
}

export function MoreAboutMe({ more }: { more: More }) {
  const { lang, t } = useLanguage();
  const [covers, setCovers] = useState<Record<string, string | null>>({});
  const [tracks, setTracks] = useState<Record<string, SpotifyMeta>>({});

  useEffect(() => {
    let alive = true;
    Promise.all(
      more.games.map(async (g) => {
        try {
          const j = await fetch(`/api/game-cover?name=${encodeURIComponent(g.name)}`).then((r) => r.json());
          return [g.name, (j?.data?.cover as string | null) ?? null] as const;
        } catch {
          return [g.name, null] as const;
        }
      }),
    ).then((entries) => alive && setCovers(Object.fromEntries(entries)));
    return () => {
      alive = false;
    };
  }, [more]);

  useEffect(() => {
    let alive = true;
    Promise.all(
      more.music.map(async (m) => {
        try {
          const j = await fetch(`/api/spotify?url=${encodeURIComponent(m.url)}`).then((r) => r.json());
          if (j?.success) return [m.url, j.data as SpotifyMeta] as const;
        } catch {
        }
        return [m.url, null] as const;
      }),
    ).then((entries) => {
      if (alive) {
        setTracks(Object.fromEntries(entries.filter((e): e is [string, SpotifyMeta] => e[1] !== null)));
      }
    });
    return () => {
      alive = false;
    };
  }, [more]);

  const badge = "inline-flex items-center gap-1 rounded-md border bg-background px-2 py-0.5 text-[11px] font-medium";

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden"
    >
      <div className="mt-16 rounded-3xl border border-dashed border-brand/40 bg-gradient-to-b from-brand/[0.06] to-transparent p-6 md:p-10">
        <div className="mb-10 flex flex-col items-center text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.35em] text-brand">
            <Sparkles className="h-3.5 w-3.5" /> {t("more.kicker")}
          </span>
          <h3 className="text-2xl font-bold tracking-tight md:text-3xl">{t("more.title")}</h3>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">{t("more.subtitle")}</p>
        </div>

        <div className="flex flex-col gap-2">
          {}
          {more.games.length > 0 && (
          <ScrollRow icon={Gamepad2} title={t("more.games")}>
            {more.games.map((g) => {
              const cover = covers[g.name];
              return (
                <div key={g.name} className={`${cardBase} w-[240px] p-3`}>
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-gradient-to-br from-brand/20 to-background">
                    {cover ? (
                      <Image src={cover} alt={g.name} loading="lazy" className="h-full w-full object-cover" width={700} height={700} />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Gamepad2 className="h-10 w-10 text-brand/40" />
                      </div>
                    )}
                  </div>
                  <h5 className="mt-3 truncate text-sm font-bold" title={g.name}>
                    {g.name}
                  </h5>
                  {(g.uid || g.username || g.level) && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {g.username && (
                        <span className={badge}>
                          <User className="h-3 w-3 text-brand" />
                          {g.username}
                        </span>
                      )}
                      {g.uid && (
                        <span className={badge}>
                          <Fingerprint className="h-3 w-3 text-brand" />
                          {g.uid}
                        </span>
                      )}
                      {g.level && (
                        <span className={badge}>
                          <Trophy className="h-3 w-3 text-brand" />
                          {g.level}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </ScrollRow>
          )}

          {}
          {more.hobbies.length > 0 && (
          <ScrollRow icon={Coffee} title={t("more.hobbies")}>
            {more.hobbies.map((h) => {
              const name = h.name[lang] || h.name.en;
              const years = h.startYear ? `${h.startYear} — ${h.endYear ?? t("about.present")}` : "";
              return (
                <div key={name} className={`${cardBase} flex w-[170px] flex-col p-4`}>
                  <Coffee className="h-6 w-6 text-brand" />
                  <h5 className="mt-3 text-sm font-bold leading-snug">{name}</h5>
                  {years && <p className="mt-1 font-mono text-xs text-muted-foreground">{years}</p>}
                </div>
              );
            })}
          </ScrollRow>
          )}

          {/* Movies — favorites */}
          {more.movies.length > 0 && (
          <ScrollRow icon={Film} title={t("more.movies")}>
            {more.movies.map((mv) => {
              const note = mv.note ? mv.note[lang] || mv.note.en : "";
              return (
                <div key={mv.title} className={`${cardBase} flex w-[200px] flex-col p-4`}>
                  <Film className="h-6 w-6 text-brand" />
                  <h5 className="mt-3 text-sm font-bold leading-snug">{mv.title}</h5>
                  {mv.year && <p className="mt-1 font-mono text-xs text-muted-foreground">{mv.year}</p>}
                  {note && <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{note}</p>}
                </div>
              );
            })}
          </ScrollRow>
          )}

          {/* Books — favorites */}
          {more.books.length > 0 && (
          <ScrollRow icon={BookOpen} title={t("more.books")}>
            {more.books.map((bk) => {
              const note = bk.note ? bk.note[lang] || bk.note.en : "";
              return (
                <div key={bk.title} className={`${cardBase} flex w-[200px] flex-col p-4`}>
                  <BookOpen className="h-6 w-6 text-brand" />
                  <h5 className="mt-3 text-sm font-bold leading-snug">{bk.title}</h5>
                  {bk.author && <p className="mt-1 text-xs text-muted-foreground">{bk.author}</p>}
                  {bk.year && <p className="mt-0.5 font-mono text-xs text-muted-foreground">{bk.year}</p>}
                  {note && <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{note}</p>}
                </div>
              );
            })}
          </ScrollRow>
          )}

          {/* Music — Spotify oEmbed */}
          {more.music.length > 0 && (
          <ScrollRow icon={Music} title={t("more.music")}>
            {more.music.map((m) => {
              const meta = tracks[m.url];
              return (
                <a
                  key={m.url}
                  href={m.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`${cardBase} group flex w-[250px] items-center gap-3 p-3 transition-colors hover:border-brand/50`}
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border bg-brand/10">
                    {meta?.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={meta.thumbnail} alt="" loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Music className="h-6 w-6 text-brand/50" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold group-hover:text-brand">
                      {meta?.title || m.title || "Spotify"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {meta?.author || t("more.open_spotify")}
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 shrink-0 opacity-50 transition-opacity group-hover:opacity-100" />
                </a>
              );
            })}
          </ScrollRow>
          )}

          {/* Secret projects */}
          {more.secretProjects.length > 0 && (
          <ScrollRow icon={FolderLock} title={t("more.secret_projects")}>
            {more.secretProjects.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className={`${cardBase} group w-[260px] p-4 transition-colors hover:border-brand/50`}
              >
                <div className="flex items-center gap-2 text-brand">
                  <FolderLock className="h-4 w-4" />
                  <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <h5 className="mt-2 text-sm font-semibold leading-snug group-hover:text-brand">{p.name}</h5>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {p.description[lang] || p.description.en}
                </p>
              </a>
            ))}
          </ScrollRow>
          )}
        </div>
      </div>
    </motion.div>
  );
}
