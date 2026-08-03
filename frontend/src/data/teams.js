// Centralized team identity and roster data (Sprint 3).
// Teams page, team detail, homepage preview, and the Leaderboard all read
// team names, colors, and captains from this file — never duplicate them.

// Flip to false to see the pre-announcement empty state on the Teams page.
export const TEAMS_ANNOUNCED = true;

export const TEAM_VISUALS = {
  green: { dot: "#1F4E3D", label: "Green" },
  gold: { dot: "#C9A227", label: "Gold" },
  white: { dot: "#FFFFFF", label: "White" },
  black: { dot: "#262B2E", label: "Black" },
};

export const TEAMS = [
  {
    id: "green",
    colorKey: "green",
    name: "Team Green",
    captain: "M. Dalleo",
    motto: "Fairways, friends, and a little bit of legacy.",
    players: [
      { name: "Mike Dalleo", role: "Captain" },
      { name: "Dan Rooker" },
      { name: "Chris Peluso" },
      { name: "Adam Voss" },
      { name: "Joey Bell" },
      { name: "Sam Whitaker" },
    ],
  },
  {
    id: "gold",
    colorKey: "gold",
    name: "Team Gold",
    captain: "J. Carter",
    motto: "Swing easy, laugh often, finish strong.",
    players: [
      { name: "Jason Carter", role: "Captain" },
      { name: "Brian Foster" },
      { name: "Kevin Lang" },
      { name: "Matt Doyle" },
      { name: "Nick Harmon" },
      { name: "Pete Sullivan" },
    ],
  },
  {
    id: "white",
    colorKey: "white",
    name: "Team White",
    captain: "S. Reyes",
    motto: "Steady hands, full hearts.",
    players: [
      { name: "Sam Reyes", role: "Captain" },
      { name: "Alex Moreno" },
      { name: "Dave Whitfield" },
      { name: "Eric Nolan" },
      { name: "Frank Barber" },
      { name: "Greg Mason" },
    ],
  },
  {
    id: "black",
    colorKey: "black",
    name: "Team Black",
    captain: "T. O'Neil",
    motto: "Quiet confidence, loud scorecards.",
    players: [
      { name: "Tom O'Neil", role: "Captain" },
      { name: "Andrew Keene" },
      { name: "Ben Callahan" },
      { name: "Carl Jensen" },
      { name: "Drew Malone" },
      { name: "Evan Pierce" },
    ],
  },
];

export const TOTAL_PLAYERS = TEAMS.reduce((n, t) => n + t.players.length, 0);

export const getTeamById = (id) => TEAMS.find((t) => t.id === id);

export const getInitials = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
