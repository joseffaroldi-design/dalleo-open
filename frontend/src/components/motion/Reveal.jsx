import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

// Scroll-triggered editorial reveal. Fires once when the element enters view.
export const Reveal = ({ children, delay = 0, y = 28, className }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-70px" }}
    transition={{ duration: 0.9, delay, ease: EASE }}
    className={className}
  >
    {children}
  </motion.div>
);

// Masked line-by-line text reveal — the signature on-load moment.
export const MaskedLine = ({ children, delay = 0, className }) => (
  <span className={`block overflow-hidden pb-[0.1em] -mb-[0.1em] ${className ?? ""}`}>
    <motion.span
      className="block will-change-transform"
      initial={{ y: "112%" }}
      animate={{ y: "0%" }}
      transition={{ duration: 1.15, delay, ease: EASE }}
    >
      {children}
    </motion.span>
  </span>
);
