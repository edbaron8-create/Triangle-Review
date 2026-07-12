import Database from "better-sqlite3";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { hashPassword } from "@/lib/password";
import { seedSvg, type SeedImageSpec } from "@/lib/seedSvgs";

/**
 * SQLite connection + schema + first-run seed.
 *
 * Data lives in DATA_DIR (default `<repo>/data`, gitignored):
 *   data/triangle.db   — the database
 *   data/uploads/      — uploaded photos (and seeded demo .svg images)
 *
 * The connection is cached on `globalThis` because Next.js bundles modules
 * separately per route in production — a plain module-level instance would
 * open one connection (and run one seed check) per route bundle.
 */

/**
 * Serverless hosts (Vercel/Lambda) have a read-only filesystem — only /tmp
 * is writable, and it's wiped whenever the instance recycles. With no
 * DATA_DIR configured there, fall back to /tmp so the app runs in an
 * ephemeral "demo mode" instead of crashing. For real persistence, deploy
 * to a host with a disk (Fly.io, Railway, a VPS) or point DATA_DIR at a
 * mounted volume.
 */
const IS_SERVERLESS =
  !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

/** True when data lives in /tmp and will not survive instance recycling. */
export const EPHEMERAL_DATA = !process.env.DATA_DIR && IS_SERVERLESS;

export const DATA_DIR =
  process.env.DATA_DIR ??
  (IS_SERVERLESS ? "/tmp/triangle-data" : path.join(process.cwd(), "data"));
export const UPLOADS_DIR = path.join(DATA_DIR, "uploads");

declare global {
  // eslint-disable-next-line no-var
  var __triangleDb: Database.Database | undefined;
}

export function db(): Database.Database {
  if (globalThis.__triangleDb) return globalThis.__triangleDb;

  mkdirSync(UPLOADS_DIR, { recursive: true });
  const conn = new Database(path.join(DATA_DIR, "triangle.db"));
  conn.pragma("journal_mode = WAL");
  conn.pragma("foreign_keys = ON");
  migrate(conn);
  seedIfEmpty(conn);
  globalThis.__triangleDb = conn;
  return conn;
}

