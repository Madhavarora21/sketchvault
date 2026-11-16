export const dynamic = "force-dynamic";

import Link from "next/link";
import { Clock, Pencil } from "lucide-react";
import { getPublicDrawings } from "@/actions/drawing";
import { getAuthors } from "@/actions/profile";

export default async function ExplorePage() {
  const drawings = await getPublicDrawings();
  const authors = await getAuthors(drawings.map((d) => d.userId));

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-10">
      <h1 className="font-virgil text-3xl font-bold text-[#1e1e1e]">Explore</h1>
      <p className="mt-1 text-sm text-[#868e96]">Public drawings from the community</p>

      {drawings.length === 0 ? (
        <p className="mt-12 text-center font-virgil text-[#868e96]">
          No public drawings yet.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {drawings.map((d) => {
            const author = authors[d.userId];
            return (
              <div
                key={d.shareId}
                className="group relative flex flex-col border-2 border-[#e9ecef] bg-white shadow-sm transition-all hover:border-brand hover:shadow-md"
                style={{ borderRadius: "8px 2px 6px 2px / 2px 6px 2px 8px" }}
              >
                <Link
                  href={`/s/${d.shareId}`}
                  className="absolute inset-0 z-0"
                  aria-label={`Open ${d.title}`}
                />
                <div className="pointer-events-none relative z-0 flex aspect-[4/3] items-center justify-center border-b-2 border-dashed border-[#e9ecef] bg-[#f8f9fa] transition-colors group-hover:bg-brand-light">
                  <Pencil className="h-8 w-8 text-[#dee2e6] opacity-50 transition-colors group-hover:text-brand group-hover:opacity-100" />
                </div>
                <div className="pointer-events-none relative z-10 p-4">
                  <p className="mb-1.5 truncate font-virgil text-lg font-bold text-[#1e1e1e]">
                    {d.title}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs font-medium text-[#868e96]">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(d.updatedAt).toLocaleDateString("en-IN", {
                      timeZone: "Asia/Kolkata",
                    })}
                    {author && (
                      <>
                        <span className="mx-1">·</span>
                        <Link
                          href={`/u/${author.handle}`}
                          className="pointer-events-auto hover:text-brand"
                        >
                          by {author.name}
                        </Link>
                      </>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}