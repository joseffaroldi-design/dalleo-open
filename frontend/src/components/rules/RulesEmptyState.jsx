import { Link } from "react-router-dom";
import { ScrollText } from "lucide-react";

export const RulesEmptyState = ({ title, body }) => (
  <section
    data-testid="rules-empty-state"
    aria-labelledby="rules-empty-title"
    className="mx-auto flex max-w-xl flex-col items-center rounded-3xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-border sm:py-20"
  >
    <span
      aria-hidden="true"
      className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-forest-mist text-forest"
    >
      <ScrollText className="h-8 w-8" />
    </span>
    <h2
      id="rules-empty-title"
      className="text-2xl font-extrabold tracking-tight text-forest sm:text-3xl"
    >
      {title}
    </h2>
    <p className="mt-4 max-w-sm text-base leading-relaxed text-charcoal/60">
      {body}
    </p>
    <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
      <Link
        to="/"
        data-testid="rules-empty-back-home"
        className="inline-flex min-h-12 items-center rounded-full bg-forest px-7 py-3 text-base font-bold text-cream shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-soft hover:shadow-md"
      >
        Back to Home
      </Link>
      <Link
        to="/schedule"
        data-testid="rules-empty-schedule-link"
        className="inline-flex min-h-12 items-center rounded-full bg-white px-7 py-3 text-base font-bold text-forest shadow-sm ring-1 ring-border transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-mist hover:shadow-md"
      >
        View Schedule
      </Link>
    </div>
  </section>
);
