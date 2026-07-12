"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { postTriangle } from "@/lib/actions";
import { AXIS_MAX, COMPONENT_MAX, RATING_AXES, type Ratings } from "@/lib/types";

/**
 * New-post form: photo (with preview), details, and the uploader's own
 * score out of 30 — the Uploader component of the final /100.
 */
export default function UploadForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Ratings>({
    aesthetic: 7,
    tacticality: 7,
    triangularity: 7,
  });
  const [pending, startTransition] = useTransition();

  const total = ratings.aesthetic + ratings.tacticality + ratings.triangularity;
  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-army-500 focus:outline-none focus:ring-1 focus:ring-army-500";

  return (
    <form
      action={(formData) => startTransition(() => postTriangle(formData))}
      className="space-y-5"
    >
      <label className="block cursor-pointer">
        <span className="sr-only">Photo of your triangle</span>
        <input
          type="file"
          name="photo"
          accept="image/jpeg,image/png,image/webp,image/gif"
          required
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
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
            <span className="text-xs text-army-800/70">JPEG, PNG, WebP, or GIF · up to 8 MB</span>
          </span>
        )}
      </label>

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
        <textarea
          name="comment"
          rows={2}
          maxLength={500}
          placeholder="Why this score? (optional)"
          className={`${inputClass} resize-none`}
        />
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
