// Centralized rules & format content (Sprint 7).
// ALL rule content here is DRAFT placeholder content requiring organizer
// approval. No unconfirmed rule is presented as official Dalleo Open policy.

// Flip to false to see the unpublished state.
export const RULES_PUBLISHED = true;

// Flip to true once organizers confirm the rules — hides the draft notice.
export const RULES_APPROVED = false;

export const RULES = {
  header: {
    title: "Rules & Format",
    edition: "8th Annual Dalleo Open · 2026",
    description: "Tournament format, scoring, and the rules every player should know.",
  },
  draftNotice:
    "Draft rules shown below are placeholder content and require organizer approval.",
  quickReminders: [
    "Arrive before your scheduled start",
    "Confirm scores before submission",
    "Respect the course and other players",
    "Check the Schedule for updates",
  ],
  sectionNav: [
    { id: "format", label: "Tournament Format" },
    { id: "scoring", label: "Scoring" },
    { id: "match-rules", label: "Match Rules" },
    { id: "conduct", label: "Conduct" },
    { id: "tiebreakers", label: "Tie-Breakers" },
    { id: "faq", label: "FAQ" },
  ],
  format: {
    intro:
      "The Dalleo Open is a team-based competition played across tournament weekend. The details below describe the general structure — the confirmed playing format will be published after organizer review.",
    points: [
      "Team-based competition with captains and drafted rosters",
      "Multiple rounds or sessions across the weekend",
      "Points accumulated by teams across all rounds",
      "Final standings determined after the last round",
    ],
    note: "Specific playing formats — such as scramble, best ball, alternate shot, match play, or stroke play — are examples under review and require organizer confirmation.",
  },
  scoring: {
    note: "Final scoring values will be added after organizer confirmation.",
    rows: [
      { result: "Win", points: "10 pts (example)", explanation: "Sample points awarded to the team that wins a match." },
      { result: "Tie", points: "5 pts (example)", explanation: "Sample points awarded to each team when a match ends level." },
      { result: "Loss", points: "2 pts (example)", explanation: "Sample participation points for completing a match." },
      { result: "Bonus", points: "TBD (example only)", explanation: "Bonus scoring opportunities are examples awaiting organizer confirmation." },
    ],
  },
  matchRules: [
    { id: "starting-times", title: "Starting Times", body: "Be at your assigned starting point before your scheduled time. Check the Schedule page for any updates." },
    { id: "late-arrivals", title: "Late Arrivals", body: "Let your captain know as soon as possible. Organizers will guide how play proceeds." },
    { id: "tee-order", title: "Tee Order", body: "Tee order for each round is shared by organizers before play begins." },
    { id: "conceded-putts", title: "Conceded Putts", body: "Concessions follow the spirit of friendly play. The confirmed approach will be shared by organizers." },
    { id: "score-reporting", title: "Score Reporting", body: "Confirm scores with your group before they are reported to your captain." },
    { id: "substitutions", title: "Substitutions", body: "Roster changes are handled by captains together with organizers." },
    { id: "weather-delays", title: "Weather Delays", body: "Play pauses when organizers announce a hold. Watch the Schedule page for updates." },
    { id: "disputes", title: "Disputes & Rulings", body: "Raise questions calmly with your captain. Organizers make the final ruling." },
  ],
  conduct: [
    { title: "Sportsmanship", body: "Play hard, compete fairly, and keep the friendly spirit that defines this weekend." },
    { title: "Respect", body: "Treat fellow players, course staff, and volunteers with kindness and patience." },
    { title: "Safe Play", body: "Stay aware of other groups and look out for one another on the course." },
    { title: "Pace of Play", body: "Keep up with the group ahead and be ready when it is your turn." },
    { title: "Honest Scoring", body: "Report scores accurately — the integrity of the weekend depends on it." },
    { title: "The Spirit of the Event", body: "Remember why we gather: to honor Brandon through friendship, laughter, and community." },
  ],
  tiebreakers: {
    note: "The tie-breaker order below is an example awaiting organizer confirmation.",
    steps: [
      "Head-to-head result",
      "Final-round performance",
      "Organizer ruling",
    ],
  },
  faq: [
    { id: "faq-arrive", title: "What time should players arrive?", body: "Plan to arrive before your scheduled start. Arrival times are listed on the Schedule page." },
    { id: "faq-scores", title: "Where are scores submitted?", body: "Scores are confirmed with your group and reported through your captain. Standings appear on the Leaderboard page." },
    { id: "faq-dispute", title: "Who resolves a rules dispute?", body: "Bring any dispute to your captain first. Tournament organizers make the final ruling." },
    { id: "faq-weather", title: "What happens during a weather delay?", body: "Organizers announce holds and restarts. Updates are posted on the Schedule page." },
    { id: "faq-replacement", title: "Can a player be replaced?", body: "Roster changes are handled by captains together with tournament organizers." },
    { id: "faq-updates", title: "Where are schedule updates posted?", body: "The Schedule page always shows the latest times, locations, and event statuses." },
  ],
  unpublished: {
    title: "The official tournament rules are being finalized",
    body: "Please check back before tournament weekend.",
  },
};
