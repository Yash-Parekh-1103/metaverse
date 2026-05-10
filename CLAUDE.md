# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- Install deps: `pnpm install`
- Dev server: `pnpm dev`
- Build: `pnpm build`
- Preview production build: `pnpm preview`
- Lint: `pnpm lint`

## High-level architecture
- Vite + React app. Entry is src/main.jsx, which mounts App into `#root` from index.html.
- Main UI is in src/App.jsx with styling in src/App.css and global styles in src/index.css.
- Static assets live in src/assets and public/ (public/ is served as-is by Vite). public/icons.svg provides the SVG sprite referenced in App.jsx.
- This repo currently has no test scripts configured in package.json.
