import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Medal, Quote, Star } from "lucide-react";
import { CHAMPIONS, editionLabel } from "@/data/champions";
import { useLiveData } from "@/data/useLiveData";
import { getInitials } from "@/data/teams";
import { Reveal, MaskedLine } from "@/components/motion/Reveal";
import { PhotoFrame } from "@/components/champions/PhotoFrame";

const Section = ({ eyebrow, title, testId, children, className = "" }) => (
  <section aria-label={title} className={`mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20 ${className}`}>
    <Reveal>
      <p className="font-display text-sm italic text-gold-deep">{eyebrow}</p>
      <h2 data-testid={testId} className="mt-2 text-base font-bold uppercase tracking-[0.2em] text-charcoal md:text-lg">
        {title}
      </h2>
    </Reveal>
    <div className="mt-8">{children}</div>
  </section>
);

export default function ChampionDetail() {
  const { year: yearParam } = useParams();
  const live = useLiveData("champions");
  const doc = live ?? CHAMPIONS;
  const year = Number(yearParam);
  const entries = [...doc.entries].filter((e) => e.published).sort((a, b) => b.year - a.year);
  const entry = entries.find((e) => e.year === year);

  if (!/^\d{4}$/.test(yearParam ?? "") || (live && !entry)) {
    return <Navigate to="/champions" replace />;
  }
  if (!entry) return null;

  const idx = entries.indexOf(entry);
  const newer = idx > 0 ? entries[idx - 1] : null;
  const older = idx < entries.length - 1 ? entries[idx + 1] : null;

  return (
    <div data-testid="champion-detail-page">
      <section className="relative overflow-hidden bg-forest-deep" aria-labelledby="champion-title">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 80% 55% at 50% 0%, rgba(46,107,82,0.5), transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-14 text-center sm:px-6 sm:pt-20">
          <Reveal y={12}>
            <Link
              to="/champions"
              data-testid="back-to-champions-link"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-cream/10 px-5 py-2 text-sm font-bold text-cream transition-colors duration-200 hover:bg-cream/20"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              The Trophy Wall
            </Link>
          </Reveal>
          <p
            data-testid="champion-edition"
            className="mt-10 text-xs font-bold uppercase tracking-[0.3em] text-gold sm:text-sm"
          >
            {editionLabel(entry.year)} Dalleo Open · {entry.year}
          </p>
          <h1
            id="champion-title"
            data-testid="champion-title"
            className="mt-6 font-display text-5xl font-semibold leading-[0.98] tracking-tight text-cream sm:text-7xl"
          >
            <MaskedLine delay={0.2}>{entry.teamName}</MaskedLine>
          </h1>
          <Reveal delay={0.4}>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <span
                data-testid="champion-detail-score"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 text-base font-extrabold text-forest-deep"
              >
                <Medal className="h-5 w-5" aria-hidden="true" />
                {entry.finalScore}
              </span>
              {entry.margin && (
                <span className="text-sm font-bold text-cream/60">Winning margin · {entry.margin}</span>
              )}
              {entry.placeholder && (
                <span className="rounded-full bg-cream/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gold">
                  Placeholder entry
                </span>
              )}
            </div>
          </Reveal>
          <Reveal delay={0.55}>
            <div className="mx-auto mt-12 max-w-3xl">
              <PhotoFrame
                caption={entry.photoCaption || `${entry.year} championship photo — coming soon`}
                testId="champion-hero-photo"
                aspect="aspect-[16/9]"
                src={entry.photoUrl}
              />
            </div>
          </Reveal>
        </div>
      </section>

      <Section eyebrow="Chapter I" title="The Team" testId="champion-roster-title">
        <Reveal>
          <ul data-testid="champion-roster" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {entry.members.map((name, i) => (
              <li
                key={name}
                data-testid={`champion-player-${i + 1}`}
                className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-border"
              >
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest text-sm font-extrabold text-gold ring-2 ring-gold/60"
                >
                  {getInitials(name)}
                </span>
                <div>
                  <p className="text-base font-extrabold tracking-tight text-charcoal">{name}</p>
                  {i === 0 && (
                    <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Captain</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      {entry.stats.length > 0 && (
        <section aria-label="Championship statistics" className="bg-white">
          <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
            <Reveal>
              <p className="font-display text-sm italic text-gold-deep">Chapter II</p>
              <h2 data-testid="champion-stats-title" className="mt-2 text-base font-bold uppercase tracking-[0.2em] text-charcoal md:text-lg">
                By the Numbers
              </h2>
            </Reveal>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {entry.stats.map((stat, i) => (
                <Reveal key={stat.label} delay={0.05 + i * 0.05} className="h-full">
                  <div
                    data-testid={`champion-stat-${i + 1}`}
                    className="flex h-full flex-col rounded-2xl bg-cream p-6 ring-1 ring-border"
                  >
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-charcoal/40">
                      {stat.label}
                    </p>
                    <p className="mt-3 font-display text-2xl font-semibold text-forest sm:text-3xl">
                      {stat.value}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <Section eyebrow="Chapter III" title="Story of the Championship" testId="champion-story-title">
        <Reveal>
          <p data-testid="champion-story" className="max-w-3xl font-display text-xl italic leading-relaxed text-charcoal/80 sm:text-2xl">
            {entry.story}
          </p>
        </Reveal>
        {entry.quote && (
          <Reveal delay={0.1}>
            <blockquote
              data-testid="champion-quote"
              className="mt-10 flex max-w-3xl gap-4 rounded-3xl bg-forest-mist p-7 sm:p-9"
            >
              <Quote className="h-6 w-6 shrink-0 text-gold-deep" aria-hidden="true" />
              <p className="text-lg font-semibold italic leading-relaxed text-forest sm:text-xl">
                {entry.quote}
              </p>
            </blockquote>
          </Reveal>
        )}
      </Section>

      {entry.moments.length > 0 && (
        <section aria-label="Memorable moments" className="bg-forest-deep">
          <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
            <Reveal>
              <p className="font-display text-sm italic text-gold-soft">Chapter IV</p>
              <h2 data-testid="champion-moments-title" className="mt-2 text-base font-bold uppercase tracking-[0.2em] text-gold md:text-lg">
                Memorable Moments
              </h2>
            </Reveal>
            <ul className="mt-8 flex flex-col gap-4">
              {entry.moments.map((moment, i) => (
                <Reveal key={i} delay={0.05 + i * 0.06}>
                  <li
                    data-testid={`champion-moment-${i + 1}`}
                    className="flex items-start gap-4 rounded-2xl bg-forest p-6 ring-1 ring-cream/10"
                  >
                    <span aria-hidden="true" className="mt-1.5 text-[10px] text-gold">◆</span>
                    <p className="text-sm leading-relaxed text-cream/80 sm:text-base">{moment}</p>
                  </li>
                </Reveal>
              ))}
            </ul>
            {entry.mvp && (
              <Reveal delay={0.15}>
                <p data-testid="champion-mvp" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold/15 px-5 py-2 text-sm font-bold text-gold">
                  <Star className="h-4 w-4" aria-hidden="true" />
                  MVP · {entry.mvp}
                </p>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {entry.awards.length > 0 && (
        <Section eyebrow="Chapter V" title="Awards" testId="champion-awards-title">
          <Reveal>
            <ul data-testid="champion-awards" className="flex flex-wrap gap-3">
              {entry.awards.map((award) => (
                <li
                  key={award}
                  className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white px-5 py-2.5 text-sm font-bold text-forest"
                >
                  <Medal className="h-4 w-4 text-gold-deep" aria-hidden="true" />
                  {award}
                </li>
              ))}
            </ul>
          </Reveal>
        </Section>
      )}

      <Section eyebrow="Chapter VI" title="From the Day" testId="champion-gallery-title">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {[0, 1, 2].map((n) => (
            <Reveal key={n} delay={0.05 + n * 0.06}>
              <PhotoFrame
                caption={`${entry.year} gallery photo ${n + 1} — coming soon`}
                testId={`champion-gallery-photo-${n + 1}`}
                aspect="aspect-square"
              />
            </Reveal>
          ))}
        </div>
      </Section>

      <nav aria-label="More champions" className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        <Reveal>
          <div className="flex flex-col gap-4 border-t border-gold/30 pt-10 sm:flex-row sm:items-center sm:justify-between">
            {older ? (
              <Link
                to={`/champions/${older.year}`}
                data-testid="champion-prev-link"
                className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-extrabold text-cream transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-soft"
              >
                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true" />
                {older.year} · {older.teamName}
              </Link>
            ) : (
              <span />
            )}
            {newer && (
              <Link
                to={`/champions/${newer.year}`}
                data-testid="champion-next-link"
                className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-extrabold text-cream transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-soft"
              >
                {newer.year} · {newer.teamName}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            )}
          </div>
        </Reveal>
      </nav>
    </div>
  );
}
