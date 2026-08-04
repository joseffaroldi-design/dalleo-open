import { GALLERY_CATEGORIES } from "@/data/gallery";

export const CategoryFilter = ({ value, onChange }) => (
  <div
    data-testid="category-filter"
    role="group"
    aria-label="Filter gallery by category"
    className="flex flex-wrap gap-2"
  >
    {GALLERY_CATEGORIES.map(({ id, label }) => {
      const active = value === id;
      return (
        <button
          key={id}
          type="button"
          data-testid={`category-option-${id}`}
          aria-pressed={active}
          onClick={() => onChange(id)}
          className={`min-h-11 rounded-full px-5 py-2.5 text-sm font-extrabold shadow-sm ring-1 transition-colors duration-200 sm:text-base ${
            active
              ? "bg-forest text-cream ring-forest"
              : "bg-white text-charcoal/70 ring-border hover:bg-forest-mist hover:text-forest"
          }`}
        >
          {label}
        </button>
      );
    })}
  </div>
);
