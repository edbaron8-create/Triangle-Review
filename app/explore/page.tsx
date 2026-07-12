import type { Metadata } from "next";
import TriangleTile from "@/components/TriangleTile";
import { getTopTriangles } from "@/lib/data";

export const metadata: Metadata = {
  title: "Explore · Triangle Reviewer",
};

export default function ExplorePage() {
  const ranked = getTopTriangles();

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">🏆 Top Triangles</h1>
        <p className="text-sm text-gray-500">
          Every triangle on the platform, ranked by weighted score — Triangle
          Council ratings count 3×, community 1×, self-reviews ½×.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-3">
        {ranked.map((triangle, i) => (
          <TriangleTile key={triangle.id} triangle={triangle} rank={i + 1} />
        ))}
      </div>
    </div>
  );
}
