import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-xl px-6 py-28 text-center">
        <p className="text-6xl font-bold text-indigo-600">404</p>
        <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-gray-600">
          This page does not exist, or the drawing is private or has been deleted.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-md bg-indigo-600 px-5 py-2.5 text-white hover:bg-indigo-700"
        >
          Go home
        </Link>
      </main>
    </>
  );
}