import { ImageIcon } from "lucide-react";

// Deliberate clipped frame with spotlight — real tournament photography drops
// straight in via the src prop once uploaded in the admin.
export const PhotoFrame = ({ caption, testId, aspect = "aspect-[4/3]", className = "", src }) => {
  if (src) {
    return (
      <img
        src={src}
        alt={caption}
        data-testid={testId}
        className={`spotlight-frame ${aspect} w-full rounded-t-[999px] border border-gold/40 object-cover ${className}`}
      />
    );
  }
  return (
    <div
      data-testid={testId}
      role="img"
      aria-label={caption}
      className={`spotlight-frame flex ${aspect} w-full flex-col items-center justify-center gap-3 rounded-t-[999px] border border-gold/40 bg-forest text-cream/50 ${className}`}
    >
      <ImageIcon className="h-8 w-8" aria-hidden="true" />
      <span className="px-6 text-center text-xs font-semibold sm:text-sm">{caption}</span>
    </div>
  );
};
