import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-24 text-center">
        <h1 className="text-5xl font-bold">Draw. Save. Share.</h1>
        <p className="mx-auto mt-4 max-w-xl text-gray-600">
          SketchVault ek whiteboard app hai jahan aap apni drawings banate ho,
          cloud me save karte ho aur ek link se share karte ho.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/dashboard"
            className="rounded-md bg-indigo-600 px-5 py-2.5 text-white hover:bg-indigo-700"
          >
            Open My Boards
          </Link>
          <Link
            href="/explore"
            className="rounded-md border border-gray-300 px-5 py-2.5 hover:bg-gray-50"
          >
            Explore
          </Link>
        </div>
      </main>
    </>
  );
}