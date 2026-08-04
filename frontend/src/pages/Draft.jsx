import { DRAFT_2026 } from "@/data/draft";
import { StatusChip } from "@/components/leaderboard/StatusChip";

export default function Draft() {
  return (
    <div data-testid="draft-page" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1
            data-testid="draft-title"
            className="text-4xl font-extrabold tracking-tight text-forest sm:text-5xl"
          >
            {DRAFT_2026.title}
          </h1>
          <p className="mt-3 text-base font-semibold text-charcoal/60 sm:text-lg">
            {DRAFT_2026.format}
          </p>
        </div>
        <StatusChip status="final" label={DRAFT_2026.statusLabel} size="lg" />
      </header>

      <div
        data-testid="draft-board"
        className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {DRAFT_2026.captains.map((entry, i) => (
          <section
            key={entry.captain}
            data-testid={`captain-card-${i + 1}`}
            aria-labelledby={`captain-${i + 1}-name`}
            className="flex flex-col rounded-3xl bg-white shadow-sm ring-1 ring-border transition-shadow duration-200 hover:shadow-md"
          >
            <h2
              id={`captain-${i + 1}-name`}
              className="rounded-t-3xl bg-forest px-6 py-4 text-lg font-extrabold tracking-tight text-cream"
            >
              {entry.captain}
              <span className="ml-2 text-xs font-bold uppercase tracking-widest text-gold">
                Captain
              </span>
            </h2>
            <ol className="flex flex-1 flex-col gap-3 p-5">
              {entry.picks.map(({ pick, player }) => (
                <li key={pick} className="flex items-center gap-3">
                  <span
                    data-testid={`pick-badge-${pick}`}
                    aria-label={`Overall pick ${pick}`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/15 text-sm font-extrabold text-gold-deep"
                  >
                    {pick}
                  </span>
                  <span className="text-base font-bold text-charcoal">{player}</span>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
