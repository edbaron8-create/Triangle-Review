import Link from "next/link";
import Avatar from "@/components/Avatar";
import FollowButton from "@/components/FollowButton";
import TriangleCard from "@/components/TriangleCard";
import { requireUser } from "@/lib/auth";
import { getFeedFor, getSuggestedTrianglers } from "@/lib/data";
import type { FeedItem } from "@/lib/types";

export default async function HomePage() {
  const me = await requireUser();
  const feed = await getFeedFor(me.id);
  const suggested = await getSuggestedTrianglers(me.id);

  if (feed.length === 0) {
    return (
      <div className="space-y-4 px-4 py-10 text-center">
        <p className="text-5xl text-army-700" aria-hidden>▲</p>
        <h1 className="text-lg font-bold">No triangles yet</h1>
        <p className="text-sm text-gray-500">
          Every feed starts somewhere. Post the first triangle and set the
          standard.
        </p>
        <Link
          href="/upload"
          className="inline-block rounded-lg bg-army-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-army-800"
        >
          Post a triangle
        </Link>
      </div>
    );
  }

  // Slot the suggested-Trianglers card after the second post.
  const before: FeedItem[] = feed.slice(0, 2);
  const after: FeedItem[] = feed.slice(2);

  const suggestedRow = suggested.length > 0 && (
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
            <Link href={`/profile/${user.username}`}>
              <Avatar user={user} size="lg" />
            </Link>
            <Link
              href={`/profile/${user.username}`}
              className="w-full truncate text-center text-xs font-semibold hover:underline"
            >
              {user.username}
            </Link>
            <p className="w-full truncate text-center text-[11px] text-gray-500">
              {user.role === "council"
                ? "Triangle Council"
                : user.role === "zealot"
                  ? "The Zealot"
                  : "Triangler"}
            </p>
            <FollowButton targetId={user.id} following={false} size="sm" />
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div>
      {before.map(({ triangle, reason }) => (
        <TriangleCard key={triangle.id} triangle={triangle} suggested={reason === "top"} />
      ))}
      {suggestedRow}
      {after.map(({ triangle, reason }) => (
        <TriangleCard key={triangle.id} triangle={triangle} suggested={reason === "top"} />
      ))}
    </div>
  );
}
