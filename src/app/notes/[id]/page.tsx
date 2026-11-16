import { notFound } from "next/navigation";
import NoteEditor from "@/components/NoteEditor";
import { getMyNote } from "@/actions/note";

export default async function NotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const note = await getMyNote(id);
  if (!note) notFound();

  return (
    <NoteEditor
      id={note.id}
      initialTitle={note.title}
      initialContent={note.content}
      isPublic={note.isPublic}
      shareId={note.shareId}
    />
  );
}