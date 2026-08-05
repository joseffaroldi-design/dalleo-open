import { TEAMS, TEAMS_ANNOUNCED } from "@/data/teams";
import { SCHEDULE_PUBLISHED, SCHEDULE, DAYS } from "@/data/schedule";
import { GALLERY_PUBLISHED, GALLERY_ITEMS } from "@/data/gallery";
import { MEMORIAL, MEMORIAL_PUBLISHED, SHARE_MEMORY_ENABLED } from "@/data/memorial";
import { RULES, RULES_PUBLISHED, RULES_APPROVED } from "@/data/rules";
import { CHAMPIONS } from "@/data/champions";
import { COURSE } from "@/data/course";

// Editors start from the current public mock content the first time they are
// opened (when no saved record exists yet). The first save creates the record.
export const SEED = {
  announcements: () => ({
    items: [
      { id: "a1", title: "Draft Party details are coming together", message: "Friday night's Draft Party venue and start time will be revealed soon — stay tuned.", date: "Sample announcement", priority: "normal", published: true },
      { id: "a2", title: "Team registration opens this summer", message: "Grab your playing partners early. Spots for the 7th Annual Dalleo Open will be limited.", date: "Sample announcement", priority: "normal", published: true },
      { id: "a3", title: "A weekend that gives back", message: "This year's tournament continues Brandon's legacy by supporting causes close to his heart.", date: "Sample announcement", priority: "normal", published: true },
    ],
  }),
  teams: () => ({ published: TEAMS_ANNOUNCED, items: TEAMS.map((t) => ({ ...t, players: t.players.map((p) => ({ ...p })) })) }),
  schedule: () => ({
    published: SCHEDULE_PUBLISHED,
    events: DAYS.flatMap((d) => SCHEDULE[d.id].map((e) => ({ ...e, day: d.id }))),
  }),
  gallery: () => ({
    published: GALLERY_PUBLISHED,
    items: GALLERY_ITEMS.map((i) => ({ ...i, published: true })),
  }),
  site: () => ({
    edition: "7th Annual Dalleo Open",
    year: "2026",
    dateText: "Tournament dates to be announced",
    heroSubtitle: "In Memory of Brandon Dalleo",
    instagramUrl: "https://www.instagram.com/",
    homeMessage: MEMORIAL.homeMessage,
    memorialPublished: MEMORIAL_PUBLISHED,
    shareMemoryEnabled: SHARE_MEMORY_ENABLED,
    memorialHeroTitle: MEMORIAL.hero.title,
    memorialHeroSubtitle: MEMORIAL.hero.subtitle,
    story: [...MEMORIAL.story],
    milestones: MEMORIAL.milestones.map(({ title, description }) => ({ title, description })),
    closingMessage: MEMORIAL.closing.message,
  }),
  rules: () => ({
    published: RULES_PUBLISHED,
    approved: RULES_APPROVED,
    header: { title: RULES.header.title, body: RULES.header.description },
    edition: RULES.header.edition,
    draftNotice: RULES.draftNotice,
    quickReminders: [...RULES.quickReminders],
    formatIntro: RULES.format.intro,
    formatPoints: [...RULES.format.points],
    formatNote: RULES.format.note,
    matchRules: RULES.matchRules.map((r) => ({ ...r })),
    conduct: RULES.conduct.map((r) => ({ ...r })),
    tiebreakNote: RULES.tiebreakers.note,
    tiebreakSteps: [...RULES.tiebreakers.steps],
    faq: RULES.faq.map((r) => ({ ...r })),
    unpublishedTitle: RULES.unpublished.title,
    unpublishedBody: RULES.unpublished.body,
  }),
  champions: () => ({
    published: CHAMPIONS.published,
    header: { ...CHAMPIONS.header },
    entries: CHAMPIONS.entries.map((e) => ({ ...e, members: [...e.members], moments: [...e.moments], awards: [...e.awards], stats: e.stats.map((s) => ({ ...s })) })),
    records: CHAMPIONS.records.map((r) => ({ ...r })),
  }),
  course: () => ({
    published: COURSE.published,
    name: COURSE.name,
    location: COURSE.location,
    label: COURSE.label,
    goodToKnow: COURSE.goodToKnow.map((t) => ({ ...t })),
  }),
  scoring: () => ({
    status: "not-started",
    par: [4, 4, 5, 3, 4, 4, 5, 3, 4, 4, 4, 4, 5, 3, 4, 4, 3, 5],
    courseLabel: "",
    scores: [],
    updatedAt: "",
  }),
};
