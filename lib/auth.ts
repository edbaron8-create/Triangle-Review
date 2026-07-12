import { randomBytes, randomUUID } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { rowToTriangler, type UserRow } from "@/lib/data";
import { hashPassword, verifyPassword } from "@/lib/password";
import { check, supabase } from "@/lib/supabase";
import type { Triangler } from "@/lib/types";

/**
 * Session-cookie auth. Sessions live in Postgres; the browser holds an
 * opaque httpOnly token. New accounts are always `member` — Council and
 * Zealot are assigned on the backend (`npm run set-role`).
 */

const COOKIE = "tr_session";
const SESSION_DAYS = 30;

/** The signed-in Triangler, or null when browsing logged out. */
export async function getCurrentUser(): Promise<Triangler | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const { data, error } = await supabase()
    .from("sessions")
    .select("expires_at, user:users!user_id(*)")
    .eq("token", token)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  check(error);
  const user = (data as { user: UserRow | null } | null)?.user;
  return user ? rowToTriangler(user) : null;
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
  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  const ins = await supabase()
    .from("sessions")
    .insert({ token, user_id: userId, expires_at: expires.toISOString() });
  check(ins.error);
  // Opportunistic cleanup of expired sessions.
  await supabase().from("sessions").delete().lt("expires_at", now.toISOString());

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
  username: string;
  password: string;
}): Promise<string | null> {
  const username = input.username.trim().toLowerCase();
  // No length or character rules — just can't be blank (it needs a profile URL).
  if (!username) return "Please enter a username.";

  const id = `u-${randomUUID()}`;
  const ins = await supabase().from("users").insert({
    id,
    username,
    bio: "",
    role: "member",
    // Deterministic avatar hue from the username.
    avatar_hue: [...username].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7),
    password_hash: hashPassword(input.password),
    joined: new Date().toISOString().slice(0, 10),
  });
  if (ins.error) {
    if (ins.error.code === "23505") return "That username is taken.";
    // Surface the real cause (e.g. an un-migrated database) as a readable
    // message instead of crashing the page into the error boundary.
    console.error("registerUser insert failed:", ins.error);
    return `Could not create your account: ${ins.error.message}`;
  }
  await startSession(id);
  return null;
}

/** Verify credentials and sign in. Returns an error message on failure. */
export async function authenticate(
  username: string,
  password: string,
): Promise<string | null> {
  const { data, error } = await supabase()
    .from("users")
    .select("*")
    .eq("username", username.trim().toLowerCase())
    .maybeSingle();
  check(error);
  const row = data as UserRow | null;
  if (!row || !verifyPassword(password, row.password_hash)) {
    return "Wrong username or password.";
  }
  await startSession(row.id);
  return null;
}

/** End the current session (if any) and clear the cookie. */
export async function endSession() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (token) {
    await supabase().from("sessions").delete().eq("token", token);
  }
  store.delete(COOKIE);
}
