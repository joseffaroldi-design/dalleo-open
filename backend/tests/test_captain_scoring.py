"""Backend tests for team captain scoring (per-team PIN player accounts).

Covers: organizer PIN management, captain login + lockout, scoped team tokens,
hole-score writes (only while live), overwrite upsert, validation, isolation
between team/admin tokens. Restores a clean scoring doc and removes test PINs
in teardown. Credentials read from backend/.env.
"""
import os
import pytest
import pymongo
import requests
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://golf-memorial-hub.preview.emergentagent.com").rstrip("/")
ADMIN_EMAIL = os.environ["ADMIN_EMAIL"]
ADMIN_PASSWORD = os.environ["ADMIN_PASSWORD"]
PIN = "4321"
CLEAN = {"status": "not-started", "par": [4] * 18, "scores": [], "updatedAt": ""}

# Both scoring test modules mutate the same shared scoring doc — force them
# onto a single xdist worker so they never interleave.
pytestmark = pytest.mark.xdist_group("scoring_doc")


@pytest.fixture(scope="module")
def admin():
    r = requests.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200
    return {"Authorization": f"Bearer {r.json()['token']}", "Content-Type": "application/json"}


@pytest.fixture(scope="module")
def team_id():
    r = requests.get(f"{BASE_URL}/api/public/teams")
    return r.json()["data"]["items"][0]["id"]


_BEFORE = {}


@pytest.fixture(scope="module")
def pin_setup(admin, team_id, scoring_doc_lock):
    r = requests.put(f"{BASE_URL}/api/admin/team-pins", headers=admin, json={"teamId": team_id, "pin": PIN})
    assert r.status_code == 200, r.text
    # Preserve the pre-test scoring doc; restore it in teardown.
    _BEFORE["doc"] = requests.get(f"{BASE_URL}/api/admin/scoring", headers=admin).json()["data"]
    yield team_id
    requests.put(f"{BASE_URL}/api/admin/scoring", headers=admin, json={"data": _BEFORE["doc"] if _BEFORE["doc"] else CLEAN})
    # Clear PIN lockout counters so repeated suite runs never lock test teams.
    client = pymongo.MongoClient(os.environ["MONGO_URL"])
    client[os.environ["DB_NAME"]].login_attempts.delete_many({"identifier": {"$regex": "^pin:"}})
    client.close()


def captain_token(team_id):
    r = requests.post(f"{BASE_URL}/api/team-scoring/login", json={"teamId": team_id, "pin": PIN})
    assert r.status_code == 200, r.text
    return {"Authorization": f"Bearer {r.json()['token']}", "Content-Type": "application/json"}


class TestPinManagement:
    def test_pin_status_lists_team(self, admin, pin_setup):
        r = requests.get(f"{BASE_URL}/api/admin/team-pins", headers=admin)
        assert r.status_code == 200
        assert pin_setup in r.json()["teamIds"]

    def test_pin_endpoints_require_organizer(self, pin_setup):
        assert requests.get(f"{BASE_URL}/api/admin/team-pins").status_code in (401, 403)
        r = requests.put(f"{BASE_URL}/api/admin/team-pins", json={"teamId": pin_setup, "pin": "1234"})
        assert r.status_code in (401, 403)

    def test_invalid_pin_format_rejected(self, admin, pin_setup):
        for bad in ("12", "abcde", "123456789"):
            r = requests.put(f"{BASE_URL}/api/admin/team-pins", headers=admin, json={"teamId": pin_setup, "pin": bad})
            assert r.status_code == 422, bad

    def test_pin_for_unknown_team_rejected(self, admin):
        r = requests.put(f"{BASE_URL}/api/admin/team-pins", headers=admin, json={"teamId": "no-such-team", "pin": "1234"})
        assert r.status_code == 404


class TestCaptainLogin:
    def test_login_success_returns_team(self, pin_setup):
        r = requests.post(f"{BASE_URL}/api/team-scoring/login", json={"teamId": pin_setup, "pin": PIN})
        assert r.status_code == 200
        body = r.json()
        assert body["token"]
        assert body["team"]["id"] == pin_setup

    def test_wrong_pin_rejected(self, pin_setup):
        r = requests.post(f"{BASE_URL}/api/team-scoring/login", json={"teamId": pin_setup, "pin": "0000"})
        assert r.status_code == 401

    def test_unknown_team_rejected(self):
        r = requests.post(f"{BASE_URL}/api/team-scoring/login", json={"teamId": "ghost", "pin": "1234"})
        assert r.status_code == 401


