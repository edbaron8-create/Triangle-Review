import Link from "next/link";
import Avatar from "@/components/Avatar";
import CouncilBadge from "@/components/CouncilBadge";
import FollowButton from "@/components/FollowButton";
import {
  getCurrentUser,
  getFollowers,
  getReviewsBy,
  getTrianglesBy,
} from "@/lib/data";
import type { Triangler } from "@/lib/types";

/** Profile masthead + Posted/Reviewed tabs, shared by both profile pages. */
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
    [reviews, reviews === 1 ? "review" : "reviews"],
    [followers, "followers"],
    [user.following.length, "following"],
  ];

  const tabBase = "flex items-center gap-1.5 border-t-2 px-1 pt-3 text-xs font-semibold uppercase tracking-widest";

  return (
    <div className="space-y-8">
      <header className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-12">
        <Avatar user={user} size="xl" ring />
        <div className="flex-1 space-y-4 text-center sm:text-left">
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <h1 className="text-xl font-bold">{user.handle}</h1>
            {user.isCouncil && <CouncilBadge />}
            {isMe ? (
              <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                This is you
              </span>
            ) : (
              <FollowButton
                targetId={user.id}
                following={me.following.includes(user.id)}
                size="sm"
              />
            )}
          </div>
          <ul className="flex justify-center gap-6 text-sm sm:justify-start">
            {stats.map(([value, label]) => (
              <li key={label}>
                <span className="font-bold">{value}</span>{" "}
                <span className="text-gray-500">{label}</span>
              </li>
            ))}
          </ul>
          <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-gray-600">{user.bio}</p>
            <p className="mt-1 text-xs text-gray-400">
              Triangling since{" "}
              {new Date(user.joined).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </header>

      <nav className="flex justify-center gap-10 border-t border-gray-200">
        <Link
          href={`/profile/${user.handle}`}
          className={`${tabBase} ${
            activeTab === "posted"
              ? "border-gray-900 text-gray-900"
              : "-mt-px border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          <span aria-hidden>▦</span> Posted
        </Link>
        <Link
          href={`/profile/${user.handle}/reviews`}
          className={`${tabBase} ${
            activeTab === "reviewed"
              ? "border-gray-900 text-gray-900"
              : "-mt-px border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          <span aria-hidden>▲</span> Reviewed
        </Link>
      </nav>
    </div>
  );
}
