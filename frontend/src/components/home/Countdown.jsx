import { useEffect, useState } from "react";

// Countdown to the 8th Annual Dalleo Open — Saturday, September 5, 2026 (shotgun start 8:30 AM).
const TARGET = new Date("2026-09-05T08:30:00");

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
      className="mt-12 flex items-start justify-center"
    >
      {units.map(([unit, value], i) => (
        <div
          key={unit}
          className={`flex w-20 flex-col items-center px-3 sm:w-24 ${
            i > 0 ? "border-l border-cream/15" : ""
          }`}
        >
          <span
            data-testid={`countdown-${unit.toLowerCase()}`}
            className="font-display text-4xl font-medium tabular-nums text-gold sm:text-5xl"
          >
            {String(value).padStart(2, "0")}
          </span>
          <span className="mt-2 text-[10px] font-bold uppercase tracking-[0.25em] text-cream/50 sm:text-xs">
            {unit}
          </span>
        </div>
      ))}
    </div>
  );
};
