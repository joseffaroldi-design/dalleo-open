import { Link } from "react-router-dom";
import { ArrowRight, ImageIcon } from "lucide-react";

const ASPECTS = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
};

const MemorialPhoto = ({ photo, testId }) => (
  <figure data-testid={testId}>
    <div
      role="img"
      aria-label={photo.alt}
      className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-forest/25 bg-forest-mist text-forest/50 ${ASPECTS[photo.aspect]}`}
    >
      <ImageIcon className="h-8 w-8" aria-hidden="true" />
    </div>
    <figcaption className="mt-3 text-sm font-semibold text-charcoal/60">
      {photo.caption}
    </figcaption>
  </figure>
);

export const MemoryPhotos = ({ photos }) => (
  <section
    data-testid="memory-photos"
    aria-labelledby="memory-photos-title"
    className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28"
  >
    <div className="flex items-end justify-between gap-4">
      <h2
        id="memory-photos-title"
        className="text-base font-bold uppercase tracking-[0.2em] text-gold-deep md:text-lg"
      >
        In Photos
      </h2>
      <Link
        to="/gallery"
        data-testid="memory-photos-gallery-link"
        className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold text-forest transition-colors duration-200 hover:bg-forest-mist"
      >
        View Gallery
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
    <div className="mt-8 space-y-6">
      <MemorialPhoto photo={photos.featured} testId="memory-photo-featured" />
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {photos.supporting.map((photo, i) => (
          <MemorialPhoto key={photo.id} photo={photo} testId={`memory-photo-support-${i + 1}`} />
        ))}
      </div>
    </div>
  </section>
);
