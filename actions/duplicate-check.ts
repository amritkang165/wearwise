"use server";

import { GoogleGenAI } from "@google/genai";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  matchedItemId: string | null;
  matchedItemName: string | null;
  confidence: number;
}

export async function checkForDuplicate(
  imageBuffer: Buffer,
  mimeType: string
): Promise<DuplicateCheckResult> {
  const session = await requireSession();

  const existingItems = await prisma.clothingItem.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      name: true,
      category: true,
      subcategory: true,
      colors: true,
      brand: true,
    },
  });

  if (existingItems.length === 0) {
    return { isDuplicate: false, matchedItemId: null, matchedItemName: null, confidence: 0 };
  }

  const itemList = existingItems
    .map(
      (item, i) =>
        `[${i}] "${item.name}" — ${item.category}${item.subcategory ? "/" + item.subcategory : ""}, colors: [${item.colors.join(", ")}]${item.brand ? ", brand: " + item.brand : ""}`
    )
    .join("\n");

  const base64Data = imageBuffer.toString("base64");

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      {
        parts: [
          {
            inlineData: { data: base64Data, mimeType },
          },
          {
            text: `You are comparing a photo of a clothing item against an existing wardrobe.

EXISTING WARDROBE ITEMS:
${itemList}

Look at the photo and determine if this is the SAME physical item as any of the existing items listed above. Consider:
- Same color/pattern
- Same type of garment
- Same style/brand if visible

Return a JSON object:
- isDuplicate: boolean — true if this photo shows an item that already exists in the wardrobe
- matchedItemIndex: number — the index [0, 1, 2...] of the matched item, or -1 if no match
- confidence: number — how sure you are (0.0 to 1.0). Only return true if confidence > 0.6

Return ONLY the JSON object.`,
          },
        ],
      },
    ],
    config: { responseMimeType: "application/json" },
  });

  const text = response.text ?? "";

  try {
    const parsed = JSON.parse(text);
    const matchedIndex = parsed.matchedItemIndex ?? -1;
    const isDuplicate = parsed.isDuplicate === true && matchedIndex >= 0;
    const matchedItem = isDuplicate ? existingItems[matchedIndex] : null;

    return {
      isDuplicate,
      matchedItemId: matchedItem?.id ?? null,
      matchedItemName: matchedItem?.name ?? null,
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0,
    };
  } catch {
    return { isDuplicate: false, matchedItemId: null, matchedItemName: null, confidence: 0 };
  }
}
