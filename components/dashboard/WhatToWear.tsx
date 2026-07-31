"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Loader2,
  Shirt,
  ThermometerSun,
  CalendarDays,
  Check,
} from "lucide-react";
import {
  suggestTodayOutfit,
  saveSuggestedOutfit,
  type TodayOutfitResult,
} from "@/actions/what-to-wear";

const QUICK_OCCASIONS = ["Everyday", "Work", "Date Night", "Brunch", "Workout"];

export function WhatToWear() {
  const router = useRouter();
  const [occasion, setOccasion] = useState("");
  const [temperature, setTemperature] = useState("");
  const [result, setResult] = useState<TodayOutfitResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const season = getSeason();

  const handleSuggest = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await suggestTodayOutfit({
        occasion: occasion || undefined,
        temperature: temperature ? Number(temperature) : undefined,
        currentSeason: season,
      });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't build today's outfit.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    setIsSaving(true);
    try {
      const { outfitId } = await saveSuggestedOutfit(
        `Today's look — ${result.meta.occasion}`,
        result.items.map((i) => i.id)
      );
      router.push(`/outfits/${outfitId}`);
    } catch {
      setIsSaving(false);
    }
  };

  const categoryLabel = (category: string) =>
    category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="rounded-xl border border-linen bg-canvas overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-linen">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-rose" strokeWidth={1.75} />
          <span
            className="text-[11px] tracking-[0.1em] uppercase text-ash"
            style={{ fontFamily: "var(--font-label)" }}
          >
            What to wear today
          </span>
          <span className="text-[11px] text-dust">· {season}</span>
        </div>
        {result && (
          <span className="text-[11px] text-ash">
            {result.meta.occasion} · {result.meta.weather}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        {!result ? (
          <>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_OCCASIONS.map((occ) => (
                <button
                  key={occ}
                  type="button"
                  onClick={() => setOccasion(occasion === occ ? "" : occ)}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    occasion === occ
                      ? "bg-rose text-paper border-rose"
                      : "bg-paper text-ink border-linen hover:border-dust"
                  }`}
                >
                  {occasion === occ && <Check className="w-3 h-3" />}
                  {occ}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 flex-1 h-9 px-3 rounded-lg border border-linen bg-paper">
                <ThermometerSun
                  className="w-3.5 h-3.5 text-dust"
                  strokeWidth={1.75}
                />
                <input
                  type="number"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  placeholder="Temp (°F) — optional"
                  className="flex-1 bg-transparent outline-none text-[13px] text-ink placeholder:text-ash"
                />
              </div>
              <button
                onClick={handleSuggest}
                disabled={isLoading}
                className="h-9 px-4 rounded-lg bg-rose text-paper text-[13px] font-medium hover:bg-crimson disabled:opacity-50 transition-all flex items-center gap-1.5"
              >
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" strokeWidth={2} />
                )}
                {isLoading ? "Styling..." : "Style me"}
              </button>
            </div>

            {error && <p className="text-[13px] text-crimson">{error}</p>}
          </>
        ) : (
          <>
            <p className="text-[14px] leading-relaxed text-ink">{result.reason}</p>

            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {result.items.map((item) => (
                <div
                  key={item.id}
                  className="shrink-0 w-[84px] rounded-lg overflow-hidden border border-linen bg-paper"
                >
                  <div className="aspect-square bg-canvas">
                    {item.images.length > 0 ? (
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Shirt
                          className="w-6 h-6 text-dust/40"
                          strokeWidth={1.25}
                        />
                      </div>
                    )}
                  </div>
                  <div className="p-1.5">
                    <p className="text-[10px] font-medium text-ink truncate">
                      {item.name}
                    </p>
                    <p
                      className="text-[9px] text-ash uppercase tracking-wide truncate"
                      style={{ fontFamily: "var(--font-label)" }}
                    >
                      {categoryLabel(item.category)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {result.tips.length > 0 && (
              <ul className="space-y-1">
                {result.tips.map((tip, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-[13px] text-ash"
                  >
                    <span className="text-rose shrink-0">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            )}

            <div className="flex items-center gap-2.5 pt-1">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="h-9 px-4 rounded-lg bg-rose text-paper text-[13px] font-medium hover:bg-crimson disabled:opacity-50 transition-all flex items-center gap-1.5"
              >
                {isSaving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CalendarDays className="w-3.5 h-3.5" strokeWidth={2} />
                )}
                {isSaving ? "Saving..." : "Save & log this outfit"}
              </button>
              <button
                onClick={() => setResult(null)}
                className="h-9 px-4 rounded-lg border border-linen bg-paper text-ink text-[13px] font-medium hover:bg-canvas transition-all"
              >
                Try another
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function getSeason(): string {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "Spring";
  if (month >= 5 && month <= 7) return "Summer";
  if (month >= 8 && month <= 10) return "Fall";
  return "Winter";
}
