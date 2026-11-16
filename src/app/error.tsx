"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-xl px-6 py-28 text-center">
      <p className="font-virgil text-6xl font-bold text-red-500">Oops</p>
      <h1 className="mt-4 font-virgil text-2xl font-bold">Kuch galat ho gaya</h1>
      <p className="mt-2 text-gray-600">Dobara try karo. Problem rahe to home par jao.</p>

      {process.env.NODE_ENV === "development" && (
        <pre className="mt-6 overflow-auto rounded border border-red-200 bg-red-50 p-3 text-left text-xs text-red-700">
          {error.message}
        </pre>
      )}

      <div className="mt-8 flex justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-md bg-brand px-5 py-2.5 text-white hover:bg-brand-dark"
        >
          Try again
        </button>
        <Link href="/" className="rounded-md border border-gray-300 px-5 py-2.5 hover:bg-gray-50">
          Home
        </Link>
      </div>
    </main>
  );
}