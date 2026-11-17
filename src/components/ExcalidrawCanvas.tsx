"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { getPublicDrawingState, saveDrawing } from "@/actions/drawing";
import CanvasToolbar from "@/components/CanvasToolbar";
import "@excalidraw/excalidraw/index.css";

const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  {
    ssr: false,
    loading: () => <p className="p-6">Loading canvas...</p>,
  }
);

type Props = {
  id?: string;
  title: string;
  backHref: string;
  initialData: string;
  mode: "cloud" | "public";
  actions?: React.ReactNode;
  // Live view: public page par ye do props do
  liveShareId?: string;
  liveSince?: string;
};

function parseElements(data: string) {
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function ExcalidrawCanvas({
  id,
  title,
  backHref,
  initialData,
  mode,
  actions,
  liveShareId,
  liveSince,
}: Props) {
  const readOnly = mode === "public";
  const [status, setStatus] = useState<"saved" | "saving" | "error">("saved");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [locked, setLocked] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<string | null>(null);
  const latest = useRef<string | null>(null);
  const lastSaved = useRef(initialData);
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null);

  async function flush() {
    if (!id || pending.current === null) return;
    const json = pending.current;
    pending.current = null;
    try {
      await saveDrawing(id, json);
      lastSaved.current = json;
      setLastSavedAt(new Date());
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  async function manualSave() {
    if (timer.current) clearTimeout(timer.current);
    if (latest.current !== null && latest.current !== lastSaved.current) {
      pending.current = latest.current;
      setStatus("saving");
      await flush();
      toast.success("Drawing saved");
    } else {
      setLastSavedAt(new Date());
      toast("Already up to date");
    }
  }

  // page chhodte waqt bacha hua kaam save kar do
  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
      if (id && pending.current !== null) {
        saveDrawing(id, pending.current);
      }
    };
  }, [id]);

  // Live view: har 3 second me check karo ki owner ne kuch badla ya nahi
  useEffect(() => {
    if (!liveShareId || !liveSince) return;
    let since = liveSince;

    const poll = setInterval(async () => {
      if (document.hidden) return;
      try {
        const res = await getPublicDrawingState(liveShareId, since);
        if (res.changed) {
          since = res.updatedAt;
          apiRef.current?.updateScene({
            elements: parseElements(res.data) as never,
          });
        }
      } catch {
        // network problem: agle round me dobara try hoga
      }
    }, 3000);

    return () => clearInterval(poll);
  }, [liveShareId, liveSince]);

  return (
    <div className="relative h-[calc(100vh-var(--navbar-height,56px))] w-full">
      <Excalidraw
        excalidrawAPI={(api) => {
          apiRef.current = api;
        }}
        viewModeEnabled={readOnly || locked}
        initialData={{
          elements: parseElements(initialData),
          appState: { viewBackgroundColor: "#ffffff" },
          scrollToContent: true,
        }}
        onChange={(elements) => {
          if (readOnly || !id) return;
          const json = JSON.stringify(elements.filter((e) => !e.isDeleted));
          latest.current = json;
          if (json === lastSaved.current) return;

          pending.current = json;
          setStatus("saving");
          if (timer.current) clearTimeout(timer.current);
          timer.current = setTimeout(flush, 1000);
        }}
      />

      <CanvasToolbar
        backHref={backHref}
        title={title}
        mode={mode}
        status={status}
        lastSavedAt={lastSavedAt}
        onSave={readOnly ? undefined : manualSave}
        locked={locked}
        onToggleLock={readOnly ? undefined : () => setLocked((v) => !v)}
        live={Boolean(liveShareId)}
        actions={actions}
      />
    </div>
  );
}