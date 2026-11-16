"use client";

import { useState, useTransition } from "react";
import { Copy, Globe, Lock, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import Modal from "@/components/Modal";
import { regenerateShareLink, setDrawingPublic } from "@/actions/drawing";

type Props = {
  open: boolean;
  onClose: () => void;
  id: string;
  isPublic: boolean;
  shareId: string | null;
};

export default function ShareDialog({
  open,
  onClose,
  id,
  isPublic,
  shareId,
}: Props) {
  const [pub, setPub] = useState(isPublic);
  const [sid, setSid] = useState(shareId);
  const [confirmRegen, setConfirmRegen] = useState(false);
  const [pending, startTransition] = useTransition();

  const link =
    typeof window !== "undefined" && sid
      ? `${window.location.origin}/s/${sid}`
      : "";

  function changeVisibility(next: boolean) {
    startTransition(async () => {
      try {
        const res = await setDrawingPublic(id, next);
        setPub(res.isPublic);
        setSid(res.shareId);
        toast.success(next ? "Drawing is now public" : "Drawing is now private");
      } catch {
        toast.error("Could not change visibility");
      }
    });
  }

  function regenerate() {
    startTransition(async () => {
      try {
        setSid(await regenerateShareLink(id));
        setConfirmRegen(false);
        toast.success("New share link created");
      } catch {
        toast.error("Could not regenerate the link");
      }
    });
  }

  async function copy() {
    await navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard");
  }

  return (
    <Modal open={open} onClose={onClose} title="Share drawing">
      <div className="grid grid-cols-2 gap-3 font-sans">
        <button
          disabled={pending}
          onClick={() => pub && changeVisibility(false)}
          className={`flex flex-col items-start gap-1 border-2 p-3 text-left ${
            !pub
              ? "border-brand bg-brand-light"
              : "border-[#e9ecef] hover:border-brand-soft"
          }`}
        >
          <Lock className="h-5 w-5 text-brand" />
          <span className="text-sm font-bold">Private</span>
          <span className="text-xs text-[#868e96]">Only you can view this</span>
        </button>
        <button
          disabled={pending}
          onClick={() => !pub && changeVisibility(true)}
          className={`flex flex-col items-start gap-1 border-2 p-3 text-left ${
            pub
              ? "border-brand bg-brand-light"
              : "border-[#e9ecef] hover:border-brand-soft"
          }`}
        >
          <Globe className="h-5 w-5 text-brand" />
          <span className="text-sm font-bold">Public</span>
          <span className="text-xs text-[#868e96]">Anyone with the link can view</span>
        </button>
      </div>

      {pub && sid && (
        <div className="mt-5 font-sans">
          <label className="text-xs font-bold text-[#495057]">Share link</label>
          <div className="mt-1 flex gap-2">
            <input
              readOnly
              value={link}
              onFocus={(e) => e.currentTarget.select()}
              className="min-w-0 flex-1 border-2 border-[#e9ecef] bg-[#f8f9fa] px-3 py-2 text-sm outline-none"
            />
            <button
              onClick={copy}
              className="flex items-center gap-1.5 bg-brand px-3 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              <Copy className="h-4 w-4" />
              Copy
            </button>
          </div>

          {!confirmRegen ? (
            <button
              onClick={() => setConfirmRegen(true)}
              className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#868e96] hover:text-[#fa5252]"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Regenerate link
            </button>
          ) : (
            <div className="mt-3 border-2 border-[#ffc9c9] bg-[#fff5f5] p-3 text-xs text-[#495057]">
              The old link will <strong>stop working permanently</strong>. Are you sure?
              <div className="mt-2 flex gap-2">
                <button
                  onClick={regenerate}
                  disabled={pending}
                  className="rounded bg-[#fa5252] px-3 py-1 font-semibold text-white hover:bg-[#e03131] disabled:opacity-60"
                >
                  Yes, regenerate
                </button>
                <button
                  onClick={() => setConfirmRegen(false)}
                  className="rounded border border-[#e9ecef] bg-white px-3 py-1 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="rounded-md border-2 border-[#e9ecef] px-4 py-2 text-sm font-semibold hover:bg-[#f8f9fa]"
        >
          Done
        </button>
      </div>
    </Modal>
  );
}