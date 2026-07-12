import type { Score } from "@/lib/types";

/** Compact star + count badge for a triangle's aggregate score. */
export default function ScoreBadge({ score }: { score: Score }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-triangle/10 px-2.5 py-1 text-sm font-medium text-triangle-dark">
      <span aria-hidden>★</span>
      <span>{score.count === 0 ? "—" : score.average.toFixed(1)}</span>
      <span className="text-triangle-dark/60">
        ({score.count})
      </span>
    </span>
  );
}
