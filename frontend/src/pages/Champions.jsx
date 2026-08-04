import { Link } from "react-router-dom";
import { ArrowRight, Medal } from "lucide-react";
import { CHAMPIONS, editionLabel } from "@/data/champions";
import { useLiveData } from "@/data/useLiveData";
import { Reveal, MaskedLine } from "@/components/motion/Reveal";
import { TrophyEmblem } from "@/components/champions/TrophyEmblem";
import { PhotoFrame } from "@/components/champions/PhotoFrame";

const PlaceholderChip = () => (
  <span className="inline-flex items-center rounded-full bg-gold/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gold-deep">
    Placeholder
  </span>
);

const ChampionCard = ({ entry, index }) => (
  <Reveal delay={0.05}>
    <article data-testid={`champion-card-${entry.year}`} className="relative pl-10 sm:pl-14">
      <span
        aria-hidden="true"
        className="absolute left-[-7px] top-3 h-3.5 w-3.5 rounded-full bg-gold ring-4 ring-gold/20"
      />
      <p className="font-display text-5xl font-semibold tracking-tight text-forest sm:text-6xl">
        {entry.year}
      </p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.25em] text-gold-deep">
        {editionLabel(entry.year)} Dalleo Open
      </p>
      <Link
        to={`/champions/${entry.year}`}
        data-testid={`champion-link-${entry.year}`}
        className="group mt-6 block rounded-3xl border border-border bg-white p-7 shadow-sm transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-lg sm:p-9"
      >
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_260px] md:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-charcoal transition-colors duration-300 group-hover:text-forest sm:text-4xl">
                {entry.teamName}
              </h2>
              {entry.placeholder && <PlaceholderChip />}
            </div>
            <p className="mt-3 text-sm font-semibold text-charcoal/60 sm:text-base">
              Captain {entry.captain} · {entry.members.length} players
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span
                data-testid={`champion-score-${entry.year}`}
                className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2 text-sm font-extrabold text-gold"
              >
                <Medal className="h-4 w-4" aria-hidden="true" />
                {entry.finalScore}
              </span>
              {entry.margin && (
                <span className="text-sm font-bold text-charcoal/50">Won by {entry.margin}</span>
              )}
            </div>
            <p className="mt-5 text-sm leading-relaxed text-charcoal/60 line-clamp-3 sm:text-base">
              {entry.story}
            </p>
            {entry.mvp && (
              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-charcoal/40">
                MVP · <span className="text-gold-deep">{entry.mvp}</span>
              </p>
            )}
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-forest transition-colors duration-300 group-hover:text-gold-deep">
              View Championship
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </div>
          <PhotoFrame
            caption={entry.photoCaption || `${entry.year} championship photo — coming soon`}
            testId={`champion-photo-${entry.year}`}
            aspect="aspect-[4/3]"
            src={entry.photoUrl}
          />
        </div>
      </Link>
    </article>
  </Reveal>
);

export default function Champions() {
  const live = useLiveData("champions");
  const doc = live ?? CHAMPIONS;
  const entries = [...doc.entries].filter((e) => e.published).sort((a, b) => b.year - a.year);
  const hasPlaceholders = entries.some((e) => e.placeholder);

  return (
    <div data-testid="champions-page">
      <section className="relative overflow-hidden bg-forest-deep" aria-labelledby="champions-title">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 80% 55% at 50% 0%, rgba(46,107,82,0.5), transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <Reveal y={16}>
            <div className="flex justify-center">
              <TrophyEmblem />
            </div>
          </Reveal>
          <p
            data-testid="champions-eyebrow"
            className="mt-8 text-xs font-bold uppercase tracking-[0.3em] text-gold sm:text-sm"
          >
            The Trophy Wall · Est. 2020
          </p>
          <h1
            id="champions-title"
            data-testid="champions-title"
            className="mt-6 font-display text-6xl font-semibold leading-[0.98] tracking-tight text-cream sm:text-7xl lg:text-8xl"
          >
            <MaskedLine delay={0.2}>{doc.header.title}</MaskedLine>
          </h1>
          <Reveal delay={0.45}>
            <p
              data-testid="champions-subtitle"
              className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-cream/70 sm:text-lg"
            >
              {doc.header.body}
            </p>
          </Reveal>
        </div>
      </section>

      <section aria-label="Champion timeline" className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <p className="font-display text-sm italic text-gold-deep">Chapter I · The Roll of Honor</p>
          <h2 className="mt-2 text-base font-bold uppercase tracking-[0.2em] text-charcoal md:text-lg">
            Every Champion
          </h2>
          {hasPlaceholders && (
            <p
              data-testid="champions-placeholder-notice"
              className="mt-4 inline-flex rounded-full bg-gold/10 px-4 py-1.5 text-xs font-bold text-gold-deep"
            >
              Championship history is being compiled — names and scores shown are placeholders awaiting official records.
            </p>
          )}
        </Reveal>
        <div
          data-testid="champion-timeline"
          className="mt-12 flex flex-col gap-16 border-l border-gold/30 sm:gap-20"
        >
          {entries.map((entry, i) => (
            <ChampionCard key={entry.year} entry={entry} index={i} />
          ))}
        </div>
      </section>

      <section aria-labelledby="records-title" className="bg-forest-deep">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <Reveal>
            <p className="font-display text-sm italic text-gold-soft">Chapter II · The Hall of Records</p>
            <h2
              id="records-title"
              data-testid="records-title"
              className="mt-2 text-base font-bold uppercase tracking-[0.2em] text-gold md:text-lg"
            >
              Tournament Records
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-cream/60 sm:text-base">
              The marks every team chases. Records are ratified by the committee and updated after each championship.
            </p>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {doc.records.map((rec, i) => (
              <Reveal key={rec.id} delay={0.05 + (i % 3) * 0.06} className="h-full">
                <div
                  data-testid={`record-card-${rec.id}`}
                  className="flex h-full flex-col rounded-3xl bg-forest p-7 ring-1 ring-cream/10 transition-colors duration-300 hover:ring-gold/40"
                >
                  <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-gold">
                    {rec.label}
                  </p>
                  <p className="mt-4 font-display text-4xl font-semibold text-cream">{rec.value}</p>
                  <p className="mt-2 text-sm font-bold text-cream/70">{rec.holder}</p>
                  {rec.year && <p className="text-xs font-semibold text-cream/40">{rec.year}</p>}
                  {rec.note && <p className="mt-4 text-xs leading-relaxed text-cream/45">{rec.note}</p>}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
