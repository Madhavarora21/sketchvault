"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createDrawing } from "@/actions/drawing";

export default function NewDrawingButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const id = await createDrawing();
      router.push(`/draw/${id}`);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-60"
    >
      {pending ? "Ban rahi hai..." : "+ New Drawing"}
    </button>
  );
}