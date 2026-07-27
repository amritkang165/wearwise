"use server";

import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";

export interface CalendarDay {
  date: string;
  wearLogs: {
    id: string;
    clothingItem: {
      id: string;
      name: string;
      category: string;
      images: string[];
    };
  }[];
  outfitLogs: {
    id: string;
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
  }[];
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

  const days: Record<string, CalendarDay> = {};

  for (const log of wearLogs) {
    const key = log.date.toISOString().split("T")[0];
    if (!days[key]) days[key] = { date: key, wearLogs: [], outfitLogs: [] };
    days[key].wearLogs.push(log);
  }

  for (const log of outfitLogs) {
    const key = log.date.toISOString().split("T")[0];
    if (!days[key]) days[key] = { date: key, wearLogs: [], outfitLogs: [] };
    days[key].outfitLogs.push(log);
  }

  return days;
}
