"use client";

import { useState, useTransition } from "react";
import { FolderPlus } from "lucide-react";
import { toast } from "sonner";
import Modal from "@/components/Modal";
import { createFolder } from "@/actions/folder";

export default function NewFolderButton() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [pending, startTransition] = useTransition();

  function submit() {
    if (!name.trim()) return;
    startTransition(async () => {
      try {
        await createFolder(name);
        toast.success("Folder created");
        setName("");
        setOpen(false);
      } catch {
        toast.error("Could not create the folder");
      }
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 border-2 border-brand bg-white px-5 py-2.5 font-virgil text-sm font-bold text-brand transition-all hover:bg-brand-light"
        style={{ borderRadius: "4px 12px 4px 10px / 10px 4px 12px 4px" }}
      >
        <FolderPlus className="h-4 w-4" />
        New Folder
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="New folder">
        <input
          autoFocus
          value={name}
          maxLength={60}
          placeholder="Folder name"
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className="w-full border-2 border-[#e9ecef] px-3 py-2 font-sans text-sm outline-none focus:border-brand"
        />
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => setOpen(false)}
            className="rounded-md border-2 border-[#e9ecef] px-4 py-2 text-sm font-semibold hover:bg-[#f8f9fa]"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={pending || !name.trim()}
            className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {pending ? "Creating..." : "Create"}
          </button>
        </div>
      </Modal>
    </>
  );
}