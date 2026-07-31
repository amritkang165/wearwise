import { getAnalyticsData } from "@/lib/analytics-data";
import { BarChart3, Shirt, Star, TrendingUp, DollarSign, Layers } from "lucide-react";

export const metadata = {
  title: "Analytics — WearWise",
};

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();
  const hasData = data.stats.totalWears > 0;
  const maxWears = Math.max(...data.mostWorn.map((m) => m.wearCount), 1);
  const maxMonthCount = Math.max(...data.wearByMonth.map((m) => m.count), 1);

  return (
    <div className="max-w-[960px] mx-auto px-4 py-10">
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

      {!hasData ? (
        <div className="flex flex-col items-center justify-center rounded-[10px] border border-dashed border-linen py-24">
          <BarChart3 className="w-10 h-10 text-dust/40" strokeWidth={1.25} />
          <p className="mt-4 text-[15px] font-semibold text-ink/30">
            No data yet
          </p>
          <p className="mt-1 text-[13px] text-ash/60">
            Log outfits to unlock insights about your wardrobe.
          </p>
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Shirt, label: "TOTAL ITEMS", value: data.stats.totalItems, accent: false },
              { icon: TrendingUp, label: "TOTAL WEARS", value: data.stats.totalWears, accent: true },
              { icon: DollarSign, label: "COST / WEAR", value: data.stats.costPerWear > 0 ? `$${data.stats.costPerWear.toFixed(2)}` : "—", accent: false },
              { icon: Star, label: "UTILIZATION", value: `${Math.round(data.stats.utilization)}%`, accent: false },
            ].map((s) => (
              <div
                key={s.label}
                className="relative bg-paper border border-linen rounded-[10px] p-5 overflow-hidden"
              >
                <s.icon
                  className={`absolute top-4 right-4 w-5 h-5 ${
                    s.accent ? "text-rose" : "text-dust/40"
                  }`}
                  strokeWidth={1.5}
                />
                <p
                  className="text-[11px] tracking-[0.14em] uppercase text-ash"
                  style={{ fontFamily: "var(--font-label)" }}
                >
                  {s.label}
                </p>
                <p className="mt-2 text-[26px] font-semibold text-ink tabular-nums">
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Most worn */}
            <div className="bg-paper border border-linen rounded-[10px] p-5">
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-[12px] tracking-[0.14em] uppercase text-ink font-semibold"
                  style={{ fontFamily: "var(--font-label)" }}
                >
                  Most Worn
                </h2>
                {data.stats.mostWornCategory && (
                  <span
                    className="text-[10px] tracking-[0.1em] uppercase text-rose px-2 py-0.5 bg-rose/5 rounded border border-rose/20"
                    style={{ fontFamily: "var(--font-label)" }}
                  >
                    {data.stats.mostWornCategory} heavy
                  </span>
                )}
              </div>
              <div className="space-y-3">
                {data.mostWorn.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg overflow-hidden border border-linen shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-canvas flex items-center justify-center">
                          <Shirt className="w-3.5 h-3.5 text-dust/40" strokeWidth={1} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-ink truncate">{item.name}</p>
                      <p className="text-[10px] tracking-[0.08em] text-ash" style={{ fontFamily: "var(--font-label)" }}>
                        {item.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] font-semibold text-ink tabular-nums">{item.wearCount}</p>
                      <p className="text-[10px] text-ash" style={{ fontFamily: "var(--font-label)" }}>
                        WEARS
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wear by month */}
            <div className="bg-paper border border-linen rounded-[10px] p-5">
              <h2
                className="text-[12px] tracking-[0.14em] uppercase text-ink font-semibold mb-4"
                style={{ fontFamily: "var(--font-label)" }}
              >
                Wears Per Month
              </h2>
              <div className="flex items-end gap-2 h-[160px] pt-4">
                {data.wearByMonth.map((m) => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
                    <span className="text-[11px] font-medium text-ink tabular-nums">
                      {m.count}
                    </span>
                    <div
                      className={`w-full rounded-t-[6px] ${
                        m.month === data.wearByMonth[data.wearByMonth.length - 1]?.month
                          ? "bg-rose"
                          : "bg-dust"
                      }`}
                      style={{ height: `${Math.max((m.count / maxMonthCount) * 100, 4)}%` }}
                    />
                    <span
                      className="text-[10px] text-ash"
                      style={{ fontFamily: "var(--font-label)" }}
                    >
                      {m.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category breakdown */}
            <div className="bg-paper border border-linen rounded-[10px] p-5">
              <h2
                className="text-[12px] tracking-[0.14em] uppercase text-ink font-semibold mb-4"
                style={{ fontFamily: "var(--font-label)" }}
              >
                Category Breakdown
              </h2>
              <div className="space-y-3">
                {data.categoryBreakdown.map((c) => {
                  const pct = data.stats.totalItems > 0 ? (c.count / data.stats.totalItems) * 100 : 0;
                  return (
                    <div key={c.category}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[13px] text-ink">{c.category}</span>
                        <span className="text-[11px] text-ash tabular-nums">
                          {c.count} item{c.count !== 1 ? "s" : ""} · {c.wears} wear{c.wears !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-canvas overflow-hidden">
                        <div
                          className="h-full rounded-full bg-rose/70 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Least worn */}
            <div className="bg-paper border border-linen rounded-[10px] p-5">
              <h2
                className="text-[12px] tracking-[0.14em] uppercase text-ink font-semibold mb-4"
                style={{ fontFamily: "var(--font-label)" }}
              >
                Least Worn
              </h2>
              <div className="space-y-3">
                {data.leastWorn.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg overflow-hidden border border-linen shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-canvas flex items-center justify-center">
                          <Shirt className="w-3.5 h-3.5 text-dust/40" strokeWidth={1} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-ink truncate">{item.name}</p>
                      <p className="text-[10px] tracking-[0.08em] text-ash" style={{ fontFamily: "var(--font-label)" }}>
                        {item.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] font-semibold text-ink tabular-nums">{item.wearCount}</p>
                      <p className="text-[10px] text-ash" style={{ fontFamily: "var(--font-label)" }}>
                        WEARS
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
