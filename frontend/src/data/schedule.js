// Archived schedule for the completed 7th Annual Dalleo Open.
export const SCHEDULE_PUBLISHED = true;

export const TOURNAMENT_DAYS = {
  friday: "2026-09-04",
  saturday: "2026-09-05",
};

export const TOURNAMENT_DATES_TEXT = "September 4–5, 2026 · Completed";

export const STATUS_LABELS = {
  upcoming: "Upcoming",
  "happening-now": "Current",
  completed: "Complete",
  delayed: "Delayed",
  updated: "Updated",
};

export const eventStart = (event) =>
  new Date(`${TOURNAMENT_DAYS[event.day]}T${event.sortKey}:00`);

export const getAutoStatus = () => "completed";
export const getNextEvents = () => [];

export const DAYS = [
  { id: "friday", label: "Friday", tagline: "Draft Party · Complete" },
  { id: "saturday", label: "Saturday", tagline: "Tournament Round · Complete" },
];

const event = (id, time, sortKey, title, description, location, status = "completed", note = null) => ({
  id,
  time,
  sortKey,
  title,
  description,
  location,
  status,
  note,
  isCurrent: false,
});

export const SCHEDULE = {
  friday: [
    event(
      "fri-draft",
      "Evening",
      "18:00",
      "Dalleo Open Draft Party",
      "The 2026 captains and teams came together for the tournament-eve draft.",
      "Draft Party",
      "completed"
    ),
  ],
  saturday: [
    event(
      "sat-round",
      "8:00 AM",
      "08:00",
      "7th Annual Dalleo Open",
      "Eight teams played one 18-hole four-person scramble. Team Martin finished at 69 (−3) to win by two strokes.",
      "LA Tour",
      "completed",
      "Final — 144 of 144 team-hole scores captured."
    ),
  ],
};

export const getCurrentEvent = () => null;
