"use client";

import { useState } from "react";
import { Star, Shirt, CalendarCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { logOutfitWear } from "@/actions/outfit";

interface OutfitCardProps {
  id: string;
  name: string;
  occasion: string | null;
  isFavorite: boolean;
  itemCount: number;
  images: string[];
  lastWorn: Date | null;
}

export function OutfitCard({
  id,
  name,
  occasion,
  isFavorite,
  itemCount,
  images,
  lastWorn,
}: OutfitCardProps) {
  const [isLogging, setIsLogging] = useState(false);
  const [logged, setLogged] = useState(false);

  const handleLogWear = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLogging || logged) return;
    setIsLogging(true);
    await logOutfitWear(id);
    setLogged(true);
    setIsLogging(false);
  };

  return (
    <Link
      href={`/outfits/${id}`}
      className="group block rounded-xl border border-linen bg-paper overflow-hidden hover:shadow-sm transition-all"
    >
      {/* Item grid preview */}
      <div className="grid grid-cols-2 gap-px bg-linen">
        {images.slice(0, 4).map((img, i) => (
          <div key={i} className="aspect-square bg-canvas relative">
            {img ? (
              <img
                src={img}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Shirt className="w-6 h-6 text-dust/30" strokeWidth={1} />
              </div>
            )}
          </div>
        ))}
        {images.length < 4 &&
          Array.from({ length: Math.min(4 - images.length, 4) }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="aspect-square bg-canvas flex items-center justify-center"
            >
              <span className="text-dust/20 text-lg">+</span>
            </div>
          ))}
      </div>

      <div className="p-3">
        <div className="flex items-center gap-2">
          <h3 className="text-[14px] font-medium text-ink truncate flex-1">
            {name}
          </h3>
          {isFavorite && (
            <Star className="w-3.5 h-3.5 text-rose fill-rose shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <p
            className="text-[10px] tracking-[0.08em] text-ash"
            style={{ fontFamily: "var(--font-label)" }}
          >
            {itemCount} item{itemCount !== 1 ? "s" : ""}
          </p>
          {occasion && (
            <>
              <span className="text-dust">·</span>
              <p
                className="text-[10px] tracking-[0.08em] text-ash"
                style={{ fontFamily: "var(--font-label)" }}
              >
                {occasion}
              </p>
            </>
          )}
          {lastWorn && !logged && (
            <>
              <span className="text-dust">·</span>
              <p
                className="text-[10px] tracking-[0.08em] text-ash"
                style={{ fontFamily: "var(--font-label)" }}
              >
                Worn {new Date(lastWorn).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </p>
            </>
          )}
          {logged && (
            <>
              <span className="text-dust">·</span>
              <p
                className="text-[10px] tracking-[0.08em] text-rose"
                style={{ fontFamily: "var(--font-label)" }}
              >
                Logged today!
              </p>
            </>
          )}
        </div>

        {/* Quick log wear button */}
        <button
          onClick={handleLogWear}
          disabled={isLogging || logged}
          className={`mt-2.5 w-full h-8 rounded-lg text-[12px] font-medium flex items-center justify-center gap-1.5 transition-all ${
            logged
              ? "bg-rose/10 text-rose border border-rose/20"
              : "bg-canvas border border-linen text-ash hover:text-rose hover:border-rose/30 hover:bg-rose/5"
          } disabled:opacity-50`}
        >
          {isLogging ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <CalendarCheck className="w-3 h-3" strokeWidth={2} />
          )}
          {logged ? "Logged today" : "Log wear"}
        </button>
      </div>
    </Link>
  );
}
