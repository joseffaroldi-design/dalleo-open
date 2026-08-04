import {
  Heart,
  ScrollText,
} from "lucide-react";
import { PlaceholderPage } from "@/components/PlaceholderPage";

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
