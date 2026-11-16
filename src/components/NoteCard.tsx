"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Clock, Globe, Lock, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteNote } from "@/actions/note";
import ConfirmDialog from "@/components/ConfirmDialog";

type Props = {
  id: string;
  title: string;
  preview: string;
  isPublic: boolean;
  dateLabel: string;
};

export default function NoteCard({ id, title, preview, isPublic, dateLabel }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function confirmDelete() {
    startTransition(async () => {
      try {
        await deleteNote(id);
        toast.success("Note deleted");
      } catch {
        toast.error("Could not delete the note");
      }
      setConfirmOpen(false);
    });
  }

  return (
    <>
      <div
        className={`group relative flex flex-col border-2 border-[#e9ecef] bg-white p-4 shadow-sm transition-all hover:border-brand hover:shadow-md ${
          pending ? "opacity-60" : ""
        }`}
        style={{ borderRadius: "8px 2px 6px 2px / 2px 6px 2px 8px" }}
      >
        <Link href={`/notes/${id}`} className="absolute inset-0 z-0" aria-label={`Open ${title}`} />

        <div className="pointer-events-none relative z-10 flex items-start justify-between gap-2">
          <p className="truncate font-virgil text-lg font-bold text-[#1e1e1e]">{title}</p>
          <button
            onClick={() => setConfirmOpen(true)}
            aria-label="Delete note"
            className="pointer-events-auto rounded-md border-2 border-transparent p-1.5 text-[#868e96] hover:border-[#fa5252] hover:text-[#fa5252]"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <p className="pointer-events-none relative z-10 mt-2 line-clamp-3 min-h-[3.75rem] font-sans text-sm text-[#868e96]">
          {preview || "Empty note"}
        </p>

        <p className="pointer-events-none relative z-10 mt-3 flex items-center gap-1.5 text-xs font-medium text-[#868e96]">
          <Clock className="h-3.5 w-3.5" />
          {dateLabel}
          <span className="mx-1">·</span>
          {isPublic ? <Globe className="h-3.5 w-3.5 text-brand" /> : <Lock className="h-3.5 w-3.5" />}
          {isPublic ? "Public" : "Private"}
        </p>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete note?"
        message={`"${title}" will be permanently deleted.`}
        pending={pending}
        onConfirm={confirmDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  );
}