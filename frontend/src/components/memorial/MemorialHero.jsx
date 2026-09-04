import { Heart, ImageIcon } from "lucide-react";

export const MemorialHero = ({ hero }) => (
  <section
    data-testid="memorial-hero"
    aria-labelledby="memorial-hero-title"
    className="flex flex-col items-center px-4 pb-20 pt-16 text-center sm:px-6 sm:pb-28 sm:pt-24"
  >
    {hero.photoUrl ? (
      <img
        src={hero.photoUrl}
        alt={hero.photoAlt}
        data-testid="memorial-photo-hero"
        className="aspect-[4/5] w-52 rounded-3xl border border-gold/40 object-cover shadow-sm sm:w-64"
      />
    ) : (
      <div
        data-testid="memorial-photo-hero"
        role="img"
        aria-label={hero.photoAlt}
        className="flex aspect-[4/5] w-52 flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-forest/25 bg-forest-mist text-forest/50 sm:w-64"
      >
        <ImageIcon className="h-10 w-10" aria-hidden="true" />
        <span className="px-4 text-xs font-semibold">Photo of Brandon</span>
      </div>
    )}
    <span
      aria-hidden="true"
      className="mt-10 flex h-11 w-11 items-center justify-center rounded-full bg-gold/15 text-gold-deep"
    >
      <Heart className="h-5 w-5" />
    </span>
    <h1
      id="memorial-hero-title"
      data-testid="memorial-hero-title"
      className="mt-6 text-4xl font-extrabold tracking-tight text-forest sm:text-5xl"
    >
      {hero.title}
    </h1>
    <p
      data-testid="memorial-hero-subtitle"
      className="mt-4 max-w-md text-base leading-relaxed text-charcoal/60 sm:text-lg"
    >
      {hero.subtitle}
    </p>
  </section>
);
