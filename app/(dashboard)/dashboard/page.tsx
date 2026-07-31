import { Shirt, Layers, CalendarCheck } from "lucide-react";
import { StatTag } from "@/components/dashboard/StatTag";
import { GettingStarted } from "@/components/dashboard/GettingStarted";
import { ActivityRail } from "@/components/dashboard/ActivityRail";
import { QuickAddButton } from "@/components/dashboard/QuickAddButton";
import { WhatToWear } from "@/components/dashboard/WhatToWear";
import { getDashboardData } from "@/lib/dashboard-data";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-[768px] mx-auto px-4 py-10">
      <header className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[26px] font-semibold text-ink tracking-tight">
            {greeting()}, {data.firstName}.
          </h1>
          <p
            className="mt-1.5 text-[12px] tracking-[0.04em] text-ash"
            style={{ fontFamily: "var(--font-label)" }}
          >
            {today.toUpperCase()}
          </p>
        </div>
        <QuickAddButton />
      </header>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatTag value={data.stats.totalItems} label="Total items" icon={Shirt} />
        <StatTag value={data.stats.outfitsSaved} label="Outfits saved" icon={Layers} />
        <StatTag
          value={data.stats.wornThisWeek}
          label="Worn this week"
          icon={CalendarCheck}
        />
      </div>

      <div className="flex flex-col gap-6">
        <WhatToWear />
        <GettingStarted items={data.checklist} />
        <ActivityRail entries={data.recentActivity} />
      </div>
    </div>
  );
}
