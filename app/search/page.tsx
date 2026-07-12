import type { Metadata } from "next";
import Link from "next/link";
import Avatar from "@/components/Avatar";
import RoleBadge from "@/components/RoleBadge";
import TriangleTile from "@/components/TriangleTile";
import { search } from "@/lib/data";

export const metadata: Metadata = {
  title: "Search · Triangle Reviewer",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const results = search(query);
  const empty =
    results.trianglers.length === 0 && results.triangles.length === 0;

  return (
    <div className="space-y-6 py-4">
      <header className="px-4">
        <h1 className="text-xl font-bold">Search</h1>
        {query ? (
          <p className="text-xs text-gray-500">
            Results for “{query}”
          </p>
        ) : (
          <p className="text-xs text-gray-500">
            Use the search bar above to find triangles and Trianglers.
          </p>
        )}
      </header>

      {query && empty && (
        <p className="mx-4 rounded-2xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
          No triangles or Trianglers match “{query}”.
        </p>
      )}

      {results.trianglers.length > 0 && (
        <section className="space-y-1 px-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Trianglers
          </h2>
          <ul>
            {results.trianglers.map((user) => (
              <li key={user.id}>
                <Link
                  href={`/profile/${user.handle}`}
                  className="flex items-center gap-3 rounded-xl px-1 py-2 transition hover:bg-gray-50"
                >
                  <Avatar user={user} size="md" />
                  <span className="min-w-0 flex-1 leading-tight">
                    <span className="flex items-center gap-1.5 truncate text-sm font-semibold">
                      {user.handle} <RoleBadge role={user.role} compact />
                    </span>
                    <span className="block truncate text-xs text-gray-500">
                      {user.name}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {results.triangles.length > 0 && (
        <section className="space-y-2">
          <h2 className="px-4 text-xs font-bold uppercase tracking-widest text-gray-400">
            Triangles
          </h2>
          <div className="grid grid-cols-3 gap-0.5">
            {results.triangles.map((triangle) => (
              <TriangleTile key={triangle.id} triangle={triangle} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
