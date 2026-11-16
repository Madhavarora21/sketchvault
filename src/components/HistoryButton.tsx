"use client";

import { useState, useTransition } from "react";
import { History, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import Modal from "@/components/Modal";
import { getVersions, restoreVersion } from "@/actions/history";

type Version = { id: string; elementCount: number; createdAt: string };

export default function HistoryButton({ drawingId }: { drawingId: string }) {
  const [open, setOpen] = useState(false);
  const [versions, setVersions] = useState<Version[] | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function openDialog() {
    setOpen(true);
    setVersions(null);
    setConfirmId(null);
    startTransition(async () => {
      try {
        setVersions(await getVersions(drawingId));
      } catch {
        toast.error("Could not load version history");
        setVersions([]);
      }
    });
  }

  function restore(versionId: string) {
    startTransition(async () => {
      try {
        await restoreVersion(drawingId, versionId);
        toast.success("Version restored");
        window.location.reload();
      } catch {
        toast.error("Could not restore this version");
      }
    });
  }

  return (
    <>
      <button
        onClick={openDialog}
        className="flex items-center gap-2 border-2 border-[#e9ecef] bg-white px-3 py-2 font-virgil text-sm font-medium hover:border-brand hover:text-brand"
        style={{ borderRadius: "8px 2px 8px 3px / 3px 8px 3px 8px" }}
      >
        <History className="h-4 w-4" />
        History
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Version history">
        <p className="mb-3 font-sans text-xs text-[#868e96]">
          A snapshot is saved every few minutes while you draw. The latest 20 are
          kept.
        </p>

        <div className="max-h-80 space-y-2 overflow-y-auto font-sans">
          {versions === null && (
            <p className="py-6 text-center text-sm text-[#868e96]">Loading...</p>
          )}
          {versions?.length === 0 && (
            <p className="py-6 text-center text-sm text-[#868e96]">
              No versions yet. Keep drawing and a snapshot will appear here.
            </p>
          )}
          {versions?.map((v) => (
            <div
              key={v.id}
              className="flex items-center justify-between gap-3 border-2 border-[#e9ecef] px-3 py-2"
            >
              <div>
                <p className="text-sm font-semibold">
                  {new Date(v.createdAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
                <p className="text-xs text-[#868e96]">{v.elementCount} elements</p>
              </div>

              {confirmId === v.id ? (
                <div className="flex gap-2">
                  <button
                    disabled={pending}
                    onClick={() => restore(v.id)}
                    className="rounded bg-brand px-3 py-1 text-xs font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmId(null)}
                    className="rounded border border-[#e9ecef] px-3 py-1 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmId(v.id)}
                  className="flex items-center gap-1.5 rounded border-2 border-[#e9ecef] px-3 py-1 text-xs font-semibold hover:border-brand hover:text-brand"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Restore
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={() => setOpen(false)}
            className="rounded-md border-2 border-[#e9ecef] px-4 py-2 text-sm font-semibold hover:bg-[#f8f9fa]"
          >
            Close
          </button>
        </div>
      </Modal>
    </>
  );
}