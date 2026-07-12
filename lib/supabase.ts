import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client using the SECRET key — it bypasses row-level
 * security, so it must never reach the browser (no NEXT_PUBLIC_ prefix).
 * All database access goes through lib/data.ts; photos live in the public
 * "uploads" storage bucket.
 *
 * Cached on globalThis because Next.js bundles modules separately per route
 * in production.
 */

export const UPLOADS_BUCKET = "uploads";

declare global {
  // eslint-disable-next-line no-var
  var __supabaseClient: SupabaseClient | undefined;
}

export function supabase(): SupabaseClient {
  if (globalThis.__supabaseClient) return globalThis.__supabaseClient;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL / SUPABASE_SECRET_KEY environment variables — see README → Deploying.",
    );
  }
  globalThis.__supabaseClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return globalThis.__supabaseClient;
}

/** Throw a readable error when a PostgREST call fails. */
export function check(error: { message: string } | null): void {
  if (error) throw new Error(`Supabase: ${error.message}`);
}
