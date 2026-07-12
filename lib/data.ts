import type {
  FeedItem,
  Ratings,
  Review,
  Score,
  Triangle,
  Triangler,
} from "@/lib/types";

/**
 * In-memory mock data + accessor helpers.
 *
 * This is the ONLY module that knows where data comes from. When a real
 * database lands, replace the internals here while keeping these helper
 * signatures stable — the rest of the app should not change.
 */

/** Review weights: the Council counts most, self-reviews count least. */
export const COUNCIL_WEIGHT = 3;
export const COMMUNITY_WEIGHT = 1;
export const UPLOADER_WEIGHT = 0.5;

/**
 * Until auth lands, everyone browses as this Triangler. Their follows drive
 * the home feed and their reviews land under their handle.
 */
export const CURRENT_USER_ID = "u1";

const seedTrianglers = (): Triangler[] => [
  {
    id: "u1",
    handle: "tri_curious",
    name: "Toby Newangle",
    bio: "Just here looking at triangles. Aspiring Council member. 3 sides > everything.",
    isCouncil: false,
    following: ["u2", "u3", "u5", "u6", "u7"],
    avatarHue: 205,
    joined: "2026-05-02",
  },
  {
    id: "u2",
    handle: "acute_angie",
    name: "Angie Acute",
    bio: "If it's under 90°, I'm interested. Roofline enthusiast.",
    isCouncil: false,
    following: ["u3", "u4", "u6", "u8"],
    avatarHue: 340,
    joined: "2026-01-14",
  },
  {
    id: "u3",
    handle: "right_riya",
    name: "Riya Wright",
    bio: "90° or nothing. I check corners with a protractor.",
    isCouncil: false,
    following: ["u2", "u5", "u8"],
    avatarHue: 262,
    joined: "2026-02-03",
  },
  {
    id: "u4",
    handle: "obtuse_owen",
    name: "Owen Obtuse",
    bio: "Wide angles, wide horizons. Sandwich geometry researcher.",
    isCouncil: false,
    following: ["u2", "u7"],
    avatarHue: 22,
    joined: "2026-02-19",
  },
  {
    id: "u5",
    handle: "scalene_sam",
    name: "Sam Scalene",
    bio: "No two sides alike. Finding the weird triangles so you don't have to.",
    isCouncil: false,
    following: ["u1", "u2", "u3", "u6"],
    avatarHue: 145,
    joined: "2026-03-11",
  },
  {
    id: "u6",
    handle: "euclid_prime",
    name: "Dr. Euclid Prime",
    bio: "Founding chair of the Triangle Council. Author of “Elements of Vibes”.",
    isCouncil: true,
    following: ["u7", "u8"],
    avatarHue: 278,
    joined: "2025-11-30",
  },
  {
    id: "u7",
    handle: "isosceles_izzy",
    name: "Izzy Isosceles",
    bio: "Triangle Council. Two equal sides, zero equal takes.",
    isCouncil: true,
    following: ["u6", "u8", "u2"],
    avatarHue: 45,
    joined: "2025-12-15",
  },
  {
    id: "u8",
    handle: "hypotenuse_hana",
    name: "Hana Hypotenuse",
    bio: "Triangle Council. Judging your longest side since 2025.",
    isCouncil: true,
    following: ["u6", "u7", "u3"],
    avatarHue: 190,
    joined: "2025-12-02",
  },
];

