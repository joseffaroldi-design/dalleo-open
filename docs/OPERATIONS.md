# Operations — Branding Assets, Backup & Recovery, Monitoring

## Branding asset map
Polished placeholders are in place for every asset; nothing breaks while
assets are missing. Replace these when the owner provides finals:

| Asset | Where used | How to replace | Recommended format & size |
|---|---|---|---|
| Main logo (DO monogram) | Navbar, footer, hero | Replace the monogram component artwork (src/components/Logo.jsx) or drop in an SVG | SVG, square, ~160×160 viewBox |
| Favicon | Browser tab | Overwrite `frontend/public/favicon.svg` (or add favicon.png and update index.html) | SVG or 64×64 PNG |
| Hero image | Homepage hero | Admin-editable later; for now replace the placeholder block in src/components/home/Hero.jsx | WebP/optimized JPEG, 2100×900 |
| Brandon memorial photo | Homepage Brandon section + memorial page hero | Family-provided; replace placeholders in BrandonSection.jsx and MemorialHero.jsx | WebP/JPEG, 800×1000 (portrait) |
| Gallery media | Gallery page + homepage preview | Paste approved image URLs in Admin → Gallery (Source URL) | WebP/JPEG, ≥1200px wide |
| Social-sharing image | Open Graph / Twitter cards | Overwrite `frontend/public/og-image.svg` (or og-image.png, 1200×630) and set absolute URLs in index.html once the domain is live | PNG/WebP, 1200×630 |

No file uploads exist by design; images are referenced by URL.

## Backup & recovery
Content lives in one MongoDB collection (`site_content`) with one document
per domain: announcements, leaderboard, teams, schedule, gallery, site,
rules. Organizer accounts live in `users`.

Export (backup):
- With mongosh access: `mongodump --uri="YOUR-MONGO-URL" --db=YOUR-DB-NAME --collection=site_content --out=/safe/location`
- Or use the database provider's snapshot/backup feature (recommended —
  schedule daily snapshots).

Restore:
- `mongorestore --uri="YOUR-MONGO-URL" --db=YOUR-DB-NAME /safe/location/YOUR-DB-NAME`
- Verify by calling `GET /api/public/{domain}` for each domain and checking
  the admin dashboard shows the expected content.

Schedule:
- Take a backup right before tournament weekend (after content entry).
- Take another after the event ends (final scores, announcements, photos).
- Provider snapshots cover disaster recovery; exports cover quick rollbacks.

## Monitoring & failure readiness
- Health endpoint: `GET /api/health` returns `{"status":"ok"}` when the
  backend and database are healthy, `{"status":"degraded"}` otherwise. It
  exposes no secrets, configuration, or stack traces.
- Backend-unavailable behavior: public pages keep rendering from built-in
  fallback content; admin shows a visible error and re-login prompt.
- Authentication failures: clear messages on the login page; repeated
  failures lock the account for 15 minutes.
- Database failures: logged in backend logs (`/var/log/supervisor/backend.*.log`
  on the server, or the provider's log viewer).
- Recognizing an outage: health endpoint not "ok", or admin login fails for
  everyone, or public pages show fallback content unexpectedly.
- Restart: `sudo supervisorctl restart backend` / `... restart frontend` on
  the server, or the hosting provider's redeploy action.
- After restart: check /api/health, open the homepage, open Admin → Dashboard.
