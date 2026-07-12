import type { Metadata } from "next";
import TriangleTile from "@/components/TriangleTile";
import { getTopTriangles } from "@/lib/data";

export const metadata: Metadata = {
  title: "Explore · Triangle Reviewer",
};

export default function ExplorePage() {
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

      <div className="grid grid-cols-3 gap-0.5">
        {ranked.map((triangle, i) => (
          <TriangleTile key={triangle.id} triangle={triangle} rank={i + 1} />
        ))}
      </div>
    </div>
  );
}
