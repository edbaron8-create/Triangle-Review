import { formatScore } from "@/lib/format";
import { TOTAL_MAX, type Score } from "@/lib/types";

/** Compact ▲-score pill: a triangle's weighted total out of 30. */
export default function ScoreBadge({
  score,
  size = "md",
}: {
  score: Score;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3.5 py-1.5 text-lg",
  } as const;

  return (
    <span
      className={`inline-flex items-baseline gap-1 rounded-full bg-amber-100 font-bold text-amber-900 ${sizes[size]}`}
      title={
        score.count === 0
          ? "Not yet rated"
          : `Weighted score from ${score.count} review${score.count === 1 ? "" : "s"}`
      }
    >
      <span aria-hidden className="text-amber-600">▲</span>
      <span>{score.count === 0 ? "—" : formatScore(score.total)}</span>
      <span className="font-medium text-amber-700/60">/{TOTAL_MAX}</span>
    </span>
  );
}
