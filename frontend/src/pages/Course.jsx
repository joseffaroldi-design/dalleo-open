import { Flag, MapPin, Info } from "lucide-react";
import { COURSE } from "@/data/course";
import { useLiveData } from "@/data/useLiveData";
import { DEFAULT_PAR, HOLES } from "@/data/scoring";
import { Reveal, MaskedLine } from "@/components/motion/Reveal";

const ScorecardTable = ({ par }) => {
  const out = par.slice(0, 9).reduce((a, b) => a + b, 0);
  const inn = par.slice(9).reduce((a, b) => a + b, 0);
  const row = (label, cells, strong = false) => (
    <tr>
      <td className={`py-2 pr-3 text-left text-[10px] font-bold uppercase tracking-widest ${strong ? "text-gold-deep" : "text-charcoal/40"}`}>
        {label}
      </td>
      {cells.map((c, i) => (
        <td key={i} className={`py-2 text-center text-sm ${strong ? "font-extrabold text-forest" : "font-semibold text-charcoal/60"}`}>
          {c}
        </td>
      ))}
    </tr>
  );
  return (
    <div className="overflow-x-auto rounded-2xl bg-white p-5 shadow-sm ring-1 ring-border sm:p-6">
      <table data-testid="course-scorecard" className="w-full min-w-[560px] table-fixed">
        <tbody>
          {row("Hole", HOLES, true)}
          {row("Par", par)}
          {row("Out / In / Total", [`${out}`, "", "", "", "", "", "", "", "", `${inn}`, "", "", "", "", "", "", "", "", `${out + inn}`], true)}
        </tbody>
      </table>
    </div>
  );
};

export default function Course() {
  const live = useLiveData("course");
  const scoring = useLiveData("scoring");
  const doc = live ?? COURSE;
  const par = scoring?.par?.length === 18 ? scoring.par : DEFAULT_PAR;

  return (
    <div data-testid="course-page">
      <section className="relative overflow-hidden bg-forest-deep" aria-labelledby="course-title">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 80% 55% at 50% 0%, rgba(46,107,82,0.5), transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <Reveal y={16}>
            <span aria-hidden="true" className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 text-gold ring-2 ring-gold/60">
              <Flag className="h-7 w-7" />
            </span>
          </Reveal>
          <p data-testid="course-eyebrow" className="mt-8 text-xs font-bold uppercase tracking-[0.3em] text-gold sm:text-sm">
            The Course · 2026 Dalleo Open
          </p>
          <h1
            id="course-title"
            data-testid="course-title"
            className="mt-6 font-display text-6xl font-semibold leading-[0.98] tracking-tight text-cream sm:text-7xl"
          >
            <MaskedLine delay={0.2}>{doc.name}</MaskedLine>
          </h1>
          {doc.location && (
            <Reveal delay={0.4}>
              <p data-testid="course-location" className="mt-5 inline-flex items-center gap-2 text-base font-semibold text-cream/70">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {doc.location}
              </p>
            </Reveal>
          )}
          {doc.label && (
            <Reveal delay={0.5}>
              <p data-testid="course-facts" className="mt-6 inline-block rounded-full bg-cream/10 px-6 py-2.5 text-sm font-bold text-gold sm:text-base">
                {doc.label}
              </p>
            </Reveal>
          )}
        </div>
      </section>

      <section aria-labelledby="scorecard-title" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <Reveal>
          <p className="font-display text-sm italic text-gold-deep">Chapter I · The Card</p>
          <h2 id="scorecard-title" className="mt-2 text-base font-bold uppercase tracking-[0.2em] text-charcoal md:text-lg">
            Scorecard — Black Tees
          </h2>
        </Reveal>
        <div className="mt-8">
          <Reveal delay={0.1}>
            <ScorecardTable par={par} />
          </Reveal>
        </div>
      </section>

      {doc.goodToKnow.length > 0 && (
        <section aria-labelledby="good-to-know-title" className="bg-white">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
            <Reveal>
              <p className="font-display text-sm italic text-gold-deep">Chapter II · Good to Know</p>
              <h2 id="good-to-know-title" data-testid="good-to-know-title" className="mt-2 text-base font-bold uppercase tracking-[0.2em] text-charcoal md:text-lg">
                Before You Tee It Up
              </h2>
            </Reveal>
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {doc.goodToKnow.map((topic, i) => (
                <Reveal key={topic.id} delay={0.05 + (i % 2) * 0.06} className="h-full">
                  <div
                    data-testid={`good-to-know-${topic.id}`}
                    className="flex h-full flex-col rounded-2xl bg-cream p-6 ring-1 ring-border"
                  >
                    <p className="flex items-center gap-2 text-sm font-extrabold text-forest">
                      <Info className="h-4 w-4 text-gold-deep" aria-hidden="true" />
                      {topic.title}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-charcoal/60">{topic.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
