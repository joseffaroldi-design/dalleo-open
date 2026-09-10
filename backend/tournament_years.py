from copy import deepcopy
from datetime import datetime, timezone
from typing import Any, Callable

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field


ARCHIVE_DOMAINS = [
    "announcements",
    "teams",
    "schedule",
    "gallery",
    "site",
    "rules",
    "champions",
    "scoring",
    "course",
    "committee",
]


class ArchiveInput(BaseModel):
    year: int = Field(ge=2000, le=2100)
    confirmation: str = Field(min_length=1, max_length=40)


class RolloverInput(BaseModel):
    fromYear: int = Field(ge=2000, le=2100)
    toYear: int = Field(ge=2000, le=2100)
    confirmation: str = Field(min_length=1, max_length=40)


def _ordinal(n: int) -> str:
    if 10 <= n % 100 <= 20:
        suffix = "th"
    else:
        suffix = {1: "st", 2: "nd", 3: "rd"}.get(n % 10, "th")
    return f"{n}{suffix}"


def _year_from_site(site: dict | None) -> int:
    try:
        return int((site or {}).get("year"))
    except (TypeError, ValueError):
        raise HTTPException(status_code=409, detail="Current tournament year is not configured")


def _player_records(teams: dict | None, year: int) -> list[dict[str, Any]]:
    records: dict[str, dict[str, Any]] = {}
    for team in (teams or {}).get("items", []):
        for player in team.get("players", []):
            name = (player.get("name") or "").strip()
            if not name:
                continue
            key = name.casefold()
            entry = records.setdefault(
                key,
                {
                    "key": key,
                    "name": name,
                    "photoUrl": player.get("photoUrl"),
                    "years": [],
                    "appearances": [],
                },
            )
            if not entry.get("photoUrl") and player.get("photoUrl"):
                entry["photoUrl"] = player["photoUrl"]
            if year not in entry["years"]:
                entry["years"].append(year)
            entry["appearances"].append(
                {
                    "year": year,
                    "teamId": team.get("id"),
                    "teamName": team.get("name"),
                    "role": player.get("role"),
                }
            )
    return list(records.values())


def _next_teams(teams: dict | None) -> dict:
    result = deepcopy(teams or {"published": False, "items": []})
    result["published"] = False
    for index, team in enumerate(result.get("items", []), start=1):
        team["name"] = f"Team {index}"
        team["captain"] = "TBD"
        team["motto"] = "Roster to be announced"
        team["players"] = []
        team["startingHole"] = None
        team["startingHoleLabel"] = None
        team["startingTime"] = None
        team["photoUrl"] = None
        team["active"] = True
    return result


def _next_site(site: dict, to_year: int) -> dict:
    result = deepcopy(site)
    result["year"] = str(to_year)
    tournament_number = max(1, to_year - 2019)
    result["edition"] = f"{_ordinal(tournament_number)} Annual Dalleo Open"
    result["dateText"] = "Tournament date to be announced"
    return result


def _next_rules(rules: dict | None, to_year: int) -> dict:
    result = deepcopy(rules or {})
    result["published"] = False
    result["approved"] = False
    if result.get("edition"):
        result["edition"] = f"{_ordinal(max(1, to_year - 2019))} Annual Dalleo Open · {to_year}"
    return result


def _next_scoring(scoring: dict | None) -> dict:
    result = deepcopy(scoring or {})
    result["status"] = "not-started"
    result["scores"] = []
    result["updatedAt"] = datetime.now(timezone.utc).isoformat()
    return result


def _summary(archive: dict) -> dict:
    scoring = archive.get("domains", {}).get("scoring") or {}
    teams = archive.get("domains", {}).get("teams") or {}
    champions = archive.get("domains", {}).get("champions") or {}
    champion = next(
        (entry for entry in champions.get("entries", []) if int(entry.get("year", 0)) == int(archive["year"])),
        None,
    )
    return {
        "year": archive["year"],
        "archivedAt": archive.get("archivedAt"),
        "locked": True,
        "teamCount": len(teams.get("items", [])),
        "scoreCount": len(scoring.get("scores", [])),
        "champion": champion,
    }


