import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, CheckCircle2, Flag, LogOut, Trophy } from "lucide-react";
import {
  fetchPublic, teamLoginRequest, teamFetch,
  getTeamToken, getTeamInfo, setTeamSession, clearTeamSession,
} from "@/lib/api";
import { TEAM_VISUALS } from "@/data/teams";
import { HOLES } from "@/data/scoring";

// ---------- Login: pick team + enter captain PIN ----------
const CaptainLogin = ({ teams, onLogin }) => {
  const [teamId, setTeamId] = useState(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!teamId || pin.length < 4) return;
    setBusy(true);
    setError("");
    try {
      const res = await teamLoginRequest(teamId, pin);
      setTeamSession(res.token, res.team);
      onLogin(res.team);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div data-testid="captain-login" className="mx-auto max-w-xl">
      <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-border sm:p-9">
        <span aria-hidden="true" className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-forest text-gold">
          <Flag className="h-8 w-8" />
        </span>
        <h1 className="mt-6 text-center text-2xl font-extrabold tracking-tight text-forest sm:text-3xl">
          Captain Scoring
        </h1>
        <p className="mt-2 text-center text-sm font-semibold text-charcoal/60">
          Choose your team and enter your captain PIN to score your round.
        </p>
        <form onSubmit={submit} className="mt-7 flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-2">
            {teams.map((t) => {
              const visual = TEAM_VISUALS[t.colorKey] ?? TEAM_VISUALS.green;
              return (
                <button
                  key={t.id}
                  type="button"
                  data-testid={`captain-team-${t.id}`}
                  onClick={() => setTeamId(t.id)}
                  aria-pressed={teamId === t.id}
                  className={`flex min-h-12 items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left text-sm font-extrabold transition-colors duration-200 ${
                    teamId === t.id ? "border-forest bg-forest text-cream" : "border-border bg-cream text-charcoal hover:border-forest/40"
                  }`}
                >
                  <span className="truncate">{t.name}</span>
                  <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-full ring-1 ring-charcoal/20" style={{ backgroundColor: visual.dot }} />
                </button>
              );
            })}
          </div>
          <label className="block">
            <span className="text-sm font-bold text-charcoal">Captain PIN</span>
            <input
              type="password"
              inputMode="numeric"
              autoComplete="off"
              data-testid="captain-pin-input"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 8))}
              placeholder="4–8 digits"
              className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3.5 text-center text-xl font-extrabold tracking-[0.3em] text-charcoal shadow-sm focus:border-forest"
            />
          </label>
          {error && (
            <p role="alert" data-testid="captain-login-error" className="rounded-xl bg-red-700/10 px-4 py-3 text-sm font-bold text-red-700">
              {error}
            </p>
          )}
          <button
            type="submit"
            data-testid="captain-login-submit"
            disabled={!teamId || pin.length < 4 || busy}
            className="min-h-13 rounded-full bg-forest px-8 py-3.5 text-base font-extrabold text-cream shadow-sm transition-colors duration-200 hover:bg-forest-soft disabled:opacity-50"
          >
            {busy ? "Signing in…" : "Start Scoring"}
          </button>
        </form>
      </div>
    </div>
  );
};

