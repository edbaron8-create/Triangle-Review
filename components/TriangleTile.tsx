import Link from "next/link";
import TrianglePhoto from "@/components/TrianglePhoto";
import { scoreOf } from "@/lib/data";
import { formatScore } from "@/lib/format";
import type { Triangle } from "@/lib/types";

/** Square grid tile (Explore, search, profile grids) with score overlay. */
export default function TriangleTile({
  triangle,
  rank,
}: {
  triangle: Triangle;
  /** 1-based leaderboard rank; the top 3 get filled badges. */
  rank?: number;
}) {
  const score = scoreOf(triangle);

  return (
    <Link
      href={`/triangles/${triangle.id}`}
      className="group relative block aspect-square overflow-hidden bg-gray-100"
    >
      <TrianglePhoto
        src={triangle.imageUrl}
        alt={triangle.title}
        sizes="(max-width: 448px) 33vw, 150px"
        className="h-full w-full transition duration-300 group-hover:scale-105"
      />
      {rank !== undefined && (
        <span
          className={`absolute left-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold shadow ${
            rank <= 3 ? "bg-army-700 text-white" : "bg-white/90 text-army-800"
          }`}
        >
          {rank}
        </span>
      )}
      <span className="absolute inset-x-0 bottom-0 flex items-baseline justify-between gap-2 bg-gradient-to-t from-black/60 to-transparent px-2 pb-1.5 pt-8 text-white">
        <span className="truncate text-xs font-medium">{triangle.title}</span>
        <span className="shrink-0 text-xs font-bold">
          ▲ {score.count === 0 ? "—" : formatScore(score.total)}
        </span>
      </span>
    </Link>
  );
}
