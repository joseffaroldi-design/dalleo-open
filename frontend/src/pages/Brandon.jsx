import { MEMORIAL_PUBLISHED, SHARE_MEMORY_ENABLED, MEMORIAL } from "@/data/memorial";
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
  return (
    <div data-testid="brandon-page">
      {MEMORIAL_PUBLISHED ? (
        <>
          <MemorialHero hero={MEMORIAL.hero} />
          <StorySection paragraphs={MEMORIAL.story} />
          <ValuesSection values={MEMORIAL.values} />
          <TraditionTimeline milestones={MEMORIAL.milestones} />
          <MemoryPhotos photos={MEMORIAL.photos} />
          {SHARE_MEMORY_ENABLED && <ShareMemory content={MEMORIAL.shareMemory} />}
          <ClosingSection message={MEMORIAL.closing.message} />
        </>
      ) : (
        <MemorialEmptyState />
      )}
    </div>
  );
}
