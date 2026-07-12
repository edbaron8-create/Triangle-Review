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
- **Review** — three ratings left on a Triangle, each 0–10: **Aesthetic
  Quality**, **Tacticality**, and **Triangularity** (30 points max), plus an
  optional written comment. One review per Triangler per Triangle; reviewing
  again edits your review. The uploader may review their own post.
- **Triangle Council** — a small set of distinguished Trianglers whose
  reviews carry extra weight. Council members get a ▲ badge everywhere.
- **Score** — a Triangle's aggregate rating: the weighted average of its
  Reviews, out of 30. Weights: Council ×3, community ×1, uploader
  self-review ×0.5. Drives ranking. Computed by `scoreOf()` in `lib/data.ts`.
- **Top Triangles** — the highest-scoring Triangles, ranked on the Explore
  page and woven into feeds as suggestions.
- **Feed** — a Triangler's home timeline: posts from people they follow,
  newest first, with top-scored Triangles from outside their circle
  interleaved as suggestions.
- **Triangler** — a user of the app (submitter and/or reviewer). Until auth
  lands, everyone browses as the mock signed-in user (`CURRENT_USER_ID` in
  `lib/data.ts`).

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
  layout.tsx            Root layout (top nav, global chrome)
  page.tsx              Home feed (following + suggested) + sidebar
  globals.css           Tailwind directives + base styles
  explore/              Top Triangles leaderboard grid
  triangles/[id]/       Single triangle detail, reviews, review form
  profile/[handle]/     Profile: masthead + posted-triangles grid
    reviews/            Profile: triangles this user has reviewed
  upload/               Placeholder until real photo uploads land
lib/
  types.ts              Shared domain types (Triangle, Review, Triangler, ...)
  data.ts               Mock data + accessor helpers (swap for a DB later);
                        the mutable store lives on globalThis so server
                        actions and routes share one instance in production
  actions.ts            Server actions (submit/edit review, follow/unfollow)
  format.ts             Formatting helpers (timeAgo, formatScore)
components/             Reusable UI (TriangleCard, TriangleTile, ScoreBadge,
                        RatingBreakdown, ReviewForm, Avatar, ProfileHeader,
                        TriangleImage = inline-SVG mock "photos", ...)
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
4. **Ranking v2** — factor recency and review volume into Top Triangles,
   not just weighted score.
5. **Council management** — how Trianglers get promoted to (and removed
   from) the Triangle Council.
