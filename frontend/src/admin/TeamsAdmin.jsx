import { useEffect, useMemo, useState } from "react";
import { SEED } from "@/admin/seedData";
import { ImageUpload } from "@/admin/ImageUpload";
import { adminFetch } from "@/lib/api";
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
  const [archivedPlayers, setArchivedPlayers] = useState([]);

  useEffect(() => {
    let active = true;
    adminFetch("/admin/site")
      .then((res) => active && setArchivedPlayers(res.data?.playerLibrary ?? []))
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const photoByName = useMemo(() => {
    const map = new Map();
    for (const player of archivedPlayers) {
      if (player?.name && player?.photoUrl) map.set(player.name.trim().toLowerCase(), player.photoUrl);
    }
    for (const team of data?.items ?? []) {
      for (const player of team.players ?? []) {
        if (player?.name && player?.photoUrl) map.set(player.name.trim().toLowerCase(), player.photoUrl);
      }
    }
    return map;
  }, [archivedPlayers, data]);

  if (loading || !data) return <AdminLoading />;

  const updateTeam = (id, patch) =>
    setData((d) => ({ ...d, items: d.items.map((t) => (t.id === id ? { ...t, ...patch } : t)) }));

  const playersText = (team) => team.players.map((p) => p.name).join("\n");
  const setPlayers = (id, text) => {
    const prev = data.items.find((t) => t.id === id)?.players ?? [];
    const previousByName = new Map(
      data.items.flatMap((t) => t.players ?? []).filter((p) => p?.name).map((p) => [p.name.trim().toLowerCase(), p])
    );
    const players = text
      .split("\n")
      .map((name) => name.trim())
      .filter(Boolean)
      .map((name, i) => {
        const key = name.toLowerCase();
        const prior = previousByName.get(key) ?? prev[i] ?? {};
        const photoUrl = prior.photoUrl || photoByName.get(key) || null;
        return {
          name,
          ...(i === 0 ? { role: "Captain" } : {}),
          ...(photoUrl ? { photoUrl } : {}),
        };
      });
    updateTeam(id, { players });
  };

  const setPlayerPhoto = (id, index, url) =>
    setData((d) => ({
      ...d,
      items: d.items.map((t) =>
        t.id === id
          ? { ...t, players: t.players.map((p, i) => (i === index ? { ...p, photoUrl: url || null } : p)) }
          : t
      ),
    }));

  return (
    <div data-testid="teams-admin">
      <h1 className="text-2xl font-extrabold tracking-tight text-forest sm:text-3xl">Teams</h1>
      <p className="mt-1 text-sm text-charcoal/60">
        Tournament setup — exactly eight teams, four players each (captain first). Returning player photos are reused automatically when their saved name matches the player library.
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
              <Field label="Starting hole (shotgun)" hint='1–18, with an optional A/B side — for example: "1A". Leave empty until pairings are set.'>
                <TextInput
                  data-testid={`team-hole-${team.id}`}
                  value={team.startingHoleLabel ?? (team.startingHole ?? "")}
                  onChange={(e) => {
                    const v = e.target.value.trim().toUpperCase();
                    if (!v) return updateTeam(team.id, { startingHole: null, startingHoleLabel: null });
                    const m = v.match(/^(\d{1,2})([AB])?$/);
                    const n = m ? parseInt(m[1], 10) : NaN;
                    if (!m || n < 1 || n > 18) return;
                    updateTeam(id, { startingHole: n, startingHoleLabel: m[2] ? `${n}${m[2]}` : null });
                  }}
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
              <Field label="Team photo (optional)">
                <ImageUpload
                  testId={`team-photo-upload-${team.id}`}
                  value={team.photoUrl ?? ""}
                  onChange={(url) => updateTeam(team.id, { photoUrl: url || null })}
                  previewClass="h-24 w-32"
                />
              </Field>
            </div>
            <Toggle
              label="Active (shown on public pages and scoring)"
              testId={`team-active-${team.id}`}
              checked={team.active !== false}
              onChange={(v) => updateTeam(team.id, { active: v })}
            />
            <Field label="Roster — one player per line" hint="First line becomes the Captain. Returning players keep their archived photo when the name matches.">
              <TextArea
                rows={Math.max(4, team.players.length + 1)}
                data-testid={`team-players-${team.id}`}
                value={playersText(team)}
                onChange={(e) => setPlayers(team.id, e.target.value)}
              />
            </Field>
            <Field label="Player photos (optional)" hint="Shown in the circle next to each player's name on the team page.">
              <ul className="flex flex-col gap-3">
                {team.players.map((p, i) => (
                  <li key={`${team.id}-player-${i}`} className="flex items-center gap-3">
                    <span className="w-40 shrink-0 truncate text-sm font-bold text-charcoal">
                      {p.name}
                      {p.role === "Captain" && <span className="text-gold-deep"> · Captain</span>}
                    </span>
                    <ImageUpload
                      testId={`player-photo-upload-${team.id}-${i + 1}`}
                      value={p.photoUrl ?? ""}
                      onChange={(url) => setPlayerPhoto(team.id, i, url)}
                      previewClass="h-12 w-12 rounded-full"
                    />
                  </li>
                ))}
              </ul>
            </Field>
          </AdminSection>
        ))}
      </div>

      <SaveBar onSave={save} saving={saving} saved={saved} error={error} />
    </div>
  );
}
