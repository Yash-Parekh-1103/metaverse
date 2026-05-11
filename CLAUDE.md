# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- Install deps: `pnpm install`
- Dev server (frontend): `pnpm dev`
- Dev server (backend): `pnpm server`
- Build: `pnpm build`
- Preview production build: `pnpm preview`
- Lint: `pnpm lint`

## High-level architecture
- Vite + React app. Entry is src/main.jsx, which mounts App into `#root` and wraps App with BrowserRouter.
- Routing and auth gating live in src/App.jsx: public routes for /login and /signup, protected routes for blog/profile flows. Axios is configured there with a global 401 interceptor that clears localStorage token and redirects to /login.
- Feature UIs live under src/features/auth/* and src/features/blog/*, with shared styling in src/App.css and src/index.css.
- Backend is a single Express server at backend/server.js using Mongoose models for User and Post. It exposes /api/auth, /api/users, and /api/posts endpoints, and expects MONGODB_URI and JWT_SECRET in backend/.env.
- This repo currently has no test scripts configured in package.json.
