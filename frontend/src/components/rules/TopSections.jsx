import { Info, CheckCircle2 } from "lucide-react";

export const DraftNotice = ({ text }) => (
  <div
    data-testid="draft-notice"
    role="status"
    className="flex items-start gap-3 rounded-2xl bg-gold/15 p-5 ring-1 ring-gold/40"
  >
    <Info className="mt-0.5 h-5 w-5 shrink-0 text-gold-deep" aria-hidden="true" />
    <p className="text-sm font-semibold leading-relaxed text-gold-deep sm:text-base">
      {text}
    </p>
  </div>
);

export const QuickReminders = ({ items }) => (
  <section
    data-testid="quick-reminders"
    aria-labelledby="quick-reminders-title"
    className="rounded-3xl bg-forest p-7 shadow-md sm:p-9"
  >
    <h2
      id="quick-reminders-title"
      className="text-sm font-bold uppercase tracking-[0.2em] text-gold"
    >
      Quick Reminders
    </h2>
    <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((reminder, i) => (
        <li
          key={reminder}
          data-testid={`reminder-${i + 1}`}
          className="flex items-center gap-3 rounded-2xl bg-forest-deep/60 px-4 py-3 ring-1 ring-cream/10"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
          <span className="text-sm font-bold text-cream sm:text-base">{reminder}</span>
        </li>
      ))}
    </ul>
  </section>
);

export const SectionNav = ({ links }) => (
  <nav
    data-testid="section-nav"
    aria-label="Rules sections"
    className="flex flex-wrap gap-2"
  >
    {links.map(({ id, label }) => (
      <a
        key={id}
        href={`#${id}`}
        data-testid={`nav-link-${id}`}
        className="inline-flex min-h-11 items-center rounded-full bg-white px-5 py-2.5 text-sm font-extrabold text-charcoal/70 shadow-sm ring-1 ring-border transition-colors duration-200 hover:bg-forest-mist hover:text-forest sm:text-base"
      >
        {label}
      </a>
    ))}
  </nav>
);
