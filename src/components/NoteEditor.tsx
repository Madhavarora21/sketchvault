"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Markdown from "@/components/Markdown";
import NoteShare from "@/components/NoteShare";
import { saveNote } from "@/actions/note";

type Props = {
  id: string;
  initialTitle: string;
  initialContent: string;
  isPublic: boolean;
  shareId: string | null;
};

export default function NoteEditor({
  id,
  initialTitle,
  initialContent,
  isPublic,
  shareId,
}: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [status, setStatus] = useState<"saved" | "saving" | "error">("saved");
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<{ title: string; content: string } | null>(null);

  async function flush() {
    if (!pending.current) return;
    const { title: t, content: c } = pending.current;
    pending.current = null;
    try {
      await saveNote(id, t, c);
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  function schedule(nextTitle: string, nextContent: string) {
    pending.current = { title: nextTitle, content: nextContent };
    setStatus("saving");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(flush, 800);
  }

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
      if (pending.current) saveNote(id, pending.current.title, pending.current.content);
    };
  }, [id]);

  const tabClass = (active: boolean) =>
    `flex-1 border-b-2 px-4 py-2 font-virgil text-sm font-bold md:hidden ${
      active ? "border-brand text-brand" : "border-transparent text-[#868e96]"
    }`;

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between gap-4 border-b border-gray-200 px-4 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <Link
            href="/dashboard?tab=notes"
            className="flex shrink-0 items-center gap-1.5 font-virgil text-sm hover:text-brand"
          >
            <ArrowLeft className="h-4 w-4" />
            Notes
          </Link>
          <input
            value={title}
            maxLength={120}
            placeholder="Untitled note"
            onChange={(e) => {
              setTitle(e.target.value);
              schedule(e.target.value, content);
            }}
            className="min-w-0 flex-1 bg-transparent font-virgil text-lg font-bold outline-none"
          />
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden text-xs text-gray-500 sm:inline">
            {status === "saving" && "Saving..."}
            {status === "saved" && "Saved"}
            {status === "error" && "Save failed"}
          </span>
          <NoteShare id={id} isPublic={isPublic} shareId={shareId} />
        </div>
      </header>

      <div className="flex border-b border-gray-200 md:hidden">
        <button className={tabClass(tab === "edit")} onClick={() => setTab("edit")}>
          Write
        </button>
        <button className={tabClass(tab === "preview")} onClick={() => setTab("preview")}>
          Preview
        </button>
      </div>

      <div className="grid flex-1 md:grid-cols-2">
        <textarea
          value={content}
          placeholder="Write in Markdown... # Heading, **bold**, - list, [link](https://...)"
          onChange={(e) => {
            setContent(e.target.value);
            schedule(title, e.target.value);
          }}
          className={`min-h-[60vh] w-full resize-none border-gray-200 p-5 font-mono text-sm outline-none md:border-r ${
            tab === "edit" ? "block" : "hidden md:block"
          }`}
        />
        <div
          className={`min-h-[60vh] overflow-auto bg-[#fcfcfd] p-5 ${
            tab === "preview" ? "block" : "hidden md:block"
          }`}
        >
          {content.trim() ? (
            <Markdown>{content}</Markdown>
          ) : (
            <p className="font-virgil text-[#868e96]">Your preview will appear here.</p>
          )}
        </div>
      </div>
    </div>
  );
}