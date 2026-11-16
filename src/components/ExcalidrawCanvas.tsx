"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { getPublicDrawingState, saveDrawing } from "@/actions/drawing";
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
  initialData: string;
  readOnly?: boolean;
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
  initialData,
  readOnly = false,
  liveShareId,
  liveSince,
}: Props) {
  const [status, setStatus] = useState<"saved" | "saving" | "error">("saved");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<string | null>(null);
  const lastSaved = useRef(initialData);
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null);

  async function flush() {
    if (!id || pending.current === null) return;
    const json = pending.current;
    pending.current = null;
    try {
      await saveDrawing(id, json);
      lastSaved.current = json;
      setStatus("saved");
    } catch {
      setStatus("error");
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
    <div className="relative h-[calc(100vh-var(--navbar-height,56px)-65px)] w-full">
      {!readOnly && (
        <span className="absolute right-4 top-3 z-10 rounded bg-white/90 px-2 py-1 text-xs text-gray-600 shadow">
          {status === "saving" && "Saving..."}
          {status === "saved" && "Saved"}
          {status === "error" && "Save failed"}
        </span>
      )}

      {liveShareId && (
        <span className="absolute right-4 top-3 z-10 flex items-center gap-1.5 rounded bg-white/90 px-2 py-1 text-xs font-semibold text-[#fa5252] shadow">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#fa5252]" />
          LIVE
        </span>
      )}

      <Excalidraw
        excalidrawAPI={(api) => {
          apiRef.current = api;
        }}
        viewModeEnabled={readOnly}
        initialData={{
          elements: parseElements(initialData),
          appState: { viewBackgroundColor: "#ffffff" },
          scrollToContent: true,
        }}
        onChange={(elements) => {
          if (readOnly || !id) return;
          const json = JSON.stringify(elements.filter((e) => !e.isDeleted));
          if (json === lastSaved.current) return;

          pending.current = json;
          setStatus("saving");
          if (timer.current) clearTimeout(timer.current);
          timer.current = setTimeout(flush, 1000);
        }}
      />
    </div>
  );
}