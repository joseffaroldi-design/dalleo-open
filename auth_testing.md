# Auth Testing Playbook — Dalleo Open

Auth architecture: FastAPI + MongoDB + bcrypt + PyJWT (HS256, 12h tokens, Bearer header).
Organizers live in db.users (unique email index). Lockout: 5 failed logins per email = 15 min.

## Step 1: MongoDB verification
```
mongosh "$MONGO_URL"
use <DB_NAME>
db.users.find({}, {email: 1, role: 1}).pretty()
db.users.findOne({}, {password_hash: 1})
```
Verify: bcrypt hashes start with `$2b$`; unique index on users.email; index on login_attempts.identifier. Never any plaintext passwords.

## Step 2: API testing (use the external preview URL, curl only — Cloudflare blocks python requests)
```
BASE=https://golf-memorial-hub.preview.emergentagent.com
TOKEN=$(curl -s -X POST "$BASE/api/auth/login" -H "Content-Type: application/json" -d '{"email":"<admin>","password":"<pass>"}' | python3 -c "import sys,json;print(json.load(sys.stdin)['token'])")
curl -s "$BASE/api/auth/me" -H "Authorization: Bearer $TOKEN"
```
Login returns {token, user}; /auth/me returns the same organizer.

## Step 3: Organizer creation endpoint
```
curl -s -X POST "$BASE/api/admin/organizers" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"email":"new@example.com","password":"somepass8","name":"Organizer"}'
```
Expect 200 {id, email lowercased, name, role}. Duplicate email -> 409. No token -> 401/403. New account must then log in via /api/auth/login and access GET /api/admin/site.

## Step 4: Negative checks
- Wrong password -> 401; 5 wrong attempts -> 429 lockout (never exceed 2 wrong attempts in tests)
- Tampered token -> 401
- GET /api/admin/{domain} without token -> 401/403
