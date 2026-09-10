import { useLiveData } from "@/data/useLiveData";
import { Reveal } from "@/components/motion/Reveal";

const SAMPLE_ANNOUNCEMENTS = [
  {
    title: "Draft Party details are coming together",
    date: "Sample announcement",
    body: "Friday night's Draft Party venue and start time will be revealed soon — stay tuned.",
    priority: "normal",
  },
  {
    title: "Team registration opens this summer",
    date: "Sample announcement",
    body: "Grab your playing partners early. Spots for the 7th Annual Dalleo Open will be limited.",
    priority: "normal",
  },
  {
    title: "A weekend that gives back",
    date: "Sample announcement",
    body: "This year's tournament continues Brandon's legacy by supporting causes close to his heart.",
    priority: "normal",
  },
];

// The Bulletin — a permanent, blog-style home for every announcement that
// rolls through the homepage banner. Same live data, room to read.
export default function Announcements() {
  const live = useLiveData("announcements");
  const items = live
    ? live.items
        .filter((a) => a.published)
        .map((a) => ({ title: a.title, date: a.date, body: a.message, priority: a.priority }))
    : SAMPLE_ANNOUNCEMENTS;

  return (
    <div data-testid="announcements-page" className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <header className="max-w-2xl">
        <p className="font-display text-sm italic text-gold-deep">The Bulletin</p>
        <div className="mt-2 flex flex-wrap items-center gap-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-forest sm:text-5xl">
            Announcements
          </h1>
          {!live && (
            <span className="rounded-full bg-gold/15 px-4 py-1 text-xs font-bold uppercase tracking-widest text-gold-deep">
              Sample
            </span>
          )}
        </div>
        <p className="mt-4 text-base leading-relaxed text-charcoal/60 sm:text-lg">
          News and updates from the clubhouse — everything worth knowing, in one place.
        </p>
      </header>

      {items.length === 0 ? (
        <p
          data-testid="announcements-empty"
          className="mt-12 rounded-3xl bg-white p-10 text-center text-sm font-semibold text-charcoal/50 shadow-sm ring-1 ring-border"
        >
          No announcements right now — check back soon.
        </p>
      ) : (
        <div className="mt-12 flex flex-col">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={0.05 + i * 0.06}>
              <article
                data-testid={`announcement-entry-${i + 1}`}
                className={i === 0 ? "rounded-3xl bg-white p-8 shadow-md ring-1 ring-gold/40 sm:p-10" : "border-t border-border px-2 py-8 sm:px-4"}
              >
                <p className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-widest text-charcoal/40">
                  {i === 0 && (
                    <span className="rounded-full bg-forest px-3 py-1 text-[10px] tracking-widest text-gold">
                      Latest
                    </span>
                  )}
                  {item.date}
                  {item.priority === "important" && (
                    <span className="rounded-full bg-gold px-2.5 py-0.5 text-[10px] normal-case tracking-normal text-forest-deep">
                      Important
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
      )}
    </div>
  );
}
