import type { TrianglerRole } from "@/lib/types";

/**
 * Marks Council members and the Zealot next to their usernames.
 * Compact = just the glyph. Members get nothing.
 */
export default function RoleBadge({
  role,
  compact = false,
}: {
  role: TrianglerRole;
  compact?: boolean;
}) {
  if (role === "member") return null;

  const isCouncil = role === "council";
  const label = isCouncil ? "Council" : "Zealot";
  const glyph = isCouncil ? "▲" : "✦";

  if (compact) {
    return (
      <span
        title={isCouncil ? "Triangle Council member" : "The Triangle Zealot"}
        aria-label={isCouncil ? "Triangle Council member" : "The Triangle Zealot"}
        className={`text-xs ${isCouncil ? "text-army-600" : "text-army-950"}`}
      >
        {glyph}
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
        isCouncil ? "bg-army-100 text-army-800" : "bg-army-950 text-white"
      }`}
    >
      <span aria-hidden>{glyph}</span> {label}
    </span>
  );
}
