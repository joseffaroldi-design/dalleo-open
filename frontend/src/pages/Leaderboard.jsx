import { useState } from "react";
import { SCORING_STARTED, LEADERBOARD, getLeaderSummary } from "@/data/leaderboard";
import { RoundSelector } from "@/components/leaderboard/RoundSelector";
import { LeaderCard } from "@/components/leaderboard/LeaderCard";
import { StandingsList } from "@/components/leaderboard/StandingsList";
import { MatchesSection } from "@/components/leaderboard/MatchesSection";
import { EmptyState } from "@/components/leaderboard/EmptyState";
import { StatusChip } from "@/components/leaderboard/StatusChip";

export default function Leaderboard() {
  const [roundId, setRoundId] = useState("overall");
  const round = LEADERBOARD[roundId];
  const summary = getLeaderSummary(roundId);

  return (
    <div data-testid="leaderboard-page" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-forest sm:text-5xl">
            Live Leaderboard
          </h1>
          <p className="mt-3 text-base font-semibold text-charcoal/60 sm:text-lg">
            {SCORING_STARTED ? (
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
        {SCORING_STARTED && (
          <StatusChip status={round.meta.status} label={round.meta.statusLabel} size="lg" />
        )}
      </header>

      <div className="mt-10">
        {SCORING_STARTED ? (
          <div className="flex flex-col gap-12">
            <RoundSelector value={roundId} onChange={setRoundId} />
            {summary && <LeaderCard summary={summary} roundLabel={round.meta.roundLabel} />}
            <StandingsList standings={round.standings} />
            <MatchesSection matches={round.matches} />
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
