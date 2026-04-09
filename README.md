# JayxCreatez Productions — FAConsulting
**CIS 4375 Capstone · Group 19**

Full-stack photography booking & admin platform built with Vue 3, Express 5, and MySQL (AWS RDS).

---

## 📁 Project Structure

```
FAConsulting/
├── BACKEND/          → Express 5 API server
│   └── src/
│       ├── server.js         # Entry point, CORS, middleware, error handlers
│       ├── db.js             # MySQL / PostgreSQL connection pool
│       └── routes/
│           └── api.js        # All API route handlers
│
└── VueFrontend/      → Vue 3 + Vite frontend
    ├── services/
    │   └── api.js            # Central API service (all fetch calls go here)
    ├── pages/                # One .vue file per route
    ├── components/           # AppNav, AppFooter, AppCursor
    ├── composables/          # useFonts
    ├── router/index.js       # Vue Router route table
    └── assets/index.js       # All static asset imports
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

| Variable | Description |
|---|---|
| `PORT` | Port the API runs on (default `3001`) |
| `FRONTEND_ORIGIN` | Comma-separated allowed CORS origins |
| `DB_CLIENT` | `mysql` or `postgres` |
| `DB_HOST` | RDS endpoint |
| `DB_PORT` | `3306` for MySQL |
| `DB_NAME` | Database name |
| `DB_USER` | Database username |
| `DB_PASSWORD` | ⚠️ Fill this in — do not commit |
| `DB_SSL` | `true` for AWS RDS |
| `ADMIN_SECRET` | Token checked by `x-admin-token` header on protected routes |

**Frontend** — copy the example and fill in:
```zsh
cp VueFrontend/.env.example VueFrontend/.env
```

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend URL e.g. `http://localhost:3001` |
| `VITE_COGNITO_*` | AWS Cognito pool config |
| `VITE_CALLBACK_URL` | OAuth callback (match Cognito app client settings) |

### 3 — Start both servers

```zsh
# Terminal 1 — Backend (auto-restarts on file changes)
cd BACKEND && npm run dev

# Terminal 2 — Frontend (Vite HMR)
cd VueFrontend && npm run dev
```

Frontend → **http://localhost:5173**  
Backend  → **http://localhost:3001**

---

## ✅ Final Credentials Checklist

Before marking the project complete, confirm each item below:

### Database (AWS RDS)
- [ ] `DB_PASSWORD` is correct and matches the RDS master password
- [ ] `DB_PORT` is `3306` (MySQL)
- [ ] Your IP is whitelisted in the RDS **Security Group** (inbound rule: MySQL/Aurora port 3306)
- [ ] Health check returns `ok: true`:
  ```zsh
  curl http://localhost:3001/api/health
  ```
  Expected:
  ```json
  { "ok": true, "api": "online", "database": { "ok": true, "client": "mysql" } }
  ```

### Admin Auth
- [ ] `ADMIN_SECRET` is set to a strong secret in `BACKEND/.env`
- [ ] Sign-in at `/adminsignin` calls `POST /api/admin/signin` and stores the token
- [ ] Protected routes (`/admindash`, `/deliverables`, `/adminsettings`) return `401` without token

### CORS
- [ ] `FRONTEND_ORIGIN` in `BACKEND/.env` matches the frontend URL exactly (no trailing slash)
- [ ] For production add the deployed frontend URL:
  ```
  FRONTEND_ORIGIN=http://localhost:5173,https://yourdomain.com
  ```

### Frontend → Backend connection
- [ ] `VITE_API_BASE_URL` in `VueFrontend/.env` points to the running backend
- [ ] Contact form submission hits `POST /api/contact` (check Network tab in DevTools)
- [ ] Admin sign-in hits `POST /api/admin/signin` (not a local password check)

---

## 🌐 API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | — | DB + API status |
| `GET` | `/api/gallery` | — | Gallery items |
| `GET` | `/api/calendar` | — | Booking slots |
| `POST` | `/api/contact` | — | Contact form submission |
| `POST` | `/api/admin/signin` | — | Admin login → returns token |
| `GET` | `/api/admin/dash` | `x-admin-token` | Dashboard stats |
| `GET` | `/api/admin/deliverables` | `x-admin-token` | Deliverables list |
| `GET` | `/api/admin/settings` | `x-admin-token` | Fetch settings |
| `PUT` | `/api/admin/settings` | `x-admin-token` | Update settings |

Protected routes require the header:
```
x-admin-token: <value of ADMIN_SECRET>
```

---

## 📋 Project Status

| Area | Status | Notes |
|---|---|---|
| Vue frontend (all pages) | ✅ Complete | Fully built & tested |
| Express backend & routing | ✅ Complete | All routes stubbed, ready for DB logic |
| CORS configuration | ✅ Complete | Multi-origin, preflight handled |
| Central API service | ✅ Complete | `VueFrontend/services/api.js` |
| Frontend ↔ Backend wired | ✅ Complete | Contact & sign-in use live API calls |
| AWS RDS connection | ⚠️ Pending | Verify `DB_PASSWORD` & Security Group |
| DB route logic | 🔲 Todo | Replace stubs in `routes/api.js` with real queries |
| AWS S3 integration | 🔲 Todo | Deliverables upload via `S3_BUCKET_NAME` |
| Cognito auth flow | 🔲 Todo | Wire `VITE_COGNITO_*` vars into sign-in |

---

## 👥 Team — Group 19

CIS 4375 Capstone · Spring 2026
