"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { deleteDrawing, renameDrawing, togglePublic } from "@/actions/drawing";

type Props = {
  id: string;
  title: string;
  isPublic: boolean;
  dateLabel: string;
};

export default function DrawingCard({ id, title, isPublic, dateLabel }: Props) {
  const [pending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  function handleRename() {
    const name = window.prompt("Naya naam likho", title);
    if (!name) return;
    startTransition(() => renameDrawing(id, name));
  }

  function handleDelete() {
    if (!window.confirm(`"${title}" delete kar du?`)) return;
    startTransition(() => deleteDrawing(id));
  }

  function handleShare() {
    startTransition(() => togglePublic(id));
  }

  async function copyLink() {
    await navigator.clipboard.writeText(`${window.location.origin}/s/${id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div
      className={`rounded-lg border border-gray-200 p-4 shadow-sm ${
        pending ? "opacity-60" : ""
      }`}
    >
      <Link href={`/draw/${id}`} className="block">
        <h3 className="truncate text-lg font-semibold hover:underline">
          {title}
        </h3>
      </Link>
      <p className="mt-1 text-xs text-gray-500">
        {isPublic ? "Public" : "Private"} · {dateLabel}
      </p>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <button
          onClick={handleRename}
          className="rounded border border-gray-300 px-2 py-1 hover:bg-gray-50"
        >
          Rename
        </button>
        <button
          onClick={handleShare}
          className="rounded border border-gray-300 px-2 py-1 hover:bg-gray-50"
        >
          {isPublic ? "Make private" : "Make public"}
        </button>
        {isPublic && (
          <button
            onClick={copyLink}
            className="rounded border border-indigo-300 px-2 py-1 text-indigo-700 hover:bg-indigo-50"
          >
            {copied ? "Copied!" : "Copy link"}
          </button>
        )}
        <button
          onClick={handleDelete}
          className="rounded border border-red-300 px-2 py-1 text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}