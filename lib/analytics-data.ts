import "server-only";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";

export interface AnalyticsData {
  stats: {
    totalItems: number;
    totalWears: number;
    totalCost: number;
    costPerWear: number;
    outfitsSaved: number;
    itemsWorn: number;
    utilization: number;
    mostWornCategory: string | null;
  };
  mostWorn: {
    id: string;
    name: string;
    image: string | null;
    category: string;
    wearCount: number;
  }[];
  leastWorn: {
    id: string;
    name: string;
    image: string | null;
    category: string;
    wearCount: number;
  }[];
  categoryBreakdown: {
    category: string;
    count: number;
    wears: number;
  }[];
  wearByMonth: {
    month: string;
    count: number;
  }[];
}

const CATEGORY_LABELS: Record<string, string> = {
  tops: "Tops",
  bottoms: "Bottoms",
  shoes: "Shoes",
  outerwear: "Outerwear",
  accessories: "Accessories",
};

export async function getAnalyticsData(): Promise<AnalyticsData> {
  const session = await requireSession();
  const userId = session.user.id;

  const [items, wearLogs, outfits] = await Promise.all([
    prisma.clothingItem.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        category: true,
        images: true,
        wearCount: true,
        purchasePrice: true,
      },
    }),
    prisma.wearLog.findMany({
      where: { userId },
      select: { date: true },
    }),
    prisma.outfit.count({ where: { userId } }),
  ]);

  const totalItems = items.length;
  const totalWears = items.reduce((sum, i) => sum + i.wearCount, 0);
  const totalCost = items.reduce(
    (sum, i) => sum + (i.purchasePrice ?? 0),
    0
  );
  const costPerWear = totalWears > 0 ? totalCost / totalWears : 0;
  const itemsWorn = items.filter((i) => i.wearCount > 0).length;
  const utilization = totalItems > 0 ? (itemsWorn / totalItems) * 100 : 0;

  const sorted = [...items].sort((a, b) => b.wearCount - a.wearCount);
  const mostWorn = sorted.slice(0, 5).map((i) => ({
    id: i.id,
    name: i.name,
    image: i.images[0] ?? null,
    category: CATEGORY_LABELS[i.category] ?? i.category,
    wearCount: i.wearCount,
  }));

  const leastWorn = [...sorted]
    .reverse()
    .slice(0, 5)
    .map((i) => ({
      id: i.id,
      name: i.name,
      image: i.images[0] ?? null,
      category: CATEGORY_LABELS[i.category] ?? i.category,
      wearCount: i.wearCount,
    }));

  const categoryMap = new Map<string, { count: number; wears: number }>();
  for (const item of items) {
    const entry = categoryMap.get(item.category) ?? { count: 0, wears: 0 };
    entry.count += 1;
    entry.wears += item.wearCount;
    categoryMap.set(item.category, entry);
  }

  const categoryBreakdown = [...categoryMap.entries()]
    .map(([category, data]) => ({
      category: CATEGORY_LABELS[category] ?? category,
      count: data.count,
      wears: data.wears,
    }))
    .sort((a, b) => b.count - a.count);

  const monthMap = new Map<string, number>();
  for (const log of wearLogs) {
    const d = log.date;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthMap.set(key, (monthMap.get(key) ?? 0) + 1);
  }

  const wearByMonth = [...monthMap.entries()]
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .slice(-6)
    .map(([month, count]) => {
      const [y, m] = month.split("-").map(Number);
      return {
        month: new Date(y, m - 1, 1).toLocaleDateString("en-US", {
          month: "short",
        }),
        count,
      };
    });

  const mostWornCategoryEntry = [...categoryBreakdown]
    .filter((c) => c.wears > 0)
    .sort((a, b) => b.wears - a.wears)[0];

  return {
    stats: {
      totalItems,
      totalWears,
      totalCost,
      costPerWear,
      outfitsSaved: outfits,
      itemsWorn,
      utilization,
      mostWornCategory: mostWornCategoryEntry?.category ?? null,
    },
    mostWorn,
    leastWorn,
    categoryBreakdown,
    wearByMonth,
  };
}
