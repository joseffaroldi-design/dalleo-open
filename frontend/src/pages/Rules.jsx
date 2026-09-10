import { RULES, RULES_PUBLISHED, RULES_APPROVED } from "@/data/rules";
import { useLiveData } from "@/data/useLiveData";
import { RuleSection } from "@/components/rules/RuleSection";
import { RuleAccordion } from "@/components/rules/RuleAccordion";
import { DraftNotice, QuickReminders, SectionNav } from "@/components/rules/TopSections";
import { RulesEmptyState } from "@/components/rules/RulesEmptyState";

const fromLive = (live) => ({
  header: { title: live.header.title, edition: live.edition, description: live.header.body },
  draftNotice: live.draftNotice,
  quickReminders: live.quickReminders,
  sectionNav: RULES.sectionNav,
  format: { intro: live.formatIntro, points: live.formatPoints, note: live.formatNote },
  matchRules: live.matchRules,
  conduct: live.conduct,
  tiebreakers: { note: live.tiebreakNote, steps: live.tiebreakSteps },
  faq: live.faq,
  unpublished: { title: live.unpublishedTitle, body: live.unpublishedBody },
});

export default function Rules() {
  const live = useLiveData("rules");
  const liveIs2027 = /2027/.test(live?.edition ?? "");
  const published = liveIs2027 ? live.published : RULES_PUBLISHED;
  const approved = liveIs2027 ? live.approved : RULES_APPROVED;
  const R = liveIs2027 ? fromLive(live) : RULES;

  return (
    <div data-testid="rules-page" className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-forest sm:text-5xl">{R.header.title}</h1>
        <p className="mt-3 text-base font-semibold text-charcoal/60 sm:text-lg">{R.header.edition}</p>
        <p className="mt-2 text-base leading-relaxed text-charcoal/60">{R.header.description}</p>
      </header>

      <div className="mt-10">
        {published ? (
          <div className="flex flex-col gap-12 sm:gap-16">
            {!approved && <DraftNotice text={R.draftNotice} />}
            <QuickReminders items={R.quickReminders} />
            <SectionNav links={R.sectionNav} />

            <RuleSection id="format" title="Tournament Format" testId="section-format">
              <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-border sm:p-8">
                <p className="text-base leading-relaxed text-charcoal/70">{R.format.intro}</p>
                <ul className="mt-6 space-y-3">
                  {R.format.points.map((point, i) => (
                    <li key={i} data-testid={`format-point-${i + 1}`} className="flex items-start gap-3">
                      <span aria-hidden="true" className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-gold" />
                      <span className="text-base font-semibold text-charcoal">{point}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 rounded-2xl bg-gold/10 px-4 py-3 text-sm font-semibold text-gold-deep">{R.format.note}</p>
              </div>
            </RuleSection>

            <RuleSection id="match-rules" title="Match Rules" testId="section-match-rules">
              <RuleAccordion items={R.matchRules} testId="match-rules-accordion" />
            </RuleSection>

            <RuleSection id="conduct" title="Player Conduct" testId="section-conduct">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {R.conduct.map((item, i) => (
                  <div key={item.title} data-testid={`conduct-item-${i + 1}`} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-border">
                    <h3 className="text-lg font-extrabold tracking-tight text-forest">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-charcoal/60 sm:text-base">{item.body}</p>
                  </div>
                ))}
              </div>
            </RuleSection>

            <RuleSection id="tiebreakers" title="Tie-Breakers" testId="section-tiebreakers">
              <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-border sm:p-8">
                <ol className="space-y-4">
                  {R.tiebreakers.steps.map((step, i) => (
                    <li key={step} data-testid={`tiebreaker-${i + 1}`} className="flex items-center gap-4">
                      <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest text-sm font-extrabold text-gold">{i + 1}</span>
                      <span className="text-base font-bold text-charcoal sm:text-lg">{step}</span>
                    </li>
                  ))}
                </ol>
                <p className="mt-6 rounded-2xl bg-gold/10 px-4 py-3 text-sm font-semibold text-gold-deep">{R.tiebreakers.note}</p>
              </div>
            </RuleSection>

            <RuleSection id="faq" title="Frequently Asked Questions" testId="section-faq">
              <RuleAccordion items={R.faq} testId="faq-accordion" />
            </RuleSection>
          </div>
        ) : (
          <RulesEmptyState title={R.unpublished.title} body={R.unpublished.body} />
        )}
      </div>
    </div>
  );
}
