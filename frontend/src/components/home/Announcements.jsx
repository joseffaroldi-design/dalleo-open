import { Link } from "react-router-dom";
import { ArrowRight, Megaphone } from "lucide-react";
import { useLiveData } from "@/data/useLiveData";
import { Reveal } from "@/components/motion/Reveal";

const ARCHIVE_RECAP = {
  title: "Team Martin Wins the 2026 Dalleo Open",
  date: "September 5, 2026",
  body: "Team Martin finished at 69 (−3) to win by two strokes over Team Breaud. All 144 team-hole scores were captured and the final leaderboard is preserved.",
  priority: "important",
};

export const Announcements = () => {
  const live = useLiveData("announcements");
  const published = live?.items
    ?.filter((a) => a.published)
    .map((a) => ({ title: a.title, date: a.date, body: a.message, priority: a.priority })) ?? [];

  const has2027Announcement = published.some((item) => /2027/.test(`${item.title} ${item.date} ${item.body}`));
  const hasArchiveRecap = published.some((item) => /Team Martin/i.test(item.title) && /2026/.test(`${item.title} ${item.date} ${item.body}`));
  const withArchive = hasArchiveRecap ? published : [ARCHIVE_RECAP, ...published];
  const items = (has2027Announcement ? published : withArchive).slice(0, 3);

  return (
    <section data-testid="announcements-section" aria-labelledby="announcements-title" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <Reveal>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-display text-sm italic text-gold-deep">Chapter 02 · The Bulletin</p>
            <h2 id="announcements-title" className="mt-2 text-base font-bold uppercase tracking-[0.2em] text-gold-deep md:text-lg">Announcements</h2>
          </div>
          <Link to="/announcements" data-testid="view-all-announcements" className="group inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold text-forest transition-colors duration-200 hover:bg-forest-mist">
            All Announcements
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </Reveal>
      <Reveal delay={0.12}>
        <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-cream shadow-sm">
          {items.map((item, i) => (
            <article key={`${item.title}-${item.date}`} data-testid={`announcement-card-${i + 1}`} className={`flex gap-5 p-6 sm:p-8 ${i > 0 ? "border-t border-border" : ""}`}>
              <span aria-hidden="true" className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest-mist text-forest"><Megaphone className="h-5 w-5" /></span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-charcoal/40">
                  {item.date}
                  {item.priority === "important" && <span className="ml-2 rounded-full bg-gold px-2 py-0.5 text-[10px] normal-case tracking-normal text-forest-deep">Important</span>}
                </p>
                <h3 className="mt-1 text-lg font-extrabold tracking-tight text-charcoal">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-charcoal/60">{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
};
