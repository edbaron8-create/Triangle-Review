import Link from "next/link";
import { notFound } from "next/navigation";
import ScoreBadge from "@/components/ScoreBadge";
import { getTriangleById, scoreOf } from "@/lib/data";

export default async function TrianglePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const triangle = getTriangleById(id);

  if (!triangle) {
    notFound();
  }

  const score = scoreOf(triangle);

  return (
    <article className="space-y-8">
      <Link href="/" className="text-sm text-triangle-dark hover:underline">
        ← Back to feed
      </Link>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={triangle.imageUrl}
          alt={triangle.title}
          className="aspect-[4/3] w-full object-cover"
        />
        <div className="space-y-3 p-6">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold">{triangle.title}</h1>
            <ScoreBadge score={score} />
          </div>
          <p className="text-gray-700">{triangle.description}</p>
          <p className="text-sm text-gray-400">
            📍 {triangle.location} · submitted by @{triangle.submittedBy}
          </p>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">
          Reviews <span className="text-gray-400">({score.count})</span>
        </h2>
        <ul className="space-y-3">
          {triangle.reviews.map((review) => (
            <li
              key={review.id}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">@{review.author}</span>
                <span className="text-triangle" aria-label={`${review.rating} out of 5`}>
                  {"★".repeat(review.rating)}
                  <span className="text-gray-300">{"★".repeat(5 - review.rating)}</span>
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
