"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Pencil, Plus, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ConfirmDialog";
import {
  createLocalDrawing,
  deleteLocalDrawing,
  listLocalDrawings,
  renameLocalDrawing,
  type LocalDrawing,
} from "@/lib/localDrawings";
import { useMounted } from "@/lib/useMounted";

export default function LocalBoards({ embedded = false }: { embedded?: boolean }) {
  const router = useRouter();
  const mounted = useMounted();
  const [version, setVersion] = useState(0);
  const [toDelete, setToDelete] = useState<LocalDrawing | null>(null);

  // null = abhi browser se load nahi hua
  const items = useMemo<LocalDrawing[] | null>(
    () => (mounted ? listLocalDrawings() : null),
    // version badalne par list dobara padhi jaati hai
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mounted, version]
  );

  function refresh() {
    setVersion((v) => v + 1);
  }

  function handleCreate() {
    const id = createLocalDrawing();
    router.push(`/local/${id}`);
  }

  function handleRename(d: LocalDrawing) {
    const name = window.prompt("Enter a new name", d.title);
    if (!name) return;
    renameLocalDrawing(d.id, name);
    refresh();
    toast.success("Drawing renamed");
  }

  function handleDelete() {
    if (!toDelete) return;
    deleteLocalDrawing(toDelete.id);
    setToDelete(null);
    refresh();
    toast.success("Drawing deleted");
  }

  const Wrapper = embedded ? "section" : "main";

  return (
    <Wrapper className={embedded ? "mt-8" : "mx-auto w-full max-w-7xl px-4 pb-20 pt-10"}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          {embedded ? null : (
            <h1 className="font-virgil text-3xl font-bold text-[#1e1e1e]">
              Local Boards
            </h1>
          )}
          <p className="mt-1 text-sm text-[#868e96]">
            Draw without signing in. These drawings are saved only in this browser.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-brand px-5 py-2.5 font-virgil text-sm font-bold text-white shadow-md transition-all hover:bg-brand-dark"
          style={{ borderRadius: "12px 4px 10px 4px / 4px 10px 4px 12px" }}
        >
          <Plus className="h-4 w-4" />
          New Local Drawing
        </button>
      </div>

      {items === null ? (
        <p className="mt-12 text-center font-virgil text-[#868e96]">Loading...</p>
      ) : items.length === 0 ? (
        <p className="mt-12 text-center font-virgil text-[#868e96]">
          No local drawings yet. Click &quot;New Local Drawing&quot; to start.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((d) => (
            <div
              key={d.id}
              className="group relative flex flex-col border-2 border-[#e9ecef] bg-white shadow-sm transition-all hover:border-brand hover:shadow-md"
              style={{ borderRadius: "8px 2px 6px 2px / 2px 6px 2px 8px" }}
            >
              <Link
                href={`/local/${d.id}`}
                className="absolute inset-0 z-0"
                aria-label={`Open ${d.title}`}
              />
              <div className="pointer-events-none relative z-0 flex aspect-[4/3] items-center justify-center border-b-2 border-dashed border-[#e9ecef] bg-[#f8f9fa] transition-colors group-hover:bg-brand-light">
                <Pencil className="h-8 w-8 text-[#dee2e6] opacity-50 transition-colors group-hover:text-brand group-hover:opacity-100" />
              </div>
              <div className="pointer-events-none relative z-10 flex items-start justify-between gap-2 p-4">
                <div className="min-w-0 flex-1">
                  <p className="mb-1.5 truncate font-virgil text-lg font-bold text-[#1e1e1e]">
                    {d.title}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs font-medium text-[#868e96]">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(d.updatedAt).toLocaleDateString("en-IN")} · Local
                  </p>
                </div>
                <div className="pointer-events-auto flex gap-1">
                  <button
                    onClick={() => handleRename(d)}
                    aria-label="Rename"
                    className="rounded-md border-2 border-transparent p-1.5 text-[#868e96] hover:border-[#1e1e1e] hover:text-[#1e1e1e]"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setToDelete(d)}
                    aria-label="Delete"
                    className="rounded-md border-2 border-transparent p-1.5 text-[#868e96] hover:border-[#fa5252] hover:text-[#fa5252]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete drawing?"
        message={`"${toDelete?.title ?? ""}" will be permanently deleted from this browser.`}
        onConfirm={handleDelete}
        onClose={() => setToDelete(null)}
      />
    </Wrapper>
  );
}