import { ROUNDS } from "@/data/leaderboard";

export const RoundSelector = ({ value, onChange }) => (
  <div
    data-testid="round-selector"
    role="group"
    aria-label="Select leaderboard round"
    className="grid grid-cols-2 gap-2 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-border sm:grid-cols-4"
  >
    {ROUNDS.map(({ id, label }) => {
      const active = value === id;
      return (
        <button
          key={id}
          type="button"
          data-testid={`round-option-${id}`}
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
