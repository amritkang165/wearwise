import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";
import { OutfitBuilder } from "@/components/outfits/OutfitBuilder";

export const metadata = {
  title: "Create Outfit — WearWise",
};

export default async function NewOutfitPage() {
  const session = await requireSession();

  const items = await prisma.clothingItem.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      name: true,
      category: true,
      subcategory: true,
      brand: true,
      colors: true,
      seasons: true,
      occasions: true,
      images: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-[768px] mx-auto px-4 py-10">
      <Link
        href="/outfits"
        className="inline-flex items-center gap-1.5 text-[13px] text-ash hover:text-ink transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
        Back to outfits
      </Link>

      <header className="mb-8">
        <h1 className="text-[26px] font-semibold text-ink tracking-tight">
          Create Outfit
        </h1>
        <p
          className="mt-1.5 text-[12px] tracking-[0.04em] text-ash"
          style={{ fontFamily: "var(--font-label)" }}
        >
          COMBINE ITEMS INTO A LOOK
        </p>
      </header>

      <OutfitBuilder items={items} />
    </div>
  );
}
