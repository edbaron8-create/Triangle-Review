import { randomUUID } from "node:crypto";
import { check, supabase } from "@/lib/supabase";
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
 * Data access layer over Supabase Postgres (via PostgREST). This is the
 * ONLY module that knows where data comes from — pages and components call
 * these helpers and never touch queries directly.
 */

/* ------------------------------------------------------------------ */
/* Row mapping                                                         */
/* ------------------------------------------------------------------ */

export interface UserRow {
  id: string;
  username: string;
  bio: string;
  role: TrianglerRole;
  avatar_hue: number;
  password_hash: string;
  joined: string;
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
  /** Joined author role (see TRIANGLE_SELECT). */
  author?: { role: TrianglerRole } | null;
}

interface TriangleRow {
  id: string;
  title: string;
  description: string;
  location: string;
  image_url: string;
  author_id: string;
  created_at: string;
  reviews?: ReviewRow[];
}

/** Triangles are always fetched with their reviews + each reviewer's role. */
const TRIANGLE_SELECT = "*, reviews(*, author:users!author_id(role))";
const REVIEW_SELECT = "*, author:users!author_id(role)";

export function rowToTriangler(row: UserRow): Triangler {
  return {
    id: row.id,
    username: row.username,
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
    authorRole: row.author?.role,
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

function rowToTriangle(row: TriangleRow): Triangle {
  const reviews = (row.reviews ?? [])
    .map(rowToReview)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
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
/* Trianglers                                                          */
/* ------------------------------------------------------------------ */

export async function getTrianglerById(id: string): Promise<Triangler | undefined> {
  const { data, error } = await supabase()
    .from("users")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  check(error);
  return data ? rowToTriangler(data as UserRow) : undefined;
}

export async function getTrianglerByUsername(
  username: string,
): Promise<Triangler | undefined> {
  const { data, error } = await supabase()
    .from("users")
    .select("*")
    .eq("username", username.trim().toLowerCase())
    .maybeSingle();
  check(error);
  return data ? rowToTriangler(data as UserRow) : undefined;
}

export async function getFollowerCount(userId: string): Promise<number> {
  const { count, error } = await supabase()
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("followee_id", userId);
  check(error);
  return count ?? 0;
}

export async function getFollowingCount(userId: string): Promise<number> {
  const { count, error } = await supabase()
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", userId);
  check(error);
  return count ?? 0;
}

async function followingIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase()
    .from("follows")
    .select("followee_id")
    .eq("follower_id", userId);
  check(error);
  return (data ?? []).map((r) => (r as { followee_id: string }).followee_id);
}

export async function isFollowing(
  followerId: string,
  followeeId: string,
): Promise<boolean> {
  const { count, error } = await supabase()
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", followerId)
    .eq("followee_id", followeeId);
  check(error);
  return (count ?? 0) > 0;
}

/** Trianglers the given user doesn't follow yet (for suggestions). */
export async function getSuggestedTrianglers(
  userId: string,
  limit = 4,
): Promise<Triangler[]> {
  const exclude = [userId, ...(await followingIds(userId))];
  const { data, error } = await supabase()
    .from("users")
    .select("*")
    .not("id", "in", `(${exclude.map((id) => `"${id}"`).join(",")})`)
    .order("joined")
    .limit(limit);
  check(error);
  return ((data ?? []) as UserRow[]).map(rowToTriangler);
}

/** Toggle whether `userId` follows `targetId`. Returns the new state. */
export async function setFollowing(
  userId: string,
  targetId: string,
): Promise<boolean> {
  if (userId === targetId) return false;
  const del = await supabase()
    .from("follows")
    .delete({ count: "exact" })
    .eq("follower_id", userId)
    .eq("followee_id", targetId);
  check(del.error);
  if ((del.count ?? 0) > 0) return false;

  const ins = await supabase()
    .from("follows")
    .insert({ follower_id: userId, followee_id: targetId });
  // 23505 = already following (raced with another request) — fine.
  if (ins.error && ins.error.code !== "23505") check(ins.error);
  return true;
}

/* ------------------------------------------------------------------ */
/* Triangles + scoring                                                 */
/* ------------------------------------------------------------------ */

/** All triangles, newest-submitted first (feed order). */
export async function getTriangles(): Promise<Triangle[]> {
  const { data, error } = await supabase()
    .from("triangles")
    .select(TRIANGLE_SELECT)
    .order("created_at", { ascending: false });
  check(error);
  return ((data ?? []) as unknown as TriangleRow[]).map(rowToTriangle);
}

/** A single triangle by id, or undefined if not found. */
export async function getTriangleById(id: string): Promise<Triangle | undefined> {
  const { data, error } = await supabase()
    .from("triangles")
    .select(TRIANGLE_SELECT)
    .eq("id", id)
    .maybeSingle();
  check(error);
  return data ? rowToTriangle(data as unknown as TriangleRow) : undefined;
}

/** Triangles posted by a user, newest first. */
export async function getTrianglesBy(userId: string): Promise<Triangle[]> {
  const { data, error } = await supabase()
    .from("triangles")
    .select(TRIANGLE_SELECT)
    .eq("author_id", userId)
    .order("created_at", { ascending: false });
  check(error);
  return ((data ?? []) as unknown as TriangleRow[]).map(rowToTriangle);
}

/** Create a triangle post with the uploader's initial score. */
export async function createTriangle(input: {
  title: string;
  description: string;
  location: string;
  imageUrl: string;
  authorId: string;
  ratings: Ratings;
}): Promise<Triangle> {
  const id = `t-${randomUUID()}`;
  const { error } = await supabase().from("triangles").insert({
    id,
    title: input.title.trim().slice(0, 80),
    description: input.description.trim().slice(0, 500),
    location: input.location.trim().slice(0, 80),
    image_url: input.imageUrl,
    author_id: input.authorId,
    created_at: new Date().toISOString(),
  });
  check(error);
  await upsertReview(id, input.authorId, {
    ratings: input.ratings,
    zealotScore: 0,
    comment: "",
  });
  return (await getTriangleById(id))!;
}

/** A review's points: 30-point axes total, or the Zealot's 10-point score. */
export function reviewTotal(review: Review): number {
  if (review.kind === "zealot") return review.score;
  const { aesthetic, tacticality, triangularity } = review.ratings;
  return aesthetic + tacticality + triangularity;
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
    } else if (review.authorRole === "council") {
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
  const ranked = (await getTriangles()).sort(
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
  const followedIds = new Set(await followingIds(userId));
  const all = await getTriangles();

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
  // Escape LIKE wildcards; strip characters that would break the .or() syntax.
  const safe = q.replace(/[%_\\]/g, "\\$&").replace(/[(),."]/g, " ").trim();
  if (!safe) return { trianglers: [], triangles: [] };
  const pat = `"%${safe}%"`;

  const users = await supabase()
    .from("users")
    .select("*")
    // .ilike() takes the raw pattern (no .or()-style quote wrapping).
    .ilike("username", `%${safe}%`)
    .order("username")
    .limit(20);
  check(users.error);

  const triangles = await supabase()
    .from("triangles")
    .select(TRIANGLE_SELECT)
    .or(`title.ilike.${pat},description.ilike.${pat},location.ilike.${pat}`)
    .order("created_at", { ascending: false })
    .limit(30);
  check(triangles.error);

  return {
    trianglers: ((users.data ?? []) as UserRow[]).map(rowToTriangler),
    triangles: ((triangles.data ?? []) as unknown as TriangleRow[]).map(rowToTriangle),
  };
}

/* ------------------------------------------------------------------ */
/* Reviews                                                             */
/* ------------------------------------------------------------------ */

/** All reviews written by a user, newest first, with their triangle. */
export async function getReviewsBy(
  userId: string,
): Promise<Array<{ review: Review; triangle: Triangle }>> {
  const { data, error } = await supabase()
    .from("reviews")
    .select(REVIEW_SELECT)
    .eq("author_id", userId)
    .order("created_at", { ascending: false });
  check(error);
  const rows = (data ?? []) as unknown as ReviewRow[];
  if (rows.length === 0) return [];

  const ids = [...new Set(rows.map((r) => r.triangle_id))];
  const { data: tData, error: tError } = await supabase()
    .from("triangles")
    .select(TRIANGLE_SELECT)
    .in("id", ids);
  check(tError);
  const byId = new Map(
    ((tData ?? []) as unknown as TriangleRow[]).map((row) => [row.id, rowToTriangle(row)]),
  );

  return rows.flatMap((row) => {
    const triangle = byId.get(row.triangle_id);
    return triangle ? [{ review: rowToReview(row), triangle }] : [];
  });
}

export async function getReviewCountBy(userId: string): Promise<number> {
  const { count, error } = await supabase()
    .from("reviews")
    .select("*", { count: "exact", head: true })
    .eq("author_id", userId);
  check(error);
  return count ?? 0;
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
  const { data: tri, error: triError } = await supabase()
    .from("triangles")
    .select("author_id")
    .eq("id", triangleId)
    .maybeSingle();
  check(triError);
  const author = await getTrianglerById(authorId);
  if (!tri || !author) return undefined;

  const comment = input.comment.trim().slice(0, 500);
  const isZealot =
    author.role === "zealot" && authorId !== (tri as { author_id: string }).author_id;

  // Keep the row id stable across edits.
  const { data: existing, error: exError } = await supabase()
    .from("reviews")
    .select("id")
    .eq("triangle_id", triangleId)
    .eq("author_id", authorId)
    .maybeSingle();
  check(exError);

  const row: Omit<ReviewRow, "author"> = {
    id: (existing as { id: string } | null)?.id ?? `r-${randomUUID()}`,
    triangle_id: triangleId,
    author_id: authorId,
    kind: isZealot ? "zealot" : "axes",
    aesthetic: isZealot ? null : clamp(input.ratings.aesthetic, 10),
    tacticality: isZealot ? null : clamp(input.ratings.tacticality, 10),
    triangularity: isZealot ? null : clamp(input.ratings.triangularity, 10),
    zealot_score: isZealot ? clamp(input.zealotScore, 10) : null,
    comment,
    created_at: new Date().toISOString(),
  };

  const { error: upError } = await supabase()
    .from("reviews")
    .upsert(row, { onConflict: "triangle_id,author_id" });
  check(upError);

  return rowToReview({ ...row, author: { role: author.role } });
}
