"use client";

import { useEffect, useRef } from "react";

/**
 * Global animated background: an infinite grid drifting diagonally.
 * Elegant, professional, tech-forward. Sits behind all page content.
 * Theme-aware (reads the `.dark` class) and honours reduced-motion.
 */
export function SiteBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    const GRID = 46; // px between lines
    let offset = 0;
    let raf = 0;

    const isDark = () => document.documentElement.classList.contains("dark");

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const dark = isDark();
      // dark: cool white as before · light: the brand colour so the pattern
      // stays clearly visible instead of washing out.
      const line = dark ? "rgba(255,255,255,0.045)" : "rgba(211,78,34,0.11)";
      const glow = dark ? "rgba(210,214,224,0.08)" : "rgba(211,78,34,0.16)";

      // diagonal drift: shift both axes by the same offset
      const ox = offset % GRID;
      const oy = offset % GRID;

      ctx.lineWidth = 1;

      // vertical lines
      ctx.strokeStyle = line;
      ctx.beginPath();
      for (let x = -GRID + ox; x <= width + GRID; x += GRID) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      // horizontal lines
      for (let y = -GRID + oy; y <= height + GRID; y += GRID) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // subtle glowing nodes at some intersections following the drift
      ctx.fillStyle = glow;
      for (let x = -GRID + ox; x <= width + GRID; x += GRID * 3) {
        for (let y = -GRID + oy; y <= height + GRID; y += GRID * 3) {
          ctx.beginPath();
          ctx.arc(x, y, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const tick = () => {
      offset += 0.28; // slow, elegant drift
      draw();
      raf = requestAnimationFrame(tick);
    };

    resize();
    draw();
    if (!reduceMotion) {
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {/* subtle film grain for depth (avoids the flat, generated look) */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      {/* depth vignette + soft brand glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,var(--background)_85%)]" />
      <div className="absolute -top-40 left-1/4 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-brand/[0.07] blur-[130px]" />
      <div className="absolute bottom-0 right-1/4 h-[30rem] w-[30rem] translate-x-1/2 rounded-full bg-primary/[0.04] blur-[120px]" />
    </div>
  );
}
