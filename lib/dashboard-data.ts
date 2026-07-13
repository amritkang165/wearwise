import "server-only";
import { requireSession } from "@/lib/auth";

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

export async function getDashboardData(): Promise<DashboardData> {
  const session = await requireSession();
  const firstName = session.user.name?.split(" ")[0] ?? "there";

  return {
    firstName,
    stats: {
      totalItems: 0,
      outfitsSaved: 0,
      wornThisWeek: 0,
    },
    checklist: [
      { id: "1", label: "Add your first item", done: false },
      { id: "2", label: "Save your first outfit", done: false },
      { id: "3", label: "Log an outfit you wore today", done: false },
      { id: "4", label: "Set your style preferences", done: false },
      { id: "5", label: "Try an AI outfit suggestion", done: false },
    ],
    recentActivity: [],
  };
}
