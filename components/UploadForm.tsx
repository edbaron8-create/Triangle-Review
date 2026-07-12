"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { postTriangle } from "@/lib/actions";
import { AXIS_MAX, COMPONENT_MAX, RATING_AXES, type Ratings } from "@/lib/types";

/**
 * Largest original we'll try to process. Anything bigger is almost certainly
 * not a phone photo; we reject it up front rather than risk running the
 * browser out of memory decoding it.
 */
const MAX_ORIGINAL_BYTES = 40 * 1024 * 1024; // 40 MB
/**
 * Ceiling for the *processed* upload. Serverless platforms (Vercel) reject
 * request bodies over ~4.5 MB before our code runs, so we keep well under it.
 */
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // 4 MB
/** Downscale so the longest edge is at most this many pixels. */
const MAX_EDGE = 1600;

/**
 * Load a File into an <img>. Safari can decode HEIC/HEIF here, which lets us
 * re-encode iPhone photos to JPEG below.
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read that image."));
    };
    img.src = url;
  });
}

/**
 * Downscale + re-encode a photo to a small JPEG entirely in the browser, so
 * the upload that reaches the server is tiny (and always a supported type).
 * Falls back to the original file if the canvas pipeline isn't available.
 */
async function shrinkPhoto(file: File): Promise<File> {
  const img = await loadImage(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(img, 0, 0, w, h);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.85),
  );
  if (!blob) return file;
  return new File([blob], "triangle.jpg", { type: "image/jpeg" });
}

/**
 * New-post form: photo (with preview), details, and the uploader's own
 * score out of 30 — the Uploader component of the final /100. The photo is
 * downscaled on-device before upload so it fits well within serverless
 * request-body limits.
 */
export default function UploadForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileRef = useRef<File | null>(null);
  const [ratings, setRatings] = useState<Ratings>({
    aesthetic: 7,
    tacticality: 7,
    triangularity: 7,
  });
  const [pending, startTransition] = useTransition();

  const total = ratings.aesthetic + ratings.tacticality + ratings.triangularity;
  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-army-500 focus:outline-none focus:ring-1 focus:ring-army-500";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const file = fileRef.current;
    if (!file) {
      setFileError("Choose a photo to upload.");
      return;
    }

    const formData = new FormData(form);
    let photo: File = file;
    try {
      photo = await shrinkPhoto(file);
    } catch {
      // Couldn't process it — fall back to the original and let the server
      // validate. (Very large originals are caught below.)
      photo = file;
    }

    if (photo.size > MAX_UPLOAD_BYTES) {
      setFileError(
        "This photo is too large to upload even after resizing — please choose a smaller one.",
      );
      return;
    }

    setFileError(null);
    formData.set("photo", photo, photo.name);
    startTransition(() => postTriangle(formData));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="block cursor-pointer">
        <span className="sr-only">Photo of your triangle</span>
        <input
          type="file"
          name="photo"
          accept="image/*"
          required
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            if (file && file.size > MAX_ORIGINAL_BYTES) {
              e.target.value = "";
              fileRef.current = null;
              setFileError("That photo is too large — please pick a smaller one.");
              setPreview((old) => {
                if (old) URL.revokeObjectURL(old);
                return null;
              });
              return;
            }
            fileRef.current = file;
            setFileError(null);
            setPreview((old) => {
              if (old) URL.revokeObjectURL(old);
              return file ? URL.createObjectURL(file) : null;
            });
          }}
        />
        {preview ? (
          <span className="relative block aspect-square w-full overflow-hidden rounded-2xl border border-gray-200">
            <Image src={preview} alt="Photo preview" fill unoptimized className="object-cover" />
            <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
              Change photo
            </span>
          </span>
        ) : (
          <span className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-army-300 bg-army-50 text-army-800 transition hover:bg-army-100">
            <span className="text-5xl" aria-hidden>▲</span>
            <span className="text-sm font-semibold">Tap to add a photo</span>
            <span className="text-xs text-army-800/70">Any photo — we resize it for you</span>
          </span>
        )}
      </label>
      {fileError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{fileError}</p>
      )}

      <input name="title" required maxLength={80} placeholder="Title (e.g. Rooftop Ridgeline)" className={inputClass} />
      <textarea
        name="description"
        rows={2}
        maxLength={500}
        placeholder="What makes this triangle special?"
        className={`${inputClass} resize-none`}
      />
      <input name="location" maxLength={80} placeholder="Location (e.g. Portland, OR)" className={inputClass} />

      <fieldset className="space-y-4 rounded-2xl border border-gray-200 p-4">
        <legend className="px-1 text-sm font-bold">
          Your Uploader score{" "}
          <span className="font-bold text-army-700">
            {total}
            <span className="font-medium text-army-700/60">/{COMPONENT_MAX}</span>
          </span>
        </legend>
        {RATING_AXES.map((axis) => (
          <label key={axis.key} className="block">
            <span className="flex items-baseline justify-between text-sm">
              <span className="font-medium text-gray-700">{axis.label}</span>
              <span className="font-semibold tabular-nums text-gray-900">
                {ratings[axis.key]}/{AXIS_MAX}
              </span>
            </span>
            <input
              type="range"
              name={axis.key}
              min={0}
              max={AXIS_MAX}
              step={1}
              value={ratings[axis.key]}
              onChange={(e) =>
                setRatings((prev) => ({ ...prev, [axis.key]: Number(e.target.value) }))
              }
              className="mt-1 w-full accent-army-600"
            />
          </label>
        ))}
      </fieldset>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-army-700 py-3 text-sm font-semibold text-white transition hover:bg-army-800 disabled:opacity-60"
      >
        {pending ? "Posting…" : "Post triangle"}
      </button>
    </form>
  );
}
