import Link from "next/link";
import TriangleImage from "@/components/TriangleImage";
import { scoreOf } from "@/lib/data";
import { formatScore } from "@/lib/format";
import type { Triangle } from "@/lib/types";

const RANK_STYLES = [
  "bg-amber-400 text-amber-950",
  "bg-slate-300 text-slate-800",
  "bg-orange-300 text-orange-900",
] as const;

/** Square grid tile (Explore page, profile grids) with hover score overlay. */
export default function TriangleTile({
  triangle,
  rank,
}: {
  triangle: Triangle;
  /** 1-based leaderboard rank; the top 3 get medal-colored badges. */
  rank?: number;
}) {
  const score = scoreOf(triangle);

  return (
    <Link
      href={`/triangles/${triangle.id}`}
      className="group relative block aspect-square overflow-hidden rounded-lg bg-gray-100"
    >
      <TriangleImage
        spec={triangle.image}
        title={triangle.title}
        className="h-full w-full transition duration-300 group-hover:scale-105"
      />
      {rank !== undefined && (
        <span
          className={`absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold shadow ${
            RANK_STYLES[rank - 1] ?? "bg-white/90 text-gray-700"
          }`}
        >
          {rank}
        </span>
      )}
      <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/50 opacity-0 transition group-hover:opacity-100">
        <span className="text-lg font-bold text-white">
          ▲ {score.count === 0 ? "—" : formatScore(score.total)}/30
        </span>
        <span className="text-xs text-white/80">
          {score.count} review{score.count === 1 ? "" : "s"}
        </span>
      </span>
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2 pb-1.5 pt-6 text-xs font-medium text-white group-hover:opacity-0">
        {triangle.title}
      </span>
    </Link>
  );
}
