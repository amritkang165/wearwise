"use server";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface OutfitSuggestion {
  suggestedOccasion: string;
  suggestedSeasons: string[];
  formalityLevel: string;
  missingItems: { category: string; suggestion: string; reason: string }[];
  tips: string[];
}

interface OutfitItemInput {
  name: string;
  category: string;
  colors: string[];
  subcategory: string;
  brand: string;
  seasons: string[];
  occasions: string[];
}

export async function analyzeOutfit(
  items: OutfitItemInput[],
  currentOccasion?: string
): Promise<OutfitSuggestion> {
  const itemList = items
    .map(
      (item, i) =>
        `${i + 1}. ${item.name} | category: ${item.category} | subcategory: ${item.subcategory} | brand: ${item.brand} | colors: ${item.colors.join(", ")} | seasons: ${item.seasons.join(", ")} | occasions: ${item.occasions.join(", ")}`
    )
    .join("\n");

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      {
        parts: [
          {
            text: `Analyze this outfit composed of the following items:

${itemList}

${currentOccasion ? `The user currently labeled this as: "${currentOccasion}"` : "No occasion has been set yet."}

Return a JSON object with:
- suggestedOccasion: the best single occasion label for this outfit (e.g. "Brunch", "Business Casual", "Weekend Errands", "Outdoor Wedding"). Be specific, not generic.
- suggestedSeasons: array of seasons this outfit works for (from "Spring", "Summer", "Fall", "Winter")
- formalityLevel: one of "Very Casual", "Smart Casual", "Business Casual", "Formal", "Black Tie"
- missingItems: array of up to 3 items that would COMPLETE this outfit. Each with:
  - category: what category is missing (e.g. "accessories", "shoes", "outerwear")
  - suggestion: specific item name (e.g. "White leather sneakers", "Silver watch", "Navy blazer")
  - reason: why it would complete the outfit (e.g. "adds a polished finish", "balances the casual top")
  Only suggest items that genuinely improve the outfit. If the outfit is already complete, return an empty array.
- tips: array of 1-3 styling tips specific to THIS outfit combination (e.g. "Tuck the shirt in for a cleaner silhouette", "Roll the sleeves for a relaxed vibe")

Return ONLY valid JSON. No other text.`,
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
    },
  });

  const text = response.text ?? "";

  try {
    const parsed = JSON.parse(text);
    return {
      suggestedOccasion: typeof parsed.suggestedOccasion === "string" ? parsed.suggestedOccasion : "Casual",
      suggestedSeasons: Array.isArray(parsed.suggestedSeasons) ? parsed.suggestedSeasons : [],
      formalityLevel: typeof parsed.formalityLevel === "string" ? parsed.formalityLevel : "Smart Casual",
      missingItems: Array.isArray(parsed.missingItems)
        ? parsed.missingItems.map((m: Record<string, unknown>) => ({
            category: typeof m.category === "string" ? m.category : "",
            suggestion: typeof m.suggestion === "string" ? m.suggestion : "",
            reason: typeof m.reason === "string" ? m.reason : "",
          }))
        : [],
      tips: Array.isArray(parsed.tips) ? parsed.tips : [],
    };
  } catch {
    return {
      suggestedOccasion: currentOccasion || "Casual",
      suggestedSeasons: [],
      formalityLevel: "Smart Casual",
      missingItems: [],
      tips: [],
    };
  }
}
