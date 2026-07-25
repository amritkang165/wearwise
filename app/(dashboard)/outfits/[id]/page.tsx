import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Pencil,
  Star,
  Shirt,
  CalendarCheck,
} from "lucide-react";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";
import { OutfitActions } from "./outfit-actions";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireSession();
  const outfit = await prisma.outfit.findFirst({
    where: { id, userId: session.user.id },
  });
  return { title: outfit ? `${outfit.name} — WearWise` : "Outfit — WearWise" };
}

export default async function OutfitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireSession();

  const outfit = await prisma.outfit.findFirst({
    where: { id, userId: session.user.id },
    include: {
      items: {
        include: {
          clothingItem: true,
        },
      },
      logs: {
        select: { date: true },
        orderBy: { date: "desc" },
      },
    },
  });

  if (!outfit) notFound();

  const totalWears = outfit.logs.length;
  const lastWorn = outfit.logs[0]?.date;

  return (
    <div className="max-w-[768px] mx-auto px-4 py-10">
      <Link
        href="/outfits"
        className="inline-flex items-center gap-1.5 text-[13px] text-ash hover:text-ink transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
        Back to outfits
      </Link>

      <header className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[26px] font-semibold text-ink tracking-tight">
              {outfit.name}
            </h1>
            {outfit.isFavorite && (
              <Star className="w-5 h-5 text-rose fill-rose" />
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <p
              className="text-[12px] tracking-[0.04em] text-ash"
              style={{ fontFamily: "var(--font-label)" }}
            >
              {outfit.items.length} ITEM{outfit.items.length !== 1 ? "S" : ""}
            </p>
            {outfit.occasion && (
              <>
                <span className="text-dust">·</span>
                <p
                  className="text-[12px] tracking-[0.04em] text-ash"
                  style={{ fontFamily: "var(--font-label)" }}
                >
                  {outfit.occasion.toUpperCase()}
                </p>
              </>
            )}
          </div>
        </div>
        <OutfitActions outfitId={outfit.id} isFavorite={outfit.isFavorite} />
      </header>

      {/* Items grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {outfit.items.map((oi) => (
          <Link
            key={oi.id}
            href={`/wardrobe/${oi.clothingItem.id}`}
            className="group rounded-xl border border-linen bg-paper overflow-hidden hover:shadow-sm transition-all"
          >
            <div className="aspect-square bg-canvas">
              {oi.clothingItem.images.length > 0 ? (
                <img
                  src={oi.clothingItem.images[0]}
                  alt={oi.clothingItem.name}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Shirt className="w-8 h-8 text-dust/30" strokeWidth={1} />
                </div>
              )}
            </div>
            <div className="p-2.5">
              <p className="text-[13px] font-medium text-ink truncate">
                {oi.clothingItem.name}
              </p>
              <p
                className="text-[10px] tracking-[0.08em] text-ash mt-0.5"
                style={{ fontFamily: "var(--font-label)" }}
              >
                {oi.clothingItem.category}
                {oi.clothingItem.brand && ` · ${oi.clothingItem.brand}`}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="rounded-xl border border-linen bg-paper p-4">
          <div className="flex items-center gap-2 mb-1">
            <CalendarCheck className="w-4 h-4 text-dust" strokeWidth={1.75} />
            <p
              className="text-[10px] tracking-[0.14em] uppercase text-ash"
              style={{ fontFamily: "var(--font-label)" }}
            >
              Times worn
            </p>
          </div>
          <p className="text-[22px] font-semibold text-ink">{totalWears}</p>
        </div>
        <div className="rounded-xl border border-linen bg-paper p-4">
          <div className="flex items-center gap-2 mb-1">
            <CalendarCheck className="w-4 h-4 text-dust" strokeWidth={1.75} />
            <p
              className="text-[10px] tracking-[0.14em] uppercase text-ash"
              style={{ fontFamily: "var(--font-label)" }}
            >
              Last worn
            </p>
          </div>
          <p className="text-[22px] font-semibold text-ink">
            {lastWorn
              ? new Date(lastWorn).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : "Never"}
          </p>
        </div>
      </div>

      {/* Notes */}
      {outfit.notes && (
        <div className="mb-8">
          <p
            className="text-[10px] tracking-[0.14em] uppercase text-ash mb-1"
            style={{ fontFamily: "var(--font-label)" }}
          >
            Notes
          </p>
          <p className="text-[14px] text-ink leading-relaxed">{outfit.notes}</p>
        </div>
      )}

      {/* Wear history */}
      {outfit.logs.length > 0 && (
        <div>
          <p
            className="text-[10px] tracking-[0.14em] uppercase text-ash mb-3"
            style={{ fontFamily: "var(--font-label)" }}
          >
            WEAR HISTORY
          </p>
          <div className="space-y-2">
            {outfit.logs.slice(0, 10).map((log) => (
              <div
                key={log.date.toISOString()}
                className="flex items-center gap-3 py-2 border-b border-linen last:border-0"
              >
                <div className="w-2 h-2 rounded-full bg-rose" />
                <p className="text-[13px] text-ink">
                  {new Date(log.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
