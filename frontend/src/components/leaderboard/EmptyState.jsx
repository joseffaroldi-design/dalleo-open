import { Link } from "react-router-dom";
import { Flag } from "lucide-react";

export const EmptyState = () => (
  <section
    data-testid="leaderboard-empty-state"
    aria-labelledby="empty-state-title"
    className="mx-auto flex max-w-xl flex-col items-center rounded-3xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-border sm:py-20"
  >
    <span
      aria-hidden="true"
      className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-forest-mist text-forest"
    >
      <Flag className="h-8 w-8" />
    </span>
    <h2
      id="empty-state-title"
      className="text-2xl font-extrabold tracking-tight text-forest sm:text-3xl"
    >
      Scoring has not started yet
    </h2>
    <p className="mt-4 max-w-sm text-base leading-relaxed text-charcoal/60">
      Check back when the tournament begins — live standings and match scores
      will appear here as soon as the first round is underway.
    </p>
    <Link
      to="/"
      data-testid="empty-state-back-home"
      className="mt-9 inline-flex min-h-12 items-center rounded-full bg-forest px-7 py-3 text-base font-bold text-cream shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-soft hover:shadow-md"
    >
      Back to Home
    </Link>
  </section>
);