// ---------- Scoring card for the signed-in team ----------
const TeamScorecard = ({ team, onSignOut }) => {
  const [state, setState] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [hole, setHole] = useState(team.startingHole ?? 1);
  const [strokes, setStrokes] = useState("");
  const [armed, setArmed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await teamFetch("/team-scoring/state");
      setState(res.data);
      setLoadError("");
    } catch (e) {
      setLoadError(e.message);
      if (e.message.includes("Session expired")) onSignOut();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const holes = useMemo(() => {
    const map = {};
    (state?.scores ?? []).forEach((s) => { map[s.hole] = s.strokes; });
    return map;
  }, [state]);

  const existing = holes[hole];
  const parsed = strokes.trim() === "" ? null : Number(strokes);
  const valid = parsed !== null && Number.isInteger(parsed) && parsed >= 1 && parsed <= 30;

  const goHole = (next) => {
    const h = Math.min(18, Math.max(1, next));
    setHole(h);
    setArmed(false);
    setError("");
    setStrokes(holes[h] !== undefined ? String(holes[h]) : "");
  };

  const save = async () => {
    if (!valid) return;
    if (existing !== undefined && !armed) {
      setArmed(true);
      return;
    }
    setSaving(true);
    setError("");
    setFlash("");
    try {
      await teamFetch("/team-scoring/hole", { method: "PUT", body: JSON.stringify({ hole, strokes: parsed }) });
      setFlash(`Saved — Hole ${hole}: ${parsed}`);
      setArmed(false);
      await load();
      if (hole < 18) goHole(hole + 1);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loadError) {
    return (
      <p role="alert" data-testid="captain-load-error" className="mx-auto max-w-xl rounded-2xl bg-red-700/10 p-6 text-center text-sm font-bold text-red-700">
        {loadError}
      </p>
    );
  }
  if (!state) {
    return <p data-testid="captain-loading" className="py-16 text-center text-sm font-semibold text-charcoal/50">Loading your card…</p>;
  }

  const total = Object.values(holes).reduce((a, b) => a + b, 0);
  const thru = Object.keys(holes).length;

  return (
    <div data-testid="captain-scorecard" className="mx-auto max-w-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-forest sm:text-3xl">{state.team.name}</h1>
          <p className="mt-1 text-sm font-semibold text-charcoal/55">
            {thru}/18 holes · {thru > 0 ? `${total} strokes` : "card not started"}
          </p>
        </div>
        <button
          type="button"
          data-testid="captain-signout"
          onClick={onSignOut}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-charcoal/10 px-4 py-2 text-sm font-bold text-charcoal transition-colors duration-200 hover:bg-charcoal/15"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sign out
        </button>
      </div>

      {state.status !== "live" ? (
        <div
          data-testid="captain-status-notice"
          className="mt-8 flex flex-col items-center rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-border"
        >
          <span aria-hidden="true" className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-mist text-forest">
            {state.status === "final" ? <Trophy className="h-7 w-7" /> : <Flag className="h-7 w-7" />}
          </span>
          <p className="mt-5 text-lg font-extrabold text-forest">
            {state.status === "final" ? "The round is complete" : "Scoring opens when the round begins"}
          </p>
          <p className="mt-2 text-sm font-semibold text-charcoal/55">
            {state.status === "final"
              ? "See the final standings on the public leaderboard."
              : "The organizer will open scoring at the shotgun start — check back then."}
          </p>
          <Link
            to="/leaderboard"
            data-testid="captain-leaderboard-link"
            className="mt-6 inline-flex min-h-12 items-center rounded-full bg-forest px-7 py-3 text-base font-extrabold text-cream transition-colors duration-200 hover:bg-forest-soft"
          >
            View Leaderboard
          </Link>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-5">
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-forest-mist p-3">
            <button
              type="button"
              data-testid="captain-hole-prev"
              aria-label="Previous hole"
              onClick={() => goHole(hole - 1)}
              disabled={hole <= 1}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-forest shadow-sm disabled:opacity-40"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <div className="text-center">
              <p data-testid="captain-hole-current" className="text-2xl font-extrabold text-forest">Hole {hole}</p>
              <p className="text-xs font-bold text-charcoal/50">Par {state.par[hole - 1]}</p>
            </div>
            <button
              type="button"
              data-testid="captain-hole-next"
              aria-label="Next hole"
              onClick={() => goHole(hole + 1)}
              disabled={hole >= 18}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-forest shadow-sm disabled:opacity-40"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {existing !== undefined && (
            <p data-testid="captain-score-existing" className={`rounded-xl px-4 py-3 text-sm font-bold ${armed ? "bg-gold/20 text-gold-deep" : "bg-white text-charcoal/70 ring-1 ring-border"}`}>
              {armed
                ? `A score of ${existing} is already saved for hole ${hole}. Press Overwrite to replace it.`
                : `Existing score on this hole: ${existing}. Saving will overwrite it.`}
            </p>
          )}

          <div className="flex items-end gap-3">
            <label className="block flex-1">
              <span className="text-sm font-bold text-charcoal">Team score on hole {hole}</span>
              <input
                type="number"
                inputMode="numeric"
                min="1"
                max="30"
                data-testid="captain-score-input"
                value={strokes}
                onChange={(e) => { setStrokes(e.target.value); setArmed(false); setError(""); }}
                placeholder="e.g. 4"
                className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-4 text-2xl font-extrabold text-charcoal shadow-sm focus:border-forest"
              />
            </label>
            <button
              type="button"
              data-testid="captain-score-save"
              onClick={save}
              disabled={!valid || saving}
              className={`min-h-14 shrink-0 rounded-full px-8 text-base font-extrabold shadow-sm transition-colors duration-200 disabled:opacity-50 ${
                armed ? "bg-gold text-forest-deep hover:bg-gold-soft" : "bg-forest text-cream hover:bg-forest-soft"
              }`}
            >
              {saving ? "Saving…" : armed ? "Overwrite" : "Save"}
            </button>
          </div>
          {strokes.trim() !== "" && !valid && (
            <p data-testid="captain-score-invalid" role="alert" className="text-sm font-bold text-red-700">
              Enter a whole-number score of 1 or more.
            </p>
          )}
          {flash && (
            <p data-testid="captain-score-flash" role="status" className="inline-flex items-center gap-2 rounded-xl bg-forest-mist px-4 py-3 text-sm font-extrabold text-forest">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              {flash}
            </p>
          )}
          {error && (
            <p data-testid="captain-score-error" role="alert" className="text-sm font-bold text-red-700">{error}</p>
          )}

          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-border">
            <p className="text-xs font-bold uppercase tracking-widest text-charcoal/40">Your card</p>
            <div data-testid="captain-card-grid" className="mt-3 grid grid-cols-9 gap-1.5">
              {HOLES.map((h) => (
                <button
                  key={h}
                  type="button"
                  data-testid={`captain-card-${h}`}
                  aria-label={holes[h] !== undefined ? `Hole ${h}: ${holes[h]} — edit` : `Hole ${h}: no score — enter`}
                  onClick={() => goHole(h)}
                  className={`flex aspect-square flex-col items-center justify-center rounded-lg text-xs font-extrabold transition-colors duration-150 ${
                    h === hole
                      ? "bg-gold text-forest-deep"
                      : holes[h] !== undefined
                        ? "bg-forest text-gold"
                        : "bg-cream text-charcoal/30 ring-1 ring-border"
                  }`}
                >
                  <span className="text-[9px] font-bold opacity-60">{h}</span>
                  {holes[h] ?? "·"}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function CaptainScoring() {
  const [teams, setTeams] = useState(null);
  const [team, setTeam] = useState(getTeamInfo());

  useEffect(() => {
    fetchPublic("teams")
      .then((d) => setTeams((d?.items ?? []).filter((t) => t.active !== false)))
      .catch(() => setTeams([]));
  }, []);

  const signOut = () => {
    clearTeamSession();
    setTeam(null);
  };

  if (!teams) {
    return <p data-testid="captain-teams-loading" className="py-16 text-center text-sm font-semibold text-charcoal/50">Loading…</p>;
  }

  return (
    <div data-testid="captain-scoring-page" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      {team && getTeamToken() ? (
        <TeamScorecard team={team} onSignOut={signOut} />
      ) : (
        <CaptainLogin teams={teams} onLogin={setTeam} />
      )}
    </div>
  );
}
