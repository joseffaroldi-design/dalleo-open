import { TEAMS, TEAMS_ANNOUNCED } from "@/data/teams";
import { TeamCard } from "@/components/teams/TeamCard";
import { TeamsEmptyState } from "@/components/teams/TeamsEmptyState";

export default function Teams() {
  return (
    <div data-testid="teams-page" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-forest sm:text-5xl">
          Teams
        </h1>
        <p className="mt-3 text-base font-semibold text-charcoal/60 sm:text-lg">
          8th Annual Dalleo Open &middot; 2026
        </p>
        <p className="mt-2 text-base leading-relaxed text-charcoal/60">
          Meet this year&rsquo;s captains and tournament teams.
        </p>
      </header>
      <div className="mt-10">
        {TEAMS_ANNOUNCED ? (
          <div
            data-testid="teams-grid"
            className="grid grid-cols-1 gap-5 sm:grid-cols-2"
          >
            {TEAMS.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        ) : (
          <TeamsEmptyState />
        )}
      </div>
    </div>
  );
}
