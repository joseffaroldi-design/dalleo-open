import { useLiveData } from "@/data/useLiveData";

const SAMPLE_ANNOUNCEMENTS = [
  {
    title: "Draft Party details are coming together",
    body: "Friday night's Draft Party venue and start time will be revealed soon — stay tuned.",
    priority: "normal",
  },
  {
    title: "Team registration opens this summer",
    body: "Grab your playing partners early. Spots for the 7th Annual Dalleo Open will be limited.",
    priority: "normal",
  },
  {
    title: "A weekend that gives back",
    body: "This year's tournament continues Brandon's legacy by supporting causes close to his heart.",
    priority: "normal",
  },
];

// Rolling bulletin band pinned to the very top of the homepage — published
// announcements scroll continuously; hovering pauses the roll for reading.
export const AnnouncementsTicker = () => {
  const live = useLiveData("announcements");
  const items = live
    ? live.items
        .filter((a) => a.published)
        .map((a) => ({ title: a.title, body: a.message, priority: a.priority }))
    : SAMPLE_ANNOUNCEMENTS;
  if (!items.length) return null;

  const row = (hidden) => (
    <div aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item) => (
        <span key={item.title} className="flex items-center whitespace-nowrap">
          {item.priority === "important" && (
            <span className="mr-3 rounded-full bg-gold px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-forest-deep">
              Important
            </span>
          )}
          <span className="text-sm font-semibold text-cream/85">
            <span className="font-display italic text-gold-soft">{item.title}</span>
            <span aria-hidden="true" className="mx-2 text-cream/40">—</span>
            {item.body}
          </span>
          <span aria-hidden="true" className="mx-8 text-[10px] text-gold/70">◆</span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      data-testid="announcements-ticker"
      role="region"
      aria-label="Tournament announcements"
      className="overflow-hidden border-b border-gold/20 bg-forest-deep py-2.5"
    >
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
};
