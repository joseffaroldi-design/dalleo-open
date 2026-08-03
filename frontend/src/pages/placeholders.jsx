import {
  CalendarDays,
  Images,
  Heart,
  ScrollText,
} from "lucide-react";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const Schedule = () => (
  <PlaceholderPage
    testId="schedule-page"
    title="Schedule"
    icon={CalendarDays}
    description="The full tournament weekend schedule — tee times, events, and ceremonies — will be posted here."
  />
);

export const Gallery = () => (
  <PlaceholderPage
    testId="gallery-page"
    title="Gallery"
    icon={Images}
    description="Photos and memories from past Dalleo Opens will be showcased here for the whole community."
  />
);

export const Brandon = () => (
  <PlaceholderPage
    testId="brandon-page"
    title="Brandon"
    icon={Heart}
    description="The story of Brandon Dalleo and the legacy behind this tournament — coming soon."
  />
);

export const Rules = () => (
  <PlaceholderPage
    testId="rules-page"
    title="Rules"
    icon={ScrollText}
    description="Tournament format, rules, and scoring details will be published here ahead of the event."
  />
);
