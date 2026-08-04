import { Heart } from "lucide-react";

export const MemorialEmptyState = () => (
  <section
    data-testid="memorial-empty-state"
    aria-labelledby="memorial-empty-title"
    className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6"
  >
    <span
      aria-hidden="true"
      className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-gold-deep"
    >
      <Heart className="h-7 w-7" />
    </span>
    <h2
      id="memorial-empty-title"
      className="text-2xl font-extrabold tracking-tight text-forest sm:text-3xl"
    >
      This memorial page is being thoughtfully prepared
    </h2>
    <p className="mt-4 text-base leading-relaxed text-charcoal/60">
      Please check back soon.
    </p>
  </section>
);
