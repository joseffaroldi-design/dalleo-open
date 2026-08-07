import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/Marquee";
import { AnnouncementsTicker } from "@/components/home/AnnouncementsTicker";
import { LeaderboardPreview } from "@/components/home/LeaderboardPreview";
import { TeamsPreview } from "@/components/home/TeamsPreview";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { WeekendPreview } from "@/components/home/WeekendPreview";
import { BrandonSection } from "@/components/home/BrandonSection";

export default function Home() {
  return (
    <div data-testid="home-page">
      <AnnouncementsTicker />
      <LeaderboardPreview />
      <Hero />
      <Marquee />
      <TeamsPreview />
      <GalleryPreview />
      <WeekendPreview />
      <BrandonSection />
    </div>
  );
}
