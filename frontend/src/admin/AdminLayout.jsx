import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import { adminFetch, getToken, clearToken } from "@/lib/api";

const SECTIONS = [
  { to: "/admin", label: "Dashboard", end: true, testId: "admin-nav-dashboard" },
  { to: "/admin/announcements", label: "Announcements", testId: "admin-nav-announcements" },
  { to: "/admin/leaderboard", label: "Leaderboard", testId: "admin-nav-leaderboard" },
  { to: "/admin/champions", label: "Champions", testId: "admin-nav-champions" },
  { to: "/admin/teams", label: "Teams", testId: "admin-nav-teams" },
  { to: "/admin/schedule", label: "Schedule", testId: "admin-nav-schedule" },
  { to: "/admin/gallery", label: "Gallery", testId: "admin-nav-gallery" },
  { to: "/admin/content", label: "Site Content", testId: "admin-nav-content" },
  { to: "/admin/rules", label: "Rules", testId: "admin-nav-rules" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!getToken()) {
      navigate("/admin/login", { replace: true });
      return;
    }
    adminFetch("/auth/me").then(setUser).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = async () => {
    try {
      await adminFetch("/auth/logout", { method: "POST" });
    } catch {}
    clearToken();
    navigate("/admin/login", { replace: true });
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <p className="text-sm font-semibold text-charcoal/50">Checking session…</p>
      </div>
    );
  }

  return (
    <div data-testid="admin-layout" className="min-h-screen bg-cream">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-forest">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/admin" data-testid="admin-home-link" className="text-lg font-extrabold tracking-tight text-cream">
            Dalleo Open <span className="text-gold">Organizer</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs font-semibold text-cream/60 sm:block">{user.email}</span>
            <Link
              to="/"
              data-testid="admin-view-site-link"
              className="rounded-full bg-cream/10 px-4 py-2 text-xs font-bold text-cream transition-colors duration-200 hover:bg-cream/20"
            >
              View Site
            </Link>
            <button
              type="button"
              data-testid="admin-logout-button"
              onClick={logout}
              className="inline-flex min-h-10 items-center gap-2 rounded-full bg-gold px-4 py-2 text-xs font-extrabold text-forest-deep transition-colors duration-200 hover:bg-gold-soft"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Logout
            </button>
          </div>
        </div>
        <nav aria-label="Admin sections" className="border-t border-cream/10">
          <div className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 py-2 sm:px-6">
            {SECTIONS.map(({ to, label, end, testId }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                data-testid={testId}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition-colors duration-200 ${
                    isActive ? "bg-gold text-forest-deep" : "text-cream/70 hover:bg-cream/10 hover:text-cream"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
