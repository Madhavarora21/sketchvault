export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, FileText, Pencil } from "lucide-react";
import { getPublicNotesByUser } from "@/actions/note";
import { getProfileUser, getPublicDrawingsByUser } from "@/actions/profile";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const user = await getProfileUser(handle);
  if (!user) notFound();

  const [drawings, notes] = await Promise.all([
    getPublicDrawingsByUser(user.id),
    getPublicNotesByUser(user.id),
  ]);

  const date = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-10">
      <div className="flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={user.imageUrl}
          alt={user.name}
          className="h-16 w-16 rounded-full border-2 border-[#e9ecef]"
        />
        <div>
          <h1 className="font-virgil text-3xl font-bold text-[#1e1e1e]">{user.name}</h1>
          <p className="text-sm text-[#868e96]">
            {drawings.length} public {drawings.length === 1 ? "drawing" : "drawings"} ·{" "}
            {notes.length} public {notes.length === 1 ? "note" : "notes"}
          </p>
        </div>
      </div>

      <h2 className="mb-4 mt-10 font-virgil text-xl font-bold">Drawings</h2>
      {drawings.length === 0 ? (
        <p className="font-virgil text-[#868e96]">No public drawings yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {drawings.map((d) => (
            <Link
              key={d.shareId}
              href={`/s/${d.shareId}`}
              className="group flex flex-col border-2 border-[#e9ecef] bg-white shadow-sm transition-all hover:border-brand hover:shadow-md"
              style={{ borderRadius: "8px 2px 6px 2px / 2px 6px 2px 8px" }}
            >
              <div className="flex aspect-[4/3] items-center justify-center border-b-2 border-dashed border-[#e9ecef] bg-[#f8f9fa] group-hover:bg-brand-light">
                <Pencil className="h-8 w-8 text-[#dee2e6] group-hover:text-brand" />
              </div>
              <div className="p-4">
                <p className="mb-1.5 truncate font-virgil text-lg font-bold">{d.title}</p>
                <p className="flex items-center gap-1.5 text-xs text-[#868e96]">
                  <Clock className="h-3.5 w-3.5" />
                  {date(d.updatedAt)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <h2 className="mb-4 mt-12 font-virgil text-xl font-bold">Notes</h2>
      {notes.length === 0 ? (
        <p className="font-virgil text-[#868e96]">No public notes yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((n) => (
            <Link
              key={n.shareId}
              href={`/n/${n.shareId}`}
              className="flex items-center gap-3 border-2 border-[#e9ecef] bg-white p-4 shadow-sm hover:border-brand hover:shadow-md"
              style={{ borderRadius: "8px 2px 6px 2px / 2px 6px 2px 8px" }}
            >
              <FileText className="h-5 w-5 shrink-0 text-brand" />
              <div className="min-w-0">
                <p className="truncate font-virgil font-bold">{n.title}</p>
                <p className="text-xs text-[#868e96]">{date(n.updatedAt)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}