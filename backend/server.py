import asyncio
import logging

from fastapi import Depends, HTTPException

from ga4_reporting import GA4NotConfigured, get_site_activity_summary
from server_core import *  # noqa: F401,F403 — preserve the existing API surface


analytics_logger = logging.getLogger("dalleo.analytics")


@app.get("/api/admin/analytics/summary")
async def admin_analytics_summary(user=Depends(get_current_user)):
    """Return a small, read-only GA4 snapshot for the organizer dashboard."""
    try:
        data = await asyncio.to_thread(get_site_activity_summary)
    except GA4NotConfigured as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception:
        analytics_logger.warning("GA4 Site Activity request failed", exc_info=True)
        raise HTTPException(status_code=503, detail="Site Activity is temporarily unavailable")
    return {"data": data}
