# GA4 Site Activity setup

The Dalleo Open admin Dashboard Home now has a read-only **Site Activity** panel backed by the Google Analytics Data API.

The existing browser-side GA4 tracking is unchanged. This setup only grants the backend permission to read aggregate reports back from the GA4 property.

## Required environment variables

Set these as backend/server secrets in the deployment environment. Do not put them in React environment variables or commit them to GitHub.

- `GA4_PROPERTY_ID` — the numeric GA4 Property ID, for example `123456789`.
- `GA4_SERVICE_ACCOUNT_JSON` — the complete JSON key for a Google Cloud service account, stored as a single secret value.

The existing browser-side measurement ID (`REACT_APP_GA_MEASUREMENT_ID`) remains separate and should continue to be set to the production `G-...` value.

## Google setup

1. In Google Cloud, select or create a project for Dalleo Open.
2. Enable **Google Analytics Data API v1** for that project.
3. Create a service account dedicated to read-only Dalleo Open analytics.
4. Create a JSON key for that service account and save it securely.
5. In Google Analytics, open the Dalleo Open GA4 property and go to **Admin → Property Access Management**.
6. Add the service account email and grant the minimum read-only role needed to view reports (Viewer is sufficient for this dashboard).
7. Copy the GA4 property's numeric **Property ID** from the property settings.
8. Add `GA4_PROPERTY_ID` and `GA4_SERVICE_ACCOUNT_JSON` to the backend deployment secrets and redeploy.

## Dashboard behavior

The authenticated admin endpoint is:

`GET /api/admin/analytics/summary`

It returns only aggregate analytics:

- Live Now
- Visitors Today
- Page Views Today
- Leaderboard Views
- Team Views (available in the API response)
- Captain Logins
- Scores Submitted
- Top 5 public pages today

The dashboard displays six primary metrics plus Top Pages Today. Admin paths are filtered out of the top-pages list.

Results are cached server-side for 90 seconds. If Google Analytics is not configured or temporarily unavailable, the Site Activity section shows a contained unavailable state and the rest of the admin dashboard continues to work normally.

## Security notes

- The reporting endpoint requires the existing organizer authentication.
- Google service-account credentials remain server-side only.
- The frontend never receives or stores Google credentials.
- The integration uses the read-only Analytics scope.
- Existing GA4 tracking, captain PIN handling, scoring behavior, and Emergent/PostHog analytics are not modified.
