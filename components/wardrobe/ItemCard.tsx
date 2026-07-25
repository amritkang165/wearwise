"use client";

import Link from "next/link";
import { Shirt, Plus } from "lucide-react";
import { logWear } from "@/actions/wear-log";
import { useState } from "react";

interface ItemCardProps {
  id: string;
  name: string;
  category: string;
  subcategory: string | null;
  brand: string | null;
  images: string[];
  wearCount: number;
}

export function ItemCard({
  id,
  name,
  category,
  subcategory,
  brand,
  images,
  wearCount,
}: ItemCardProps) {
  const [logged, setLogged] = useState(false);
  const displayCategory =
    category.charAt(0).toUpperCase() + category.slice(1);

  const handleLogWear = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await logWear(id);
    setLogged(true);
  };

  return (
    <div className="group relative rounded-xl border border-linen bg-paper overflow-hidden hover:shadow-sm transition-all">
      <Link href={`/wardrobe/${id}`} className="block">
        <div className="aspect-square bg-canvas relative overflow-hidden">
          {images.length > 0 ? (
            <img
              src={images[0]}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Shirt className="w-10 h-10 text-dust/40" strokeWidth={1.25} />
            </div>
          )}
          {wearCount > 0 && (
            <span
              className="absolute top-2 right-2 text-[9px] tracking-[0.1em] bg-ink/60 text-paper px-1.5 py-0.5 rounded"
              style={{ fontFamily: "var(--font-label)" }}
            >
              {logged ? wearCount + 1 : wearCount}x
            </span>
          )}
        </div>
      </Link>

      <div className="p-3 flex items-start justify-between gap-2">
        <Link href={`/wardrobe/${id}`} className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-ink truncate">{name}</p>
          <p
            className="text-[10px] tracking-[0.08em] text-ash mt-0.5"
            style={{ fontFamily: "var(--font-label)" }}
          >
            {subcategory || displayCategory}
            {brand && ` · ${brand}`}
          </p>
        </Link>
        <button
          onClick={handleLogWear}
          disabled={logged}
          title={logged ? "Wear logged!" : "Log as worn today"}
          className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
            logged
              ? "bg-rose/10 text-rose"
              : "bg-canvas border border-linen text-ash hover:bg-rose hover:text-paper hover:border-rose"
          }`}
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
