import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPublic } from "@/lib/api";
import { TEAMS } from "@/data/teams";
import { SCHEDULE, DAYS } from "@/data/schedule";
import { GALLERY_ITEMS } from "@/data/gallery";
import { LEADERBOARD } from "@/data/leaderboard";

const LINKS = [
  { to: "/admin/announcements", label: "Announcements", testId: "dash-link-announcements" },
  { to: "/admin/leaderboard", label: "Leaderboard", testId: "dash-link-leaderboard" },
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

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all(["announcements", "leaderboard", "teams", "schedule", "gallery"].map(fetchPublic))
      .then(([announcements, leaderboard, teams, schedule, gallery]) => {
        const teamList = teams?.items ?? TEAMS;
        const lbStandings = leaderboard?.standings ?? LEADERBOARD.overall.standings;
        const byId = Object.fromEntries(teamList.map((t) => [t.id, t]));
        const byColor = Object.fromEntries(teamList.map((t) => [t.colorKey, t]));
        const started = lbStandings.filter((s) => s.points !== null && s.points !== undefined);
        const top = started.length ? [...started].sort((a, b) => b.points - a.points)[0] : null;
        const topTeam = top ? byId[top.teamId] ?? byColor[top.colorKey] : null;
        const leader = topTeam?.name ?? "Not started";
        const events = schedule?.events ?? DAYS.flatMap((d) => SCHEDULE[d.id]);
        const galleryItems = gallery?.items ?? GALLERY_ITEMS;
        const announcementsList = announcements?.items?.filter((a) => a.published) ?? [];
        setStats({
          status: leaderboard?.statusLabel ?? LEADERBOARD.overall.meta.statusLabel,
          leader,
          teams: teamList.length,
          events: events.length,
          gallery: galleryItems.length,
          announcement: announcementsList[0]?.title ?? "None published",
        });
      })
      .catch(() => setStats(null));
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
