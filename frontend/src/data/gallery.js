// Centralized gallery data (Sprint 5).
// Gallery page, media viewer, featured memory, and homepage preview all read
// from this file. Real hosted media later replaces `src` — layouts never change.

// Flip to false to see the unpublished-gallery empty state.
export const GALLERY_PUBLISHED = true;

export const GALLERY_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "tournament", label: "Tournament" },
  { id: "draft-night", label: "Draft Night" },
  { id: "teams", label: "Teams" },
  { id: "awards", label: "Awards" },
  { id: "memories", label: "Memories" },
];

const item = (id, type, caption, description, category, year, aspect, alt, source, order, featured = false) => ({
  id,
  type,
  src: null, // real hosted media URL goes here in a future content sprint
  caption,
  description,
  category,
  year,
  aspect, // "portrait" | "landscape" | "square"
  alt,
  source,
  order,
  featured,
});

export const GALLERY_ITEMS = [
  item("g1", "image", "Champions on the 18th green", "The moment Team Green sealed last year's title — hands in the air, families rushing the green.", "tournament", 2025, "landscape", "Team Green celebrating their championship win on the 18th green", "Tournament Committee", 1, true),
  item("g2", "image", "Captains at the draft board", "Four captains, one board, and a room full of heckling friends.", "draft-night", 2025, "portrait", "The four team captains standing at the live draft board", "Draft Night Crew", 2),
  item("g3", "image", "Team Green before Round 1", "Matching polos and early-morning nerves on the first tee.", "teams", 2024, "landscape", "Team Green posing together before the first round", "Tournament Committee", 3),
  item("g4", "video", "The final putt drops", "Ninety seconds of silence, then pure chaos. Full clip coming soon.", "tournament", 2025, "landscape", "Video placeholder for the championship-winning putt", "Tournament Committee", 4),
  item("g5", "image", "Trophy presentation", "The Dalleo Open trophy lifted high as the sun sets on Sunday.", "awards", 2025, "portrait", "The tournament trophy being presented at the awards ceremony", "Awards Committee", 5),
  item("g6", "image", "Brandon's favorite foursome", "The group that started it all, back where it all began.", "memories", 2023, "square", "Brandon's favorite foursome together on the course", "Family Archive", 6),
  item("g7", "image", "Morning fog on the first tee", "Saturday Round 1, quiet and still before the crowds arrive.", "tournament", 2024, "landscape", "Morning fog rolling over the first tee box", "Tournament Committee", 7),
  item("g8", "image", "Draft night laughter", "The exact moment a captain's top pick was stolen.", "draft-night", 2024, "square", "Friends laughing together during the live draft", "Draft Night Crew", 8),
  item("g9", "image", "Team Gold huddle", "One last pep talk before the afternoon matches.", "teams", 2025, "portrait", "Team Gold in a huddle before their afternoon matches", "Tournament Committee", 9),
  item("g10", "video", "Awards ceremony highlights", "Speeches, toasts, and one unforgettable acceptance. Full clip coming soon.", "awards", 2024, "landscape", "Video placeholder for the awards ceremony highlight reel", "Awards Committee", 10),
  item("g11", "image", "The first Dalleo Open", "Twenty friends, one idea, and the photo that started a tradition.", "memories", 2022, "landscape", "The original group photo from the very first Dalleo Open", "Family Archive", 11),
  item("g12", "image", "Approach on 12", "A perfectly flighted wedge into the toughest pin on the course.", "tournament", 2025, "portrait", "A player hitting an approach shot toward the 12th green", "Tournament Committee", 12),
];

export const getFeaturedItem = () => GALLERY_ITEMS.find((i) => i.featured) ?? null;

export const getLatestItems = (count = 3) =>
  [...GALLERY_ITEMS].sort((a, b) => b.order - a.order).slice(0, count);
