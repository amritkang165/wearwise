"use server";

import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";

export async function logWear(clothingItemId: string) {
  const session = await requireSession();

  const item = await prisma.clothingItem.findFirst({
    where: { id: clothingItemId, userId: session.user.id },
  });
  if (!item) throw new Error("Item not found");

  await prisma.wearLog.create({
    data: {
      userId: session.user.id,
      clothingItemId,
    },
  });

  await prisma.clothingItem.update({
    where: { id: clothingItemId },
    data: { wearCount: { increment: 1 } },
  });

  return { success: true, itemName: item.name };
}

export async function logWearForItems(clothingItemIds: string[]) {
  const session = await requireSession();

  for (const id of clothingItemIds) {
    const item = await prisma.clothingItem.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!item) continue;

    await prisma.wearLog.create({
      data: {
        userId: session.user.id,
        clothingItemId: id,
      },
    });

    await prisma.clothingItem.update({
      where: { id },
      data: { wearCount: { increment: 1 } },
    });
  }
}
