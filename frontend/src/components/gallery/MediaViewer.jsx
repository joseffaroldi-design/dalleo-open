import { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { MediaThumb } from "@/components/gallery/MediaThumb";
import { GALLERY_CATEGORIES, itemMedia, isUploadedVideoUrl } from "@/data/gallery";

export const MediaViewer = ({ items, index, onClose, onNavigate }) => {
  const item = items[index];
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const [mediaIdx, setMediaIdx] = useState(0);

  const prev = () => onNavigate((index - 1 + items.length) % items.length);
  const next = () => onNavigate((index + 1) % items.length);

  // Reset to the first photo/video whenever the item changes.
  useEffect(() => setMediaIdx(0), [index]);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    closeRef.current?.focus();
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll("button");
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      previouslyFocused?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, items.length, onClose]);

  if (!item) return null;

  const categoryLabel =
    GALLERY_CATEGORIES.find((c) => c.id === item.category)?.label ?? item.category;
  const media = itemMedia(item);
  const current = media[Math.min(mediaIdx, media.length - 1)];
  const currentIsVideo = isUploadedVideoUrl(current);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/85 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="viewer-caption"
        data-testid="media-viewer"
        className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          {currentIsVideo ? (
            <video
              key={current}
              src={current}
              controls
              autoPlay
              playsInline
              data-testid="viewer-video-player"
              className="max-h-[55vh] w-full bg-charcoal"
            />
          ) : current ? (
            <img
              key={current}
              src={current}
              alt={item.alt}
              data-testid="viewer-image"
              decoding="async"
              className="max-h-[55vh] w-full bg-forest-deep object-contain"
            />
          ) : (
            <MediaThumb
              item={item}
              className="max-h-[55vh] w-full"
              iconClassName="h-20 w-20"
            />
          )}
          {media.length > 1 && (
            <div
              data-testid="viewer-media-pager"
              className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-charcoal/70 px-3 py-1.5"
            >
              <button
                type="button"
                data-testid="viewer-media-prev"
                aria-label="Previous photo or video"
                onClick={() => setMediaIdx((i) => (i - 1 + media.length) % media.length)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-cream transition-colors duration-200 hover:bg-cream/20"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span data-testid="viewer-media-count" className="text-xs font-bold text-cream">
                {mediaIdx + 1}/{media.length}
              </span>
              <button
                type="button"
                data-testid="viewer-media-next"
                aria-label="Next photo or video"
                onClick={() => setMediaIdx((i) => (i + 1) % media.length)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-cream transition-colors duration-200 hover:bg-cream/20"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
          <button
            ref={closeRef}
            type="button"
            data-testid="viewer-close"
            onClick={onClose}
            aria-label="Close media viewer"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-cream/90 text-charcoal shadow-md transition-colors duration-200 hover:bg-gold hover:text-forest-deep"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="flex items-center justify-between gap-4 p-5 sm:p-6">
          <button
            type="button"
            data-testid="viewer-prev"
            onClick={prev}
            aria-label="Previous media item"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest-mist text-forest transition-colors duration-200 hover:bg-forest hover:text-gold"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="min-w-0 text-center">
            <p
              id="viewer-caption"
              data-testid="viewer-caption"
              className="text-lg font-extrabold tracking-tight text-charcoal sm:text-xl"
            >
              {item.caption}
            </p>
            <p className="mt-1 text-sm font-semibold text-charcoal/50">
              {item.type === "video" ? "Video · " : ""}
              {categoryLabel} &middot; {item.year}
            </p>
            {item.type === "video" && media.length === 0 && (
              <p
                data-testid="viewer-video-note"
                className="mt-3 inline-block rounded-full bg-gold/15 px-4 py-1.5 text-xs font-bold text-gold-deep"
              >
                Video playback coming soon
              </p>
            )}
          </div>
          <button
            type="button"
            data-testid="viewer-next"
            onClick={next}
            aria-label="Next media item"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest-mist text-forest transition-colors duration-200 hover:bg-forest hover:text-gold"
          >
            <ChevronRight className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};
