import { formatScore } from "@/lib/format";
import { COMPONENT_MAX, ZEALOT_MAX, type Score } from "@/lib/types";

interface Row {
  label: string;
  short: string;
  value: number | null;
  max: number;
  bar: string;
  detail?: string;
}

function rowsOf(score: Score): Row[] {
  return [
    {
      label: "Uploader", short: "Up", value: score.uploader, max: COMPONENT_MAX,
      bar: "bg-army-300",
    },
    {
      label: "Community", short: "Com", value: score.community, max: COMPONENT_MAX,
      bar: "bg-army-500",
      detail: score.communityCount > 0 ? `avg of ${score.communityCount}` : undefined,
    },
    {
      label: "Council", short: "Cnl", value: score.council, max: COMPONENT_MAX,
      bar: "bg-army-700",
      detail: score.councilCount > 1 ? `avg of ${score.councilCount}` : undefined,
    },
    {
      label: "Zealot", short: "Z", value: score.zealot, max: ZEALOT_MAX,
      bar: "bg-army-950",
    },
  ];
}

/**
 * The four score components: Uploader /30, Community /30, Council /30,
 * Zealot /10. Pending components render as an empty bar with a dash.
 */
export default function ScoreBreakdown({
  score,
  compact = false,
}: {
  score: Score;
  compact?: boolean;
}) {
  return (
    <dl className={compact ? "space-y-1" : "space-y-2"}>
      {rowsOf(score).map((row) => (
        <div key={row.label} className="flex items-center gap-2">
          <dt
            className={`shrink-0 text-gray-500 ${compact ? "w-[4.5rem] text-[11px]" : "w-24 text-sm"}`}
          >
            {row.label}
          </dt>
          <dd className="flex min-w-0 flex-1 items-center gap-2">
            <div
              className={`flex-1 overflow-hidden rounded-full bg-gray-100 ${compact ? "h-1.5" : "h-2"}`}
            >
              {row.value !== null && (
                <div
                  className={`h-full rounded-full ${row.bar}`}
                  style={{ width: `${(row.value / row.max) * 100}%` }}
                />
              )}
            </div>
            <span
              className={`shrink-0 text-right font-semibold tabular-nums text-gray-700 ${
                compact ? "w-12 text-[11px]" : "w-14 text-sm"
              }`}
            >
              {row.value === null ? "—" : formatScore(row.value)}
              <span className="font-normal text-gray-400">/{row.max}</span>
            </span>
            {!compact && row.detail && (
              <span className="hidden shrink-0 text-xs text-gray-400 sm:inline">
                {row.detail}
              </span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
