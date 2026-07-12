import { randomBytes, randomUUID } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { rowToTriangler, type UserRow } from "@/lib/data";
import type { Triangler } from "@/lib/types";

/**
 * Session-cookie auth. Sessions live in SQLite; the browser holds an opaque
 * httpOnly token. New accounts are always `member` — Council and Zealot are
 * assigned on the backend (`npm run set-role`).
 */

const COOKIE = "tr_session";
const SESSION_DAYS = 30;

export const HANDLE_RE = /^[a-z0-9_]{3,20}$/;

/** The signed-in Triangler, or null when browsing logged out. */
export async function getCurrentUser(): Promise<Triangler | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const row = db()
    .prepare(
      `SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token = ? AND s.expires_at > ?`,
    )
    .get(token, new Date().toISOString()) as UserRow | undefined;
  return row ? rowToTriangler(row) : null;
}

/**
 * The app is login-first: every page except /login and /signup calls this
 * and bounces logged-out visitors to the login page.
 */
export async function requireUser(): Promise<Triangler> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

async function startSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  db()
    .prepare("INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)")
    .run(token, userId, expires.toISOString());
  // Opportunistic cleanup of expired sessions.
  db().prepare("DELETE FROM sessions WHERE expires_at <= ?").run(new Date().toISOString());

  // Mark the cookie secure when the request arrived over HTTPS (hosted
  // deploys); plain-http localhost keeps working without it.
  const proto = (await headers()).get("x-forwarded-proto");
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires,
    secure: proto === "https",
  });
}

/** Create an account and sign it in. Returns an error message on failure. */
export async function registerUser(input: {
  handle: string;
  name: string;
  password: string;
}): Promise<string | null> {
  const handle = input.handle.trim().toLowerCase();
  const name = input.name.trim().slice(0, 50);
  if (!HANDLE_RE.test(handle)) {
    return "Handles are 3–20 characters: lowercase letters, numbers, underscores.";
  }
  if (!name) return "Please enter a display name.";
  if (input.password.length < 6) return "Passwords need at least 6 characters.";

  const existing = db().prepare("SELECT id FROM users WHERE handle = ?").get(handle);
  if (existing) return "That handle is taken.";

  const id = `u-${randomUUID()}`;
  db()
    .prepare(
      `INSERT INTO users (id, handle, name, bio, role, avatar_hue, password_hash, joined)
       VALUES (?, ?, ?, '', 'member', ?, ?, ?)`,
    )
    .run(
      id,
      handle,
      name,
      // Deterministic avatar hue from the handle.
      [...handle].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7),
      hashPassword(input.password),
      new Date().toISOString().slice(0, 10),
    );
  await startSession(id);
  return null;
}

/** Verify credentials and sign in. Returns an error message on failure. */
export async function authenticate(
  handle: string,
  password: string,
): Promise<string | null> {
  const row = db()
    .prepare("SELECT * FROM users WHERE handle = ?")
    .get(handle.trim().toLowerCase()) as UserRow | undefined;
  if (!row || !verifyPassword(password, row.password_hash)) {
    return "Wrong handle or password.";
  }
  await startSession(row.id);
  return null;
}

/** End the current session (if any) and clear the cookie. */
export async function endSession() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (token) db().prepare("DELETE FROM sessions WHERE token = ?").run(token);
  store.delete(COOKIE);
}
