import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Minimal .env.local loader for backend scripts (Next.js loads it for the
 * app itself). Real env vars win over file values.
 */
export function loadEnv() {
  try {
    const file = readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
    for (const line of file.split("\n")) {
      const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].trim();
    }
  } catch {
    /* no .env.local — rely on real env vars */
  }
}

export function requireSupabaseEnv() {
  loadEnv();
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    console.error(
      "Missing SUPABASE_URL / SUPABASE_SECRET_KEY (set them in .env.local or the environment).",
    );
    process.exit(1);
  }
  return { url, key };
}
