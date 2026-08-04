import { useState, useMemo, useEffect } from "react";
import { SCHEDULE_PUBLISHED, SCHEDULE, DAYS, TOURNAMENT_DATES_TEXT, getAutoStatus } from "@/data/schedule";
import { useLiveData } from "@/data/useLiveData";
import { DaySelector } from "@/components/schedule/DaySelector";
import { CurrentEventCard } from "@/components/schedule/CurrentEventCard";
import { ScheduleTimeline } from "@/components/schedule/ScheduleTimeline";
import { ScheduleEmptyState } from "@/components/schedule/ScheduleEmptyState";

export default function Schedule() {
  const live = useLiveData("schedule");
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  const { published, byDay, current } = useMemo(() => {
    const published = live ? live.published : SCHEDULE_PUBLISHED;
    const grouped = { friday: [], saturday: [], sunday: [] };
    const all = live
      ? live.events
      : DAYS.flatMap((d) => SCHEDULE[d.id].map((e) => ({ ...e, day: d.id })));
    [...all]
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
      .forEach((e) => grouped[e.day]?.push(e));
    // Automatic Upcoming / Current / Complete badges from local time.
    let currentEvent = null;
    for (const day of DAYS) {
      grouped[day.id] = grouped[day.id].map((e) => {
        const displayStatus = getAutoStatus(e, grouped[day.id], now);
        if (displayStatus === "happening-now" && !currentEvent) {
          currentEvent = { day, event: e };
        }
        return { ...e, displayStatus };
      });
    }
    return { published, byDay: grouped, current: currentEvent };
  }, [live, now]);

  const [selectedDay, setSelectedDay] = useState(null);
  const dayId = selectedDay ?? current?.day.id ?? "friday";
  const activeDay = DAYS.find((d) => d.id === dayId);

  return (
    <div data-testid="schedule-page" className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-forest sm:text-5xl">
          Tournament Weekend Schedule
        </h1>
        <p className="mt-3 text-base font-semibold text-charcoal/60 sm:text-lg">
          Never wonder where you&rsquo;re supposed to be.
        </p>
        <p className="mt-2 inline-block rounded-full bg-forest-mist px-4 py-1.5 text-sm font-bold text-forest">
          {TOURNAMENT_DATES_TEXT}
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
                {(byDay[dayId] ?? []).length === 0 ? (
                  <p data-testid="schedule-empty-live" className="rounded-2xl bg-white p-8 text-center text-sm font-semibold text-charcoal/50 shadow-sm ring-1 ring-border">
                    No events scheduled for this day yet — official schedule coming soon.
                  </p>
                ) : (
                  <ScheduleTimeline events={byDay[dayId] ?? []} />
                )}
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
