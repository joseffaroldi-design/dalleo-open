import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/api";

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

export default function ArchiveAdmin() {
  const [state, setState] = useState(null);
  const [confirmArchive, setConfirmArchive] = useState("");
  const [confirmStart, setConfirmStart] = useState("");
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      setState(await adminFetch("/admin/tournament-years"));
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => { load(); }, []);

  if (!state && !error) {
    return <p className="py-16 text-center text-sm font-semibold text-charcoal/50">Loading tournament years…</p>;
  }

  const currentYear = Number(state?.currentYear || 0);
  const nextYear = currentYear + 1;
  const currentArchive = state?.archives?.find((a) => Number(a.year) === currentYear);

  const archiveCurrent = async () => {
    setWorking(true); setError(""); setMessage("");
    try {
      await adminFetch("/admin/tournament-years/archive", {
        method: "POST",
        body: JSON.stringify({ year: currentYear, confirmation: confirmArchive }),
      });
      setConfirmArchive("");
      setMessage(`${currentYear} is archived and locked.`);
      await load();
    } catch (e) { setError(e.message); }
    finally { setWorking(false); }
  };

  const startNext = async () => {
    setWorking(true); setError(""); setMessage("");
    try {
      await adminFetch("/admin/tournament-years/rollover", {
        method: "POST",
        body: JSON.stringify({ fromYear: currentYear, toYear: nextYear, confirmation: confirmStart }),
      });
      setConfirmStart("");
      setMessage(`${nextYear} tournament workspace is ready.`);
      await load();
    } catch (e) { setError(e.message); }
    finally { setWorking(false); }
  };

  const exportYear = async (year) => {
    try {
      const res = await adminFetch(`/admin/tournament-years/${year}`);
      downloadJson(`dalleo-open-${year}-archive.json`, res.archive);
    } catch (e) { setError(e.message); }
  };

  return (
    <div data-testid="archive-admin">
      <h1 className="text-2xl font-extrabold tracking-tight text-forest sm:text-3xl">Tournament Years</h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-charcoal/60">
        Close a completed tournament, preserve its official record, then prepare the next year. Historical data is never deleted by this workflow.
      </p>

      {error && <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}
      {message && <div className="mt-5 rounded-2xl bg-green-50 p-4 text-sm font-bold text-forest">{message}</div>}

      <div className="mt-8 grid gap-6">
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-border sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-deep">Current Tournament</p>
              <h2 className="mt-2 text-2xl font-extrabold text-forest">{currentYear || "—"}</h2>
            </div>
            <span className="rounded-full bg-forest/10 px-4 py-2 text-sm font-bold text-forest">Current</span>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-border sm:p-8">
          <h2 className="text-xl font-extrabold text-forest">Close {currentYear}</h2>
          <p className="mt-1 text-sm text-charcoal/60">
            Creates a locked snapshot of teams, rosters, scores, standings data, rules, schedule, announcements, gallery references, champions, course and committee data. Player names and photo references are also saved for reuse.
          </p>
          {currentArchive ? (
            <div className="mt-5 rounded-2xl bg-cream p-4 text-sm font-bold text-forest">{currentYear} is already archived.</div>
          ) : (
            <>
              <label className="mt-6 block">
                <span className="text-sm font-bold text-charcoal">Confirmation</span>
                <span className="mt-1 block text-xs text-charcoal/50">Type ARCHIVE {currentYear} exactly.</span>
                <input className={`${inputCls} mt-1.5`} value={confirmArchive} onChange={(e) => setConfirmArchive(e.target.value.toUpperCase())} placeholder={`ARCHIVE ${currentYear}`} />
              </label>
              <button type="button" className={`${buttonCls} mt-5`} disabled={working || confirmArchive !== `ARCHIVE ${currentYear}`} onClick={archiveCurrent}>
                {working ? "Working…" : `Archive ${currentYear}`}
              </button>
            </>
          )}
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-border sm:p-8">
          <h2 className="text-xl font-extrabold text-forest">Start {nextYear}</h2>
          <p className="mt-1 text-sm text-charcoal/60">
            Available only after {currentYear} is archived. The next workspace keeps the player library, gallery, champions, course, committee and branding while clearing active rosters, scores, pairings, schedule, announcements and captain PINs. Rules remain as an unpublished draft for review.
          </p>
          <label className="mt-6 block">
            <span className="text-sm font-bold text-charcoal">Confirmation</span>
            <span className="mt-1 block text-xs text-charcoal/50">Type START {nextYear} exactly.</span>
            <input className={`${inputCls} mt-1.5`} value={confirmStart} onChange={(e) => setConfirmStart(e.target.value.toUpperCase())} placeholder={`START ${nextYear}`} />
          </label>
          <button type="button" className={`${buttonCls} mt-5`} disabled={working || !currentArchive || confirmStart !== `START ${nextYear}`} onClick={startNext}>
            {working ? "Working…" : `Prepare ${nextYear} Tournament`}
          </button>
          {!currentArchive && <p className="mt-3 text-xs font-bold text-red-700">Archive {currentYear} first. The rollover stays locked until that archive exists.</p>}
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-border sm:p-8">
          <h2 className="text-xl font-extrabold text-forest">Archived Years</h2>
          <div className="mt-5 grid gap-3">
            {state?.archives?.length ? state.archives.map((archive) => (
              <div key={archive.year} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-cream p-4">
                <div>
                  <p className="font-extrabold text-forest">{archive.year} · Final Archive</p>
                  <p className="mt-1 text-xs text-charcoal/60">
                    {archive.teamCount} teams · {archive.scoreCount} saved hole scores{archive.champion?.teamName ? ` · Champion: ${archive.champion.teamName}` : ""}
                  </p>
                </div>
                <button type="button" onClick={() => exportYear(archive.year)} className="rounded-full bg-white px-4 py-2 text-xs font-extrabold text-forest ring-1 ring-border">Download JSON</button>
              </div>
            )) : <p className="text-sm text-charcoal/50">No archived tournament years yet.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
