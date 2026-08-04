import { SEED } from "@/admin/seedData";
import {
  useAdminDomain, AdminSection, AdminLoading, Field, TextInput, TextArea,
  Toggle, SaveBar, ConfirmDelete,
} from "@/admin/ui";

const TopicList = ({ title, items, onChange, testId }) => {
  const update = (i, patch) => onChange(items.map((t, j) => (j === i ? { ...t, ...patch } : t)));
  return (
    <AdminSection title={title} testId={testId}>
      {items.map((topic, i) => (
        <div key={topic.id ?? i} className="flex flex-col gap-3 rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between gap-3">
            <Field label="Title">
              <TextInput data-testid={`${testId}-title-${i}`} value={topic.title} onChange={(e) => update(i, { title: e.target.value })} />
            </Field>
            <ConfirmDelete testId={`${testId}-delete-${i}`} onConfirm={() => onChange(items.filter((_, j) => j !== i))} />
          </div>
          <Field label="Answer / guidance">
            <TextArea data-testid={`${testId}-body-${i}`} value={topic.body} onChange={(e) => update(i, { body: e.target.value })} />
          </Field>
        </div>
      ))}
      <button
        type="button"
        data-testid={`${testId}-add`}
        onClick={() => onChange([...items, { id: `t${Date.now()}`, title: "New topic", body: "Details to be confirmed by organizers." }])}
        className="min-h-12 rounded-full bg-forest px-6 py-3 text-sm font-extrabold text-cream"
      >
        Add Topic
      </button>
    </AdminSection>
  );
};

export default function RulesAdmin() {
  const { data, setData, loading, saving, saved, error, save } = useAdminDomain("rules", SEED.rules);

  if (loading || !data) return <AdminLoading />;

  const update = (patch) => setData((d) => ({ ...d, ...patch }));
  const updateScoringRow = (i, patch) =>
    setData((d) => ({ ...d, scoringRows: d.scoringRows.map((r, j) => (j === i ? { ...r, ...patch } : r)) }));

  const stateText = !data.published
    ? "Public: unpublished state is shown"
    : data.approved
      ? "Public: rules visible, draft notice hidden"
      : "Public: rules visible with draft notice";

  return (
    <div data-testid="rules-admin">
      <h1 className="text-2xl font-extrabold tracking-tight text-forest sm:text-3xl">Rules</h1>
      <p className="mt-1 text-sm text-charcoal/60">{stateText}.</p>

      <div className="mt-8 flex flex-col gap-6">
        <AdminSection title="Publication & Approval" testId="rules-state-section">
          <Toggle label="Rules published" testId="rules-published" checked={data.published} onChange={(v) => update({ published: v })} />
          <Toggle label="Approved by organizers (hides draft notice)" testId="rules-approved" checked={data.approved} onChange={(v) => update({ approved: v })} />
          <Field label="Draft notice text">
            <TextInput data-testid="rules-draft-notice" value={data.draftNotice} onChange={(e) => update({ draftNotice: e.target.value })} />
          </Field>
          <Field label="Quick reminders — one per line">
            <TextArea data-testid="rules-reminders" value={data.quickReminders.join("\n")} onChange={(e) => update({ quickReminders: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} />
          </Field>
        </AdminSection>

        <AdminSection title="Tournament Format" testId="rules-format-section">
          <Field label="Introduction">
            <TextArea data-testid="rules-format-intro" value={data.formatIntro} onChange={(e) => update({ formatIntro: e.target.value })} />
          </Field>
          <Field label="Format points — one per line">
            <TextArea data-testid="rules-format-points" value={data.formatPoints.join("\n")} onChange={(e) => update({ formatPoints: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} />
          </Field>
          <Field label="Format note">
            <TextInput data-testid="rules-format-note" value={data.formatNote} onChange={(e) => update({ formatNote: e.target.value })} />
          </Field>
        </AdminSection>

        <AdminSection title="Scoring" testId="rules-scoring-section">
          {data.scoringRows.map((row, i) => (
            <div key={i} className="grid grid-cols-1 gap-3 rounded-2xl border border-border p-4 sm:grid-cols-3">
              <Field label="Result">
                <TextInput data-testid={`scoring-result-${i}`} value={row.result} onChange={(e) => updateScoringRow(i, { result: e.target.value })} />
              </Field>
              <Field label="Points">
                <TextInput data-testid={`scoring-points-${i}`} value={row.points} onChange={(e) => updateScoringRow(i, { points: e.target.value })} />
              </Field>
              <Field label="Explanation">
                <TextInput data-testid={`scoring-explanation-${i}`} value={row.explanation} onChange={(e) => updateScoringRow(i, { explanation: e.target.value })} />
              </Field>
            </div>
          ))}
          <Field label="Scoring note">
            <TextInput data-testid="rules-scoring-note" value={data.scoringNote} onChange={(e) => update({ scoringNote: e.target.value })} />
          </Field>
        </AdminSection>

        <TopicList title="Match Rules" items={data.matchRules} onChange={(v) => update({ matchRules: v })} testId="rules-match-list" />

        <AdminSection title="Player Conduct" testId="rules-conduct-section">
          {data.conduct.map((item, i) => (
            <div key={i} className="grid grid-cols-1 gap-3 rounded-2xl border border-border p-4 sm:grid-cols-2">
              <Field label="Principle">
                <TextInput data-testid={`conduct-title-${i}`} value={item.title} onChange={(e) => update({ conduct: data.conduct.map((c, j) => (j === i ? { ...c, title: e.target.value } : c)) })} />
              </Field>
              <Field label="Guidance">
                <TextInput data-testid={`conduct-body-${i}`} value={item.body} onChange={(e) => update({ conduct: data.conduct.map((c, j) => (j === i ? { ...c, body: e.target.value } : c)) })} />
              </Field>
            </div>
          ))}
        </AdminSection>

        <AdminSection title="Tie-Breakers" testId="rules-tiebreak-section">
          {data.tiebreakSteps.map((step, i) => (
            <Field key={i} label={`Step ${i + 1}`}>
              <TextInput data-testid={`tiebreak-step-${i}`} value={step} onChange={(e) => update({ tiebreakSteps: data.tiebreakSteps.map((s, j) => (j === i ? e.target.value : s)) })} />
            </Field>
          ))}
          <Field label="Tie-breaker note">
            <TextInput data-testid="rules-tiebreak-note" value={data.tiebreakNote} onChange={(e) => update({ tiebreakNote: e.target.value })} />
          </Field>
        </AdminSection>

        <TopicList title="Frequently Asked Questions" items={data.faq} onChange={(v) => update({ faq: v })} testId="rules-faq-list" />

        <AdminSection title="Unpublished State" testId="rules-unpublished-section">
          <Field label="Title">
            <TextInput data-testid="rules-unpublished-title" value={data.unpublishedTitle} onChange={(e) => update({ unpublishedTitle: e.target.value })} />
          </Field>
          <Field label="Supporting copy">
            <TextInput data-testid="rules-unpublished-body" value={data.unpublishedBody} onChange={(e) => update({ unpublishedBody: e.target.value })} />
          </Field>
        </AdminSection>
      </div>

      <SaveBar onSave={save} saving={saving} saved={saved} error={error} />
    </div>
  );
}
