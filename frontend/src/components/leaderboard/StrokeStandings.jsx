import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TEAM_VISUALS } from "@/data/teams";
import { HOLES, formatToPar } from "@/data/scoring";

const ScorecardGrid = ({ row, par }) => (
  <div
    data-testid={`scorecard-${row.team.id}`}
    className="mt-4 overflow-x-auto rounded-2xl bg-cream/95 p-4 ring-1 ring-border"
  >
    <table className="w-full min-w-[420px] table-fixed text-center">
      <thead>
        <tr>
          <th className="pb-2 text-left text-[10px] font-bold uppercase tracking-widest text-charcoal/40">Hole</th>
          {HOLES.map((h) => (
            <th key={h} className="pb-2 text-[11px] font-bold text-charcoal/50">{h}</th>
          ))}
          <th className="pb-2 text-[11px] font-extrabold text-charcoal">Tot</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="py-1 text-left text-[10px] font-bold uppercase tracking-widest text-charcoal/40">Par</td>
          {HOLES.map((h) => (
            <td key={h} className="py-1 text-xs font-semibold text-charcoal/45">{par[h - 1]}</td>
          ))}
          <td className="py-1 text-xs font-bold text-charcoal/60">{par.reduce((a, b) => a + b, 0)}</td>
        </tr>
        <tr>
          <td className="py-1 text-left text-[10px] font-bold uppercase tracking-widest text-gold-deep">Score</td>
          {HOLES.map((h) => (
            <td
              key={h}
              data-testid={`hole-${row.team.id}-${h}`}
              className={`py-1 text-sm font-extrabold ${row.holes[h] !== undefined ? "text-forest" : "text-charcoal/25"}`}
            >
              {row.holes[h] !== undefined ? row.holes[h] : "·"}
            </td>
          ))}
          <td className="py-1 text-sm font-extrabold text-forest">{row.total}</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const StandingRow = ({ row, par, isLeader, isChampion }) => {
  const [open, setOpen] = useState(false);
  const visual = TEAM_VISUALS[row.team.colorKey] ?? TEAM_VISUALS.green;
  const highlight = isLeader || isChampion;
  return (
    <li
      data-testid={`standing-row-${row.team.id}`}
      className={`rounded-2xl p-4 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-5 ${
        highlight ? "bg-forest text-cream ring-1 ring-gold/40" : "bg-white ring-1 ring-border"
      }`}
    >
      <div className="flex items-center gap-3 sm:gap-5">
        <span
          className={`w-10 shrink-0 text-center text-xl font-extrabold sm:text-2xl ${highlight ? "text-gold" : "text-charcoal/50"}`}
          aria-label={`Position ${row.position ?? "unranked"}`}
        >
          {row.position ? (row.tied ? `T${row.position}` : row.position) : "—"}
        </span>
        <span
          aria-hidden="true"
          className="h-5 w-5 shrink-0 rounded-full ring-1 ring-charcoal/20 sm:h-6 sm:w-6"
          style={{ backgroundColor: visual.dot }}
        />
        <div className="min-w-0 flex-1">
          <p className={`truncate text-base font-extrabold tracking-tight sm:text-lg ${highlight ? "text-cream" : "text-charcoal"}`}>
            {row.team.name}
            {isChampion && (
              <span className="ml-2 rounded-full bg-gold px-2.5 py-0.5 align-middle text-[10px] font-extrabold uppercase tracking-widest text-forest-deep">
                Champion
              </span>
            )}
            {isLeader && !isChampion && (
              <span className="ml-2 rounded-full bg-gold px-2.5 py-0.5 align-middle text-[10px] font-extrabold uppercase tracking-widest text-forest-deep">
                Leader
              </span>
            )}
          </p>
          <p className={`mt-0.5 text-xs sm:text-sm ${highlight ? "text-cream/60" : "text-charcoal/50"}`}>
            Captain {row.team.captain}
            <span aria-hidden="true"> · </span>
            {row.thru === 0 ? "Not started" : row.finished ? "Finished (F)" : `Thru ${row.thru}`}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className={`text-2xl font-extrabold tracking-tight sm:text-3xl ${highlight ? "text-gold" : "text-forest"}`}>
            {formatToPar(row.toPar)}
          </p>
          <p className={`text-[10px] font-bold uppercase tracking-widest sm:text-xs ${highlight ? "text-cream/50" : "text-charcoal/40"}`}>
            {row.thru > 0 ? `${row.total} strokes` : "to par"}
          </p>
        </div>
        <button
          type="button"
          data-testid={`scorecard-toggle-${row.team.id}`}
          aria-expanded={open}
          aria-label={`${open ? "Hide" : "Show"} ${row.team.name} scorecard`}
          onClick={() => setOpen((v) => !v)}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${
            highlight ? "text-cream/70 hover:bg-cream/10" : "text-forest hover:bg-forest-mist"
          }`}
        >
          {open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>
      {open && <ScorecardGrid row={row} par={par} />}
    </li>
  );
};

export const StrokeStandings = ({ standings, par, final }) => (
  <section data-testid="standings-section" aria-labelledby="standings-title">
    <h2
      id="standings-title"
      className="text-base font-bold uppercase tracking-[0.2em] text-gold-deep md:text-lg"
    >
      Team Standings · Lowest Score Wins
    </h2>
    <ol data-testid="standings-list" className="mt-6 flex flex-col gap-3">
      {standings.map((row, i) => (
        <StandingRow
          key={row.team.id}
          row={row}
          par={par}
          isLeader={!final && row.position === 1}
          isChampion={final && row.position === 1}
        />
      ))}
    </ol>
  </section>
);
