import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import { Logo } from "@/components/Logo";
import { NAV_LINKS } from "@/constants/nav";
import { useLiveData } from "@/data/useLiveData";

export const Footer = () => {
  const site = useLiveData("site");
  return (
  <footer data-testid="site-footer" className="bg-forest-deep text-cream/80">
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="space-y-4">
          <Logo light />
          <p className="max-w-xs text-sm leading-relaxed text-cream/60">
            An annual golf tournament held in memory of Brandon Dalleo.
          </p>
          <a
            href={site?.instagramUrl ?? "https://www.instagram.com/"}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="footer-instagram-link"
            aria-label="Dalleo Open on Instagram"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-cream/10 text-gold transition-colors duration-200 hover:bg-gold hover:text-forest-deep"
          >
            <Instagram className="h-5 w-5" />
          </a>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-3 sm:grid-cols-3">
          {NAV_LINKS.map(({ to, label, testId }) => (
            <Link
              key={to}
              to={to}
              data-testid={`footer-${testId}`}
              className="rounded-md py-1 text-sm font-semibold text-cream/70 transition-colors duration-200 hover:text-gold"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-12 border-t border-cream/10 pt-6 text-center text-xs text-cream/50 sm:text-left">
        <p data-testid="footer-copyright">
          &copy; {new Date().getFullYear()} Dalleo Open. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
  );
};
