import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";

export const ScheduleEmptyState = () => (
  <section
    data-testid="schedule-empty-state"
    aria-labelledby="schedule-empty-title"
    className="mx-auto flex max-w-xl flex-col items-center rounded-3xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-border sm:py-20"
  >
    <span
      aria-hidden="true"
      className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-forest-mist text-forest"
    >
      <CalendarDays className="h-8 w-8" />
    </span>
    <h2
      id="schedule-empty-title"
      className="text-2xl font-extrabold tracking-tight text-forest sm:text-3xl"
    >
      Schedule not published yet
    </h2>
    <p className="mt-4 max-w-sm text-base leading-relaxed text-charcoal/60">
      The tournament schedule has not been published yet. Check back closer to
      the event for tee times, gatherings, and ceremony details.
    </p>
    <Link
      to="/"
      data-testid="schedule-empty-back-home"
      className="mt-9 inline-flex min-h-12 items-center rounded-full bg-forest px-7 py-3 text-base font-bold text-cream shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-soft hover:shadow-md"
    >
      Back to Home
    </Link>
  </section>
);