def build_tournament_years_router(db, get_current_user: Callable, read_domain: Callable):
    router = APIRouter()

    async def load_domains() -> dict[str, Any]:
        pairs = []
        for domain in ARCHIVE_DOMAINS:
            pairs.append((domain, await read_domain(domain)))
        return dict(pairs)

    @router.get("/admin/tournament-years")
    async def tournament_years(user=Depends(get_current_user)):
        site = await read_domain("site")
        current_year = _year_from_site(site)
        cursor = db.tournament_archives.find({}, {"_id": 0, "year": 1, "archivedAt": 1, "domains.scoring": 1, "domains.teams": 1, "domains.champions": 1}).sort("year", -1)
        archives = [_summary(doc) async for doc in cursor]
        return {"currentYear": current_year, "archives": archives}

    @router.get("/admin/tournament-years/{year}")
    async def tournament_year(year: int, user=Depends(get_current_user)):
        archive = await db.tournament_archives.find_one({"year": year}, {"_id": 0})
        if not archive:
            raise HTTPException(status_code=404, detail="Tournament archive not found")
        return {"archive": archive}

    @router.post("/admin/tournament-years/archive")
    async def archive_tournament(input: ArchiveInput, user=Depends(get_current_user)):
        site = await read_domain("site")
        current_year = _year_from_site(site)
        if input.year != current_year:
            raise HTTPException(status_code=409, detail=f"Archive year must match current tournament year {current_year}")
        if input.confirmation != f"ARCHIVE {input.year}":
            raise HTTPException(status_code=422, detail=f"Type ARCHIVE {input.year} to confirm")
        if await db.tournament_archives.find_one({"year": input.year}):
            raise HTTPException(status_code=409, detail=f"{input.year} is already archived")

        domains = await load_domains()
        now = datetime.now(timezone.utc).isoformat()
        archive = {
            "version": 2,
            "year": input.year,
            "archivedAt": now,
            "archivedBy": user.get("email"),
            "locked": True,
            "domains": deepcopy(domains),
        }
        try:
            await db.tournament_archives.insert_one(deepcopy(archive))
        except Exception:
            if await db.tournament_archives.find_one({"year": input.year}):
                raise HTTPException(status_code=409, detail=f"{input.year} is already archived")
            raise

        for player in _player_records(domains.get("teams"), input.year):
            existing = await db.players.find_one({"key": player["key"]}) or {}
            photo = existing.get("photoUrl") or player.get("photoUrl")
            years = sorted(set(existing.get("years", []) + player.get("years", [])))
            appearances = existing.get("appearances", []) + [
                a for a in player.get("appearances", []) if a not in existing.get("appearances", [])
            ]
            await db.players.update_one(
                {"key": player["key"]},
                {"$set": {"key": player["key"], "name": player["name"], "photoUrl": photo, "years": years, "appearances": appearances, "updatedAt": now}},
                upsert=True,
            )

        saved = await db.tournament_archives.find_one({"year": input.year}, {"_id": 0})
        if not saved or saved.get("domains") != archive.get("domains"):
            raise HTTPException(status_code=500, detail="Archive verification failed; rollover remains blocked")
        return {"ok": True, "archive": _summary(saved)}

    @router.post("/admin/tournament-years/rollover")
    async def rollover_tournament(input: RolloverInput, user=Depends(get_current_user)):
        site = await read_domain("site")
        current_year = _year_from_site(site)
        if input.fromYear != current_year:
            raise HTTPException(status_code=409, detail=f"Current tournament year is {current_year}")
        if input.toYear != input.fromYear + 1:
            raise HTTPException(status_code=422, detail="Next tournament year must be exactly one year after the current year")
        if input.confirmation != f"START {input.toYear}":
            raise HTTPException(status_code=422, detail=f"Type START {input.toYear} to confirm")
        archive = await db.tournament_archives.find_one({"year": input.fromYear}, {"_id": 0})
        if not archive:
            raise HTTPException(status_code=409, detail=f"Archive {input.fromYear} before starting {input.toYear}")
        if await db.tournament_rollovers.find_one({"fromYear": input.fromYear, "toYear": input.toYear, "status": "completed"}):
            raise HTTPException(status_code=409, detail="This rollover was already completed")

        before = await load_domains()
        now = datetime.now(timezone.utc).isoformat()
        next_docs = {
            "teams": _next_teams(before.get("teams")),
            "scoring": _next_scoring(before.get("scoring")),
            "schedule": {"published": False, "events": []},
            "announcements": {"items": []},
            "rules": _next_rules(before.get("rules"), input.toYear),
            "site": _next_site(before.get("site") or {}, input.toYear),
        }
        audit = {
            "fromYear": input.fromYear,
            "toYear": input.toYear,
            "startedAt": now,
            "startedBy": user.get("email"),
            "status": "started",
        }
        audit_result = await db.tournament_rollovers.insert_one(audit)

        changed = []
        try:
            for domain in ["teams", "scoring", "schedule", "announcements", "rules", "site"]:
                await db.site_content.update_one(
                    {"_id": domain},
                    {"$set": {"data": next_docs[domain], "updated_at": now}},
                    upsert=True,
                )
                changed.append(domain)
            await db.team_pins.delete_many({})
            await db.login_attempts.delete_many({"identifier": {"$regex": "^pin:"}})
            await db.tournament_rollovers.update_one(
                {"_id": audit_result.inserted_id},
                {"$set": {"status": "completed", "completedAt": datetime.now(timezone.utc).isoformat(), "changedDomains": changed}},
            )
        except Exception as exc:
            for domain in changed:
                await db.site_content.update_one(
                    {"_id": domain},
                    {"$set": {"data": before[domain], "updated_at": datetime.now(timezone.utc).isoformat()}},
                    upsert=True,
                )
            await db.tournament_rollovers.update_one(
                {"_id": audit_result.inserted_id},
                {"$set": {"status": "rolled-back", "error": str(exc)[:500], "rolledBackAt": datetime.now(timezone.utc).isoformat()}},
            )
            raise HTTPException(status_code=500, detail="Rollover failed and active tournament data was restored")

        return {
            "ok": True,
            "fromYear": input.fromYear,
            "toYear": input.toYear,
            "retained": ["player library", "gallery", "champions", "course", "committee", "branding"],
            "reset": ["teams and rosters", "scores", "pairings", "schedule", "announcements", "captain PINs", "rules publication"],
        }

    @router.get("/admin/players")
    async def player_library(user=Depends(get_current_user)):
        cursor = db.players.find({}, {"_id": 0}).sort("name", 1)
        return {"players": [doc async for doc in cursor]}

    return router
