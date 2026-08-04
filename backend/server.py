import uuid

import requests
from dotenv import load_dotenv

load_dotenv()

import os
import logging
from datetime import datetime, timezone, timedelta
from typing import Optional, List, Literal

import bcrypt
import jwt
from fastapi import FastAPI, APIRouter, HTTPException, Request, Depends, UploadFile, File
from fastapi.responses import Response
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ValidationError, field_validator, model_validator

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ---------- Object storage (Emergent integrations) ----------
STORAGE_URL = "https://integrations.emergentagent.com/objstore/api/v1/storage"
APP_NAME = "dalleo-open"
storage_key = None


def init_storage():
    global storage_key
    if storage_key:
        return storage_key
    resp = requests.post(
        f"{STORAGE_URL}/init",
        json={"emergent_key": os.environ["EMERGENT_LLM_KEY"]},
        timeout=30,
    )
    resp.raise_for_status()
    storage_key = resp.json()["storage_key"]
    return storage_key


def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    resp = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data,
        timeout=120,
    )
    resp.raise_for_status()
    return resp.json()


def get_object(path: str):
    key = init_storage()
    resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=60)
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")

JWT_ALGORITHM = "HS256"
DOMAINS = {"announcements", "teams", "schedule", "gallery", "site", "rules", "champions", "scoring"}


def jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=12),
        "type": "access",
    }
    return jwt.encode(payload, jwt_secret(), algorithm=JWT_ALGORITHM)


security = HTTPBearer(auto_error=False)


async def get_current_user(
    request: Request, creds: HTTPAuthorizationCredentials = Depends(security)
):
    token = request.cookies.get("access_token") or (creds.credentials if creds else None)
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired — please log in again")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    from bson import ObjectId

    user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return {"email": user["email"], "name": user.get("name", "Organizer"), "role": "organizer"}


class LoginInput(BaseModel):
    email: str = Field(min_length=3, max_length=200)
    password: str = Field(min_length=1, max_length=200)


