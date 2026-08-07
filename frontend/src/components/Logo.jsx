import { Link } from "react-router-dom";

export const Logo = ({ light = false }) => (
  <Link
    to="/"
    data-testid="logo-home-link"
    aria-label="Dalleo Open — back to Home"
    className="inline-flex items-center gap-3 rounded-lg"
  >
    <img
      src="/dalleo-flag-mark.png"
      alt=""
      aria-hidden="true"
      className="h-9 w-9 shrink-0 rounded-full bg-cream object-contain p-1 ring-2 ring-gold/70"
    />
    <span
      className={`text-lg font-extrabold tracking-tight ${
        light ? "text-cream" : "text-forest"
      }`}
    >
      Dalleo Open
    </span>
  </Link>
);
