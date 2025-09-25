CodeBurry
================

A full-stack React + Vite + Express + MongoDB app with gamified learning:
- Learning Hub for starting challenges and uploading task files
- Admin Panel for verifying submissions and awarding water drops
- Leaderboard powered by database stats (drops, lessons, streak)
- Dashboard and Garden showing user progress (DB-backed)

Tech Stack
---------
- Frontend: React 18, Vite, TypeScript, TailwindCSS
- Backend: Node.js, Express, Mongoose, Socket.io
- Auth: Signed HTTP-only cookies (JWT)
- File uploads: multer to local `uploads/`
- DB: MongoDB (Atlas or local)

Prerequisites
-------------
- Node.js 18+
- MongoDB connection string

Getting Started
---------------
1) Install dependencies

```bash
npm install
```

2) Configure environment
- The server uses `process.env.JWT_SECRET` (falls back to a dev default).
- Mongo URI is currently configured directly in `server/server.js`. Replace with your own if needed.

3) Run dev servers (concurrently runs client and API)

```bash
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:4000

Vite proxy forwards `/api/*` to the API.

Core Features and Flows
-----------------------

Authentication
--------------
- Register: `POST /api/auth/register`
- Login: `POST /api/auth/login`
- Logout: `POST /api/auth/logout`
- Session: `GET /api/auth/me`

Leaderboard (DB-backed)
-----------------------
- Model: `LeaderboardStat` (per user)
  - fields: `userId`, `name`, `drops`, `lessonsCompleted`, `streak`
- API: `GET /api/leaderboard?by=drops|lessons|streak&limit=50`
- User stats: `GET /api/me/leaderboard`, `POST /api/me/leaderboard` (increment user’s stats)
- Frontend page: `src/pages/Leaderboard.tsx` (fetches from API)

Learning Hub – Start & Upload
-----------------------------
- Start sets UI state to “Started”
- Upload uses multipart to send files:
  - `POST /api/challenges/:id/upload` (field: `file`, body: `challengeTitle`)
  - Files are stored in `uploads/` and served at `/uploads/<filename>`
- Flash message “Task uploaded” shown on success
- Existing submissions are loaded on mount via `GET /api/me/submissions` to persist UI state

Admin Panel – Review & Award Drops
----------------------------------
- List submissions by status: `GET /api/admin/submissions?status=submitted|approved|rejected`
- Verify: `POST /api/admin/submissions/:id/verify` with `{ approve: boolean, dropsAward: number }`
  - On approval, increments `LeaderboardStat.drops` for that user
  - “Open file” link available if a file was uploaded
- Admin endpoints require auth + role `admin`

Dashboard & Garden (User Stats)
-------------------------------
- `UserContext` loads user’s stats from `/api/me/leaderboard` and refreshes on window focus + every 15s
- Dashboard and Garden read from `useUser().stats`
- Garden classic UI adapter: `src/pages/GardenClassic.tsx` (renders old UI using DB-backed stats)

Project Structure (key paths)
-----------------------------
- `server/server.js` – Express server, schemas, routes
- `src/context/AuthContext.tsx` – auth state
- `src/context/UserContext.tsx` – DB-backed user stats and helpers
- `src/pages/Leaderboard.tsx` – leaderboard page
- `src/components/LearningHub.tsx` – challenges and upload flow
- `src/pages/AdminPanel.tsx` – submission moderation and awarding
- `src/pages/GardenClassic.tsx` – adapter for classic Garden UI
- `uploads/` – uploaded files (served at `/uploads`)

Common Tasks
------------
- Seed demo leaderboard data (automatic on first run): Included in server start.
- Make a user admin: Register user with email starting `admin@` or update role in DB.
- Change Mongo URI: Edit `mongoUri` in `server/server.js`.

Notes & Limitations
-------------------
- File storage is local for development; switch to cloud storage for production.
- JWT secret should be provided via environment in production.
- If drops don’t appear immediately after admin approval, wait up to 15s or refocus window; or wire a manual refresh using `useUser().refreshStats()`.

Scripts
-------
```bash
npm run dev        # client + server concurrently
npm run build      # build frontend
npm run preview    # preview built frontend
```

License
-------
MIT


