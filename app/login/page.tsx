import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { logIn } from "@/lib/actions";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Log in · Triangle Reviewer",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await getCurrentUser()) redirect("/");
  const { error } = await searchParams;

  return (
    <div className="space-y-6 px-6 py-10">
      <header className="space-y-1 text-center">
        <p className="text-5xl text-army-700" aria-hidden>▲</p>
        <h1 className="text-xl font-bold">Welcome back, Triangler</h1>
        <p className="text-sm text-gray-500">Log in to post and score triangles.</p>
      </header>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <form action={logIn} className="space-y-3">
        <input
          name="username"
          required
          autoComplete="username"
          placeholder="username"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-army-500 focus:outline-none focus:ring-1 focus:ring-army-500"
        />
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="password"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-army-500 focus:outline-none focus:ring-1 focus:ring-army-500"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-army-700 py-2.5 text-sm font-semibold text-white transition hover:bg-army-800"
        >
          Log in
        </button>
      </form>

      <p className="text-center text-sm text-gray-500">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-army-700 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
