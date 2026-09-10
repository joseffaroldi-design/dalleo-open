import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, Flag } from "lucide-react";
import { TEAMS, TEAM_VISUALS, getInitials } from "@/data/teams";
import { useLiveData } from "@/data/useLiveData";
import { trackEvent } from "@/lib/analytics";

export default function TeamDetail() {
  const { teamId } = useParams();
  const live = useLiveData("teams");
  const teams = live ? live.items : TEAMS;
  const team = teams.find((t) => t.id === teamId);

  const resolvedTeamId = team?.id;
  useEffect(() => {
    if (resolvedTeamId) trackEvent("team_view", { team_id: resolvedTeamId });
  }, [resolvedTeamId]);

  // Wait for live data before redirecting — mock fallback ids differ from real ones.
  if (live && !team) return <Navigate to="/teams" replace />;
  if (!team) return null;

  const visual = TEAM_VISUALS[team.colorKey];
  const paired = team.startingHole
    ? teams.filter((t) => t.id !== team.id && t.active !== false && t.startingHole === team.startingHole)
    : [];

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

      {team.photoUrl && (
        <img
          src={team.photoUrl}
          alt={`${team.name} team photo`}
          data-testid="team-photo"
          className="mt-10 max-h-96 w-full rounded-3xl border border-gold/40 object-cover shadow-sm"
        />
      )}

      <section aria-labelledby="shotgun-title" className="mt-10">
        <h2
          id="shotgun-title"
          className="text-base font-bold uppercase tracking-[0.2em] text-gold-deep md:text-lg"
        >
          Shotgun Start
        </h2>
        <div
          data-testid="team-shotgun-card"
          className="mt-6 flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-border"
        >
          <span
            aria-hidden="true"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-forest font-display text-xl font-semibold text-gold"
          >
            {team.startingHoleLabel ?? team.startingHole ?? <Flag className="h-5 w-5" />}
          </span>
          <div>
            {team.startingHole ? (
              <>
                <p data-testid="team-starting-hole" className="text-base font-extrabold text-charcoal sm:text-lg">
                  Starts on hole {team.startingHoleLabel ?? team.startingHole}
                  {team.startingTime ? ` · ${team.startingTime}` : ""}
                </p>
                <p className="text-sm font-semibold text-charcoal/50">
                  Saturday, September 5, 2026
                  {paired.length > 0 && ` · Paired with ${paired.map((t) => t.name).join(" & ")}`}
                </p>
              </>
            ) : (
              <p className="text-base font-extrabold text-charcoal/50">
                Starting hole TBD — pairings announced closer to the tournament
              </p>
            )}
          </div>
        </div>
      </section>

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
              {player.photoUrl ? (
                <img
                  src={player.photoUrl}
                  alt={`${player.name} player photo`}
                  data-testid={`player-photo-${i + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-border"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest-mist text-sm font-extrabold text-forest"
                >
                  {getInitials(player.name)}
                </span>
              )}
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
