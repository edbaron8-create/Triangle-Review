# ▲ Triangle Reviewer

**Instagram for triangles in real life.** Photograph triangles you find in the
world, post them, and let the community — and the **Triangle Council** — rate
them on **Aesthetic Quality**, **Tacticality**, and **Triangularity** (each out
of 10, for a total out of 30). Council ratings weigh 3×, self-reviews ½×. The
best-rated triangles top the Explore leaderboard and get suggested in feeds.

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
app/          Routes (home feed, explore, triangle detail, profiles, upload)
components/   Reusable UI (TriangleCard, TriangleTile, ReviewForm, ...)
lib/          Domain types, data access (mock fixtures), server actions
```

Data is served from in-memory mock fixtures in `lib/data.ts`. See
[`CLAUDE.md`](./CLAUDE.md) for conventions and the roadmap toward real
persistence, auth, and photo uploads.
