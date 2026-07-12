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
- **Triangle Council** — a chosen group of members, assigned on the backend:
  `npm run set-role -- <handle> council`. ▲ badge.
- **Triangle Zealot** — ONE member chosen on the backend:
  `npm run set-role -- <handle> zealot` (auto-demotes the previous Zealot).
  ✦ badge. Scores triangles with a single criteria-free number.
- **Top Triangles** — the highest-scoring Triangles, ranked on the Explore
  page and woven into feeds as suggestions.
- **Feed** — a Triangler's home timeline: posts from people they follow,
  newest first, with top-scored Triangles from outside their circle
  interleaved as suggestions.
- **Triangler** — a registered user (submitter and/or reviewer). Accounts are
  real: signup/login with scrypt-hashed passwords and session cookies. New
  accounts are always `member`. The app is **login-first**: every page except
  /login and /signup redirects logged-out visitors to the login page
  (`requireUser()` in `lib/auth.ts`).

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
- **Database:** Supabase Postgres via `@supabase/supabase-js` (PostgREST),
  using the SECRET key server-side only. Schema in `supabase/schema.sql`;
  RLS is enabled with no policies so the publishable key can't touch data.
- **Auth:** hand-rolled sessions — scrypt password hashes (`lib/password.ts`),
  opaque session tokens in Postgres, httpOnly cookie (`lib/auth.ts`).
  Supabase Auth is NOT used.
- **Uploads:** photos stored in the public `uploads` Supabase Storage bucket,
  served from its CDN URLs.
- **Runtime:** Node.js 20+.
- **Package manager:** npm.

> Configuration: `SUPABASE_URL` + `SUPABASE_SECRET_KEY` env vars (in
> `.env.local` locally — gitignored — and in the host's env settings when
> deployed). One-time setup: run `supabase/schema.sql` in the Supabase SQL
> Editor, then `npm run init-supabase` (creates the storage bucket and
> verifies the schema). The database starts empty — no demo/seed content.

## Project structure

```
app/                    Next.js App Router routes
  layout.tsx            Root layout (top search bar + bottom tab bar)
  page.tsx              Home feed (following + suggested; Top Triangles when
                        logged out)
  globals.css           Tailwind directives + base styles
  explore/              Top Triangles leaderboard grid (/100 ranking)
  search/               Search results (?q=) for triangles + Trianglers
  triangles/[id]/       Single triangle detail, score breakdown, score form
  profile/[handle]/     Profile: masthead + posted-triangles grid
    reviews/            Profile: triangles this user has scored
  login/  signup/       Auth pages (server-action forms)
  upload/               New-post form: photo, details, uploader score
lib/
  supabase.ts           Server-side Supabase client (secret key) + bucket name
  auth.ts               Sessions: register, authenticate, getCurrentUser,
                        requireUser (login-first redirect)
  password.ts           scrypt hash/verify (no external deps)
  data.ts               ALL data access (queries live here only); scoreOf()
  actions.ts            Server actions (auth, post w/ photo upload, score,
                        follow)
  types.ts              Shared domain types (Triangle, Review, Triangler, ...)
  format.ts             Formatting helpers (timeAgo, formatScore)
components/             Reusable UI (BottomNav, TriangleCard, TriangleTile,
                        ScoreBadge, ScoreBreakdown, ReviewForm, UploadForm,
                        Avatar, RoleBadge, ProfileHeader, TrianglePhoto, ...)
supabase/
  schema.sql            Database schema — run once in the SQL Editor
scripts/
  set-role.mjs          Backend role management (council / zealot)
  init-supabase.mjs     One-time setup: storage bucket + schema check
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
npm run set-role -- <handle> <member|council|zealot>   # backend role admin
```

## Roadmap (next real features)

1. **Ranking v2** — factor recency and score volume into Top Triangles,
   not just the /100 total.
2. **Admin surface** — in-app role management for the Council and Zealot
   (today: `npm run set-role`).
3. **Image pipeline** — resize/strip uploads server-side, re-enable the
   Next.js image optimizer.
4. **Notifications** — tell uploaders when the Council or the Zealot has
   spoken.
5. **Query tuning** — feed/explore load all triangles and rank in JS; move
   scoring into SQL views once content volume justifies it.
