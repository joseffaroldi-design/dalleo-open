import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { TEAM_VISUALS, getTeamById, getInitials } from "@/data/teams";

export default function TeamDetail() {
  const { teamId } = useParams();
  const team = getTeamById(teamId);

  if (!team) return <Navigate to="/teams" replace />;

  const visual = TEAM_VISUALS[team.colorKey];

  return (
    <div data-testid="team-detail-page" className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <Link
        to="/teams"
        data-testid="back-to-teams"
        className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-forest transition-colors duration-200 hover:bg-forest-mist"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        All Teams
      </Link>

      <header
        className="mt-6 rounded-3xl bg-forest p-7 shadow-md sm:p-10"
        aria-labelledby="team-detail-title"
      >
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="h-12 w-12 shrink-0 rounded-full ring-2 ring-gold sm:h-14 sm:w-14"
            style={{ backgroundColor: visual.dot }}
          />
          <div>
            <h1
              id="team-detail-title"
              data-testid="team-detail-title"
              className="text-3xl font-extrabold tracking-tight text-cream sm:text-4xl"
            >
              {team.name}
            </h1>
            <p className="mt-1 text-sm font-bold uppercase tracking-widest text-gold">
              {visual.label} &middot; Captain {team.captain}
            </p>
          </div>
        </div>
        <p
          data-testid="team-detail-motto"
          className="mt-6 rounded-2xl bg-forest-deep/60 px-5 py-3 text-base font-semibold text-cream/80 ring-1 ring-cream/10"
        >
          &ldquo;{team.motto}&rdquo;
        </p>
      </header>

      <section aria-labelledby="roster-title" className="mt-10">
        <h2
          id="roster-title"
          className="text-base font-bold uppercase tracking-[0.2em] text-gold-deep md:text-lg"
        >
          Roster &middot; {team.players.length} players
        </h2>
        <ul
          data-testid="roster-list"
          className="mt-6 flex flex-col gap-3"
        >
          {team.players.map((player, i) => (
            <li
              key={player.name}
              data-testid={`player-row-${i + 1}`}
              className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-border sm:p-5"
            >
              <span
                aria-hidden="true"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest-mist text-sm font-extrabold text-forest"
              >
                {getInitials(player.name)}
              </span>
              <span className="flex-1 text-base font-bold text-charcoal sm:text-lg">
                {player.name}
              </span>
              {player.role === "Captain" && (
                <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-gold-deep">
                  Captain
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
