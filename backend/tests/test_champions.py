"""Backend tests for Champions Trophy Wall feature."""
import os
import pytest
import requests
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://golf-memorial-hub.preview.emergentagent.com").rstrip("/")
ADMIN_EMAIL = os.environ["ADMIN_EMAIL"]
ADMIN_PASSWORD = os.environ["ADMIN_PASSWORD"]


@pytest.fixture(scope="module")
def token():
    r = requests.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    return r.json()["token"]


@pytest.fixture(scope="module")
def auth_headers(token):
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


def unwrap(r):
    body = r.json()
    return body.get("data", body)


class TestPublicChampions:
    def test_public_champions_shape(self):
        r = requests.get(f"{BASE_URL}/api/public/champions")
        assert r.status_code == 200
        d = unwrap(r)
        assert d["published"] is True
        assert len(d["entries"]) == 6
        assert len(d["records"]) == 10
        years = sorted([e["year"] for e in d["entries"]])
        assert years == [2020, 2021, 2022, 2023, 2024, 2025]
        for e in d["entries"]:
            assert e["placeholder"] is True
            assert e["teamName"]
            assert e["captain"]
            assert e["finalScore"]

    def test_records_have_expected_ids(self):
        r = requests.get(f"{BASE_URL}/api/public/champions")
        d = unwrap(r)
        ids = {rec["id"] for rec in d["records"]}
        expected = {"rec-low-score", "rec-big-margin", "rec-closest", "rec-most-titles",
                    "rec-most-apps", "rec-long-drive", "rec-ctp", "rec-low-hole",
                    "rec-comeback", "rec-ace"}
        assert expected.issubset(ids)


class TestAdminChampions:
    def test_admin_get(self, auth_headers):
        r = requests.get(f"{BASE_URL}/api/admin/champions", headers=auth_headers)
        assert r.status_code == 200
        d = unwrap(r)
        assert len(d["entries"]) == 6

    def test_admin_put_invalid_year_rejected(self, auth_headers):
        r = requests.get(f"{BASE_URL}/api/admin/champions", headers=auth_headers)
        d = unwrap(r)
        entries = [{**d["entries"][0], "year": 1800}] + d["entries"][1:]
        payload = {"data": {**d, "entries": entries}}
        r2 = requests.put(f"{BASE_URL}/api/admin/champions", headers=auth_headers, json=payload)
        assert r2.status_code == 422, f"Expected 422 for year 1800, got {r2.status_code}: {r2.text[:200]}"

    def test_admin_put_empty_teamname_rejected(self, auth_headers):
        r = requests.get(f"{BASE_URL}/api/admin/champions", headers=auth_headers)
        d = unwrap(r)
        entries = [{**d["entries"][0], "teamName": ""}] + d["entries"][1:]
        payload = {"data": {**d, "entries": entries}}
        r2 = requests.put(f"{BASE_URL}/api/admin/champions", headers=auth_headers, json=payload)
        assert r2.status_code == 422, f"Expected 422 for empty teamName, got {r2.status_code}: {r2.text[:200]}"

    def test_admin_edit_and_restore(self, auth_headers):
        """Edit 2025 team name, verify persistence, restore back."""
        r = requests.get(f"{BASE_URL}/api/admin/champions", headers=auth_headers)
        d = unwrap(r)
        original_2025 = next(e for e in d["entries"] if e["year"] == 2025)
        original_name = original_2025["teamName"]
        assert original_name == "Team Caddie"

        # Edit
        new_entries = [{**e, "teamName": "Team Backend Test"} if e["year"] == 2025 else e for e in d["entries"]]
        payload = {"data": {**d, "entries": new_entries}}
        r2 = requests.put(f"{BASE_URL}/api/admin/champions", headers=auth_headers, json=payload)
        assert r2.status_code == 200, r2.text[:300]

        # Verify via public
        rp = requests.get(f"{BASE_URL}/api/public/champions")
        dp = unwrap(rp)
        e2025 = next(e for e in dp["entries"] if e["year"] == 2025)
        assert e2025["teamName"] == "Team Backend Test"

        # Restore
        restore_entries = [{**e, "teamName": original_name} if e["year"] == 2025 else e for e in new_entries]
        payload = {"data": {**d, "entries": restore_entries}}
        r3 = requests.put(f"{BASE_URL}/api/admin/champions", headers=auth_headers, json=payload)
        assert r3.status_code == 200

        rp2 = requests.get(f"{BASE_URL}/api/public/champions")
        dp2 = unwrap(rp2)
        e2025b = next(e for e in dp2["entries"] if e["year"] == 2025)
        assert e2025b["teamName"] == "Team Caddie"

    def test_admin_unauthorized(self):
        r = requests.get(f"{BASE_URL}/api/admin/champions")
        assert r.status_code in (401, 403)


class TestRegressionOtherDomains:
    """Ensure other public domains still respond 200."""

    @pytest.mark.parametrize("domain", [
        "announcements", "leaderboard", "teams", "schedule", "gallery", "site", "rules",
    ])
    def test_public_domain_ok(self, domain):
        r = requests.get(f"{BASE_URL}/api/public/{domain}")
        assert r.status_code == 200, f"{domain} returned {r.status_code}"
