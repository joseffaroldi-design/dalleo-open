import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { SCHEDULE_PUBLISHED, DAYS, getCurrentEvent } from "@/data/schedule";
import { StatusChip } from "@/components/leaderboard/StatusChip";
import { useLiveData } from "@/data/useLiveData";

export const WeekendPreview = () => {
  const live = useLiveData("schedule");
  let current = SCHEDULE_PUBLISHED ? getCurrentEvent() : null;
  if (live) {
    const found = live.events.find((e) => e.isCurrent);
    current = live.published && found ? { day: DAYS.find((d) => d.id === found.day), event: found } : null;
  }
  if (!current) return null;
  const { day, event } = current;

  return (
    <section
      data-testid="weekend-section"
      aria-labelledby="home-schedule-title"
      className="bg-forest"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div
          data-testid="home-schedule-preview"
          className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="flex flex-wrap items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-gold">
              Tournament Schedule
              <StatusChip status={event.status} />
            </p>
            <h2
              id="home-schedule-title"
              data-testid="home-schedule-event"
              className="mt-4 text-2xl font-extrabold tracking-tight text-cream sm:text-3xl"
            >
              {event.title}
            </h2>
            <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-cream/60 sm:text-base">
              <span data-testid="home-schedule-when" className="text-gold">
                {day.label} &middot; {event.time}
              </span>
              <span aria-hidden="true">&middot;</span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {event.location}
              </span>
            </p>
          </div>
          <Link
            to="/schedule"
            data-testid="view-full-schedule-link"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-gold px-7 py-3 text-base font-extrabold text-forest-deep shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold-soft hover:shadow-md"
          >
            View Full Schedule
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};
