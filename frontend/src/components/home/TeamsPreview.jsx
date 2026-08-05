import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { TEAMS, TEAMS_ANNOUNCED, TEAM_VISUALS, TOTAL_PLAYERS } from "@/data/teams";
import { useLiveData } from "@/data/useLiveData";
import { Reveal } from "@/components/motion/Reveal";

export const TeamsPreview = () => {
  const live = useLiveData("teams");
  const announced = live ? live.published : TEAMS_ANNOUNCED;
  const teams = live ? live.items : TEAMS;
  const totalPlayers = live ? live.items.reduce((n, t) => n + t.players.length, 0) : TOTAL_PLAYERS;
  if (!announced) return null;

  return (
    <section
      data-testid="home-teams-preview"
      aria-labelledby="home-teams-title"
      className="mx-auto max-w-6xl px-4 pb-6 sm:px-6 sm:pb-8"
    >
      <Reveal>
      <div className="flex flex-col gap-6 rounded-3xl bg-white p-7 shadow-sm ring-1 ring-border sm:flex-row sm:items-center sm:justify-between sm:p-9">
        <div>
          <p className="font-display text-sm italic text-gold-deep">Chapter 01 · The Field</p>
          <p className="mt-2 text-sm font-bold uppercase tracking-[0.2em] text-gold-deep">
            Teams
          </p>
          <h2
            id="home-teams-title"
            data-testid="home-teams-count"
            className="mt-3 text-2xl font-extrabold tracking-tight text-charcoal sm:text-3xl"
          >
            {teams.length} teams &middot; {totalPlayers} players
          </h2>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
            {teams.map((team) => (
              <span
                key={team.id}
                className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal/60"
              >
                <span
                  aria-hidden="true"
                  className="h-3.5 w-3.5 rounded-full ring-1 ring-charcoal/20"
                  style={{ backgroundColor: TEAM_VISUALS[team.colorKey].dot }}
                />
                {team.captain}
              </span>
            ))}
          </div>
        </div>
        <Link
          to="/teams"
          data-testid="view-teams-link"
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-forest px-7 py-3 text-base font-extrabold text-cream shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-soft hover:shadow-md"
        >
          View Teams
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
      </Reveal>
    </section>
  );
};
