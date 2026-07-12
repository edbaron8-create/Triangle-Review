import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProfileHeader from "@/components/ProfileHeader";
import TriangleImage from "@/components/TriangleImage";
import { getReviewsBy, getTrianglerByHandle, getTrianglerById } from "@/lib/data";
import { formatScore, timeAgo } from "@/lib/format";
import { RATING_AXES } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  return { title: `@${handle} reviews · Triangle Reviewer` };
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
    <div className="mx-auto max-w-3xl space-y-6">
      <ProfileHeader user={user} activeTab="reviewed" />
      {reviews.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
          @{user.handle} hasn&apos;t reviewed any triangles yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {reviews.map(({ review, triangle }) => {
            const total =
              review.ratings.aesthetic +
              review.ratings.tacticality +
              review.ratings.triangularity;
            const poster = getTrianglerById(triangle.authorId);
            return (
              <li
                key={review.id}
                className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <Link href={`/triangles/${triangle.id}`} className="shrink-0">
                  <TriangleImage
                    spec={triangle.image}
                    title={triangle.title}
                    className="h-20 w-20 rounded-lg sm:h-24 sm:w-24"
                  />
                </Link>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <Link
                      href={`/triangles/${triangle.id}`}
                      className="truncate font-semibold hover:underline"
                    >
                      {triangle.title}
                    </Link>
                    <span className="shrink-0 text-sm font-bold text-amber-700">
                      {formatScore(total)}
                      <span className="font-medium text-amber-700/60">/30</span>
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    by {poster ? `@${poster.handle}` : "unknown"} ·{" "}
                    {timeAgo(review.createdAt)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {RATING_AXES.map(
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
