import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/Marquee";
import { PairingsStrip } from "@/components/home/PairingsStrip";
import { LeaderboardPreview } from "@/components/home/LeaderboardPreview";
import { TeamsPreview } from "@/components/home/TeamsPreview";
import { Announcements } from "@/components/home/Announcements";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { WeekendPreview } from "@/components/home/WeekendPreview";
import { BrandonSection } from "@/components/home/BrandonSection";

export default function Home() {
  return (
    <div data-testid="home-page">
      <LeaderboardPreview />
      <Hero />
      <Marquee />
      <PairingsStrip />
      <TeamsPreview />
      <Announcements />
      <GalleryPreview />
      <WeekendPreview />
      <BrandonSection />
    </div>
  );
}
