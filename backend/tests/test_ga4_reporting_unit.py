from types import SimpleNamespace

import pytest

import ga4_reporting


def _value(value):
    return SimpleNamespace(value=str(value))


def _row(dimensions=(), metrics=()):
    return SimpleNamespace(
        dimension_values=[_value(value) for value in dimensions],
        metric_values=[_value(value) for value in metrics],
    )


class FakeAnalyticsClient:
    def __init__(self):
        self.realtime_calls = 0
        self.report_calls = 0

    def run_realtime_report(self, request):
        self.realtime_calls += 1
        return SimpleNamespace(rows=[_row(metrics=(3,))])

    def run_report(self, request):
        self.report_calls += 1
        dimensions = [dimension.name for dimension in request.dimensions]
        if not dimensions:
            return SimpleNamespace(rows=[_row(metrics=(21, 87))])
        if dimensions == ["eventName"]:
            return SimpleNamespace(
                rows=[
                    _row(("leaderboard_view",), (30,)),
                    _row(("team_view",), (14,)),
                    _row(("captain_login",), (6,)),
                    _row(("score_submitted",), (42,)),
                    _row(("page_view",), (87,)),
                ]
            )
        if dimensions == ["pagePath"]:
            return SimpleNamespace(
                rows=[
                    _row(("/teams",), (18,)),
                    _row(("/leaderboard",), (40,)),
                    _row(("/admin",), (100,)),
                    _row(("/schedule",), (12,)),
                ]
            )
        raise AssertionError(f"Unexpected dimensions: {dimensions}")


def test_missing_config_is_explicit(monkeypatch):
    monkeypatch.delenv("GA4_PROPERTY_ID", raising=False)
    monkeypatch.delenv("GA4_SERVICE_ACCOUNT_JSON", raising=False)
    with pytest.raises(ga4_reporting.GA4NotConfigured):
        ga4_reporting._build_client()


def test_summary_shape_filters_admin_and_uses_cache(monkeypatch):
    client = FakeAnalyticsClient()
    monkeypatch.setattr(ga4_reporting, "_build_client", lambda: (client, "properties/123456"))
    ga4_reporting._CACHE["data"] = None
    ga4_reporting._CACHE["expires_at"] = 0.0

    result = ga4_reporting.get_site_activity_summary()

    assert result["liveNow"] == 3
    assert result["visitorsToday"] == 21
    assert result["pageViewsToday"] == 87
    assert result["events"] == {
        "leaderboardViews": 30,
        "teamViews": 14,
        "captainLogins": 6,
        "scoresSubmitted": 42,
    }
    assert result["topPages"] == [
        {"path": "/leaderboard", "views": 40},
        {"path": "/teams", "views": 18},
        {"path": "/schedule", "views": 12},
    ]

    again = ga4_reporting.get_site_activity_summary()
    assert again is result
    assert client.realtime_calls == 1
    assert client.report_calls == 3
