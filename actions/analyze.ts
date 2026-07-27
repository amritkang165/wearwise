"use server";

import { GoogleGenAI } from "@google/genai";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface AnalyzedClothing {
  name: string;
  category: string;
  subcategory: string;
  colors: string[];
  seasons: string[];
  occasions: string[];
  material: string;
  pattern: string;
  fit: string;
  details: string;
  confidence: number;
}

export interface AnalyzeAndMatchResult {
  items: AnalyzedClothing[];
  duplicates: {
    isDuplicate: boolean;
    matchedItemId: string | null;
    matchedItemName: string | null;
  }[];
}

function normalizeItem(raw: Record<string, unknown>): AnalyzedClothing {
  return {
    name: typeof raw.name === "string" ? raw.name : "Untitled item",
    category: typeof raw.category === "string" ? raw.category : "tops",
    subcategory: typeof raw.subcategory === "string" ? raw.subcategory : "",
    colors: Array.isArray(raw.colors) ? raw.colors : [],
    seasons: Array.isArray(raw.seasons) ? raw.seasons : [],
    occasions: Array.isArray(raw.occasions) ? raw.occasions : [],
    material: typeof raw.material === "string" ? raw.material : "",
    pattern: typeof raw.pattern === "string" ? raw.pattern : "solid",
    fit: typeof raw.fit === "string" ? raw.fit : "",
    details: typeof raw.details === "string" ? raw.details : "",
    confidence: typeof raw.confidence === "number" ? raw.confidence : 0.8,
  };
}

export async function analyzeAndMatch(
  base64Data: string,
  mimeType: string
): Promise<AnalyzeAndMatchResult> {
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

  const itemList = existingItems.length > 0
    ? existingItems
        .map(
          (item, i) =>
            `[${i}] "${item.name}" — ${item.category}${item.subcategory ? "/" + item.subcategory : ""}, colors: [${item.colors.join(", ")}]${item.brand ? ", brand: " + item.brand : ""}${item.notes ? ", notes: " + item.notes : ""}`
        )
        .join("\n")
    : "(empty wardrobe)";

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      {
        parts: [
          {
            inlineData: { data: base64Data, mimeType },
          },
          {
            text: `Analyze this clothing photo and match items against an existing wardrobe. This is ONE API call doing two jobs.

EXISTING WARDROBE:
${itemList}

The photo may contain ONE or MULTIPLE clothing items. For EACH item, do TWO things:

1. IDENTIFY the item:
- name: specific descriptive name (e.g. "Pink V-neck ribbed knit sweater", NOT "pink top")
- category: one of "tops", "bottoms", "shoes", "outerwear", "accessories"
- subcategory: specific type (e.g. "t-shirt", "jeans", "sneakers")
- colors: array of dominant colors
- seasons: array from ["Spring", "Summer", "Fall", "Winter"]
- occasions: array from ["Casual", "Formal", "Work", "Athletic", "Date Night"]
- material: estimated fabric
- pattern: "solid", "striped", "plaid", "floral", "graphic", "checkered", "other"
- fit: "slim", "regular", "oversized", "fitted", "relaxed", "cropped"
- details: distinguishing features (neckline, texture, closure, pockets)
- confidence: 0.0 to 1.0

2. CHECK IF DUPLICATE of an existing wardrobe item:
- duplicateOf: index number from the wardrobe list [0, 1, 2...], or -1 if no match
- duplicateConfidence: 0.0 to 1.0 for the match

DUPLICATE RULES:
- Same category AND same color AND similar style = likely duplicate (confidence > 0.7)
- Same category AND same color BUT different design = NOT a duplicate
- Different category or different color = NOT a duplicate
- Two pink tops with different necklines = NOT duplicates

Return a JSON array of objects, each with all the fields above (name, category, subcategory, colors, seasons, occasions, material, pattern, fit, details, confidence, duplicateOf, duplicateConfidence).

IMPORTANT: Use specific details to distinguish similar items (neckline, sleeve, pattern, fit, texture).

Return ONLY valid JSON array. No other text.`,
          },
        ],
      },
    ],
    config: { responseMimeType: "application/json" },
  });

  const text = response.text ?? "";

  try {
    const parsed = JSON.parse(text);
    const rawItems = Array.isArray(parsed) ? parsed : [parsed];

    const items: AnalyzedClothing[] = [];
    const duplicates: AnalyzeAndMatchResult["duplicates"] = [];

    for (const raw of rawItems) {
      items.push(normalizeItem(raw));

      const matchIdx = typeof raw.duplicateOf === "number" ? raw.duplicateOf : -1;
      const matchConf = typeof raw.duplicateConfidence === "number" ? raw.duplicateConfidence : 0;
      const isMatch = matchConf > 0.7 && matchIdx >= 0 && matchIdx < existingItems.length;
      const matched = isMatch ? existingItems[matchIdx] : null;

      duplicates.push({
        isDuplicate: !!matched,
        matchedItemId: matched?.id ?? null,
        matchedItemName: matched?.name ?? null,
      });
    }

    return { items, duplicates };
  } catch {
    return {
      items: [{
        name: "Untitled item",
        category: "tops",
        subcategory: "",
        colors: [],
        seasons: [],
        occasions: [],
        material: "",
        pattern: "solid",
        fit: "",
        details: "",
        confidence: 0,
      }],
      duplicates: [{
        isDuplicate: false,
        matchedItemId: null,
        matchedItemName: null,
      }],
    };
  }
}