const seedTriangles = (): Triangle[] => [
  {
    id: "t1",
    title: "The Flatiron Gable",
    description:
      "A perfectly isosceles gable end spotted on a downtown warehouse. Crisp lines, great symmetry, zero notes.",
    location: "Portland, OR",
    image: { scene: "roof", from: "#fde68a", to: "#f59e0b", accent: "#7c2d12" },
    authorId: "u2",
    createdAt: "2026-07-08T14:20:00Z",
    reviews: [
      {
        id: "r1",
        triangleId: "t1",
        authorId: "u6",
        ratings: { aesthetic: 9, tacticality: 7, triangularity: 9 },
        comment: "Textbook isosceles. The Council approves of this gable.",
        createdAt: "2026-07-08T18:05:00Z",
      },
      {
        id: "r2",
        triangleId: "t1",
        authorId: "u3",
        ratings: { aesthetic: 8, tacticality: 6, triangularity: 9 },
        comment: "Lovely, but the shadow crops the apex. Half a point off.",
        createdAt: "2026-07-09T09:12:00Z",
      },
      {
        id: "r3",
        triangleId: "t1",
        authorId: "u4",
        ratings: { aesthetic: 8, tacticality: 8, triangularity: 8 },
        comment: "Solid all-rounder. Would shelter under this triangle.",
        createdAt: "2026-07-09T21:40:00Z",
      },
    ],
  },
  {
    id: "t2",
    title: "Yield, Legend",
    description:
      "Classic downward-pointing road triangle in full sun. Bold red border, unbeatable contrast, maximum authority.",
    location: "Austin, TX",
    image: { scene: "sign", from: "#bae6fd", to: "#38bdf8", accent: "#dc2626" },
    authorId: "u3",
    createdAt: "2026-07-06T16:45:00Z",
    reviews: [
      {
        id: "r4",
        triangleId: "t2",
        authorId: "u6",
        ratings: { aesthetic: 9, tacticality: 10, triangularity: 10 },
        comment:
          "An equilateral icon doing real work directing traffic. Peak tacticality. Council gold standard.",
        createdAt: "2026-07-06T19:30:00Z",
      },
      {
        id: "r5",
        triangleId: "t2",
        authorId: "u8",
        ratings: { aesthetic: 8, tacticality: 10, triangularity: 10 },
        comment: "Deployed with purpose. This triangle has a job and does it.",
        createdAt: "2026-07-07T08:22:00Z",
      },
      {
        id: "r6",
        triangleId: "t2",
        authorId: "u5",
        ratings: { aesthetic: 9, tacticality: 9, triangularity: 10 },
        comment: "The GOAT of street triangles. Slightly weathered, still sharp.",
        createdAt: "2026-07-07T12:02:00Z",
      },
      {
        id: "r7",
        triangleId: "t2",
        authorId: "u2",
        ratings: { aesthetic: 8, tacticality: 9, triangularity: 10 },
        comment: "Timeless. You simply cannot argue with a yield sign.",
        createdAt: "2026-07-07T15:47:00Z",
      },
    ],
  },
  {
    id: "t3",
    title: "Mount Dorito at Dusk",
    description:
      "Nature's own triangle. Near-perfect slopes against a purple sky. The snow cap is doing a lot of aesthetic work.",
    location: "Boulder, CO",
    image: { scene: "mountain", from: "#c4b5fd", to: "#6d28d9", accent: "#312e81" },
    authorId: "u5",
    createdAt: "2026-07-04T02:10:00Z",
    reviews: [
      {
        id: "r8",
        triangleId: "t3",
        authorId: "u3",
        ratings: { aesthetic: 10, tacticality: 3, triangularity: 6 },
        comment: "Breathtaking, but is a mountain really *deploying* its triangle? Low tacticality.",
        createdAt: "2026-07-04T13:33:00Z",
      },
      {
        id: "r9",
        triangleId: "t3",
        authorId: "u7",
        ratings: { aesthetic: 10, tacticality: 4, triangularity: 7 },
        comment: "The Council debated this one for an hour. Gorgeous, geologically smug.",
        createdAt: "2026-07-05T10:18:00Z",
      },
      {
        id: "r10",
        triangleId: "t3",
        authorId: "u1",
        ratings: { aesthetic: 10, tacticality: 5, triangularity: 7 },
        comment: "I gasped. Nature understood the assignment.",
        createdAt: "2026-07-05T20:51:00Z",
      },
    ],
  },
  {
    id: "t4",
    title: "The Grilled Cheese Diagonal",
    description:
      "A sandwich cut corner-to-corner. Debatable geometry, undeniable appeal. The cheese pull follows the hypotenuse.",
    location: "Chicago, IL",
    image: { scene: "sandwich", from: "#fef3c7", to: "#fbbf24", accent: "#b45309" },
    authorId: "u4",
    createdAt: "2026-07-02T18:00:00Z",
    reviews: [
      {
        id: "r11",
        triangleId: "t4",
        authorId: "u2",
        ratings: { aesthetic: 8, tacticality: 9, triangularity: 7 },
        comment: "Edible triangles are underrated. Cutting diagonal was the correct tactical call.",
        createdAt: "2026-07-02T21:15:00Z",
      },
      {
        id: "r12",
        triangleId: "t4",
        authorId: "u5",
        ratings: { aesthetic: 6, tacticality: 8, triangularity: 5 },
        comment: "The crust ruins the hypotenuse. Still ate it though.",
        createdAt: "2026-07-03T11:08:00Z",
      },
      {
        id: "r13",
        triangleId: "t4",
        authorId: "u4",
        ratings: { aesthetic: 9, tacticality: 10, triangularity: 8 },
        comment: "Reviewing my own sandwich. It was delicious and geometric.",
        createdAt: "2026-07-03T12:00:00Z",
      },
    ],
  },
  {
    id: "t5",
    title: "Giza, But It's an Office Park",
    description:
      "A glass pyramid someone built next to a parking lot. Confusing as architecture, magnificent as a triangle.",
    location: "Memphis, TN",
    image: { scene: "pyramid", from: "#fed7aa", to: "#f97316", accent: "#9a3412" },
    authorId: "u6",
    createdAt: "2026-06-29T15:30:00Z",
    reviews: [
      {
        id: "r14",
        triangleId: "t5",
        authorId: "u8",
        ratings: { aesthetic: 9, tacticality: 8, triangularity: 9 },
        comment: "Four triangles pretending to be one building. Efficient. Council approved.",
        createdAt: "2026-06-29T20:44:00Z",
      },
      {
        id: "r15",
        triangleId: "t5",
        authorId: "u2",
        ratings: { aesthetic: 8, tacticality: 7, triangularity: 9 },
        comment: "The reflections double the triangle count. Great value.",
        createdAt: "2026-06-30T09:27:00Z",
      },
    ],
  },
  {
    id: "t6",
    title: "Regatta Right Angle",
    description:
      "Two sails, both triangles, zero hesitation. Caught the exact moment the jib lined up with the horizon.",
    location: "San Diego, CA",
    image: { scene: "sail", from: "#a5f3fc", to: "#0891b2", accent: "#f8fafc" },
    authorId: "u8",
    createdAt: "2026-06-26T22:05:00Z",
    reviews: [
      {
        id: "r16",
        triangleId: "t6",
        authorId: "u6",
        ratings: { aesthetic: 9, tacticality: 9, triangularity: 8 },
        comment: "Sails are triangles with employment. Wind-powered tacticality.",
        createdAt: "2026-06-27T08:10:00Z",
      },
      {
        id: "r17",
        triangleId: "t6",
        authorId: "u3",
        ratings: { aesthetic: 9, tacticality: 8, triangularity: 8 },
        comment: "The jib/horizon alignment is chef's kiss. Two triangles for the price of one.",
        createdAt: "2026-06-27T17:55:00Z",
      },
      {
        id: "r18",
        triangleId: "t6",
        authorId: "u1",
        ratings: { aesthetic: 8, tacticality: 8, triangularity: 8 },
        comment: "I want to be on that boat.",
        createdAt: "2026-06-28T14:12:00Z",
      },
    ],
  },
  {
    id: "t7",
    title: "Pepperoni Isosceles",
    description:
      "A slice so symmetric it belongs in a museum. Three pepperoni arranged in a smaller interior triangle. Recursion.",
    location: "Brooklyn, NY",
    image: { scene: "pizza", from: "#fee2e2", to: "#fca5a5", accent: "#b91c1c" },
    authorId: "u7",
    createdAt: "2026-06-23T19:40:00Z",
    reviews: [
      {
        id: "r19",
        triangleId: "t7",
        authorId: "u4",
        ratings: { aesthetic: 9, tacticality: 9, triangularity: 9 },
        comment: "A triangle containing triangles. Fractal snacking.",
        createdAt: "2026-06-23T22:31:00Z",
      },
      {
        id: "r20",
        triangleId: "t7",
        authorId: "u6",
        ratings: { aesthetic: 8, tacticality: 9, triangularity: 9 },
        comment: "The interior pepperoni triangle is a bold flex from a fellow Council member.",
        createdAt: "2026-06-24T10:02:00Z",
      },
    ],
  },
  {
    id: "t8",
    title: "First Tent, Best Tent",
    description:
      "My first ever triangle post! Pitched this A-frame at dawn. It leans a little but so do I.",
    location: "Yosemite, CA",
    image: { scene: "tent", from: "#1e293b", to: "#0f172a", accent: "#f59e0b" },
    authorId: "u1",
    createdAt: "2026-06-20T06:15:00Z",
    reviews: [
      {
        id: "r21",
        triangleId: "t8",
        authorId: "u1",
        ratings: { aesthetic: 9, tacticality: 9, triangularity: 8 },
        comment: "Rating my own tent. I pitched it, I love it, I regret nothing.",
        createdAt: "2026-06-20T06:30:00Z",
      },
      {
        id: "r22",
        triangleId: "t8",
        authorId: "u5",
        ratings: { aesthetic: 7, tacticality: 8, triangularity: 6 },
        comment: "Respect the hustle, but the lean costs you triangularity points.",
        createdAt: "2026-06-20T15:44:00Z",
      },
      {
        id: "r23",
        triangleId: "t8",
        authorId: "u7",
        ratings: { aesthetic: 6, tacticality: 8, triangularity: 5 },
        comment: "Council note: an A-frame should frame the A. Promising debut though!",
        createdAt: "2026-06-21T09:20:00Z",
      },
    ],
  },
  {
    id: "t9",
    title: "The Perfect Chip",
    description:
      "Found at the bottom of the bag: an unbroken, salt-dusted, equilateral miracle. I couldn't eat it. I posted it.",
    location: "Santa Fe, NM",
    image: { scene: "chip", from: "#fef9c3", to: "#fde047", accent: "#a16207" },
    authorId: "u2",
    createdAt: "2026-06-17T12:50:00Z",
    reviews: [
      {
        id: "r24",
        triangleId: "t9",
        authorId: "u8",
        ratings: { aesthetic: 9, tacticality: 6, triangularity: 10 },
        comment: "Triangularity: flawless. Tacticality: it's just sitting there. Aesthetic: golden.",
        createdAt: "2026-06-17T16:29:00Z",
      },
      {
        id: "r25",
        triangleId: "t9",
        authorId: "u3",
        ratings: { aesthetic: 8, tacticality: 5, triangularity: 10 },
        comment: "Measured the corners from the photo. All 60°. I have chills.",
        createdAt: "2026-06-18T11:37:00Z",
      },
    ],
  },
  {
    id: "t10",
    title: "Escalator to Nowhere",
    description:
      "The side profile of a mall escalator forms a chunky right triangle. The most tactical triangle in retail.",
    location: "Minneapolis, MN",
    image: { scene: "stairs", from: "#e2e8f0", to: "#94a3b8", accent: "#334155" },
    authorId: "u5",
    createdAt: "2026-06-14T20:25:00Z",
    reviews: [
      {
        id: "r26",
        triangleId: "t10",
        authorId: "u2",
        ratings: { aesthetic: 6, tacticality: 9, triangularity: 8 },
        comment: "Not pretty, but it MOVES PEOPLE DIAGONALLY. That's tacticality.",
        createdAt: "2026-06-15T10:12:00Z",
      },
    ],
  },
];

