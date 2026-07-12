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
session cookies), photo uploads saved to disk, and a SQLite database. On first
run it seeds 8 demo accounts (password `triangle`) and 10 demo triangles;
delete `data/` for a factory reset. Assign roles from the backend with
`npm run set-role -- <handle> <member|council|zealot>`.

## Tech stack

- [Next.js](https://nextjs.org/) (App Router)
- TypeScript (strict)
- Tailwind CSS

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
