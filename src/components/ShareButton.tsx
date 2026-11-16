"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import ShareDialog from "@/components/ShareDialog";

type Props = { id: string; isPublic: boolean; shareId: string | null };

export default function ShareButton(props: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-brand px-4 py-2 font-virgil text-sm font-medium text-white shadow-sm hover:bg-brand-dark"
        style={{ borderRadius: "8px 2px 8px 3px / 3px 8px 3px 8px" }}
      >
        <Share2 className="h-4 w-4" />
        Share
      </button>
      <ShareDialog open={open} onClose={() => setOpen(false)} {...props} />
    </>
  );
}