// Centralized tournament schedule data (Sprint 4).
// Schedule page, current-event highlight, and homepage preview all read from
// this file. Replace with API-fed data in a future sprint — layouts never change.

// Flip to false to see the unpublished-schedule empty state.
export const SCHEDULE_PUBLISHED = true;

export const DAYS = [
  { id: "friday", label: "Friday", tagline: "Draft Party" },
  { id: "saturday", label: "Saturday", tagline: "Tournament Round" },
  { id: "sunday", label: "Sunday", tagline: "Championship & Awards" },
];

const event = (id, time, sortKey, title, description, location, status, note = null, isCurrent = false) => ({
  id,
  time,
  sortKey,
  title,
  description,
  location,
  status,
  note,
  isCurrent,
});

export const SCHEDULE = {
  friday: [
    event("fri-1", "5:00 PM", "17:00", "Player Check-In", "Pick up your player pack and confirm your roster spot.", "Clubhouse", "completed"),
    event("fri-2", "6:30 PM", "18:30", "Welcome Gathering", "Drinks, appetizers, and a few words from the Dalleo family.", "Main Dining Room", "completed"),
    event("fri-3", "7:30 PM", "19:30", "Captain Announcements", "Meet this year's captains and hear the weekend format.", "Main Dining Room", "completed"),
    event("fri-4", "8:00 PM", "20:00", "Live Draft", "Captains draft their teams live in front of the whole clubhouse.", "Main Dining Room", "happening-now", "Picks are announced every two minutes.", true),
  ],
  saturday: [
    event("sat-1", "7:00 AM", "07:00", "Player Arrival", "Gates open. Coffee and breakfast sandwiches available.", "Clubhouse", "upcoming"),
    event("sat-2", "7:30 AM", "07:30", "Opening Remarks", "A short welcome and remembrance before play begins.", "First Tee", "upcoming"),
    event("sat-3", "8:00 AM", "08:00", "First Tee Time", "Round 1 begins. Groups tee off in ten-minute intervals.", "First Tee", "upcoming"),
    event("sat-4", "12:30 PM", "12:30", "Lunch", "Buffet lunch for all players and guests.", "Main Dining Room", "updated", "Now served in the Main Dining Room."),
    event("sat-5", "1:30 PM", "13:30", "Afternoon Matches", "Round 2 matches begin after lunch.", "First Tee", "delayed", "Weather hold — expected to start by 2:00 PM."),
    event("sat-6", "6:30 PM", "18:30", "Evening Gathering", "Recap the day, raffle prizes, and the leaderboard reveal.", "Clubhouse", "upcoming"),
  ],
  sunday: [
    event("sun-1", "7:30 AM", "07:30", "Player Arrival", "Gates open for championship Sunday.", "Clubhouse", "upcoming"),
    event("sun-2", "8:00 AM", "08:00", "Championship Round", "The final round to decide the 8th Annual Dalleo Open.", "First Tee", "upcoming"),
    event("sun-3", "12:30 PM", "12:30", "Score Verification", "Captains confirm final scores with tournament officials.", "Clubhouse", "upcoming"),
    event("sun-4", "1:00 PM", "13:00", "Awards Ceremony", "Trophy presentation and this year's honors.", "Awards Area", "upcoming"),
    event("sun-5", "1:30 PM", "13:30", "Closing Celebration", "Raise a glass to Brandon and another unforgettable weekend.", "Awards Area", "upcoming"),
  ],
};

// Mock stand-in for "the event happening right now". Later this can be
// computed from start times without touching any component.
export const getCurrentEvent = () => {
  for (const day of DAYS) {
    const found = SCHEDULE[day.id].find((e) => e.isCurrent);
    if (found) return { day, event: found };
  }
  return null;
};
