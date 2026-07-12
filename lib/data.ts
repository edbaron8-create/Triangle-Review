import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import type {
  FeedItem,
  Ratings,
  Review,
  Score,
  Triangle,
  Triangler,
  TrianglerRole,
} from "@/lib/types";

/**
 * Data access layer. This is the ONLY module that knows where data comes
 * from — pages and components call these helpers and never touch SQL.
 *
 * Every exported helper is async even though the current SQLite driver is
 * synchronous, so swapping in an async backend (Postgres/Supabase) changes
 * only this file's internals — no call sites move.
 */

/* ------------------------------------------------------------------ */
/* Row mapping                                                         */
/* ------------------------------------------------------------------ */

export interface UserRow {
  id: string;
  handle: string;
  name: string;
  bio: string;
  role: TrianglerRole;
  avatar_hue: number;
  password_hash: string;
  joined: string;
}

interface TriangleRow {
  id: string;
  title: string;
  description: string;
  location: string;
  image_url: string;
  author_id: string;
  created_at: string;
}

interface ReviewRow {
  id: string;
  triangle_id: string;
  author_id: string;
  kind: "axes" | "zealot";
  aesthetic: number | null;
  tacticality: number | null;
  triangularity: number | null;
  zealot_score: number | null;
  comment: string;
  created_at: string;
}

export function rowToTriangler(row: UserRow): Triangler {
  return {
    id: row.id,
    handle: row.handle,
    name: row.name,
    bio: row.bio,
    role: row.role,
    avatarHue: row.avatar_hue,
    joined: row.joined,
  };
}

function rowToReview(row: ReviewRow): Review {
  const base = {
    id: row.id,
    triangleId: row.triangle_id,
    authorId: row.author_id,
    comment: row.comment,
    createdAt: row.created_at,
  };
  return row.kind === "zealot"
    ? { ...base, kind: "zealot", score: row.zealot_score ?? 0 }
    : {
        ...base,
        kind: "axes",
        ratings: {
          aesthetic: row.aesthetic ?? 0,
          tacticality: row.tacticality ?? 0,
          triangularity: row.triangularity ?? 0,
        },
      };
}

function rowToTriangle(row: TriangleRow, reviews: Review[]): Triangle {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    location: row.location,
    imageUrl: row.image_url,
    authorId: row.author_id,
    createdAt: row.created_at,
    reviews,
  };
}

/* ------------------------------------------------------------------ */
/* Sync internals (SQLite)                                             */
/* ------------------------------------------------------------------ */

function userById(id: string): Triangler | undefined {
  const row = db().prepare("SELECT * FROM users WHERE id = ?").get(id) as
    | UserRow
    | undefined;
  return row ? rowToTriangler(row) : undefined;
}

/** Fetch reviews for a set of triangles in one query, grouped by triangle. */
function reviewsFor(triangleIds: string[]): Map<string, Review[]> {
  const map = new Map<string, Review[]>();
  if (triangleIds.length === 0) return map;
  const placeholders = triangleIds.map(() => "?").join(",");
  const rows = db()
    .prepare(
      `SELECT * FROM reviews WHERE triangle_id IN (${placeholders}) ORDER BY created_at`,
    )
    .all(...triangleIds) as ReviewRow[];
  for (const row of rows) {
    const list = map.get(row.triangle_id) ?? [];
    list.push(rowToReview(row));
    map.set(row.triangle_id, list);
  }
  return map;
}

function hydrate(rows: TriangleRow[]): Triangle[] {
  const reviews = reviewsFor(rows.map((r) => r.id));
  return rows.map((row) => rowToTriangle(row, reviews.get(row.id) ?? []));
}

function allTriangles(): Triangle[] {
  const rows = db()
    .prepare("SELECT * FROM triangles ORDER BY created_at DESC")
    .all() as TriangleRow[];
  return hydrate(rows);
}

