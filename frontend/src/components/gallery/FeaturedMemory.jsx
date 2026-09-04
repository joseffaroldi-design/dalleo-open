import { MediaThumb } from "@/components/gallery/MediaThumb";

export const FeaturedMemory = ({ item, onOpen }) => (
  <section
    data-testid="featured-memory"
    aria-labelledby="featured-memory-title"
    className="overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-border"
  >
    <div className="grid grid-cols-1 md:grid-cols-2">
      <MediaThumb item={item} className="md:aspect-auto md:h-full md:min-h-72" iconClassName="h-16 w-16" />
      <div className="flex flex-col justify-center p-7 sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold-deep">
          Featured Memory &middot; {item.year}
        </p>
        <h2
          id="featured-memory-title"
          data-testid="featured-memory-title"
          className="mt-3 text-2xl font-extrabold tracking-tight text-forest sm:text-3xl"
        >
          {item.caption}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-charcoal/70">
          {item.description}
        </p>
        <button
          type="button"
          data-testid="view-memory-button"
          onClick={() => onOpen(item.id)}
          className="mt-7 inline-flex min-h-12 w-fit items-center rounded-full bg-gold px-7 py-3 text-base font-extrabold text-forest-deep shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold-soft hover:shadow-md"
        >
          View Memory
        </button>
      </div>
    </div>
  </section>
);
