# Metaverse Blog App — Improvement Roadmap (No Code)

## Problem Summary
The app already has a working baseline (signup/login, create post, feed, profile), but it is still at an early MVP stage. The biggest gaps are production-readiness (security/validation/config), missing core blog capabilities (single post flow, edit/delete post flow), and weak developer quality guardrails (tests/observability).

## Current State Snapshot
- Frontend: React + Vite + Tailwind, route guards, feed/create/profile pages, redesigned login/signup.
- Backend: single `backend/server.js` with auth + posts + profile endpoints.
- Data: User and Post models exist; post create + list works.
- Major known gaps:
  - No post detail page.
  - No edit/delete post APIs or UI.
  - No robust request validation/sanitization.
  - JWT fallback secret exists (`fallback_secret`) which is unsafe for production.
  - Hardcoded backend URL in frontend requests.
  - No tests and no centralized error/observability strategy.

## Scope of Improvements (Prioritized)

### Track A — Stability & Security (Parallel priority)
1. **Auth hardening**
   - Remove insecure JWT fallback secret behavior.
   - Standardize token expiration and logout behavior.
   - Decide and enforce token storage strategy (localStorage vs httpOnly cookie).
2. **Validation and input safety**
   - Validate payloads for signup/login/create/update endpoints.
   - Add content length limits and required field checks server-side.
   - Add sanitization to reduce XSS risk in blog content.
3. **Error handling**
   - Use a consistent backend error response format.
   - Show user-friendly frontend error states (not only console errors).

### Track B — Core Blog Features (Primary priority)
1. **Post lifecycle completion**
   - Add edit post and delete post (API + UI) with ownership checks.
2. **Post reading experience**
   - Add single post detail route/page (shareable URL).
3. **Feed improvements**
   - Add pagination or “load more”.
   - Add basic filter/search by title/category/author.
4. **Profile improvements**
   - Show user’s posts with navigation to detail.
   - Add profile metadata (bio/avatar placeholder field).

### Track C — Product Growth Features (Medium priority)
1. **Engagement**
   - Likes/bookmarks/comments (currently icons are visual only).
2. **Discovery**
   - Categories/tags pages, trending/recent sections.
3. **Notifications**
   - Basic in-app notifications for comments/likes.

### Track D — Developer & Deployment Readiness (High priority)
1. **Codebase structure**
   - Split monolithic backend file into feature-based modules.
2. **Configuration**
   - Introduce environment-based API base URL in frontend.
   - Add stricter env checks on startup (fail fast when missing required vars).
3. **Quality**
   - Add backend integration tests for auth/posts.
   - Add frontend smoke tests for auth guards and post flows.
4. **Ops**
   - Add request logging and basic metrics/health improvements.
   - Add Docker setup and simple CI pipeline (lint + build + tests).

## Recommended Implementation Order
1. **P0 (Immediate):** Track B post lifecycle (detail/edit/delete) + profile-to-post navigation.
2. **P1:** Track B feed discovery improvements (pagination + filter/search).
3. **P2:** Track A security/validation hardening + Track D config cleanup.
4. **P3:** Track D tests/CI + backend modularization.
5. **P4:** Track C engagement/discovery features.

## Loopholes / Risk Areas to Address Early
- Insecure default JWT secret behavior if env vars are missing.
- Minimal backend input validation; malformed requests can pass deeper.
- Hardcoded API origin can break deployments/environments.
- No reliable automated tests, so regressions are likely as features grow.

## Todo List (for execution tracking)
1. `post-lifecycle`: Edit/delete/detail post features with ownership rules.
2. `profile-enhancement`: Better profile data and post navigation.
3. `feed-discovery`: Pagination + filter/search in feed.
4. `security-hardening`: Auth/config/validation baseline hardening.
5. `quality-and-ci`: Tests, logging, CI, deployment baseline.

## Notes
- This plan intentionally focuses on **what to build next** and **why**, without implementing code.
- If priority is quick user-visible progress, start with `post-lifecycle`.
- If priority is production readiness, start with `security-hardening`.
