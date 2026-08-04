import { MediaThumb } from "@/components/gallery/MediaThumb";

export const MediaCard = ({ item, onOpen }) => (
  <li className="mb-4 break-inside-avoid">
    <button
      type="button"
      data-testid={`media-card-${item.id}`}
      onClick={() => onOpen(item.id)}
      aria-label={`Open ${item.type === "video" ? "video" : "photo"}: ${item.caption}`}
      className="group block w-full overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 ring-border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:translate-y-0"
    >
      <div className="relative">
        <MediaThumb item={item} iconClassName="h-10 w-10" />
        {item.type === "video" && (
          <span className="absolute left-3 top-3 rounded-full bg-charcoal/80 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-cream">
            Video
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-sm font-extrabold tracking-tight text-charcoal sm:text-base">
          {item.caption}
        </p>
        <p className="mt-1 text-xs font-semibold text-charcoal/50">
          {item.year}
          {item.source ? ` · ${item.source}` : ""}
        </p>
      </div>
    </button>
  </li>
);
