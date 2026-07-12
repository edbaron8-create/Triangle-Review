import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProfileHeader from "@/components/ProfileHeader";
import TriangleTile from "@/components/TriangleTile";
import { requireUser } from "@/lib/auth";
import { getTrianglerByUsername, getTrianglesBy } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  return { title: `@${username} · Triangle Reviewer` };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  await requireUser();
  const user = await getTrianglerByUsername(username);
  if (!user) notFound();

  const posted = await getTrianglesBy(user.id);

  return (
    <div>
      <ProfileHeader user={user} activeTab="posted" />
      {posted.length === 0 ? (
        <p className="m-4 rounded-2xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500">
          @{user.username} hasn&apos;t posted a triangle yet.
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