/**
 * The mutable in-memory store. It lives on `globalThis` because Next.js
 * bundles this module separately per route in production — module-level
 * state would give each route (and each server action) its own copy, so
 * writes from actions would never show up on other pages.
 */
interface TriangleStore {
  trianglers: Triangler[];
  triangles: Triangle[];
}

declare global {
  // eslint-disable-next-line no-var
  var __triangleReviewerStore: TriangleStore | undefined;
}

const store: TriangleStore = (globalThis.__triangleReviewerStore ??= {
  trianglers: seedTrianglers(),
  triangles: seedTriangles(),
});

const trianglers = store.trianglers;
const triangles = store.triangles;

/* ------------------------------------------------------------------ */
/* Trianglers                                                          */
/* ------------------------------------------------------------------ */

/** The mock signed-in user (until real auth lands). */
export function getCurrentUser(): Triangler {
  return getTrianglerById(CURRENT_USER_ID)!;
}

export function getTrianglers(): Triangler[] {
  return trianglers;
}

export function getTrianglerById(id: string): Triangler | undefined {
  return trianglers.find((t) => t.id === id);
}

export function getTrianglerByHandle(handle: string): Triangler | undefined {
  return trianglers.find((t) => t.handle === handle);
}

/** Users who follow the given user. */
export function getFollowers(userId: string): Triangler[] {
  return trianglers.filter((t) => t.following.includes(userId));
}

