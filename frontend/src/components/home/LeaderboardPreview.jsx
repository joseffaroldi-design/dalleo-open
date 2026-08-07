import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { TEAM_VISUALS, TEAMS } from "@/data/teams";
import { StatusChip } from "@/components/leaderboard/StatusChip";
import { useLiveData } from "@/data/useLiveData";
import { computeStandings, formatToPar } from "@/data/scoring";

export const LeaderboardPreview = () => {
  const scoring = useLiveData("scoring");
  const liveTeams = useLiveData("teams");
  if (!scoring || scoring.status === "not-started") return null;

  const teams = (liveTeams?.items ?? TEAMS).filter((t) => t.active !== false);
  const standings = computeStandings(scoring, teams);
  const leader = standings.find((r) => r.position === 1);
  if (!leader) return null;

  const final = scoring.status === "final";
  const runnersUp = standings.filter((r) => r.position !== 1);
  const margin = leader.tied || !runnersUp.length ? 0 : runnersUp[0].total - leader.total;
  const visual = TEAM_VISUALS[leader.team.colorKey] ?? TEAM_VISUALS.green;

  return (
    <section
      data-testid="home-leaderboard-preview"
      aria-labelledby="home-leaderboard-title"
      className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8"
    >
      <div className="flex flex-col gap-6 rounded-3xl bg-forest p-7 shadow-md ring-1 ring-gold/40 sm:flex-row sm:items-center sm:justify-between sm:p-9">
        <div>
          <p className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-gold">
            Live Leaderboard
            <StatusChip status={final ? "final" : "live"} label={final ? "Final" : "Live"} />
          </p>
          <h2
            id="home-leaderboard-title"
            className="mt-4 flex items-center gap-3 text-2xl font-extrabold tracking-tight text-cream sm:text-3xl"
          >
            <span
              aria-hidden="true"
              className="h-6 w-6 rounded-full ring-2 ring-gold"
              style={{ backgroundColor: visual.dot }}
            />
            {leader.tied
              ? `${leader.team.name} tied at the top`
              : margin > 0
                ? `${leader.team.name} leads by ${margin}`
                : `${leader.team.name} leads`}
          </h2>
          <p className="mt-2 text-sm font-semibold text-cream/60 sm:text-base">
            <span data-testid="home-preview-points" className="text-gold">
              {formatToPar(leader.toPar)} · {leader.total} strokes
            </span>{" "}
            · {final ? "Final result" : `Thru ${leader.thru} holes`}
          </p>
        </div>
        <Link
          to="/leaderboard"
          data-testid="view-live-leaderboard-link"
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-gold px-7 py-3 text-base font-extrabold text-forest-deep shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold-soft hover:shadow-md"
        >
          View Live Leaderboard
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
};
