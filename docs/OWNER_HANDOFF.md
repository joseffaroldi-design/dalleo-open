# Owner Handoff Guide — Dalleo Open Digital Clubhouse

## Accessing Admin
Go to `/admin/login` and sign in with the organizer email and the password
set during launch. (The password is never written down in the project — ask
whoever configured the backend environment.)

## Changing scores
Admin → Leaderboard. Edit a team's Total points, set the round name and
status, update the "Last updated" text, and press Save Changes. Standings
re-sort automatically by points. Turn "Scoring has started" on when play
begins.

## Posting announcements
Admin → Announcements → Add Announcement. Fill in title, message, and date
label, mark Important if needed, switch Published on, Apply, then Save
Changes. The three most recent published announcements appear on the
homepage. Unpublished ones stay hidden.

## Editing teams
Admin → Teams. Each card edits name, color label, captain, and motto. The
roster box takes one player per line — the first line is shown as Captain.
The publication toggle shows or hides the whole Teams page content.

## Updating the schedule
Admin → Schedule. Add, edit, or delete events per day (deleting asks for
confirmation). Set one event as "current" to feature it as Happening Now on
the Schedule page and homepage. Use the publish toggle to show or hide the
full schedule.

## Updating memorial content
Admin → Site Content → Memorial Page section: hero title/subtitle, story
paragraphs (one per line), milestones, closing message, publication toggle,
and the Share a Memory visibility toggle.

## Approving rules
Admin → Rules. Edit any text, then when the final wording is signed off,
switch on "Approved by organizers" and save — the public draft notice hides.
The publish toggle controls whether the rules page is visible at all.

## Updating gallery images
Admin → Gallery. Edit an item and paste the approved image URL into Source
URL (leave empty for a placeholder tile). Set captions, alt text, category,
year, display order (lower shows first), and Featured for the homepage-style
highlight. Publish toggle per item and for the whole gallery.

## Logging out
Press Logout in the admin header. Always log out on shared devices.

## If your session expires
Sessions last 12 hours. If you're redirected to the login page, sign in
again — nothing is lost; saved content persists.

## If the site or backend is unavailable
- Public pages keep working from built-in backup content even if the
  database is unreachable, so visitors rarely see a failure.
- Check `https://YOUR-BACKEND/api/health` — `{"status":"ok"}` means the
  backend and database are fine.
- If health fails, restart the backend (hosting provider's restart/redeploy,
  or `sudo supervisorctl restart backend` on the server), then re-check
  health. Restart the frontend similarly if pages won't load at all.
- After any restart, open the homepage and Admin → Dashboard to confirm
  everything is healthy.

## Rotating the organizer password securely
Follow the reseed procedure: set a new `ADMIN_PASSWORD` in the backend
environment only, restart the backend, and sign in with the new password.
Never write the password into files, chats, or tickets.
