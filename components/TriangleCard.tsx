import Link from "next/link";
import Avatar from "@/components/Avatar";
import RoleBadge from "@/components/RoleBadge";
import ScoreBadge from "@/components/ScoreBadge";
import ScoreBreakdown from "@/components/ScoreBreakdown";
import TrianglePhoto from "@/components/TrianglePhoto";
import { getTrianglerById, reviewTotal, scoreOf } from "@/lib/data";
import { formatScore, timeAgo } from "@/lib/format";
import type { Triangle } from "@/lib/types";

/** Instagram-style feed post for a single triangle (edge-to-edge on mobile). */
export default async function TriangleCard({
  triangle,
  suggested = false,
}: {
  triangle: Triangle;
  /** Shown when the post is in the feed because it's top-rated, not followed. */
  suggested?: boolean;
}) {
  const author = await getTrianglerById(triangle.authorId);
  const score = await scoreOf(triangle);
  const latest = triangle.reviews[triangle.reviews.length - 1];
  const latestAuthor = latest ? await getTrianglerById(latest.authorId) : undefined;

  return (
    <article className="border-b border-gray-100 bg-white pb-4">
      {suggested && (
        <p className="bg-army-50 px-4 py-1.5 text-xs font-semibold text-army-800">
          ▲ Suggested — a Top Triangle from outside your circle
        </p>
      )}

      <header className="flex items-center gap-3 px-4 py-2.5">
        {author && (
          <Link href={`/profile/${author.username}`} className="shrink-0">
            <Avatar user={author} size="sm" />
          </Link>
        )}
        <div className="min-w-0 flex-1 leading-tight">
          <p className="flex items-center gap-1.5 truncate text-sm font-semibold">
            {author ? (
              <Link href={`/profile/${author.username}`} className="hover:underline">
                {author.username}
              </Link>
            ) : (
              "unknown"
            )}
            {author && <RoleBadge role={author.role} compact />}
          </p>
          <p className="truncate text-xs text-gray-500">{triangle.location}</p>
        </div>
        <span className="text-xs text-gray-400">{timeAgo(triangle.createdAt)}</span>
      </header>

      <Link href={`/triangles/${triangle.id}`} aria-label={`View ${triangle.title}`}>
        <TrianglePhoto
          src={triangle.imageUrl}
          alt={triangle.title}
          className="aspect-square w-full"
        />
      </Link>

      <div className="space-y-3 px-4 pt-3">
        <div className="flex items-center justify-between gap-3">
          <ScoreBadge score={score} />
          <Link
            href={`/triangles/${triangle.id}`}
            className="rounded-full border border-army-300 px-3 py-1 text-xs font-semibold text-army-800 transition hover:bg-army-50"
          >
            Score it
          </Link>
        </div>

        {score.count > 0 && <ScoreBreakdown score={score} compact />}

        <p className="text-sm text-gray-800">
          <span className="font-semibold">{author?.username}</span>{" "}
          <span className="font-medium">{triangle.title}.</span>{" "}
          <span className="text-gray-600">{triangle.description}</span>
        </p>

        {latest && latestAuthor && (
          <p className="truncate text-sm text-gray-500">
            <span className="font-semibold text-gray-700">{latestAuthor.username}</span>{" "}
            {latest.kind === "zealot"
              ? `verdict: ${formatScore(reviewTotal(latest))}/10`
              : `scored it ${formatScore(reviewTotal(latest))}/30`}
            {latest.comment && ` — “${latest.comment}”`}
          </p>
        )}

        <Link
          href={`/triangles/${triangle.id}`}
          className="block text-sm text-gray-400 hover:text-gray-600"
        >
          {score.count === 0
            ? "Be the first to score it"
            : `View all ${score.count} score${score.count === 1 ? "" : "s"}`}
        </Link>
      </div>
    </article>
  );
}
