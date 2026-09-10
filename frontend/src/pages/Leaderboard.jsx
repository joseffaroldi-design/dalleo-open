import { useEffect, useMemo } from "react";
import { Trophy } from "lucide-react";
import { TEAMS } from "@/data/teams";
import { useLiveData } from "@/data/useLiveData";
import { trackEvent } from "@/lib/analytics";
import {
  DEFAULT_PAR,
  STATUS_LABELS,
  computeStandings,
  formatToPar,
  formatUpdatedAt,
} from "@/data/scoring";
import { StatusChip } from "@/components/leaderboard/StatusChip";
import { EmptyState } from "@/components/leaderboard/EmptyState";
import { StrokeStandings } from "@/components/leaderboard/StrokeStandings";
import { Reveal } from "@/components/motion/Reveal";

export default function Leaderboard() {
  const scoring = useLiveData("scoring");
  const liveTeams = useLiveData("teams");

  useEffect(() => {
    trackEvent("leaderboard_view");
  }, []);

  const teams = useMemo(() => {
    const items = (liveTeams ? liveTeams.items : TEAMS).filter((t) => t.active !== false);
    return [...items].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  }, [liveTeams]);

  const status = scoring?.status ?? "not-started";
  const par = scoring?.par?.length === 18 ? scoring.par : DEFAULT_PAR;
  const courseLabel = scoring?.courseLabel ?? "";
  const standings = useMemo(() => computeStandings(scoring, teams), [scoring, teams]);
  const hasScores = standings.some((r) => r.thru > 0);
  const started = status !== "not-started" && hasScores;
  const final = status === "final";
  const leader = standings.find((r) => r.position === 1);
  const updated = formatUpdatedAt(scoring?.updatedAt);
  const heading = final ? "2026 Final Results" : started ? "Live Leaderboard" : "2027 Leaderboard";

  return (
    <div data-testid="leaderboard-page" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="flex flex-wrap items-end justify-between gap-4 sm:gap-5">
        <div>
          <p className="font-display text-sm italic text-gold-deep">Four-Person Scramble Championship</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-forest sm:text-5xl">
            {heading}
          </h1>
          <p className="mt-3 text-base font-semibold text-charcoal/60 sm:text-lg">
            One round · 18 holes · Lowest team score wins
            {courseLabel && (
              <span data-testid="course-label" className="block text-sm font-bold text-gold-deep sm:inline">
                <span aria-hidden="true" className="hidden sm:inline"> · </span>
                {courseLabel}
              </span>
            )}
            {started && updated && (
              <span data-testid="leaderboard-updated" className="block text-sm text-charcoal/50 sm:inline">
                <span aria-hidden="true" className="hidden sm:inline"> · </span>
                Updated {updated}
              </span>
            )}
          </p>
        </div>
        {started && (
          <StatusChip
            status={final ? "final" : "live"}
            label={STATUS_LABELS[status]}
            size="lg"
          />
        )}
      </header>

      <div className="mt-7 sm:mt-8">
        {started ? (
          <div className="flex flex-col gap-8 sm:gap-10">
            {final && leader && (
              <Reveal>
                <div
                  data-testid="champion-banner"
                  className="flex flex-col items-center gap-3 rounded-3xl bg-forest-deep p-7 text-center ring-1 ring-gold/40 sm:gap-4 sm:p-9"
                >
                  <span aria-hidden="true" className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 text-gold ring-2 ring-gold/60">
                    <Trophy className="h-8 w-8" />
                  </span>
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">
                    2026 Dalleo Open Champion
                  </p>
                  <p className="font-display text-3xl font-semibold text-cream sm:text-4xl">
                    {leader.team.name}
                  </p>
                  <p className="text-sm font-bold text-cream/60">
                    {leader.total} strokes · {formatToPar(leader.toPar)} · Captain {leader.team.captain}
                  </p>
                </div>
              </Reveal>
            )}
            <StrokeStandings standings={standings} par={par} final={final} />
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
