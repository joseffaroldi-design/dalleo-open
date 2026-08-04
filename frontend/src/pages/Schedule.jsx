import { useState, useMemo } from "react";
import { SCHEDULE_PUBLISHED, SCHEDULE, DAYS, getCurrentEvent } from "@/data/schedule";
import { useLiveData } from "@/data/useLiveData";
import { DaySelector } from "@/components/schedule/DaySelector";
import { CurrentEventCard } from "@/components/schedule/CurrentEventCard";
import { ScheduleTimeline } from "@/components/schedule/ScheduleTimeline";
import { ScheduleEmptyState } from "@/components/schedule/ScheduleEmptyState";

export default function Schedule() {
  const live = useLiveData("schedule");
  const { published, byDay, current } = useMemo(() => {
    if (!live) {
      return {
        published: SCHEDULE_PUBLISHED,
        byDay: SCHEDULE,
        current: SCHEDULE_PUBLISHED ? getCurrentEvent() : null,
      };
    }
    const grouped = { friday: [], saturday: [], sunday: [] };
    [...live.events]
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
      .forEach((e) => grouped[e.day]?.push(e));
    const found = live.events.find((e) => e.isCurrent);
    return {
      published: live.published,
      byDay: grouped,
      current: found ? { day: DAYS.find((d) => d.id === found.day), event: found } : null,
    };
  }, [live]);
  const [selectedDay, setSelectedDay] = useState(null);
  const dayId = selectedDay ?? current?.day.id ?? "friday";
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
        {published ? (
          <div className="flex flex-col gap-10">
            <CurrentEventCard current={current} />
            <DaySelector value={dayId} onChange={setSelectedDay} />
            <section data-testid="day-schedule" aria-labelledby="day-schedule-title">
              <h2
                id="day-schedule-title"
                className="text-base font-bold uppercase tracking-[0.2em] text-gold-deep md:text-lg"
              >
                {activeDay.label} &middot; {activeDay.tagline}
              </h2>
              <div className="mt-6">
                <ScheduleTimeline events={byDay[dayId] ?? []} />
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
