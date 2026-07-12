# ▲ Triangle Reviewer

**Instagram for triangles in real life.** Photograph triangles you find in the
world and post them. Every triangle is scored out of **100** from four
components: the **uploader's** own score (/30), the **community average**
(/30), the **Triangle Council's** average (/30), and the **Triangle Zealot's**
criteria-free verdict (/10). The 30-point scores rate **Aesthetic Quality**,
**Tacticality**, and **Triangularity**, each out of 10. Council members and
the (single) Zealot are chosen on the backend. Top-scoring triangles lead the
Explore page and get suggested in feeds.

Mobile-first, Instagram-style UI: bottom tab bar, top search bar, army green
and white.

**This is a real app, not a mockup**: accounts with password login (scrypt +
session cookies), photo uploads in Supabase Storage, and data in Supabase
Postgres. The app is login-first — visitors land on the login page and sign
up from there. Assign roles from the backend with
`npm run set-role -- <username> <member|council|zealot>`.

## Tech stack

- [Next.js](https://nextjs.org/) (App Router)
- TypeScript (strict)
- Tailwind CSS
- Supabase (Postgres + Storage) with hand-rolled session-cookie auth

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | Description                     |
| --------------- | ------------------------------- |
| `npm run dev`   | Start the dev server            |
| `npm run build` | Production build                |
| `npm run start` | Serve the production build      |
| `npm run lint`  | Run ESLint                      |
| `npm run set-role -- <username> <role>` | Assign `member`/`council`/`zealot` |

## Setup & deploying

Data lives in a [Supabase](https://supabase.com) project (Postgres +
Storage), so the app runs anywhere Next.js runs — including Vercel — with
full persistence.

Required environment variables (locally in `.env.local`, gitignored; on
Vercel under Settings → Environment Variables):

```
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SECRET_KEY=sb_secret_...
```

The secret key stays server-side only — never expose it as `NEXT_PUBLIC_`.

One-time project setup:

1. Run `supabase/schema.sql` in the Supabase **SQL Editor**
   (Dashboard → SQL Editor → New query → paste → Run).
2. `npm run init-supabase` — creates the public `uploads` storage bucket
   and verifies the schema.

Then `npm run dev` locally, or deploy to Vercel with the same env vars.

## Project layout

```
app/          Routes (feed, explore, search, detail, profiles, auth, upload)
components/   Reusable UI (BottomNav, TriangleCard, ScoreBreakdown, ...)
lib/          Domain types, SQLite data access, auth, server actions
scripts/      Backend admin (set-role)
data/         Runtime state, gitignored (SQLite db + uploaded photos)
```

See [`CLAUDE.md`](./CLAUDE.md) for the scoring model, conventions, and the
roadmap (hosted deploy, admin surface, image pipeline).
