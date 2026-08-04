import { MapPin, Zap } from "lucide-react";
import { StatusChip } from "@/components/leaderboard/StatusChip";

export const CurrentEventCard = ({ current }) => {
  if (!current) return null;
  const { day, event } = current;
  return (
    <section
      data-testid="current-event-card"
      aria-labelledby="current-event-title"
      className="rounded-3xl bg-forest p-7 shadow-md ring-1 ring-gold/40 sm:p-9"
    >
      <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-gold">
        <Zap className="h-4 w-4" aria-hidden="true" />
        Happening Now — {day.label}
      </p>
      <div className="mt-5 flex flex-wrap items-start justify-between gap-5">
        <div>
          <h2
            id="current-event-title"
            data-testid="current-event-title"
            className="text-3xl font-extrabold tracking-tight text-cream sm:text-4xl"
          >
            {event.title}
          </h2>
          <p className="mt-2 inline-flex items-center gap-2 text-base font-semibold text-cream/70">
            <MapPin className="h-4 w-4 text-gold" aria-hidden="true" />
            {event.location}
            <span aria-hidden="true">&middot;</span>
            {event.time}
          </p>
        </div>
        <StatusChip status={event.status} size="lg" />
      </div>
      {event.note && (
        <p
          data-testid="current-event-note"
          className="mt-6 rounded-2xl bg-forest-deep/60 px-5 py-3 text-base font-semibold text-cream/80 ring-1 ring-cream/10"
        >
          {event.note}
        </p>
      )}
    </section>
  );
};
