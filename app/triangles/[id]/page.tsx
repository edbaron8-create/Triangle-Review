import Link from "next/link";
import { notFound } from "next/navigation";
import Avatar from "@/components/Avatar";
import RoleBadge from "@/components/RoleBadge";
import ReviewForm from "@/components/ReviewForm";
import ScoreBadge from "@/components/ScoreBadge";
import ScoreBreakdown from "@/components/ScoreBreakdown";
import TrianglePhoto from "@/components/TrianglePhoto";
import { requireUser } from "@/lib/auth";
import {
  getTriangleById,
  getTrianglerById,
  reviewTotal,
  scoreOf,
} from "@/lib/data";
import { formatScore, timeAgo } from "@/lib/format";
import { RATING_AXES, type Review } from "@/lib/types";

/** Label for the component a review feeds into. */
function componentLabel(review: Review, uploaderId: string): string {
  if (review.kind === "zealot") return "Zealot verdict";
  if (review.authorId === uploaderId) return "Uploader score";
  return getTrianglerById(review.authorId)?.role === "council"
    ? "Council score"
    : "Community score";
}

export default async function TrianglePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const me = await requireUser();
  const triangle = getTriangleById(id);
  if (!triangle) notFound();

  const author = getTrianglerById(triangle.authorId);
  const score = scoreOf(triangle);
  const myReview = triangle.reviews.find((r) => r.authorId === me.id);
  const reviews = [...triangle.reviews].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  return (
    <article>
      <header className="flex items-center gap-3 px-4 py-2.5">
        {author && (
          <>
            <Link href={`/profile/${author.handle}`}>
              <Avatar user={author} size="sm" />
            </Link>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="flex items-center gap-1.5 text-sm font-semibold">
                <Link href={`/profile/${author.handle}`} className="hover:underline">
                  {author.handle}
                </Link>
                <RoleBadge role={author.role} compact />
              </p>
              <p className="truncate text-xs text-gray-500">
                {triangle.location} · {timeAgo(triangle.createdAt)}
              </p>
            </div>
          </>
        )}
        <Link href="/" className="text-xs font-semibold text-army-700 hover:underline">
          Feed
        </Link>
      </header>

      <TrianglePhoto
        src={triangle.imageUrl}
        alt={triangle.title}
        className="aspect-square w-full"
      />

      <div className="space-y-4 px-4 py-4">
        <div>
          <h1 className="text-xl font-bold">{triangle.title}</h1>
          <p className="mt-1 text-sm text-gray-600">{triangle.description}</p>
        </div>

        <section className="space-y-3 rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Score
            </h2>
            <ScoreBadge score={score} size="lg" />
          </div>
          <ScoreBreakdown score={score} />
          <p className="text-xs text-gray-400">
            Total out of 100 — Uploader /30, Community average /30, Council /30,
            Zealot verdict /10. Pending components show a dash.
          </p>
        </section>

        <ReviewForm
          triangleId={triangle.id}
          existing={myReview}
          isUploader={triangle.authorId === me.id}
          isZealot={me.role === "zealot"}
        />

        <section className="space-y-3">
          <h2 className="text-base font-bold">
            Scores <span className="text-gray-400">({reviews.length})</span>
          </h2>
          {reviews.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
              Be the first Triangler to weigh in.
            </p>
          ) : (
            <ul className="space-y-3">
              {reviews.map((review) => {
                const reviewer = getTrianglerById(review.authorId);
                return (
                  <li key={review.id} className="rounded-2xl border border-gray-200 p-3.5">
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
                          <span className="rounded-full bg-army-50 px-2 py-0.5 text-[11px] font-medium text-army-800">
                            {componentLabel(review, triangle.authorId)}
                          </span>
                        </p>
                        <p className="text-xs text-gray-400">{timeAgo(review.createdAt)}</p>
                      </div>
                      <span className="shrink-0 text-sm font-bold text-army-700">
                        {formatScore(reviewTotal(review))}
                        <span className="font-medium text-army-700/60">
                          /{review.kind === "zealot" ? 10 : 30}
                        </span>
                      </span>
                    </div>
                    {review.kind === "axes" && (
                      <p className="mt-2 text-xs text-gray-500">
                        {RATING_AXES.map(
                          (axis) => `${axis.short} ${review.ratings[axis.key]}`,
                        ).join(" · ")}
                      </p>
                    )}
                    {review.comment && (
                      <p className="mt-1.5 text-sm text-gray-700">{review.comment}</p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </article>
  );
}
