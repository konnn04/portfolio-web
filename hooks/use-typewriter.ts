"use client";

import { useEffect, useState } from "react";

/** Types out `text` one character at a time. Returns the currently-typed slice. */
export function useTypewriter(text: string, speed = 42, startDelay = 450): string {
  const [out, setOut] = useState("");

  useEffect(() => {
    setOut("");
    let i = 0;
    let interval = 0;
    const timeout = window.setTimeout(() => {
      interval = window.setInterval(() => {
        i++;
        setOut(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return out;
}