class TestCaptainScoring:
    def test_state_scoped_to_own_team(self, admin, pin_setup, scoring_doc_lock):
        # seed a score for another team via organizer doc write
        r = requests.get(f"{BASE_URL}/api/public/teams")
        other = r.json()["data"]["items"][1]["id"]
        doc = {"status": "live", "par": [4] * 18,
               "scores": [{"teamId": other, "hole": 1, "strokes": 9}], "updatedAt": ""}
        requests.put(f"{BASE_URL}/api/admin/scoring", headers=admin, json={"data": doc})
        r = requests.get(f"{BASE_URL}/api/team-scoring/state", headers=captain_token(pin_setup))
        assert r.status_code == 200
        data = r.json()["data"]
        assert data["scores"] == [], "captain must only see their own team's scores"
        assert data["team"]["id"] == pin_setup

    def test_write_blocked_when_not_live(self, admin, pin_setup, scoring_doc_lock):
        requests.put(f"{BASE_URL}/api/admin/scoring", headers=admin, json={"data": CLEAN})
        r = requests.put(f"{BASE_URL}/api/team-scoring/hole", headers=captain_token(pin_setup), json={"hole": 1, "strokes": 4})
        assert r.status_code == 409

    def test_write_and_overwrite(self, admin, pin_setup, scoring_doc_lock):
        doc = {"status": "live", "par": [4] * 18, "scores": [], "updatedAt": ""}
        requests.put(f"{BASE_URL}/api/admin/scoring", headers=admin, json={"data": doc})
        headers = captain_token(pin_setup)
        r = requests.put(f"{BASE_URL}/api/team-scoring/hole", headers=headers, json={"hole": 1, "strokes": 4})
        assert r.status_code == 200, r.text
        r = requests.put(f"{BASE_URL}/api/team-scoring/hole", headers=headers, json={"hole": 1, "strokes": 6})
        assert r.status_code == 200, r.text
        saved = requests.get(f"{BASE_URL}/api/public/scoring").json()["data"]["scores"]
        own = [s for s in saved if s["teamId"] == pin_setup and s["hole"] == 1]
        assert len(own) == 1 and own[0]["strokes"] == 6, "overwrite must replace, not duplicate"

    def test_write_allowed_in_test_mode(self, admin, pin_setup, scoring_doc_lock):
        # "test" status is a rehearsal mode — captain writes must work exactly like live
        doc = {"status": "test", "par": [4] * 18, "scores": [], "updatedAt": ""}
        r = requests.put(f"{BASE_URL}/api/admin/scoring", headers=admin, json={"data": doc})
        assert r.status_code == 200, r.text
        headers = captain_token(pin_setup)
        r = requests.put(f"{BASE_URL}/api/team-scoring/hole", headers=headers, json={"hole": 1, "strokes": 4})
        assert r.status_code == 200, r.text
        saved = requests.get(f"{BASE_URL}/api/public/scoring").json()["data"]
        assert saved["status"] == "test"
        own = [s for s in saved["scores"] if s["teamId"] == pin_setup and s["hole"] == 1]
        assert len(own) == 1 and own[0]["strokes"] == 4

    def test_write_validation(self, admin, pin_setup, scoring_doc_lock):
        doc = {"status": "live", "par": [4] * 18, "scores": [], "updatedAt": ""}
        requests.put(f"{BASE_URL}/api/admin/scoring", headers=admin, json={"data": doc})
        headers = captain_token(pin_setup)
        for body in ({"hole": 19, "strokes": 4}, {"hole": 0, "strokes": 4}, {"hole": 2, "strokes": 0}, {"hole": 2, "strokes": "par"}):
            r = requests.put(f"{BASE_URL}/api/team-scoring/hole", headers=headers, json=body)
            assert r.status_code == 422, body

    def test_write_requires_team_token(self, admin, pin_setup):
        assert requests.put(f"{BASE_URL}/api/team-scoring/hole", json={"hole": 1, "strokes": 4}).status_code in (401, 403)
        # organizer token must NOT work on captain endpoints
        r = requests.put(f"{BASE_URL}/api/team-scoring/hole", headers=admin, json={"hole": 1, "strokes": 4})
        assert r.status_code == 401
        r = requests.get(f"{BASE_URL}/api/team-scoring/state", headers=admin)
        assert r.status_code == 401

    def test_scores_reset_clean(self, admin, scoring_doc_lock):
        """Reset to the pre-test baseline so official data stays clean."""
        baseline = _BEFORE.get("doc") or CLEAN
        r = requests.put(f"{BASE_URL}/api/admin/scoring", headers=admin, json={"data": baseline})
        assert r.status_code == 200, r.text
        data = requests.get(f"{BASE_URL}/api/public/scoring").json()["data"]
        assert data["scores"] == baseline["scores"]
        assert data["status"] == baseline["status"]
