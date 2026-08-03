# Dalleo Open Digital Clubhouse — PRD

## Original Problem Statement
Build the Dalleo Open Digital Clubhouse, a modern, mobile-first web app for the annual golf tournament held in memory of Brandon Dalleo. Premium, clean, welcoming, community-focused (Apple/Airbnb/PGA Tour polish). Delivered one sprint at a time with explicit approval gates.

## Architecture
- Frontend-only React 19 SPA (CRA + craco), react-router-dom v7, Tailwind CSS, lucide-react icons
- No backend, database, auth, or APIs (per Sprint 1 scope)
- Design system: Forest Green (#1F4E3D) primary, White/Cream (#FAF8F4) secondary, Gold (#C9A227) accent, Charcoal (#262B2E) text; Manrope typeface; rounded-3xl cards, subtle shadows, hover/tap-only motion
- Reusable components: Navbar (sticky, mobile-first hamburger), Footer, Logo, PlaceholderPage, home section components

## User Personas
- Tournament participants (golfers checking leaderboard/teams/schedule)
- Friends & family of Brandon Dalleo (memorial content)
- Event organizers (future sprints: admin/CMS)

## Core Requirements (static, from brief)
- Routes: Home, Leaderboard, Teams, Schedule, Gallery, Brandon, Rules
- Home: hero (logo, memorial line, 8th Annual, date placeholder, countdown placeholder, hero image placeholder), quick nav cards, announcements (3 samples), This Weekend preview, Brandon memorial section, footer
- Placeholder pages: title, "Coming Soon", description, link back home
- Responsive mobile/tablet/desktop, sticky header, logo → home, accessibility friendly
- Do NOT build: admin, auth, DB, APIs, live data, countdown logic, uploads, accounts, stats, notifications, forms, settings, CMS

## Implemented
- 2026-07-03 (Sprint 1): Full responsive frontend foundation — all 7 routes, Home with all specified sections, 6 placeholder pages, sticky responsive navbar with mobile menu, footer with nav + Instagram placeholder + copyright, Dalleo design system (palette + Manrope), data-testids on all interactive elements, ScrollToTop, page title/meta. Verified via screenshots (desktop home, mobile home, mobile nav, placeholder pages) and navigation click-throughs.

## Backlog (future sprints — NOT built, awaiting approval)
- P0: Live countdown to tournament date, real tournament date, real logo/hero photo/Brandon photo assets
- P1: Live leaderboard + scoring, teams/rosters content, full schedule content, gallery with uploads, Brandon memorial page content, rules content
- P2: Admin dashboard, authentication, CMS/announcements management, push notifications, statistics

## Next Tasks
1. Obtain brand assets (logo, hero photo, Brandon photo) and tournament date
2. Sprint 2 scoping with stakeholder approval
