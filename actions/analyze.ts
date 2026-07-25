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
  confidence: number;
}

export async function analyzeClothingImage(
  imageBuffer: Buffer,
  mimeType: string
): Promise<AnalyzedClothing> {
  const base64Data = imageBuffer.toString("base64");

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
            text: `Analyze this clothing item photo. Return a JSON object with these fields:
- name: a short descriptive name (e.g. "Blue denim jacket", "White cotton t-shirt")
- category: one of "tops", "bottoms", "shoes", "outerwear", "accessories"
- subcategory: specific type (e.g. "t-shirt", "jeans", "sneakers", "blazer")
- colors: array of dominant colors (e.g. ["blue", "white"])
- seasons: array of suitable seasons from ["Spring", "Summer", "Fall", "Winter"]
- occasions: array of suitable occasions from ["Casual", "Formal", "Work", "Athletic", "Date Night"]
- material: estimated fabric/material (e.g. "cotton", "denim", "leather")
- pattern: pattern type (e.g. "solid", "striped", "plaid", "floral")
- confidence: how confident you are in the analysis (0.0 to 1.0)

Return ONLY the JSON object, no other text.`,
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
      name: parsed.name || "Untitled item",
      category: parsed.category || "tops",
      subcategory: parsed.subcategory || "",
      colors: Array.isArray(parsed.colors) ? parsed.colors : [],
      seasons: Array.isArray(parsed.seasons) ? parsed.seasons : [],
      occasions: Array.isArray(parsed.occasions) ? parsed.occasions : [],
      material: parsed.material || "",
      pattern: parsed.pattern || "solid",
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.8,
    };
  } catch {
    return {
      name: "Untitled item",
      category: "tops",
      subcategory: "",
      colors: [],
      seasons: [],
      occasions: [],
      material: "",
      pattern: "solid",
      confidence: 0,
    };
  }
}
