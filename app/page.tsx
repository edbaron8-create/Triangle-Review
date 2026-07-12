import TriangleCard from "@/components/TriangleCard";
import { getTopTriangles, getTriangles } from "@/lib/data";

export default function HomePage() {
  const top = getTopTriangles();
  const all = getTriangles();
  const topIds = new Set(top.map((t) => t.id));

  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-bold">🏆 Top Triangles</h1>
          <span className="text-sm text-gray-500">Highest-rated by the community</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {top.map((triangle) => (
            <TriangleCard key={triangle.id} triangle={triangle} highlight />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">All Triangles</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {all.map((triangle) => (
            <TriangleCard
              key={triangle.id}
              triangle={triangle}
              highlight={topIds.has(triangle.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
