# JayxCreatez Productions — FAConsulting
**CIS 4375 Capstone · Group 19**

Full-stack photography booking & admin platform built with Vue 3, Express 5, MySQL on AWS RDS, and AWS S3 for file delivery.

---

## 📁 Project Structure

```
FAConsulting/
├── BACKEND/                     → Express 5 API server
│   ├── src/
│   │   ├── server.js            # Entry point — CORS, middleware, error handlers
│   │   ├── db.js                # MySQL connection pool + getPool() export
│   │   ├── queries.js           # All SQL query functions (single source of truth)
│   │   ├── s3.js                # AWS S3 helpers — presigned URLs, delete, folder paths
│   │   └── routes/
│   │       └── api.js           # 21 route handlers wired to queries.js + s3.js
│   ├── schema.sql               # Full MySQL schema + seed data (run once against RDS)
│   ├── .env                     # Live credentials (never commit)
│   ├── .env.example             # Template — copy to .env and fill in
│   └── package.json
│
└── VueFrontend/                 → Vue 3 + Vite frontend
    ├── services/
    │   └── api.js               # Central fetch service — all 24 endpoint methods
    ├── pages/                   # One .vue file per route
    │   ├── adminsignin.vue      # Admin login — calls POST /api/admin/signin
    │   ├── admindash.vue        # Dashboard — appointments, messages, availability
    │   ├── adminsettings.vue    # Settings — services, email, password
    │   ├── deliverables.vue     # S3 upload flow — presigned PUT direct to S3
    │   ├── calendar.vue         # Public booking form
    │   └── contact.vue          # Public contact form
    ├── components/              # AppNav, AppFooter, AppCursor
    ├── composables/             # useFonts
    ├── router/index.js          # Vue Router route table
    ├── assets/index.js          # All static asset imports
    ├── .env                     # VITE_API_BASE_URL (never commit)
    └── .env.example             # Template
```

---

## 🚀 Getting Started

### 1 — Clone & install

```zsh
git clone <repo-url>

# Backend
cd BACKEND && npm install

# Frontend
cd ../VueFrontend && npm install
```

### 2 — Configure environment variables

**Backend** — copy the example and fill in credentials:

```zsh
cp BACKEND/.env.example BACKEND/.env
```

| Variable | Required | Description |
|---|---|---|
| `PORT` | ✅ | Port the API runs on (default `3001`) |
| `FRONTEND_ORIGIN` | ✅ | Comma-separated allowed CORS origins, e.g. `http://localhost:5173` |
| `DB_CLIENT` | ✅ | `mysql` |
| `DB_HOST` | ✅ | RDS endpoint |
| `DB_PORT` | ✅ | `3306` |
| `DB_NAME` | ✅ | `faconsulting` |
| `DB_USER` | ✅ | `admin` |
| `DB_PASSWORD` | ✅ | ⚠️ RDS master password — do **not** commit |
| `DB_SSL` | ✅ | `true` for AWS RDS |
| `ADMIN_SECRET` | ✅ | Token returned on sign-in and checked by `x-admin-token` header |
| `ADMIN_USER` | ✅ | Fallback username when `admin_users` table is empty |
| `ADMIN_PASSWORD` | ✅ | Fallback password when `admin_users` table is empty |
| `S3_BUCKET_NAME` | ✅ | `photographers-suite-storage` |
| `S3_REGION` | ✅ | `us-east-1` |
| `AWS_ACCESS_KEY_ID` | ✅ | IAM key with S3 read/write on the bucket |
| `AWS_SECRET_ACCESS_KEY` | ✅ | ⚠️ IAM secret — do **not** commit |
| `COGNITO_USER_POOL_ID` | optional | `us-east-1_0aWW5RCrL` |
| `COGNITO_CLIENT_ID` | optional | `316cq6gpvrle2s8punb2s16p5k` |
| `COGNITO_REGION` | optional | `us-east-1` |

**Frontend** — copy the example and fill in:

```zsh
cp VueFrontend/.env.example VueFrontend/.env
```

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | ✅ | Backend URL, e.g. `http://localhost:3001` |

### 3 — Initialise the database (run once)

```zsh
mysql -h faconsulting.cnqms7dc4l1v.us-east-1.rds.amazonaws.com \
      -P 3306 -u admin -p faconsulting \
      < BACKEND/schema.sql
```

This creates all 8 tables and inserts seed data (services, default settings, sample gallery items).

