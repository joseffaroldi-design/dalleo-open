import { Link } from "react-router-dom";

export const StorySection = ({ paragraphs }) => (
  <section
    data-testid="memorial-story"
    aria-labelledby="story-title"
    className="mx-auto max-w-2xl px-4 py-20 sm:px-6 sm:py-28"
  >
    <h2
      id="story-title"
      className="text-base font-bold uppercase tracking-[0.2em] text-gold-deep md:text-lg"
    >
      Brandon&rsquo;s Story
    </h2>
    <div className="mt-8 space-y-6">
      {paragraphs.map((text, i) => (
        <p
          key={i}
          data-testid={`story-paragraph-${i + 1}`}
          className="text-lg leading-relaxed text-charcoal/80 sm:text-xl"
        >
          {text}
        </p>
      ))}
    </div>
  </section>
);

export const ValuesSection = ({ values }) => (
  <section
    data-testid="values-section"
    aria-labelledby="values-title"
    className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28"
  >
    <h2
      id="values-title"
      className="text-base font-bold uppercase tracking-[0.2em] text-gold-deep md:text-lg"
    >
      Why the Dalleo Open Exists
    </h2>
    <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
      {values.map((value) => (
        <div
          key={value.id}
          data-testid={`value-${value.id}`}
          className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-border sm:p-8"
        >
          <span aria-hidden="true" className="block h-1.5 w-8 rounded-full bg-gold" />
          <h3 className="mt-5 text-xl font-extrabold tracking-tight text-forest">
            {value.title}
          </h3>
          <p className="mt-2 text-base leading-relaxed text-charcoal/60">
            {value.sentence}
          </p>
        </div>
      ))}
    </div>
  </section>
);

export const TraditionTimeline = ({ milestones }) => (
  <section
    data-testid="tradition-timeline"
    aria-labelledby="tradition-title"
    className="mx-auto max-w-2xl px-4 py-20 sm:px-6 sm:py-28"
  >
    <h2
      id="tradition-title"
      className="text-base font-bold uppercase tracking-[0.2em] text-gold-deep md:text-lg"
    >
      The Tradition Continues
    </h2>
    <ol className="mt-10 space-y-10 border-l-2 border-forest/15 pl-8">
      {milestones.map((milestone, i) => (
        <li key={milestone.id} data-testid={`milestone-${i + 1}`} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-[41px] top-1.5 h-4 w-4 rounded-full border-2 border-gold bg-cream"
          />
          <h3 className="text-lg font-extrabold tracking-tight text-charcoal sm:text-xl">
            {milestone.title}
          </h3>
          <p className="mt-1.5 text-base leading-relaxed text-charcoal/60">
            {milestone.description}
          </p>
        </li>
      ))}
    </ol>
  </section>
);

export const ClosingSection = ({ message }) => (
  <section
    data-testid="closing-section"
    aria-labelledby="closing-title"
    className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 sm:py-28"
  >
    <h2 id="closing-title" className="sr-only">
      Closing message
    </h2>
    <p
      data-testid="closing-message"
      className="text-2xl font-extrabold leading-snug tracking-tight text-forest sm:text-3xl"
    >
      {message}
    </p>
    <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
      <Link
        to="/gallery"
        data-testid="closing-gallery-link"
        className="inline-flex min-h-12 items-center rounded-full bg-forest px-7 py-3 text-base font-bold text-cream shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-soft hover:shadow-md"
      >
        Visit the Gallery
      </Link>
      <Link
        to="/schedule"
        data-testid="closing-schedule-link"
        className="inline-flex min-h-12 items-center rounded-full bg-white px-7 py-3 text-base font-bold text-forest shadow-sm ring-1 ring-border transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-mist hover:shadow-md"
      >
        Tournament Schedule
      </Link>
      <Link
        to="/"
        data-testid="closing-home-link"
        className="inline-flex min-h-12 items-center rounded-full px-6 py-3 text-base font-bold text-charcoal/60 transition-colors duration-200 hover:text-forest"
      >
        Back to Home
      </Link>
    </div>
  </section>
);
