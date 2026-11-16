"use client";

import Modal from "@/components/Modal";

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  pending?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  pending = false,
  onConfirm,
  onClose,
}: Props) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="font-sans text-sm text-[#495057]">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="rounded-md border-2 border-[#e9ecef] px-4 py-2 text-sm font-semibold hover:bg-[#f8f9fa]"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={pending}
          className="rounded-md bg-[#fa5252] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e03131] disabled:opacity-60"
        >
          {pending ? "Please wait..." : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}