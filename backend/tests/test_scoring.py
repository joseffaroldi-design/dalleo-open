"""Backend tests for 2026 tournament scoring readiness.

Runs a complete simulated tournament through the real API — 8 teams x 18 holes,
ties during the round, one score correction, winner by lowest total — then
restores the scoring doc to its pre-test state so official data stays clean.
Credentials are read from backend/.env, never hardcoded.
"""
import os
import pytest
import requests
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://golf-memorial-hub.preview.emergentagent.com").rstrip("/")
ADMIN_EMAIL = os.environ["ADMIN_EMAIL"]
ADMIN_PASSWORD = os.environ["ADMIN_PASSWORD"]

EMPTY_DOC = {"status": "not-started", "par": [4] * 18, "scores": [], "updatedAt": ""}


def make_scores(team_ids, totals):
    """18 scores per team summing to the given totals (par-4 baseline)."""
    scores = []
    for team_id, total in zip(team_ids, totals):
        holes = [4] * 18
        delta = total - 72
        step = 1 if delta > 0 else -1
        for i in range(abs(delta)):
            holes[i] += step
        for h, strokes in enumerate(holes, start=1):
            scores.append({"teamId": team_id, "hole": h, "strokes": strokes})
    return scores


@pytest.fixture(scope="module")
def token():
    r = requests.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    return r.json()["token"]


@pytest.fixture(scope="module")
def auth(token):
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


@pytest.fixture(scope="module")
def team_ids():
    r = requests.get(f"{BASE_URL}/api/public/teams")
    assert r.status_code == 200
    items = r.json()["data"]["items"]
    assert len(items) == 8, f"expected exactly 8 teams, found {len(items)}"
    for t in items:
        assert len(t["players"]) == 4, f"{t['name']} should have 4 players"
    return [t["id"] for t in items]


@pytest.fixture(scope="module")
def snapshot(auth):
    """Preserve the pre-test scoring doc; restore it after the module."""
    r = requests.get(f"{BASE_URL}/api/admin/scoring", headers=auth)
    assert r.status_code == 200
    original = r.json()["data"]
    yield original
    restore = original if original else EMPTY_DOC
    requests.put(f"{BASE_URL}/api/admin/scoring", headers=auth, json={"data": restore})


class TestSimulatedTournament:
    TOTALS = [68, 71, 71, 73, 73, 74, 76, 78]  # winner 68, two pairs of ties

    def test_full_round_persists(self, auth, team_ids, snapshot):
        doc = {"status": "live", "par": [4] * 18, "scores": make_scores(team_ids, self.TOTALS), "updatedAt": ""}
        r = requests.put(f"{BASE_URL}/api/admin/scoring", headers=auth, json={"data": doc})
        assert r.status_code == 200, r.text
        r = requests.get(f"{BASE_URL}/api/public/scoring")
        saved = r.json()["data"]
        assert len(saved["scores"]) == 8 * 18
        assert saved["status"] == "live"
        assert saved["updatedAt"], "server should stamp updatedAt"

    def test_winner_and_ties(self, auth, team_ids, snapshot):
        r = requests.get(f"{BASE_URL}/api/public/scoring")
        scores = r.json()["data"]["scores"]
        totals = {t: sum(s["strokes"] for s in scores if s["teamId"] == t) for t in team_ids}
        ordered = sorted(totals.values())
        assert ordered == sorted(self.TOTALS)
        winner = min(totals, key=totals.get)
        assert totals[winner] == 68
        assert list(totals.values()).count(71) == 2, "expected a tie at 71"
        assert list(totals.values()).count(73) == 2, "expected a tie at 73"

    def test_score_correction(self, auth, team_ids, snapshot):
        r = requests.get(f"{BASE_URL}/api/public/scoring")
        doc = r.json()["data"]
        target = team_ids[5]
        before = sum(s["strokes"] for s in doc["scores"] if s["teamId"] == target)
        doc["scores"] = [
            {**s, "strokes": 3} if (s["teamId"] == target and s["hole"] == 1) else s
            for s in doc["scores"]
        ]
        r = requests.put(f"{BASE_URL}/api/admin/scoring", headers=auth, json={"data": doc})
        assert r.status_code == 200, r.text
        r = requests.get(f"{BASE_URL}/api/public/scoring")
        after = sum(s["strokes"] for s in r.json()["data"]["scores"] if s["teamId"] == target)
        assert after == before - 2, "correction should update the running total"
        # exactly one record per team+hole after correction
        pairs = [(s["teamId"], s["hole"]) for s in r.json()["data"]["scores"]]
        assert len(pairs) == len(set(pairs))

    def test_final_status(self, auth, team_ids, snapshot):
        r = requests.get(f"{BASE_URL}/api/public/scoring")
        doc = {**r.json()["data"], "status": "final"}
        r = requests.put(f"{BASE_URL}/api/admin/scoring", headers=auth, json={"data": doc})
        assert r.status_code == 200
        assert requests.get(f"{BASE_URL}/api/public/scoring").json()["data"]["status"] == "final"


