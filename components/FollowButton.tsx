"use client";

import { useTransition } from "react";
import { toggleFollow } from "@/lib/actions";

/** Follow/unfollow another Triangler (acts as the mock signed-in user). */
export default function FollowButton({
  targetId,
  following,
  size = "md",
  block = false,
}: {
  targetId: string;
  following: boolean;
  size?: "sm" | "md";
  /** Full-width (profile page) variant. */
  block?: boolean;
}) {
  const [pending, startTransition] = useTransition();

  const base =
    size === "sm"
      ? "rounded-lg px-3 py-1 text-xs font-semibold"
      : "rounded-lg px-5 py-1.5 text-sm font-semibold";

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => toggleFollow(targetId))}
      className={`${base} ${block ? "w-full" : ""} transition disabled:opacity-60 ${
        following
          ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
          : "bg-army-700 text-white hover:bg-army-800"
      }`}
    >
      {following ? "Following" : "Follow"}
    </button>
  );
}
