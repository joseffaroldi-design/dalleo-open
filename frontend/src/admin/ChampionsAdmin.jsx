import { SEED } from "@/admin/seedData";
import {
  useAdminDomain, AdminSection, AdminLoading, Field, TextInput, TextArea,
  Toggle, SaveBar, ConfirmDelete,
} from "@/admin/ui";

const lines = (arr) => arr.join("\n");
const toLines = (text) => text.split("\n").map((s) => s.trim()).filter(Boolean);
const statsText = (stats) => stats.map((s) => `${s.label} | ${s.value}`).join("\n");
const toStats = (text) =>
  toLines(text)
    .map((line) => {
      const [label, ...rest] = line.split("|");
      return { label: label.trim(), value: rest.join("|").trim() };
    })
    .filter((s) => s.label && s.value);

const blankEntry = (year) => ({
  year,
  teamName: "Team Name",
  captain: "Captain Name",
  members: ["Captain Name"],
  finalScore: "Score TBD",
  margin: "",
  mvp: "",
  quote: "",
  story: "Championship recap to be written.",
  moments: [],
  awards: [],
  stats: [
    { label: "Final Score", value: "TBD" },
    { label: "Winning Margin", value: "TBD" },
  ],
  photoCaption: `${year} championship photo — coming soon`,
  published: true,
  placeholder: true,
});

