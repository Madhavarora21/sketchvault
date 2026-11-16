"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { createDrawing } from "@/actions/drawing";

export default function NewDrawingButton({
  folderId = null,
}: {
  folderId?: string | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      try {
        const id = await createDrawing(folderId);
        router.push(`/draw/${id}`);
      } catch {
        toast.error("Could not create the drawing");
      }
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="flex items-center gap-2 bg-brand px-5 py-2.5 font-virgil text-sm font-bold text-white shadow-md transition-all hover:bg-brand-dark disabled:opacity-60"
      style={{ borderRadius: "12px 4px 10px 4px / 4px 10px 4px 12px" }}
    >
      <Plus className="h-4 w-4" />
      {pending ? "Creating..." : "New Drawing"}
    </button>
  );
}