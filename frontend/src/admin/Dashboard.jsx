import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminFetch, fetchPublic } from "@/lib/api";
import { TEAMS } from "@/data/teams";
import { SCHEDULE, DAYS } from "@/data/schedule";
import { GALLERY_ITEMS } from "@/data/gallery";
import { STATUS_LABELS, computeStandings } from "@/data/scoring";

const LINKS = [
  { to: "/admin/announcements", label: "Announcements", testId: "dash-link-announcements" },
  { to: "/admin/scoring", label: "Scoring", testId: "dash-link-scoring" },
  { to: "/admin/course", label: "Course", testId: "dash-link-course" },
  { to: "/admin/committee", label: "Committee", testId: "dash-link-committee" },
  { to: "/admin/champions", label: "Champions", testId: "dash-link-champions" },
  { to: "/admin/teams", label: "Teams", testId: "dash-link-teams" },
  { to: "/admin/schedule", label: "Schedule", testId: "dash-link-schedule" },
  { to: "/admin/gallery", label: "Gallery", testId: "dash-link-gallery" },
  { to: "/admin/content", label: "Site Content", testId: "dash-link-content" },
  { to: "/admin/rules", label: "Rules", testId: "dash-link-rules" },
];

const Stat = ({ label, value, testId }) => (
  <div data-testid={testId} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-border">
    <p className="text-xs font-bold uppercase tracking-widest text-charcoal/40">{label}</p>
    <p className="mt-2 text-lg font-extrabold tracking-tight text-forest sm:text-xl">{value}</p>
  </div>
);

const ActivityStat = ({ label, value, live = false }) => (
  <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-border sm:p-5">
    <div className="flex items-center gap-2">
      {live ? <span className="h-2 w-2 rounded-full bg-gold" aria-hidden="true" /> : null}
      <p className="text-[11px] font-bold uppercase tracking-widest text-charcoal/45">{label}</p>
    </div>
    <p className="mt-2 text-2xl font-extrabold tracking-tight text-forest sm:text-3xl">{value ?? 0}</p>
  </div>
);

const pageLabel = (path) => {
  if (!path || path === "/") return "Home";
  const clean = path.split("?")[0].replace(/^\//, "").replace(/\/$/, "");
  if (!clean) return "Home";
  return clean
    .split("/")
    .filter(Boolean)
    .map((part) => part.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()))
    .join(" / ");
};

function SiteActivity({ data, error }) {
  return (
    <section className="mt-10" aria-labelledby="site-activity-heading">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="site-activity-heading" className="text-base font-bold uppercase tracking-[0.2em] text-gold-deep">
            Site Activity
          </h2>
          <p className="mt-1 text-sm text-charcoal/55">A quick read-only snapshot from Google Analytics.</p>
        </div>
        {data?.generatedAt ? (
          <p className="text-xs font-semibold text-charcoal/40">Refreshes automatically</p>
        ) : null}
      </div>

      {data ? (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <ActivityStat label="Live Now" value={data.liveNow} live />
            <ActivityStat label="Visitors Today" value={data.visitorsToday} />
            <ActivityStat label="Page Views Today" value={data.pageViewsToday} />
            <ActivityStat label="Leaderboard Views" value={data.events?.leaderboardViews} />
            <ActivityStat label="Captain Logins" value={data.events?.captainLogins} />
            <ActivityStat label="Scores Submitted" value={data.events?.scoresSubmitted} />
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-border">
            <div className="border-b border-border px-5 py-4">
              <h3 className="text-sm font-extrabold text-forest">Top Pages Today</h3>
            </div>
            {data.topPages?.length ? (
              <div className="divide-y divide-border">
                {data.topPages.map((page) => (
                  <div key={page.path} className="flex items-center justify-between gap-4 px-5 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-charcoal">{pageLabel(page.path)}</p>
                      <p className="truncate text-xs text-charcoal/40">{page.path}</p>
                    </div>
                    <p className="shrink-0 text-sm font-extrabold text-forest">{page.views} views</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="px-5 py-5 text-sm font-semibold text-charcoal/45">No page views recorded yet today.</p>
            )}
          </div>
        </>
      ) : error ? (
        <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-border">
          <p className="text-sm font-bold text-forest">Site Activity is not available yet.</p>
          <p className="mt-1 text-sm text-charcoal/55">{error} Your existing website tracking is unaffected.</p>
        </div>
      ) : (
        <p className="mt-4 text-sm font-semibold text-charcoal/50">Loading site activity…</p>
      )}
    </section>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState(null);
  const [activityError, setActivityError] = useState("");

  useEffect(() => {
    Promise.all(["announcements", "scoring", "teams", "schedule", "gallery"].map(fetchPublic))
      .then(([announcements, scoring, teams, schedule, gallery]) => {
        const teamList = teams?.items ?? TEAMS;
        const standings = scoring ? computeStandings(scoring, teamList) : [];
        const top = standings.find((r) => r.position === 1);
        const leader = scoring && scoring.status !== "not-started" && top ? top.team.name : "Not started";
        const events = schedule?.events ?? DAYS.flatMap((d) => SCHEDULE[d.id]);
        const galleryItems = gallery?.items ?? GALLERY_ITEMS;
        const announcementsList = announcements?.items?.filter((a) => a.published) ?? [];
        setStats({
          status: STATUS_LABELS[scoring?.status] ?? "Not Started",
          leader,
          teams: teamList.length,
          events: events.length,
          gallery: galleryItems.length,
          announcement: announcementsList[0]?.title ?? "None published",
        });
      })
      .catch(() => setStats(null));
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadActivity = async () => {
      try {
        const response = await adminFetch("/admin/analytics/summary");
        if (!mounted) return;
        setActivity(response.data ?? null);
        setActivityError("");
      } catch (err) {
        if (!mounted) return;
        setActivity(null);
        setActivityError(err?.message || "Google Analytics reporting is temporarily unavailable.");
      }
    };

    loadActivity();
    const interval = window.setInterval(loadActivity, 90000);
    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <div data-testid="admin-dashboard">
      <h1 className="text-2xl font-extrabold tracking-tight text-forest sm:text-3xl">Dashboard</h1>
      <p className="mt-1 text-sm text-charcoal/60">Tournament weekend at a glance.</p>
      {stats ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Stat label="Tournament Status" value={stats.status} testId="stat-status" />
          <Stat label="Leading Team" value={stats.leader} testId="stat-leader" />
          <Stat label="Teams" value={stats.teams} testId="stat-teams" />
          <Stat label="Scheduled Events" value={stats.events} testId="stat-events" />
          <Stat label="Gallery Items" value={stats.gallery} testId="stat-gallery" />
          <Stat label="Latest Announcement" value={stats.announcement} testId="stat-announcement" />
        </div>
      ) : (
        <p className="mt-8 text-sm font-semibold text-charcoal/50">Loading stats…</p>
      )}

      <SiteActivity data={activity} error={activityError} />

      <h2 className="mt-10 text-base font-bold uppercase tracking-[0.2em] text-gold-deep">Quick Links</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {LINKS.map(({ to, label, testId }) => (
          <Link
            key={to}
            to={to}
            data-testid={testId}
            className="flex min-h-16 items-center justify-center rounded-2xl bg-forest px-4 py-4 text-center text-sm font-extrabold text-cream shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-soft hover:shadow-md"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
