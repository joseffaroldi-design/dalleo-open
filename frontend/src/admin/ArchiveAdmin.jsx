import { useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/lib/api";

const ARCHIVE_DOMAINS = [
  "announcements",
  "teams",
  "schedule",
  "gallery",
  "site",
  "rules",
  "champions",
  "scoring",
  "course",
  "committee",
];

const inputCls =
  "w-full rounded-xl border border-border bg-white px-4 py-3 text-base text-charcoal shadow-sm focus:border-forest";

const buttonCls =
  "min-h-12 rounded-full bg-forest px-6 py-3 text-sm font-extrabold text-cream disabled:cursor-not-allowed disabled:opacity-50";

function downloadJson(filename, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function buildPlayerLibrary(teams) {
  const map = new Map();
  for (const team of teams?.items ?? []) {
    for (const player of team.players ?? []) {
      const name = (player.name ?? "").trim();
      if (!name) continue;
      const key = name.toLowerCase();
      const existing = map.get(key) ?? { name, photoUrl: null, appearances: [] };
      if (!existing.photoUrl && player.photoUrl) existing.photoUrl = player.photoUrl;
      existing.appearances.push({ teamId: team.id, teamName: team.name });
      map.set(key, existing);
    }
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export default function ArchiveAdmin() {
  const [domains, setDomains] = useState(null);
  const [archiveYear, setArchiveYear] = useState("2026");
  const [nextYear, setNextYear] = useState("2027");
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const entries = await Promise.all(
        ARCHIVE_DOMAINS.map(async (domain) => {
          const res = await adminFetch(`/admin/${domain}`);
          return [domain, res.data ?? null];
        })
      );
      setDomains(Object.fromEntries(entries));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const playerLibrary = useMemo(() => buildPlayerLibrary(domains?.teams), [domains]);
  const archives = domains?.site?.archives ?? [];
  const archiveExists = archives.some((a) => String(a.year) === String(archiveYear));

  const snapshot = useMemo(() => {
    if (!domains) return null;
    const cleanSite = { ...(domains.site ?? {}) };
    delete cleanSite.archives;
    delete cleanSite.playerLibrary;
    return {
      version: 1,
      year: Number(archiveYear),
      archivedAt: new Date().toISOString(),
      playerLibrary,
      domains: { ...domains, site: cleanSite },
    };
  }, [domains, archiveYear, playerLibrary]);

  const exportSnapshot = () => {
    if (!snapshot) return;
    downloadJson(`dalleo-open-${archiveYear}-archive.json`, snapshot);
  };

  const saveArchive = async () => {
    if (!snapshot || archiveExists) return;
    setWorking(true);
    setError("");
    setMessage("");
    try {
      const previousLibrary = domains.site?.playerLibrary ?? [];
      const merged = new Map(previousLibrary.map((p) => [p.name.toLowerCase(), p]));
      for (const player of playerLibrary) {
        const key = player.name.toLowerCase();
        const prior = merged.get(key) ?? {};
        merged.set(key, {
          ...prior,
          ...player,
          photoUrl: prior.photoUrl || player.photoUrl || null,
          archivedYears: [...new Set([...(prior.archivedYears ?? []), Number(archiveYear)])],
        });
      }

      const archiveRecord = { ...snapshot, locked: true };
      const nextSite = {
        ...(domains.site ?? {}),
        archives: [...archives, archiveRecord],
        playerLibrary: [...merged.values()].sort((a, b) => a.name.localeCompare(b.name)),
      };
      await adminFetch("/admin/site", {
        method: "PUT",
        body: JSON.stringify({ data: nextSite }),
      });
      downloadJson(`dalleo-open-${archiveYear}-archive.json`, archiveRecord);
      setDomains((d) => ({ ...d, site: nextSite }));
      setMessage(`${archiveYear} archived and locked. A backup JSON file was also downloaded.`);
    } catch (e) {
      setError(e.message);
    } finally {
      setWorking(false);
    }
  };

  const rollover = async () => {
    if (!domains || !archiveExists || confirmText !== `START ${nextYear}`) return;
    setWorking(true);
    setError("");
    setMessage("");
    try {
      const teams = {
        ...(domains.teams ?? {}),
        published: false,
        items: (domains.teams?.items ?? []).map((team) => ({
          ...team,
          startingHole: null,
          startingHoleLabel: null,
          startingTime: null,
        })),
      };
      const scoring = {
        ...(domains.scoring ?? {}),
        status: "not-started",
        scores: [],
        updatedAt: new Date().toISOString(),
      };
      const site = {
        ...(domains.site ?? {}),
        year: String(nextYear),
        currentTournamentYear: Number(nextYear),
      };

      // The old season is already persisted in site.archives before these live docs change.
      await adminFetch("/admin/teams", { method: "PUT", body: JSON.stringify({ data: teams }) });
      await adminFetch("/admin/scoring", { method: "PUT", body: JSON.stringify({ data: scoring }) });
      await adminFetch("/admin/site", { method: "PUT", body: JSON.stringify({ data: site }) });

      setDomains((d) => ({ ...d, teams, scoring, site }));
      setConfirmText("");
      setMessage(`${nextYear} workspace prepared. Player names and photos were retained; pairings and scores were cleared.`);
    } catch (e) {
      setError(e.message);
    } finally {
      setWorking(false);
    }
  };

  if (loading) return <p className="py-16 text-center text-sm font-semibold text-charcoal/50">Loading archive data…</p>;

  return (
    <div data-testid="archive-admin">
      <h1 className="text-2xl font-extrabold tracking-tight text-forest sm:text-3xl">Tournament Archive & Yearly Rollover</h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-charcoal/60">
        Archive first, then start the next tournament. Archived seasons are stored inside the site data and a backup JSON is downloaded. Uploaded images are referenced by their existing URLs; no media is deleted.
      </p>

      {error && <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}
      {message && <div className="mt-5 rounded-2xl bg-green-50 p-4 text-sm font-bold text-forest">{message}</div>}

      <div className="mt-8 grid gap-6">
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-border sm:p-8">
          <h2 className="text-xl font-extrabold text-forest">1. Archive completed tournament</h2>
          <p className="mt-1 text-sm text-charcoal/60">Creates a permanent snapshot before any live tournament data changes.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-charcoal">Tournament year</span>
              <input className={`${inputCls} mt-1.5`} value={archiveYear} onChange={(e) => setArchiveYear(e.target.value.replace(/\D/g, "").slice(0, 4))} />
            </label>
            <div className="rounded-2xl bg-cream p-4 text-sm text-charcoal/70">
              <div><strong>{domains?.teams?.items?.length ?? 0}</strong> teams</div>
              <div><strong>{playerLibrary.length}</strong> reusable player records</div>
              <div><strong>{domains?.scoring?.scores?.length ?? 0}</strong> saved hole scores</div>
              <div><strong>{domains?.gallery?.items?.length ?? 0}</strong> gallery records</div>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className={buttonCls} onClick={exportSnapshot}>Download backup only</button>
            <button type="button" className={buttonCls} disabled={working || archiveExists || archiveYear.length !== 4} onClick={saveArchive}>
              {archiveExists ? `${archiveYear} already archived` : working ? "Archiving…" : `Archive ${archiveYear}`}
            </button>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-border sm:p-8">
          <h2 className="text-xl font-extrabold text-forest">2. Start next tournament</h2>
          <p className="mt-1 text-sm text-charcoal/60">
            Only available after the completed year is archived. This keeps player names/photos and team records, but clears shotgun assignments and hole scores and sets scoring to Not Started.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-charcoal">Next tournament year</span>
              <input className={`${inputCls} mt-1.5`} value={nextYear} onChange={(e) => setNextYear(e.target.value.replace(/\D/g, "").slice(0, 4))} />
            </label>
            <div className="rounded-2xl border border-gold/30 bg-gold/5 p-4 text-sm text-charcoal/70">
              <strong>Will retain:</strong> names, player photos, team photos, gallery media, champions, course and committee data.<br />
              <strong>Will reset:</strong> 18-hole scores, scoring status and shotgun starting assignments. Teams become unpublished until reviewed.
            </div>
          </div>

          <label className="mt-6 block">
            <span className="text-sm font-bold text-charcoal">Confirmation</span>
            <span className="mt-1 block text-xs text-charcoal/50">Type START {nextYear} exactly.</span>
            <input className={`${inputCls} mt-1.5`} value={confirmText} onChange={(e) => setConfirmText(e.target.value.toUpperCase())} placeholder={`START ${nextYear}`} />
          </label>
          <button
            type="button"
            className={`${buttonCls} mt-6`}
            disabled={working || !archiveExists || nextYear.length !== 4 || confirmText !== `START ${nextYear}`}
            onClick={rollover}
          >
            {working ? "Preparing…" : `Prepare ${nextYear} Tournament`}
          </button>
          {!archiveExists && <p className="mt-3 text-xs font-bold text-red-700">Archive {archiveYear} first. Rollover is intentionally locked until an archive exists.</p>}
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-border sm:p-8">
          <h2 className="text-xl font-extrabold text-forest">Archived years</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {archives.length ? archives.slice().sort((a, b) => Number(b.year) - Number(a.year)).map((archive) => (
              <span key={archive.year} className="rounded-full bg-forest/10 px-4 py-2 text-sm font-bold text-forest">
                {archive.year} · locked
              </span>
            )) : <span className="text-sm text-charcoal/50">No database archives created yet.</span>}
          </div>
        </section>
      </div>
    </div>
  );
}
