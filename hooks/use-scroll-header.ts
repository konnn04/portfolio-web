import { useState, useEffect } from "react";

export function useScrollHeader(thresholdBackground = 50, thresholdHide = 300) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          setScrolled(currentScrollY > thresholdBackground);

          if (currentScrollY <= thresholdHide) {
            setHidden(false);
          } else {
            setHidden(false); // Removed hide on scroll down
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [thresholdBackground, thresholdHide]);

  return { scrolled, hidden };
}