import { COMMITTEE } from "@/data/committee";
import { getInitials } from "@/data/teams";

const MemberCard = ({ member, index }) => (
  <article
    data-testid={`member-card-${index + 1}`}
    className="flex flex-col rounded-3xl bg-white p-7 shadow-sm ring-1 ring-border transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
  >
    <div className="flex items-center gap-4">
      <span
        data-testid={`member-avatar-${index + 1}`}
        role="img"
        aria-label={`Photo of ${member.name} — coming soon`}
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-forest text-base font-extrabold text-gold ring-2 ring-gold/60"
      >
        {getInitials(member.name)}
      </span>
      <h2 className="text-xl font-extrabold tracking-tight text-charcoal">
        {member.name}
      </h2>
    </div>
    <ul className="mt-5 flex flex-col gap-2">
      {member.titles.map((title) => (
        <li
          key={title}
          data-testid={`member-title-${index + 1}`}
          className="flex items-start gap-2.5 text-sm font-bold text-forest sm:text-base"
        >
          <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
          {title}
        </li>
      ))}
    </ul>
    {member.years && (
      <p className="mt-4 text-xs font-bold uppercase tracking-widest text-charcoal/40">
        {member.years}
      </p>
    )}
    {member.bio && <p className="mt-3 text-sm leading-relaxed text-charcoal/60">{member.bio}</p>}
    {member.memory && (
      <p className="mt-3 rounded-xl bg-forest-mist px-4 py-2.5 text-sm font-semibold italic text-charcoal/70">
        &ldquo;{member.memory}&rdquo;
      </p>
    )}
  </article>
);

export default function Committee() {
  return (
    <div data-testid="committee-page" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-forest sm:text-5xl">
          {COMMITTEE.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-charcoal/60 sm:text-lg">
          {COMMITTEE.intro}
        </p>
      </header>
      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {COMMITTEE.members.map((member, i) => (
          <MemberCard key={member.name} member={member} index={i} />
        ))}
      </div>
    </div>
  );
}
