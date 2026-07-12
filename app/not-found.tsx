import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-4 py-16 text-center">
      <p className="text-5xl">▲</p>
      <h1 className="text-2xl font-bold">Nothing here</h1>
      <p className="text-gray-500">
        This triangle (or Triangler) doesn&apos;t exist — yet.
      </p>
      <Link href="/" className="inline-block text-triangle-dark hover:underline">
        ← Back to the feed
      </Link>
    </div>
  );
}
