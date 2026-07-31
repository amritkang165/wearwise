"use client";

import { Shirt } from "lucide-react";

interface ActivityEntry {
  id: string;
  outfitName: string;
  wornOn: string;
  itemCount: number;
}

interface ActivityRailProps {
  entries: ActivityEntry[];
}

function formatWornOn(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const startOfThatDay = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((startOfToday - startOfThatDay) / 86400000);

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7)
    return d.toLocaleDateString("en-US", { weekday: "short" }).toLowerCase();
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ActivityRail({ entries }: ActivityRailProps) {
  if (entries.length === 0) {
    return (
      <section className="bg-paper border border-linen rounded-[10px] p-6">
        <h2 className="text-[15px] font-semibold text-ink mb-1">Recently worn</h2>
        <p className="text-[13px] text-ash">
          Log an outfit and it will hang here.
        </p>
      </section>
    );
  }

  return (
    <section className="bg-paper border border-linen rounded-[10px] p-6">
      <h2 className="text-[15px] font-semibold text-ink mb-4">Recently worn</h2>

      <div className="relative pl-5">
        <div className="absolute left-[5px] top-1 bottom-1 w-px bg-linen" />

        <ul className="flex flex-col">
          {entries.map((entry, i) => (
            <li key={entry.id} className="relative py-3 first:pt-0 last:pb-0">
              {i !== entries.length - 1 && (
                <div className="absolute left-[-20px] right-0 bottom-0 h-px bg-seam" />
              )}
              <span
                aria-hidden
                className="absolute left-[-24px] top-[18px] w-[9px] h-[9px] rounded-full bg-dust"
              />
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Shirt className="w-4 h-4 text-dust shrink-0" strokeWidth={1.75} />
                  <span className="text-[13.5px] text-ink truncate">
                    {entry.outfitName}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className="text-[11px] tracking-[0.06em] text-ash"
                    style={{ fontFamily: "var(--font-label)" }}
                  >
                    {entry.itemCount} pieces
                  </span>
                  <span
                    className="text-[11px] tracking-[0.06em] text-ash w-16 text-right"
                    style={{ fontFamily: "var(--font-label)" }}
                  >
                    {entry.wornOn && formatWornOn(entry.wornOn)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
