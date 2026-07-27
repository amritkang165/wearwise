"use server";

import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";
import { cloudinary } from "@/lib/cloudinary";
import { clothingItemSchema } from "@/lib/validations/wardrobe";
import sharp from "sharp";

function extractPublicId(url: string): string {
  const parts = url.split("/");
  const uploadIndex = parts.indexOf("upload");
  if (uploadIndex === -1) return "";
  const withoutVersion = parts.slice(uploadIndex + 1);
  if (withoutVersion[0]?.startsWith("v")) withoutVersion.shift();
  return withoutVersion.join("/").replace(/\.[^.]+$/, "");
}

async function processImages(files: File[]): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
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

    urls.push(result.secure_url);
  }
  return urls;
}

export async function createClothingItem(formData: FormData) {
  const session = await requireSession();

  const raw = {
    name: formData.get("name") as string,
    category: formData.get("category") as string,
    subcategory: formData.get("subcategory") as string,
    brand: formData.get("brand") as string,
    colors: JSON.parse((formData.get("colors") as string) || "[]"),
    size: formData.get("size") as string,
    seasons: JSON.parse((formData.get("seasons") as string) || "[]"),
    occasions: JSON.parse((formData.get("occasions") as string) || "[]"),
    purchaseDate: formData.get("purchaseDate") as string,
    purchasePrice: formData.get("purchasePrice") as string,
    notes: formData.get("notes") as string,
  };

  const parsed = clothingItemSchema.parse(raw);

  const imageFiles = formData.getAll("images") as File[];
  const validFiles = imageFiles.filter((f) => f.size > 0);
  const imageUrls = validFiles.length > 0 ? await processImages(validFiles) : [];

  await prisma.clothingItem.create({
    data: {
      userId: session.user.id,
      name: parsed.name,
      category: parsed.category,
      subcategory: parsed.subcategory || null,
      brand: parsed.brand || null,
      colors: parsed.colors,
      size: parsed.size || null,
      seasons: parsed.seasons,
      occasions: parsed.occasions,
      purchaseDate: parsed.purchaseDate ? new Date(parsed.purchaseDate) : null,
      purchasePrice: parsed.purchasePrice || null,
      notes: parsed.notes || null,
      images: imageUrls,
    },
  });

  redirect("/wardrobe");
}

export async function updateClothingItem(id: string, formData: FormData) {
  const session = await requireSession();

  const existing = await prisma.clothingItem.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) throw new Error("Item not found");

  const raw = {
    name: formData.get("name") as string,
    category: formData.get("category") as string,
    subcategory: formData.get("subcategory") as string,
    brand: formData.get("brand") as string,
    colors: JSON.parse((formData.get("colors") as string) || "[]"),
    size: formData.get("size") as string,
    seasons: JSON.parse((formData.get("seasons") as string) || "[]"),
    occasions: JSON.parse((formData.get("occasions") as string) || "[]"),
    purchaseDate: formData.get("purchaseDate") as string,
    purchasePrice: formData.get("purchasePrice") as string,
    notes: formData.get("notes") as string,
  };

  const parsed = clothingItemSchema.parse(raw);

  const imageFiles = formData.getAll("images") as File[];
  const validFiles = imageFiles.filter((f) => f.size > 0);

  let imageUrls = existing.images;
  if (validFiles.length > 0) {
    for (const url of existing.images) {
      const publicId = extractPublicId(url);
      if (publicId) await cloudinary.uploader.destroy(publicId);
    }
    imageUrls = await processImages(validFiles);
  }

  await prisma.clothingItem.update({
    where: { id },
    data: {
      name: parsed.name,
      category: parsed.category,
      subcategory: parsed.subcategory || null,
      brand: parsed.brand || null,
      colors: parsed.colors,
      size: parsed.size || null,
      seasons: parsed.seasons,
      occasions: parsed.occasions,
      purchaseDate: parsed.purchaseDate ? new Date(parsed.purchaseDate) : null,
      purchasePrice: parsed.purchasePrice || null,
      notes: parsed.notes || null,
      images: imageUrls,
    },
  });

  redirect(`/wardrobe/${id}`);
}

export interface BulkItemInput {
  name: string;
  category: string;
  subcategory?: string;
  brand?: string;
  colors: string[];
  size?: string;
  seasons: string[];
  occasions: string[];
  purchaseDate?: string;
  purchasePrice?: number;
  notes?: string;
  imageFile: File;
}

export async function createClothingItemsBulk(items: BulkItemInput[]) {
  const session = await requireSession();
  const created: { id: string; name: string }[] = [];

  for (const item of items) {
    const parsed = clothingItemSchema.safeParse({
      name: item.name,
      category: item.category,
      subcategory: item.subcategory ?? "",
      brand: item.brand ?? "",
      colors: item.colors,
      size: item.size ?? "",
      seasons: item.seasons,
      occasions: item.occasions,
      purchaseDate: item.purchaseDate ?? "",
      purchasePrice: item.purchasePrice ?? undefined,
      notes: item.notes ?? "",
    });

    if (!parsed.success) continue;

    const imageUrls =
      item.imageFile.size > 0 ? await processImages([item.imageFile]) : [];

    const record = await prisma.clothingItem.create({
      data: {
        userId: session.user.id,
        name: parsed.data.name,
        category: parsed.data.category,
        subcategory: parsed.data.subcategory || null,
        brand: parsed.data.brand || null,
        colors: parsed.data.colors,
        size: parsed.data.size || null,
        seasons: parsed.data.seasons,
        occasions: parsed.data.occasions,
        purchaseDate: parsed.data.purchaseDate
          ? new Date(parsed.data.purchaseDate)
          : null,
        purchasePrice: parsed.data.purchasePrice || null,
        notes: parsed.data.notes || null,
        images: imageUrls,
      },
    });

    created.push({ id: record.id, name: record.name });
  }

  return { created };
}

export async function deleteClothingItem(id: string) {
  const session = await requireSession();

  const item = await prisma.clothingItem.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!item) throw new Error("Item not found");

  for (const url of item.images) {
    const publicId = extractPublicId(url);
    if (publicId) await cloudinary.uploader.destroy(publicId);
  }

  await prisma.clothingItem.delete({ where: { id } });
  redirect("/wardrobe");
}
