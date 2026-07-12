import Link from "next/link";
import Avatar from "@/components/Avatar";
import FollowButton from "@/components/FollowButton";
import TriangleCard from "@/components/TriangleCard";
import {
  getCurrentUser,
  getFeedFor,
  getSuggestedTrianglers,
} from "@/lib/data";
import type { FeedItem } from "@/lib/types";

export default function HomePage() {
  const me = getCurrentUser();
  const feed = getFeedFor(me.id);
  const suggested = getSuggestedTrianglers(me.id);

  if (feed.length === 0) {
    return (
      <p className="m-4 rounded-2xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
        Your feed is empty — follow some Trianglers to fill it with triangles.
      </p>
    );
  }

  // Slot the suggested-Trianglers card after the second post.
  const before: FeedItem[] = feed.slice(0, 2);
  const after: FeedItem[] = feed.slice(2);

  return (
    <div>
      {before.map(({ triangle, reason }) => (
        <TriangleCard key={triangle.id} triangle={triangle} suggested={reason === "top"} />
      ))}

      {suggested.length > 0 && (
        <section className="border-b border-gray-100 px-4 py-4">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
            Suggested Trianglers
          </h2>
          <div className="no-scrollbar flex gap-3 overflow-x-auto">
            {suggested.map((user) => (
              <div
                key={user.id}
                className="flex w-32 shrink-0 flex-col items-center gap-2 rounded-2xl border border-gray-200 p-4"
              >
                <Link href={`/profile/${user.handle}`}>
                  <Avatar user={user} size="lg" />
                </Link>
                <Link
                  href={`/profile/${user.handle}`}
                  className="w-full truncate text-center text-xs font-semibold hover:underline"
                >
                  {user.handle}
                </Link>
                <p className="w-full truncate text-center text-[11px] text-gray-500">
                  {user.role === "council"
                    ? "Triangle Council"
                    : user.role === "zealot"
                      ? "The Zealot"
                      : user.name}
                </p>
                <FollowButton targetId={user.id} following={false} size="sm" />
              </div>
            ))}
          </div>
        </section>
      )}

      {after.map(({ triangle, reason }) => (
        <TriangleCard key={triangle.id} triangle={triangle} suggested={reason === "top"} />
      ))}
    </div>
  );
}
