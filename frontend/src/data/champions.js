// Champions fallback content — mirrors the live Trophy Wall (real champions
// since 2020). The 2026 champion is added via the admin after the tournament.

const entry = (year, ordinal, teamName, captain, members) => ({
  year,
  teamName,
  captain,
  members,
  finalScore: "—",
  margin: "",
  mvp: "",
  quote: "",
  story: `The story of the ${ordinal} Annual Dalleo Open (${year}) championship is being collected — check back soon.`,
  moments: [],
  awards: ["Dalleo Open Champions"],
  stats: [
    { label: "Final Score", value: "—" },
    { label: "Edition", value: `${ordinal} Annual` },
    { label: "Team Size", value: `${members.length} players` },
  ],
  photoCaption: `${year} championship photo — coming soon`,
  photoUrl: null,
  published: true,
  placeholder: false,
});

export const CHAMPIONS = {
  published: true,
  header: {
    title: "Champions",
    body: "Every year earns a permanent place in tournament history. This is the Trophy Wall — the teams who lifted the Dalleo Open and the stories of how they did it.",
  },
  entries: [
    entry(2025, "6th", "Team Devin", "Devin", ["Devin", "Ross", "Pittman", "Josef"]),
    entry(2024, "5th", "Roger & Mark", "Roger", ["Roger", "Mark"]),
    entry(2023, "4th", "Kaleb & Devin", "Kaleb", ["Kaleb", "Devin"]),
    entry(2022, "3rd", "Roger & Nate", "Roger", ["Roger", "Nate"]),
    entry(2021, "2nd", "Roger & Dismukes", "Roger", ["Roger", "Dismukes"]),
    entry(2020, "1st", "Sunny & Villa", "Sunny", ["Sunny", "Villa"]),
  ],
  records: [
    { id: "rec-low-score", label: "Lowest Winning Score", holder: "Awaiting official records", value: "—", year: "", note: "The lowest team score ever to win the Dalleo Open." },
    { id: "rec-big-margin", label: "Largest Margin of Victory", holder: "Awaiting official records", value: "—", year: "", note: "The most dominant championship performance." },
    { id: "rec-closest", label: "Closest Finish", holder: "Awaiting official records", value: "—", year: "", note: "The tightest finish in tournament history." },
    { id: "rec-most-titles", label: "Most Championships", holder: "Roger — 3 championships", value: "3", year: "2021 · 2022 · 2024", note: "Won with three different partners: Dismukes (2021), Nate (2022), Mark (2024)." },
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
