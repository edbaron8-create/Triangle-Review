"use client";

import { useEffect } from "react";

/**
 * App-wide error boundary. Without this, any unhandled error during rendering
 * shows the bare "Application error: a client-side exception has occurred"
 * white screen. Here we surface the error (and its digest, which correlates to
 * the server logs) and offer a way to recover.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="space-y-4 px-6 py-16 text-center">
      <p className="text-5xl text-army-700" aria-hidden>
        ▲
      </p>
      <h1 className="text-lg font-bold">Something went wrong</h1>
      <p className="text-sm text-gray-500">
        An unexpected error interrupted this page. You can try again.
      </p>
      {(error.message || error.digest) && (
        <p className="mx-auto max-w-sm break-words rounded-lg bg-red-50 px-3 py-2 text-left text-xs text-red-700">
          {error.message || `Error digest: ${error.digest}`}
        </p>
      )}
      <button
        onClick={reset}
        className="inline-block rounded-lg bg-army-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-army-800"
      >
        Try again
      </button>
    </div>
  );
}
