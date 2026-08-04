import { useLiveData } from "@/data/useLiveData";

// One slow editorial marquee — tournament journal masthead band.
export const Marquee = () => {
  const site = useLiveData("site");
  const items = [
    site?.edition ?? "8th Annual Dalleo Open",
    "September 5, 2026",
    "In Memory of Brandon Dalleo",
    "Four-Person Scramble Championship",
    "8 Teams · One Round · Lowest Score Wins",
  ];

  const row = (hidden) => (
    <div aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item) => (
        <span key={item} className="flex items-center whitespace-nowrap">
          <span className="font-display text-lg italic text-cream/85 sm:text-xl">{item}</span>
          <span aria-hidden="true" className="mx-8 text-[10px] text-gold/70">◆</span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      data-testid="editorial-marquee"
      className="overflow-hidden border-y border-gold/20 bg-forest-deep py-4"
    >
      <div className="flex w-max animate-marquee">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
};
