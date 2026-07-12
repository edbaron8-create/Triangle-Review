import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProfileHeader from "@/components/ProfileHeader";
import TriangleImage from "@/components/TriangleImage";
import {
  getReviewsBy,
  getTrianglerByHandle,
  getTrianglerById,
  reviewTotal,
} from "@/lib/data";
import { formatScore, timeAgo } from "@/lib/format";
import { RATING_AXES } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  return { title: `@${handle} scores · Triangle Reviewer` };
}

export default async function ProfileReviewsPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const user = getTrianglerByHandle(handle);
  if (!user) notFound();

  const reviews = getReviewsBy(user.id);

  return (
    <div>
      <ProfileHeader user={user} activeTab="reviewed" />
      {reviews.length === 0 ? (
        <p className="m-4 rounded-2xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500">
          @{user.handle} hasn&apos;t scored any triangles yet.
        </p>
      ) : (
        <ul className="space-y-3 px-4 py-4">
          {reviews.map(({ review, triangle }) => {
            const poster = getTrianglerById(triangle.authorId);
            return (
              <li
                key={review.id}
                className="flex gap-3 rounded-2xl border border-gray-200 p-3"
              >
                <Link href={`/triangles/${triangle.id}`} className="shrink-0">
                  <TriangleImage
                    spec={triangle.image}
                    title={triangle.title}
                    className="h-20 w-20 rounded-lg"
                  />
                </Link>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <Link
                      href={`/triangles/${triangle.id}`}
                      className="truncate text-sm font-semibold hover:underline"
                    >
                      {triangle.title}
                    </Link>
                    <span className="shrink-0 text-sm font-bold text-army-700">
                      {formatScore(reviewTotal(review))}
                      <span className="font-medium text-army-700/60">
                        /{review.kind === "zealot" ? 10 : 30}
                      </span>
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    by {poster ? `@${poster.handle}` : "unknown"} ·{" "}
                    {timeAgo(review.createdAt)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {review.kind === "zealot"
                      ? "✦ Zealot verdict — no criteria"
                      : RATING_AXES.map(
                          (axis) => `${axis.short} ${review.ratings[axis.key]}`,
                        ).join(" · ")}
                  </p>
                  {review.comment && (
                    <p className="line-clamp-2 text-sm text-gray-700">
                      “{review.comment}”
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
