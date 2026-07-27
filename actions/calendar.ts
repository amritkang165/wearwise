"use server";

import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";

export interface WearLogEntry {
  id: string;
  date: string;
  clothingItem: {
    id: string;
    name: string;
    category: string;
    images: string[];
  };
}

export interface OutfitLogEntry {
  id: string;
  date: string;
  outfit: {
    id: string;
    name: string;
    occasion: string | null;
    items: {
      clothingItem: {
        id: string;
        name: string;
        images: string[];
      };
    }[];
  };
}

export interface CalendarDay {
  date: string;
  wearLogs: WearLogEntry[];
  outfitLogs: OutfitLogEntry[];
}

export async function getCalendarData(year: number, month: number) {
  const session = await requireSession();

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  const [wearLogs, outfitLogs] = await Promise.all([
    prisma.wearLog.findMany({
      where: {
        userId: session.user.id,
        date: { gte: start, lte: end },
      },
      include: {
        clothingItem: {
          select: { id: true, name: true, category: true, images: true },
        },
      },
      orderBy: { date: "asc" },
    }),
    prisma.outfitLog.findMany({
      where: {
        userId: session.user.id,
        date: { gte: start, lte: end },
      },
      include: {
        outfit: {
          select: {
            id: true,
            name: true,
            occasion: true,
            items: {
              select: {
                clothingItem: {
                  select: { id: true, name: true, images: true },
                },
              },
            },
          },
        },
      },
      orderBy: { date: "asc" },
    }),
  ]);

  const wearEntries: WearLogEntry[] = wearLogs.map((log) => ({
    id: log.id,
    date: log.date.toISOString(),
    clothingItem: log.clothingItem,
  }));

  const outfitEntries: OutfitLogEntry[] = outfitLogs.map((log) => ({
    id: log.id,
    date: log.date.toISOString(),
    outfit: log.outfit,
  }));

  return { wearLogs: wearEntries, outfitLogs: outfitEntries };
}
