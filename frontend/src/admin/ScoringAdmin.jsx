import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { adminFetch } from "@/lib/api";
import { SEED } from "@/admin/seedData";
import {
  useAdminDomain, AdminSection, AdminLoading, Field, TextInput,
  SelectInput, SaveBar,
} from "@/admin/ui";
import { HOLES, STATUS_LABELS, computeStandings, formatToPar } from "@/data/scoring";
import { TEAM_VISUALS } from "@/data/teams";

const STATUS_OPTIONS = [
  { value: "not-started", label: "Not Started" },
  { value: "test", label: "Test (Rehearsal)" },
  { value: "live", label: "Live" },
  { value: "final", label: "Final" },
];

export default function ScoringAdmin() {
  const queryClient = useQueryClient();
  const { data, setData, loading, saving, saved, error, save } = useAdminDomain("scoring", SEED.scoring);
  const [teams, setTeams] = useState(null);

  // Tournament-day entry state
  const [teamId, setTeamId] = useState(null);
  const [hole, setHole] = useState(1);
  const [strokes, setStrokes] = useState("");
  const [armedOverwrite, setArmedOverwrite] = useState(false);
  const [entrySaving, setEntrySaving] = useState(false);
  const [flash, setFlash] = useState("");
  const [entryError, setEntryError] = useState("");
  const [resetArmed, setResetArmed] = useState(false);
  const [pinsSet, setPinsSet] = useState([]);
  const [pinDrafts, setPinDrafts] = useState({});
  const [pinFlash, setPinFlash] = useState("");

  useEffect(() => {
    adminFetch("/admin/team-pins")
      .then((res) => setPinsSet(res.teamIds ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    adminFetch("/admin/teams")
      .then((res) => setTeams(res.data?.items?.length ? res.data.items : SEED.teams().items))
      .catch(() => setTeams(SEED.teams().items));
  }, []);

  const activeTeams = useMemo(
    () => (teams ?? []).filter((t) => t.active !== false).sort((a, b) => (a.order ?? 99) - (b.order ?? 99)),
    [teams]
  );

  useEffect(() => {
    if (!teamId && activeTeams.length) setTeamId(activeTeams[0].id);
  }, [activeTeams, teamId]);

  const existing = useMemo(
    () => data?.scores.find((s) => s.teamId === teamId && s.hole === hole),
    [data, teamId, hole]
  );

  if (loading || !data || !teams) return <AdminLoading />;

  const REAL_PAR = [4, 4, 5, 3, 4, 4, 5, 3, 4, 4, 4, 4, 5, 3, 4, 4, 3, 5];
  const par = data.par?.length === 18 ? data.par : REAL_PAR;
  const team = activeTeams.find((t) => t.id === teamId);
  const standings = computeStandings(data, activeTeams);
  const scoresFor = (id) => data.scores.filter((s) => s.teamId === id).length;

  const selectTeam = (id) => {
    setTeamId(id);
    setArmedOverwrite(false);
    setFlash("");
    setEntryError("");
    // Jump to this team's first unscored hole — avoids cross-team misalignment.
    const firstOpen = HOLES.find((h) => !data.scores.some((x) => x.teamId === id && x.hole === h)) ?? 18;
    setHole(firstOpen);
    const s = data.scores.find((x) => x.teamId === id && x.hole === firstOpen);
    setStrokes(s ? String(s.strokes) : "");
  };

  const goHole = (next) => {
    const h = Math.min(18, Math.max(1, next));
    setHole(h);
    setArmedOverwrite(false);
    setEntryError("");
    const s = data.scores.find((x) => x.teamId === teamId && x.hole === h);
    setStrokes(s ? String(s.strokes) : "");
  };

  const parsed = strokes.trim() === "" ? null : Number(strokes);
  const valid = parsed !== null && Number.isInteger(parsed) && parsed >= 1 && parsed <= 30;

  const saveScore = async () => {
    if (!valid || !team) return;
    if (existing && !armedOverwrite) {
      setArmedOverwrite(true);
      return;
    }
    const next = {
      ...data,
      scores: [...data.scores.filter((s) => !(s.teamId === teamId && s.hole === hole)), { teamId, hole, strokes: parsed }],
    };
    setEntrySaving(true);
    setEntryError("");
    setFlash("");
    try {
      await adminFetch("/admin/scoring", { method: "PUT", body: JSON.stringify({ data: next }) });
      setData(next);
      queryClient.invalidateQueries({ queryKey: ["public", "scoring"] });
      setFlash(`Saved — ${team.name} · Hole ${hole}: ${parsed}`);
      setArmedOverwrite(false);
      if (hole < 18) goHole(hole + 1);
      else setStrokes("");
    } catch (e) {
      setEntryError(e.message);
    } finally {
      setEntrySaving(false);
    }
  };

  const savePin = async (id) => {
    const pin = (pinDrafts[id] ?? "").trim();
    if (!/^\d{4,8}$/.test(pin)) {
      setPinFlash("");
      setEntryError("PINs must be 4–8 digits");
      return;
    }
    setEntryError("");
    try {
      await adminFetch("/admin/team-pins", { method: "PUT", body: JSON.stringify({ teamId: id, pin }) });
      setPinsSet((list) => (list.includes(id) ? list : [...list, id]));
      setPinDrafts((d) => ({ ...d, [id]: "" }));
      setPinFlash(`PIN saved for ${activeTeams.find((t) => t.id === id)?.name ?? id} — share it privately with the captain`);
    } catch (e) {
      setEntryError(e.message);
    }
  };

  const clearScores = async () => {
    const next = { ...data, scores: [], status: "not-started" };
    setEntrySaving(true);
    setEntryError("");
    try {
      await adminFetch("/admin/scoring", { method: "PUT", body: JSON.stringify({ data: next }) });
      setData(next);
      queryClient.invalidateQueries({ queryKey: ["public", "scoring"] });
      setFlash("All scores cleared — leaderboard is clean for the tournament");
      setStrokes("");
    } catch (e) {
      setEntryError(e.message);
    } finally {
      setEntrySaving(false);
      setResetArmed(false);
    }
  };

  return (
    <div data-testid="scoring-admin">
      <h1 className="text-2xl font-extrabold tracking-tight text-forest sm:text-3xl">Scoring</h1>
      <p className="mt-1 text-sm text-charcoal/60">
        Tournament-day score entry — one team score per hole, 18 holes, lowest total wins. Built for a phone: pick a team, pick a hole, enter the score, save, and move on.
      </p>

      <div className="mt-8 flex flex-col gap-6">
        <AdminSection title="Tournament Status" testId="scoring-status-section">
          <Field label="Scoring status" hint="Use Test to rehearse with captains before the big day (looks exactly like Live to visitors), Live at the shotgun start, Final when all cards are in.">
            <SelectInput
              data-testid="scoring-status"
              value={data.status}
              onChange={(e) => setData((d) => ({ ...d, status: e.target.value }))}
              options={STATUS_OPTIONS}
            />
          </Field>
          <Field label="Course label (shown on the leaderboard)">
            <TextInput
              data-testid="scoring-course-label"
              value={data.courseLabel ?? ""}
              onChange={(e) => setData((d) => ({ ...d, courseLabel: e.target.value }))}
              placeholder="Black Tees · Par 72 · 7,092 Yards · Rating 74.3 · Slope 135"
            />
          </Field>
        </AdminSection>

        <AdminSection
          title="Score Entry"
          description={team ? `Entering for ${team.name}` : "Select a team"}
          testId="score-entry-section"
        >
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {activeTeams.map((t) => {
              const visual = TEAM_VISUALS[t.colorKey] ?? TEAM_VISUALS.green;
              const done = scoresFor(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  data-testid={`score-team-${t.id}`}
                  onClick={() => selectTeam(t.id)}
                  className={`flex min-h-14 flex-col items-start gap-1 rounded-2xl border px-4 py-3 text-left transition-colors duration-200 ${
                    t.id === teamId ? "border-forest bg-forest text-cream" : "border-border bg-white hover:border-forest/40"
                  }`}
                >
                  <span className="flex w-full items-center justify-between gap-2">
                    <span className="truncate text-sm font-extrabold">{t.name}</span>
                    <span aria-hidden="true" className="h-3.5 w-3.5 shrink-0 rounded-full ring-1 ring-charcoal/20" style={{ backgroundColor: visual.dot }} />
                  </span>
                  <span className={`text-[11px] font-bold ${t.id === teamId ? "text-cream/60" : "text-charcoal/45"}`}>
                    {t.startingHole ? `Starts hole ${t.startingHole}` : "Hole TBD"} · {done}/18
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-3 rounded-2xl bg-forest-mist p-3">
            <button
              type="button"
              data-testid="hole-prev"
              aria-label="Previous hole"
              onClick={() => goHole(hole - 1)}
              disabled={hole <= 1}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-forest shadow-sm disabled:opacity-40"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <div className="text-center">
              <p data-testid="hole-current" className="text-2xl font-extrabold text-forest">Hole {hole}</p>
              <p className="text-xs font-bold text-charcoal/50">Par {par[hole - 1]}</p>
            </div>
            <button
              type="button"
              data-testid="hole-next"
              aria-label="Next hole"
              onClick={() => goHole(hole + 1)}
              disabled={hole >= 18}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-forest shadow-sm disabled:opacity-40"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {existing && (
            <p data-testid="score-existing" className={`rounded-xl px-4 py-3 text-sm font-bold ${armedOverwrite ? "bg-gold/20 text-gold-deep" : "bg-cream text-charcoal/70 ring-1 ring-border"}`}>
              {armedOverwrite
                ? `A score of ${existing.strokes} already exists for ${team?.name} on hole ${hole}. Press Overwrite to replace it.`
                : `Existing score on this hole: ${existing.strokes}. Saving will overwrite it.`}
            </p>
          )}

          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Field label={`${team?.name ?? "Team"} score on hole ${hole}`}>
                <TextInput
                  type="number"
                  inputMode="numeric"
                  min="1"
                  max="30"
                  data-testid="score-input"
                  value={strokes}
                  onChange={(e) => { setStrokes(e.target.value); setArmedOverwrite(false); setEntryError(""); }}
                  placeholder="e.g. 4"
                  className="w-full rounded-xl border border-border bg-white px-4 py-4 text-2xl font-extrabold text-charcoal shadow-sm focus:border-forest"
                />
              </Field>
            </div>
            <button
              type="button"
              data-testid="score-save-button"
              onClick={saveScore}
              disabled={!valid || entrySaving}
              className={`min-h-14 shrink-0 rounded-full px-8 text-base font-extrabold shadow-sm transition-colors duration-200 disabled:opacity-50 ${
                armedOverwrite ? "bg-gold text-forest-deep hover:bg-gold-soft" : "bg-forest text-cream hover:bg-forest-soft"
              }`}
            >
              {entrySaving ? "Saving…" : armedOverwrite ? "Overwrite" : "Save"}
            </button>
          </div>
          {strokes.trim() !== "" && !valid && (
            <p data-testid="score-invalid" role="alert" className="text-sm font-bold text-red-700">
              Enter a whole-number score of 1 or more.
            </p>
          )}
          {flash && (
            <p data-testid="score-flash" role="status" className="inline-flex items-center gap-2 rounded-xl bg-forest-mist px-4 py-3 text-sm font-extrabold text-forest">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              {flash}
            </p>
          )}
          {entryError && (
            <p data-testid="score-entry-error" role="alert" className="text-sm font-bold text-red-700">{entryError}</p>
          )}
        </AdminSection>

        <AdminSection title="Progress — Missing Scores" description="Tap any cell to jump straight to that team and hole." testId="scoring-progress-section">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] table-fixed text-center" data-testid="scoring-matrix">
              <thead>
                <tr>
                  <th className="pb-2 text-left text-[10px] font-bold uppercase tracking-widest text-charcoal/40">Team</th>
                  {HOLES.map((h) => (
                    <th key={h} className="pb-2 text-[10px] font-bold text-charcoal/45">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeTeams.map((t) => (
                  <tr key={t.id} data-testid={`matrix-row-${t.id}`}>
                    <td className="py-1 pr-2 text-left text-xs font-extrabold text-charcoal">{t.name}</td>
                    {HOLES.map((h) => {
                      const s = data.scores.find((x) => x.teamId === t.id && x.hole === h);
                      return (
                        <td key={h} className="py-1">
                          <button
                            type="button"
                            data-testid={`matrix-${t.id}-${h}`}
                            aria-label={s ? `${t.name} hole ${h}: ${s.strokes} — edit` : `${t.name} hole ${h}: missing — enter`}
                            onClick={() => { selectTeam(t.id); goHole(h); }}
                            className={`mx-auto flex h-7 w-7 items-center justify-center rounded-md text-[11px] font-extrabold transition-colors duration-150 ${
                              s ? "bg-forest text-gold" : "bg-charcoal/8 text-charcoal/30 ring-1 ring-border hover:bg-gold/30"
                            }`}
                          >
                            {s ? s.strokes : "·"}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminSection>

        <AdminSection title="Live Standings" description="Lowest score first. A team is finished when all 18 holes are in." testId="scoring-standings-section">
          <ol className="flex flex-col gap-2" data-testid="scoring-mini-standings">
            {standings.map((row) => (
              <li
                key={row.team.id}
                data-testid={`mini-row-${row.team.id}`}
                className="flex items-center justify-between gap-3 rounded-xl bg-cream px-4 py-3 ring-1 ring-border"
              >
                <span className="flex items-center gap-3 text-sm font-extrabold text-charcoal">
                  <span className="w-8 text-charcoal/45">{row.position ? (row.tied ? `T${row.position}` : row.position) : "—"}</span>
                  {row.team.name}
                </span>
                <span className="flex items-center gap-3 text-xs font-bold text-charcoal/55">
                  {row.finished && <span className="rounded-full bg-forest px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-gold">Finished</span>}
                  <span>{row.thru}/18 holes</span>
                  <span className="text-sm font-extrabold text-forest">{formatToPar(row.toPar)}</span>
                </span>
              </li>
            ))}
          </ol>
        </AdminSection>

        <AdminSection title="Course Par" description="Official scorecard — Black tees, par 72. Adjust only if the course changes the setup." testId="scoring-par-section">
          <div className="grid grid-cols-6 gap-2 sm:grid-cols-9">
            {HOLES.map((h) => (
              <label key={h} className="block text-center">
                <span className="text-[10px] font-bold uppercase text-charcoal/40">{h}</span>
                <TextInput
                  type="number"
                  min="3"
                  max="6"
                  data-testid={`par-${h}`}
                  value={par[h - 1]}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setData((d) => ({ ...d, par: d.par.map((p, i) => (i === h - 1 ? (Number.isInteger(v) ? v : p) : p)) }));
                  }}
                  className="mt-1 w-full rounded-lg border border-border bg-white px-1 py-2 text-center text-sm font-extrabold text-charcoal shadow-sm focus:border-forest"
                />
              </label>
            ))}
          </div>
        </AdminSection>

        <AdminSection
          title="Captain Scoring PINs"
          description="Each captain signs in at /score (linked in the site footer) with their team name and this PIN to enter their own hole scores. PINs are stored hashed and can be reset anytime — share them privately before the round."
          testId="captain-pins-section"
        >
          {pinFlash && (
            <p data-testid="pin-flash" role="status" className="rounded-xl bg-forest-mist px-4 py-3 text-sm font-extrabold text-forest">
              {pinFlash}
            </p>
          )}
          {activeTeams.map((t) => (
            <div key={t.id} className="flex items-end gap-3">
              <div className="flex-1">
                <Field label={t.name} hint={pinsSet.includes(t.id) ? "PIN set" : "No PIN yet"}>
                  <TextInput
                    type="password"
                    inputMode="numeric"
                    autoComplete="off"
                    data-testid={`pin-input-${t.id}`}
                    value={pinDrafts[t.id] ?? ""}
                    onChange={(e) => setPinDrafts((d) => ({ ...d, [t.id]: e.target.value.replace(/\D/g, "").slice(0, 8) }))}
                    placeholder="4–8 digits"
                  />
                </Field>
              </div>
              <button
                type="button"
                data-testid={`pin-save-${t.id}`}
                onClick={() => savePin(t.id)}
                disabled={(pinDrafts[t.id] ?? "").length < 4}
                className="min-h-12 shrink-0 rounded-full bg-forest px-6 py-3 text-sm font-extrabold text-cream transition-colors duration-200 hover:bg-forest-soft disabled:opacity-50"
              >
                {pinsSet.includes(t.id) ? "Reset PIN" : "Set PIN"}
              </button>
            </div>
          ))}
        </AdminSection>

        <AdminSection title="Danger Zone" testId="scoring-danger-section">
          <p className="text-sm text-charcoal/60">
            Clears every entered score and resets status to Not Started — use after a test tournament so the official round begins clean. Status and par changes above are saved with Save Changes below.
          </p>
          {resetArmed ? (
            <span className="inline-flex items-center gap-2" role="alertdialog" aria-label="Confirm clearing all scores">
              <button
                type="button"
                data-testid="reset-scores-confirm"
                onClick={clearScores}
                disabled={entrySaving}
                className="min-h-11 rounded-full bg-red-700 px-5 py-2.5 text-sm font-bold text-white"
              >
                {data.status === "test" ? "Confirm — clear test scores" : "Confirm — clear all scores"}
              </button>
              <button
                type="button"
                data-testid="reset-scores-cancel"
                onClick={() => setResetArmed(false)}
                className="min-h-11 rounded-full bg-charcoal/10 px-5 py-2.5 text-sm font-bold text-charcoal"
              >
                Cancel
              </button>
            </span>
          ) : (
            <button
              type="button"
              data-testid="reset-scores-button"
              onClick={() => setResetArmed(true)}
              className="min-h-11 rounded-full bg-red-700/10 px-5 py-2.5 text-sm font-bold text-red-700 transition-colors duration-200 hover:bg-red-700/20"
            >
              {data.status === "test" ? "Clear test scores & return to Not Started" : "Clear all scores"}
            </button>
          )}
        </AdminSection>
      </div>

      <SaveBar onSave={save} saving={saving} saved={saved} error={error} />
    </div>
  );
}
