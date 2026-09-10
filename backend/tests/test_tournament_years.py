from tournament_years import _next_scoring, _next_site, _next_teams, _next_rules, _player_records


def test_player_library_preserves_names_photos_and_history():
    teams = {
        "published": True,
        "items": [
            {
                "id": "martin",
                "name": "Team Martin",
                "players": [
                    {"name": "Patrick Martin", "role": "Captain", "photoUrl": "/api/files/patrick.jpg"},
                    {"name": "Roger Freibert", "photoUrl": "/api/files/roger.jpg"},
                ],
            }
        ],
    }
    players = _player_records(teams, 2026)
    assert [p["name"] for p in players] == ["Patrick Martin", "Roger Freibert"]
    assert players[0]["photoUrl"] == "/api/files/patrick.jpg"
    assert players[0]["years"] == [2026]
    assert players[0]["appearances"][0]["teamName"] == "Team Martin"


def test_next_year_teams_clear_rosters_pairings_and_team_photos():
    teams = {
        "published": True,
        "items": [
            {
                "id": "t1",
                "colorKey": "green",
                "name": "Team Martin",
                "captain": "Patrick Martin",
                "motto": "Champions",
                "players": [{"name": "Patrick Martin", "role": "Captain"}],
                "startingHole": 1,
                "startingHoleLabel": "1A",
                "startingTime": "8:00 AM",
                "photoUrl": "/api/files/team.jpg",
                "active": True,
            }
        ],
    }
    result = _next_teams(teams)
    team = result["items"][0]
    assert result["published"] is False
    assert team["name"] == "Team 1"
    assert team["captain"] == "TBD"
    assert team["players"] == []
    assert team["startingHole"] is None
    assert team["startingHoleLabel"] is None
    assert team["startingTime"] is None
    assert team["photoUrl"] is None


def test_next_year_scoring_is_clean_but_keeps_course_setup():
    scoring = {
        "status": "final",
        "par": [4] * 18,
        "courseLabel": "Black Tees",
        "scores": [{"teamId": "t1", "hole": 1, "strokes": 4}],
        "updatedAt": "old",
    }
    result = _next_scoring(scoring)
    assert result["status"] == "not-started"
    assert result["scores"] == []
    assert result["par"] == [4] * 18
    assert result["courseLabel"] == "Black Tees"


def test_next_year_site_and_rules_advance_without_publishing_old_rules():
    site = {
        "year": "2027",
        "edition": "8th Annual Dalleo Open",
        "dateText": "Saturday, September 4, 2027",
        "heroSubtitle": "In Memory of Brandon Dalleo",
    }
    rules = {"published": True, "approved": True, "edition": "8th Annual Dalleo Open · 2027"}
    next_site = _next_site(site, 2028)
    next_rules = _next_rules(rules, 2028)
    assert next_site["year"] == "2028"
    assert next_site["edition"] == "9th Annual Dalleo Open"
    assert next_site["dateText"] == "Tournament date to be announced"
    assert next_rules["published"] is False
    assert next_rules["approved"] is False
    assert next_rules["edition"] == "9th Annual Dalleo Open · 2028"
