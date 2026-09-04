import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const PlaceholderPage = ({ title, description, icon: Icon, testId }) => (
  <section
    data-testid={testId}
    aria-labelledby={`${testId}-title`}
    className="mx-auto flex min-h-[62vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6"
  >
    <span
      aria-hidden="true"
      className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-forest-mist text-forest"
    >
      <Icon className="h-9 w-9" />
    </span>
    <h1
      id={`${testId}-title`}
      data-testid={`${testId}-title`}
      className="text-4xl font-extrabold tracking-tight text-forest sm:text-5xl"
    >
      {title}
    </h1>
    <span
      data-testid={`${testId}-coming-soon`}
      className="mt-5 inline-block rounded-full bg-gold/15 px-5 py-1.5 text-sm font-bold uppercase tracking-widest text-gold-deep"
    >
      Coming Soon
    </span>
    <p className="mt-6 max-w-md text-base leading-relaxed text-charcoal/70">
      {description}
    </p>
    <Link
      to="/"
      data-testid={`${testId}-back-home`}
      className="mt-10 inline-flex min-h-12 items-center gap-2 rounded-full bg-forest px-7 py-3 text-base font-bold text-cream shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-soft hover:shadow-md"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      Back to Home
    </Link>
  </section>
);
