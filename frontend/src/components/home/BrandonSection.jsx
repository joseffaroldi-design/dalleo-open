import { Link } from "react-router-dom";
import { Heart, ImageIcon } from "lucide-react";
import { MEMORIAL } from "@/data/memorial";
import { useLiveData } from "@/data/useLiveData";
import { Reveal } from "@/components/motion/Reveal";

export const BrandonSection = () => {
  const site = useLiveData("site");
  return (
  <section
    data-testid="brandon-section"
    aria-labelledby="brandon-title"
    className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28"
  >
    <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
      <Reveal>
      <div
        data-testid="brandon-photo-placeholder"
        role="img"
        aria-label="Photo of Brandon Dalleo — coming soon"
        className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-3 rounded-t-[999px] border border-gold/40 bg-forest-mist text-forest/50 shadow-sm"
      >
        <ImageIcon className="h-10 w-10" aria-hidden="true" />
        <span className="text-sm font-semibold">Photo of Brandon coming soon</span>
      </div>
      </Reveal>
      <Reveal delay={0.12}>
      <div>
        <p className="font-display text-sm italic text-gold-deep">Chapter 07 · The Legacy</p>
        <p className="mt-2 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-gold-deep">
          <Heart className="h-4 w-4" aria-hidden="true" />
          Remembering Brandon
        </p>
        <h2
          id="brandon-title"
          className="mt-4 text-3xl font-extrabold tracking-tight text-forest sm:text-4xl"
        >
          More than a tournament.
        </h2>
        <p className="mt-6 text-base leading-relaxed text-charcoal/70">
          {site?.homeMessage ?? MEMORIAL.homeMessage}
        </p>
        <Link
          to="/brandon"
          data-testid="learn-about-brandon-button"
          className="mt-9 inline-flex min-h-12 items-center rounded-full bg-gold px-8 py-3 text-base font-extrabold text-forest-deep shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold-soft hover:shadow-md"
        >
          Learn About Brandon
        </Link>
      </div>
      </Reveal>
    </div>
  </section>
  );
};
