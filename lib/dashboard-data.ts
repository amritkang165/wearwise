import "server-only";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";

export interface DashboardData {
  firstName: string;
  stats: {
    totalItems: number;
    outfitsSaved: number;
    wornThisWeek: number;
  };
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

  const checklist = [
    { id: "1", label: "Add your first item", done: totalItems > 0 },
    { id: "2", label: "Save your first outfit", done: outfitsSaved > 0 },
    { id: "3", label: "Log an outfit you wore today", done: false },
    { id: "4", label: "Set your style preferences", done: false },
    { id: "5", label: "Try an AI outfit suggestion", done: false },
  ];

  return {
    firstName,
    stats: {
      totalItems,
      outfitsSaved,
      wornThisWeek,
    },
    checklist,
    recentActivity: [],
  };
}
