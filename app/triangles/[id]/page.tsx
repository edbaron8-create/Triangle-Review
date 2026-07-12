import Link from "next/link";
import { notFound } from "next/navigation";
import Avatar from "@/components/Avatar";
import CouncilBadge from "@/components/CouncilBadge";
import RatingBreakdown from "@/components/RatingBreakdown";
import ReviewForm from "@/components/ReviewForm";
import ScoreBadge from "@/components/ScoreBadge";
import TriangleImage from "@/components/TriangleImage";
import {
  COUNCIL_WEIGHT,
  CURRENT_USER_ID,
  UPLOADER_WEIGHT,
  getCurrentUser,
  getTriangleById,
  getTrianglerById,
  scoreOf,
} from "@/lib/data";
import { formatScore, timeAgo } from "@/lib/format";
import type { Ratings } from "@/lib/types";

const totalOf = (r: Ratings) => r.aesthetic + r.tacticality + r.triangularity;

export default async function TrianglePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const triangle = getTriangleById(id);
  if (!triangle) notFound();

  const author = getTrianglerById(triangle.authorId);
  const score = scoreOf(triangle);
  const me = getCurrentUser();
  const myReview = triangle.reviews.find((r) => r.authorId === CURRENT_USER_ID);
  const reviews = [...triangle.reviews].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  return (
    <article className="space-y-6">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-800">
        ← Back to feed
      </Link>

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        {/* Photo */}
        <div className="self-start overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <TriangleImage
            spec={triangle.image}
            title={triangle.title}
            className="aspect-[4/3] w-full"
          />
        </div>

        {/* Post info + score */}
        <div className="space-y-4">
          <header className="flex items-center gap-3">
            {author && (
              <>
                <Link href={`/profile/${author.handle}`}>
                  <Avatar user={author} size="md" />
                </Link>
                <div className="min-w-0 flex-1 leading-tight">
                  <p className="flex items-center gap-1.5 text-sm font-semibold">
                    <Link href={`/profile/${author.handle}`} className="hover:underline">
                      {author.handle}
                    </Link>
                    {author.isCouncil && <CouncilBadge compact />}
                  </p>
                  <p className="text-xs text-gray-500">
                    📍 {triangle.location} · {timeAgo(triangle.createdAt)}
                  </p>
                </div>
              </>
            )}
          </header>

          <div>
            <h1 className="text-2xl font-bold">{triangle.title}</h1>
            <p className="mt-1 text-gray-600">{triangle.description}</p>
          </div>

          <section className="space-y-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                Score
              </h2>
              <ScoreBadge score={score} size="lg" />
            </div>
            {score.count > 0 ? (
              <>
                <RatingBreakdown axes={score.axes} />
                <p className="text-xs text-gray-400">
                  Weighted across {score.count} review{score.count === 1 ? "" : "s"}
                  {score.councilCount > 0 &&
                    ` — including ${score.councilCount} from the Triangle Council`}
                  . Council ×{COUNCIL_WEIGHT}, community ×1, self ×{UPLOADER_WEIGHT}.
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-500">
                No reviews yet — this triangle awaits judgment.
              </p>
            )}
          </section>

          <ReviewForm
            triangleId={triangle.id}
            existing={
              myReview
                ? { ratings: myReview.ratings, comment: myReview.comment }
                : undefined
            }
            isUploader={triangle.authorId === me.id}
          />
        </div>
      </div>

      {/* Reviews */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">
          Reviews <span className="text-gray-400">({reviews.length})</span>
        </h2>
        {reviews.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
            Be the first Triangler to weigh in.
          </p>
        ) : (
          <ul className="space-y-3">
            {reviews.map((review) => {
              const reviewer = getTrianglerById(review.authorId);
              const isSelf = review.authorId === triangle.authorId;
              return (
                <li
                  key={review.id}
                  className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    {reviewer && (
                      <Link href={`/profile/${reviewer.handle}`} className="shrink-0">
                        <Avatar user={reviewer} size="sm" />
                      </Link>
                    )}
                    <div className="min-w-0 flex-1 leading-tight">
                      <p className="flex flex-wrap items-center gap-1.5 text-sm font-semibold">
                        {reviewer ? (
                          <Link
                            href={`/profile/${reviewer.handle}`}
                            className="hover:underline"
                          >
                            {reviewer.handle}
                          </Link>
                        ) : (
                          "unknown"
                        )}
                        {reviewer?.isCouncil && <CouncilBadge />}
                        {isSelf && (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                            self-review · ½ weight
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-400">{timeAgo(review.createdAt)}</p>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-amber-700">
                      {formatScore(totalOf(review.ratings))}
                      <span className="font-medium text-amber-700/60">/30</span>
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Aesthetic {review.ratings.aesthetic} · Tactical{" "}
                    {review.ratings.tacticality} · Triangular{" "}
                    {review.ratings.triangularity}
                  </p>
                  {review.comment && (
                    <p className="mt-1.5 text-sm text-gray-700">{review.comment}</p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </article>
  );
}
