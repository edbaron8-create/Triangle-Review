/**
 * Backend role management: assign Council members and the (single) Zealot.
 *
 *   npm run set-role -- <handle> <member|council|zealot>
 *
 * Promoting someone to zealot demotes the current Zealot to member — there
 * is only ever one Zealot.
 */
import Database from "better-sqlite3";
import path from "node:path";

const [handle, role] = process.argv.slice(2);
const ROLES = ["member", "council", "zealot"];

if (!handle || !ROLES.includes(role)) {
  console.error("Usage: npm run set-role -- <handle> <member|council|zealot>");
  process.exit(1);
}

const dataDir = process.env.DATA_DIR ?? path.join(process.cwd(), "data");
const db = new Database(path.join(dataDir, "triangle.db"));

const user = db.prepare("SELECT id, handle, role FROM users WHERE handle = ?").get(handle);
if (!user) {
  console.error(`No Triangler with handle "${handle}".`);
  process.exit(1);
}

db.transaction(() => {
  if (role === "zealot") {
    const demoted = db
      .prepare("UPDATE users SET role = 'member' WHERE role = 'zealot' AND id != ?")
      .run(user.id);
    if (demoted.changes > 0) console.log("Previous Zealot demoted to member.");
  }
  db.prepare("UPDATE users SET role = ? WHERE id = ?").run(role, user.id);
})();

console.log(`@${user.handle}: ${user.role} → ${role}`);
