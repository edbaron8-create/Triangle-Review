import { formatScore } from "@/lib/format";
import { AXIS_MAX, RATING_AXES, type AxisScores } from "@/lib/types";

const BAR_COLORS: Record<keyof AxisScores, string> = {
  aesthetic: "bg-rose-400",
  tacticality: "bg-sky-400",
  triangularity: "bg-amber-400",
};

/** Three labeled bars, one per rating axis, each out of 10. */
export default function RatingBreakdown({
  axes,
  compact = false,
}: {
  axes: AxisScores;
  compact?: boolean;
}) {
  return (
    <dl className={compact ? "space-y-1" : "space-y-2"}>
      {RATING_AXES.map((axis) => {
        const value = axes[axis.key];
        return (
          <div key={axis.key} className="flex items-center gap-2">
            <dt
              className={`shrink-0 text-gray-500 ${compact ? "w-20 text-[11px]" : "w-32 text-sm"}`}
            >
              {compact ? axis.short : axis.label}
            </dt>
            <dd className="flex min-w-0 flex-1 items-center gap-2">
              <div className={`flex-1 overflow-hidden rounded-full bg-gray-100 ${compact ? "h-1.5" : "h-2"}`}>
                <div
                  className={`h-full rounded-full ${BAR_COLORS[axis.key]}`}
                  style={{ width: `${(value / AXIS_MAX) * 100}%` }}
                />
              </div>
              <span
                className={`shrink-0 text-right font-semibold tabular-nums text-gray-700 ${compact ? "w-7 text-[11px]" : "w-9 text-sm"}`}
              >
                {formatScore(value)}
              </span>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
