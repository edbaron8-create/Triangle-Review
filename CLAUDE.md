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
- **Review / Score (individual)** — a 30-point score on three axes, each
  0–10: **Aesthetic Quality**, **Tacticality**, **Triangularity**, plus an
  optional comment. One score per Triangler per Triangle; scoring again
  edits it. The uploader scores their own post (that IS the Uploader
  component). The Zealot instead files a single 0–10 verdict, no criteria.
- **Score (aggregate)** — a Triangle's total out of **100**, the sum of four
  components (pending components read as `null` and contribute 0):
  1. **Uploader** — the uploader's own score, /30.
  2. **Community** — average of regular members' scores, /30.
  3. **Council** — average of Council members' scores, /30.
  4. **Zealot** — the Zealot's verdict, /10.
  Computed by `scoreOf()` in `lib/data.ts`. Drives ranking.
- **Triangle Council** — a chosen group of members, assigned on the backend
  (`role: "council"` in `lib/data.ts` until an admin surface exists). ▲ badge.
- **Triangle Zealot** — ONE member chosen on the backend (`role: "zealot"`).
  ✦ badge. Scores every triangle with a single criteria-free number.
- **Top Triangles** — the highest-scoring Triangles, ranked on the Explore
  page and woven into feeds as suggestions.
- **Feed** — a Triangler's home timeline: posts from people they follow,
  newest first, with top-scored Triangles from outside their circle
  interleaved as suggestions.
- **Triangler** — a user of the app (submitter and/or reviewer). Until auth
  lands, everyone browses as the mock signed-in user (`CURRENT_USER_ID` in
  `lib/data.ts`).

### Design language

Mobile-first, Instagram-style: fixed bottom tab bar (Home, Explore, Post,
Profile), search bar in the top header, edge-to-edge feed cards, 3-column
tile grids, no stories strip. Color scheme is **army green and white** — the
`army` Tailwind ramp in `tailwind.config.ts` (DEFAULT ≈ #4b5320) on white
surfaces. Content is a centered `max-w-md` column on all screens.

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
  layout.tsx            Root layout (top search bar + bottom tab bar)
  page.tsx              Home feed (following + suggested posts and users)
  globals.css           Tailwind directives + base styles
  explore/              Top Triangles leaderboard grid (/100 ranking)
  search/               Search results (?q=) for triangles + Trianglers
  triangles/[id]/       Single triangle detail, score breakdown, score form
  profile/[handle]/     Profile: masthead + posted-triangles grid
    reviews/            Profile: triangles this user has scored
  upload/               Placeholder until real photo uploads land
lib/
  types.ts              Shared domain types (Triangle, Review, Triangler, ...)
  data.ts               Mock data + accessor helpers (swap for a DB later);
                        roles are configured here; the mutable store lives on
                        globalThis so server actions and routes share one
                        instance in production
  actions.ts            Server actions (submit/edit score, follow/unfollow)
  format.ts             Formatting helpers (timeAgo, formatScore)
components/             Reusable UI (BottomNav, TriangleCard, TriangleTile,
                        ScoreBadge, ScoreBreakdown, ReviewForm, Avatar,
                        RoleBadge, ProfileHeader, TriangleImage = inline-SVG
                        mock "photos", ...)
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
2. **Auth** — sign-in so Trianglers can post and review as themselves
   (replaces the mock `CURRENT_USER_ID`).
3. **Photo uploads** — real image storage (object store) instead of the
   inline-SVG mock scenes in `TriangleImage`.
4. **Ranking v2** — factor recency and score volume into Top Triangles,
   not just the /100 total.
5. **Role management** — an admin surface for choosing Council members and
   the Zealot (today: `role` fields in `lib/data.ts`).
