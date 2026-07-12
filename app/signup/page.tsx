import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signUp } from "@/lib/actions";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign up · Triangle Reviewer",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await getCurrentUser()) redirect("/");
  const { error } = await searchParams;

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-army-500 focus:outline-none focus:ring-1 focus:ring-army-500";

  return (
    <div className="space-y-6 px-6 py-10">
      <header className="space-y-1 text-center">
        <p className="text-5xl text-army-700" aria-hidden>▲</p>
        <h1 className="text-xl font-bold">Become a Triangler</h1>
        <p className="text-sm text-gray-500">
          Post the triangles you find. Score the ones you don&apos;t.
        </p>
      </header>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <form action={signUp} className="space-y-3">
        <input
          name="username"
          required
          autoComplete="username"
          placeholder="username"
          className={inputClass}
        />
        <input
          name="password"
          type="password"
          required
          autoComplete="new-password"
          placeholder="password"
          className={inputClass}
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-army-700 py-2.5 text-sm font-semibold text-white transition hover:bg-army-800"
        >
          Create account
        </button>
      </form>

      <p className="text-center text-sm text-gray-500">
        Already a Triangler?{" "}
        <Link href="/login" className="font-semibold text-army-700 hover:underline">
          Log in
        </Link>
      </p>

      <p className="text-center text-xs text-gray-400">
        Everyone starts as a member — the Council and the Zealot are appointed
        on the backend.
      </p>
    </div>
  );
}
