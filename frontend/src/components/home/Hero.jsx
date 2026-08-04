import { ImageIcon } from "lucide-react";
import { useLiveData } from "@/data/useLiveData";
import { Countdown } from "@/components/home/Countdown";

export const Hero = () => {
  const site = useLiveData("site");
  return (
  <section data-testid="hero-section" aria-labelledby="hero-title" className="bg-forest">
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24">
      <span
        aria-hidden="true"
        className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-forest-deep text-xl font-extrabold text-gold ring-2 ring-gold"
      >
        DO
      </span>
      <p
        data-testid="hero-memorial-line"
        className="text-sm font-bold uppercase tracking-[0.25em] text-gold"
      >
        {site?.heroSubtitle ?? "In Memory of Brandon Dalleo"}
      </p>
      <h1
        id="hero-title"
        data-testid="hero-title"
        className="mt-4 text-4xl font-extrabold tracking-tight text-cream sm:text-5xl lg:text-6xl"
      >
        {site?.edition ?? "8th Annual Dalleo Open"}
      </h1>
      <p
        data-testid="hero-date-placeholder"
        className="mt-5 text-base font-semibold text-cream/70 sm:text-lg"
      >
        {site?.dateText ?? "Tournament dates to be announced"}
      </p>
      <Countdown />
    </div>
    <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      <div
        data-testid="hero-image-placeholder"
        role="img"
        aria-label="Hero image placeholder — tournament photo coming soon"
        className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-cream/25 bg-forest-deep/60 text-cream/50 sm:aspect-[21/9]"
      >
        <ImageIcon className="h-10 w-10" aria-hidden="true" />
        <span className="text-sm font-semibold">Tournament photo coming soon</span>
      </div>
    </div>
  </section>
  );
};