function migrate(conn: Database.Database) {
  conn.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id            TEXT PRIMARY KEY,
      handle        TEXT NOT NULL UNIQUE COLLATE NOCASE,
      name          TEXT NOT NULL,
      bio           TEXT NOT NULL DEFAULT '',
      role          TEXT NOT NULL DEFAULT 'member'
                    CHECK (role IN ('member', 'council', 'zealot')),
      avatar_hue    INTEGER NOT NULL,
      password_hash TEXT NOT NULL,
      joined        TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS follows (
      follower_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      followee_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      PRIMARY KEY (follower_id, followee_id)
    );

    CREATE TABLE IF NOT EXISTS triangles (
      id          TEXT PRIMARY KEY,
      title       TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      location    TEXT NOT NULL DEFAULT '',
      image_url   TEXT NOT NULL,
      author_id   TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at  TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id            TEXT PRIMARY KEY,
      triangle_id   TEXT NOT NULL REFERENCES triangles(id) ON DELETE CASCADE,
      author_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      kind          TEXT NOT NULL CHECK (kind IN ('axes', 'zealot')),
      aesthetic     INTEGER,
      tacticality   INTEGER,
      triangularity INTEGER,
      zealot_score  INTEGER,
      comment       TEXT NOT NULL DEFAULT '',
      created_at    TEXT NOT NULL,
      UNIQUE (triangle_id, author_id)
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token      TEXT PRIMARY KEY,
      user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_triangles_author ON triangles(author_id);
    CREATE INDEX IF NOT EXISTS idx_reviews_triangle ON reviews(triangle_id);
    CREATE INDEX IF NOT EXISTS idx_reviews_author   ON reviews(author_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_user    ON sessions(user_id);
  `);
}

/* ------------------------------------------------------------------ */
/* First-run demo seed                                                 */
/* ------------------------------------------------------------------ */

/** Every demo account signs in with this password. */
export const DEMO_PASSWORD = "triangle";

interface SeedUser {
  id: string; handle: string; name: string; bio: string;
  role: "member" | "council" | "zealot"; hue: number; joined: string;
  follows: string[];
}

interface SeedReview {
  author: string;
  axes?: [number, number, number];
  zealot?: number;
  comment: string;
  at: string;
}

interface SeedTriangle {
  id: string; title: string; description: string; location: string;
  author: string; at: string; image: SeedImageSpec; reviews: SeedReview[];
}

const SEED_USERS: SeedUser[] = [
  { id: "u1", handle: "tri_curious", name: "Toby Newangle", role: "member", hue: 205, joined: "2026-05-02",
    bio: "Just here looking at triangles. Aspiring Council member. 3 sides > everything.",
    follows: ["u2", "u3", "u5", "u7"] },
  { id: "u2", handle: "acute_angie", name: "Angie Acute", role: "member", hue: 340, joined: "2026-01-14",
    bio: "If it's under 90°, I'm interested. Roofline enthusiast.",
    follows: ["u3", "u4", "u6", "u8"] },
  { id: "u3", handle: "right_riya", name: "Riya Wright", role: "member", hue: 262, joined: "2026-02-03",
    bio: "90° or nothing. I check corners with a protractor.",
    follows: ["u2", "u5", "u8"] },
  { id: "u4", handle: "obtuse_owen", name: "Owen Obtuse", role: "member", hue: 22, joined: "2026-02-19",
    bio: "Wide angles, wide horizons. Sandwich geometry researcher.",
    follows: ["u2", "u7"] },
  { id: "u5", handle: "scalene_sam", name: "Sam Scalene", role: "member", hue: 145, joined: "2026-03-11",
    bio: "No two sides alike. Finding the weird triangles so you don't have to.",
    follows: ["u1", "u2", "u3", "u6"] },
  { id: "u6", handle: "euclid_prime", name: "Dr. Euclid Prime", role: "council", hue: 278, joined: "2025-11-30",
    bio: "Founding chair of the Triangle Council. Author of “Elements of Vibes”.",
    follows: ["u7", "u8"] },
  { id: "u7", handle: "isosceles_izzy", name: "Izzy Isosceles", role: "council", hue: 45, joined: "2025-12-15",
    bio: "Triangle Council. Two equal sides, zero equal takes.",
    follows: ["u6", "u8", "u2"] },
  { id: "u8", handle: "hypotenuse_hana", name: "Hana Hypotenuse", role: "zealot", hue: 190, joined: "2025-12-02",
    bio: "THE Triangle Zealot. One number. No criteria. Pure conviction.",
    follows: ["u6", "u7", "u3"] },
];

const SEED_TRIANGLES: SeedTriangle[] = [
  {
    id: "t1", title: "The Flatiron Gable", location: "Portland, OR", author: "u2", at: "2026-07-08T14:20:00Z",
    description: "A perfectly isosceles gable end spotted on a downtown warehouse. Crisp lines, great symmetry, zero notes.",
    image: { scene: "roof", from: "#eaeed4", to: "#a2b158", accent: "#4b5320" },
    reviews: [
      { author: "u2", axes: [8, 7, 9], comment: "My own find. The symmetry stopped me mid-walk.", at: "2026-07-08T14:25:00Z" },
      { author: "u3", axes: [8, 6, 9], comment: "Lovely, but the shadow crops the apex. Half a point off.", at: "2026-07-09T09:12:00Z" },
      { author: "u4", axes: [8, 8, 8], comment: "Solid all-rounder. Would shelter under this triangle.", at: "2026-07-09T21:40:00Z" },
      { author: "u6", axes: [9, 7, 9], comment: "Textbook isosceles. The Council approves of this gable.", at: "2026-07-10T18:05:00Z" },
      { author: "u8", zealot: 8, comment: "A roof doing roof things. Acceptable.", at: "2026-07-11T08:00:00Z" },
    ],
  },
  {
    id: "t2", title: "Yield, Legend", location: "Austin, TX", author: "u3", at: "2026-07-06T16:45:00Z",
    description: "Classic downward-pointing road triangle in full sun. Bold red border, unbeatable contrast, maximum authority.",
    image: { scene: "sign", from: "#d6deae", to: "#85963c", accent: "#b91c1c" },
    reviews: [
      { author: "u3", axes: [9, 10, 10], comment: "I know what I found. Uploader score: near perfect.", at: "2026-07-06T16:50:00Z" },
      { author: "u5", axes: [9, 9, 10], comment: "The GOAT of street triangles. Slightly weathered, still sharp.", at: "2026-07-07T12:02:00Z" },
      { author: "u2", axes: [8, 9, 10], comment: "Timeless. You simply cannot argue with a yield sign.", at: "2026-07-07T15:47:00Z" },
      { author: "u6", axes: [9, 10, 10], comment: "An equilateral icon doing real work directing traffic. Council gold standard.", at: "2026-07-07T19:30:00Z" },
      { author: "u7", axes: [9, 9, 10], comment: "Deployed with purpose. This triangle has a job and does it.", at: "2026-07-08T08:22:00Z" },
      { author: "u8", zealot: 10, comment: "I have no notes. The yield sign is why I believe in triangles.", at: "2026-07-08T20:15:00Z" },
    ],
  },
  {
    id: "t3", title: "Mount Dorito at Dusk", location: "Boulder, CO", author: "u5", at: "2026-07-04T02:10:00Z",
    description: "Nature's own triangle. Near-perfect slopes against a purple sky. The snow cap is doing a lot of aesthetic work.",
    image: { scene: "mountain", from: "#c4b5fd", to: "#6d28d9", accent: "#312e81" },
    reviews: [
      { author: "u5", axes: [10, 7, 10], comment: "I hiked four hours for this angle. Worth it.", at: "2026-07-04T02:20:00Z" },
      { author: "u3", axes: [10, 3, 6], comment: "Breathtaking, but is a mountain really *deploying* its triangle? Low tacticality.", at: "2026-07-04T13:33:00Z" },
      { author: "u1", axes: [10, 5, 7], comment: "I gasped. Nature understood the assignment.", at: "2026-07-05T20:51:00Z" },
      { author: "u7", axes: [10, 4, 7], comment: "The Council debated this one for an hour. Gorgeous, geologically smug.", at: "2026-07-06T10:18:00Z" },
      { author: "u8", zealot: 6, comment: "It's a mountain. Nature gets no credit for accidents.", at: "2026-07-06T21:40:00Z" },
    ],
  },
  {
    id: "t4", title: "The Grilled Cheese Diagonal", location: "Chicago, IL", author: "u4", at: "2026-07-02T18:00:00Z",
    description: "A sandwich cut corner-to-corner. Debatable geometry, undeniable appeal. The cheese pull follows the hypotenuse.",
    image: { scene: "sandwich", from: "#f6f7ec", to: "#bcc87f", accent: "#4b5320" },
    reviews: [
      { author: "u4", axes: [9, 10, 8], comment: "Uploader score. It was delicious and geometric.", at: "2026-07-02T18:05:00Z" },
      { author: "u2", axes: [8, 9, 7], comment: "Edible triangles are underrated. Cutting diagonal was the correct tactical call.", at: "2026-07-02T21:15:00Z" },
      { author: "u5", axes: [6, 8, 5], comment: "The crust ruins the hypotenuse. Still ate it though.", at: "2026-07-03T11:08:00Z" },
    ],
  },
  {
    id: "t5", title: "Giza, But It's an Office Park", location: "Memphis, TN", author: "u6", at: "2026-06-29T15:30:00Z",
    description: "A glass pyramid someone built next to a parking lot. Confusing as architecture, magnificent as a triangle.",
    image: { scene: "pyramid", from: "#eaeed4", to: "#85963c", accent: "#373c21" },
    reviews: [
      { author: "u6", axes: [9, 8, 9], comment: "I upload it as a member, not as the Council. Recused from my own case.", at: "2026-06-29T15:35:00Z" },
      { author: "u2", axes: [8, 7, 8], comment: "The reflections double the triangle count. Great value.", at: "2026-06-30T09:27:00Z" },
      { author: "u7", axes: [9, 8, 9], comment: "Four triangles pretending to be one building. Efficient. Council approved.", at: "2026-06-30T20:44:00Z" },
      { author: "u8", zealot: 8, comment: "A building shaped like conviction.", at: "2026-07-01T07:12:00Z" },
    ],
  },
  {
    id: "t6", title: "Regatta Right Angle", location: "San Diego, CA", author: "u3", at: "2026-06-26T22:05:00Z",
    description: "Two sails, both triangles, zero hesitation. Caught the exact moment the jib lined up with the horizon.",
    image: { scene: "sail", from: "#a5f3fc", to: "#0891b2", accent: "#f8fafc" },
    reviews: [
      { author: "u3", axes: [9, 8, 8], comment: "Waited twenty minutes for the jib to line up. Uploader score.", at: "2026-06-26T22:10:00Z" },
      { author: "u1", axes: [8, 8, 8], comment: "I want to be on that boat.", at: "2026-06-28T14:12:00Z" },
      { author: "u6", axes: [9, 9, 8], comment: "Sails are triangles with employment. Wind-powered tacticality.", at: "2026-06-29T08:10:00Z" },
      { author: "u8", zealot: 9, comment: "Wind-powered geometry. I felt something.", at: "2026-06-29T19:55:00Z" },
    ],
  },
  {
    id: "t7", title: "Pepperoni Isosceles", location: "Brooklyn, NY", author: "u7", at: "2026-06-23T19:40:00Z",
    description: "A slice so symmetric it belongs in a museum. Three pepperoni arranged in a smaller interior triangle. Recursion.",
    image: { scene: "pizza", from: "#fee2e2", to: "#fca5a5", accent: "#b91c1c" },
    reviews: [
      { author: "u7", axes: [9, 9, 9], comment: "Uploading as a civilian, scoring as one too. The recursion is real.", at: "2026-06-23T19:45:00Z" },
      { author: "u4", axes: [9, 9, 9], comment: "A triangle containing triangles. Fractal snacking.", at: "2026-06-23T22:31:00Z" },
      { author: "u6", axes: [8, 9, 9], comment: "The interior pepperoni triangle is a bold flex from a fellow Council member.", at: "2026-06-24T10:02:00Z" },
      { author: "u8", zealot: 9, comment: "I ate a slice like this once. Changed me.", at: "2026-06-24T21:30:00Z" },
    ],
  },
  {
    id: "t8", title: "First Tent, Best Tent", location: "Yosemite, CA", author: "u1", at: "2026-06-20T06:15:00Z",
    description: "My first ever triangle post! Pitched this A-frame at dawn. It leans a little but so do I.",
    image: { scene: "tent", from: "#1c200e", to: "#373c21", accent: "#a2b158" },
    reviews: [
      { author: "u1", axes: [9, 9, 8], comment: "Scoring my own tent. I pitched it, I love it, I regret nothing.", at: "2026-06-20T06:30:00Z" },
      { author: "u5", axes: [7, 8, 6], comment: "Respect the hustle, but the lean costs you triangularity points.", at: "2026-06-20T15:44:00Z" },
      { author: "u7", axes: [6, 8, 5], comment: "Council note: an A-frame should frame the A. Promising debut though!", at: "2026-06-21T09:20:00Z" },
    ],
  },
  {
    id: "t9", title: "The Perfect Chip", location: "Santa Fe, NM", author: "u2", at: "2026-06-17T12:50:00Z",
    description: "Found at the bottom of the bag: an unbroken, salt-dusted, equilateral miracle. I couldn't eat it. I posted it.",
    image: { scene: "chip", from: "#f6f7ec", to: "#d6deae", accent: "#67772c" },
    reviews: [
      { author: "u2", axes: [9, 9, 10], comment: "Uploader score. I still haven't eaten it. It's on my shelf.", at: "2026-06-17T12:55:00Z" },
      { author: "u3", axes: [8, 5, 10], comment: "Measured the corners from the photo. All 60°. I have chills.", at: "2026-06-18T11:37:00Z" },
      { author: "u8", zealot: 8, comment: "A perfect chip. No notes.", at: "2026-06-18T22:09:00Z" },
    ],
  },
  {
    id: "t10", title: "Escalator to Nowhere", location: "Minneapolis, MN", author: "u5", at: "2026-06-14T20:25:00Z",
    description: "The side profile of a mall escalator forms a chunky right triangle. The most tactical triangle in retail.",
    image: { scene: "stairs", from: "#e2e8f0", to: "#94a3b8", accent: "#334155" },
    reviews: [
      { author: "u5", axes: [7, 9, 7], comment: "Uploader score. Retail geometry deserves respect.", at: "2026-06-14T20:30:00Z" },
      { author: "u2", axes: [6, 9, 8], comment: "Not pretty, but it MOVES PEOPLE DIAGONALLY. That's tacticality.", at: "2026-06-15T10:12:00Z" },
    ],
  },
];

function seedIfEmpty(conn: Database.Database) {
  const row = conn.prepare("SELECT COUNT(*) AS n FROM users").get() as { n: number };
  if (row.n > 0) return;

  const passwordHash = hashPassword(DEMO_PASSWORD);
  const insertUser = conn.prepare(
    `INSERT INTO users (id, handle, name, bio, role, avatar_hue, password_hash, joined)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const insertFollow = conn.prepare(
    "INSERT INTO follows (follower_id, followee_id) VALUES (?, ?)",
  );
  const insertTriangle = conn.prepare(
    `INSERT INTO triangles (id, title, description, location, image_url, author_id, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  );
  const insertReview = conn.prepare(
    `INSERT INTO reviews (id, triangle_id, author_id, kind, aesthetic, tacticality, triangularity, zealot_score, comment, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );

  conn.transaction(() => {
    for (const u of SEED_USERS) {
      insertUser.run(u.id, u.handle, u.name, u.bio, u.role, u.hue, passwordHash, u.joined);
    }
    for (const u of SEED_USERS) {
      for (const target of u.follows) insertFollow.run(u.id, target);
    }
    let reviewId = 0;
    for (const t of SEED_TRIANGLES) {
      const filename = `seed-${t.id}.svg`;
      writeFileSync(path.join(UPLOADS_DIR, filename), seedSvg(t.image));
      insertTriangle.run(t.id, t.title, t.description, t.location, `/uploads/${filename}`, t.author, t.at);
      for (const r of t.reviews) {
        reviewId += 1;
        if (r.zealot !== undefined) {
          insertReview.run(`seed-r${reviewId}`, t.id, r.author, "zealot", null, null, null, r.zealot, r.comment, r.at);
        } else {
          const [a, tac, tri] = r.axes!;
          insertReview.run(`seed-r${reviewId}`, t.id, r.author, "axes", a, tac, tri, null, r.comment, r.at);
        }
      }
    }
  })();
}
