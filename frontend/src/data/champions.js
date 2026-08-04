// Champions fallback content — shown publicly until the organizer saves real
// history via the admin dashboard. Every entry is marked placeholder: true and
// the public page labels them as samples awaiting official records.

const placeholderStory = (ordinal, year) =>
  `The story of the ${ordinal} Annual Dalleo Open (${year}) will be written here. Replace this text with the official championship recap — how the round unfolded, when the lead changed hands, and the shot everyone still talks about.`;

const mkEntry = (year, ordinal) => ({
  year,
  teamName: `Team ${["Fairway", "Bunker", "Fairway Green", "Gallery", "Clubhouse", "Caddie"][year - 2020]}`,
  captain: "Captain Name",
  members: ["Captain Name", "Player Two", "Player Three", "Player Four"],
  finalScore: "Score TBD",
  margin: "Margin TBD",
  mvp: "To be announced",
  quote: "A memorable quote from the winning team will live here.",
  story: placeholderStory(ordinal, year),
  moments: [
    "A signature shot from the winning round will be recorded here.",
    "The turning point of the day, as told by the champions.",
    "The celebration moment that made it into tournament lore.",
  ],
  awards: ["Dalleo Open Champions", "Lowest Team Score"],
  stats: [
    { label: "Final Score", value: "TBD" },
    { label: "Winning Margin", value: "TBD" },
    { label: "Team Size", value: "4 players" },
    { label: "Edition", value: `${ordinal} Annual` },
  ],
  photoCaption: `${year} championship photo — coming soon`,
  published: true,
  placeholder: true,
});

export const CHAMPIONS = {
  published: true,
  header: {
    title: "Champions",
    body: "Every year earns a permanent place in tournament history. This is the Trophy Wall — the teams who lifted the Dalleo Open and the stories of how they did it.",
  },
  entries: [2025, 2024, 2023, 2022, 2021, 2020].map((y) =>
    mkEntry(y, ["6th", "5th", "4th", "3rd", "2nd", "1st"][2025 - y])
  ),
  records: [
    { id: "rec-low-score", label: "Lowest Winning Score", holder: "Awaiting official records", value: "—", year: "", note: "The lowest team score ever to win the Dalleo Open." },
    { id: "rec-big-margin", label: "Largest Margin of Victory", holder: "Awaiting official records", value: "—", year: "", note: "The most dominant championship performance." },
    { id: "rec-closest", label: "Closest Finish", holder: "Awaiting official records", value: "—", year: "", note: "The tightest finish in tournament history." },
    { id: "rec-most-titles", label: "Most Championships", holder: "Awaiting official records", value: "—", year: "", note: "The team or captain with the most titles." },
    { id: "rec-most-apps", label: "Most Appearances", holder: "Awaiting official records", value: "—", year: "", note: "The player who has teed it up the most times." },
    { id: "rec-long-drive", label: "Longest Drive", holder: "Awaiting official records", value: "—", year: "", note: "The biggest tee shot ever recorded at the Dalleo Open." },
    { id: "rec-ctp", label: "Closest to the Pin", holder: "Awaiting official records", value: "—", year: "", note: "The finest approach shot on record." },
    { id: "rec-low-hole", label: "Lowest Individual Hole", holder: "Awaiting official records", value: "—", year: "", note: "The best single-hole score by any player." },
    { id: "rec-comeback", label: "Biggest Comeback", holder: "Awaiting official records", value: "—", year: "", note: "The largest deficit ever overcome to win." },
    { id: "rec-ace", label: "Hole-in-One Club", holder: "Awaiting official records", value: "—", year: "", note: "Every ace in Dalleo Open history." },
  ],
};

export const editionLabel = (year) => {
  const n = year - 2019;
  const suffix = n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th";
  return `${n}${suffix} Annual`;
};
