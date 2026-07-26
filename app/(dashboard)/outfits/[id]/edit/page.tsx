import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";
import { OutfitBuilder } from "@/components/outfits/OutfitBuilder";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireSession();
  const outfit = await prisma.outfit.findFirst({
    where: { id, userId: session.user.id },
  });
  return { title: outfit ? `Edit ${outfit.name} — WearWise` : "Edit Outfit — WearWise" };
}

export default async function EditOutfitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireSession();

  const outfit = await prisma.outfit.findFirst({
    where: { id, userId: session.user.id },
    include: {
      items: {
        select: { clothingItemId: true },
      },
    },
  });

  if (!outfit) notFound();

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
        href={`/outfits/${outfit.id}`}
        className="inline-flex items-center gap-1.5 text-[13px] text-ash hover:text-ink transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
        Back to outfit
      </Link>

      <header className="mb-8">
        <h1 className="text-[26px] font-semibold text-ink tracking-tight">
          Edit Outfit
        </h1>
        <p
          className="mt-1.5 text-[12px] tracking-[0.04em] text-ash"
          style={{ fontFamily: "var(--font-label)" }}
        >
          UPDATE YOUR COMBINATION
        </p>
      </header>

      <OutfitBuilder
        items={items}
        outfitId={outfit.id}
        editData={{
          name: outfit.name,
          occasion: outfit.occasion ?? "",
          notes: outfit.notes ?? "",
          selectedIds: outfit.items.map((i) => i.clothingItemId),
        }}
      />
    </div>
  );
}
