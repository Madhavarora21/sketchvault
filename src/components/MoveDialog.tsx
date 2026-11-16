"use client";

import { useTransition } from "react";
import { Check, Folder as FolderIcon, Home } from "lucide-react";
import { toast } from "sonner";
import Modal from "@/components/Modal";
import { moveDrawing } from "@/actions/folder";

type Props = {
  open: boolean;
  onClose: () => void;
  drawingId: string;
  currentFolderId: string | null;
  folders: { id: string; name: string }[];
};

export default function MoveDialog({
  open,
  onClose,
  drawingId,
  currentFolderId,
  folders,
}: Props) {
  const [pending, startTransition] = useTransition();

  function move(folderId: string | null) {
    if (folderId === currentFolderId) {
      onClose();
      return;
    }
    startTransition(async () => {
      try {
        await moveDrawing(drawingId, folderId);
        toast.success("Drawing moved");
        onClose();
      } catch {
        toast.error("Could not move the drawing");
      }
    });
  }

  const rowClass = (active: boolean) =>
    `flex w-full items-center gap-3 border-2 px-3 py-2.5 text-left text-sm font-semibold transition-colors disabled:opacity-60 ${
      active
        ? "border-brand bg-brand-light text-brand"
        : "border-[#e9ecef] hover:border-brand-soft"
    }`;

  return (
    <Modal open={open} onClose={onClose} title="Move to folder">
      <div className="max-h-72 space-y-2 overflow-y-auto font-sans">
        <button
          disabled={pending}
          onClick={() => move(null)}
          className={rowClass(currentFolderId === null)}
        >
          <Home className="h-4 w-4" />
          <span className="flex-1">My Boards (no folder)</span>
          {currentFolderId === null && <Check className="h-4 w-4" />}
        </button>

        {folders.map((f) => (
          <button
            key={f.id}
            disabled={pending}
            onClick={() => move(f.id)}
            className={rowClass(currentFolderId === f.id)}
          >
            <FolderIcon className="h-4 w-4" />
            <span className="flex-1 truncate">{f.name}</span>
            {currentFolderId === f.id && <Check className="h-4 w-4" />}
          </button>
        ))}

        {folders.length === 0 && (
          <p className="px-1 text-xs text-[#868e96]">
            You have no folders yet. Create one with the New Folder button.
          </p>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="rounded-md border-2 border-[#e9ecef] px-4 py-2 text-sm font-semibold hover:bg-[#f8f9fa]"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}