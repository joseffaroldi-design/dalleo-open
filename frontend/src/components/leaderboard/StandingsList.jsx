import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { TEAM_VISUALS } from "@/data/leaderboard";
import { StatusChip } from "@/components/leaderboard/StatusChip";

const Movement = ({ movement }) => {
  if (!movement) return null;
  if (movement.dir === "up")
    return (
      <span
        role="img"
        aria-label={`Moved up ${movement.places} ${movement.places === 1 ? "place" : "places"}`}
        className="inline-flex items-center gap-0.5 text-xs font-extrabold text-forest"
      >
        <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
        {movement.places}
      </span>
    );
  if (movement.dir === "down")
    return (
      <span
        role="img"
        aria-label={`Moved down ${movement.places} ${movement.places === 1 ? "place" : "places"}`}
        className="inline-flex items-center gap-0.5 text-xs font-extrabold text-gold-deep"
      >
        <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
        {movement.places}
      </span>
    );
  return (
    <span
      role="img"
      aria-label="No change in position"
      className="inline-flex items-center text-xs font-extrabold text-charcoal/40"
    >
      <Minus className="h-3.5 w-3.5" aria-hidden="true" />
    </span>
  );
};

const StandingRow = ({ entry }) => {
  const visual = TEAM_VISUALS[entry.colorKey];
  const isLeader = entry.rank === 1 && entry.points !== null;
  return (
    <li
      data-testid={`standing-row-${entry.rank}`}
      className={`flex items-center gap-3 rounded-2xl p-4 shadow-sm transition-shadow duration-200 hover:shadow-md sm:gap-5 sm:p-5 ${
        isLeader
          ? "bg-forest text-cream ring-1 ring-gold/40"
          : "bg-white ring-1 ring-border"
      }`}
    >
      <span
        className={`w-8 shrink-0 text-center text-xl font-extrabold sm:text-2xl ${
          isLeader ? "text-gold" : "text-charcoal/50"
        }`}
        aria-label={`Rank ${entry.rank}`}
      >
        {entry.rank}
      </span>
      <span
        aria-hidden="true"
        className="h-5 w-5 shrink-0 rounded-full ring-1 ring-charcoal/20 sm:h-6 sm:w-6"
        style={{ backgroundColor: visual.dot }}
      />
      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-base font-extrabold tracking-tight sm:text-lg ${
            isLeader ? "text-cream" : "text-charcoal"
          }`}
        >
          {entry.name}
          {isLeader && (
            <span className="ml-2 rounded-full bg-gold px-2.5 py-0.5 align-middle text-[10px] font-extrabold uppercase tracking-widest text-forest-deep">
              Leader
            </span>
          )}
        </p>
        <p
          className={`mt-0.5 flex items-center gap-2 text-xs sm:text-sm ${
            isLeader ? "text-cream/60" : "text-charcoal/50"
          }`}
        >
          Captain {entry.captain}
          <Movement movement={entry.movement} />
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p
          className={`text-2xl font-extrabold tracking-tight sm:text-3xl ${
            isLeader ? "text-gold" : "text-forest"
          }`}
        >
          {entry.points ?? "—"}
        </p>
        <p
          className={`text-[10px] font-bold uppercase tracking-widest sm:text-xs ${
            isLeader ? "text-cream/50" : "text-charcoal/40"
          }`}
        >
          pts
        </p>
      </div>
      <div className="hidden shrink-0 sm:block">
        <StatusChip status={entry.status} />
      </div>
    </li>
  );
};

export const StandingsList = ({ standings }) => (
  <section data-testid="standings-section" aria-labelledby="standings-title">
    <h2
      id="standings-title"
      className="text-base font-bold uppercase tracking-[0.2em] text-gold-deep md:text-lg"
    >
      Team Standings
    </h2>
    <ol data-testid="standings-list" className="mt-6 flex flex-col gap-3">
      {standings.map((entry) => (
        <StandingRow key={entry.name} entry={entry} />
      ))}
    </ol>
  </section>
);
