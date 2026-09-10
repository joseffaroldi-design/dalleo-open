import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/Marquee";
import { LeaderboardPreview } from "@/components/home/LeaderboardPreview";
import { TeamsPreview } from "@/components/home/TeamsPreview";
import { Announcements } from "@/components/home/Announcements";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { BrandonSection } from "@/components/home/BrandonSection";

export default function Home() {
  return (
    <div data-testid="home-page">
      <Hero />
      <Marquee />
      <LeaderboardPreview />
      <TeamsPreview />
      <Announcements />
      <GalleryPreview />
      <BrandonSection />
    </div>
  );
}
