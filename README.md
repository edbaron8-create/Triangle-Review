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
app/          Routes (feed, explore, search, triangle detail, profiles, upload)
components/   Reusable UI (BottomNav, TriangleCard, ScoreBreakdown, ...)
lib/          Domain types, data access (mock fixtures + roles), server actions
```

Data is served from in-memory mock fixtures in `lib/data.ts`. See
[`CLAUDE.md`](./CLAUDE.md) for conventions and the roadmap toward real
persistence, auth, and photo uploads.
