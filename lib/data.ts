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
 *
 * Roles are configured here (the "backend"): Council members and the single
 * Triangle Zealot are chosen by setting `role` on the seed users below.
 */

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
    role: "member",
    following: ["u2", "u3", "u5", "u7"],
    avatarHue: 205,
    joined: "2026-05-02",
  },
  {
    id: "u2",
    handle: "acute_angie",
    name: "Angie Acute",
    bio: "If it's under 90°, I'm interested. Roofline enthusiast.",
    role: "member",
    following: ["u3", "u4", "u6", "u8"],
    avatarHue: 340,
    joined: "2026-01-14",
  },
  {
    id: "u3",
    handle: "right_riya",
    name: "Riya Wright",
    bio: "90° or nothing. I check corners with a protractor.",
    role: "member",
    following: ["u2", "u5", "u8"],
    avatarHue: 262,
    joined: "2026-02-03",
  },
  {
    id: "u4",
    handle: "obtuse_owen",
    name: "Owen Obtuse",
    bio: "Wide angles, wide horizons. Sandwich geometry researcher.",
    role: "member",
    following: ["u2", "u7"],
    avatarHue: 22,
    joined: "2026-02-19",
  },
  {
    id: "u5",
    handle: "scalene_sam",
    name: "Sam Scalene",
    bio: "No two sides alike. Finding the weird triangles so you don't have to.",
    role: "member",
    following: ["u1", "u2", "u3", "u6"],
    avatarHue: 145,
    joined: "2026-03-11",
  },
  {
    id: "u6",
    handle: "euclid_prime",
    name: "Dr. Euclid Prime",
    bio: "Founding chair of the Triangle Council. Author of “Elements of Vibes”.",
    role: "council",
    following: ["u7", "u8"],
    avatarHue: 278,
    joined: "2025-11-30",
  },
  {
    id: "u7",
    handle: "isosceles_izzy",
    name: "Izzy Isosceles",
    bio: "Triangle Council. Two equal sides, zero equal takes.",
    role: "council",
    following: ["u6", "u8", "u2"],
    avatarHue: 45,
    joined: "2025-12-15",
  },
  {
    id: "u8",
    handle: "hypotenuse_hana",
    name: "Hana Hypotenuse",
    bio: "THE Triangle Zealot. One number. No criteria. Pure conviction.",
    role: "zealot",
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
    image: { scene: "roof", from: "#eaeed4", to: "#a2b158", accent: "#4b5320" },
    authorId: "u2",
    createdAt: "2026-07-08T14:20:00Z",
    reviews: [
      {
        id: "r1", kind: "axes", triangleId: "t1", authorId: "u2",
        ratings: { aesthetic: 8, tacticality: 7, triangularity: 9 },
        comment: "My own find. The symmetry stopped me mid-walk.",
        createdAt: "2026-07-08T14:25:00Z",
      },
      {
        id: "r2", kind: "axes", triangleId: "t1", authorId: "u3",
        ratings: { aesthetic: 8, tacticality: 6, triangularity: 9 },
        comment: "Lovely, but the shadow crops the apex. Half a point off.",
        createdAt: "2026-07-09T09:12:00Z",
      },
      {
        id: "r3", kind: "axes", triangleId: "t1", authorId: "u4",
        ratings: { aesthetic: 8, tacticality: 8, triangularity: 8 },
        comment: "Solid all-rounder. Would shelter under this triangle.",
        createdAt: "2026-07-09T21:40:00Z",
      },
      {
        id: "r4", kind: "axes", triangleId: "t1", authorId: "u6",
        ratings: { aesthetic: 9, tacticality: 7, triangularity: 9 },
        comment: "Textbook isosceles. The Council approves of this gable.",
        createdAt: "2026-07-10T18:05:00Z",
      },
      {
        id: "r5", kind: "zealot", triangleId: "t1", authorId: "u8",
        score: 8,
        comment: "A roof doing roof things. Acceptable.",
        createdAt: "2026-07-11T08:00:00Z",
      },
    ],
  },
  {
    id: "t2",
    title: "Yield, Legend",
    description:
      "Classic downward-pointing road triangle in full sun. Bold red border, unbeatable contrast, maximum authority.",
    location: "Austin, TX",
    image: { scene: "sign", from: "#d6deae", to: "#85963c", accent: "#b91c1c" },
    authorId: "u3",
    createdAt: "2026-07-06T16:45:00Z",
    reviews: [
      {
        id: "r6", kind: "axes", triangleId: "t2", authorId: "u3",
        ratings: { aesthetic: 9, tacticality: 10, triangularity: 10 },
        comment: "I know what I found. Uploader score: near perfect.",
        createdAt: "2026-07-06T16:50:00Z",
      },
      {
        id: "r7", kind: "axes", triangleId: "t2", authorId: "u5",
        ratings: { aesthetic: 9, tacticality: 9, triangularity: 10 },
        comment: "The GOAT of street triangles. Slightly weathered, still sharp.",
        createdAt: "2026-07-07T12:02:00Z",
      },
      {
        id: "r8", kind: "axes", triangleId: "t2", authorId: "u2",
        ratings: { aesthetic: 8, tacticality: 9, triangularity: 10 },
        comment: "Timeless. You simply cannot argue with a yield sign.",
        createdAt: "2026-07-07T15:47:00Z",
      },
      {
        id: "r9", kind: "axes", triangleId: "t2", authorId: "u6",
        ratings: { aesthetic: 9, tacticality: 10, triangularity: 10 },
        comment: "An equilateral icon doing real work directing traffic. Council gold standard.",
        createdAt: "2026-07-07T19:30:00Z",
      },
      {
        id: "r10", kind: "axes", triangleId: "t2", authorId: "u7",
        ratings: { aesthetic: 9, tacticality: 9, triangularity: 10 },
        comment: "Deployed with purpose. This triangle has a job and does it.",
        createdAt: "2026-07-08T08:22:00Z",
      },
      {
        id: "r11", kind: "zealot", triangleId: "t2", authorId: "u8",
        score: 10,
        comment: "I have no notes. The yield sign is why I believe in triangles.",
        createdAt: "2026-07-08T20:15:00Z",
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
        id: "r12", kind: "axes", triangleId: "t3", authorId: "u5",
        ratings: { aesthetic: 10, tacticality: 7, triangularity: 10 },
        comment: "I hiked four hours for this angle. Worth it.",
        createdAt: "2026-07-04T02:20:00Z",
      },
      {
        id: "r13", kind: "axes", triangleId: "t3", authorId: "u3",
        ratings: { aesthetic: 10, tacticality: 3, triangularity: 6 },
        comment: "Breathtaking, but is a mountain really *deploying* its triangle? Low tacticality.",
        createdAt: "2026-07-04T13:33:00Z",
      },
      {
        id: "r14", kind: "axes", triangleId: "t3", authorId: "u1",
        ratings: { aesthetic: 10, tacticality: 5, triangularity: 7 },
        comment: "I gasped. Nature understood the assignment.",
        createdAt: "2026-07-05T20:51:00Z",
      },
      {
        id: "r15", kind: "axes", triangleId: "t3", authorId: "u7",
        ratings: { aesthetic: 10, tacticality: 4, triangularity: 7 },
        comment: "The Council debated this one for an hour. Gorgeous, geologically smug.",
        createdAt: "2026-07-06T10:18:00Z",
      },
      {
        id: "r16", kind: "zealot", triangleId: "t3", authorId: "u8",
        score: 6,
        comment: "It's a mountain. Nature gets no credit for accidents.",
        createdAt: "2026-07-06T21:40:00Z",
      },
    ],
  },
  {
    id: "t4",
    title: "The Grilled Cheese Diagonal",
    description:
      "A sandwich cut corner-to-corner. Debatable geometry, undeniable appeal. The cheese pull follows the hypotenuse.",
    location: "Chicago, IL",
    image: { scene: "sandwich", from: "#f6f7ec", to: "#bcc87f", accent: "#4b5320" },
    authorId: "u4",
    createdAt: "2026-07-02T18:00:00Z",
    reviews: [
      {
        id: "r17", kind: "axes", triangleId: "t4", authorId: "u4",
        ratings: { aesthetic: 9, tacticality: 10, triangularity: 8 },
        comment: "Uploader score. It was delicious and geometric.",
        createdAt: "2026-07-02T18:05:00Z",
      },
      {
        id: "r18", kind: "axes", triangleId: "t4", authorId: "u2",
        ratings: { aesthetic: 8, tacticality: 9, triangularity: 7 },
        comment: "Edible triangles are underrated. Cutting diagonal was the correct tactical call.",
        createdAt: "2026-07-02T21:15:00Z",
      },
      {
        id: "r19", kind: "axes", triangleId: "t4", authorId: "u5",
        ratings: { aesthetic: 6, tacticality: 8, triangularity: 5 },
        comment: "The crust ruins the hypotenuse. Still ate it though.",
        createdAt: "2026-07-03T11:08:00Z",
      },
    ],
  },
  {
    id: "t5",
    title: "Giza, But It's an Office Park",
    description:
      "A glass pyramid someone built next to a parking lot. Confusing as architecture, magnificent as a triangle.",
    location: "Memphis, TN",
    image: { scene: "pyramid", from: "#eaeed4", to: "#85963c", accent: "#373c21" },
    authorId: "u6",
    createdAt: "2026-06-29T15:30:00Z",
    reviews: [
      {
        id: "r20", kind: "axes", triangleId: "t5", authorId: "u6",
        ratings: { aesthetic: 9, tacticality: 8, triangularity: 9 },
        comment: "I upload it as a member, not as the Council. Recused from my own case.",
        createdAt: "2026-06-29T15:35:00Z",
      },
      {
        id: "r21", kind: "axes", triangleId: "t5", authorId: "u2",
        ratings: { aesthetic: 8, tacticality: 7, triangularity: 8 },
        comment: "The reflections double the triangle count. Great value.",
        createdAt: "2026-06-30T09:27:00Z",
      },
      {
        id: "r22", kind: "axes", triangleId: "t5", authorId: "u7",
        ratings: { aesthetic: 9, tacticality: 8, triangularity: 9 },
        comment: "Four triangles pretending to be one building. Efficient. Council approved.",
        createdAt: "2026-06-30T20:44:00Z",
      },
      {
        id: "r23", kind: "zealot", triangleId: "t5", authorId: "u8",
        score: 8,
        comment: "A building shaped like conviction.",
        createdAt: "2026-07-01T07:12:00Z",
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
    authorId: "u3",
    createdAt: "2026-06-26T22:05:00Z",
    reviews: [
      {
        id: "r24", kind: "axes", triangleId: "t6", authorId: "u3",
        ratings: { aesthetic: 9, tacticality: 8, triangularity: 8 },
        comment: "Waited twenty minutes for the jib to line up. Uploader score.",
        createdAt: "2026-06-26T22:10:00Z",
      },
      {
        id: "r25", kind: "axes", triangleId: "t6", authorId: "u1",
        ratings: { aesthetic: 8, tacticality: 8, triangularity: 8 },
        comment: "I want to be on that boat.",
        createdAt: "2026-06-28T14:12:00Z",
      },
      {
        id: "r26", kind: "axes", triangleId: "t6", authorId: "u6",
        ratings: { aesthetic: 9, tacticality: 9, triangularity: 8 },
        comment: "Sails are triangles with employment. Wind-powered tacticality.",
        createdAt: "2026-06-29T08:10:00Z",
      },
      {
        id: "r27", kind: "zealot", triangleId: "t6", authorId: "u8",
        score: 9,
        comment: "Wind-powered geometry. I felt something.",
        createdAt: "2026-06-29T19:55:00Z",
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
        id: "r28", kind: "axes", triangleId: "t7", authorId: "u7",
        ratings: { aesthetic: 9, tacticality: 9, triangularity: 9 },
        comment: "Uploading as a civilian, scoring as one too. The recursion is real.",
        createdAt: "2026-06-23T19:45:00Z",
      },
      {
        id: "r29", kind: "axes", triangleId: "t7", authorId: "u4",
        ratings: { aesthetic: 9, tacticality: 9, triangularity: 9 },
        comment: "A triangle containing triangles. Fractal snacking.",
        createdAt: "2026-06-23T22:31:00Z",
      },
      {
        id: "r30", kind: "axes", triangleId: "t7", authorId: "u6",
        ratings: { aesthetic: 8, tacticality: 9, triangularity: 9 },
        comment: "The interior pepperoni triangle is a bold flex from a fellow Council member.",
        createdAt: "2026-06-24T10:02:00Z",
      },
      {
        id: "r31", kind: "zealot", triangleId: "t7", authorId: "u8",
        score: 9,
        comment: "I ate a slice like this once. Changed me.",
        createdAt: "2026-06-24T21:30:00Z",
      },
    ],
  },
  {
    id: "t8",
    title: "First Tent, Best Tent",
    description:
      "My first ever triangle post! Pitched this A-frame at dawn. It leans a little but so do I.",
    location: "Yosemite, CA",
    image: { scene: "tent", from: "#1c200e", to: "#373c21", accent: "#a2b158" },
    authorId: "u1",
    createdAt: "2026-06-20T06:15:00Z",
    reviews: [
      {
        id: "r32", kind: "axes", triangleId: "t8", authorId: "u1",
        ratings: { aesthetic: 9, tacticality: 9, triangularity: 8 },
        comment: "Scoring my own tent. I pitched it, I love it, I regret nothing.",
        createdAt: "2026-06-20T06:30:00Z",
      },
      {
        id: "r33", kind: "axes", triangleId: "t8", authorId: "u5",
        ratings: { aesthetic: 7, tacticality: 8, triangularity: 6 },
        comment: "Respect the hustle, but the lean costs you triangularity points.",
        createdAt: "2026-06-20T15:44:00Z",
      },
      {
        id: "r34", kind: "axes", triangleId: "t8", authorId: "u7",
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
    image: { scene: "chip", from: "#f6f7ec", to: "#d6deae", accent: "#67772c" },
    authorId: "u2",
    createdAt: "2026-06-17T12:50:00Z",
    reviews: [
      {
        id: "r35", kind: "axes", triangleId: "t9", authorId: "u2",
        ratings: { aesthetic: 9, tacticality: 9, triangularity: 10 },
        comment: "Uploader score. I still haven't eaten it. It's on my shelf.",
        createdAt: "2026-06-17T12:55:00Z",
      },
      {
        id: "r36", kind: "axes", triangleId: "t9", authorId: "u3",
        ratings: { aesthetic: 8, tacticality: 5, triangularity: 10 },
        comment: "Measured the corners from the photo. All 60°. I have chills.",
        createdAt: "2026-06-18T11:37:00Z",
      },
      {
        id: "r37", kind: "zealot", triangleId: "t9", authorId: "u8",
        score: 8,
        comment: "A perfect chip. No notes.",
        createdAt: "2026-06-18T22:09:00Z",
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
        id: "r38", kind: "axes", triangleId: "t10", authorId: "u5",
        ratings: { aesthetic: 7, tacticality: 9, triangularity: 7 },
        comment: "Uploader score. Retail geometry deserves respect.",
        createdAt: "2026-06-14T20:30:00Z",
      },
      {
        id: "r39", kind: "axes", triangleId: "t10", authorId: "u2",
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

/** Trianglers the given user doesn't follow yet (for suggestions). */
export function getSuggestedTrianglers(userId: string, limit = 4): Triangler[] {
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
export function scoreOf(triangle: Triangle): Score {
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
    } else if (getTrianglerById(review.authorId)?.role === "council") {
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
/* Search                                                              */
/* ------------------------------------------------------------------ */

/** Case-insensitive search over Trianglers and Triangles. */
export function search(query: string): {
  trianglers: Triangler[];
  triangles: Triangle[];
} {
  const q = query.trim().toLowerCase();
  if (!q) return { trianglers: [], triangles: [] };
  return {
    trianglers: trianglers.filter(
      (t) =>
        t.handle.toLowerCase().includes(q) || t.name.toLowerCase().includes(q),
    ),
    triangles: getTriangles().filter((t) =>
      [t.title, t.description, t.location].some((s) =>
        s.toLowerCase().includes(q),
      ),
    ),
  };
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

const clamp = (n: number, max: number) =>
  Math.min(max, Math.max(0, Math.round(Number.isFinite(n) ? n : 0)));

/**
 * Add (or update) a review by `authorId` on a triangle. One review per
 * Triangler per triangle — reviewing again replaces your earlier score.
 * The review kind follows the author's role: the Zealot files a single
 * 0–10 verdict, everyone else (including the uploader) scores the three
 * axes for a total out of 30.
 */
export function upsertReview(
  triangleId: string,
  authorId: string,
  input: { ratings: Ratings; zealotScore: number; comment: string },
): Review | undefined {
  const triangle = getTriangleById(triangleId);
  const author = getTrianglerById(authorId);
  if (!triangle || !author) return undefined;

  const comment = input.comment.trim().slice(0, 500);
  const createdAt = new Date().toISOString();
  const isZealot = author.role === "zealot" && authorId !== triangle.authorId;

  const review: Review = isZealot
    ? {
        id: `r-${crypto.randomUUID()}`, kind: "zealot",
        triangleId, authorId, comment, createdAt,
        score: clamp(input.zealotScore, 10),
      }
    : {
        id: `r-${crypto.randomUUID()}`, kind: "axes",
        triangleId, authorId, comment, createdAt,
        ratings: {
          aesthetic: clamp(input.ratings.aesthetic, 10),
          tacticality: clamp(input.ratings.tacticality, 10),
          triangularity: clamp(input.ratings.triangularity, 10),
        },
      };

  const idx = triangle.reviews.findIndex((r) => r.authorId === authorId);
  if (idx >= 0) {
    review.id = triangle.reviews[idx].id;
    triangle.reviews[idx] = review;
  } else {
    triangle.reviews.push(review);
  }
  return review;
}
