"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#%&@$?/\\<>*=+";

interface ScrambleTextProps {
  text: string;
  className?: string;
  /** stagger between each word resolving (seconds) */
  wordDelay?: number;
  /** how long a single word takes to de-noise (seconds) */
  scrambleDur?: number;
}

/**
 * Renders text that starts as random noise and resolves word-by-word into the
 * real characters (a "decrypt" effect). Total length stays constant so nothing
 * reflows. SSR renders the final text; the effect only runs once, in view.
 */
export function ScrambleText({ text, className, wordDelay = 0.14, scrambleDur = 0.5 }: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(text);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(text);
      return;
    }

    // tokenise, keeping whitespace so word boundaries are preserved
    const tokens = text.split(/(\s+)/);
    let wordIndex = 0;
    const meta = tokens.map((tok) => {
      if (/^\s+$/.test(tok) || tok === "") return { tok, start: -1, space: true };
      const start = wordIndex * wordDelay;
      wordIndex++;
      return { tok, start, space: false };
    });
    const total = wordIndex * wordDelay + scrambleDur;

    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const el = (now - t0) / 1000;
      let out = "";
      for (const m of meta) {
        if (m.space) {
          out += m.tok;
          continue;
        }
        if (el < m.start) {
          // not resolved yet — full noise
          for (let i = 0; i < m.tok.length; i++) out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
          continue;
        }
        const p = Math.min(1, (el - m.start) / scrambleDur);
        const lock = Math.floor(p * m.tok.length);
        for (let i = 0; i < m.tok.length; i++) {
          out += i < lock || m.tok[i] === " " ? m.tok[i] : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
      }
      setDisplay(out);
      if (el < total) raf = requestAnimationFrame(tick);
      else setDisplay(text);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, text, wordDelay, scrambleDur]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {display}
    </span>
  );
}
