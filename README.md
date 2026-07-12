# ▲ Triangle Reviewer

**Instagram for triangles in real life.** Photograph triangles you find in the
world, post them, and let the community review and rate them. The best-rated
triangles rise to the top and get highlighted for everyone.

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
app/          Routes (home feed, triangle detail)
components/    Reusable UI (TriangleCard, ScoreBadge)
lib/          Domain types + data access (currently mock fixtures)
```

Data is served from in-memory mock fixtures in `lib/data.ts`. See
[`CLAUDE.md`](./CLAUDE.md) for conventions and the roadmap toward real
persistence, auth, and photo uploads.
