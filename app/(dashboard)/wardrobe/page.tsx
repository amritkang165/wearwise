import { Shirt, Plus } from "lucide-react";
import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";
import { WardrobeClient } from "./client";

export const metadata = {
  title: "Wardrobe — WearWise",
};

export default async function WardrobePage() {
  const session = await requireSession();

  const items = await prisma.clothingItem.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-[960px] mx-auto px-4 py-10">
      <header className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[26px] font-semibold text-ink tracking-tight">
            Wardrobe
          </h1>
          <p
            className="mt-1.5 text-[12px] tracking-[0.04em] text-ash"
            style={{ fontFamily: "var(--font-label)" }}
          >
            YOUR CLOTHING COLLECTION
          </p>
        </div>
        <Link
          href="/wardrobe/new"
          className="flex items-center gap-1.5 bg-rose text-paper text-[13px] font-medium px-4 h-9 rounded-[10px] hover:bg-crimson transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={2} />
          Add item
        </Link>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[10px] border border-dashed border-linen py-24">
          <Shirt className="w-10 h-10 text-dust/40" strokeWidth={1.25} />
          <p className="mt-4 text-[15px] font-semibold text-ink/30">
            Your wardrobe is empty
          </p>
          <p className="mt-1 text-[13px] text-ash/60">
            Upload photos of your clothing to get started.
          </p>
          <Link
            href="/wardrobe/new"
            className="mt-5 inline-flex items-center gap-1.5 bg-rose text-paper text-[13px] font-medium px-4 h-9 rounded-[10px] hover:bg-crimson transition-colors"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2} />
            Add your first item
          </Link>
        </div>
      ) : (
        <WardrobeClient items={items} />
      )}
    </div>
  );
}
