import { MEMORIAL_PUBLISHED, SHARE_MEMORY_ENABLED, MEMORIAL } from "@/data/memorial";
import { useLiveData } from "@/data/useLiveData";
import { MemorialHero } from "@/components/memorial/MemorialHero";
import {
  StorySection,
  ValuesSection,
  TraditionTimeline,
  ClosingSection,
} from "@/components/memorial/Sections";
import { MemoryPhotos } from "@/components/memorial/MemoryPhotos";
import { ShareMemory } from "@/components/memorial/ShareMemory";
import { MemorialEmptyState } from "@/components/memorial/MemorialEmptyState";

export default function Brandon() {
  const site = useLiveData("site");
  const published = site ? site.memorialPublished : MEMORIAL_PUBLISHED;
  const shareEnabled = site ? site.shareMemoryEnabled : SHARE_MEMORY_ENABLED;
  const memorial = site
    ? {
        ...MEMORIAL,
        hero: { ...MEMORIAL.hero, title: site.memorialHeroTitle, subtitle: site.memorialHeroSubtitle, photoUrl: site.brandonPhotoUrl ?? null },
        story: site.story,
        milestones: site.milestones.map((m, i) => ({ id: `m${i + 1}`, ...m })),
        closing: { message: site.closingMessage },
      }
    : MEMORIAL;
  return (
    <div data-testid="brandon-page">
      {published ? (
        <>
          <MemorialHero hero={memorial.hero} />
          <StorySection paragraphs={memorial.story} />
          <ValuesSection values={memorial.values} />
          <TraditionTimeline milestones={memorial.milestones} />
          <MemoryPhotos photos={memorial.photos} />
          {shareEnabled && <ShareMemory content={memorial.shareMemory} />}
          <ClosingSection message={memorial.closing.message} />
        </>
      ) : (
        <MemorialEmptyState />
      )}
    </div>
  );
}
