import { useEffect } from "react";
import Lenis from "lenis";

// Smooth momentum scrolling. Skipped for admin routes and for users
// who prefer reduced motion.
export const useLenis = (enabled = true) => {
  useEffect(() => {
    if (!enabled) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const lenis = new Lenis({ lerp: 0.09 });
    let raf = 0;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [enabled]);
};
