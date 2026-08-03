import { Activity, CheckCircle2, Clock } from "lucide-react";

const VARIANTS = {
  live: {
    icon: Activity,
    label: "Live",
    className: "bg-forest text-cream",
  },
  "in-progress": {
    icon: Activity,
    label: "In Progress",
    className: "bg-forest text-cream",
  },
  final: {
    icon: CheckCircle2,
    label: "Final",
    className: "bg-charcoal/10 text-charcoal",
  },
  upcoming: {
    icon: Clock,
    label: "Upcoming",
    className: "bg-gold/15 text-gold-deep",
  },
};

export const StatusChip = ({ status, label, size = "sm" }) => {
  const variant = VARIANTS[status] ?? VARIANTS.upcoming;
  const Icon = variant.icon;
  return (
    <span
      data-testid={`status-chip-${status}`}
      className={`inline-flex items-center gap-1.5 rounded-full font-bold ${
        size === "lg" ? "px-4 py-1.5 text-sm" : "px-3 py-1 text-xs"
      } ${variant.className}`}
    >
      <Icon className={size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5"} aria-hidden="true" />
      {label ?? variant.label}
    </span>
  );
};
