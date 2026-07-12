import Link from "next/link";
import Avatar from "@/components/Avatar";
import FollowButton from "@/components/FollowButton";
import ScoreBadge from "@/components/ScoreBadge";
import TriangleCard from "@/components/TriangleCard";
import TriangleImage from "@/components/TriangleImage";
import {
  getCurrentUser,
  getFeedFor,
  getSuggestedTrianglers,
  getTrianglers,
  getTopTriangles,
  scoreOf,
} from "@/lib/data";

export default function HomePage() {
  const me = getCurrentUser();
  const feed = getFeedFor(me.id);
  const trianglers = getTrianglers().filter((t) => t.id !== me.id);
  const suggested = getSuggestedTrianglers(me.id);
  const top = getTopTriangles(3);

  return (
    <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
      {/* Main column */}
      <div className="mx-auto w-full max-w-lg space-y-6">
        {/* Stories-style Triangler strip */}
        <section
          aria-label="Trianglers"
          className="flex gap-4 overflow-x-auto rounded-2xl border border-gray-200 bg-white p-4"
        >
          {trianglers.map((user) => (
            <Link
              key={user.id}
              href={`/profile/${user.handle}`}
              className="flex w-16 shrink-0 flex-col items-center gap-1.5"
            >
              <Avatar user={user} size="md" ring />
              <span className="w-full truncate text-center text-[11px] text-gray-600">
                {user.handle}
              </span>
            </Link>
          ))}
        </section>

        {/* Feed */}
        {feed.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
            Your feed is empty — follow some Trianglers to fill it with triangles.
          </p>
        ) : (
          feed.map(({ triangle, reason }) => (
            <TriangleCard
              key={triangle.id}
              triangle={triangle}
              suggested={reason === "top"}
            />
          ))
        )}
      </div>

      {/* Sidebar */}
      <aside className="hidden space-y-8 lg:block">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${me.handle}`}>
            <Avatar user={me} size="md" />
          </Link>
          <div className="min-w-0 leading-tight">
            <Link
              href={`/profile/${me.handle}`}
              className="block truncate text-sm font-semibold hover:underline"
            >
              {me.handle}
            </Link>
            <p className="truncate text-xs text-gray-500">{me.name}</p>
          </div>
        </div>

        {suggested.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Trianglers to follow
            </h2>
            <ul className="space-y-3">
              {suggested.map((user) => (
                <li key={user.id} className="flex items-center gap-3">
                  <Link href={`/profile/${user.handle}`} className="shrink-0">
                    <Avatar user={user} size="sm" />
                  </Link>
                  <div className="min-w-0 flex-1 leading-tight">
                    <Link
                      href={`/profile/${user.handle}`}
                      className="block truncate text-sm font-semibold hover:underline"
                    >
                      {user.handle}
                    </Link>
                    <p className="truncate text-xs text-gray-500">
                      {user.isCouncil ? "Triangle Council" : user.name}
                    </p>
                  </div>
                  <FollowButton targetId={user.id} following={false} size="sm" />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Top Triangles
            </h2>
            <Link href="/explore" className="text-xs font-semibold text-sky-600 hover:underline">
              See all
            </Link>
          </div>
          <ul className="space-y-3">
            {top.map((triangle, i) => (
              <li key={triangle.id}>
                <Link
                  href={`/triangles/${triangle.id}`}
                  className="flex items-center gap-3 rounded-xl p-1.5 transition hover:bg-white"
                >
                  <span className="w-4 text-center text-sm font-bold text-gray-400">
                    {i + 1}
                  </span>
                  <TriangleImage
                    spec={triangle.image}
                    title={triangle.title}
                    className="h-12 w-12 shrink-0 rounded-lg"
                  />
                  <div className="min-w-0 flex-1 leading-tight">
                    <p className="truncate text-sm font-semibold">{triangle.title}</p>
                    <ScoreBadge score={scoreOf(triangle)} size="sm" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </aside>
    </div>
  );
}
