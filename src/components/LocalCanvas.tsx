"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import CanvasToolbar from "@/components/CanvasToolbar";
import { getLocalDrawing, saveLocalDrawing } from "@/lib/localDrawings";
import { useMounted } from "@/lib/useMounted";
import "@excalidraw/excalidraw/index.css";

const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  {
    ssr: false,
    loading: () => <p className="p-6">Loading canvas...</p>,
  }
);

type State =
  | { status: "loading" }
  | { status: "missing" }
  | { status: "ready"; title: string; elements: unknown[] };

function parseElements(data: string): unknown[] {
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function LocalCanvas({ id }: { id: string }) {
  const mounted = useMounted();
  const [status, setStatus] = useState<"saved" | "saving">("saved");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [locked, setLocked] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<string | null>(null);
  const latest = useRef<string | null>(null);

  const state = useMemo<State>(() => {
    if (!mounted) return { status: "loading" };
    const d = getLocalDrawing(id);
    return d
      ? { status: "ready", title: d.title, elements: parseElements(d.data) }
      : { status: "missing" };
  }, [mounted, id]);

  function writePending() {
    if (pending.current === null) return;
    saveLocalDrawing(id, pending.current);
    pending.current = null;
    setLastSavedAt(new Date());
    setStatus("saved");
  }

  function manualSave() {
    if (timer.current) clearTimeout(timer.current);
    if (latest.current !== null) {
      pending.current = latest.current;
      writePending();
      toast.success("Drawing saved in this browser");
    } else {
      setLastSavedAt(new Date());
      toast("Already up to date");
    }
  }

  // page chhodte waqt bacha hua kaam save kar do
  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
      if (pending.current !== null) saveLocalDrawing(id, pending.current);
    };
  }, [id]);

  if (state.status === "loading") {
    return <p className="p-6">Loading...</p>;
  }

  if (state.status === "missing") {
    return (
      <main className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="text-2xl font-bold">Drawing not found</h1>
        <p className="mt-2 text-gray-600">
          This drawing is not in this browser (it may have been deleted, or it was created in a different browser).
        </p>
        <Link
          href="/local"
          className="mt-6 inline-block rounded-md bg-indigo-600 px-5 py-2.5 text-white hover:bg-indigo-700"
        >
          Local Boards
        </Link>
      </main>
    );
  }

  return (
    <div className="relative h-[calc(100vh-var(--navbar-height,56px))] w-full">
      <Excalidraw
        viewModeEnabled={locked}
        initialData={{
          elements: state.elements as never,
          appState: { viewBackgroundColor: "#ffffff" },
          scrollToContent: true,
        }}
        onChange={(elements) => {
          const json = JSON.stringify(elements.filter((e) => !e.isDeleted));
          latest.current = json;
          pending.current = json;
          setStatus("saving");
          if (timer.current) clearTimeout(timer.current);
          timer.current = setTimeout(writePending, 600);
        }}
      />

      <CanvasToolbar
        backHref="/local"
        title={state.title}
        mode="local"
        status={status}
        lastSavedAt={lastSavedAt}
        onSave={manualSave}
        locked={locked}
        onToggleLock={() => setLocked((v) => !v)}
      />
    </div>
  );
}