"use client";

import { useMemo } from "react";
import { Flame, Medal } from "lucide-react";

interface StreaksProps {
  outfitLogDates: string[];
  totalItems: number;
  totalWears: number;
  outfitsSaved: number;
}

interface Badge {
  key: string;
  label: string;
  achieved: boolean;
}

export function Streaks({
  outfitLogDates,
  totalItems,
  totalWears,
  outfitsSaved,
}: StreaksProps) {
  const streak = useMemo(() => {
    const days = new Set(
      outfitLogDates.map((iso) => {
        const d = new Date(iso);
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      })
    );
    const key = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

    let count = 0;
    const cursor = new Date();
    if (!days.has(key(cursor))) {
      cursor.setDate(cursor.getDate() - 1);
    }
    while (days.has(key(cursor))) {
      count += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  }, [outfitLogDates]);

  const badges: Badge[] = useMemo(
    () => [
      { key: "first-outfit", label: "First outfit", achieved: outfitsSaved >= 1 },
      { key: "ten-wears", label: "10 wears logged", achieved: totalWears >= 10 },
      { key: "twenty-items", label: "20 items in wardrobe", achieved: totalItems >= 20 },
      { key: "seven-streak", label: "7-day streak", achieved: streak >= 7 },
      { key: "thirty-streak", label: "30-day streak", achieved: streak >= 30 },
    ],
    [outfitsSaved, totalWears, totalItems, streak]
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-4 rounded-xl border border-linen bg-paper p-5">
      {/* Streak */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-rose/10 flex items-center justify-center shrink-0">
          <Flame
            className={`w-6 h-6 ${streak > 0 ? "text-rose" : "text-dust"}`}
            strokeWidth={1.75}
            fill={streak > 0 ? "currentColor" : "none"}
          />
        </div>
        <div>
          <p className="text-[28px] font-semibold text-ink leading-none tabular-nums">
            {streak}
          </p>
          <p
            className="text-[10px] tracking-[0.14em] uppercase text-ash mt-1"
            style={{ fontFamily: "var(--font-label)" }}
          >
            Day streak
          </p>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2">
        {badges.map((badge) => (
          <span
            key={badge.key}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all ${
              badge.achieved
                ? "bg-rose/10 text-rose border-rose/30"
                : "bg-canvas text-dust border-linen"
            }`}
          >
            <Medal
              className={`w-3 h-3 ${badge.achieved ? "text-rose" : "text-dust/40"}`}
              strokeWidth={1.75}
            />
            {badge.label}
          </span>
        ))}
      </div>
    </div>
  );
}
