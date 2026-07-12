import type { Metadata } from "next";
import Link from "next/link";
import TriangleTile from "@/components/TriangleTile";
import { requireUser } from "@/lib/auth";
import { getTopTriangles } from "@/lib/data";

export const metadata: Metadata = {
  title: "Explore · Triangle Reviewer",
};

export default async function ExplorePage() {
  await requireUser();
  const ranked = getTopTriangles();

  return (
    <div>
      <header className="space-y-1 px-4 py-4">
        <h1 className="text-xl font-bold">Top Triangles</h1>
        <p className="text-xs text-gray-500">
          Ranked out of 100: Uploader /30 + Community /30 + Council /30 +
          Zealot /10.
        </p>
      </header>

      {ranked.length === 0 ? (
        <p className="mx-4 rounded-2xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500">
          Nothing to rank yet —{" "}
          <Link href="/upload" className="font-semibold text-army-700 underline">
            post the first triangle
          </Link>
          .
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-0.5">
          {ranked.map((triangle, i) => (
            <TriangleTile key={triangle.id} triangle={triangle} rank={i + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
