import asyncio
from copy import deepcopy
from types import SimpleNamespace

from fastapi import HTTPException

from tournament_years import ArchiveInput, RolloverInput, build_tournament_years_router


class FakeCursor:
    def __init__(self, docs):
        self.docs = [deepcopy(d) for d in docs]

    def sort(self, key, direction):
        self.docs.sort(key=lambda d: d.get(key, 0), reverse=direction < 0)
        return self

    def __aiter__(self):
        self._iter = iter(self.docs)
        return self

    async def __anext__(self):
        try:
            return next(self._iter)
        except StopIteration:
            raise StopAsyncIteration


def _matches(doc, query):
    for key, value in query.items():
        actual = doc.get(key)
        if isinstance(value, dict) and "$regex" in value:
            import re
            if not re.search(value["$regex"], str(actual or "")):
                return False
        elif actual != value:
            return False
    return True


class FakeCollection:
    def __init__(self, docs=None):
        self.docs = [deepcopy(d) for d in (docs or [])]
        self.fail_update_id = None

    async def find_one(self, query, projection=None):
        for doc in self.docs:
            if _matches(doc, query):
                out = deepcopy(doc)
                if projection and projection.get("_id") == 0:
                    out.pop("_id", None)
                return out
        return None

    def find(self, query=None, projection=None):
        query = query or {}
        rows = []
        for doc in self.docs:
            if _matches(doc, query):
                out = deepcopy(doc)
                if projection and projection.get("_id") == 0:
                    out.pop("_id", None)
                rows.append(out)
        return FakeCursor(rows)

    async def insert_one(self, doc):
        item = deepcopy(doc)
        item.setdefault("_id", f"id-{len(self.docs)+1}")
        self.docs.append(item)
        return SimpleNamespace(inserted_id=item["_id"])

    async def insert_many(self, docs):
        for doc in docs:
            await self.insert_one(doc)

    async def update_one(self, query, update, upsert=False):
        if self.fail_update_id is not None and query.get("_id") == self.fail_update_id:
            raise RuntimeError("forced write failure")
        for i, doc in enumerate(self.docs):
            if _matches(doc, query):
                if "$set" in update:
                    self.docs[i] = {**doc, **deepcopy(update["$set"])}
                return SimpleNamespace()
        if upsert:
            item = deepcopy(query)
            item.update(deepcopy(update.get("$set", {})))
            await self.insert_one(item)
        return SimpleNamespace()

    async def delete_many(self, query):
        self.docs = [d for d in self.docs if not _matches(d, query)]
        return SimpleNamespace()

    async def delete_one(self, query):
        for i, doc in enumerate(self.docs):
            if _matches(doc, query):
                self.docs.pop(i)
                break
        return SimpleNamespace()

    async def create_index(self, *args, **kwargs):
        return None


class FakeDB:
    def __init__(self, domains):
        self.site_content = FakeCollection(
            [{"_id": key, "data": deepcopy(value)} for key, value in domains.items()]
        )
        self.tournament_archives = FakeCollection()
        self.players = FakeCollection()
        self.tournament_rollovers = FakeCollection()
        self.team_pins = FakeCollection([{"_id": "pin-1", "teamId": "t1", "pin_hash": "hash"}])
        self.login_attempts = FakeCollection([{"_id": "try-1", "identifier": "pin:t1", "count": 1}])


def base_domains():
    return {
        "site": {
            "year": "2027",
            "edition": "8th Annual Dalleo Open",
            "dateText": "Saturday, September 4, 2027",
        },
        "teams": {
            "published": True,
            "items": [{
                "id": "t1",
                "name": "Team Martin",
                "captain": "Patrick Martin",
                "motto": "Champions",
                "players": [{"name": "Patrick Martin", "role": "Captain", "photoUrl": "/api/files/patrick.jpg"}],
                "startingHole": 1,
                "startingHoleLabel": "1A",
                "startingTime": "8:00 AM",
                "photoUrl": "/api/files/team.jpg",
                "active": True,
            }],
        },
        "scoring": {
            "status": "final",
            "par": [4] * 18,
            "courseLabel": "Black Tees",
            "scores": [{"teamId": "t1", "hole": 1, "strokes": 4}],
            "updatedAt": "2027-09-04T15:00:00+00:00",
        },
        "schedule": {"published": True, "events": [{"id": "x"}]},
        "announcements": {"items": [{"id": "a"}]},
        "rules": {"published": True, "approved": True, "edition": "8th Annual Dalleo Open · 2027"},
        "gallery": {"published": True, "items": [{"id": "g"}]},
        "champions": {"published": True, "entries": [{"year": 2027, "teamName": "Team Martin"}], "records": []},
        "course": {"published": True, "name": "LA Tour"},
        "committee": {"title": "Committee", "members": [{"name": "Christian"}]},
    }


