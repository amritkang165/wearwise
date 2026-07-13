import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="max-w-[768px] mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="text-[26px] font-semibold text-ink tracking-tight">
          Analytics
        </h1>
        <p
          className="mt-1.5 text-[12px] tracking-[0.04em] text-ash"
          style={{ fontFamily: "var(--font-label)" }}
        >
          WARDROBE INSIGHTS
        </p>
      </header>

      {/* Stat cards — hang-tag style like dashboard */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[
          { label: "MOST WORN", value: "—" },
          { label: "LEAST WORN", value: "—" },
          { label: "COST / WEAR", value: "—" },
          { label: "UTILIZATION", value: "—" },
        ].map((s) => (
          <div
            key={s.label}
            className="relative bg-paper border border-linen rounded-[10px] p-5"
          >
            <p
              className="text-[11px] tracking-[0.14em] uppercase text-ash"
              style={{ fontFamily: "var(--font-label)" }}
            >
              {s.label}
            </p>
            <p className="mt-2 text-[28px] font-semibold text-ink/15 tabular-nums">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center rounded-[10px] border border-dashed border-linen py-24">
        <BarChart3 className="w-10 h-10 text-dust/40" strokeWidth={1.25} />
        <p className="mt-4 text-[15px] font-semibold text-ink/30">
          No data yet
        </p>
        <p className="mt-1 text-[13px] text-ash/60">
          Add items and track outfits to see your insights.
        </p>
      </div>
    </div>
  );
}
