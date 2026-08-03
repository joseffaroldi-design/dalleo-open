import { Link } from "react-router-dom";

export const Logo = ({ light = false }) => (
  <Link
    to="/"
    data-testid="logo-home-link"
    aria-label="Dalleo Open — back to Home"
    className="inline-flex items-center gap-3 rounded-lg"
  >
    <span
      aria-hidden="true"
      className="flex h-10 w-10 items-center justify-center rounded-full bg-forest text-sm font-extrabold tracking-tight text-gold ring-2 ring-gold/70"
    >
      DO
    </span>
    <span
      className={`text-lg font-extrabold tracking-tight ${
        light ? "text-cream" : "text-forest"
      }`}
    >
      Dalleo Open
    </span>
  </Link>
);
