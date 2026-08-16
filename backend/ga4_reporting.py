import json
import os
import threading
import time
from datetime import datetime, timezone

from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import DateRange, Dimension, Metric, RunRealtimeReportRequest, RunReportRequest
from google.oauth2 import service_account


CACHE_SECONDS = 90
_ANALYTICS_SCOPE = "https://www.googleapis.com/auth/analytics.readonly"
_CACHE = {"expires_at": 0.0, "data": None}
_CACHE_LOCK = threading.Lock()


class GA4NotConfigured(RuntimeError):
    pass


def _int(value):
    try:
        return int(value)
    except (TypeError, ValueError):
        return 0


def _build_client():
    property_id = os.environ.get("GA4_PROPERTY_ID", "").strip()
    credentials_json = os.environ.get("GA4_SERVICE_ACCOUNT_JSON", "").strip()

    if not property_id or not property_id.isdigit() or not credentials_json:
        raise GA4NotConfigured("Site Activity is not configured yet")

    try:
        info = json.loads(credentials_json)
    except json.JSONDecodeError as exc:
        raise GA4NotConfigured("Site Activity credentials are not configured correctly") from exc

    if not info.get("client_email") or not info.get("private_key"):
        raise GA4NotConfigured("Site Activity credentials are incomplete")

    credentials = service_account.Credentials.from_service_account_info(
        info,
        scopes=[_ANALYTICS_SCOPE],
    )
    return BetaAnalyticsDataClient(credentials=credentials), f"properties/{property_id}"


def _first_metrics(response, count):
    if not response.rows:
        return [0] * count
    values = response.rows[0].metric_values
    return [_int(values[index].value) if index < len(values) else 0 for index in range(count)]


def _fetch_summary():
    client, property_name = _build_client()

    realtime = client.run_realtime_report(
        RunRealtimeReportRequest(
            property=property_name,
            metrics=[Metric(name="activeUsers")],
        )
    )
    live_now = _first_metrics(realtime, 1)[0]

    overview = client.run_report(
        RunReportRequest(
            property=property_name,
            date_ranges=[DateRange(start_date="today", end_date="today")],
            metrics=[Metric(name="activeUsers"), Metric(name="screenPageViews")],
        )
    )
    visitors_today, page_views_today = _first_metrics(overview, 2)

    events_report = client.run_report(
        RunReportRequest(
            property=property_name,
            date_ranges=[DateRange(start_date="today", end_date="today")],
            dimensions=[Dimension(name="eventName")],
            metrics=[Metric(name="eventCount")],
            limit=100,
        )
    )
    event_counts = {}
    for row in events_report.rows:
        if row.dimension_values and row.metric_values:
            event_counts[row.dimension_values[0].value] = _int(row.metric_values[0].value)

    pages_report = client.run_report(
        RunReportRequest(
            property=property_name,
            date_ranges=[DateRange(start_date="today", end_date="today")],
            dimensions=[Dimension(name="pagePath")],
            metrics=[Metric(name="screenPageViews")],
            limit=100,
        )
    )
    pages = []
    for row in pages_report.rows:
        if not row.dimension_values or not row.metric_values:
            continue
        path = row.dimension_values[0].value or "/"
        if path.startswith("/admin"):
            continue
        pages.append({"path": path, "views": _int(row.metric_values[0].value)})
    pages.sort(key=lambda item: item["views"], reverse=True)

    return {
        "liveNow": live_now,
        "visitorsToday": visitors_today,
        "pageViewsToday": page_views_today,
        "events": {
            "leaderboardViews": event_counts.get("leaderboard_view", 0),
            "teamViews": event_counts.get("team_view", 0),
            "captainLogins": event_counts.get("captain_login", 0),
            "scoresSubmitted": event_counts.get("score_submitted", 0),
        },
        "topPages": pages[:5],
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "cacheSeconds": CACHE_SECONDS,
    }


def get_site_activity_summary():
    now = time.monotonic()
    cached = _CACHE.get("data")
    if cached is not None and now < _CACHE.get("expires_at", 0.0):
        return cached

    with _CACHE_LOCK:
        now = time.monotonic()
        cached = _CACHE.get("data")
        if cached is not None and now < _CACHE.get("expires_at", 0.0):
            return cached

        data = _fetch_summary()
        _CACHE["data"] = data
        _CACHE["expires_at"] = now + CACHE_SECONDS
        return data
