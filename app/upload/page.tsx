import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Post a triangle · Triangle Reviewer",
};

/** Placeholder until real photo uploads land (see roadmap). */
export default function UploadPage() {
  return (
    <div className="space-y-5 px-4 py-8 text-center">
      <h1 className="text-xl font-bold">Post a triangle</h1>
      <div className="space-y-4 rounded-2xl border-2 border-dashed border-army-300 bg-army-50 p-10">
        <p className="text-6xl text-army-700" aria-hidden>▲</p>
        <p className="font-semibold text-army-900">Photo uploads are coming soon</p>
        <p className="text-sm text-army-800/80">
          Soon you&apos;ll photograph any sufficiently triangular thing — rooftops,
          road signs, sandwiches, mountains — submit your Uploader score out of
          30, and let the community, the Council, and the Zealot do the rest.
        </p>
      </div>
      <Link
        href="/explore"
        className="inline-block rounded-lg bg-army-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-army-800"
      >
        Browse Top Triangles instead
      </Link>
    </div>
  );
}
