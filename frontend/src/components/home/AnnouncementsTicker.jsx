import { useQuery } from "@tanstack/react-query";
import { fetchPublic } from "@/lib/api";

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
// The band keeps its height while loading so the page never jumps, and items
// repeat enough times that the loop is always seamless (no gap on reset).
export const AnnouncementsTicker = () => {
  const { data: live, isLoading } = useQuery({
    queryKey: ["public", "announcements"],
    queryFn: () => fetchPublic("announcements"),
    staleTime: 30_000,
    retry: 1,
  });

  const items = live
    ? live.items
        .filter((a) => a.published)
        .map((a) => ({ title: a.title, body: a.message, priority: a.priority }))
    : isLoading
      ? []
      : SAMPLE_ANNOUNCEMENTS;

  // Short lists must repeat so one half of the loop exceeds the viewport width.
  const repeats = items.length <= 2 ? 6 : 3;

  const row = (hidden) => (
    <div aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {Array.from({ length: repeats }).flatMap((_, r) =>
        items.map((item) => (
          <span key={`${r}-${item.title}`} className="flex items-center whitespace-nowrap">
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
        ))
      )}
    </div>
  );

  return (
    <div
      data-testid="announcements-ticker"
      role="region"
      aria-label="Tournament announcements"
      className="overflow-hidden border-b border-gold/20 bg-forest-deep py-2.5"
    >
      <div
        className={`flex min-h-5 w-max animate-ticker transition-opacity [transition-duration:400ms] hover:[animation-play-state:paused] ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
};
