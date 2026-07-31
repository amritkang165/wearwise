import "server-only";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";

export interface DashboardData {
  firstName: string;
  stats: {
    totalItems: number;
    totalWears: number;
    outfitsSaved: number;
    wornThisWeek: number;
  };
  outfitLogDates: string[];
  checklist: { id: string; label: string; done: boolean }[];
  recentActivity: {
    id: string;
    outfitName: string;
    wornOn: string;
    itemCount: number;
  }[];
}

function startOfWeek(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export async function getDashboardData(): Promise<DashboardData> {
  const session = await requireSession();
  const firstName = session.user.name?.split(" ")[0] ?? "there";
  const userId = session.user.id;

  const totalItems = await prisma.clothingItem.count({
    where: { userId },
  });

  const weekStart = startOfWeek();
  const weekWearLogs = await prisma.wearLog.findMany({
    where: { userId, date: { gte: weekStart } },
    select: { clothingItemId: true },
  });
  const wornThisWeek = new Set(weekWearLogs.map((l) => l.clothingItemId)).size;

  const outfitsSaved = await prisma.outfit.count({
    where: { userId },
  });

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const wornToday = await prisma.outfitLog.count({
    where: { userId, date: { gte: todayStart } },
  });

  const preferences = await prisma.stylePreferences.findUnique({
    where: { userId },
    select: {
      colors: true,
      brands: true,
      fit: true,
      formality: true,
      style: true,
    },
  });
  const hasPreferences = !!preferences && (
    preferences.colors.length > 0 ||
    preferences.brands.length > 0 ||
    !!preferences.fit ||
    !!preferences.formality ||
    !!preferences.style
  );

  const checklist = [
    { id: "1", label: "Add your first item", done: totalItems > 0 },
    { id: "2", label: "Save your first outfit", done: outfitsSaved > 0 },
    { id: "3", label: "Log an outfit you wore today", done: wornToday > 0 },
    { id: "4", label: "Set your style preferences", done: hasPreferences },
    { id: "5", label: "Try an AI outfit suggestion", done: false },
  ];

  const recentOutfitLogs = await prisma.outfitLog.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 8,
    select: {
      id: true,
      date: true,
      outfit: {
        select: {
          name: true,
          _count: { select: { items: true } },
        },
      },
    },
  });

  const allOutfitLogs = await prisma.outfitLog.findMany({
    where: { userId },
    select: { date: true },
  });

  const totalWears = await prisma.wearLog.count({ where: { userId } });

  return {
    firstName,
    stats: {
      totalItems,
      totalWears,
      outfitsSaved,
      wornThisWeek,
    },
    outfitLogDates: allOutfitLogs.map((log) => log.date.toISOString()),
    checklist,
    recentActivity: recentOutfitLogs.map((log) => ({
      id: log.id,
      outfitName: log.outfit.name,
      wornOn: log.date.toISOString(),
      itemCount: log.outfit._count.items,
    })),
  };
}
