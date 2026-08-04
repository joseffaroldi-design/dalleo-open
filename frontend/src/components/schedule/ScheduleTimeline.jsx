import { MapPin } from "lucide-react";
import { StatusChip } from "@/components/leaderboard/StatusChip";

const TimeBlock = ({ time }) => {
  const [clock, meridiem] = time.split(" ");
  return (
    <div className="w-14 shrink-0 text-right sm:w-20" aria-label={`Starts at ${time}`}>
      <p className="text-lg font-extrabold tracking-tight text-forest sm:text-2xl">
        {clock}
      </p>
      <p className="text-[10px] font-bold uppercase tracking-widest text-charcoal/40 sm:text-xs">
        {meridiem}
      </p>
    </div>
  );
};

export const ScheduleTimeline = ({ events }) => (
  <ol data-testid="schedule-timeline" className="flex flex-col gap-3">
    {events.map((item, i) => (
      <li
        key={item.id}
        data-testid={`schedule-event-${i + 1}`}
        className={`flex gap-4 rounded-2xl p-4 shadow-sm ring-1 transition-shadow duration-200 hover:shadow-md sm:gap-6 sm:p-6 ${
          item.isCurrent ? "bg-forest-mist ring-gold/50" : "bg-white ring-border"
        }`}
      >
        <TimeBlock time={item.time} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h3 className="text-base font-extrabold tracking-tight text-charcoal sm:text-lg">
              {item.title}
            </h3>
            <StatusChip status={item.status} />
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-charcoal/60">
            {item.description}
          </p>
          <p className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-forest sm:text-sm sm:normal-case sm:tracking-normal">
            <MapPin className="h-4 w-4 shrink-0 text-gold-deep" aria-hidden="true" />
            {item.location}
          </p>
          {item.note && (
            <p className="mt-2 rounded-xl bg-gold/10 px-3.5 py-2 text-xs font-semibold text-gold-deep sm:text-sm">
              {item.note}
            </p>
          )}
        </div>
      </li>
    ))}
  </ol>
);
