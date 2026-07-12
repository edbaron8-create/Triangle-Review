import type { Metadata } from "next";
import Link from "next/link";
import Avatar from "@/components/Avatar";
import { getCurrentUser } from "@/lib/data";
import "./globals.css";

export const metadata: Metadata = {
  title: "Triangle Reviewer",
  description:
    "Instagram for triangles in real life — post, review, and highlight the best triangles.",
};

const navLink =
  "flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-100 hover:text-gray-900";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = getCurrentUser();

  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur">
          <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-2.5">
            <Link href="/" className="text-lg font-extrabold tracking-tight">
              <span className="bg-gradient-to-tr from-amber-500 via-rose-500 to-violet-600 bg-clip-text text-transparent">
                ▲ Triangle Reviewer
              </span>
            </Link>

            <div className="flex items-center gap-1.5">
              <Link href="/" className={navLink} title="Home feed" aria-label="Home feed">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                  <path d="M3 10.5 12 3l9 7.5" />
                  <path d="M5 9.5V21h5v-6h4v6h5V9.5" />
                </svg>
              </Link>
              <Link href="/explore" className={navLink} title="Explore top triangles" aria-label="Explore top triangles">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                  <circle cx="12" cy="12" r="9" />
                  <path d="m15.5 8.5-2 5-5 2 2-5z" />
                </svg>
              </Link>
              <Link href="/upload" className={navLink} title="Post a triangle" aria-label="Post a triangle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                  <rect x="3" y="3" width="18" height="18" rx="4" />
                  <path d="M12 8v8M8 12h8" />
                </svg>
              </Link>
              <Link
                href={`/profile/${me.handle}`}
                className="ml-1.5"
                title={`Your profile (@${me.handle})`}
                aria-label={`Your profile (@${me.handle})`}
              >
                <Avatar user={me} size="sm" />
              </Link>
            </div>
          </nav>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>

        <footer className="mx-auto max-w-5xl px-4 py-10 text-center text-xs text-gray-400">
          Triangle Reviewer · a home for real-world triangles · browsing as @{me.handle}{" "}
          (real sign-in coming soon)
        </footer>
      </body>
    </html>
  );
}
