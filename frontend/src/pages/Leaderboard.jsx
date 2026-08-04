import { useState, useMemo } from "react";
import { SCORING_STARTED, LEADERBOARD } from "@/data/leaderboard";
import { TEAMS } from "@/data/teams";
import { useLiveData } from "@/data/useLiveData";
import { RoundSelector } from "@/components/leaderboard/RoundSelector";
import { LeaderCard } from "@/components/leaderboard/LeaderCard";
import { StandingsList } from "@/components/leaderboard/StandingsList";
import { MatchesSection } from "@/components/leaderboard/MatchesSection";
import { EmptyState } from "@/components/leaderboard/EmptyState";
import { StatusChip } from "@/components/leaderboard/StatusChip";

export default function Leaderboard() {
  const [roundId, setRoundId] = useState("overall");
  const liveLb = useLiveData("leaderboard");
  const liveTeams = useLiveData("teams");

  const { rounds, started } = useMemo(() => {
    if (!liveLb) return { rounds: LEADERBOARD, started: SCORING_STARTED };
    const teams = liveTeams?.items ?? TEAMS;
    const byId = Object.fromEntries(teams.map((t) => [t.id, t]));
    const byColor = Object.fromEntries(teams.map((t) => [t.colorKey, t]));
    const standings = [...liveLb.standings]
      .sort((a, b) => (b.points ?? -1) - (a.points ?? -1))
      .map((s, i) => {
        const team = byId[s.teamId] ?? byColor[s.colorKey];
        return {
          rank: i + 1,
          colorKey: team?.colorKey ?? "green",
          name: team?.name ?? s.teamId ?? "Team",
          captain: team?.captain ?? "",
          points: s.points,
          movement: null,
          status: s.status,
        };
      });
    return {
      started: liveLb.scoringStarted,
      rounds: {
        ...LEADERBOARD,
        overall: {
          meta: {
            roundLabel: liveLb.roundLabel,
            status: liveLb.status,
            statusLabel: liveLb.statusLabel,
            updatedAt: liveLb.updatedAt,
          },
          standings,
          matches: LEADERBOARD.overall.matches,
        },
      },
    };
  }, [liveLb, liveTeams]);

  const round = rounds[roundId];
  const summary = useMemo(() => {
    const rows = round.standings.filter((t) => t.points !== null && t.points !== undefined);
    if (rows.length < 2) return null;
    const [first, second] = rows;
    return { leader: first, runnerUp: second, lead: first.points - second.points };
  }, [round]);

  return (
    <div data-testid="leaderboard-page" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-forest sm:text-5xl">
            Live Leaderboard
          </h1>
          <p className="mt-3 text-base font-semibold text-charcoal/60 sm:text-lg">
            {started ? (
              <>
                {round.meta.roundLabel}
                <span aria-hidden="true"> · </span>
                Updated {round.meta.updatedAt}
              </>
            ) : (
              "8th Annual Dalleo Open"
            )}
          </p>
        </div>
        {started && (
          <StatusChip status={round.meta.status} label={round.meta.statusLabel} size="lg" />
        )}
      </header>

      <div className="mt-10">
        {started ? (
          <div className="flex flex-col gap-12">
            <RoundSelector value={roundId} onChange={setRoundId} />
            {summary && <LeaderCard summary={summary} roundLabel={round.meta.roundLabel} />}
            {round.standings.length === 0 ? (
              <p data-testid="standings-empty-live" className="rounded-3xl bg-white p-10 text-center text-sm font-semibold text-charcoal/50 shadow-sm ring-1 ring-border">
                Standings will appear here once scores are entered.
              </p>
            ) : (
              <StandingsList standings={round.standings} />
            )}
            <MatchesSection matches={round.matches} />
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
