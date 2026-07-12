"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Avatar from "@/components/Avatar";
import type { Triangler } from "@/lib/types";

/** Instagram-style fixed bottom tab bar: Home, Explore, Post, Profile. */
export default function BottomNav({ me }: { me: Triangler | null }) {
  const pathname = usePathname();
  const profileHref = me ? `/profile/${me.username}` : "/login";

  const tabs = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
      icon: (
        <path d="M3 10.5 12 3l9 7.5M5 9.5V21h5v-6h4v6h5V9.5" />
      ),
    },
    {
      href: "/explore",
      label: "Explore",
      active: pathname.startsWith("/explore") || pathname.startsWith("/search"),
      icon: (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="m15.5 8.5-2 5-5 2 2-5z" />
        </>
      ),
    },
    {
      href: "/upload",
      label: "Post",
      active: pathname.startsWith("/upload"),
      icon: (
        <>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <path d="M12 8v8M8 12h8" />
        </>
      ),
    },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex h-14 max-w-md items-center justify-around">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            aria-label={tab.label}
            aria-current={tab.active ? "page" : undefined}
            className={`flex h-full flex-1 items-center justify-center transition ${
              tab.active ? "text-army-700" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={tab.active ? 2.6 : 2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              {tab.icon}
            </svg>
          </Link>
        ))}
        <Link
          href={profileHref}
          aria-label={me ? `Your profile (@${me.username})` : "Log in"}
          aria-current={pathname.startsWith(profileHref) ? "page" : undefined}
          className={`flex h-full flex-1 items-center justify-center ${
            me ? "" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          {me ? (
            <span
              className={`rounded-full ${
                pathname.startsWith(profileHref) ? "ring-2 ring-army-700 ring-offset-1" : ""
              }`}
            >
              <Avatar user={me} size="xs" />
            </span>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 3.5-6.5 8-6.5s8 2.5 8 6.5" />
            </svg>
          )}
        </Link>
      </div>
    </nav>
  );
}
