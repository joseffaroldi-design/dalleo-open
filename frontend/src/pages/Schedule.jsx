import { useState } from "react";
import { SCHEDULE_PUBLISHED, SCHEDULE, DAYS, getCurrentEvent } from "@/data/schedule";
import { DaySelector } from "@/components/schedule/DaySelector";
import { CurrentEventCard } from "@/components/schedule/CurrentEventCard";
import { ScheduleTimeline } from "@/components/schedule/ScheduleTimeline";
import { ScheduleEmptyState } from "@/components/schedule/ScheduleEmptyState";

export default function Schedule() {
  const current = SCHEDULE_PUBLISHED ? getCurrentEvent() : null;
  const [dayId, setDayId] = useState(current?.day.id ?? "friday");
  const activeDay = DAYS.find((d) => d.id === dayId);

  return (
    <div data-testid="schedule-page" className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-forest sm:text-5xl">
          Tournament Schedule
        </h1>
        <p className="mt-3 text-base font-semibold text-charcoal/60 sm:text-lg">
          8th Annual Dalleo Open &middot; 2026
        </p>
        <p className="mt-2 text-base leading-relaxed text-charcoal/60">
          Everything happening throughout Dalleo Open weekend.
        </p>
      </header>

      <div className="mt-10">
        {SCHEDULE_PUBLISHED ? (
          <div className="flex flex-col gap-10">
            <CurrentEventCard current={current} />
            <DaySelector value={dayId} onChange={setDayId} />
            <section data-testid="day-schedule" aria-labelledby="day-schedule-title">
              <h2
                id="day-schedule-title"
                className="text-base font-bold uppercase tracking-[0.2em] text-gold-deep md:text-lg"
              >
                {activeDay.label} &middot; {activeDay.tagline}
              </h2>
              <div className="mt-6">
                <ScheduleTimeline events={SCHEDULE[dayId]} />
              </div>
            </section>
          </div>
        ) : (
          <ScheduleEmptyState />
        )}
      </div>
    </div>
  );
}
