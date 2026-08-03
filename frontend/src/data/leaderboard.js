// Centralized mock tournament data for Sprint 2.
// Replace these exports with API-fed data in a future sprint — components
// only read from this file, so the page layout never changes.

// Flip to false to see the pre-tournament empty state.
export const SCORING_STARTED = true;

export const ROUNDS = [
  { id: "overall", label: "Overall" },
  { id: "round1", label: "Round 1" },
  { id: "round2", label: "Round 2" },
  { id: "final", label: "Final" },
];

export const TEAM_VISUALS = {
  green: { dot: "#1F4E3D", label: "Green" },
  gold: { dot: "#C9A227", label: "Gold" },
  white: { dot: "#FFFFFF", label: "White" },
  black: { dot: "#262B2E", label: "Black" },
};

const team = (rank, colorKey, name, captain, points, movement, status) => ({
  rank,
  colorKey,
  name,
  captain,
  points,
  movement,
  status,
});

export const LEADERBOARD = {
  overall: {
    meta: { roundLabel: "Round 2", status: "live", statusLabel: "Live", updatedAt: "Today at 2:18 PM" },
    standings: [
      team(1, "green", "Team Green", "M. Dalleo", 124, { dir: "same" }, "live"),
      team(2, "gold", "Team Gold", "J. Carter", 119, { dir: "up", places: 1 }, "live"),
      team(3, "white", "Team White", "S. Reyes", 113, { dir: "down", places: 1 }, "live"),
      team(4, "black", "Team Black", "T. O'Neil", 109, { dir: "same" }, "live"),
    ],
    matches: [
      { id: "match-1", name: "Match 1 · Group A", home: "green", away: "gold", status: "in-progress", score: "32 – 30" },
      { id: "match-2", name: "Match 2 · Group B", home: "white", away: "black", status: "final", score: "41 – 39" },
      { id: "match-3", name: "Match 3 · Group A", home: "green", away: "black", status: "upcoming", score: null },
    ],
  },
  round1: {
    meta: { roundLabel: "Round 1", status: "final", statusLabel: "Final", updatedAt: "Saturday at 6:42 PM" },
    standings: [
      team(1, "green", "Team Green", "M. Dalleo", 61, null, "final"),
      team(2, "white", "Team White", "S. Reyes", 58, null, "final"),
      team(3, "gold", "Team Gold", "J. Carter", 56, null, "final"),
      team(4, "black", "Team Black", "T. O'Neil", 52, null, "final"),
    ],
    matches: [
      { id: "r1-match-1", name: "Match 1 · Group A", home: "green", away: "white", status: "final", score: "61 – 58" },
      { id: "r1-match-2", name: "Match 2 · Group B", home: "gold", away: "black", status: "final", score: "56 – 52" },
    ],
  },
  round2: {
    meta: { roundLabel: "Round 2", status: "live", statusLabel: "Live", updatedAt: "Today at 2:18 PM" },
    standings: [
      team(1, "green", "Team Green", "M. Dalleo", 63, { dir: "same" }, "live"),
      team(2, "gold", "Team Gold", "J. Carter", 62, { dir: "up", places: 1 }, "live"),
      team(3, "black", "Team Black", "T. O'Neil", 57, { dir: "up", places: 1 }, "live"),
      team(4, "white", "Team White", "S. Reyes", 55, { dir: "down", places: 2 }, "live"),
    ],
    matches: [
      { id: "r2-match-1", name: "Match 1 · Group A", home: "green", away: "gold", status: "in-progress", score: "32 – 30" },
      { id: "r2-match-2", name: "Match 2 · Group B", home: "white", away: "black", status: "final", score: "41 – 39" },
      { id: "r2-match-3", name: "Match 3 · Group A", home: "green", away: "black", status: "upcoming", score: null },
    ],
  },
  final: {
    meta: { roundLabel: "Final Round", status: "upcoming", statusLabel: "Upcoming", updatedAt: "Sunday, time TBA" },
    standings: [
      team(1, "green", "Team Green", "M. Dalleo", null, null, "upcoming"),
      team(2, "gold", "Team Gold", "J. Carter", null, null, "upcoming"),
      team(3, "white", "Team White", "S. Reyes", null, null, "upcoming"),
      team(4, "black", "Team Black", "T. O'Neil", null, null, "upcoming"),
    ],
    matches: [
      { id: "f-match-1", name: "Championship Match", home: "green", away: "gold", status: "upcoming", score: null },
      { id: "f-match-2", name: "Third-Place Match", home: "white", away: "black", status: "upcoming", score: null },
    ],
  },
};

// Leader summary for the currently active (overall) standings.
export const getLeaderSummary = (roundId = "overall") => {
  const { standings } = LEADERBOARD[roundId];
  const started = standings.filter((t) => t.points !== null);
  if (started.length < 2) return null;
  const [first, second] = started;
  return { leader: first, runnerUp: second, lead: first.points - second.points };
};
