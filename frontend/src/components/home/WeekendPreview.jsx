import { PartyPopper, Flag, Medal } from "lucide-react";

const DAYS = [
  {
    day: "Friday",
    event: "Draft Party",
    icon: PartyPopper,
    testId: "weekend-friday",
  },
  {
    day: "Saturday",
    event: "Tournament Round",
    icon: Flag,
    testId: "weekend-saturday",
  },
  {
    day: "Sunday",
    event: "Championship & Awards",
    icon: Medal,
    testId: "weekend-sunday",
  },
];

export const WeekendPreview = () => (
  <section
    data-testid="weekend-section"
    aria-labelledby="weekend-title"
    className="bg-forest"
  >
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <h2
        id="weekend-title"
        className="text-base font-bold uppercase tracking-[0.2em] text-gold md:text-lg"
      >
        This Weekend
      </h2>
      <p className="mt-3 max-w-xl text-3xl font-extrabold tracking-tight text-cream sm:text-4xl">
        Three days. One unforgettable tournament.
      </p>
      <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
        {DAYS.map(({ day, event, icon: Icon, testId }, i) => (
          <div
            key={day}
            data-testid={testId}
            className="rounded-3xl bg-forest-deep/60 p-7 ring-1 ring-cream/10 transition-colors duration-200 hover:ring-gold/40 sm:p-8"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-gold">
                {day}
              </span>
              <span
                aria-hidden="true"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-cream/10 text-gold"
              >
                <Icon className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-8 text-2xl font-extrabold tracking-tight text-cream">
              {event}
            </p>
            <p className="mt-2 text-sm text-cream/50">Day {i + 1} of 3</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
