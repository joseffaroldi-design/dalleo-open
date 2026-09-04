import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { TEAMS } from "@/data/teams";
import { useLiveData } from "@/data/useLiveData";

// Slim shotgun-pairings card on the homepage — appears once hole assignments
// are set, and bows out once the round is final (standings take it from there).
export const PairingsStrip = () => {
  const liveTeams = useLiveData("teams");
  const scoring = useLiveData("scoring");
  if (scoring && scoring.status === "final") return null;
  const teams = (liveTeams ? liveTeams.items : TEAMS).filter((t) => t.active !== false);
  const withHoles = teams
    .filter((t) => t.startingHole)
    .sort((a, b) => a.startingHole - b.startingHole || (a.startingHoleLabel || "").localeCompare(b.startingHoleLabel || ""));
  if (withHoles.length === 0) return null;
  const startTime = withHoles.find((t) => t.startingTime)?.startingTime;

  return (
    <section data-testid="home-pairings-strip" className="mx-auto max-w-6xl px-4 pt-2 sm:px-6">
      <Link
        to="/schedule"
        className="group flex flex-col gap-3 rounded-3xl border border-border bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:gap-6"
      >
        <p className="flex shrink-0 items-center gap-3 text-sm font-extrabold text-forest">
          <span className="rounded-full bg-forest px-3 py-1 text-[10px] uppercase tracking-widest text-gold">
            Saturday
          </span>
          Shotgun Start Pairings{startTime ? ` · ${startTime}` : ""}
        </p>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm font-semibold text-charcoal/70">
          {withHoles.map((t) => (
            <span key={t.id} className="whitespace-nowrap">
              <span className="font-display font-bold text-gold-deep">
                {t.startingHoleLabel ?? t.startingHole}
              </span>{" "}
              {t.name.replace(/^Team\s+/i, "")}
            </span>
          ))}
          <ArrowRight
            className="h-4 w-4 text-forest transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </p>
      </Link>
    </section>
  );
};
