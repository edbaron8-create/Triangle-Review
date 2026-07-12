import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import path from "node:path";

/**
 * SQLite connection + schema.
 *
 * Data lives in DATA_DIR (default `<repo>/data`, gitignored):
 *   data/triangle.db   — the database
 *   data/uploads/      — uploaded photos
 *
 * The connection is cached on `globalThis` because Next.js bundles modules
 * separately per route in production — a plain module-level instance would
 * open one connection per route bundle.
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
