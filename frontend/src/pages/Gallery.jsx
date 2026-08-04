import { useMemo, useState } from "react";
import { GALLERY_PUBLISHED, GALLERY_ITEMS, getFeaturedItem } from "@/data/gallery";
import { CategoryFilter } from "@/components/gallery/CategoryFilter";
import { MediaCard } from "@/components/gallery/MediaCard";
import { MediaViewer } from "@/components/gallery/MediaViewer";
import { FeaturedMemory } from "@/components/gallery/FeaturedMemory";
import { GalleryEmptyState } from "@/components/gallery/GalleryEmptyState";

export default function Gallery() {
  const [category, setCategory] = useState("all");
  const [viewerIndex, setViewerIndex] = useState(null);

  const visibleItems = useMemo(
    () =>
      category === "all"
        ? GALLERY_ITEMS
        : GALLERY_ITEMS.filter((i) => i.category === category),
    [category]
  );

  const featured = getFeaturedItem();

  const openItem = (id, list) => {
    const idx = list.findIndex((i) => i.id === id);
    if (idx >= 0) setViewerIndex({ list, idx });
  };

  return (
    <div data-testid="gallery-page" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-forest sm:text-5xl">
          Gallery
        </h1>
        <p className="mt-3 text-base font-semibold text-charcoal/60 sm:text-lg">
          8th Annual Dalleo Open &middot; 2026
        </p>
        <p className="mt-2 text-base leading-relaxed text-charcoal/60">
          Memories from the Dalleo Open, on and off the course.
        </p>
      </header>

      <div className="mt-10">
        {GALLERY_PUBLISHED ? (
          <div className="flex flex-col gap-12">
            {featured && (
              <FeaturedMemory item={featured} onOpen={(id) => openItem(id, GALLERY_ITEMS)} />
            )}
            <section data-testid="gallery-grid-section" aria-labelledby="gallery-grid-title">
              <h2 id="gallery-grid-title" className="sr-only">
                Media gallery
              </h2>
              <CategoryFilter value={category} onChange={setCategory} />
              <ul
                data-testid="media-grid"
                className="mt-8 columns-2 gap-4 sm:columns-3 lg:columns-4"
              >
                {visibleItems.map((item) => (
                  <MediaCard key={item.id} item={item} onOpen={(id) => openItem(id, visibleItems)} />
                ))}
              </ul>
            </section>
          </div>
        ) : (
          <GalleryEmptyState />
        )}
      </div>

      {viewerIndex && (
        <MediaViewer
          items={viewerIndex.list}
          index={viewerIndex.idx}
          onClose={() => setViewerIndex(null)}
          onNavigate={(idx) => setViewerIndex({ list: viewerIndex.list, idx })}
        />
      )}
    </div>
  );
}
