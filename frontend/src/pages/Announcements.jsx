import { useLiveData } from "@/data/useLiveData";
import { Reveal } from "@/components/motion/Reveal";

const ARCHIVE_ANNOUNCEMENTS = [
  {
    title: "Team Martin Wins the 2026 Dalleo Open",
    date: "September 5, 2026",
    body: "Team Martin finished at 69 (−3) to win the 7th Annual Dalleo Open by two strokes over Team Breaud. All 144 team-hole scores were captured and the 2026 leaderboard is final.",
    priority: "important",
  },
];

// The Bulletin becomes the permanent post-event record after tournament weekend.
export default function Announcements() {
  const live = useLiveData("announcements");
  const published = live?.items
    ?.filter((a) => a.published)
    .map((a) => ({ title: a.title, date: a.date, body: a.message, priority: a.priority })) ?? [];
  const items = published.length > 0 ? published : ARCHIVE_ANNOUNCEMENTS;

  return (
    <div data-testid="announcements-page" className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <header className="max-w-2xl">
        <p className="font-display text-sm italic text-gold-deep">The Bulletin · 2026 Archive</p>
        <div className="mt-2 flex flex-wrap items-center gap-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-forest sm:text-5xl">
            Tournament Recap
          </h1>
        </div>
        <p className="mt-4 text-base leading-relaxed text-charcoal/60 sm:text-lg">
          The permanent record of the 7th Annual Dalleo Open.
        </p>
      </header>

      <div className="mt-12 flex flex-col">
        {items.map((item, i) => (
          <Reveal key={`${item.title}-${item.date}`} delay={0.05 + i * 0.06}>
            <article
              data-testid={`announcement-entry-${i + 1}`}
              className={i === 0 ? "rounded-3xl bg-white p-8 shadow-md ring-1 ring-gold/40 sm:p-10" : "border-t border-border px-2 py-8 sm:px-4"}
            >
              <p className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-widest text-charcoal/40">
                {i === 0 && (
                  <span className="rounded-full bg-forest px-3 py-1 text-[10px] tracking-widest text-gold">
                    Final
                  </span>
                )}
                {item.date}
                {item.priority === "important" && (
                  <span className="rounded-full bg-gold px-2.5 py-0.5 text-[10px] normal-case tracking-normal text-forest-deep">
                    Official
                  </span>
                )}
              </p>
              <h2
                data-testid={`announcement-title-${i + 1}`}
                className={`mt-3 font-extrabold tracking-tight text-charcoal ${i === 0 ? "font-display text-2xl sm:text-3xl" : "text-xl"}`}
              >
                {item.title}
              </h2>
              <p className={`mt-3 leading-relaxed text-charcoal/65 ${i === 0 ? "text-base sm:text-lg" : "text-base"}`}>
                {item.body}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
