"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authenticate, endSession, getCurrentUser, registerUser } from "@/lib/auth";
import { createTriangle, setFollowing, upsertReview } from "@/lib/data";
import { supabase, UPLOADS_BUCKET } from "@/lib/supabase";
import type { Triangle } from "@/lib/types";

/* ------------------------------------------------------------------ */
/* Auth                                                                */
/* ------------------------------------------------------------------ */

export async function signUp(formData: FormData) {
  const error = await registerUser({
    username: String(formData.get("username") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
  if (error) redirect(`/signup?error=${encodeURIComponent(error)}`);
  revalidatePath("/", "layout");
  redirect("/");
}

export async function logIn(formData: FormData) {
  const error = await authenticate(
    String(formData.get("username") ?? ""),
    String(formData.get("password") ?? ""),
  );
  if (error) redirect(`/login?error=${encodeURIComponent(error)}`);
  revalidatePath("/", "layout");
  redirect("/");
}

export async function logOut() {
  await endSession();
  revalidatePath("/", "layout");
  redirect("/");
}

/* ------------------------------------------------------------------ */
/* Posting                                                             */
/* ------------------------------------------------------------------ */

const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};
const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8 MB

/** Create a triangle post: save the photo, insert the post + uploader score. */
export async function postTriangle(formData: FormData) {
  const me = await getCurrentUser();
  if (!me) redirect("/login");

  const fail = (message: string) =>
    redirect(`/upload?error=${encodeURIComponent(message)}`);

  const photo = formData.get("photo");
  const title = String(formData.get("title") ?? "").trim();
  if (!title) fail("Give your triangle a title.");
  if (!(photo instanceof File) || photo.size === 0) fail("Choose a photo to upload.");

  const file = photo as File;
  const ext = IMAGE_TYPES[file.type];
  if (!ext) fail("Photos must be JPEG, PNG, WebP, or GIF.");
  if (file.size > MAX_IMAGE_BYTES) fail("Photos are limited to 8 MB.");

  // Storing the photo and writing the post can fail at the backend (storage
  // bucket, database constraints, etc.). Catch those here so the uploader gets
  // a readable message instead of an unhandled error crashing the whole page
  // ("a client-side exception has occurred"). The real cause is logged for the
  // server logs.
  let triangle: Triangle;
  try {
    const filename = `${randomUUID()}${ext}`;
    const upload = await supabase()
      .storage.from(UPLOADS_BUCKET)
      .upload(filename, Buffer.from(await file.arrayBuffer()), {
        contentType: file.type,
      });
    if (upload.error) throw new Error(`storage upload failed: ${upload.error.message}`);
    const { data: pub } = supabase().storage.from(UPLOADS_BUCKET).getPublicUrl(filename);

    const num = (key: string) => Number(formData.get(key));
    triangle = await createTriangle({
      title,
      description: String(formData.get("description") ?? ""),
      location: String(formData.get("location") ?? ""),
      imageUrl: pub.publicUrl,
      authorId: me.id,
      ratings: {
        aesthetic: num("aesthetic"),
        tacticality: num("tacticality"),
        triangularity: num("triangularity"),
      },
      comment: String(formData.get("comment") ?? ""),
    });
  } catch (err) {
    console.error("postTriangle failed:", err);
    const detail = err instanceof Error ? err.message : "unknown error";
    fail(`Could not post your triangle: ${detail}`);
    return; // unreachable (fail() redirects) — satisfies the type checker
  }

  revalidatePath("/", "layout");
  redirect(`/triangles/${triangle.id}`);
}

/* ------------------------------------------------------------------ */
/* Scoring + following                                                 */
/* ------------------------------------------------------------------ */

/** Submit (or update) the signed-in user's score for a triangle. */
export async function submitReview(triangleId: string, formData: FormData) {
  const me = await getCurrentUser();
  if (!me) redirect("/login");

  const num = (key: string) => Number(formData.get(key));
  await upsertReview(triangleId, me.id, {
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
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  await setFollowing(me.id, targetId);
  revalidatePath("/", "layout");
}
