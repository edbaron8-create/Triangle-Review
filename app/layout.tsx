import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Triangle Reviewer",
  description: "Instagram for triangles in real life — post, review, and highlight the best triangles.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-gray-200 bg-white">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-lg font-bold tracking-tight">
              <span className="text-triangle">▲</span> Triangle Reviewer
            </Link>
            <span className="text-sm text-gray-500">Review the world&apos;s triangles</span>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 py-10 text-center text-xs text-gray-400">
          Triangle Reviewer · a home for real-world triangles
        </footer>
      </body>
    </html>
  );
}
