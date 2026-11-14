export const dynamic = "force-dynamic";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getPublicDrawings } from "@/actions/drawing";

export default async function ExplorePage() {
  const drawings = await getPublicDrawings();

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-bold">Explore</h1>
        <p className="mt-1 text-gray-600">Logon ki public drawings</p>

        {drawings.length === 0 ? (
          <p className="mt-10 text-gray-500">Abhi koi public drawing nahi hai.</p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {drawings.map((d) => (
              <Link
                key={d.id}
                href={`/s/${d.id}`}
                className="rounded-lg border border-gray-200 p-4 shadow-sm hover:bg-gray-50"
              >
                <h3 className="truncate text-lg font-semibold">{d.title}</h3>
                <p className="mt-1 text-xs text-gray-500">
                  {new Date(d.updatedAt).toLocaleDateString("en-IN", {
                    timeZone: "Asia/Kolkata",
                  })}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}