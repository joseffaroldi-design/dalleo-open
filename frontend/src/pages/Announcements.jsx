import { useLiveData } from "@/data/useLiveData";
import { Reveal } from "@/components/motion/Reveal";

const ARCHIVE_RECAP = {
  title: "Team Martin Wins the 2026 Dalleo Open",
  date: "September 5, 2026",
  body: "Team Martin finished at 69 (−3) to win the 7th Annual Dalleo Open by two strokes over Team Breaud. All 144 team-hole scores were captured and the 2026 leaderboard is final.",
  priority: "important",
};

const isYear = (item, year) => year && new RegExp(`\\b${year}\\b`).test(`${item.title} ${item.date} ${item.body}`);
const isArchiveRecap = (item) => /Team Martin/i.test(item.title) && /2026/.test(`${item.title} ${item.date} ${item.body}`);

export default function Announcements() {
  const live = useLiveData("announcements");
  const site = useLiveData("site");
  const currentYear = String(live?.year ?? site?.year ?? "");
  const published = live?.items
    ?.filter((a) => a.published)
    .map((a) => ({ title: a.title, date: a.date, body: a.message, priority: a.priority })) ?? [];

  const hasArchiveRecap = published.some(isArchiveRecap);
  const allItems = hasArchiveRecap ? [...published] : [ARCHIVE_RECAP, ...published];
  const items = allItems
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const aCurrent = isYear(a.item, currentYear) ? 1 : 0;
      const bCurrent = isYear(b.item, currentYear) ? 1 : 0;
      if (aCurrent !== bCurrent) return bCurrent - aCurrent;
      const aRecap = isArchiveRecap(a.item) ? 1 : 0;
      const bRecap = isArchiveRecap(b.item) ? 1 : 0;
      if (aRecap !== bRecap) return bRecap - aRecap;
      return a.index - b.index;
    })
    .map(({ item }) => item);

  return (
    <div data-testid="announcements-page" className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <header className="max-w-2xl">
        <p className="font-display text-sm italic text-gold-deep">The Bulletin</p>
        <div className="mt-2 flex flex-wrap items-center gap-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-forest sm:text-5xl">Announcements</h1>
        </div>
        <p className="mt-4 text-base leading-relaxed text-charcoal/60 sm:text-lg">Current updates plus the permanent record of the 2026 Dalleo Open.</p>
      </header>

      <div className="mt-12 flex flex-col">
        {items.map((item, i) => {
          const archiveRecap = isArchiveRecap(item);
          return (
            <Reveal key={`${item.title}-${item.date}`} delay={0.05 + i * 0.06}>
              <article data-testid={`announcement-entry-${i + 1}`} className={i === 0 ? "rounded-3xl bg-white p-8 shadow-md ring-1 ring-gold/40 sm:p-10" : "border-t border-border px-2 py-8 sm:px-4"}>
                <p className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-widest text-charcoal/40">
                  {i === 0 && <span className="rounded-full bg-forest px-3 py-1 text-[10px] tracking-widest text-gold">Latest</span>}
                  {item.date}
                  {archiveRecap && <span className="rounded-full bg-gold px-2.5 py-0.5 text-[10px] normal-case tracking-normal text-forest-deep">2026 Final</span>}
                </p>
                <h2 data-testid={`announcement-title-${i + 1}`} className={`mt-3 font-extrabold tracking-tight text-charcoal ${i === 0 ? "font-display text-2xl sm:text-3xl" : "text-xl"}`}>{item.title}</h2>
                <p className={`mt-3 leading-relaxed text-charcoal/65 ${i === 0 ? "text-base sm:text-lg" : "text-base"}`}>{item.body}</p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
