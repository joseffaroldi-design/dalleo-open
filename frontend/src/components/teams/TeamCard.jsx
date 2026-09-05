import { Link } from "react-router-dom";
import { ArrowRight, Flag, Users } from "lucide-react";
import { TEAM_VISUALS } from "@/data/teams";

export const TeamCard = ({ team }) => {
  const visual = TEAM_VISUALS[team.colorKey];
  return (
    <Link
      to={`/teams/${team.id}`}
      data-testid={`team-card-${team.id}`}
      aria-label={`View ${team.name} roster, captained by ${team.captain}`}
      className="group flex flex-col rounded-3xl border border-border bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:translate-y-0 sm:p-8"
    >
      <div className="flex items-center gap-4">
        {team.photoUrl ? (
          <img
            src={team.photoUrl}
            alt={`${team.name} team photo`}
            data-testid={`team-photo-${team.id}`}
            loading="lazy"
            decoding="async"
            className="h-14 w-14 shrink-0 rounded-full bg-forest-mist object-cover ring-2 ring-gold/60"
          />
        ) : (
          <span
            aria-hidden="true"
            className="h-14 w-14 shrink-0 rounded-full ring-2 ring-gold/40"
            style={{ backgroundColor: visual.dot }}
          />
        )}
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-2xl font-extrabold tracking-tight text-charcoal">
            {team.name}
          </h2>
          <p className="mt-0.5 text-sm font-semibold text-charcoal/60">
            Captain {team.captain}
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-forest-mist px-3 py-1 text-xs font-bold text-forest">
          <Users className="h-3.5 w-3.5" aria-hidden="true" />
          {team.players.length}
        </span>
      </div>
      <p className="mt-4">
        {team.startingHole ? (
          <span
            data-testid={`team-hole-chip-${team.id}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-gold-deep"
          >
            <Flag className="h-3.5 w-3.5" aria-hidden="true" />
            Shotgun start · Hole {team.startingHole}
            {team.startingTime ? ` · ${team.startingTime}` : ""}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-charcoal/5 px-3 py-1 text-xs font-bold text-charcoal/40">
            <Flag className="h-3.5 w-3.5" aria-hidden="true" />
            Starting hole TBD
          </span>
        )}
      </p>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-charcoal/60">
        &ldquo;{team.motto}&rdquo;
      </p>
      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-forest transition-colors duration-200 group-hover:text-gold-deep">
        View Roster
        <ArrowRight
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </span>
    </Link>
  );
};
