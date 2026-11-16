"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { Clock, Edit2, FolderInput, Globe, Lock, MoreVertical, Pencil, Share2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteDrawing, renameDrawing } from "@/actions/drawing";
import ConfirmDialog from "@/components/ConfirmDialog";
import ShareDialog from "@/components/ShareDialog";
import MoveDialog from "@/components/MoveDialog";

type Props = {
  id: string;
  title: string;
  isPublic: boolean;
  shareId: string | null;
  dateLabel: string;
  folderId: string | null;
  folders: { id: string; name: string }[];
};

const itemClass =
  "flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-[#1e1e1e] transition-colors";

export default function DrawingCard({
  id,
  title,
  isPublic,
  shareId,
  dateLabel,
  folderId,
  folders,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [draft, setDraft] = useState(title);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
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
    const name = draft.trim();
    if (!name || name === title) {
      setDraft(title);
      return;
    }
    startTransition(async () => {
      try {
        await renameDrawing(id, name);
        toast.success("Drawing renamed");
      } catch {
        toast.error("Could not rename the drawing");
        setDraft(title);
      }
    });
  }

  function confirmDelete() {
    startTransition(async () => {
      try {
        await deleteDrawing(id);
        toast.success("Drawing deleted");
      } catch {
        toast.error("Could not delete the drawing");
      }
      setConfirmOpen(false);
    });
  }

  return (
    <>
      <div
        className={`group relative flex flex-col border-2 border-[#e9ecef] bg-white shadow-sm transition-all hover:border-brand hover:shadow-md ${
          pending ? "opacity-60" : ""
        }`}
        style={{ borderRadius: "8px 2px 6px 2px / 2px 6px 2px 8px" }}
      >
        <Link
          href={`/draw/${id}`}
          className="absolute inset-0 z-0"
          aria-label={`Open ${title}`}
        />

        <div className="pointer-events-none relative z-0 flex aspect-[4/3] items-center justify-center border-b-2 border-dashed border-[#e9ecef] bg-[#f8f9fa] transition-colors group-hover:bg-brand-light">
          <Pencil className="h-8 w-8 text-[#dee2e6] opacity-50 transition-colors group-hover:text-brand group-hover:opacity-100" />
        </div>

        <div className="pointer-events-none relative z-10 flex items-start justify-between gap-2 p-4">
          <div className="min-w-0 flex-1">
            {renaming ? (
              <input
                autoFocus
                value={draft}
                maxLength={80}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={submitRename}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitRename();
                  if (e.key === "Escape") {
                    setDraft(title);
                    setRenaming(false);
                  }
                }}
                className="pointer-events-auto w-full border-b-2 border-brand bg-transparent font-virgil text-lg font-bold text-[#1e1e1e] outline-none"
              />
            ) : (
              <p className="mb-1.5 truncate font-virgil text-lg font-bold text-[#1e1e1e]">
                {title}
              </p>
            )}
            <p className="flex items-center gap-1.5 text-xs font-medium text-[#868e96]">
              <Clock className="h-3.5 w-3.5" />
              {dateLabel}
              <span className="mx-1">·</span>
              {isPublic ? (
                <Globe className="h-3.5 w-3.5 text-brand" />
              ) : (
                <Lock className="h-3.5 w-3.5" />
              )}
              {isPublic ? "Public" : "Private"}
            </p>
          </div>

          <div className="pointer-events-auto relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
              className="rounded-md border-2 border-transparent p-1.5 text-[#868e96] transition-colors hover:border-[#1e1e1e] hover:bg-[#f8f9fa] hover:text-[#1e1e1e]"
            >
              <MoreVertical className="h-5 w-5" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 w-36 overflow-hidden border-2 border-[#1e1e1e] bg-white py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <button
                  className={`${itemClass} hover:bg-brand-light hover:text-brand`}
                  onClick={() => {
                    setMenuOpen(false);
                    setShareOpen(true);
                  }}
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
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
                  className={`${itemClass} hover:bg-brand-light hover:text-brand`}
                  onClick={() => {
                    setMenuOpen(false);
                    setMoveOpen(true);
                  }}
                >
                  <FolderInput className="h-4 w-4" />
                  Move
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
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete drawing?"
        message={`"${title}" will be permanently deleted.`}
        pending={pending}
        onConfirm={confirmDelete}
        onClose={() => setConfirmOpen(false)}
      />
      <MoveDialog
        open={moveOpen}
        onClose={() => setMoveOpen(false)}
        drawingId={id}
        currentFolderId={folderId}
        folders={folders}
      />
      <ShareDialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        id={id}
        isPublic={isPublic}
        shareId={shareId}
      />
    </>
  );
}