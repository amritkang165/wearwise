"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Shirt,
  Search,
  Sparkles,
  Loader2,
  Lightbulb,
  Plus,
  X,
} from "lucide-react";
import { createOutfit, updateOutfit } from "@/actions/outfit";
import { analyzeOutfit, type OutfitSuggestion } from "@/actions/outfit-suggest";

interface WardrobeItem {
  id: string;
  name: string;
  category: string;
  subcategory: string | null;
  brand: string | null;
  colors: string[];
  seasons: string[];
  occasions: string[];
  images: string[];
}

interface EditData {
  name: string;
  occasion: string;
  notes: string;
  selectedIds: string[];
}

const SUGGESTED_OCCASIONS = [
  "Casual",
  "Formal",
  "Work",
  "Athletic",
  "Date Night",
  "Everyday",
];

export function OutfitBuilder({
  items,
  editData,
  outfitId,
}: {
  items: WardrobeItem[];
  editData?: EditData;
  outfitId?: string;
}) {
  const router = useRouter();
  const isEditing = !!editData && !!outfitId;

  const [name, setName] = useState(editData?.name ?? "");
  const [occasion, setOccasion] = useState(editData?.occasion ?? "");
  const [notes, setNotes] = useState(editData?.notes ?? "");
  const [selected, setSelected] = useState<string[]>(editData?.selectedIds ?? []);
  const [search, setSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [customOccasion, setCustomOccasion] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const [aiSuggestion, setAiSuggestion] = useState<OutfitSuggestion | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiError, setAiError] = useState("");

  const toggleItem = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
    setAiSuggestion(null);
  };

  const filtered = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce(
    (acc, item) => {
      const cat = item.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    },
    {} as Record<string, WardrobeItem[]>
  );

  const handleSave = async () => {
    if (!name.trim() || selected.length === 0) return;
    setIsSaving(true);
    const finalOccasion = showCustomInput ? customOccasion.trim() || occasion : occasion;
    if (isEditing) {
      await updateOutfit(outfitId, {
        name: name.trim(),
        occasion: finalOccasion || undefined,
        notes: notes.trim() || undefined,
        clothingItemIds: selected,
      });
    } else {
      await createOutfit({
        name: name.trim(),
        occasion: finalOccasion || undefined,
        notes: notes.trim() || undefined,
        clothingItemIds: selected,
      });
    }
  };

  const handleAnalyze = useCallback(async () => {
    if (selected.length === 0) return;
    setIsAnalyzing(true);
    setAiError("");
    try {
      const selectedItems = items
        .filter((item) => selected.includes(item.id))
        .map((item) => ({
          name: item.name,
          category: item.category,
          colors: item.colors,
          subcategory: item.subcategory || "",
          brand: item.brand || "",
          seasons: item.seasons,
          occasions: item.occasions,
        }));
      const result = await analyzeOutfit(selectedItems, occasion);
      setAiSuggestion(result);
    } catch {
      setAiError("Couldn't analyze outfit. Try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [selected, items, occasion]);

  const applyOccasionSuggestion = (occ: string) => {
    setOccasion(occ);
    setShowCustomInput(false);
    setCustomOccasion("");
  };

  return (
    <div className="space-y-6">
      {/* Outfit name */}
      <div className="space-y-1.5">
        <label
          className="text-[11px] tracking-[0.14em] uppercase text-ash block"
          style={{ fontFamily: "var(--font-label)" }}
        >
          Outfit Name *
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Casual Friday, Date Night..."
          className="w-full h-9 px-3 rounded-lg border border-linen bg-paper text-ink text-sm placeholder:text-dust focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose/30 transition-all"
        />
      </div>

      {/* Occasion */}
      <div className="space-y-2">
        <label
          className="text-[11px] tracking-[0.14em] uppercase text-ash block"
          style={{ fontFamily: "var(--font-label)" }}
        >
          Occasion
        </label>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_OCCASIONS.map((occ) => (
            <button
              key={occ}
              type="button"
              onClick={() => {
                setOccasion(occasion === occ ? "" : occ);
                setShowCustomInput(false);
                setCustomOccasion("");
              }}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                occasion === occ && !showCustomInput
                  ? "bg-rose text-paper border-rose"
                  : "bg-paper text-ink border-linen hover:border-dust"
              }`}
            >
              {occasion === occ && !showCustomInput && (
                <Check className="w-3 h-3" />
              )}
              {occ}
            </button>
          ))}
          {!showCustomInput ? (
            <button
              type="button"
              onClick={() => {
                setShowCustomInput(true);
                setOccasion("");
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border border-dashed border-dust text-ash hover:border-rose hover:text-rose transition-all"
            >
              <Plus className="w-3 h-3" />
              Custom
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <input
                value={customOccasion}
                onChange={(e) => setCustomOccasion(e.target.value)}
                placeholder="Type occasion..."
                autoFocus
                className="h-8 w-40 px-2.5 rounded-full border border-rose bg-paper text-ink text-xs placeholder:text-dust focus:outline-none focus:ring-1 focus:ring-rose/30 transition-all"
              />
              <button
                type="button"
                onClick={() => {
                  setShowCustomInput(false);
                  setCustomOccasion("");
                }}
                className="w-6 h-6 rounded-full flex items-center justify-center text-ash hover:text-crimson transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <label
          className="text-[11px] tracking-[0.14em] uppercase text-ash block"
          style={{ fontFamily: "var(--font-label)" }}
        >
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="My go-to summer look..."
          className="w-full px-3 py-2 rounded-lg border border-linen bg-paper text-ink text-sm placeholder:text-dust focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose/30 transition-all resize-none"
        />
      </div>

      {/* AI Suggestion */}
      {selected.length > 0 && (
        <div className="rounded-xl border border-linen bg-canvas overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose" strokeWidth={1.75} />
              <span
                className="text-[11px] tracking-[0.1em] uppercase text-ash"
                style={{ fontFamily: "var(--font-label)" }}
              >
                AI OUTFIT ANALYSIS
              </span>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="inline-flex items-center gap-1.5 h-7 px-3 rounded-md bg-rose/10 text-rose text-[12px] font-medium hover:bg-rose/20 disabled:opacity-50 transition-all"
            >
              {isAnalyzing ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3" strokeWidth={2} />
              )}
              {aiSuggestion ? "Re-analyze" : "Analyze outfit"}
            </button>
          </div>

          {aiError && (
            <p className="px-4 pb-3 text-[13px] text-crimson">{aiError}</p>
          )}

          {aiSuggestion && (
            <div className="px-4 pb-4 space-y-3">
              {/* Suggested occasion */}
              {aiSuggestion.suggestedOccasion && (
                <div className="flex items-center gap-2">
                  <p
                    className="text-[10px] tracking-[0.14em] uppercase text-ash shrink-0"
                    style={{ fontFamily: "var(--font-label)" }}
                  >
                    Suggested
                  </p>
                  <button
                    onClick={() =>
                      applyOccasionSuggestion(aiSuggestion.suggestedOccasion)
                    }
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose/10 text-rose text-xs font-medium hover:bg-rose/20 transition-all"
                  >
                    <Plus className="w-3 h-3" />
                    {aiSuggestion.suggestedOccasion}
                  </button>
                </div>
              )}

              {/* Formality + Seasons */}
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-linen text-[11px] font-medium text-ink">
                  {aiSuggestion.formalityLevel}
                </span>
                {aiSuggestion.suggestedSeasons.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center px-2 py-0.5 rounded-md bg-linen text-[11px] font-medium text-ash"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Missing items */}
              {aiSuggestion.missingItems.length > 0 && (
                <div>
                  <p
                    className="text-[10px] tracking-[0.14em] uppercase text-ash mb-1.5"
                    style={{ fontFamily: "var(--font-label)" }}
                  >
                    Could complete with
                  </p>
                  <div className="space-y-1.5">
                    {aiSuggestion.missingItems.map((m, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-[13px]"
                      >
                        <span className="text-rose shrink-0">+</span>
                        <div>
                          <span className="font-medium text-ink">
                            {m.suggestion}
                          </span>
                          <span className="text-ash"> — {m.reason}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips */}
              {aiSuggestion.tips.length > 0 && (
                <div>
                  <p
                    className="text-[10px] tracking-[0.14em] uppercase text-ash mb-1.5"
                    style={{ fontFamily: "var(--font-label)" }}
                  >
                    Styling tips
                  </p>
                  <div className="space-y-1">
                    {aiSuggestion.tips.map((tip, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-[13px]"
                      >
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span className="text-ink">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Item selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label
            className="text-[11px] tracking-[0.14em] uppercase text-ash"
            style={{ fontFamily: "var(--font-label)" }}
          >
            SELECT ITEMS * ({selected.length} selected)
          </label>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-linen bg-paper text-ink text-[13px]">
            <Search className="w-3.5 h-3.5 text-dust" strokeWidth={1.75} />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-[13px] text-ink placeholder:text-ash"
            />
          </div>
        )}

        {items.length === 0 ? (
          <div className="text-center py-8 text-[13px] text-ash">
            Add some items to your wardrobe first.
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="text-center py-8 text-[13px] text-ash">
            No items match your search.
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(grouped).map(([category, catItems]) => (
              <div key={category}>
                <p
                  className="text-[10px] tracking-[0.14em] uppercase text-ash mb-2"
                  style={{ fontFamily: "var(--font-label)" }}
                >
                  {category}
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {catItems.map((item) => {
                    const isSelected = selected.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleItem(item.id)}
                        className={`relative rounded-lg border overflow-hidden transition-all ${
                          isSelected
                            ? "border-rose ring-2 ring-rose/20"
                            : "border-linen hover:border-dust"
                        }`}
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
                          <p className="text-[11px] font-medium text-ink truncate">
                            {item.name}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose text-paper flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={isSaving || !name.trim() || selected.length === 0}
          className="h-9 px-5 rounded-lg bg-rose text-paper text-sm font-medium hover:bg-rose/80 disabled:opacity-50 transition-all"
        >
          {isSaving
            ? "Saving..."
            : isEditing
              ? "Update Outfit"
              : "Save Outfit"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="h-9 px-5 rounded-lg border border-linen text-ink text-sm font-medium hover:bg-canvas transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
