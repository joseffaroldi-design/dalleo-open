export const RuleSection = ({ id, title, testId, children }) => (
  <section
    id={id}
    data-testid={testId}
    aria-labelledby={`${id}-title`}
    className="scroll-mt-24"
  >
    <h2
      id={`${id}-title`}
      className="text-base font-bold uppercase tracking-[0.2em] text-gold-deep md:text-lg"
    >
      {title}
    </h2>
    <div className="mt-6">{children}</div>
  </section>
);
