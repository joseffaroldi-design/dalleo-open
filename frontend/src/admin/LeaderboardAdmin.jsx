import { SEED } from "@/admin/seedData";
import { TEAMS } from "@/data/teams";
import {
  useAdminDomain, AdminSection, AdminLoading, Field, TextInput,
  SelectInput, Toggle, SaveBar,
} from "@/admin/ui";

const STATUS_OPTIONS = [
  { value: "live", label: "Live" },
  { value: "final", label: "Final" },
  { value: "upcoming", label: "Upcoming" },
];

export default function LeaderboardAdmin() {
  const { data, setData, loading, saving, saved, error, save } = useAdminDomain("leaderboard", SEED.leaderboard);

  if (loading || !data) return <AdminLoading />;

  const update = (patch) => setData((d) => ({ ...d, ...patch }));
  const updateStanding = (colorKey, patch) =>
    setData((d) => ({
      ...d,
      standings: d.standings.map((s) => (s.colorKey === colorKey ? { ...s, ...patch } : s)),
    }));
  const teamName = (colorKey) => TEAMS.find((t) => t.colorKey === colorKey)?.name ?? colorKey;

  return (
    <div data-testid="leaderboard-admin">
      <h1 className="text-2xl font-extrabold tracking-tight text-forest sm:text-3xl">Leaderboard</h1>
      <p className="mt-1 text-sm text-charcoal/60">Edit team totals and round status. Standings sort by points automatically.</p>

      <div className="mt-8 flex flex-col gap-6">
        <AdminSection title="Round Status" testId="lb-status-section">
          <Toggle label="Scoring has started" testId="lb-scoring-started" checked={data.scoringStarted} onChange={(v) => update({ scoringStarted: v })} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Current round">
              <TextInput data-testid="lb-round-label" value={data.roundLabel} onChange={(e) => update({ roundLabel: e.target.value })} />
            </Field>
            <Field label="Leaderboard status">
              <SelectInput
                data-testid="lb-status"
                value={data.status}
                onChange={(e) => update({ status: e.target.value, statusLabel: STATUS_OPTIONS.find((o) => o.value === e.target.value).label })}
                options={STATUS_OPTIONS}
              />
            </Field>
            <Field label="Last updated text" hint='For example: "Today at 2:18 PM"'>
              <TextInput data-testid="lb-updated-at" value={data.updatedAt} onChange={(e) => update({ updatedAt: e.target.value })} />
            </Field>
          </div>
        </AdminSection>

        <AdminSection title="Team Totals" description="Leave points empty for teams that have not started." testId="lb-teams-section">
          {data.standings.map((s) => (
            <div key={s.colorKey} data-testid={`lb-row-${s.colorKey}`} className="grid grid-cols-1 items-end gap-3 rounded-2xl border border-border p-4 sm:grid-cols-3">
              <p className="self-center font-extrabold text-charcoal">{teamName(s.colorKey)}</p>
              <Field label="Total points">
                <TextInput
                  type="number"
                  min="0"
                  data-testid={`lb-points-${s.colorKey}`}
                  value={s.points ?? ""}
                  onChange={(e) => updateStanding(s.colorKey, { points: e.target.value === "" ? null : Number(e.target.value) })}
                />
              </Field>
              <Field label="Status">
                <SelectInput
                  data-testid={`lb-team-status-${s.colorKey}`}
                  value={s.status}
                  onChange={(e) => updateStanding(s.colorKey, { status: e.target.value })}
                  options={STATUS_OPTIONS}
                />
              </Field>
            </div>
          ))}
        </AdminSection>
      </div>

      <SaveBar onSave={save} saving={saving} saved={saved} error={error} />
    </div>
  );
}
