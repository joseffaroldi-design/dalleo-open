import { useState } from "react";
import { Trophy, PartyPopper, Users, Medal, Heart, Images, Play } from "lucide-react";

const CATEGORY_ICONS = {
  tournament: Trophy,
  "draft-night": PartyPopper,
  teams: Users,
  awards: Medal,
  memories: Heart,
};

const SCHEMES = [
  { bg: "#1F4E3D", icon: "#E7CE7A" },
  { bg: "#2E6B52", icon: "#FAF8F4" },
  { bg: "#153326", icon: "#C9A227" },
  { bg: "#EAF2EE", icon: "#1F4E3D" },
  { bg: "#262B2E", icon: "#C9A227" },
  { bg: "#C9A227", icon: "#153326" },
];

const ASPECTS = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
};

export const MediaThumb = ({ item, aspect, className = "", iconClassName = "h-12 w-12" }) => {
  const scheme = SCHEMES[item.order % SCHEMES.length];
  const Icon = CATEGORY_ICONS[item.category] ?? Images;
  const [imgError, setImgError] = useState(false);
  return (
    <div
      role="img"
      aria-label={item.alt}
      data-testid={`media-thumb-${item.id}`}
      className={`relative flex items-center justify-center overflow-hidden ${ASPECTS[aspect ?? item.aspect]} ${className}`}
      style={{ backgroundColor: scheme.bg }}
    >
      {item.src && !imgError && (
        <img
          src={item.src}
          alt={item.alt}
          onError={() => setImgError(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <span
        aria-hidden="true"
        className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-15"
        style={{ backgroundColor: scheme.icon }}
      />
      <span
        aria-hidden="true"
        className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full opacity-10"
        style={{ backgroundColor: scheme.icon }}
      />
      <Icon className={iconClassName} style={{ color: scheme.icon }} aria-hidden="true" />
      {item.type === "video" && (
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center bg-charcoal/30"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream/90 text-forest shadow-md">
            <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" />
          </span>
        </span>
      )}
    </div>
  );
};
