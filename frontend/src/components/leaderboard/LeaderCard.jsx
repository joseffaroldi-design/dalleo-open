import { Crown } from "lucide-react";
import { TEAM_VISUALS } from "@/data/leaderboard";

export const LeaderCard = ({ summary, roundLabel }) => {
  if (!summary) return null;
  const { leader, runnerUp, lead } = summary;
  const visual = TEAM_VISUALS[leader.colorKey];
  return (
    <section
      data-testid="leader-card"
      aria-labelledby="leader-card-title"
      className="rounded-3xl bg-forest p-7 shadow-md ring-1 ring-gold/40 sm:p-10"
    >
      <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-gold">
        <Crown className="h-4 w-4" aria-hidden="true" />
        Current Leader — {roundLabel}
      </p>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="h-8 w-8 rounded-full ring-2 ring-gold sm:h-10 sm:w-10"
            style={{ backgroundColor: visual.dot }}
          />
          <div>
            <h2
              id="leader-card-title"
              data-testid="leader-card-team"
              className="text-3xl font-extrabold tracking-tight text-cream sm:text-4xl"
            >
              {leader.name}
            </h2>
            <p className="mt-1 text-sm font-semibold text-cream/60">
              Captain {leader.captain}
            </p>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <p
            data-testid="leader-card-points"
            className="text-5xl font-extrabold tracking-tight text-gold sm:text-6xl"
          >
            {leader.points}
          </p>
          <p className="mt-1 text-sm font-bold uppercase tracking-widest text-cream/60">
            points
          </p>
        </div>
      </div>
      <p
        data-testid="leader-card-lead"
        className="mt-7 rounded-2xl bg-forest-deep/60 px-5 py-3 text-base font-bold text-cream ring-1 ring-cream/10"
      >
        Leads {runnerUp.name} by {lead} {lead === 1 ? "point" : "points"}
      </p>
    </section>
  );
};
