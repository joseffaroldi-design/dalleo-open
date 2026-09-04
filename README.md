# Dalleo Open — Digital Clubhouse

The permanent digital home of the Dalleo Open, an annual memorial golf tournament honoring Brandon Dalleo.
Live at **https://dalleoopen.com**.

## What this is

A mobile-first tournament platform:

- **Public site** — Home (live countdown + announcements), Live Leaderboard (hole-by-hole stroke-play standings, auto-refreshing every 30s), Champions trophy wall (2020–present), Teams, Schedule (shotgun pairings with A/B tee sides), Gallery (photos + videos), The Course (scorecard + good-to-know), Brandon (memorial), Rules, Committee, Draft recap, Announcements.
- **Captain scoring** — each team captain signs in at `/score` with a team + 4-digit PIN and enters strokes hole-by-hole from their phone. The leaderboard updates live.
- **Organizer admin** — `/admin` (JWT login): announcements, teams + player/committee photos, schedule, gallery media uploads, site content, rules, champions, course, scoring control (Not Started / Test / Live / Final, score matrix, captain PINs, one-tap reset), Game Day checklist.

## Tech stack

- **Frontend**: React 19, Tailwind CSS, Framer Motion, Lenis, React Router, TanStack Query (Create React App + CRACO)
- **Backend**: FastAPI (Python), Motor (async MongoDB), PyJWT, bcrypt
- **Database**: MongoDB (single-document content domains in `site_content`, plus `users`, `team_pins`, `login_attempts`, `files` metadata)
- **Storage**: object storage for gallery/team/committee photos and videos via the backend upload endpoint
- **Analytics**: GA4 (manual SPA page views + 4 custom events) + platform-injected PostHog; both client-side keys are public by design
- **PWA**: minimal service worker + manifest for "Add to Home Screen"

## Repository layout

```
backend/            FastAPI app (server.py), tests/ (pytest + pytest-xdist), requirements.txt, .env.example
frontend/           React app — src/pages, src/admin, src/components, public/ (icons, manifest, sw.js, images)
docs/               supporting notes
```

Internal operational files (project memory, QA iteration reports) are intentionally excluded from the public repository — they contain test credentials.

## Environment variables

Copy `backend/.env.example` → `backend/.env` and `frontend/.env.example` → `frontend/.env` and fill in values. Never commit real `.env` files.

Backend:

| Var | Purpose |
|---|---|
| `MONGO_URL` | MongoDB connection string |
| `DB_NAME` | Database name |
| `CORS_ORIGINS` | Allowed origins (`*` for dev) |
| `JWT_SECRET` | Organizer session signing secret |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | First organizer account (seeded/re-synced at startup, bcrypt-hashed) |
| `EMERGENT_LLM_KEY` | Object-storage integration key (file uploads) |

Frontend:

| Var | Purpose |
|---|---|
| `REACT_APP_BACKEND_URL` | Public URL of the backend (all API calls prefix `/api`) |
| `REACT_APP_GA_MEASUREMENT_ID` | GA4 ID (`G-…`); analytics are inert when unset |

## Run locally

```bash
# Backend (http://localhost:8001)
cd backend && pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# Frontend (http://localhost:3000)
cd frontend && yarn install && yarn start
```

Backend tests:

```bash
cd backend && python -m pytest -n 2
```

## Deploy (Emergent)

This project deploys through the Emergent platform: the platform builds the frontend (CRA production build), runs the backend on port 8001, injects both `.env` files, and routes `/api/*` to the backend. Pushing the project state and pressing **Deploy** ships it; the live site is https://dalleoopen.com.

## Branches

- `main` — repository mainline
- `emergent-current-YYYY-MM-DD` — point-in-time snapshots of the deployed Emergent project state
- `agent/*` — working branches from design/QA agents (merged via PR review)

The branch tagged in each snapshot's description is the one that exactly matches the deployed production build at that date.
