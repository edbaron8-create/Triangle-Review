"use client";

import { useState, useTransition } from "react";
import { submitReview } from "@/lib/actions";
import {
  AXIS_MAX,
  COMPONENT_MAX,
  RATING_AXES,
  ZEALOT_MAX,
  type Ratings,
  type Review,
} from "@/lib/types";

/**
 * Score form for the mock signed-in user. Members, Council, and the uploader
 * score the three axes (30 points); the Zealot files a single 0–10 verdict.
 * Submitting again edits your existing score.
 */
export default function ReviewForm({
  triangleId,
  existing,
  isUploader,
  isZealot,
}: {
  triangleId: string;
  existing?: Review;
  /** The signed-in user posted this triangle (their score is the Uploader component). */
  isUploader: boolean;
  /** The signed-in user is the Triangle Zealot. */
  isZealot: boolean;
}) {
  const zealotMode = isZealot && !isUploader;

  const [ratings, setRatings] = useState<Ratings>(
    existing?.kind === "axes"
      ? existing.ratings
      : { aesthetic: 7, tacticality: 7, triangularity: 7 },
  );
  const [zealotScore, setZealotScore] = useState(
    existing?.kind === "zealot" ? existing.score : 7,
  );
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  const total = zealotMode
    ? zealotScore
    : ratings.aesthetic + ratings.tacticality + ratings.triangularity;

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await submitReview(triangleId, formData);
      setSaved(true);
    });
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-bold text-gray-900">
          {existing
            ? "Edit your score"
            : zealotMode
              ? "Hand down your verdict"
              : "Score this triangle"}
        </h3>
        <span className="text-sm font-bold text-army-700">
          {total}
          <span className="font-medium text-army-700/60">
            /{zealotMode ? ZEALOT_MAX : COMPONENT_MAX}
          </span>
        </span>
      </div>

      {isUploader && (
        <p className="rounded-lg bg-army-50 px-3 py-2 text-xs text-army-800">
          This is your triangle — your score is the Uploader component of the
          final /100.
        </p>
      )}
      {zealotMode && (
        <p className="rounded-lg bg-army-950 px-3 py-2 text-xs text-white">
          ✦ You are the Zealot. One number, no criteria, pure conviction.
        </p>
      )}

      {zealotMode ? (
        <label className="block">
          <span className="flex items-baseline justify-between text-sm">
            <span className="font-medium text-gray-700">Verdict</span>
            <span className="font-semibold tabular-nums text-gray-900">
              {zealotScore}/{ZEALOT_MAX}
            </span>
          </span>
          <input
            type="range"
            name="zealot"
            min={0}
            max={ZEALOT_MAX}
            step={1}
            value={zealotScore}
            onChange={(e) => setZealotScore(Number(e.target.value))}
            className="mt-1 w-full accent-army-700"
          />
        </label>
      ) : (
        RATING_AXES.map((axis) => (
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
        ))
      )}

      <label className="block">
        <span className="text-sm font-medium text-gray-700">Comment (optional)</span>
        <textarea
          name="comment"
          rows={2}
          maxLength={500}
          defaultValue={existing?.comment ?? ""}
          placeholder="Say something about this triangle…"
          className="mt-1 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-army-500 focus:outline-none focus:ring-1 focus:ring-army-500"
        />
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-army-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-army-800 disabled:opacity-60 sm:w-auto"
        >
          {pending ? "Submitting…" : existing ? "Update score" : "Submit score"}
        </button>
        {saved && !pending && (
          <span className="shrink-0 text-sm font-medium text-army-600">Saved ▲</span>
        )}
      </div>
    </form>
  );
}
