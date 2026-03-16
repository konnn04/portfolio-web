"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Headphones, Gamepad2, ExternalLink } from "lucide-react";
import type { DiscordActivity, DiscordData } from "@/types/discord";

function formatElapsed(startMs: number): string {
  const elapsed = Date.now() - startMs;
  const mins = Math.floor(elapsed / 60000);
  const secs = Math.floor((elapsed % 60000) / 1000);
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}

function getActivityThumbnail(act: DiscordActivity, discordData: DiscordData): string | null {
  if (act.type === 2 && discordData.spotify?.album_art_url) {
    return discordData.spotify.album_art_url;
  }
  if (act.assets?.large_image) {
    const img = act.assets.large_image;
    if (img.startsWith("mp:")) {
      return `https://media.discordapp.net/${img.slice(3)}`;
    }
    return `https://cdn.discordapp.com/app-assets/${act.id}/${img}.png`;
  }
  return null;
}

interface ActivityBubbleProps {
  activity: DiscordActivity;
  discordData: DiscordData;
  position: string;
  index: number;
}

export function ActivityBubble({ activity, discordData, position, index }: ActivityBubbleProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [elapsed, setElapsed] = useState("0s");

  const thumbnail = getActivityThumbnail(activity, discordData);
  const isSpotify = activity.type === 2 && discordData.spotify;
  const isCustomStatus = activity.type === 4;
  const spotifyUrl = discordData.spotify?.track_id
    ? `https://open.spotify.com/track/${discordData.spotify.track_id}`
    : null;

  useEffect(() => {
    if (!activity.timestamps?.start) return;
    const update = () => setElapsed(formatElapsed(activity.timestamps!.start!));
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [activity.timestamps]);

  if (isCustomStatus) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.5 + index * 0.2, type: "spring", stiffness: 100 }}
        className={`absolute z-30 p-2 md:p-3 bg-background/85 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl cursor-default select-none ${position}`}
      >
        <div className="flex items-center gap-2">
          {activity.emoji?.name && <span className="text-base leading-none">{activity.emoji.name}</span>}
          <span className="text-[11px] md:text-xs font-medium max-w-30  leading-none">{activity.state}</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.5 + index * 0.2, type: "spring", stiffness: 100 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`absolute z-30 bg-background/85 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl cursor-default select-none transition-all duration-300 ${position}`}
    >
      <div className="p-2 md:p-3">
        <div className="flex items-center gap-2">
          {thumbnail ? (
            <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-lg overflow-hidden shrink-0 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnail}
                alt={activity.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : isSpotify ? (
            <Headphones className="w-4 h-4 md:w-5 md:h-5 text-green-500 shrink-0" />
          ) : (
            <Gamepad2 className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0" />
          )}
          <div className="flex flex-col text-left justify-center">
            <span className="text-[10px] md:text-[11px] font-bold max-w-22.5 md:max-w-48 truncate leading-tight">
              {activity.details || activity.name}
            </span>
            <span className="text-[9px] md:text-[10px] text-muted-foreground max-w-22.5 md:max-w-48 truncate leading-tight">
              {activity.state}
            </span>
          </div>
        </div>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-2 mt-2 border-t border-border/30 space-y-2">
                {activity.timestamps?.start && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-muted-foreground">{elapsed}</span>
                  </div>
                )}
                {isSpotify && spotifyUrl && (
                  <a
                    href={spotifyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-[10px] font-medium text-green-500 hover:text-green-400 transition-colors pointer-events-auto"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Open in Spotify
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
