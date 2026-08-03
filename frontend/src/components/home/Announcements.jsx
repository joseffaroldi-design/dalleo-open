import { Megaphone } from "lucide-react";

const SAMPLE_ANNOUNCEMENTS = [
  {
    title: "Draft Party details are coming together",
    date: "Sample announcement",
    body: "Friday night's Draft Party venue and start time will be revealed soon — stay tuned.",
  },
  {
    title: "Team registration opens this summer",
    date: "Sample announcement",
    body: "Grab your playing partners early. Spots for the 8th Annual Dalleo Open will be limited.",
  },
  {
    title: "A weekend that gives back",
    date: "Sample announcement",
    body: "This year's tournament continues Brandon's legacy by supporting causes close to his heart.",
  },
];

export const Announcements = () => (
  <section
    data-testid="announcements-section"
    aria-labelledby="announcements-title"
    className="bg-white"
  >
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="flex items-center justify-between gap-4">
        <h2
          id="announcements-title"
          className="text-base font-bold uppercase tracking-[0.2em] text-gold-deep md:text-lg"
        >
          Announcements
        </h2>
        <span className="rounded-full bg-gold/15 px-4 py-1 text-xs font-bold uppercase tracking-widest text-gold-deep">
          Sample
        </span>
      </div>
      <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-cream shadow-sm">
        {SAMPLE_ANNOUNCEMENTS.map((item, i) => (
          <article
            key={item.title}
            data-testid={`announcement-card-${i + 1}`}
            className={`flex gap-5 p-6 sm:p-8 ${
              i > 0 ? "border-t border-border" : ""
            }`}
          >
            <span
              aria-hidden="true"
              className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest-mist text-forest"
            >
              <Megaphone className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-charcoal/40">
                {item.date}
              </p>
              <h3 className="mt-1 text-lg font-extrabold tracking-tight text-charcoal">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-charcoal/60">
                {item.body}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
