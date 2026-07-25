import { Layers, Plus, Star, Shirt } from "lucide-react";
import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";

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
        <Link
          href="/outfits/new"
          className="flex items-center gap-1.5 bg-rose text-paper text-[13px] font-medium px-4 h-9 rounded-[10px] hover:bg-crimson transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={2} />
          New outfit
        </Link>
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
            const lastWorn = outfit.logs[0]?.date;
            return (
              <Link
                key={outfit.id}
                href={`/outfits/${outfit.id}`}
                className="group block rounded-xl border border-linen bg-paper overflow-hidden hover:shadow-sm transition-all"
              >
                {/* Item grid preview */}
                <div className="grid grid-cols-2 gap-px bg-linen">
                  {outfit.items.slice(0, 4).map((oi) => (
                    <div key={oi.id} className="aspect-square bg-canvas relative">
                      {oi.clothingItem.images.length > 0 ? (
                        <img
                          src={oi.clothingItem.images[0]}
                          alt={oi.clothingItem.name}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Shirt className="w-6 h-6 text-dust/30" strokeWidth={1} />
                        </div>
                      )}
                    </div>
                  ))}
                  {/* Fill empty slots */}
                  {outfit.items.length < 4 &&
                    Array.from({ length: Math.min(4 - outfit.items.length, 4) }).map(
                      (_, i) => (
                        <div
                          key={`empty-${i}`}
                          className="aspect-square bg-canvas flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4 text-dust/20" />
                        </div>
                      )
                    )}
                </div>

                <div className="p-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-medium text-ink truncate flex-1">
                      {outfit.name}
                    </h3>
                    {outfit.isFavorite && (
                      <Star className="w-3.5 h-3.5 text-rose fill-rose shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <p
                      className="text-[10px] tracking-[0.08em] text-ash"
                      style={{ fontFamily: "var(--font-label)" }}
                    >
                      {outfit.items.length} item{outfit.items.length !== 1 ? "s" : ""}
                    </p>
                    {outfit.occasion && (
                      <>
                        <span className="text-dust">·</span>
                        <p
                          className="text-[10px] tracking-[0.08em] text-ash"
                          style={{ fontFamily: "var(--font-label)" }}
                        >
                          {outfit.occasion}
                        </p>
                      </>
                    )}
                    {lastWorn && (
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
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