function computeScore(triangle: Triangle): Score {
  let uploader: number | null = null;
  let zealot: number | null = null;
  const community: number[] = [];
  const council: number[] = [];

  for (const review of triangle.reviews) {
    if (review.kind === "zealot") {
      zealot = review.score;
      continue;
    }
    const total = reviewTotal(review);
    if (review.authorId === triangle.authorId) {
      uploader = total;
    } else if (userById(review.authorId)?.role === "council") {
      council.push(total);
    } else {
      community.push(total);
    }
  }

  const avg = (xs: number[]) =>
    xs.length === 0 ? null : xs.reduce((a, b) => a + b, 0) / xs.length;

  const communityAvg = avg(community);
  const councilAvg = avg(council);

  return {
    total: (uploader ?? 0) + (communityAvg ?? 0) + (councilAvg ?? 0) + (zealot ?? 0),
    uploader,
    community: communityAvg,
    communityCount: community.length,
    council: councilAvg,
    councilCount: council.length,
    zealot,
    count: triangle.reviews.length,
  };
}

/* ------------------------------------------------------------------ */
/* Trianglers                                                          */
/* ------------------------------------------------------------------ */

export async function getTrianglerById(id: string): Promise<Triangler | undefined> {
  return userById(id);
}

export async function getTrianglerByHandle(
  handle: string,
): Promise<Triangler | undefined> {
  const row = db().prepare("SELECT * FROM users WHERE handle = ?").get(handle) as
    | UserRow
    | undefined;
  return row ? rowToTriangler(row) : undefined;
}

export async function getFollowerCount(userId: string): Promise<number> {
  const row = db()
    .prepare("SELECT COUNT(*) AS n FROM follows WHERE followee_id = ?")
    .get(userId) as { n: number };
  return row.n;
}

export async function getFollowingCount(userId: string): Promise<number> {
  const row = db()
    .prepare("SELECT COUNT(*) AS n FROM follows WHERE follower_id = ?")
    .get(userId) as { n: number };
  return row.n;
}

export async function isFollowing(
  followerId: string,
  followeeId: string,
): Promise<boolean> {
  return !!db()
    .prepare("SELECT 1 FROM follows WHERE follower_id = ? AND followee_id = ?")
    .get(followerId, followeeId);
}

/** Trianglers the given user doesn't follow yet (for suggestions). */
export async function getSuggestedTrianglers(
  userId: string,
  limit = 4,
): Promise<Triangler[]> {
  const rows = db()
    .prepare(
      `SELECT * FROM users
       WHERE id != ?
         AND id NOT IN (SELECT followee_id FROM follows WHERE follower_id = ?)
       ORDER BY joined LIMIT ?`,
    )
    .all(userId, userId, limit) as UserRow[];
  return rows.map(rowToTriangler);
}

/** Toggle whether `userId` follows `targetId`. Returns the new state. */
export async function setFollowing(
  userId: string,
  targetId: string,
): Promise<boolean> {
  if (userId === targetId) return false;
  const conn = db();
  const removed = conn
    .prepare("DELETE FROM follows WHERE follower_id = ? AND followee_id = ?")
    .run(userId, targetId);
  if (removed.changes > 0) return false;
  conn
    .prepare("INSERT OR IGNORE INTO follows (follower_id, followee_id) VALUES (?, ?)")
    .run(userId, targetId);
  return true;
}

/* ------------------------------------------------------------------ */
/* Triangles + scoring                                                 */
/* ------------------------------------------------------------------ */

/** All triangles, newest-submitted first (feed order). */
export async function getTriangles(): Promise<Triangle[]> {
  return allTriangles();
}

/** A single triangle by id, or undefined if not found. */
export async function getTriangleById(id: string): Promise<Triangle | undefined> {
  const row = db().prepare("SELECT * FROM triangles WHERE id = ?").get(id) as
    | TriangleRow
    | undefined;
  return row ? hydrate([row])[0] : undefined;
}

/** Triangles posted by a user, newest first. */
export async function getTrianglesBy(userId: string): Promise<Triangle[]> {
  const rows = db()
    .prepare("SELECT * FROM triangles WHERE author_id = ? ORDER BY created_at DESC")
    .all(userId) as TriangleRow[];
  return hydrate(rows);
}

