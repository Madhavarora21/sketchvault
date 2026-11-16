"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { Edit2, Folder as FolderIcon, MoreVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteFolder, renameFolder } from "@/actions/folder";
import ConfirmDialog from "@/components/ConfirmDialog";

type Props = { id: string; name: string; count: number };

const itemClass =
  "flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-[#1e1e1e] transition-colors";

export default function FolderCard({ id, name, count }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [draft, setDraft] = useState(name);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onDown(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [menuOpen]);

  function submitRename() {
    setRenaming(false);
    const next = draft.trim();
    if (!next || next === name) {
      setDraft(name);
      return;
    }
    startTransition(async () => {
      try {
        await renameFolder(id, next);
        toast.success("Folder renamed");
      } catch {
        toast.error("Could not rename the folder");
        setDraft(name);
      }
    });
  }

  function confirmDelete() {
    startTransition(async () => {
      try {
        await deleteFolder(id);
        toast.success("Folder deleted");
      } catch {
        toast.error("Could not delete the folder");
      }
      setConfirmOpen(false);
    });
  }

  return (
    <>
      <div
        className={`group relative flex items-center gap-3 border-2 border-[#e9ecef] bg-white p-4 shadow-sm transition-all hover:border-brand hover:shadow-md ${
          pending ? "opacity-60" : ""
        }`}
        style={{ borderRadius: "8px 2px 6px 2px / 2px 6px 2px 8px" }}
      >
        <Link
          href={`/dashboard?folder=${id}`}
          className="absolute inset-0 z-0"
          aria-label={`Open folder ${name}`}
        />

        <div className="pointer-events-none relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-light">
          <FolderIcon className="h-5 w-5 text-brand" />
        </div>

        <div className="pointer-events-none relative z-10 min-w-0 flex-1">
          {renaming ? (
            <input
              autoFocus
              value={draft}
              maxLength={60}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={submitRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitRename();
                if (e.key === "Escape") {
                  setDraft(name);
                  setRenaming(false);
                }
              }}
              className="pointer-events-auto w-full border-b-2 border-brand bg-transparent font-virgil font-bold text-[#1e1e1e] outline-none"
            />
          ) : (
            <p className="truncate font-virgil font-bold text-[#1e1e1e]">{name}</p>
          )}
          <p className="text-xs font-medium text-[#868e96]">
            {count} {count === 1 ? "drawing" : "drawings"}
          </p>
        </div>

        <div className="pointer-events-auto relative z-10" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Folder menu"
            className="rounded-md border-2 border-transparent p-1.5 text-[#868e96] hover:border-[#1e1e1e] hover:bg-[#f8f9fa] hover:text-[#1e1e1e]"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full z-50 mt-1 w-36 overflow-hidden border-2 border-[#1e1e1e] bg-white py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <button
                className={`${itemClass} hover:bg-brand-light hover:text-brand`}
                onClick={() => {
                  setMenuOpen(false);
                  setRenaming(true);
                }}
              >
                <Edit2 className="h-4 w-4" />
                Rename
              </button>
              <button
                className={`${itemClass} hover:bg-[#ffe3e3] hover:text-[#fa5252]`}
                onClick={() => {
                  setMenuOpen(false);
                  setConfirmOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete folder?"
        message={`"${name}" will be deleted. Drawings inside it will not be deleted, they will move back to My Boards.`}
        pending={pending}
        onConfirm={confirmDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  );
}