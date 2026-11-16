import NoteCard from "@/components/NoteCard";
import { getMyNotes } from "@/actions/note";

export default async function NotesList() {
  const notes = await getMyNotes();

  if (notes.length === 0) {
    return (
      <p className="mt-12 text-center font-virgil text-[#868e96]">
        No notes yet. Click &quot;New Note&quot; to start writing.
      </p>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {notes.map((n) => (
        <NoteCard
          key={n.id}
          id={n.id}
          title={n.title}
          preview={n.preview}
          isPublic={n.isPublic}
          dateLabel={new Date(n.updatedAt).toLocaleDateString("en-IN", {
            timeZone: "Asia/Kolkata",
          })}
        />
      ))}
    </div>
  );
}