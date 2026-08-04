import { Hero } from "@/components/home/Hero";
import { QuickNav } from "@/components/home/QuickNav";
import { LeaderboardPreview } from "@/components/home/LeaderboardPreview";
import { TeamsPreview } from "@/components/home/TeamsPreview";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { Announcements } from "@/components/home/Announcements";
import { WeekendPreview } from "@/components/home/WeekendPreview";
import { BrandonSection } from "@/components/home/BrandonSection";

export default function Home() {
  return (
    <div data-testid="home-page">
      <Hero />
      <QuickNav />
      <LeaderboardPreview />
      <TeamsPreview />
      <GalleryPreview />
      <Announcements />
      <WeekendPreview />
      <BrandonSection />
    </div>
  );
}
