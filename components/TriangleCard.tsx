import Link from "next/link";
import Avatar from "@/components/Avatar";
import CouncilBadge from "@/components/CouncilBadge";
import RatingBreakdown from "@/components/RatingBreakdown";
import ScoreBadge from "@/components/ScoreBadge";
import TriangleImage from "@/components/TriangleImage";
import { getTrianglerById, scoreOf } from "@/lib/data";
import { formatScore, timeAgo } from "@/lib/format";
import type { Triangle } from "@/lib/types";

/** Instagram-style feed post for a single triangle. */
export default function TriangleCard({
  triangle,
  suggested = false,
}: {
  triangle: Triangle;
  /** Shown when the post is in the feed because it's top-rated, not followed. */
  suggested?: boolean;
}) {
  const author = getTrianglerById(triangle.authorId);
  const score = scoreOf(triangle);
  const latest = triangle.reviews[triangle.reviews.length - 1];
  const latestAuthor = latest ? getTrianglerById(latest.authorId) : undefined;

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {suggested && (
        <p className="border-b border-amber-100 bg-amber-50 px-4 py-1.5 text-xs font-semibold text-amber-800">
          ▲ Suggested — a Top Triangle from outside your circle
        </p>
      )}

      <header className="flex items-center gap-3 px-4 py-3">
        {author && (
          <Link href={`/profile/${author.handle}`} className="shrink-0">
            <Avatar user={author} size="sm" />
          </Link>
        )}
        <div className="min-w-0 flex-1 leading-tight">
          <p className="flex items-center gap-1.5 truncate text-sm font-semibold">
            {author ? (
              <Link href={`/profile/${author.handle}`} className="hover:underline">
                {author.handle}
              </Link>
            ) : (
              "unknown"
            )}
            {author?.isCouncil && <CouncilBadge compact />}
          </p>
          <p className="truncate text-xs text-gray-500">📍 {triangle.location}</p>
        </div>
        <span className="text-xs text-gray-400">{timeAgo(triangle.createdAt)}</span>
      </header>

      <Link href={`/triangles/${triangle.id}`} aria-label={`View ${triangle.title}`}>
        <TriangleImage
          spec={triangle.image}
          title={triangle.title}
          className="aspect-[4/3] w-full"
        />
      </Link>

      <div className="space-y-3 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <ScoreBadge score={score} />
          <Link
            href={`/triangles/${triangle.id}`}
            className="rounded-full border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 transition hover:border-amber-400 hover:text-amber-700"
          >
            Rate this triangle
          </Link>
        </div>

        {score.count > 0 && <RatingBreakdown axes={score.axes} compact />}

        <p className="text-sm text-gray-800">
          <span className="font-semibold">{author?.handle}</span>{" "}
          <span className="font-medium">{triangle.title}.</span>{" "}
          <span className="text-gray-600">{triangle.description}</span>
        </p>

        {latest && latestAuthor && (
          <p className="truncate text-sm text-gray-500">
            <span className="font-semibold text-gray-700">{latestAuthor.handle}</span>{" "}
            rated it {formatScore(sumRatings(latest.ratings))}/30 — “{latest.comment}”
          </p>
        )}

        <Link
          href={`/triangles/${triangle.id}`}
          className="block text-sm text-gray-400 hover:text-gray-600"
        >
          {score.count === 0
            ? "Be the first to review"
            : `View all ${score.count} review${score.count === 1 ? "" : "s"}${
                score.councilCount > 0 ? ` · ${score.councilCount} from the Council` : ""
              }`}
        </Link>
      </div>
    </article>
  );
}

function sumRatings(r: { aesthetic: number; tacticality: number; triangularity: number }) {
  return r.aesthetic + r.tacticality + r.triangularity;
}
