"use client";

import { useState, useTransition } from "react";
import { Copy, Globe, Lock, Share2 } from "lucide-react";
import { toast } from "sonner";
import Modal from "@/components/Modal";
import { setNotePublic } from "@/actions/note";

type Props = { id: string; isPublic: boolean; shareId: string | null };

export default function NoteShare({ id, isPublic, shareId }: Props) {
  const [open, setOpen] = useState(false);
  const [pub, setPub] = useState(isPublic);
  const [sid, setSid] = useState(shareId);
  const [pending, startTransition] = useTransition();

  const link =
    typeof window !== "undefined" && sid ? `${window.location.origin}/n/${sid}` : "";

  function change(next: boolean) {
    startTransition(async () => {
      try {
        const res = await setNotePublic(id, next);
        setPub(res.isPublic);
        setSid(res.shareId);
        toast.success(next ? "Note is now public" : "Note is now private");
      } catch {
        toast.error("Could not change visibility");
      }
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-brand px-4 py-2 font-virgil text-sm font-medium text-white shadow-sm hover:bg-brand-dark"
        style={{ borderRadius: "8px 2px 8px 3px / 3px 8px 3px 8px" }}
      >
        <Share2 className="h-4 w-4" />
        Share
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Share note">
        <div className="grid grid-cols-2 gap-3 font-sans">
          <button
            disabled={pending}
            onClick={() => pub && change(false)}
            className={`flex flex-col items-start gap-1 border-2 p-3 text-left ${
              !pub ? "border-brand bg-brand-light" : "border-[#e9ecef] hover:border-brand-soft"
            }`}
          >
            <Lock className="h-5 w-5 text-brand" />
            <span className="text-sm font-bold">Private</span>
            <span className="text-xs text-[#868e96]">Only you can view this</span>
          </button>
          <button
            disabled={pending}
            onClick={() => !pub && change(true)}
            className={`flex flex-col items-start gap-1 border-2 p-3 text-left ${
              pub ? "border-brand bg-brand-light" : "border-[#e9ecef] hover:border-brand-soft"
            }`}
          >
            <Globe className="h-5 w-5 text-brand" />
            <span className="text-sm font-bold">Public</span>
            <span className="text-xs text-[#868e96]">Anyone with the link can view</span>
          </button>
        </div>

        {pub && sid && (
          <div className="mt-5 flex gap-2 font-sans">
            <input
              readOnly
              value={link}
              onFocus={(e) => e.currentTarget.select()}
              className="min-w-0 flex-1 border-2 border-[#e9ecef] bg-[#f8f9fa] px-3 py-2 text-sm outline-none"
            />
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(link);
                toast.success("Link copied to clipboard");
              }}
              className="flex items-center gap-1.5 bg-brand px-3 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              <Copy className="h-4 w-4" />
              Copy
            </button>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setOpen(false)}
            className="rounded-md border-2 border-[#e9ecef] px-4 py-2 text-sm font-semibold hover:bg-[#f8f9fa]"
          >
            Done
          </button>
        </div>
      </Modal>
    </>
  );
}