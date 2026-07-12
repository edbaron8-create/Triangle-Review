import type { Metadata, Viewport } from "next";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { getCurrentUser } from "@/lib/auth";
import { EPHEMERAL_DATA } from "@/lib/db";
import "./globals.css";

export const metadata: Metadata = {
  title: "Triangle Reviewer",
  description:
    "Instagram for triangles in real life — post, score, and crown the best triangles.",
};

export const viewport: Viewport = {
  themeColor: "#4b5320",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await getCurrentUser();

  return (
    <html lang="en">
      <body>
        {EPHEMERAL_DATA && (
          <p className="bg-army-950 px-4 py-1.5 text-center text-[11px] font-medium text-army-100">
            Demo deployment — accounts, posts, and photos reset periodically.
            See the README for persistent hosting.
          </p>
        )}

        {/* Top bar: logo + search */}
        <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-md items-center gap-3 px-4 py-2.5">
            <Link
              href="/"
              aria-label="Triangle Reviewer home"
              className="shrink-0 text-2xl font-extrabold leading-none text-army-700"
            >
              ▲
            </Link>
            <form action="/search" className="relative flex-1">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                aria-hidden
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="search"
                name="q"
                placeholder="Search triangles and Trianglers"
                className="w-full rounded-full bg-gray-100 py-2 pl-9 pr-4 text-sm placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-army-500"
              />
            </form>
            {!me && (
              <Link
                href="/login"
                className="shrink-0 rounded-lg bg-army-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-army-800"
              >
                Log in
              </Link>
            )}
          </div>
        </header>

        {/* Content column, padded clear of the bottom tab bar */}
        <main className="mx-auto max-w-md pb-24">{children}</main>

        <BottomNav me={me} />
      </body>
    </html>
  );
}
