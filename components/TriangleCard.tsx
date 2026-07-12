import Link from "next/link";
import ScoreBadge from "@/components/ScoreBadge";
import { scoreOf } from "@/lib/data";
import type { Triangle } from "@/lib/types";

/** Feed card for a single triangle. */
export default function TriangleCard({
  triangle,
  highlight = false,
}: {
  triangle: Triangle;
  highlight?: boolean;
}) {
  return (
    <Link
      href={`/triangles/${triangle.id}`}
      className={`group block overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md ${
        highlight ? "border-triangle ring-2 ring-triangle/40" : "border-gray-200"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={triangle.imageUrl}
        alt={triangle.title}
        className="aspect-[4/3] w-full object-cover"
      />
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-gray-900 group-hover:text-triangle-dark">
            {triangle.title}
          </h3>
          <ScoreBadge score={scoreOf(triangle)} />
        </div>
        <p className="line-clamp-2 text-sm text-gray-600">{triangle.description}</p>
        <p className="text-xs text-gray-400">
          📍 {triangle.location} · @{triangle.submittedBy}
        </p>
      </div>
    </Link>
  );
}
