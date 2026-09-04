import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, RotateCcw } from "lucide-react";

const STORAGE_KEY = "dalleo_gameday_checklist";

const SECTIONS = [
  {
    title: "Night Before — Ten Quiet Minutes",
    items: [
      { id: "pins", text: "All 8 captain PINs shared privately with each captain", link: { to: "/admin/scoring", label: "Scoring → Team PINs" } },
      { id: "rehearsal", text: "Rehearsal: Scoring status → Test, one captain enters one practice score, watch it land on the leaderboard", link: { to: "/admin/scoring", label: "Scoring admin" } },
      { id: "rehearsal-reset", text: "One tap: Clear test scores & return to Not Started" },
      { id: "charged", text: "Organizer phone charged (bring the battery pack) + logged in at /admin" },
    ],
  },
  {
    title: "7:30 AM — Arrive at LA Tour",
    items: [
      { id: "smoke-test", text: "Smoke test: one captain opens dalleoopen.com/score, picks their team, enters their PIN — scorecard opens on their starting hole", link: { to: "/score", label: "Open /score" } },
      { id: "pin-lookup", text: "Forgot a PIN? They're all in Scoring → Team PINs", link: { to: "/admin/scoring", label: "Scoring → Team PINs" } },
      { id: "schedule-check", text: "Public Schedule shows the right times and pairings", link: { to: "/schedule", label: "View Schedule" } },
    ],
  },
  {
    title: "7:55 AM — The One Switch",
    items: [
      { id: "go-live", text: "Scoring status → Live + Save Changes", link: { to: "/admin/scoring", label: "Scoring admin" } },
      { id: "verify-live", text: "Leaderboard has taken over the homepage and shows Live standings", link: { to: "/", label: "View Homepage" } },
    ],
  },
  {
    title: "8:00 AM — Shotgun Start · During the Round",
    items: [
      { id: "first-scores", text: "First captain scores coming in after opening holes" },
      { id: "matrix", text: "Watch the progress matrix for missing scores", link: { to: "/admin/scoring", label: "Scoring admin" } },
      { id: "corrections", text: "Phone trouble? You can enter or fix any team's score yourself (overwrite confirms first)" },
    ],
  },
  {
    title: "Last Card In — Crown the Champion",
    items: [
      { id: "complete-cards", text: "Every team shows 18/18 holes in the progress matrix" },
      { id: "final", text: "Scoring status → Final + Save Changes — standings lock, winner crowned" },
      { id: "champion", text: "Pull up the leaderboard for the announcement", link: { to: "/leaderboard", label: "View Leaderboard" } },
      { id: "record", text: "Save a screenshot of the final standings" },
    ],
  },
  {
    title: "This Week — Write the 7th Chapter",
    items: [
      { id: "trophy", text: "Add the 2026 winner to the Trophy Wall with a photo and a line about the day", link: { to: "/admin/champions", label: "Champions admin" } },
      { id: "gallery", text: "Upload the day's photos and videos to the Gallery", link: { to: "/admin/gallery", label: "Gallery admin" } },
      { id: "results-post", text: "Post a results announcement (rolls to the homepage)", link: { to: "/admin/announcements", label: "Announcements admin" } },
      { id: "analytics", text: "Check GA4 — see how many people followed along" },
    ],
  },
];

export default function GameDayAdmin() {
  const [done, setDone] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
  }, [done]);

  const toggle = (id) => setDone((d) => ({ ...d, [id]: !d[id] }));
  const total = SECTIONS.flatMap((s) => s.items).length;
  const completed = Object.values(done).filter(Boolean).length;

  return (
    <div data-testid="gameday-checklist">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-forest sm:text-3xl">Game Day Checklist</h1>
          <p className="mt-1 text-sm text-charcoal/60">
            Saturday, September 5, 2026 — LA Tour · Shotgun start 8:00 AM · tap items as you complete them. Progress saves on this phone.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span data-testid="checklist-progress" className="rounded-full bg-forest px-4 py-1.5 text-sm font-extrabold text-gold">
            {completed}/{total}
          </span>
          <button
            type="button"
            data-testid="checklist-reset"
            onClick={() => setDone({})}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-charcoal/10 px-4 py-2 text-xs font-bold text-charcoal transition-colors duration-200 hover:bg-charcoal/15"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-6">
        {SECTIONS.map((section) => (
          <section
            key={section.title}
            data-testid={`checklist-section-${section.title.split(" ")[0].toLowerCase()}`}
            aria-label={section.title}
            className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-border sm:p-7"
          >
            <h2 className="text-base font-extrabold tracking-tight text-forest">{section.title}</h2>
            <ul className="mt-4 flex flex-col gap-2">
              {section.items.map((item) => {
                const checked = !!done[item.id];
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      data-testid={`checklist-item-${item.id}`}
                      aria-pressed={checked}
                      onClick={() => toggle(item.id)}
                      className={`flex min-h-14 w-full items-start gap-3.5 rounded-2xl border px-4 py-3.5 text-left transition-colors duration-200 ${
                        checked ? "border-forest/30 bg-forest-mist" : "border-border bg-cream hover:border-forest/30"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
                          checked ? "bg-forest text-gold" : "bg-white ring-2 ring-charcoal/20"
                        }`}
                      >
                        {checked && <Check className="h-4 w-4" />}
                      </span>
                      <span className="flex-1">
                        <span className={`block text-sm font-bold sm:text-base ${checked ? "text-forest line-through opacity-70" : "text-charcoal"}`}>
                          {item.text}
                        </span>
                        {item.link && (
                          <Link
                            to={item.link.to}
                            data-testid={`checklist-link-${item.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="mt-1 inline-block text-xs font-extrabold text-gold-deep underline underline-offset-2"
                          >
                            {item.link.label} →
                          </Link>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
