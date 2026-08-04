import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { SCHEDULE_PUBLISHED, SCHEDULE, DAYS, getNextEvents } from "@/data/schedule";
import { useLiveData } from "@/data/useLiveData";
import { Reveal } from "@/components/motion/Reveal";

export const WeekendPreview = () => {
  const live = useLiveData("schedule");
  const published = live ? live.published : SCHEDULE_PUBLISHED;
  const allEvents = live
    ? live.events
    : DAYS.flatMap((d) => SCHEDULE[d.id].map((e) => ({ ...e, day: d.id })));
  const next = published ? getNextEvents(allEvents, 3) : [];
  if (next.length === 0) return null;

  const dayLabel = (id) => DAYS.find((d) => d.id === id)?.label ?? id;

  return (
    <section
      data-testid="weekend-section"
      aria-labelledby="home-schedule-title"
      className="bg-forest"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div data-testid="home-schedule-preview">
          <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="font-display text-sm italic text-gold-soft">Chapter 06 · The Weekend</p>
              <p className="mt-2 text-sm font-bold uppercase tracking-[0.2em] text-gold">
                This Weekend
              </p>
              <h2
                id="home-schedule-title"
                className="mt-3 text-2xl font-extrabold tracking-tight text-cream sm:text-3xl"
              >
                Up next at the Dalleo Open
              </h2>
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
          </Reveal>
          <Reveal delay={0.12}>
          <ol className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {next.map((event, i) => (
              <li
                key={event.id}
                data-testid={`home-next-event-${i + 1}`}
                className="rounded-3xl bg-forest-deep/60 p-6 ring-1 ring-cream/10 transition-colors duration-200 hover:ring-gold/40"
              >
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
                  {dayLabel(event.day)} &middot; {event.time}
                </p>
                <p className="mt-3 text-lg font-extrabold tracking-tight text-cream">
                  {event.title}
                </p>
                <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-cream/60">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {event.location}
                </p>
              </li>
            ))}
          </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
