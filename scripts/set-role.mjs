/**
 * Backend role management: assign Council members and the (single) Zealot.
 *
 *   npm run set-role -- <handle> <member|council|zealot>
 *
 * Promoting someone to zealot demotes the current Zealot to member — there
 * is only ever one Zealot.
 */
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseEnv } from "./env.mjs";

const [handle, role] = process.argv.slice(2);
const ROLES = ["member", "council", "zealot"];

if (!handle || !ROLES.includes(role)) {
  console.error("Usage: npm run set-role -- <handle> <member|council|zealot>");
  process.exit(1);
}

const { url, key } = requireSupabaseEnv();
const supabase = createClient(url, key, { auth: { persistSession: false } });

const { data: user, error } = await supabase
  .from("users")
  .select("id, handle, role")
  .eq("handle", handle.toLowerCase())
  .maybeSingle();
if (error) {
  console.error("Supabase:", error.message);
  process.exit(1);
}
if (!user) {
  console.error(`No Triangler with handle "${handle}".`);
  process.exit(1);
}

if (role === "zealot") {
  const { data: demoted, error: dErr } = await supabase
    .from("users")
    .update({ role: "member" })
    .eq("role", "zealot")
    .neq("id", user.id)
    .select("handle");
  if (dErr) {
    console.error("Supabase:", dErr.message);
    process.exit(1);
  }
  for (const d of demoted ?? []) {
    console.log(`Previous Zealot @${d.handle} demoted to member.`);
  }
}

const { error: uErr } = await supabase.from("users").update({ role }).eq("id", user.id);
if (uErr) {
  console.error("Supabase:", uErr.message);
  process.exit(1);
}
console.log(`@${user.handle}: ${user.role} → ${role}`);
