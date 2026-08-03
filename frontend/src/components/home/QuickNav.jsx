import { Link } from "react-router-dom";
import {
  Trophy,
  Users,
  CalendarDays,
  Images,
  Heart,
  ScrollText,
  ArrowRight,
} from "lucide-react";

const CARDS = [
  {
    to: "/leaderboard",
    icon: Trophy,
    title: "Live Leaderboard",
    description: "Follow the scoring as the tournament unfolds.",
    testId: "quick-nav-leaderboard",
  },
  {
    to: "/teams",
    icon: Users,
    title: "Teams",
    description: "See who's teeing it up this year.",
    testId: "quick-nav-teams",
  },
  {
    to: "/schedule",
    icon: CalendarDays,
    title: "Schedule",
    description: "Tee times, events, and weekend details.",
    testId: "quick-nav-schedule",
  },
  {
    to: "/gallery",
    icon: Images,
    title: "Gallery",
    description: "Photos and memories from past years.",
    testId: "quick-nav-gallery",
  },
  {
    to: "/brandon",
    icon: Heart,
    title: "Brandon",
    description: "The story behind the Dalleo Open.",
    testId: "quick-nav-brandon",
  },
  {
    to: "/rules",
    icon: ScrollText,
    title: "Rules",
    description: "Format, scoring, and how we play.",
    testId: "quick-nav-rules",
  },
];

export const QuickNav = () => (
  <section
    data-testid="quick-nav-section"
    aria-labelledby="quick-nav-title"
    className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28"
  >
    <h2
      id="quick-nav-title"
      className="text-base font-bold uppercase tracking-[0.2em] text-gold-deep md:text-lg"
    >
      Explore the Clubhouse
    </h2>
    <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {CARDS.map(({ to, icon: Icon, title, description, testId }) => (
        <Link
          key={to}
          to={to}
          data-testid={testId}
          className="group flex flex-col rounded-3xl border border-border bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-gold/50 hover:shadow-lg active:translate-y-0 sm:p-8"
        >
          <span
            aria-hidden="true"
            className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-mist text-forest transition-colors duration-200 group-hover:bg-forest group-hover:text-gold"
          >
            <Icon className="h-7 w-7" />
          </span>
          <span className="text-xl font-extrabold tracking-tight text-charcoal">
            {title}
          </span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-charcoal/60">
            {description}
          </span>
          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-forest transition-colors duration-200 group-hover:text-gold-deep">
            Open
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </span>
        </Link>
      ))}
    </div>
  </section>
);
