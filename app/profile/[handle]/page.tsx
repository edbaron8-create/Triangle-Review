import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProfileHeader from "@/components/ProfileHeader";
import TriangleTile from "@/components/TriangleTile";
import { requireUser } from "@/lib/auth";
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
  await requireUser();
  const user = await getTrianglerByHandle(handle);
  if (!user) notFound();

  const posted = await getTrianglesBy(user.id);

  return (
    <div>
      <ProfileHeader user={user} activeTab="posted" />
      {posted.length === 0 ? (
        <p className="m-4 rounded-2xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500">
          @{user.handle} hasn&apos;t posted a triangle yet.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-0.5">
          {posted.map((triangle) => (
            <TriangleTile key={triangle.id} triangle={triangle} />
          ))}
        </div>
      )}
    </div>
  );
}
