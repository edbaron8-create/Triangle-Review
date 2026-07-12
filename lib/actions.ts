"use server";

import { revalidatePath } from "next/cache";
import { CURRENT_USER_ID, setFollowing, upsertReview } from "@/lib/data";

/**
 * Server actions for the write paths. They mutate the in-memory mock data,
 * so changes live for the duration of the server process — good enough
 * for a first draft, swapped for real persistence later.
 */

/** Submit (or update) the signed-in user's score for a triangle. */
export async function submitReview(triangleId: string, formData: FormData) {
  const num = (key: string) => Number(formData.get(key));

  upsertReview(triangleId, CURRENT_USER_ID, {
    ratings: {
      aesthetic: num("aesthetic"),
      tacticality: num("tacticality"),
      triangularity: num("triangularity"),
    },
    zealotScore: num("zealot"),
    comment: String(formData.get("comment") ?? ""),
  });

  // Scores surface everywhere (feed, explore, profiles), so refresh it all.
  revalidatePath("/", "layout");
}

/** Toggle whether the signed-in user follows another Triangler. */
export async function toggleFollow(targetId: string) {
  setFollowing(CURRENT_USER_ID, targetId);
  revalidatePath("/", "layout");
}