/** Trianglers the given user doesn't follow yet (for the sidebar). */
export function getSuggestedTrianglers(userId: string, limit = 3): Triangler[] {
  const user = getTrianglerById(userId);
  if (!user) return [];
  return trianglers
    .filter((t) => t.id !== userId && !user.following.includes(t.id))
    .slice(0, limit);
}

/** Toggle whether `userId` follows `targetId`. Returns the new state. */
export function setFollowing(userId: string, targetId: string): boolean {
  const user = getTrianglerById(userId);
  if (!user || userId === targetId) return false;
  const idx = user.following.indexOf(targetId);
  if (idx >= 0) {
    user.following.splice(idx, 1);
    return false;
  }
  user.following.push(targetId);
  return true;
}

/* ------------------------------------------------------------------ */
/* Triangles + scoring                                                 */
/* ------------------------------------------------------------------ */

/** All triangles, newest-submitted first (feed order). */
export function getTriangles(): Triangle[] {
  return [...triangles].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** A single triangle by id, or undefined if not found. */
export function getTriangleById(id: string): Triangle | undefined {
  return triangles.find((t) => t.id === id);
}

/** Triangles posted by a user, newest first. */
export function getTrianglesBy(userId: string): Triangle[] {
  return getTriangles().filter((t) => t.authorId === userId);
}

/**
 * Compute a triangle's aggregate Score from its reviews.
 *
 * Each review's three axes are averaged with weights: Triangle Council
 * members count 3×, regular community members 1×, and the uploader rating
 * their own post 0.5× (enthusiasm is allowed, bias is discounted).
 */
export function scoreOf(triangle: Triangle): Score {
  const zero: Score = {
    total: 0,
    axes: { aesthetic: 0, tacticality: 0, triangularity: 0 },
    count: 0,
    councilCount: 0,
  };
  if (triangle.reviews.length === 0) return zero;

  let weightSum = 0;
  let councilCount = 0;
  const axes = { aesthetic: 0, tacticality: 0, triangularity: 0 };

  for (const review of triangle.reviews) {
    const author = getTrianglerById(review.authorId);
    const isUploader = review.authorId === triangle.authorId;
    const isCouncil = author?.isCouncil ?? false;
    if (isCouncil && !isUploader) councilCount += 1;

    const weight = isUploader
      ? UPLOADER_WEIGHT
      : isCouncil
        ? COUNCIL_WEIGHT
        : COMMUNITY_WEIGHT;

    weightSum += weight;
    axes.aesthetic += review.ratings.aesthetic * weight;
    axes.tacticality += review.ratings.tacticality * weight;
    axes.triangularity += review.ratings.triangularity * weight;
  }

  axes.aesthetic /= weightSum;
  axes.tacticality /= weightSum;
  axes.triangularity /= weightSum;

  return {
    total: axes.aesthetic + axes.tacticality + axes.triangularity,
    axes,
    count: triangle.reviews.length,
    councilCount,
  };
}

/** The highest-scoring triangles (Explore / Top Triangles). */
export function getTopTriangles(limit?: number): Triangle[] {
  const ranked = [...triangles].sort(
    (a, b) => scoreOf(b).total - scoreOf(a).total,
  );
  return limit === undefined ? ranked : ranked.slice(0, limit);
}

/**
 * A user's home feed: posts from people they follow (newest first) with the
 * top-scored triangles from outside their circle woven in as suggestions.
 */
export function getFeedFor(userId: string): FeedItem[] {
  const user = getTrianglerById(userId);
  if (!user) return [];

  const followedSet = new Set(user.following);
  const followed: FeedItem[] = getTriangles()
    .filter((t) => followedSet.has(t.authorId))
    .map((triangle) => ({ triangle, reason: "following" }));

  const suggestions: FeedItem[] = getTopTriangles()
    .filter((t) => !followedSet.has(t.authorId) && t.authorId !== userId)
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
/* Reviews                                                             */
/* ------------------------------------------------------------------ */

/** All reviews written by a user, newest first, with their triangle. */
export function getReviewsBy(
  userId: string,
): Array<{ review: Review; triangle: Triangle }> {
  return triangles
    .flatMap((triangle) =>
      triangle.reviews
        .filter((r) => r.authorId === userId)
        .map((review) => ({ review, triangle })),
    )
    .sort((a, b) => b.review.createdAt.localeCompare(a.review.createdAt));
}

const clampRating = (n: number) =>
  Math.min(10, Math.max(0, Math.round(Number.isFinite(n) ? n : 0)));

/**
 * Add (or update) a review by `authorId` on a triangle. One review per
 * Triangler per triangle — reviewing again replaces your earlier ratings.
 */
export function upsertReview(
  triangleId: string,
  authorId: string,
  ratings: Ratings,
  comment: string,
): Review | undefined {
  const triangle = getTriangleById(triangleId);
  const author = getTrianglerById(authorId);
  if (!triangle || !author) return undefined;

  const clean: Ratings = {
    aesthetic: clampRating(ratings.aesthetic),
    tacticality: clampRating(ratings.tacticality),
    triangularity: clampRating(ratings.triangularity),
  };
  const trimmed = comment.trim().slice(0, 500);

  const existing = triangle.reviews.find((r) => r.authorId === authorId);
  if (existing) {
    existing.ratings = clean;
    existing.comment = trimmed;
    existing.createdAt = new Date().toISOString();
    return existing;
  }

  const review: Review = {
    id: `r-${crypto.randomUUID()}`,
    triangleId,
    authorId,
    ratings: clean,
    comment: trimmed,
    createdAt: new Date().toISOString(),
  };
  triangle.reviews.push(review);
  return review;
}