class TestScoringSafety:
    def base_doc(self, auth):
        r = requests.get(f"{BASE_URL}/api/public/scoring")
        return r.json()["data"] or EMPTY_DOC

    def test_hole_out_of_range_rejected(self, auth, team_ids):
        doc = {**EMPTY_DOC, "scores": [{"teamId": team_ids[0], "hole": 19, "strokes": 4}]}
        r = requests.put(f"{BASE_URL}/api/admin/scoring", headers=auth, json={"data": doc})
        assert r.status_code == 422

    def test_zero_and_negative_scores_rejected(self, auth, team_ids):
        for bad in (0, -2):
            doc = {**EMPTY_DOC, "scores": [{"teamId": team_ids[0], "hole": 1, "strokes": bad}]}
            r = requests.put(f"{BASE_URL}/api/admin/scoring", headers=auth, json={"data": doc})
            assert r.status_code == 422

    def test_non_numeric_score_rejected(self, auth, team_ids):
        doc = {**EMPTY_DOC, "scores": [{"teamId": team_ids[0], "hole": 1, "strokes": "par"}]}
        r = requests.put(f"{BASE_URL}/api/admin/scoring", headers=auth, json={"data": doc})
        assert r.status_code == 422

    def test_duplicate_team_hole_rejected(self, auth, team_ids):
        doc = {**EMPTY_DOC, "scores": [
            {"teamId": team_ids[0], "hole": 1, "strokes": 4},
            {"teamId": team_ids[0], "hole": 1, "strokes": 5},
        ]}
        r = requests.put(f"{BASE_URL}/api/admin/scoring", headers=auth, json={"data": doc})
        assert r.status_code == 422
        assert "duplicate" in r.json()["detail"].lower()

    def test_par_validation(self, auth):
        bad_len = {**EMPTY_DOC, "par": [4] * 17}
        assert requests.put(f"{BASE_URL}/api/admin/scoring", headers=auth, json={"data": bad_len}).status_code == 422
        bad_val = {**EMPTY_DOC, "par": [4] * 17 + [7]}
        assert requests.put(f"{BASE_URL}/api/admin/scoring", headers=auth, json={"data": bad_val}).status_code == 422

    def test_unauthenticated_write_rejected(self):
        r = requests.put(f"{BASE_URL}/api/admin/scoring", json={"data": EMPTY_DOC})
        assert r.status_code in (401, 403)

    def test_public_read_is_open(self):
        assert requests.get(f"{BASE_URL}/api/public/scoring").status_code == 200

    def test_nine_teams_rejected(self, auth):
        r = requests.get(f"{BASE_URL}/api/public/teams")
        items = r.json()["data"]["items"]
        ninth = {**items[0], "id": "team-ninth", "name": "Ninth Team"}
        doc = {"published": True, "items": [*items, ninth]}
        r = requests.put(f"{BASE_URL}/api/admin/teams", headers=auth, json={"data": doc})
        assert r.status_code == 422


class TestScoringCleanup:
    def test_scores_reset_after_simulation(self, auth, snapshot):
        """Reset the scoring doc so the official tournament starts clean."""
        restore = snapshot if snapshot else EMPTY_DOC
        r = requests.put(f"{BASE_URL}/api/admin/scoring", headers=auth, json={"data": restore})
        assert r.status_code == 200, r.text
        r = requests.get(f"{BASE_URL}/api/public/scoring")
        data = r.json()["data"]
        if snapshot is None:
            assert data["scores"] == []
            assert data["status"] == "not-started"
        else:
            assert data["scores"] == snapshot["scores"]
            assert data["status"] == snapshot["status"]
