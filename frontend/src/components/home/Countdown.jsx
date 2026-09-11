import { useEffect, useMemo, useState } from "react";

const MONTHS = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

const tournamentTarget = (dateText) => {
  const match = /([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})/.exec(dateText ?? "");
  if (!match) return null;
  const month = MONTHS[match[1].toLowerCase()];
  if (month === undefined) return null;
  return new Date(Number(match[3]), month, Number(match[2]), 8, 0, 0);
};

export const Countdown = ({ dateText }) => {
  const [now, setNow] = useState(() => Date.now());
  const target = useMemo(() => tournamentTarget(dateText), [dateText]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!target) return null;

  const diff = Math.max(0, target.getTime() - now);
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
      className="mt-5 flex items-start justify-center"
    >
      {units.map(([unit, value], i) => (
        <div
          key={unit}
          className={`flex w-20 flex-col items-center px-3 sm:w-24 ${i > 0 ? "border-l border-cream/15" : ""}`}
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
