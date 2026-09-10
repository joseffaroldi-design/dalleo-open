import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { NAV_LINKS } from "@/constants/nav";

const linkClass = ({ isActive }) =>
  `rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-200 ${
    isActive
      ? "bg-forest text-cream"
      : "text-charcoal/80 hover:bg-forest-mist hover:text-forest"
  }`;

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      data-testid="site-header"
      className="sticky top-0 z-50 border-b border-border/70 bg-cream/90 backdrop-blur-md"
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 md:h-20"
      >
        <Logo />
        <div className="hidden items-center gap-1 md:flex" data-testid="desktop-nav">
          {NAV_LINKS.map(({ to, label, testId }) => (
            <NavLink key={to} to={to} data-testid={testId} className={linkClass}>
              {label}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            data-testid="mobile-menu-button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-forest transition-colors duration-200 hover:bg-forest-mist"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>
      {open && (
        <div
          id="mobile-nav"
          data-testid="mobile-nav"
          className="border-t border-border/70 bg-cream px-4 pb-6 pt-3 md:hidden"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map(({ to, label, testId }) => (
              <NavLink
                key={to}
                to={to}
                data-testid={`${testId}-mobile`}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-base font-semibold transition-colors duration-200 ${
                    isActive
                      ? "bg-forest text-cream"
                      : "text-charcoal/80 hover:bg-forest-mist hover:text-forest"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
