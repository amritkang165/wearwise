import { Layers, Plus, Camera } from "lucide-react";
import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";
import { OutfitCard } from "@/components/outfits/OutfitCard";

export const metadata = {
  title: "Outfits — WearWise",
};

export default async function OutfitsPage() {
  const session = await requireSession();

  const outfits = await prisma.outfit.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          clothingItem: {
            select: { id: true, name: true, images: true, category: true },
          },
        },
      },
      logs: {
        select: { date: true },
        orderBy: { date: "desc" },
        take: 1,
      },
    },
    orderBy: [{ isFavorite: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="max-w-[960px] mx-auto px-4 py-10">
      <header className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[26px] font-semibold text-ink tracking-tight">
            Outfits
          </h1>
          <p
            className="mt-1.5 text-[12px] tracking-[0.04em] text-ash"
            style={{ fontFamily: "var(--font-label)" }}
          >
            SAVED COMBINATIONS
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/outfits/new/photo"
            className="flex items-center gap-1.5 border border-linen bg-paper text-ink text-[13px] font-medium px-4 h-9 rounded-[10px] hover:bg-canvas transition-colors"
          >
            <Camera className="w-4 h-4" strokeWidth={2} />
            From photo
          </Link>
          <Link
            href="/outfits/new"
            className="flex items-center gap-1.5 bg-rose text-paper text-[13px] font-medium px-4 h-9 rounded-[10px] hover:bg-crimson transition-colors"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            New outfit
          </Link>
        </div>
      </header>

      {outfits.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[10px] border border-dashed border-linen py-24">
          <Layers className="w-10 h-10 text-dust/40" strokeWidth={1.25} />
          <p className="mt-4 text-[15px] font-semibold text-ink/30">
            No outfits yet
          </p>
          <p className="mt-1 text-[13px] text-ash/60">
            Combine items from your wardrobe into outfits.
          </p>
          <Link
            href="/outfits/new"
            className="mt-5 inline-flex items-center gap-1.5 bg-rose text-paper text-[13px] font-medium px-4 h-9 rounded-[10px] hover:bg-crimson transition-colors"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2} />
            Create your first outfit
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {outfits.map((outfit) => {
            const lastWorn = outfit.logs[0]?.date ?? null;
            const previewImages = outfit.items.slice(0, 4).map((oi) =>
              oi.clothingItem.images.length > 0 ? oi.clothingItem.images[0] : ""
            );
            return (
              <OutfitCard
                key={outfit.id}
                id={outfit.id}
                name={outfit.name}
                occasion={outfit.occasion}
                isFavorite={outfit.isFavorite}
                itemCount={outfit.items.length}
                images={previewImages}
                lastWorn={lastWorn}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