def make_service():
    domains = base_domains()
    db = FakeDB(domains)

    async def read_domain(domain):
        doc = await db.site_content.find_one({"_id": domain})
        return deepcopy(doc["data"]) if doc else None

    async def user():
        return {"email": "organizer@example.com"}

    router = build_tournament_years_router(db, user, read_domain)
    endpoints = {route.path: route.endpoint for route in router.routes}
    return db, read_domain, endpoints


def test_archive_and_rollover_end_to_end_without_real_database():
    async def run():
        db, read_domain, endpoints = make_service()
        archive = endpoints["/admin/tournaments/archive"]
        rollover = endpoints["/admin/tournaments/rollover"]

        result = await archive(ArchiveInput(year=2027, confirmation="ARCHIVE 2027"), {"email": "organizer@example.com"})
        assert result["ok"] is True
        saved = await db.tournament_archives.find_one({"year": 2027})
        assert saved["locked"] is True
        assert saved["domains"]["scoring"]["scores"][0]["strokes"] == 4

        player = await db.players.find_one({"key": "patrick martin"})
        assert player["photoUrl"] == "/api/files/patrick.jpg"
        assert 2027 in player["years"]

        try:
            await archive(ArchiveInput(year=2027, confirmation="ARCHIVE 2027"), {"email": "organizer@example.com"})
            assert False, "duplicate archive should fail"
        except HTTPException as exc:
            assert exc.status_code == 409

        result = await rollover(RolloverInput(fromYear=2027, toYear=2028, confirmation="START 2028"), {"email": "organizer@example.com"})
        assert result["ok"] is True

        teams = await read_domain("teams")
        scoring = await read_domain("scoring")
        schedule = await read_domain("schedule")
        announcements = await read_domain("announcements")
        rules = await read_domain("rules")
        site = await read_domain("site")

        assert teams["year"] == 2028 and teams["published"] is False
        assert teams["items"][0]["players"] == []
        assert teams["items"][0]["startingHole"] is None
        assert scoring["year"] == 2028 and scoring["status"] == "not-started" and scoring["scores"] == []
        assert scoring["par"] == [4] * 18
        assert schedule == {"year": 2028, "published": False, "events": []}
        assert announcements == {"year": 2028, "items": []}
        assert rules["year"] == 2028 and rules["published"] is False and rules["approved"] is False
        assert site["year"] == "2028"
        assert not db.team_pins.docs
        assert not db.login_attempts.docs

        archived_again = await db.tournament_archives.find_one({"year": 2027})
        assert archived_again["domains"]["teams"]["items"][0]["players"][0]["name"] == "Patrick Martin"

    asyncio.run(run())


def test_wrong_year_and_skip_year_are_rejected():
    async def run():
        db, _, endpoints = make_service()
        archive = endpoints["/admin/tournaments/archive"]
        rollover = endpoints["/admin/tournaments/rollover"]

        try:
            await archive(ArchiveInput(year=2026, confirmation="ARCHIVE 2026"), {"email": "organizer@example.com"})
            assert False, "wrong year should fail"
        except HTTPException as exc:
            assert exc.status_code == 409

        await archive(ArchiveInput(year=2027, confirmation="ARCHIVE 2027"), {"email": "organizer@example.com"})
        for to_year in (2027, 2029):
            try:
                await rollover(RolloverInput(fromYear=2027, toYear=to_year, confirmation=f"START {to_year}"), {"email": "organizer@example.com"})
                assert False, "invalid rollover year should fail"
            except HTTPException as exc:
                assert exc.status_code == 422

    asyncio.run(run())


def test_rollover_failure_restores_active_data_and_pins():
    async def run():
        db, read_domain, endpoints = make_service()
        archive = endpoints["/admin/tournaments/archive"]
        rollover = endpoints["/admin/tournaments/rollover"]

        await archive(ArchiveInput(year=2027, confirmation="ARCHIVE 2027"), {"email": "organizer@example.com"})
        before_teams = await read_domain("teams")
        before_scoring = await read_domain("scoring")
        db.site_content.fail_update_id = "schedule"

        try:
            await rollover(RolloverInput(fromYear=2027, toYear=2028, confirmation="START 2028"), {"email": "organizer@example.com"})
            assert False, "forced rollover failure should raise"
        except HTTPException as exc:
            assert exc.status_code == 500

        db.site_content.fail_update_id = None
        assert await read_domain("teams") == before_teams
        assert await read_domain("scoring") == before_scoring
        assert len(db.team_pins.docs) == 1
        assert len(db.login_attempts.docs) == 1
        audit = db.tournament_rollovers.docs[-1]
        assert audit["status"] == "rolled-back"

    asyncio.run(run())
