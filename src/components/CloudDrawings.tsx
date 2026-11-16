import DrawingCard from "@/components/DrawingCard";
import FolderCard from "@/components/FolderCard";
import { getMyDrawings } from "@/actions/drawing";
import { getMyFolders } from "@/actions/folder";

export default async function CloudDrawings({
  folderId = null,
}: {
  folderId?: string | null;
}) {
  const [drawings, folders] = await Promise.all([
    getMyDrawings(folderId),
    getMyFolders(),
  ]);

  const inRoot = folderId === null;

  return (
    <>
      {/* Folders sirf main page par dikhte hain */}
      {inRoot && folders.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 font-virgil text-lg font-bold text-[#1e1e1e]">
            Folders
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {folders.map((f) => (
              <FolderCard key={f.id} id={f.id} name={f.name} count={f.count} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-8">
        {inRoot && folders.length > 0 && (
          <h2 className="mb-4 font-virgil text-lg font-bold text-[#1e1e1e]">
            Drawings
          </h2>
        )}

        {drawings.length === 0 ? (
          <p className="mt-12 text-center font-virgil text-[#868e96]">
            {inRoot
              ? 'No cloud drawings yet. Click "New Drawing" to start.'
              : "This folder is empty. Create a drawing here or move one into it."}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {drawings.map((d) => (
              <DrawingCard
                key={d.id}
                id={d.id}
                title={d.title}
                isPublic={d.isPublic}
                shareId={d.shareId}
                folderId={d.folderId}
                folders={folders.map((f) => ({ id: f.id, name: f.name }))}
                dateLabel={new Date(d.updatedAt).toLocaleDateString("en-IN", {
                  timeZone: "Asia/Kolkata",
                })}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}