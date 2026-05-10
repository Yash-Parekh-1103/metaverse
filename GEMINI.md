# Metaverse Project Guide

## Overview
The "metaverse" project is a MERN (MongoDB, Express, React, Node) stack application, designed as a blog platform. It features a monorepo structure with a React frontend and an Express/Mongoose backend.

## Core Technologies
- **Frontend:** React 19, Vite 8, Axios
- **Backend:** Express 5, Mongoose 9, CORS, Dotenv
- **Runtime:** Node.js
- **Package Manager:** pnpm (preferred)

## Project Structure
- `src/`: React frontend source code.
- `backend/`: Express backend source code.
- `public/`: Static assets for the frontend.
- `package.json`: Main configuration and dependencies for both frontend and backend.
- `plan.md`: Project roadmap and architectural decisions.

## Getting Started

### Installation
```bash
pnpm install
```

### Running the Project
The frontend and backend currently run as separate processes:

**Start Frontend (Vite):**
```bash
pnpm dev
```

**Start Backend (Express):**
```bash
pnpm server
```

### Environment Setup
The backend expects a `.env` file in the `backend/` directory:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
```

## Development Workflow

### Commands
- `pnpm dev`: Start frontend development server.
- `pnpm server`: Start backend server.
- `pnpm build`: Build the frontend for production.
- `pnpm lint`: Run ESLint check.
- `pnpm preview`: Preview the production build locally.

### Conventions
- **Feature-based Structure:** Organize code by features (e.g., `src/features/auth`, `backend/src/features/posts`) rather than by type (controllers/models).
- **Authentication:** Use JWT stored in httpOnly cookies for stateless API authentication.
- **Styling:** Tailwind CSS is the preferred framework for UI development.
- **API Communication:** Use Axios for all frontend-to-backend requests.

## Architectural Decisions
Refer to `plan.md` for detailed information on the project's evolution, including auth flow, route protection, and data models.
