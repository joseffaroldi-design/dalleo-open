// One slow editorial marquee — permanent 2026 tournament record.
export const Marquee = () => {
  const items = [
    "7th Annual Dalleo Open",
    "2026 Champions · Team Martin",
    "69 · −3 · Won by 2",
    "September 5, 2026 · LA Tour",
    "144 of 144 Scores Captured",
    "In Memory of Brandon Dalleo",
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