@api_router.post("/auth/login")
async def login(input: LoginInput, request: Request):
    email = input.email.strip().lower()
    identifier = email
    attempts = await db.login_attempts.find_one({"identifier": identifier})
    if attempts and attempts.get("locked_until"):
        locked_until = datetime.fromisoformat(attempts["locked_until"])
        if datetime.now(timezone.utc) < locked_until:
            raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in a few minutes.")
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(input.password, user["password_hash"]):
        count = (attempts or {}).get("count", 0) + 1
        update = {"identifier": identifier, "count": count}
        if count >= 5:
            update["locked_until"] = (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat()
            update["count"] = 0
        await db.login_attempts.update_one({"identifier": identifier}, {"$set": update}, upsert=True)
        raise HTTPException(status_code=401, detail="Invalid email or password")
    await db.login_attempts.delete_one({"identifier": identifier})
    token = create_token(str(user["_id"]), email)
    return {"token": token, "user": {"email": email, "name": user.get("name", "Organizer"), "role": "organizer"}}


@api_router.get("/auth/me")
async def me(user=Depends(get_current_user)):
    return user


@api_router.post("/auth/logout")
async def logout(user=Depends(get_current_user)):
    return {"ok": True}

# ---------- Team captain scoring (per-team PIN, scoped tokens) ----------

class TeamPinInput(BaseModel):
    teamId: str = Field(min_length=1, max_length=40)
    pin: str = Field(min_length=4, max_length=8, pattern=r"^\d{4,8}$")


class TeamLoginInput(BaseModel):
    teamId: str = Field(min_length=1, max_length=40)
    pin: str = Field(min_length=4, max_length=8)


class HoleScoreInput(BaseModel):
    hole: int = Field(ge=1, le=18)
    strokes: int = Field(ge=1, le=30)


def create_team_token(team_id: str) -> str:
    payload = {
        "sub": f"team:{team_id}",
        "type": "team",
        "exp": datetime.now(timezone.utc) + timedelta(hours=12),
    }
    return jwt.encode(payload, jwt_secret(), algorithm=JWT_ALGORITHM)


async def get_current_team(creds: HTTPAuthorizationCredentials = Depends(security)):
    if not creds or not creds.credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(creds.credentials, jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "team":
            raise HTTPException(status_code=401, detail="Invalid token type")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired — please log in again")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload["sub"].removeprefix("team:")


@api_router.post("/team-scoring/login")
async def team_login(input: TeamLoginInput):
    teams = await read_domain("teams")
    team = next((t for t in (teams or {}).get("items", []) if t["id"] == input.teamId), None)
    identifier = f"pin:{input.teamId}"
    attempts = await db.login_attempts.find_one({"identifier": identifier})
    if attempts and attempts.get("locked_until"):
        if datetime.now(timezone.utc) < datetime.fromisoformat(attempts["locked_until"]):
            raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in a few minutes.")
    record = await db.team_pins.find_one({"teamId": input.teamId})
    if not team or not record or not verify_password(input.pin, record["pin_hash"]):
        count = (attempts or {}).get("count", 0) + 1
        update = {"identifier": identifier, "count": count}
        if count >= 5:
            update["locked_until"] = (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat()
            update["count"] = 0
        await db.login_attempts.update_one({"identifier": identifier}, {"$set": update}, upsert=True)
        raise HTTPException(status_code=401, detail="Invalid team or PIN")
    await db.login_attempts.delete_one({"identifier": identifier})
    return {"token": create_team_token(team["id"]), "team": {"id": team["id"], "name": team["name"]}}


@api_router.get("/team-scoring/state")
async def team_scoring_state(team_id: str = Depends(get_current_team)):
    scoring = await read_domain("scoring")
    teams = await read_domain("teams")
    team = next((t for t in (teams or {}).get("items", []) if t["id"] == team_id), None)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    doc = scoring or {"status": "not-started", "par": [4] * 18, "scores": [], "updatedAt": ""}
    own = [s for s in doc.get("scores", []) if s["teamId"] == team_id]
    return {
        "data": {
            "status": doc["status"],
            "par": doc["par"],
            "updatedAt": doc.get("updatedAt", ""),
            "scores": own,
            "team": {
                "id": team["id"],
                "name": team["name"],
                "startingHole": team.get("startingHole"),
            },
        }
    }


@api_router.put("/team-scoring/hole")
async def team_scoring_write(input: HoleScoreInput, team_id: str = Depends(get_current_team)):
    scoring = await read_domain("scoring")
    if not scoring or scoring["status"] != "live":
        raise HTTPException(status_code=409, detail="Scoring is not open right now")
    teams = await read_domain("teams")
    if not any(t["id"] == team_id and t.get("active", True) for t in (teams or {}).get("items", [])):
        raise HTTPException(status_code=404, detail="Team not found")
    score = HoleScore(teamId=team_id, hole=input.hole, strokes=input.strokes).model_dump()
    await db.site_content.update_one(
        {"_id": "scoring"}, {"$pull": {"data.scores": {"teamId": team_id, "hole": input.hole}}}
    )
    await db.site_content.update_one(
        {"_id": "scoring"},
        {
            "$push": {"data.scores": score},
            "$set": {"data.updatedAt": datetime.now(timezone.utc).isoformat()},
        },
    )
    return {"ok": True, "score": score}


@api_router.get("/admin/team-pins")
async def team_pins_status(user=Depends(get_current_user)):
    cursor = db.team_pins.find({}, {"_id": 0, "teamId": 1})
    return {"teamIds": [doc["teamId"] async for doc in cursor]}


@api_router.put("/admin/team-pins")
async def team_pins_set(input: TeamPinInput, user=Depends(get_current_user)):
    teams = await read_domain("teams")
    if not any(t["id"] == input.teamId for t in (teams or {}).get("items", [])):
        raise HTTPException(status_code=404, detail="Team not found")
    await db.team_pins.update_one(
        {"teamId": input.teamId},
        {"$set": {"teamId": input.teamId, "pin_hash": hash_password(input.pin), "updated_at": datetime.now(timezone.utc).isoformat()}},
        upsert=True,
    )
    return {"ok": True}


# ---------- Image uploads (organizer) ----------

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_UPLOAD_BYTES = 12 * 1024 * 1024


@api_router.post("/admin/uploads")
async def upload_image(file: UploadFile = File(...), user=Depends(get_current_user)):
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=422, detail="Only JPEG, PNG, WebP, or GIF images")
    data = await file.read()
    if not data:
        raise HTTPException(status_code=422, detail="Empty file")
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=422, detail="Image must be under 12 MB")
    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in (file.filename or "") else "jpg"
    if ext not in ("jpg", "jpeg", "png", "webp", "gif"):
        ext = "jpg"
    path = f"{APP_NAME}/uploads/{uuid.uuid4()}.{ext}"
    try:
        result = put_object(path, data, file.content_type)
    except Exception as e:
        logger.error(f"Storage upload failed: {e}")
        raise HTTPException(status_code=502, detail="Upload failed — please try again")
    canonical = result["path"]
    await db.files.insert_one({
        "id": str(uuid.uuid4()),
        "storage_path": canonical,
        "original_filename": file.filename,
        "content_type": file.content_type,
        "size": result["size"],
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return {"url": f"/api/files/{canonical}", "filename": file.filename, "size": result["size"]}


@api_router.get("/files/{path:path}")
async def serve_file(path: str):
    record = await db.files.find_one({"storage_path": path, "is_deleted": False})
    if not record:
        raise HTTPException(status_code=404, detail="File not found")
    try:
        data, content_type = get_object(path)
    except Exception:
        raise HTTPException(status_code=404, detail="File not found")
    return Response(
        content=data,
        media_type=record.get("content_type", content_type),
        headers={"Cache-Control": "public, max-age=86400"},
    )



# ---------- Domain validation models ----------

class Announcement(BaseModel):
    id: str = Field(min_length=1, max_length=60)
    title: str = Field(min_length=1, max_length=200)
    message: str = Field(min_length=1, max_length=1000)
    date: str = Field(min_length=1, max_length=60)
    priority: Literal["normal", "important"] = "normal"
    published: bool = False


class AnnouncementsDoc(BaseModel):
    items: List[Announcement] = []


class PlayerInput(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    role: Optional[str] = Field(None, max_length=30)


class TeamInput(BaseModel):
    id: str = Field(min_length=1, max_length=40)
    colorKey: Literal["green", "gold", "white", "black"]
    name: str = Field(min_length=1, max_length=80)
    captain: str = Field(min_length=1, max_length=80)
    motto: str = Field(min_length=1, max_length=200)
    players: List[PlayerInput]
    startingHole: Optional[int] = Field(None, ge=1, le=18)
    startingTime: Optional[str] = Field(None, max_length=20)
    order: Optional[int] = Field(None, ge=1, le=99)
    active: bool = True
    photoUrl: Optional[str] = Field(None, max_length=500)


class TeamsDoc(BaseModel):
    published: bool
    items: List[TeamInput] = Field(max_length=8)


class EventInput(BaseModel):
    id: str = Field(min_length=1, max_length=60)
    day: Literal["friday", "saturday", "sunday"]
    time: str = Field(min_length=1, max_length=20)
    sortKey: str = Field(min_length=1, max_length=10)
    title: str = Field(min_length=1, max_length=120)
    description: str = Field(min_length=1, max_length=400)
    location: str = Field(min_length=1, max_length=80)
    status: Literal["completed", "happening-now", "upcoming", "delayed", "updated"]
    note: Optional[str] = Field(None, max_length=200)
    isCurrent: bool = False


class ScheduleDoc(BaseModel):
    published: bool
    events: List[EventInput]


class GalleryItemInput(BaseModel):
    id: str = Field(min_length=1, max_length=60)
    type: Literal["image", "video"]
    src: Optional[str] = Field(None, max_length=500)
    caption: str = Field(min_length=1, max_length=120)
    description: str = Field(min_length=1, max_length=400)
    category: Literal["tournament", "draft-night", "teams", "awards", "memories"]
    year: int = Field(ge=2000, le=2100)
    aspect: Literal["portrait", "landscape", "square"]
    alt: str = Field(min_length=1, max_length=200)
    source: Optional[str] = Field(None, max_length=120)
    order: int = Field(0, ge=0, le=999)
    featured: bool = False
    published: bool = True


class GalleryDoc(BaseModel):
    published: bool
    items: List[GalleryItemInput]


class MilestoneInput(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    description: str = Field(min_length=1, max_length=300)


class SiteDoc(BaseModel):
    edition: str = Field(min_length=1, max_length=80)
    year: str = Field(min_length=1, max_length=10)
    dateText: str = Field(min_length=1, max_length=120)
    heroSubtitle: str = Field(min_length=1, max_length=200)
    instagramUrl: str = Field(min_length=1, max_length=300)
    homeMessage: str = Field(min_length=1, max_length=600)
    memorialPublished: bool
    shareMemoryEnabled: bool
    memorialHeroTitle: str = Field(min_length=1, max_length=120)
    memorialHeroSubtitle: str = Field(min_length=1, max_length=300)
    story: List[str]
    milestones: List[MilestoneInput]
    closingMessage: str = Field(min_length=1, max_length=600)
    heroImageUrl: Optional[str] = Field(None, max_length=500)
    brandonPhotoUrl: Optional[str] = Field(None, max_length=500)


class TextPair(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    body: str = Field(min_length=1, max_length=1000)


class Topic(BaseModel):
    id: str = Field(min_length=1, max_length=60)
    title: str = Field(min_length=1, max_length=200)
    body: str = Field(min_length=1, max_length=1000)


class RulesDoc(BaseModel):
    published: bool
    approved: bool
    header: TextPair = TextPair(title="Rules & Format", body="Tournament format and the rules every player should know.")
    edition: str = "8th Annual Dalleo Open · 2026"
    draftNotice: str = Field(min_length=1, max_length=300)
    quickReminders: List[str]
    formatIntro: str = Field(min_length=1, max_length=1000)
    formatPoints: List[str]
    formatNote: str = Field(min_length=1, max_length=400)
    matchRules: List[Topic]
    conduct: List[TextPair]
    tiebreakNote: str = Field(min_length=1, max_length=300)
    tiebreakSteps: List[str]
    faq: List[Topic]
    unpublishedTitle: str = Field(min_length=1, max_length=200)
    unpublishedBody: str = Field(min_length=1, max_length=400)


class ChampionStat(BaseModel):
    label: str = Field(min_length=1, max_length=60)
    value: str = Field(min_length=1, max_length=60)


class ChampionEntry(BaseModel):
    year: int = Field(ge=2000, le=2100)
    teamName: str = Field(min_length=1, max_length=80)
    captain: str = Field(min_length=1, max_length=80)
    members: List[str] = []
    finalScore: str = Field(min_length=1, max_length=40)
    margin: str = Field(default="", max_length=60)
    mvp: str = Field(default="", max_length=80)
    quote: str = Field(default="", max_length=300)
    story: str = Field(min_length=1, max_length=1500)
    moments: List[str] = []
    awards: List[str] = []
    stats: List[ChampionStat] = []
    photoCaption: str = Field(default="", max_length=200)
    photoUrl: Optional[str] = Field(None, max_length=500)
    published: bool = True
    placeholder: bool = True


class RecordEntry(BaseModel):
    id: str = Field(min_length=1, max_length=60)
    label: str = Field(min_length=1, max_length=80)
    holder: str = Field(min_length=1, max_length=120)
    value: str = Field(min_length=1, max_length=60)
    year: str = Field(default="", max_length=20)
    note: str = Field(default="", max_length=200)


class ChampionsDoc(BaseModel):
    published: bool
    header: TextPair
    entries: List[ChampionEntry]
    records: List[RecordEntry]


class HoleScore(BaseModel):
    teamId: str = Field(min_length=1, max_length=40)
    hole: int = Field(ge=1, le=18)
    # Generous upper bound — one team score per hole, unusual-but-valid
    # scramble scores must never be blocked.
    strokes: int = Field(ge=1, le=30)


class ScoringDoc(BaseModel):
    status: Literal["not-started", "live", "final"]
    par: List[int] = Field(min_length=18, max_length=18)
    scores: List[HoleScore] = []
    updatedAt: str = Field(default="", max_length=60)

    @field_validator("par")
    @classmethod
    def par_values(cls, v):
        if any(p < 3 or p > 6 for p in v):
            raise ValueError("each hole par must be between 3 and 6")
        return v

    @model_validator(mode="after")
    def unique_team_hole(self):
        seen = set()
        for s in self.scores:
            key = (s.teamId, s.hole)
            if key in seen:
                raise ValueError(f"duplicate score for {s.teamId} on hole {s.hole}")
            seen.add(key)
        return self


MODELS = {
    "announcements": AnnouncementsDoc,
    "teams": TeamsDoc,
    "schedule": ScheduleDoc,
    "gallery": GalleryDoc,
    "site": SiteDoc,
    "rules": RulesDoc,
    "champions": ChampionsDoc,
    "scoring": ScoringDoc,
}


class SaveInput(BaseModel):
    data: dict


async def read_domain(domain: str):
    doc = await db.site_content.find_one({"_id": domain}, {"_id": 0, "data": 1})
    return doc["data"] if doc else None


@api_router.get("/public/{domain}")
async def public_get(domain: str):
    if domain not in DOMAINS:
        raise HTTPException(status_code=404, detail="Unknown domain")
    return {"data": await read_domain(domain)}


@api_router.get("/admin/{domain}")
async def admin_get(domain: str, user=Depends(get_current_user)):
    if domain not in DOMAINS:
        raise HTTPException(status_code=404, detail="Unknown domain")
    return {"data": await read_domain(domain)}


@api_router.put("/admin/{domain}")
async def admin_put(domain: str, body: SaveInput, user=Depends(get_current_user)):
    if domain not in DOMAINS:
        raise HTTPException(status_code=404, detail="Unknown domain")
    try:
        validated = MODELS[domain](**body.data)
    except ValidationError as e:
        first = e.errors()[0] if e.errors() else {}
        loc = ".".join(str(p) for p in first.get("loc", []))
        raise HTTPException(status_code=422, detail=f"Invalid {domain} data: {loc} {first.get('msg', '')}".strip())
    payload = validated.model_dump()
    if domain == "scoring":
        payload["updatedAt"] = datetime.now(timezone.utc).isoformat()
    await db.site_content.update_one(
        {"_id": domain},
        {"$set": {"data": payload, "updated_at": datetime.now(timezone.utc).isoformat()}},
        upsert=True,
    )
    return {"ok": True}


@api_router.get("/health")
async def health():
    try:
        await db.command("ping")
        return {"status": "ok"}
    except Exception:
        return {"status": "degraded"}


@api_router.get("/")
async def root():
    return {"message": "Dalleo Open API"}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await db.team_pins.create_index("teamId", unique=True)
    await db.files.create_index("storage_path", unique=True)
    try:
        init_storage()
        logger.info("Object storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed (uploads will retry on demand): {e}")
    admin_email = os.environ["ADMIN_EMAIL"].strip().lower()
    admin_password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one(
            {
                "email": admin_email,
                "password_hash": hash_password(admin_password),
                "name": "Tournament Organizer",
                "role": "organizer",
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
        )
        logger.info("Seeded organizer account")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})
        logger.info("Updated organizer password from env")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