export default function ChampionsAdmin() {
  const { data, setData, loading, saving, saved, error, save } = useAdminDomain("champions", SEED.champions);

  if (loading || !data) return <AdminLoading />;

  const updateEntry = (year, patch) =>
    setData((d) => ({ ...d, entries: d.entries.map((e) => (e.year === year ? { ...e, ...patch } : e)) }));
  const removeEntry = (year) =>
    setData((d) => ({ ...d, entries: d.entries.filter((e) => e.year !== year) }));
  const addEntry = () => {
    const nextYear = data.entries.length ? Math.max(...data.entries.map((e) => e.year)) + 1 : 2020;
    setData((d) => ({ ...d, entries: [blankEntry(nextYear), ...d.entries] }));
  };

  const updateRecord = (id, patch) =>
    setData((d) => ({ ...d, records: d.records.map((r) => (r.id === id ? { ...r, ...patch } : r)) }));
  const removeRecord = (id) =>
    setData((d) => ({ ...d, records: d.records.filter((r) => r.id !== id) }));
  const addRecord = () =>
    setData((d) => ({
      ...d,
      records: [
        ...d.records,
        { id: `rec-${Date.now()}`, label: "New Record", holder: "Awaiting official records", value: "—", year: "", note: "" },
      ],
    }));

  const sorted = [...data.entries].sort((a, b) => b.year - a.year);

  return (
    <div data-testid="champions-admin">
      <h1 className="text-2xl font-extrabold tracking-tight text-forest sm:text-3xl">Champions</h1>
      <p className="mt-1 text-sm text-charcoal/60">
        Manage the Trophy Wall — one entry per tournament year, plus the Hall of Records. Add next year&apos;s champion here when the round is complete; no code changes needed.
      </p>

      <div className="mt-8 flex flex-col gap-6">
        <AdminSection title="Publication" testId="champions-publish-section">
          <Toggle
            label="Trophy Wall visible on the public site"
            testId="champions-published"
            checked={data.published}
            onChange={(v) => setData((d) => ({ ...d, published: v }))}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Page heading">
              <TextInput
                data-testid="champions-header-title"
                value={data.header.title}
                onChange={(e) => setData((d) => ({ ...d, header: { ...d.header, title: e.target.value } }))}
              />
            </Field>
            <Field label="Page subtitle">
              <TextArea
                data-testid="champions-header-body"
                value={data.header.body}
                onChange={(e) => setData((d) => ({ ...d, header: { ...d.header, body: e.target.value } }))}
              />
            </Field>
          </div>
        </AdminSection>

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold tracking-tight text-forest">Champion Entries</h2>
          <button
            type="button"
            data-testid="add-champion-button"
            onClick={addEntry}
            className="min-h-11 rounded-full bg-forest px-6 py-2.5 text-sm font-extrabold text-cream transition-colors duration-200 hover:bg-forest-soft"
          >
            Add Champion Year
          </button>
        </div>

        {sorted.map((entry) => (
          <AdminSection
            key={entry.year}
            title={`${entry.year} — ${entry.teamName}`}
            testId={`champion-editor-${entry.year}`}
            description={entry.placeholder ? "Placeholder entry — replace with official history." : undefined}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Year">
                <TextInput
                  type="number"
                  data-testid={`champion-year-${entry.year}`}
                  value={entry.year}
                  onChange={(e) => updateEntry(entry.year, { year: Number(e.target.value) || entry.year })}
                />
              </Field>
              <Field label="Champion team name">
                <TextInput
                  data-testid={`champion-team-${entry.year}`}
                  value={entry.teamName}
                  onChange={(e) => updateEntry(entry.year, { teamName: e.target.value })}
                />
              </Field>
              <Field label="Captain">
                <TextInput
                  data-testid={`champion-captain-${entry.year}`}
                  value={entry.captain}
                  onChange={(e) => updateEntry(entry.year, { captain: e.target.value })}
                />
              </Field>
              <Field label="Final score">
                <TextInput
                  data-testid={`champion-score-${entry.year}`}
                  value={entry.finalScore}
                  onChange={(e) => updateEntry(entry.year, { finalScore: e.target.value })}
                />
              </Field>
              <Field label="Winning margin (optional)">
                <TextInput
                  data-testid={`champion-margin-${entry.year}`}
                  value={entry.margin}
                  onChange={(e) => updateEntry(entry.year, { margin: e.target.value })}
                />
              </Field>
              <Field label="MVP (optional)">
                <TextInput
                  data-testid={`champion-mvp-${entry.year}`}
                  value={entry.mvp}
                  onChange={(e) => updateEntry(entry.year, { mvp: e.target.value })}
                />
              </Field>
            </div>
            <Field label="Roster — one player per line" hint="First line is shown as Captain.">
              <TextArea
                rows={Math.max(4, entry.members.length + 1)}
                data-testid={`champion-members-${entry.year}`}
                value={lines(entry.members)}
                onChange={(e) => updateEntry(entry.year, { members: toLines(e.target.value) })}
              />
            </Field>
            <Field label="Story of the Championship">
              <TextArea
                rows={4}
                data-testid={`champion-story-${entry.year}`}
                value={entry.story}
                onChange={(e) => updateEntry(entry.year, { story: e.target.value })}
              />
            </Field>
            <Field label="Memorable quote (optional)">
              <TextArea
                rows={2}
                data-testid={`champion-quote-${entry.year}`}
                value={entry.quote}
                onChange={(e) => updateEntry(entry.year, { quote: e.target.value })}
              />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Memorable moments — one per line">
                <TextArea
                  rows={4}
                  data-testid={`champion-moments-${entry.year}`}
                  value={lines(entry.moments)}
                  onChange={(e) => updateEntry(entry.year, { moments: toLines(e.target.value) })}
                />
              </Field>
              <Field label="Awards — one per line">
                <TextArea
                  rows={4}
                  data-testid={`champion-awards-${entry.year}`}
                  value={lines(entry.awards)}
                  onChange={(e) => updateEntry(entry.year, { awards: toLines(e.target.value) })}
                />
              </Field>
            </div>
            <Field label="Statistics — one per line as Label | Value">
              <TextArea
                rows={4}
                data-testid={`champion-stats-${entry.year}`}
                value={statsText(entry.stats)}
                onChange={(e) => updateEntry(entry.year, { stats: toStats(e.target.value) })}
              />
            </Field>
            <Field label="Photo caption">
              <TextInput
                data-testid={`champion-photo-caption-${entry.year}`}
                value={entry.photoCaption}
                onChange={(e) => updateEntry(entry.year, { photoCaption: e.target.value })}
              />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Toggle
                label="Visible on Trophy Wall"
                testId={`champion-visible-${entry.year}`}
                checked={entry.published}
                onChange={(v) => updateEntry(entry.year, { published: v })}
              />
              <Toggle
                label="Mark as placeholder content"
                testId={`champion-placeholder-${entry.year}`}
                checked={entry.placeholder}
                onChange={(v) => updateEntry(entry.year, { placeholder: v })}
              />
            </div>
            <div className="flex justify-end">
              <ConfirmDelete testId={`champion-delete-${entry.year}`} onConfirm={() => removeEntry(entry.year)} />
            </div>
          </AdminSection>
        ))}

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold tracking-tight text-forest">Hall of Records</h2>
          <button
            type="button"
            data-testid="add-record-button"
            onClick={addRecord}
            className="min-h-11 rounded-full bg-forest px-6 py-2.5 text-sm font-extrabold text-cream transition-colors duration-200 hover:bg-forest-soft"
          >
            Add Record
          </button>
        </div>

        {data.records.map((rec) => (
          <AdminSection key={rec.id} title={rec.label} testId={`record-editor-${rec.id}`}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Record name">
                <TextInput
                  data-testid={`record-label-${rec.id}`}
                  value={rec.label}
                  onChange={(e) => updateRecord(rec.id, { label: e.target.value })}
                />
              </Field>
              <Field label="Value">
                <TextInput
                  data-testid={`record-value-${rec.id}`}
                  value={rec.value}
                  onChange={(e) => updateRecord(rec.id, { value: e.target.value })}
                />
              </Field>
              <Field label="Record holder">
                <TextInput
                  data-testid={`record-holder-${rec.id}`}
                  value={rec.holder}
                  onChange={(e) => updateRecord(rec.id, { holder: e.target.value })}
                />
              </Field>
              <Field label="Year set (optional)">
                <TextInput
                  data-testid={`record-year-${rec.id}`}
                  value={rec.year}
                  onChange={(e) => updateRecord(rec.id, { year: e.target.value })}
                />
              </Field>
            </div>
            <Field label="Note (optional)">
              <TextInput
                data-testid={`record-note-${rec.id}`}
                value={rec.note}
                onChange={(e) => updateRecord(rec.id, { note: e.target.value })}
              />
            </Field>
            <div className="flex justify-end">
              <ConfirmDelete testId={`record-delete-${rec.id}`} onConfirm={() => removeRecord(rec.id)} />
            </div>
          </AdminSection>
        ))}
      </div>

      <SaveBar onSave={save} saving={saving} saved={saved} error={error} />
    </div>
  );
}
