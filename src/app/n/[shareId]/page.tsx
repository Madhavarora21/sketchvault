import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "@/components/Markdown";
import { getPublicNote } from "@/actions/note";
import { getAuthors } from "@/actions/profile";

export default async function SharedNotePage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params;
  const note = await getPublicNote(shareId);
  if (!note) notFound();

  const author = (await getAuthors([note.userId]))[note.userId];

  return (
    <article className="mx-auto w-full max-w-3xl px-4 pb-20 pt-10">
      <h1 className="font-virgil text-4xl font-bold text-[#1e1e1e]">{note.title}</h1>
      <p className="mt-2 text-sm text-[#868e96]">
        {author && (
          <>
            by{" "}
            <Link href={`/u/${author.handle}`} className="hover:text-brand">
              {author.name}
            </Link>{" "}
            ·{" "}
          </>
        )}
        {new Date(note.updatedAt).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })}
      </p>
      <div className="mt-8">
        <Markdown>{note.content || "_This note is empty._"}</Markdown>
      </div>
    </article>
  );
}