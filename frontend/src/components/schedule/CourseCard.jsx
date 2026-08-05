import { Link } from "react-router-dom";
import { ArrowRight, Flag } from "lucide-react";
import { COURSE } from "@/data/course";
import { useLiveData } from "@/data/useLiveData";

// "The Course" card on the Schedule page — links to the full Course page.
export const CourseCard = () => {
  const live = useLiveData("course");
  const doc = live ?? COURSE;
  if (!doc.published) return null;

  return (
    <section data-testid="schedule-course-card" aria-labelledby="schedule-course-title">
      <Link
        to="/course"
        data-testid="schedule-course-link"
        className="group flex items-center gap-5 rounded-3xl bg-forest p-7 shadow-md ring-1 ring-gold/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:p-8"
      >
        <span aria-hidden="true" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gold/15 text-gold">
          <Flag className="h-7 w-7" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">The Course</p>
          <h2 id="schedule-course-title" className="mt-1.5 font-display text-2xl font-semibold text-cream sm:text-3xl">
            {doc.name}
          </h2>
          {doc.label && <p className="mt-1 truncate text-sm font-semibold text-cream/60">{doc.label}</p>}
        </div>
        <span className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-extrabold text-forest-deep transition-colors duration-200 group-hover:bg-gold-soft">
          Course Info
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </Link>
    </section>
  );
};
