"use server";

import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";

export async function createOutfit(data: {
  name: string;
  occasion?: string;
  notes?: string;
  clothingItemIds: string[];
}) {
  const session = await requireSession();

  if (data.clothingItemIds.length === 0) {
    throw new Error("Outfit must have at least one item");
  }

  // Verify all items belong to user
  const items = await prisma.clothingItem.findMany({
    where: {
      id: { in: data.clothingItemIds },
      userId: session.user.id,
    },
  });

  if (items.length !== data.clothingItemIds.length) {
    throw new Error("Some items not found");
  }

  const outfit = await prisma.outfit.create({
    data: {
      userId: session.user.id,
      name: data.name,
      occasion: data.occasion || null,
      notes: data.notes || null,
      items: {
        create: data.clothingItemIds.map((clothingItemId) => ({
          clothingItemId,
        })),
      },
    },
    include: { items: true },
  });

  redirect(`/outfits/${outfit.id}`);
}

export async function updateOutfit(
  id: string,
  data: {
    name: string;
    occasion?: string;
    notes?: string;
    clothingItemIds: string[];
  }
) {
  const session = await requireSession();

  const existing = await prisma.outfit.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) throw new Error("Outfit not found");

  if (data.clothingItemIds.length === 0) {
    throw new Error("Outfit must have at least one item");
  }

  // Delete old outfit items, create new ones
  await prisma.outfitItem.deleteMany({ where: { outfitId: id } });

  await prisma.outfit.update({
    where: { id },
    data: {
      name: data.name,
      occasion: data.occasion || null,
      notes: data.notes || null,
      items: {
        create: data.clothingItemIds.map((clothingItemId) => ({
          clothingItemId,
        })),
      },
    },
  });

  redirect(`/outfits/${id}`);
}

export async function deleteOutfit(id: string) {
  const session = await requireSession();

  const existing = await prisma.outfit.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) throw new Error("Outfit not found");

  await prisma.outfit.delete({ where: { id } });
  redirect("/outfits");
}

export async function toggleFavorite(id: string) {
  const session = await requireSession();

  const existing = await prisma.outfit.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) throw new Error("Outfit not found");

  await prisma.outfit.update({
    where: { id },
    data: { isFavorite: !existing.isFavorite },
  });

  return { isFavorite: !existing.isFavorite };
}

export async function logOutfitWear(outfitId: string) {
  const session = await requireSession();

  const outfit = await prisma.outfit.findFirst({
    where: { id: outfitId, userId: session.user.id },
    include: { items: { select: { clothingItemId: true } } },
  });
  if (!outfit) throw new Error("Outfit not found");

  // Create outfit log
  await prisma.outfitLog.create({
    data: {
      userId: session.user.id,
      outfitId,
    },
  });

  // Also log wear for each individual item
  for (const item of outfit.items) {
    await prisma.wearLog.create({
      data: {
        userId: session.user.id,
        clothingItemId: item.clothingItemId,
      },
    });

    await prisma.clothingItem.update({
      where: { id: item.clothingItemId },
      data: { wearCount: { increment: 1 } },
    });
  }

  return { success: true, outfitName: outfit.name, itemCount: outfit.items.length };
}
