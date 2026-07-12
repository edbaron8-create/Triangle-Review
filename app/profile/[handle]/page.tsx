import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProfileHeader from "@/components/ProfileHeader";
import TriangleTile from "@/components/TriangleTile";
import { getTrianglerByHandle, getTrianglesBy } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  return { title: `@${handle} · Triangle Reviewer` };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const user = getTrianglerByHandle(handle);
  if (!user) notFound();

  const posted = getTrianglesBy(user.id);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <ProfileHeader user={user} activeTab="posted" />
      {posted.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
          @{user.handle} hasn&apos;t posted a triangle yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-3">
          {posted.map((triangle) => (
            <TriangleTile key={triangle.id} triangle={triangle} />
          ))}
        </div>
      )}
    </div>
  );
}