### 4 — Apply the S3 bucket CORS policy

In the AWS Console → **S3 → photographers-suite-storage → Permissions → Cross-origin resource sharing (CORS)**, paste:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "GET"],
    "AllowedOrigins": [
      "http://localhost:5173",
      "https://yourdomain.com"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

This allows the browser to `PUT` files directly to S3 using presigned upload URLs — file bytes never pass through the backend.

### 5 — Start both servers

```zsh
# Terminal 1 — Backend (auto-restarts on file changes)
cd BACKEND && npm run dev

# Terminal 2 — Frontend (Vite HMR)
cd VueFrontend && npm run dev
```

Frontend → **http://localhost:5173**  
Backend  → **http://localhost:3001**

---

## ✅ Pre-Launch Checklist

### Database (AWS RDS)
- [ ] `DB_PASSWORD` matches the RDS master password
- [ ] Your IP is whitelisted in the RDS **Security Group** (inbound rule: MySQL/Aurora TCP port 3306)
- [ ] `schema.sql` has been run against RDS (step 3 above)
- [ ] Health check returns `ok: true`:
  ```zsh
  curl http://localhost:3001/api/health
  ```
  Expected:
  ```json
  { "ok": true, "api": "online", "database": { "ok": true, "client": "mysql" } }
  ```

### Admin Auth
- [ ] `ADMIN_SECRET` is set to a strong, random string in `BACKEND/.env`
- [ ] `ADMIN_USER` / `ADMIN_PASSWORD` set (used as fallback before DB is seeded)
- [ ] Sign-in at `/adminsignin` calls `POST /api/admin/signin` and stores the token in `sessionStorage`
- [ ] Protected routes (`/admindash`, `/deliverables`, `/adminsettings`) return `401` without a valid token

### AWS S3
- [ ] `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY` filled in
- [ ] IAM user has `s3:PutObject`, `s3:GetObject`, `s3:DeleteObject` on `arn:aws:s3:::photographers-suite-storage/*`
- [ ] S3 bucket CORS policy applied (step 4 above)
- [ ] Test presigned upload: open `/deliverables`, pick an appointment, drop a file — watch the XHR progress bar reach 100 %

### CORS
- [ ] `FRONTEND_ORIGIN` in `BACKEND/.env` matches the frontend URL exactly (no trailing slash)
- [ ] For production, add the deployed URL:
  ```
  FRONTEND_ORIGIN=http://localhost:5173,https://yourdomain.com
  ```

### Frontend → Backend connection
- [ ] `VITE_API_BASE_URL` in `VueFrontend/.env` points to the running backend
- [ ] Contact form submission hits `POST /api/contact` (check Network tab in DevTools)
- [ ] Admin sign-in hits `POST /api/admin/signin` (not a local password check)

---

## 🧪 Quick API Tests

```zsh
BASE=http://localhost:3001
TOKEN=<your ADMIN_SECRET value>

# Health
curl $BASE/api/health

# Public — calendar availability
curl $BASE/api/calendar

# Public — submit a booking
curl -X POST $BASE/api/calendar/book \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Jane","lastName":"Doe","email":"jane@example.com","package":"portrait","isoDate":"2026-02-14","time":"10:00 AM"}'

# Public — contact form
curl -X POST $BASE/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","message":"Hello!"}'

# Admin — sign in (returns token)
curl -X POST $BASE/api/admin/signin \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"<ADMIN_PASSWORD>"}'

# Admin — dashboard
curl $BASE/api/admin/dash -H "x-admin-token: $TOKEN"

# Admin — get presigned S3 upload URL
curl -X POST $BASE/api/admin/upload-url \
  -H "Content-Type: application/json" \
  -H "x-admin-token: $TOKEN" \
  -d '{"appointmentId":"jxc-2026-1234","fileName":"photo.jpg","contentType":"image/jpeg"}'

# Admin — get presigned S3 download URL
curl "$BASE/api/admin/download-url?key=deliverables/jxc-2026-1234/photo.jpg" \
  -H "x-admin-token: $TOKEN"

# Admin — delete an S3 object
curl -X DELETE $BASE/api/admin/s3-object \
  -H "Content-Type: application/json" \
  -H "x-admin-token: $TOKEN" \
  -d '{"key":"deliverables/jxc-2026-1234/photo.jpg"}'

```

---

## 🌐 API Reference

Protected routes require the header: `x-admin-token: <ADMIN_SECRET>`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | — | DB + API liveness check |
| `GET` | `/api/gallery` | — | Gallery items |
| `GET` | `/api/calendar` | — | Availability + booked slots |
| `POST` | `/api/calendar/book` | — | Submit a booking |
| `POST` | `/api/contact` | — | Contact form submission |
| `POST` | `/api/admin/signin` | — | Admin login → returns `ADMIN_SECRET` token |
| `GET` | `/api/admin/dash` | ✅ | Stats + all appointments + messages |
| `GET` | `/api/admin/messages` | ✅ | All inbox messages |
| `GET` | `/api/admin/deliverables` | ✅ | All appointments (for file delivery) |
| `PUT` | `/api/admin/deliverables/:id/link` | ✅ | Save S3 folder URL as delivery link |
| `GET` | `/api/admin/services` | ✅ | Fetch service packages |
| `POST` | `/api/admin/services` | ✅ | Create a service |
| `PUT` | `/api/admin/services/:id` | ✅ | Update a service |
| `DELETE` | `/api/admin/services/:id` | ✅ | Delete a service |
| `GET` | `/api/admin/settings` | ✅ | Fetch admin settings (email etc.) |
| `PUT` | `/api/admin/settings` | ✅ | Update settings / change password |
| `GET` | `/api/admin/availability` | ✅ | Fetch blocked dates + time slots |
| `PUT` | `/api/admin/availability` | ✅ | Save blocked dates + time slots |
| `POST` | `/api/admin/upload-url` | ✅ | Get presigned S3 PUT URL for one file |
| `GET` | `/api/admin/download-url` | ✅ | Get presigned S3 GET URL (`?key=…`) |
| `DELETE` | `/api/admin/s3-object` | ✅ | Delete an object from S3 |

### S3 Upload Flow

```
Browser                     Backend                    AWS S3
  │                            │                          │
  ├─ POST /api/admin/upload-url►│                          │
  │  { appointmentId,          │── getUploadUrl(key) ─────►│
  │    fileName, contentType } │◄── { uploadUrl, key } ───│
  │◄── { uploadUrl, key,       │                          │
  │       folderUrl }          │                          │
  │                            │                          │
  ├─ PUT uploadUrl (XHR) ───────────────────────────────► S3 stores object
  │  (raw bytes, no backend    │                    (byte-level progress)
  │   touch, real progress)    │                          │
  │                            │                          │
  ├─ PUT /deliverables/:id/link►│                          │
  │  { link: folderUrl }       │── updateDeliveryLink() ─►DB
  └────────────────────────────┘                          │
```

---

## 📋 Project Status

| Area | Status | Notes |
|---|---|---|
| Vue frontend — all pages | ✅ Complete | Built, wired to API, seed-data fallback |
| Express backend + routing | ✅ Complete | 21 routes backed by real DB queries |
| CORS configuration | ✅ Complete | Multi-origin, OPTIONS preflight handled |
| Central API service | ✅ Complete | `VueFrontend/services/api.js` — 24 methods |
| DB schema + seed data | ✅ Complete | `BACKEND/schema.sql` — 8 tables |
| SQL query module | ✅ Complete | `BACKEND/src/queries.js` |
| S3 helper module | ✅ Complete | `BACKEND/src/s3.js` — presigned PUT/GET, delete |
| S3 upload in deliverables | ✅ Complete | XHR byte-level progress, folder URL saved to DB |
| Admin sign-in → API | ✅ Complete | Token stored in `sessionStorage`, sent via header |
| Contact form → API | ✅ Complete | Saves to `messages` table |
| Calendar booking → API | ✅ Complete | Saves to `appointments` table |
| Admin dash → API | ✅ Complete | Stats, appointments, messages from DB |
| Admin settings → API | ✅ Complete | Services CRUD, email/password update |
| AWS RDS connection | ⚠️ Pending | Verify `DB_PASSWORD` + whitelist IP in Security Group |
| Run schema.sql on RDS | ⚠️ Pending | Run once DB access is confirmed |
| AWS S3 credentials | ⚠️ Pending | Fill `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY` in `.env` |
| S3 bucket CORS policy | ⚠️ Pending | Apply JSON policy in AWS Console (step 4 above) |
| Cognito auth flow | 🔲 Optional | Pool IDs already in `.env`; wire into sign-in if required |

---

## 👥 Team — Group 19

CIS 4375 Capstone · Spring 2026
