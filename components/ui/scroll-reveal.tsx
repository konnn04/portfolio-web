"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  once?: boolean;
}

const directionMap = {
  up: { y: 40, x: 0 },
  down: { y: -40, x: 0 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
};

export function ScrollReveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = 0.6,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-50px" });

  const initial = directionMap[direction];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.985, ...initial }}
      animate={
        isInView
          ? {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              // a brief brand glow that follows the real (rounded) silhouette,
              // not the wrapper box — drop-shadow respects the content alpha.
              filter: [
                "drop-shadow(0 0 0px rgba(255,90,42,0))",
                "drop-shadow(0 0 14px rgba(255,90,42,0.5))",
                "drop-shadow(0 0 0px rgba(255,90,42,0))",
              ],
            }
          : { opacity: 0, scale: 0.985, ...initial }
      }
      transition={{
        duration,
        delay,
        ease: "easeOut",
        filter: { duration: 0.9, delay, times: [0, 0.5, 1], ease: "easeOut" },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
