"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Shirt, Layers, Camera } from "lucide-react";
import Link from "next/link";

export function QuickAddButton() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 bg-rose text-paper text-[13px] font-medium px-4 h-9 rounded-[10px] hover:bg-crimson transition-colors"
      >
        <Plus className="w-4 h-4" strokeWidth={2} />
        Quick add
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-52 bg-paper border border-linen rounded-[10px] shadow-[0_4px_16px_rgba(44,7,3,0.08)] overflow-hidden z-20">
          <Link
            href="/wardrobe/new"
            className="flex items-center gap-2.5 px-4 py-3 text-[13.5px] text-ink hover:bg-canvas transition-colors"
          >
            <Shirt className="w-4 h-4 text-dust" strokeWidth={1.75} />
            Add an item
          </Link>
          <div className="h-px bg-seam mx-4" />
          <Link
            href="/outfits/new"
            className="flex items-center gap-2.5 px-4 py-3 text-[13.5px] text-ink hover:bg-canvas transition-colors"
          >
            <Layers className="w-4 h-4 text-dust" strokeWidth={1.75} />
            Create an outfit
          </Link>
          <div className="h-px bg-seam mx-4" />
          <Link
            href="/outfits/new/photo"
            className="flex items-center gap-2.5 px-4 py-3 text-[13.5px] text-ink hover:bg-canvas transition-colors"
          >
            <Camera className="w-4 h-4 text-dust" strokeWidth={1.75} />
            Outfit from photo
          </Link>
        </div>
      )}
    </div>
  );
}
