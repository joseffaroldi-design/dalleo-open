import { useCallback, useRef } from "react";
import { motion, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";
import { ImageIcon } from "lucide-react";
import { useLiveData } from "@/data/useLiveData";
import { Countdown } from "@/components/home/Countdown";
import { MaskedLine } from "@/components/motion/Reveal";

const EASE = [0.16, 1, 0.3, 1];

export const Hero = () => {
  const site = useLiveData("site");
  const sectionRef = useRef(null);

  const edition = site?.edition ?? "8th Annual Dalleo Open";
  const words = edition.split(" ");
  const splitAt = Math.ceil(words.length / 2);
  const lines = [words.slice(0, splitAt).join(" "), words.slice(splitAt).join(" ")].filter(Boolean);

  // Scroll parallax — giant masthead word drifts as you leave the hero.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const wordY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  // Mouse parallax — subtle 3D drift on the masthead word and photo frame.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 20 });
  const sy = useSpring(my, { stiffness: 50, damping: 20 });
  const wordX = useTransform(sx, (v) => v * -18);
  const frameX = useTransform(sx, (v) => v * 10);
  const frameY = useTransform(sy, (v) => v * 8);

  const onMove = useCallback(
    (e) => {
      const r = sectionRef.current?.getBoundingClientRect();
      if (!r) return;
      mx.set((e.clientX - r.left) / r.width - 0.5);
      my.set((e.clientY - r.top) / r.height - 0.5);
    },
    [mx, my]
  );

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMove}
      data-testid="hero-section"
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-forest-deep"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 80% 55% at 50% 0%, rgba(46,107,82,0.5), transparent 70%)" }}
      />
      <motion.div
        aria-hidden="true"
        style={{ y: wordY, x: wordX }}
        className="text-outline-cream pointer-events-none absolute inset-x-0 top-16 select-none text-center font-display text-[24vw] font-black leading-none tracking-tight sm:top-8"
      >
        DALLEO
      </motion.div>

      <motion.div style={{ opacity: fade }} className="relative mx-auto max-w-6xl px-4 pb-14 pt-24 text-center sm:px-6 sm:pt-32">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          data-testid="hero-memorial-line"
          className="flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-gold sm:text-sm"
        >
          <span aria-hidden="true" className="h-px w-10 bg-gold/50 sm:w-16" />
          {site?.heroSubtitle ?? "In Memory of Brandon Dalleo"}
          <span aria-hidden="true" className="h-px w-10 bg-gold/50 sm:w-16" />
        </motion.p>

        <h1
          id="hero-title"
          data-testid="hero-title"
          className="mt-8 font-display text-[13vw] font-semibold leading-[0.98] tracking-tight text-cream sm:text-7xl lg:text-8xl"
        >
          <MaskedLine delay={0.25}>{lines[0]}</MaskedLine>
          {lines[1] && (
            <MaskedLine delay={0.38}>
              <em className="italic text-gold-soft">{lines[1]}</em>
            </MaskedLine>
          )}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
          data-testid="hero-date-placeholder"
          className="mt-7 text-base font-semibold text-cream/70 sm:text-lg"
        >
          {site?.dateText ?? "Tournament dates to be announced"}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.85, ease: EASE }}
        >
          <Countdown />
        </motion.div>
      </motion.div>

      <div className="relative mx-auto max-w-4xl px-4 pb-24 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.9, ease: EASE }}
          style={{ x: frameX, y: frameY }}
        >
          <div
            data-testid="hero-image-placeholder"
            role="img"
            aria-label="Hero image placeholder — tournament photo coming soon"
            className="spotlight-frame flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-t-[999px] border border-gold/40 bg-forest text-cream/50 sm:aspect-[16/9]"
          >
            <ImageIcon className="h-10 w-10" aria-hidden="true" />
            <span className="text-sm font-semibold">Tournament photo coming soon</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cream/40">Scroll</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="h-8 w-px bg-gold/50"
        />
      </motion.div>
    </section>
  );
};
