import { useEffect, useState } from "react";

// Countdown to the 7th Annual Dalleo Open — Saturday, September 5, 2026 (first tee).
const TARGET = new Date("2026-09-05T08:00:00");

export const Countdown = () => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, TARGET.getTime() - now);
  const units = [
    ["Days", Math.floor(diff / 86400000)],
    ["Hours", Math.floor(diff / 3600000) % 24],
    ["Minutes", Math.floor(diff / 60000) % 60],
    ["Seconds", Math.floor(diff / 1000) % 60],
  ];

  return (
    <div
      data-testid="countdown-placeholder"
      aria-label="Countdown to the tournament"
      className="mt-10 flex items-center justify-center gap-3 sm:gap-4"
    >
      {units.map(([unit, value]) => (
        <div
          key={unit}
          className="flex w-16 flex-col items-center rounded-2xl bg-cream/10 px-2 py-3 ring-1 ring-cream/15 sm:w-20 sm:py-4"
        >
          <span data-testid={`countdown-${unit.toLowerCase()}`} className="text-2xl font-extrabold text-gold sm:text-3xl">
            {String(value).padStart(2, "0")}
          </span>
          <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-cream/60 sm:text-xs">
            {unit}
          </span>
        </div>
      ))}
    </div>
  );
};
