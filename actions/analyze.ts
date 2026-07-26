"use server";

import { GoogleGenAI } from "@google/genai";

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

const emptyItem: AnalyzedClothing = {
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
};

export async function analyzeClothingImage(
  base64Data: string,
  mimeType: string
): Promise<AnalyzedClothing[]> {

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType,
            },
          },
          {
            text: `Analyze this clothing photo. It may contain ONE item or MULTIPLE items (e.g. a full outfit, a flat lay, or a mirror selfie).

For EACH distinct clothing item you see, return an object with:
- name: a specific descriptive name that uniquely identifies THIS item. Be precise — include neckline style, sleeve length, fit, and distinguishing features. Examples: "Pink V-neck ribbed knit sweater", "Blue slim-fit Oxford button-down shirt", "Black high-waisted straight-leg jeans". NOT just "pink top" or "blue pants".
- category: one of "tops", "bottoms", "shoes", "outerwear", "accessories"
- subcategory: specific type (e.g. "t-shirt", "jeans", "sneakers", "blazer", "sweater", "dress shirt")
- colors: array of dominant colors
- seasons: array from ["Spring", "Summer", "Fall", "Winter"]
- occasions: array from ["Casual", "Formal", "Work", "Athletic", "Date Night"]
- material: estimated fabric (e.g. "cotton", "denim", "leather", "wool", "silk", "polyester")
- pattern: "solid", "striped", "plaid", "floral", "graphic", "checkered", "other"
- fit: how it fits (e.g. "slim", "regular", "oversized", "fitted", "relaxed", "cropped")
- details: distinguishing features that set this item apart (e.g. "V-neck, ribbed texture, no logo", "button-down collar, chest pocket, rolled sleeves")
- confidence: 0.0 to 1.0

IMPORTANT:
- If you see multiple items, return an ARRAY of objects.
- If you see one item, still return it as a single-element array.
- The name and details fields MUST be specific enough to distinguish this item from similar items (e.g. two pink tops with different necklines should have different names and details).
- Focus on structural differences: neckline, sleeve length, cut, pattern, texture, closure type, pockets.

Return a JSON array of objects. No other text.`,
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
    if (Array.isArray(parsed)) {
      return parsed.map((item) => normalizeItem(item));
    }
    // Single object returned instead of array
    return [normalizeItem(parsed)];
  } catch {
    return [{ ...emptyItem }];
  }
}
