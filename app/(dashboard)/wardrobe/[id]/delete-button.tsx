"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteClothingItem } from "@/actions/wardrobe";

export function DeleteButton({ id, name }: { id: string; name: string }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, setIsPending] = useState(false);

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-[13px] text-ash">Delete {name}?</span>
        <button
          onClick={async () => {
            setIsPending(true);
            await deleteClothingItem(id);
          }}
          disabled={isPending}
          className="h-9 px-4 rounded-lg bg-crimson text-paper text-[13px] font-medium hover:bg-crimson/80 disabled:opacity-50 transition-colors"
        >
          {isPending ? "Deleting..." : "Yes, delete"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="h-9 px-4 rounded-lg border border-linen text-ink text-[13px] font-medium hover:bg-canvas transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg border border-linen text-[13px] font-medium text-crimson hover:bg-crimson/5 hover:border-crimson/30 transition-colors"
    >
      <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
      Delete
    </button>
  );
}
