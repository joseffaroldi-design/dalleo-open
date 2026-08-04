import { TEAMS } from "@/data/teams";
import { useLiveData } from "@/data/useLiveData";

// Shotgun start pairings for Saturday — teams grouped by assigned starting hole.
export const PairingsSection = () => {
  const live = useLiveData("teams");
  const teams = (live ? live.items : TEAMS).filter((t) => t.active !== false);
  const withHoles = teams.filter((t) => t.startingHole);
  if (withHoles.length === 0) return null;

  const byHole = {};
  withHoles.forEach((t) => {
    (byHole[t.startingHole] = byHole[t.startingHole] || []).push(t);
  });
  const holes = Object.keys(byHole).map(Number).sort((a, b) => a - b);
  const startTime = withHoles.find((t) => t.startingTime)?.startingTime;

  return (
    <section data-testid="pairings-section" aria-labelledby="pairings-title">
      <h2
        id="pairings-title"
        className="text-base font-bold uppercase tracking-[0.2em] text-gold-deep md:text-lg"
      >
        Shotgun Start Pairings{startTime ? ` · ${startTime}` : ""}
      </h2>
      <ol className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {holes.map((h) => (
          <li
            key={h}
            data-testid={`pairing-hole-${h}`}
            className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-border"
          >
            <span
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest font-display text-lg font-semibold text-gold"
            >
              {h}
            </span>
            <div>
              {byHole[h].map((t) => (
                <p key={t.id} className="text-sm font-extrabold text-charcoal">
                  {t.name}
                  <span className="ml-2 text-xs font-semibold text-charcoal/50">Capt. {t.captain}</span>
                </p>
              ))}
              {byHole[h].length > 1 && (
                <p className="mt-0.5 text-xs font-semibold text-charcoal/45">Paired together</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
};
