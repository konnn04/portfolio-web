"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import myInfo from "@/configs/data/my-info";

const USERNAME = myInfo.site.name;

function Typewriter({ text, speed = 80 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    setDisplayed("");
    const t = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(t);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(t);
  }, [text, speed]);

  return (
    <span>
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.7, ease: "easeInOut" }}
        className={done ? "text-[#ff5a2a]/70" : "text-[#ff5a2a]"}
      >
        _
      </motion.span>
    </span>
  );
}

export function LoaderContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center gap-4"
    >
      <span className="font-mono text-sm text-[#ff9a5c]/50">
        <span className="text-[#ff5a2a]">$</span> ./boot --user
      </span>

      <span className="font-mono text-4xl font-bold tracking-tight text-white md:text-5xl">
        <Typewriter text={USERNAME} speed={20} />
      </span>

      <div className="mt-4 h-[2px] w-48 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full bg-gradient-to-r from-[#ff5a2a] to-[#ff9a5c]"
          animate={{ width: "100%" }}
          transition={{ duration: 0.25, ease: "easeInOut", delay: 0.1 }}
        />
      </div>

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#ff9a5c]/40"
      >
        loading ...
      </motion.span>
    </motion.div>
  );
}
