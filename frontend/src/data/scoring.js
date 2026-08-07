// Shared stroke-play scoring logic for the 2026 four-person scramble.
// One team score per hole · 18 holes · lowest total team score wins.

export const HOLES = Array.from({ length: 18 }, (_, i) => i + 1);
// Official course scorecard — Black tees, par 72 (out 36 / in 36).
export const DEFAULT_PAR = [4, 4, 5, 3, 4, 4, 5, 3, 4, 4, 4, 4, 5, 3, 4, 4, 3, 5];

export const STATUS_LABELS = {
  "not-started": "Not Started",
  live: "Live",
  final: "Final",
  // Rehearsal mode — publicly indistinguishable from Live by design.
  test: "Live",
};

// Build per-team aggregates from a scoring doc.
// Returns one row per team: totals, to-par, holes completed, hole map.
export const buildRows = (scoring, teams) => {
  const par = scoring?.par?.length === 18 ? scoring.par : DEFAULT_PAR;
  const byTeam = {};
  (scoring?.scores ?? []).forEach((s) => {
    byTeam[s.teamId] = byTeam[s.teamId] || {};
    byTeam[s.teamId][s.hole] = s.strokes;
  });
  return teams.map((team) => {
    const holes = byTeam[team.id] ?? {};
    const played = HOLES.filter((h) => holes[h] !== undefined);
    const total = played.reduce((sum, h) => sum + holes[h], 0);
    const parPlayed = played.reduce((sum, h) => sum + par[h - 1], 0);
    return {
      team,
      holes,
      thru: played.length,
      finished: played.length === 18,
      total,
      toPar: played.length ? total - parPlayed : null,
    };
  });
};

// Sort lowest-score-first (teams with no scores go last, alphabetical),
// then assign positions with standard competition ranking (1, T2, T2, 4).
export const computeStandings = (scoring, teams) => {
  const rows = buildRows(scoring, teams);
  const scored = rows.filter((r) => r.thru > 0).sort((a, b) => a.total - b.total || a.team.name.localeCompare(b.team.name));
  const unscored = rows.filter((r) => r.thru === 0).sort((a, b) => a.team.name.localeCompare(b.team.name));
  let position = 0;
  let lastTotal = null;
  scored.forEach((row, i) => {
    if (row.total !== lastTotal) {
      position = i + 1;
      lastTotal = row.total;
    }
    row.position = position;
    row.tied = scored.filter((r) => r.total === row.total).length > 1;
  });
  return [...scored, ...unscored];
};

export const formatToPar = (toPar) => {
  if (toPar === null || toPar === undefined) return "—";
  if (toPar === 0) return "E";
  return toPar > 0 ? `+${toPar}` : `${toPar}`;
};

export const formatPosition = (row) =>
  row.position ? (row.tied ? `T${row.position}` : `${row.position}`) : "—";

export const formatUpdatedAt = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};
