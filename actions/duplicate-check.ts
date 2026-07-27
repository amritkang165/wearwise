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
  base64Data: string,
  mimeType: string
): Promise<DuplicateCheckResult[]> {
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
      notes: true,
    },
  });

  if (existingItems.length === 0) {
    return [];
  }

  const itemList = existingItems
    .map(
      (item, i) =>
        `[${i}] "${item.name}" — ${item.category}${item.subcategory ? "/" + item.subcategory : ""}, colors: [${item.colors.join(", ")}]${item.brand ? ", brand: " + item.brand : ""}${item.notes ? ", notes: " + item.notes : ""}`
    )
    .join("\n");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: [
      {
        parts: [
          {
            inlineData: { data: base64Data, mimeType },
          },
          {
            text: `You are checking if items in a photo already exist in someone's wardrobe.

EXISTING WARDROBE ITEMS:
${itemList}

The photo may contain MULTIPLE clothing items. For EACH item in the photo, check if it matches any existing wardrobe item.

Compare using SPECIFIC features, not just category or color:
- Same category AND same color AND similar style = likely duplicate
- Same category AND same color BUT different design (neckline, sleeve, pattern, fit) = NOT a duplicate
- Different category or different color = NOT a duplicate

For example:
- Photo shows "Pink V-neck ribbed sweater" vs wardrobe has "Pink crew-neck cotton t-shirt" → NOT a duplicate (different neckline, different material)
- Photo shows "Blue slim-fit jeans" vs wardrobe has "Blue slim-fit jeans" → DUPLICATE (same item)
- Photo shows "White sneakers" vs wardrobe has "White leather sneakers" → likely DUPLICATE

Return a JSON array of objects, one per item detected in the photo:
- itemIndex: number — the index [0, 1, 2...] of the matched wardrobe item, or -1 if no match
- isDuplicate: boolean — true only if confidence > 0.7
- confidence: number — 0.0 to 1.0

If the photo shows 3 items, return 3 objects in the array. Order matches the order items appear in the photo.

Return ONLY the JSON array.`,
          },
        ],
      },
    ],
    config: { responseMimeType: "application/json" },
  });

  const text = response.text ?? "";

  try {
    const parsed = JSON.parse(text);
    const items = Array.isArray(parsed) ? parsed : [parsed];

    return items.map((item) => {
      const matchedIndex = item.itemIndex ?? -1;
      const isDuplicate = item.isDuplicate === true && matchedIndex >= 0;
      const matchedItem = isDuplicate ? existingItems[matchedIndex] : null;

      return {
        isDuplicate,
        matchedItemId: matchedItem?.id ?? null,
        matchedItemName: matchedItem?.name ?? null,
        confidence: typeof item.confidence === "number" ? item.confidence : 0,
      };
    });
  } catch {
    return [];
  }
}
