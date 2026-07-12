import { formatScore } from "@/lib/format";
import { TOTAL_MAX, type Score } from "@/lib/types";

/** Compact ▲-score pill: a triangle's total out of 100. */
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
      className={`inline-flex items-baseline gap-1 rounded-full bg-army-100 font-bold text-army-900 ${sizes[size]}`}
      title={
        score.count === 0
          ? "Not yet scored"
          : `Uploader + community + council + zealot, from ${score.count} score${score.count === 1 ? "" : "s"}`
      }
    >
      <span aria-hidden className="text-army-600">▲</span>
      <span>{score.count === 0 ? "—" : formatScore(score.total)}</span>
      <span className="font-medium text-army-700/60">/{TOTAL_MAX}</span>
    </span>
  );
}
