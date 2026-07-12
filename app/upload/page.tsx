import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Post a triangle · Triangle Reviewer",
};

/** Placeholder until real photo uploads land (see roadmap). */
export default function UploadPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6 py-8 text-center">
      <h1 className="text-2xl font-bold">Post a triangle</h1>
      <div className="space-y-4 rounded-2xl border-2 border-dashed border-gray-300 bg-white p-12">
        <p className="text-6xl" aria-hidden>▲</p>
        <p className="font-semibold text-gray-700">Photo uploads are coming soon</p>
        <p className="text-sm text-gray-500">
          Soon you&apos;ll be able to photograph any sufficiently triangular thing —
          rooftops, road signs, sandwiches, mountains — and submit it for the
          community and the Triangle Council to judge.
        </p>
      </div>
      <Link
        href="/explore"
        className="inline-block rounded-lg bg-amber-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
      >
        Browse Top Triangles instead
      </Link>
    </div>
  );
}
