"use server";

import { GoogleGenAI } from "@google/genai";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface SuggestedItem {
  id: string;
  name: string;
  category: string;
  colors: string[];
  images: string[];
}

export interface TodayOutfitResult {
  items: SuggestedItem[];
  reason: string;
  tips: string[];
  meta: {
    occasion: string;
    season: string;
    weather: string;
  };
}

interface SuggestParams {
  occasion?: string;
  temperature?: number;
  currentSeason?: string;
}

export async function suggestTodayOutfit(
  params: SuggestParams
): Promise<TodayOutfitResult> {
  const session = await requireSession();
  const userId = session.user.id;

  const [items, wearLogs] = await Promise.all([
    prisma.clothingItem.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        category: true,
        subcategory: true,
        brand: true,
        colors: true,
        seasons: true,
        occasions: true,
        wearCount: true,
        images: true,
      },
    }),
    prisma.wearLog.findMany({
      where: { userId },
      select: { clothingItemId: true, date: true },
    }),
  ]);

  if (items.length < 2) {
    throw new Error("Add at least 2 items to your wardrobe first.");
  }

  const now = Date.now();
  const lastWornMap = new Map<string, number>();
  for (const log of wearLogs) {
    const prev = lastWornMap.get(log.clothingItemId) ?? 0;
    const t = log.date.getTime();
    if (t > prev) lastWornMap.set(log.clothingItemId, t);
  }

  const season = params.currentSeason ?? currentSeasonFromDate();
  const weather = params.temperature
    ? `${Math.round(params.temperature)}° today`
    : "unknown temperature";

  const candidates = items
    .filter((i) => {
      if (i.seasons.length === 0) return true;
      return i.seasons.some((s) => s.toLowerCase() === season.toLowerCase());
    })
    .map((item) => {
      const last = lastWornMap.get(item.id);
      return {
        id: item.id,
        name: item.name,
        category: item.category,
        subcategory: item.subcategory ?? "",
        brand: item.brand ?? "",
        colors: item.colors.join(", "),
        wearCount: item.wearCount,
        daysSinceLastWorn: last ? Math.floor((now - last) / 86400000) : -1,
      };
    });

  if (candidates.length === 0) {
    throw new Error("No items match the current season. Update item seasons and try again.");
  }

  const itemList = candidates
    .map(
      (item) =>
        `{id: ${item.id}, name: "${item.name}", category: ${item.category}, subcategory: ${item.subcategory}, brand: ${item.brand}, colors: [${item.colors}], wears: ${item.wearCount}, lastWornDaysAgo: ${item.daysSinceLastWorn === -1 ? "never" : item.daysSinceLastWorn}}`
    )
    .join("\n");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: [
      {
        parts: [
          {
            text: `You are a personal stylist. Build today's outfit for the user.

Season: ${season}
Weather: ${weather}
${params.occasion ? `Occasion: ${params.occasion}` : "Occasion: everyday / casual"}
Today's date: ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}

Available clothing items (each with its id, colors, total wears, and days since last worn; -1 means never worn):
${itemList}

Pick items that form ONE cohesive outfit. Prefer items the user has NOT worn recently (higher daysSinceLastWorn or never worn) to rotate their wardrobe. Match the occasion and weather/season. Use at least 2 items, ideally one per core category (top, bottom, shoes, outerwear, accessories) when the wardrobe allows.

Return ONLY this JSON (no other text):
{
  "itemIds": ["exact id strings from the list"],
  "reason": "1-2 sentences explaining why this combination works for today",
  "tips": ["1-2 short styling tips"]
}`,
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
    },
  });

  const text = response.text ?? "";
  let parsed: { itemIds?: string[]; reason?: string; tips?: string[] };

  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = { itemIds: [], reason: "", tips: [] };
  }

  const validIds = new Set(candidates.map((c) => c.id));
  const pickedIds = (parsed.itemIds ?? []).filter((id) => validIds.has(id));
  const fallbackIds =
    pickedIds.length >= 2
      ? pickedIds
      : candidates
          .filter((c) => c.daysSinceLastWorn === -1 || c.daysSinceLastWorn >= 7)
          .sort((a, b) => b.daysSinceLastWorn - a.daysSinceLastWorn)
          .slice(0, 4)
          .map((c) => c.id);

  const picked = items.filter((i) => fallbackIds.includes(i.id));
  const ordered = fallbackIds
    .map((id) => picked.find((i) => i.id === id))
    .filter((i): i is (typeof items)[number] => !!i);

  return {
    items: ordered.map((i) => ({
      id: i.id,
      name: i.name,
      category: i.category,
      colors: i.colors,
      images: i.images,
    })),
    reason:
      parsed.reason ||
      "A balanced rotation of your least-recently-worn pieces.",
    tips: parsed.tips ?? [],
    meta: {
      occasion: params.occasion || "Everyday",
      season,
      weather,
    },
  };
}

export async function saveSuggestedOutfit(
  name: string,
  itemIds: string[]
): Promise<{ outfitId: string }> {
  const session = await requireSession();
  const userId = session.user.id;

  const items = await prisma.clothingItem.findMany({
    where: { id: { in: itemIds }, userId },
    select: { id: true },
  });
  if (items.length === 0) throw new Error("No valid items");

  const outfit = await prisma.outfit.create({
    data: {
      userId,
      name: name.trim() || "Today's outfit",
      items: {
        create: items.map((item) => ({ clothingItemId: item.id })),
      },
    },
    select: { id: true },
  });

  await prisma.outfitLog.create({
    data: { userId, outfitId: outfit.id },
  });

  for (const item of items) {
    await prisma.wearLog.create({
      data: { userId, clothingItemId: item.id },
    });
    await prisma.clothingItem.update({
      where: { id: item.id },
      data: { wearCount: { increment: 1 } },
    });
  }

  return { outfitId: outfit.id };
}

function currentSeasonFromDate(): string {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "Spring";
  if (month >= 5 && month <= 7) return "Summer";
  if (month >= 8 && month <= 10) return "Fall";
  return "Winter";
}
