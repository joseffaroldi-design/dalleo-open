import { TEAM_VISUALS } from "@/data/leaderboard";
import { StatusChip } from "@/components/leaderboard/StatusChip";

const TeamSide = ({ colorKey }) => {
  const visual = TEAM_VISUALS[colorKey];
  return (
    <span className="inline-flex items-center gap-2 font-extrabold text-charcoal">
      <span
        aria-hidden="true"
        className="h-3.5 w-3.5 rounded-full ring-1 ring-charcoal/20"
        style={{ backgroundColor: visual.dot }}
      />
      Team {visual.label}
    </span>
  );
};

export const MatchesSection = ({ matches }) => (
  <section data-testid="matches-section" aria-labelledby="matches-title">
    <h2
      id="matches-title"
      className="text-base font-bold uppercase tracking-[0.2em] text-gold-deep md:text-lg"
    >
      Current Matches
    </h2>
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      {matches.map((match, i) => (
        <article
          key={match.id}
          data-testid={`match-card-${i + 1}`}
          className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-border transition-shadow duration-200 hover:shadow-md"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-widest text-charcoal/40">
              {match.name}
            </p>
            <StatusChip status={match.status} />
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm sm:text-base">
            <TeamSide colorKey={match.home} />
            <span className="text-xs font-bold uppercase text-charcoal/30">vs</span>
            <TeamSide colorKey={match.away} />
          </div>
          {match.score ? (
            <p
              data-testid={`match-score-${i + 1}`}
              className="mt-4 text-2xl font-extrabold tracking-tight text-forest"
              aria-label={`Score ${match.score}`}
            >
              {match.score}
            </p>
          ) : (
            <p className="mt-4 text-sm font-semibold text-charcoal/40">
              Tee time to be announced
            </p>
          )}
        </article>
      ))}
    </div>
  </section>
);
