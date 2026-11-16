"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { FilePlus } from "lucide-react";
import { toast } from "sonner";
import { createNote } from "@/actions/note";

export default function NewNoteButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      try {
        const id = await createNote();
        router.push(`/notes/${id}`);
      } catch {
        toast.error("Could not create the note");
      }
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="flex items-center gap-2 bg-brand px-5 py-2.5 font-virgil text-sm font-bold text-white shadow-md transition-all hover:bg-brand-dark disabled:opacity-60"
      style={{ borderRadius: "12px 4px 10px 4px / 4px 10px 4px 12px" }}
    >
      <FilePlus className="h-4 w-4" />
      {pending ? "Creating..." : "New Note"}
    </button>
  );
}