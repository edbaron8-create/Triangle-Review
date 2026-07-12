import type { Metadata } from "next";
import UploadForm from "@/components/UploadForm";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Post a triangle · Triangle Reviewer",
};

export default async function UploadPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireUser();
  const { error } = await searchParams;

  return (
    <div className="space-y-4 px-4 py-5">
      <header>
        <h1 className="text-xl font-bold">Post a triangle</h1>
        <p className="text-xs text-gray-500">
          Photograph any sufficiently triangular thing and submit your score
          out of 30. The community, the Council, and the Zealot take it from
          there.
        </p>
      </header>
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}
      <UploadForm />
    </div>
  );
}
