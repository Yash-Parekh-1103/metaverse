# MERN Blog App Plan

## Context
You want a simple MERN blog app with Tailwind styling and a straightforward login/signup flow. Unauthenticated users must be blocked from all main pages. The repo is currently a Vite + React template at the root; no backend exists yet. You want a monorepo with separate frontend and backend folders and a simple, feature-based structure.

## Requirements (Restated)
- Build a MERN blog app with Tailwind UI.
- Auth flow: signup for new users, login for existing users; if not authenticated, user can’t access any main page (redirect to login).
- Features (V1):
  - View posts from all users.
  - Create/edit/delete own posts.
  - User profile page with edit capability.
- Monorepo, easy structure, feature-based folders.

## Decisions (Assumptions)
- Use JWT stored in httpOnly cookie for a simple auth flow (no refresh token complexity). If you prefer server sessions instead, adjust in Phase 2.

## Risks / Open Questions
- Auth mechanism choice (JWT cookie vs express-session). Current plan uses JWT cookie for simplicity and stateless API.
- Route protection: frontend route guards + backend auth middleware to enforce access.
- No tests exist; adding a minimal testing setup is recommended but could be deferred.

## High-Level Architecture
- **client/**: Vite + React + Tailwind UI, feature-based structure.
- **server/**: Express + Mongoose API with auth middleware and feature-based modules.
- Auth enforced in both client routes and server API.

## Planned Phases

### Phase 1: Repo Restructure (Monorepo)
- Move current Vite app into `client/`.
- Add `server/` for Express API.
- Root `package.json` with scripts to run client and server together (e.g., `pnpm -C client dev`, `pnpm -C server dev`).

### Phase 2: Backend (Express + Mongoose)
**Structure (feature-based):**
- `server/src/features/auth/` (routes, controllers, validators)
- `server/src/features/users/`
- `server/src/features/posts/`
- `server/src/middleware/auth.js` (verify JWT cookie)
- `server/src/db/` (mongoose connection)
- `server/src/app.js` (express app) + `server/src/server.js` (bootstrap)

**Endpoints:**
- Auth: `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- Users: `GET /api/users/me`, `PUT /api/users/me`
- Posts: `GET /api/posts`, `GET /api/posts/:id`, `POST /api/posts`, `PUT /api/posts/:id`, `DELETE /api/posts/:id`

**Data Models:**
- User: name, email (unique), passwordHash, bio, avatarUrl, createdAt
- Post: title, content, authorId, createdAt, updatedAt

**Rules:**
- Only authenticated users can access any API route (except signup/login).
- Users can edit/delete only their own posts/profile.

### Phase 3: Frontend (React + Tailwind)
**Routing:**
- Public: `/login`, `/signup`
- Protected: `/` (feed), `/posts/:id`, `/posts/new`, `/posts/:id/edit`, `/profile`

**Route Guard:**
- If not authenticated, redirect to `/login`.
- Use `GET /api/auth/me` on app load to resolve auth state.

**Feature-based UI:**
- `client/src/features/auth/` (Login, Signup, auth hooks)
- `client/src/features/posts/` (PostList, PostDetail, PostForm)
- `client/src/features/profile/` (Profile page + edit form)
- `client/src/routes/` (route definitions + guards)

### Phase 4: Tailwind Setup
- Install Tailwind in `client/` and update `tailwind.config.js` + `src/index.css`.
- Apply basic layout system and reusable components (buttons, inputs, cards).

### Phase 5: Minimal Testing (Optional but recommended)
- Backend: basic integration tests for auth and posts.
- Frontend: smoke test for protected routing and auth flow.

## Files/Paths to Change (Expected)
- `client/` (move existing Vite app here)
- `server/` (new Express API)
- Root `package.json` (scripts)
- Tailwind config files in `client/`

## Verification
- Start backend: `pnpm -C server dev`
- Start frontend: `pnpm -C client dev`
- Flow check:
  - Visit `/` → redirected to `/login`
  - Signup → redirected to `/`
  - Create/edit/delete post → only own posts editable
  - View other users’ posts → read-only
  - Edit profile → persists
