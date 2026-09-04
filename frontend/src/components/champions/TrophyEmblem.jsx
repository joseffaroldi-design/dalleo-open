import { Trophy } from "lucide-react";

// Signature gold trophy mark for the Trophy Wall.
export const TrophyEmblem = ({ className = "h-20 w-20", iconClassName = "h-9 w-9" }) => (
  <span
    aria-hidden="true"
    className={`inline-flex items-center justify-center rounded-full bg-gold/10 text-gold ring-2 ring-gold/60 ${className}`}
  >
    <Trophy className={iconClassName} />
  </span>
);
