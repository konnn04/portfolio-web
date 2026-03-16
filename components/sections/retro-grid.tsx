"use client";

import { motion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { Code, Terminal, Globe, Database, Cpu, Wifi, type LucideIcon } from "lucide-react";

const floatingIconsConfig = [
  { icon: Code, x: "15%", y: "20%", delay: 0, size: "w-8 h-8 md:w-10 md:h-10", pxFactor: 15, pyFactor: 10 },
  { icon: Terminal, x: "80%", y: "30%", delay: 0.3, size: "w-6 h-6 md:w-8 md:h-8", pxFactor: 20, pyFactor: 13 },
  { icon: Globe, x: "25%", y: "70%", delay: 0.6, size: "w-7 h-7 md:w-9 md:h-9", pxFactor: 25, pyFactor: 16 },
  { icon: Database, x: "70%", y: "60%", delay: 0.9, size: "w-6 h-6 md:w-8 md:h-8", pxFactor: 30, pyFactor: 19 },
  { icon: Cpu, x: "50%", y: "15%", delay: 1.2, size: "w-7 h-7 md:w-9 md:h-9", pxFactor: 35, pyFactor: 22 },
  { icon: Wifi, x: "90%", y: "75%", delay: 1.5, size: "w-5 h-5 md:w-7 md:h-7", pxFactor: 40, pyFactor: 25 },
];

function FloatingIcon({
  icon: Icon,
  x: posX,
  y: posY,
  delay,
  size,
  pxFactor,
  pyFactor,
  smoothX,
  smoothY,
  idx,
}: {
  icon: LucideIcon;
  x: string;
  y: string;
  delay: number;
  size: string;
  pxFactor: number;
  pyFactor: number;
  smoothX: MotionValue<number>;
  smoothY: MotionValue<number>;
  idx: number;
}) {
  const iconX = useTransform(smoothX, [-0.5, 0.5], [-pxFactor, pxFactor]);
  const iconY = useTransform(smoothY, [-0.5, 0.5], [-pyFactor, pyFactor]);

  return (
    <motion.div
      style={{
        left: posX,
        top: posY,
        x: iconX,
        y: iconY,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0.15, 0.3, 0.15],
        scale: 1,
      }}
      transition={{
        delay,
        opacity: { duration: 4, repeat: Infinity, repeatType: "mirror" },
        scale: { duration: 0.5, delay },
      }}
      className="absolute"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5 + idx, repeat: Infinity, repeatType: "mirror" }}
      >
        <Icon className={`${size} text-primary/50 dark:text-primary/40 drop-shadow-[0_0_12px_rgba(var(--primary),0.5)]`} />
      </motion.div>
    </motion.div>
  );
}

interface RetroGridProps {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

export function RetroGrid({ mouseX, mouseY }: RetroGridProps) {
  const springConfig = { stiffness: 40, damping: 30, mass: 3};
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {floatingIconsConfig.map((item, idx) => (
        <FloatingIcon
          key={idx}
          {...item}
          smoothX={smoothX}
          smoothY={smoothY}
          idx={idx}
        />
      ))}

      <div 
        className="absolute bottom-0 left-0 right-0 h-[80%] md:h-[60%] overflow-hidden opacity-20 " 
        style={{ 
          perspective: "1200px",
          maskImage: "linear-gradient(to top, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 90%)",
          WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 90%)",
        }}
      >
        <div
          className="absolute inset-0 left-[-50%] right-[-50%] bottom-[-100%] origin-bottom animate-grid-scroll"
          style={{
            transform: "rotateX(60deg)",
            background: "linear-gradient(90deg, #ff00aa 0%, #7000ff 50%, #0000ff 100%)",
            maskImage: `
              linear-gradient(to right, black 3px, transparent 3px),
              linear-gradient(to bottom, black 3px, transparent 3px)
            `,
            maskSize: "60px 60px",
            WebkitMaskImage: `
              linear-gradient(to right, black 3px, transparent 3px),
              linear-gradient(to bottom, black 3px, transparent 3px)
            `,
            WebkitMaskSize: "60px 60px",
          }}
        />

        <div
          className="absolute top-[30%] left-0 right-0 h-[2px] z-10"
          style={{
            background: "linear-gradient(90deg, transparent 0%, #00eeffff 20%, #044f7aff 50%, #016fafff 80%, transparent 100%)",
            boxShadow: `
              0 0 25px 5px #0077ffff,
              0 0 50px 10px #61f4ffff,
              0 0 80px 15px rgba(36, 153, 189, 0.5)
            `,
            opacity: 0.9
          }}
        />
      </div>

      <style jsx global>{`
        @keyframes grid-scroll {
          from { 
            mask-position: 0 0;
            -webkit-mask-position: 0 0;
          }
          to { 
            mask-position: 0 60px;
            -webkit-mask-position: 0 60px;
          }
        }
        .animate-grid-scroll {
          animation: grid-scroll 10s linear infinite; 
        }
      `}</style>
    </div>
  );
}