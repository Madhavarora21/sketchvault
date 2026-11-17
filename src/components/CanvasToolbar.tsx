"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Cloud,
  Globe,
  HardDrive,
  History,
  Lock,
  LockOpen,
  Save,
} from "lucide-react";

type Props = {
  backHref: string;
  title: string;
  mode: "cloud" | "local" | "public";
  status?: "saved" | "saving" | "error";
  lastSavedAt?: Date | null;
  onSave?: () => void;
  locked?: boolean;
  onToggleLock?: () => void;
  live?: boolean;
  actions?: React.ReactNode;
};

const modeBadge = {
  cloud: {
    label: "Cloud · synced",
    Icon: Cloud,
    cls: "border-brand-soft bg-brand-light text-brand",
  },
  local: {
    label: "Local · saved in this browser",
    Icon: HardDrive,
    cls: "border-orange-300 bg-orange-50 text-orange-600",
  },
  public: {
    label: "Public · view only",
    Icon: Globe,
    cls: "border-brand-soft bg-brand-light text-brand",
  },
};

export default function CanvasToolbar({
  backHref,
  title,
  mode,
  status = "saved",
  lastSavedAt = null,
  onSave,
  locked = false,
  onToggleLock,
  live = false,
  actions,
}: Props) {
  const badge = modeBadge[mode];

  let statusText = "All changes saved";
  if (status === "saving") statusText = "Saving...";
  else if (status === "error") statusText = "Save failed";
  else if (lastSavedAt) {
    statusText = `Saved ${lastSavedAt.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    })}`;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-2">
      <div className="pointer-events-auto flex max-w-full items-center gap-3 overflow-x-auto rounded-xl border border-gray-200 bg-white px-3 py-2 font-virgil shadow-lg">
        <Link
          href={backHref}
          aria-label="Back"
          className="rounded-md p-1.5 text-[#868e96] hover:bg-[#f1f3f5] hover:text-[#1e1e1e]"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <span className="h-6 w-px bg-gray-200" />

        <span className="max-w-[160px] truncate text-sm font-bold text-[#1e1e1e]">
          {title}
        </span>

        {onSave && (
          <>
            <span className="h-6 w-px bg-gray-200" />
            <button
              onClick={onSave}
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-bold text-brand hover:bg-brand-light"
            >
              <Save className="h-4 w-4" />
              Save
            </button>
          </>
        )}

        {mode !== "public" && (
          <span
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
              status === "error"
                ? "bg-red-100 text-red-600"
                : "bg-[#e5dbff] text-[#5f3dc4]"
            }`}
          >
            <History className="h-3.5 w-3.5" />
            {statusText}
          </span>
        )}

        {live && (
          <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-[#fa5252]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#fa5252]" />
            LIVE
          </span>
        )}

        <span
          className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${badge.cls}`}
        >
          <badge.Icon className="h-3.5 w-3.5" />
          {badge.label}
        </span>

        {onToggleLock && (
          <button
            onClick={onToggleLock}
            aria-label={locked ? "Unlock canvas" : "Lock canvas (view only)"}
            title={locked ? "Unlock canvas" : "Lock canvas (view only)"}
            className={`rounded-md p-2 ${
              locked
                ? "bg-brand-light text-brand"
                : "bg-[#f1f3f5] text-[#868e96] hover:text-[#1e1e1e]"
            }`}
          >
            {locked ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />}
          </button>
        )}

        {actions && (
          <>
            <span className="h-6 w-px bg-gray-200" />
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          </>
        )}
      </div>
    </div>
  );
}