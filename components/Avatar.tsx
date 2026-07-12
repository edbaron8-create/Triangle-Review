import type { Triangler } from "@/lib/types";

const SIZES = {
  sm: "h-8 w-8 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-16 w-16 text-xl",
  xl: "h-24 w-24 text-3xl",
} as const;

const BADGE_SIZES = {
  sm: "h-3.5 w-3.5 text-[7px]",
  md: "h-4 w-4 text-[8px]",
  lg: "h-6 w-6 text-[11px]",
  xl: "h-8 w-8 text-sm",
} as const;

/**
 * Deterministic gradient avatar (initial on a hue derived from the user),
 * with a Council ▲ badge when applicable. Real profile photos land with
 * uploads.
 */
export default function Avatar({
  user,
  size = "md",
  ring = false,
}: {
  user: Triangler;
  size?: keyof typeof SIZES;
  /** Instagram-story-style gradient ring. */
  ring?: boolean;
}) {
  const from = `hsl(${user.avatarHue} 85% 62%)`;
  const to = `hsl(${(user.avatarHue + 50) % 360} 80% 45%)`;

  return (
    <span className={`relative inline-block ${ring ? "rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-violet-600 p-[2.5px]" : ""}`}>
      <span
        className={`flex items-center justify-center rounded-full font-bold uppercase text-white ${SIZES[size]} ${ring ? "ring-2 ring-white" : ""}`}
        style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
        aria-hidden
      >
        {user.handle[0]}
      </span>
      {user.isCouncil && (
        <span
          title="Triangle Council member"
          className={`absolute -bottom-0.5 -right-0.5 flex items-center justify-center rounded-full bg-violet-600 text-white ring-2 ring-white ${BADGE_SIZES[size]}`}
        >
          ▲
        </span>
      )}
    </span>
  );
}
