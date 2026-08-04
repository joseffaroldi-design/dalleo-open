import { DAYS } from "@/data/schedule";

// Tabs follow the schedule content — pass only the days that have events.
export const DaySelector = ({ value, onChange, days = DAYS }) => (
  <div
    data-testid="day-selector"
    role="group"
    aria-label="Select schedule day"
    className={`grid gap-2 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-border ${
      days.length <= 1 ? "grid-cols-1" : days.length === 2 ? "grid-cols-2" : "grid-cols-3"
    }`}
  >
    {days.map(({ id, label }) => {
      const active = value === id;
      return (
        <button
          key={id}
          type="button"
          data-testid={`day-option-${id}`}
          aria-pressed={active}
          onClick={() => onChange(id)}
          className={`min-h-12 rounded-xl px-4 py-3 text-sm font-extrabold transition-colors duration-200 sm:text-base ${
            active
              ? "bg-forest text-cream shadow-sm"
              : "text-charcoal/70 hover:bg-forest-mist hover:text-forest"
          }`}
        >
          {label}
        </button>
      );
    })}
  </div>
);
