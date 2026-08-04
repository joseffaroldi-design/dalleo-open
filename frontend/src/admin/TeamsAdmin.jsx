import { SEED } from "@/admin/seedData";
import {
  useAdminDomain, AdminSection, AdminLoading, Field, TextInput, TextArea,
  SelectInput, Toggle, SaveBar,
} from "@/admin/ui";

const COLOR_OPTIONS = [
  { value: "green", label: "Green" },
  { value: "gold", label: "Gold" },
  { value: "white", label: "White" },
  { value: "black", label: "Black" },
];

export default function TeamsAdmin() {
  const { data, setData, loading, saving, saved, error, save } = useAdminDomain("teams", SEED.teams);

  if (loading || !data) return <AdminLoading />;

  const updateTeam = (id, patch) =>
    setData((d) => ({ ...d, items: d.items.map((t) => (t.id === id ? { ...t, ...patch } : t)) }));

  const playersText = (team) => team.players.map((p) => p.name).join("\n");
  const setPlayers = (id, text) => {
    const players = text
      .split("\n")
      .map((name) => name.trim())
      .filter(Boolean)
      .map((name, i) => (i === 0 ? { name, role: "Captain" } : { name }));
    updateTeam(id, { players });
  };

  return (
    <div data-testid="teams-admin">
      <h1 className="text-2xl font-extrabold tracking-tight text-forest sm:text-3xl">Teams</h1>
      <p className="mt-1 text-sm text-charcoal/60">
        2026 tournament setup — exactly eight teams, four players each (captain first). Assign shotgun starting holes and times here; they appear on the public Teams and Schedule pages.
      </p>

      <div className="mt-8 flex flex-col gap-6">
        <AdminSection title="Publication" testId="teams-publish-section">
          <Toggle label="Teams announced (public Teams page visible)" testId="teams-published" checked={data.published} onChange={(v) => setData((d) => ({ ...d, published: v }))} />
        </AdminSection>

        {data.items.map((team) => (
          <AdminSection key={team.id} title={team.name} testId={`team-editor-${team.id}`}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Team name">
                <TextInput data-testid={`team-name-${team.id}`} value={team.name} onChange={(e) => updateTeam(team.id, { name: e.target.value })} />
              </Field>
              <Field label="Color label">
                <SelectInput
                  data-testid={`team-color-${team.id}`}
                  value={team.colorKey}
                  onChange={(e) => updateTeam(team.id, { colorKey: e.target.value })}
                  options={COLOR_OPTIONS}
                />
              </Field>
              <Field label="Captain">
                <TextInput data-testid={`team-captain-${team.id}`} value={team.captain} onChange={(e) => updateTeam(team.id, { captain: e.target.value })} />
              </Field>
              <Field label="Motto">
                <TextInput data-testid={`team-motto-${team.id}`} value={team.motto} onChange={(e) => updateTeam(team.id, { motto: e.target.value })} />
              </Field>
              <Field label="Starting hole (shotgun)" hint="1–18. Leave empty until pairings are set.">
                <TextInput
                  type="number"
                  min="1"
                  max="18"
                  data-testid={`team-hole-${team.id}`}
                  value={team.startingHole ?? ""}
                  onChange={(e) => updateTeam(team.id, { startingHole: e.target.value === "" ? null : Number(e.target.value) })}
                />
              </Field>
              <Field label="Starting time" hint='For example: "8:00 AM"'>
                <TextInput
                  data-testid={`team-start-time-${team.id}`}
                  value={team.startingTime ?? ""}
                  onChange={(e) => updateTeam(team.id, { startingTime: e.target.value || null })}
                />
              </Field>
              <Field label="Display order" hint="Lower numbers appear first on public pages.">
                <TextInput
                  type="number"
                  min="1"
                  max="99"
                  data-testid={`team-order-${team.id}`}
                  value={team.order ?? ""}
                  onChange={(e) => updateTeam(team.id, { order: e.target.value === "" ? null : Number(e.target.value) })}
                />
              </Field>
              <Field label="Team logo / photo URL (optional)">
                <TextInput
                  data-testid={`team-photo-${team.id}`}
                  value={team.photoUrl ?? ""}
                  onChange={(e) => updateTeam(team.id, { photoUrl: e.target.value || null })}
                />
              </Field>
            </div>
            <Toggle
              label="Active (shown on public pages and scoring)"
              testId={`team-active-${team.id}`}
              checked={team.active !== false}
              onChange={(v) => updateTeam(team.id, { active: v })}
            />
            <Field label="Roster — one player per line" hint="First line becomes the Captain on the public page.">
              <TextArea
                rows={Math.max(4, team.players.length + 1)}
                data-testid={`team-players-${team.id}`}
                value={playersText(team)}
                onChange={(e) => setPlayers(team.id, e.target.value)}
              />
            </Field>
          </AdminSection>
        ))}
      </div>

      <SaveBar onSave={save} saving={saving} saved={saved} error={error} />
    </div>
  );
}
