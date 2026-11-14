"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { saveDrawing } from "@/actions/drawing";
import "@excalidraw/excalidraw/index.css";

const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  {
    ssr: false,
    loading: () => <p className="p-6">Canvas load ho raha hai...</p>,
  }
);

type Props = {
  id?: string;
  initialData: string;
  readOnly?: boolean;
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
}: Props) {
  const [status, setStatus] = useState<"saved" | "saving" | "error">("saved");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<string | null>(null);
  const lastSaved = useRef(initialData);

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

  return (
    <div className="relative h-[calc(100vh-65px)] w-full">
      {!readOnly && (
        <span className="absolute right-4 top-3 z-10 rounded bg-white/90 px-2 py-1 text-xs text-gray-600 shadow">
          {status === "saving" && "Saving..."}
          {status === "saved" && "Saved"}
          {status === "error" && "Save failed"}
        </span>
      )}

      <Excalidraw
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