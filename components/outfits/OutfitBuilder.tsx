"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Shirt, Search } from "lucide-react";
import { createOutfit } from "@/actions/outfit";

interface WardrobeItem {
  id: string;
  name: string;
  category: string;
  images: string[];
}

const OCCASIONS = ["Casual", "Formal", "Work", "Athletic", "Date Night", "Everyday"];

export function OutfitBuilder({ items }: { items: WardrobeItem[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [occasion, setOccasion] = useState("");
  const [notes, setNotes] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const toggleItem = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
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
    await createOutfit({
      name: name.trim(),
      occasion: occasion || undefined,
      notes: notes.trim() || undefined,
      clothingItemIds: selected,
    });
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
          {OCCASIONS.map((occ) => (
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
                              <Shirt className="w-6 h-6 text-dust/40" strokeWidth={1.25} />
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
          {isSaving ? "Saving..." : "Save Outfit"}
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
