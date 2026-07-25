import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";
import { ItemForm } from "@/components/wardrobe/ItemForm";
import { updateClothingItem } from "@/actions/wardrobe";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireSession();
  const item = await prisma.clothingItem.findFirst({
    where: { id, userId: session.user.id },
  });
  return { title: item ? `Edit ${item.name} — WearWise` : "Edit — WearWise" };
}

export default async function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireSession();

  const item = await prisma.clothingItem.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!item) notFound();

  const initialData = {
    name: item.name,
    category: item.category,
    subcategory: item.subcategory ?? "",
    brand: item.brand ?? "",
    colors: item.colors,
    size: item.size ?? "",
    seasons: item.seasons,
    occasions: item.occasions,
    purchaseDate: item.purchaseDate
      ? new Date(item.purchaseDate).toISOString().split("T")[0]
      : "",
    purchasePrice: item.purchasePrice?.toString() ?? "",
    notes: item.notes ?? "",
    images: item.images,
  };

  const updateAction = async (formData: FormData) => {
    "use server";
    await updateClothingItem(id, formData);
  };

  return (
    <div className="max-w-[640px] mx-auto px-4 py-10">
      <Link
        href={`/wardrobe/${id}`}
        className="inline-flex items-center gap-1.5 text-[13px] text-ash hover:text-ink transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
        Back to item
      </Link>

      <header className="mb-8">
        <h1 className="text-[26px] font-semibold text-ink tracking-tight">
          Edit Item
        </h1>
        <p
          className="mt-1.5 text-[12px] tracking-[0.04em] text-ash"
          style={{ fontFamily: "var(--font-label)" }}
        >
          {item.name.toUpperCase()}
        </p>
      </header>

      <ItemForm mode="edit" action={updateAction} initialData={initialData} />
    </div>
  );
}
