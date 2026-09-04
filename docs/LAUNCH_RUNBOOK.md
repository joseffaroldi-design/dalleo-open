# Dalleo Open — Launch Runbook

Follow these steps in order. Do not purchase domains or create external
accounts without owner authorization.

## 1. Configure production environment variables
Backend (hosting provider env panel, never in source control):
- `MONGO_URL` — production MongoDB connection string (from your DB provider)
- `DB_NAME` — production database name
- `JWT_SECRET` — generate a fresh 64-char hex secret (`python3 -c "import secrets;print(secrets.token_hex(32))"`)
- `ADMIN_EMAIL` — organizer login email (default organizer@dalleoopen.com)
- `ADMIN_PASSWORD` — a strong password chosen at launch time (never written to any file)
- `CORS_ORIGINS` — the production frontend origin only, e.g. `https://www.your-domain.com`

Frontend:
- `REACT_APP_BACKEND_URL` — the production backend URL

## 2. Configure MongoDB production database
Create the database with your provider. The app creates its collections and
indexes automatically on first startup. No migration needed.

## 3. Deploy backend
Deploy with the environment variables above. Confirm the process starts
without errors in the provider logs.

## 4. Verify backend health
`GET https://YOUR-BACKEND/api/health` must return `{"status":"ok"}`.
The health response exposes no sensitive information.

## 5. Deploy frontend
Run the production build (`CI=true yarn build`) and deploy the `build/` output.

## 6. Configure frontend/backend URLs
Confirm the frontend's `REACT_APP_BACKEND_URL` points at the deployed backend
and that every page loads.

## 7. Configure CORS
Set `CORS_ORIGINS` to the exact frontend origin (no wildcard in production).
Verify an unknown origin receives no `Access-Control-Allow-Origin` header.

## 8. Connect custom domain
Point the domain at the frontend host per the provider's instructions.
Then update: `CORS_ORIGINS`, `REACT_APP_BACKEND_URL` (if the backend URL
changes), `robots.txt` sitemap line, `sitemap.xml` URLs, and the canonical /
Open Graph absolute URLs noted in `public/index.html`.

## 9. Verify HTTPS
Confirm the site loads over HTTPS and HTTP redirects to HTTPS.

## 10. Set the organizer password securely
Use the reseed procedure in /app/memory/test_credentials.md. The password
lives only in the backend environment — never in files or reports.

## 11. Log into Admin
Visit /admin/login and sign in.

## 12. Enter approved real content
Follow docs/CONTENT_ENTRY_CHECKLIST.md section by section.

## 13. Approve final rules
In Admin → Rules, after owner sign-off, switch on "Approved by organizers"
and save. The public draft notice disappears.

## 14. Publish teams and schedule
Confirm the published toggles are on in Admin → Teams and Admin → Schedule.

## 15. Test one announcement
Create a test announcement, publish it, confirm it appears on the homepage,
then delete it.

## 16. Test one temporary leaderboard update
Change one team's points, confirm the public leaderboard re-sorts, then
restore the correct value.

## 17. Remove test content
Delete any test announcements, events, or scores from the admin.

## 18. Perform mobile and desktop checks
Open every public page on a phone and a desktop. Confirm no horizontal
scrolling and readable text.

## 19. Take pre-launch backup
Export the database (see docs/OPERATIONS.md — Backup & Recovery).

## 20. Announce the official link
Share the production URL with participants.
