"use client";

import { useState, useTransition } from "react";
import { submitReview } from "@/lib/actions";
import { AXIS_MAX, RATING_AXES, TOTAL_MAX, type Ratings } from "@/lib/types";

const SLIDER_ACCENTS: Record<keyof Ratings, string> = {
  aesthetic: "accent-rose-500",
  tacticality: "accent-sky-500",
  triangularity: "accent-amber-500",
};

/**
 * Three-axis rating form. Acts as the mock signed-in user; if they already
 * reviewed this triangle it edits their existing review.
 */
export default function ReviewForm({
  triangleId,
  existing,
  isUploader,
}: {
  triangleId: string;
  existing?: { ratings: Ratings; comment: string };
  /** True when the signed-in user is rating their own post. */
  isUploader: boolean;
}) {
  const [ratings, setRatings] = useState<Ratings>(
    existing?.ratings ?? { aesthetic: 7, tacticality: 7, triangularity: 7 },
  );
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  const total = ratings.aesthetic + ratings.tacticality + ratings.triangularity;

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await submitReview(triangleId, formData);
      setSaved(true);
    });
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-bold text-gray-900">
          {existing ? "Edit your review" : "Rate this triangle"}
        </h3>
        <span className="text-sm font-bold text-amber-700">
          {total}<span className="font-medium text-amber-700/60">/{TOTAL_MAX}</span>
        </span>
      </div>

      {isUploader && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          This is your own triangle — self-ratings count at half weight.
          Confidence is admired, bias is discounted.
        </p>
      )}

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
            className={`mt-1 w-full ${SLIDER_ACCENTS[axis.key]}`}
          />
        </label>
      ))}

      <label className="block">
        <span className="text-sm font-medium text-gray-700">Comment (optional)</span>
        <textarea
          name="comment"
          rows={2}
          maxLength={500}
          defaultValue={existing?.comment ?? ""}
          placeholder="Say something about this triangle…"
          className="mt-1 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
        />
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-60"
        >
          {pending ? "Submitting…" : existing ? "Update review" : "Submit review"}
        </button>
        {saved && !pending && (
          <span className="text-sm font-medium text-green-600">Review saved ▲</span>
        )}
      </div>
    </form>
  );
}