/** Create a triangle post with the uploader's initial score. */
export async function createTriangle(input: {
  title: string;
  description: string;
  location: string;
  imageUrl: string;
  authorId: string;
  ratings: Ratings;
  comment: string;
}): Promise<Triangle> {
  const id = `t-${randomUUID()}`;
  const now = new Date().toISOString();
  db()
    .prepare(
      `INSERT INTO triangles (id, title, description, location, image_url, author_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      id,
      input.title.trim().slice(0, 80),
      input.description.trim().slice(0, 500),
      input.location.trim().slice(0, 80),
      input.imageUrl,
      input.authorId,
      now,
    );
  await upsertReview(id, input.authorId, {
    ratings: input.ratings,
    zealotScore: 0,
    comment: input.comment,
  });
  return (await getTriangleById(id))!;
}

/** A review's points: 30-point axes total, or the Zealot's 10-point score. */
export function reviewTotal(review: Review): number {
  if (review.kind === "zealot") return review.score;
  const { aesthetic, tacticality, triangularity } = review.ratings;
  return aesthetic + tacticality + triangularity;
}

/**
 * Compute a triangle's Score out of 100 from four components:
 * the uploader's own score (/30), the average of community members' scores
 * (/30), the average of Council members' scores (/30), and the Zealot's
 * criteria-free verdict (/10). Components missing a score contribute 0 and
 * read as `null` (pending).
 */
export async function scoreOf(triangle: Triangle): Promise<Score> {
  return computeScore(triangle);
}

/** The highest-scoring triangles (Explore / Top Triangles). */
export async function getTopTriangles(limit?: number): Promise<Triangle[]> {
  const ranked = allTriangles().sort(
    (a, b) => computeScore(b).total - computeScore(a).total,
  );
  return limit === undefined ? ranked : ranked.slice(0, limit);
}

/**
 * A home feed: posts from people the user follows (newest first, own posts
 * included) with the top-scored triangles from outside their circle woven
 * in as suggestions.
 */
export async function getFeedFor(userId: string): Promise<FeedItem[]> {
  const followedIds = new Set(
    (
      db()
        .prepare("SELECT followee_id FROM follows WHERE follower_id = ?")
        .all(userId) as Array<{ followee_id: string }>
    ).map((r) => r.followee_id),
  );

  const all = allTriangles();
  const followed: FeedItem[] = all
    .filter((t) => followedIds.has(t.authorId) || t.authorId === userId)
    .map((triangle) => ({ triangle, reason: "following" }));

  const suggestions: FeedItem[] = all
    .filter((t) => !followedIds.has(t.authorId) && t.authorId !== userId)
    .sort((a, b) => computeScore(b).total - computeScore(a).total)
    .slice(0, 3)
    .map((triangle) => ({ triangle, reason: "top" }));

  // Weave one suggestion in after every two followed posts.
  const feed: FeedItem[] = [];
  let s = 0;
  for (let i = 0; i < followed.length; i++) {
    feed.push(followed[i]);
    if ((i + 1) % 2 === 0 && s < suggestions.length) {
      feed.push(suggestions[s++]);
    }
  }
  feed.push(...suggestions.slice(s));
  return feed;
}

/* ------------------------------------------------------------------ */
/* Search                                                              */
/* ------------------------------------------------------------------ */

/** Case-insensitive search over Trianglers and Triangles. */
export async function search(query: string): Promise<{
  trianglers: Triangler[];
  triangles: Triangle[];
}> {
  const q = query.trim().toLowerCase();
  if (!q) return { trianglers: [], triangles: [] };
  // Escape LIKE wildcards in user input.
  const like = `%${q.replace(/([%_\\])/g, "\\$1")}%`;

  const userRows = db()
    .prepare(
      `SELECT * FROM users
       WHERE lower(handle) LIKE ? ESCAPE '\\' OR lower(name) LIKE ? ESCAPE '\\'
       ORDER BY handle LIMIT 20`,
    )
    .all(like, like) as UserRow[];

  const triangleRows = db()
    .prepare(
      `SELECT * FROM triangles
       WHERE lower(title) LIKE ? ESCAPE '\\'
          OR lower(description) LIKE ? ESCAPE '\\'
          OR lower(location) LIKE ? ESCAPE '\\'
       ORDER BY created_at DESC LIMIT 30`,
    )
    .all(like, like, like) as TriangleRow[];

  return {
    trianglers: userRows.map(rowToTriangler),
    triangles: hydrate(triangleRows),
  };
}

/* ------------------------------------------------------------------ */
/* Reviews                                                             */
/* ------------------------------------------------------------------ */

/** All reviews written by a user, newest first, with their triangle. */
export async function getReviewsBy(
  userId: string,
): Promise<Array<{ review: Review; triangle: Triangle }>> {
  const rows = db()
    .prepare("SELECT * FROM reviews WHERE author_id = ? ORDER BY created_at DESC")
    .all(userId) as ReviewRow[];
  const result: Array<{ review: Review; triangle: Triangle }> = [];
  for (const row of rows) {
    const triangle = await getTriangleById(row.triangle_id);
    if (triangle) result.push({ review: rowToReview(row), triangle });
  }
  return result;
}

export async function getReviewCountBy(userId: string): Promise<number> {
  const row = db()
    .prepare("SELECT COUNT(*) AS n FROM reviews WHERE author_id = ?")
    .get(userId) as { n: number };
  return row.n;
}

const clamp = (n: number, max: number) =>
  Math.min(max, Math.max(0, Math.round(Number.isFinite(n) ? n : 0)));

/**
 * Add (or update) a review by `authorId` on a triangle. One review per
 * Triangler per triangle — reviewing again replaces your earlier score.
 * The review kind follows the author's role: the Zealot files a single
 * 0–10 verdict, everyone else (including the uploader) scores the three
 * axes for a total out of 30.
 */
export async function upsertReview(
  triangleId: string,
  authorId: string,
  input: { ratings: Ratings; zealotScore: number; comment: string },
): Promise<Review | undefined> {
  const triangle = db()
    .prepare("SELECT author_id FROM triangles WHERE id = ?")
    .get(triangleId) as { author_id: string } | undefined;
  const author = userById(authorId);
  if (!triangle || !author) return undefined;

  const comment = input.comment.trim().slice(0, 500);
  const isZealot = author.role === "zealot" && authorId !== triangle.author_id;

  const values = isZealot
    ? {
        kind: "zealot",
        aesthetic: null,
        tacticality: null,
        triangularity: null,
        zealot: clamp(input.zealotScore, 10),
      }
    : {
        kind: "axes",
        aesthetic: clamp(input.ratings.aesthetic, 10),
        tacticality: clamp(input.ratings.tacticality, 10),
        triangularity: clamp(input.ratings.triangularity, 10),
        zealot: null,
      };

  db()
    .prepare(
      `INSERT INTO reviews (id, triangle_id, author_id, kind, aesthetic, tacticality, triangularity, zealot_score, comment, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT (triangle_id, author_id) DO UPDATE SET
         kind = excluded.kind,
         aesthetic = excluded.aesthetic,
         tacticality = excluded.tacticality,
         triangularity = excluded.triangularity,
         zealot_score = excluded.zealot_score,
         comment = excluded.comment,
         created_at = excluded.created_at`,
    )
    .run(
      `r-${randomUUID()}`,
      triangleId,
      authorId,
      values.kind,
      values.aesthetic,
      values.tacticality,
      values.triangularity,
      values.zealot,
      comment,
      new Date().toISOString(),
    );

  const row = db()
    .prepare("SELECT * FROM reviews WHERE triangle_id = ? AND author_id = ?")
    .get(triangleId, authorId) as ReviewRow;
  return rowToReview(row);
}
