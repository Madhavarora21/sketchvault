"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
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
  const [saved, setSaved] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<string | null>(null);

  const state = useMemo<State>(() => {
    if (!mounted) return { status: "loading" };
    const d = getLocalDrawing(id);
    return d
      ? { status: "ready", title: d.title, elements: parseElements(d.data) }
      : { status: "missing" };
  }, [mounted, id]);

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
    <>
      <header className="flex h-[65px] items-center justify-between gap-4 border-b border-gray-200 px-6">
        <div className="flex min-w-0 items-center gap-4">
          <Link href="/local" className="text-sm hover:underline">
            ← Local Boards
          </Link>
          <h1 className="truncate font-semibold">{state.title}</h1>
        </div>
        <span className="shrink-0 text-xs text-gray-500">
          {saved ? "Saved in this browser" : "Saving..."}
        </span>
      </header>

      <div className="h-[calc(100vh-65px)] w-full">
        <Excalidraw
          initialData={{
            elements: state.elements as never,
            appState: { viewBackgroundColor: "#ffffff" },
            scrollToContent: true,
          }}
          onChange={(elements) => {
            const json = JSON.stringify(elements.filter((e) => !e.isDeleted));
            pending.current = json;
            setSaved(false);
            if (timer.current) clearTimeout(timer.current);
            timer.current = setTimeout(() => {
              if (pending.current === null) return;
              saveLocalDrawing(id, pending.current);
              pending.current = null;
              setSaved(true);
            }, 600);
          }}
        />
      </div>
    </>
  );
}