import Link from "next/link";
import Avatar from "@/components/Avatar";
import FollowButton from "@/components/FollowButton";
import RoleBadge from "@/components/RoleBadge";
import {
  getCurrentUser,
  getFollowers,
  getReviewsBy,
  getTrianglesBy,
} from "@/lib/data";
import type { Triangler } from "@/lib/types";

/** Mobile Instagram-style profile masthead + Posted/Scored tabs. */
export default function ProfileHeader({
  user,
  activeTab,
}: {
  user: Triangler;
  activeTab: "posted" | "reviewed";
}) {
  const me = getCurrentUser();
  const isMe = me.id === user.id;
  const posts = getTrianglesBy(user.id).length;
  const reviews = getReviewsBy(user.id).length;
  const followers = getFollowers(user.id).length;

  const stats: Array<[number, string]> = [
    [posts, posts === 1 ? "triangle" : "triangles"],
    [reviews, reviews === 1 ? "score" : "scores"],
    [followers, "followers"],
    [user.following.length, "following"],
  ];

  const tabBase =
    "flex flex-1 items-center justify-center gap-1.5 border-t-2 py-3 text-xs font-semibold uppercase tracking-widest";

  return (
    <div>
      <header className="space-y-4 px-4 pt-5">
        <div className="flex items-center gap-5">
          <Avatar user={user} size="xl" ring />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-lg font-bold">{user.handle}</h1>
              <RoleBadge role={user.role} />
            </div>
            <ul className="mt-2 flex gap-4 text-sm">
              {stats.map(([value, label]) => (
                <li key={label} className="leading-tight">
                  <span className="block font-bold">{value}</span>
                  <span className="text-xs text-gray-500">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold">{user.name}</p>
          <p className="text-sm text-gray-600">{user.bio}</p>
          <p className="mt-1 text-xs text-gray-400">
            Triangling since{" "}
            {new Date(user.joined).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {isMe ? (
          <p className="rounded-lg bg-gray-100 py-1.5 text-center text-xs font-semibold text-gray-500">
            This is you (browsing as @{me.handle} until sign-in lands)
          </p>
        ) : (
          <FollowButton
            targetId={user.id}
            following={me.following.includes(user.id)}
            block
          />
        )}
      </header>

      <nav className="mt-4 flex border-t border-gray-200">
        <Link
          href={`/profile/${user.handle}`}
          className={`${tabBase} ${
            activeTab === "posted"
              ? "-mt-px border-army-700 text-army-800"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          <span aria-hidden>▦</span> Posted
        </Link>
        <Link
          href={`/profile/${user.handle}/reviews`}
          className={`${tabBase} ${
            activeTab === "reviewed"
              ? "-mt-px border-army-700 text-army-800"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          <span aria-hidden>▲</span> Scored
        </Link>
      </nav>
    </div>
  );
}
