# CLAUDE.md

This file gives Claude Code (and any contributor) the context needed to work in
this repository. It is standalone and describes **only** the Triangle Reviewer
project.

## Project

**Triangle Reviewer** — "Instagram for triangles in real life."

People photograph triangles they find in the world (architecture, road signs,
sandwiches, mountains, anything triangular), post them to a shared feed, and the
community reviews and rates them. The best-rated triangles are surfaced as "Top
Triangles" and highlighted to everyone.

### Core concepts / domain language

- **Triangle** — a single user-submitted post: a photo of a real-world
  triangle, plus a title, description, and location.
- **Review** — a rating (1–5) and optional written comment left by a community
  member on a Triangle.
- **Score** — a Triangle's aggregate rating, derived from its Reviews. Drives
  ranking.
- **Top Triangles** — the highest-scoring Triangles, highlighted on the home
  feed and a dedicated leaderboard.
- **Triangler** — a user of the app (submitter and/or reviewer).

## Tech stack

- **Framework:** Next.js (App Router) — React Server Components by default.
- **Language:** TypeScript (strict mode).
- **Styling:** Tailwind CSS.
- **Runtime:** Node.js 20+.
- **Package manager:** npm.

> Data is currently served from in-memory mock fixtures (`lib/data.ts`). There
> is no database, auth, or file upload yet — those are the first real features
> to build (see "Roadmap").

## Project structure

```
app/                    Next.js App Router routes
  layout.tsx            Root layout (fonts, global chrome)
  page.tsx              Home feed + Top Triangles highlight
  globals.css           Tailwind directives + base styles
  triangles/[id]/       Single triangle detail + its reviews
lib/
  types.ts              Shared domain types (Triangle, Review, ...)
  data.ts               Mock data + accessor helpers (swap for a DB later)
components/             Reusable UI (TriangleCard, ScoreBadge, ...)
public/                 Static assets
```

## Conventions

- **TypeScript everywhere.** No `any` unless truly unavoidable and commented.
- **Server Components by default.** Add `"use client"` only when a component
  needs state, effects, or browser APIs.
- **Domain types live in `lib/types.ts`** and are imported, not redefined.
- **Data access goes through helpers in `lib/data.ts`** (e.g. `getTriangles()`,
  `getTriangleById()`). When a real backend lands, only this file changes.
- **Styling is Tailwind utility classes** in JSX. Avoid separate CSS files
  beyond `globals.css`.
- **File naming:** React components `PascalCase.tsx`; other modules
  `camelCase.ts`. Route files follow Next.js conventions (`page.tsx`,
  `layout.tsx`).
- **Imports:** use the `@/` path alias for project-root imports.

## Common commands

```bash
npm install       # install dependencies
npm run dev       # start dev server at http://localhost:3000
npm run build     # production build
npm run start     # serve the production build
npm run lint      # run ESLint
```

## Roadmap (next real features)

1. **Persistence** — replace `lib/data.ts` fixtures with a real database
   (e.g. Postgres via Prisma). Keep the same helper signatures.
2. **Auth** — sign-in so Trianglers can post and review as themselves.
3. **Photo uploads** — real image storage (object store) instead of mock URLs.
4. **Reviews write path** — form + server action to submit ratings/comments and
   recompute Score.
5. **Ranking** — real Top Triangles leaderboard (score, recency, volume).
