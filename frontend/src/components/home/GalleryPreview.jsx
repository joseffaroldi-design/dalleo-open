import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { GALLERY_PUBLISHED, getLatestItems } from "@/data/gallery";
import { MediaThumb } from "@/components/gallery/MediaThumb";
import { useLiveData } from "@/data/useLiveData";
import { Reveal } from "@/components/motion/Reveal";

export const GalleryPreview = () => {
  const live = useLiveData("gallery");
  const published = live ? live.published : GALLERY_PUBLISHED;
  const latest = live
    ? [...live.items].filter((i) => i.published).sort((a, b) => b.order - a.order).slice(0, 3)
    : getLatestItems(3);
  if (!published || latest.length === 0) return null;

  return (
    <section
      data-testid="home-gallery-preview"
      aria-labelledby="home-gallery-title"
      className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 sm:pb-28"
    >
      <Reveal>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-display text-sm italic text-gold-deep">Chapter 04 · The Memories</p>
          <h2
            id="home-gallery-title"
            className="mt-2 text-base font-bold uppercase tracking-[0.2em] text-gold-deep md:text-lg"
          >
            Latest Memories
          </h2>
        </div>
        <Link
          to="/gallery"
          data-testid="view-gallery-link"
          className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold text-forest transition-colors duration-200 hover:bg-forest-mist"
        >
          View Gallery
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
      </Reveal>
      <Reveal delay={0.12}>
      <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
        {latest.map((item) => (
          <Link
            key={item.id}
            to="/gallery"
            data-testid={`home-gallery-thumb-${item.id}`}
            aria-label={`Open gallery — ${item.caption}`}
            className="block overflow-hidden rounded-2xl shadow-sm ring-1 ring-border transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
          >
            <MediaThumb item={item} aspect="square" iconClassName="h-8 w-8 sm:h-10 sm:w-10" />
          </Link>
        ))}
      </div>
      </Reveal>
    </section>
  );
};
