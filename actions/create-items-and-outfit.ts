"use server";

import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";
import { cloudinary } from "@/lib/cloudinary";
import sharp from "sharp";

interface NewItemInput {
  name: string;
  category: string;
  subcategory: string;
  colors: string[];
  seasons: string[];
  occasions: string[];
  notes: string;
  imageBase64?: string;
  mimeType?: string;
}

async function uploadImage(imageBase64: string): Promise<string | null> {
  if (!imageBase64) return null;
  const buffer = Buffer.from(imageBase64, "base64");
  const optimized = await sharp(buffer)
    .resize(800, 800, { fit: "inside" })
    .webp({ quality: 80 })
    .toBuffer();

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "wearwise" },
      (error, result) => {
        if (error || !result) reject(error);
        else resolve(result);
      }
    );
    stream.end(optimized);
  });

  return result.secure_url;
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
    const imageUrl = item.imageBase64
      ? await uploadImage(item.imageBase64)
      : null;
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
        images: imageUrl ? [imageUrl] : [],
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

  // Auto-log wear since the user just wore this outfit in the photo
  await prisma.outfitLog.create({
    data: {
      userId: session.user.id,
      outfitId: outfit.id,
    },
  });

  // Also log wear for each individual clothing item
  for (const itemId of allItemIds) {
    await prisma.wearLog.create({
      data: {
        userId: session.user.id,
        clothingItemId: itemId,
      },
    });
    await prisma.clothingItem.update({
      where: { id: itemId },
      data: { wearCount: { increment: 1 } },
    });
  }

  return outfit.id;
}
