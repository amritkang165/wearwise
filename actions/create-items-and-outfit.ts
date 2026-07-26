"use server";

import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";

interface NewItemInput {
  name: string;
  category: string;
  subcategory: string;
  colors: string[];
  seasons: string[];
  occasions: string[];
  notes: string;
}

export async function createItemsAndOutfit(
  outfitName: string,
  occasion: string | undefined,
  existingItemIds: string[],
  newItems: NewItemInput[]
): Promise<string> {
  const session = await requireSession();

  const newItemIds: string[] = [];
  for (const item of newItems) {
    const created = await prisma.clothingItem.create({
      data: {
        userId: session.user.id,
        name: item.name,
        category: item.category,
        subcategory: item.subcategory || null,
        colors: item.colors,
        seasons: item.seasons,
        occasions: item.occasions,
        notes: item.notes || null,
      },
    });
    newItemIds.push(created.id);
  }

  const allItemIds = [...existingItemIds, ...newItemIds];

  if (allItemIds.length === 0) {
    throw new Error("Outfit must have at least one item");
  }

  const outfit = await prisma.outfit.create({
    data: {
      userId: session.user.id,
      name: outfitName,
      occasion: occasion || null,
      items: {
        create: allItemIds.map((clothingItemId) => ({
          clothingItemId,
        })),
      },
    },
    select: { id: true },
  });

  return outfit.id;
}
