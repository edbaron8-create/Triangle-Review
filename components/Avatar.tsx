import type { Triangler } from "@/lib/types";

const SIZES = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-16 w-16 text-xl",
  xl: "h-20 w-20 text-2xl",
} as const;

const BADGE_SIZES = {
  xs: "h-3 w-3 text-[6px]",
  sm: "h-3.5 w-3.5 text-[7px]",
  md: "h-4 w-4 text-[8px]",
  lg: "h-6 w-6 text-[11px]",
  xl: "h-7 w-7 text-xs",
} as const;

/**
 * Deterministic gradient avatar (initial on a hue derived from the user),
 * with a role badge for Council members (▲) and the Zealot (✦). Real
 * profile photos land with uploads.
 */
export default function Avatar({
  user,
  size = "md",
  ring = false,
}: {
  user: Triangler;
  size?: keyof typeof SIZES;
  /** Army-green brand ring. */
  ring?: boolean;
}) {
  const from = `hsl(${user.avatarHue} 45% 55%)`;
  const to = `hsl(${(user.avatarHue + 50) % 360} 40% 38%)`;

  return (
    <span
      className={`relative inline-block ${
        ring ? "rounded-full bg-gradient-to-tr from-army-400 to-army-800 p-[2.5px]" : ""
      }`}
    >
      <span
        className={`flex items-center justify-center rounded-full font-bold uppercase text-white ${SIZES[size]} ${
          ring ? "ring-2 ring-white" : ""
        }`}
        style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
        aria-hidden
      >
        {user.username[0]}
      </span>
      {user.role !== "member" && (
        <span
          title={user.role === "council" ? "Triangle Council member" : "The Triangle Zealot"}
          className={`absolute -bottom-0.5 -right-0.5 flex items-center justify-center rounded-full text-white ring-2 ring-white ${
            user.role === "council" ? "bg-army-600" : "bg-army-950"
          } ${BADGE_SIZES[size]}`}
        >
          {user.role === "council" ? "▲" : "✦"}
        </span>
      )}
    </span>
  );
}
