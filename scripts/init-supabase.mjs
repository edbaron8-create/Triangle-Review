/**
 * One-time Supabase setup check:
 *  - creates the public "uploads" storage bucket if missing
 *  - verifies the schema exists (points you at supabase/schema.sql if not)
 *
 *   npm run init-supabase
 */
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseEnv } from "./env.mjs";

const { url, key } = requireSupabaseEnv();
const supabase = createClient(url, key, { auth: { persistSession: false } });

// 1. Storage bucket for photos
const { data: buckets, error: bErr } = await supabase.storage.listBuckets();
if (bErr) {
  console.error("Storage check failed:", bErr.message);
  console.error("Is SUPABASE_SECRET_KEY the sb_secret_... key (not publishable)?");
  process.exit(1);
}
if (buckets.some((b) => b.name === "uploads")) {
  console.log("✔ storage bucket 'uploads' exists");
} else {
  const { error } = await supabase.storage.createBucket("uploads", {
    public: true,
    fileSizeLimit: "8MB",
  });
  if (error) {
    console.error("Could not create the 'uploads' bucket:", error.message);
    process.exit(1);
  }
  console.log("✔ created public storage bucket 'uploads'");
}

// 2. Schema
const { error: sErr } = await supabase
  .from("users")
  .select("id", { count: "exact", head: true });
if (sErr) {
  console.error("✘ schema missing:", sErr.message);
  console.error(
    "Run supabase/schema.sql in the Supabase SQL Editor (Dashboard → SQL Editor → paste → Run), then re-run this script.",
  );
  process.exit(1);
}
console.log("✔ schema present — Triangle Reviewer is ready");
