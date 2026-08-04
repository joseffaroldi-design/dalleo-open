import { RULES, RULES_PUBLISHED, RULES_APPROVED } from "@/data/rules";
import { RuleSection } from "@/components/rules/RuleSection";
import { RuleAccordion } from "@/components/rules/RuleAccordion";
import { DraftNotice, QuickReminders, SectionNav } from "@/components/rules/TopSections";
import { RulesEmptyState } from "@/components/rules/RulesEmptyState";

export default function Rules() {
  return (
    <div data-testid="rules-page" className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-forest sm:text-5xl">
          {RULES.header.title}
        </h1>
        <p className="mt-3 text-base font-semibold text-charcoal/60 sm:text-lg">
          {RULES.header.edition}
        </p>
        <p className="mt-2 text-base leading-relaxed text-charcoal/60">
          {RULES.header.description}
        </p>
      </header>

      <div className="mt-10">
        {RULES_PUBLISHED ? (
          <div className="flex flex-col gap-12 sm:gap-16">
            {!RULES_APPROVED && <DraftNotice />}
            <QuickReminders />
            <SectionNav />

            <RuleSection id="format" title="Tournament Format" testId="section-format">
              <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-border sm:p-8">
                <p className="text-base leading-relaxed text-charcoal/70">
                  {RULES.format.intro}
                </p>
                <ul className="mt-6 space-y-3">
                  {RULES.format.points.map((point, i) => (
                    <li key={i} data-testid={`format-point-${i + 1}`} className="flex items-start gap-3">
                      <span aria-hidden="true" className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-gold" />
                      <span className="text-base font-semibold text-charcoal">{point}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 rounded-2xl bg-gold/10 px-4 py-3 text-sm font-semibold text-gold-deep">
                  {RULES.format.note}
                </p>
              </div>
            </RuleSection>

            <RuleSection id="scoring" title="Scoring" testId="section-scoring">
              <div className="flex flex-col gap-3">
                {RULES.scoring.rows.map((row, i) => (
                  <div
                    key={row.result}
                    data-testid={`scoring-row-${i + 1}`}
                    className="flex flex-col gap-2 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-border sm:flex-row sm:items-center sm:gap-6 sm:p-6"
                  >
                    <p className="w-28 shrink-0 text-lg font-extrabold tracking-tight text-forest">
                      {row.result}
                    </p>
                    <p className="shrink-0 text-base font-extrabold text-gold-deep sm:w-36">
                      {row.points}
                    </p>
                    <p className="text-sm leading-relaxed text-charcoal/60 sm:text-base">
                      {row.explanation}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-5 rounded-2xl bg-gold/10 px-4 py-3 text-sm font-semibold text-gold-deep">
                {RULES.scoring.note}
              </p>
            </RuleSection>

            <RuleSection id="match-rules" title="Match Rules" testId="section-match-rules">
              <RuleAccordion items={RULES.matchRules} testId="match-rules-accordion" />
            </RuleSection>

            <RuleSection id="conduct" title="Player Conduct" testId="section-conduct">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {RULES.conduct.map((item, i) => (
                  <div
                    key={item.title}
                    data-testid={`conduct-item-${i + 1}`}
                    className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-border"
                  >
                    <h3 className="text-lg font-extrabold tracking-tight text-forest">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-charcoal/60 sm:text-base">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </RuleSection>

            <RuleSection id="tiebreakers" title="Tie-Breakers" testId="section-tiebreakers">
              <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-border sm:p-8">
                <ol className="space-y-4">
                  {RULES.tiebreakers.steps.map((step, i) => (
                    <li key={step} data-testid={`tiebreaker-${i + 1}`} className="flex items-center gap-4">
                      <span
                        aria-hidden="true"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest text-sm font-extrabold text-gold"
                      >
                        {i + 1}
                      </span>
                      <span className="text-base font-bold text-charcoal sm:text-lg">{step}</span>
                    </li>
                  ))}
                </ol>
                <p className="mt-6 rounded-2xl bg-gold/10 px-4 py-3 text-sm font-semibold text-gold-deep">
                  {RULES.tiebreakers.note}
                </p>
              </div>
            </RuleSection>

            <RuleSection id="faq" title="Frequently Asked Questions" testId="section-faq">
              <RuleAccordion items={RULES.faq} testId="faq-accordion" />
            </RuleSection>
          </div>
        ) : (
          <RulesEmptyState />
        )}
      </div>
    </div>
  );
}
