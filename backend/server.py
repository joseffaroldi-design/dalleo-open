from core_server import *  # noqa: F401,F403
from tournament_years import build_tournament_years_router

# Keep the proven application/server behavior in core_server unchanged and
# register the yearly archive workflow as one isolated organizer-only router.
app.include_router(
    build_tournament_years_router(db, get_current_user, read_domain),
    prefix="/api",
)


@app.on_event("startup")
async def startup_tournament_year_indexes():
    await db.tournament_archives.create_index("year", unique=True)
    await db.players.create_index("key", unique=True)
    await db.tournament_rollovers.create_index(
        [("fromYear", 1), ("toYear", 1), ("status", 1)]
    )
