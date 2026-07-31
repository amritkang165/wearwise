"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { ItemCard } from "@/components/wardrobe/ItemCard";

const CATEGORIES = ["All", "Tops", "Bottoms", "Shoes", "Outerwear", "Accessories"];
const SEASONS = ["Spring", "Summer", "Fall", "Winter"];
const COLORS = [
  "Black", "White", "Gray", "Navy", "Blue", "Red",
  "Green", "Brown", "Beige", "Pink", "Orange", "Yellow",
  "Purple", "Cream", "Olive", "Burgundy",
];

interface Item {
  id: string;
  name: string;
  category: string;
  subcategory: string | null;
  brand: string | null;
  colors: string[];
  seasons: string[];
  occasions: string[];
  images: string[];
  wearCount: number;
}

export function WardrobeClient({ items }: { items: Item[] }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSeason, setActiveSeason] = useState("");
  const [activeColor, setActiveColor] = useState("");
  const [activeOccasion, setActiveOccasion] = useState("");

  const availableColors = useMemo(
    () => COLORS.filter((c) => items.some((i) => i.colors.includes(c))),
    [items]
  );
  const availableSeasons = useMemo(
    () => SEASONS.filter((s) => items.some((i) => i.seasons.includes(s))),
    [items]
  );
  const availableOccasions = useMemo(() => {
    const set = new Set<string>();
    for (const item of items) for (const o of item.occasions) set.add(o);
    return [...set].sort();
  }, [items]);

  const filtered = items.filter((item) => {
    const q = search.toLowerCase();
    const matchesSearch =
      search === "" ||
      item.name.toLowerCase().includes(q) ||
      item.brand?.toLowerCase().includes(q) ||
      item.subcategory?.toLowerCase().includes(q);

    const matchesCategory =
      activeCategory === "All" ||
      item.category.toLowerCase() === activeCategory.toLowerCase();

    const matchesSeason =
      activeSeason === "" ||
      item.seasons.length === 0 ||
      item.seasons.includes(activeSeason);

    const matchesColor =
      activeColor === "" || item.colors.includes(activeColor);

    const matchesOccasion =
      activeOccasion === "" || item.occasions.includes(activeOccasion);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesSeason &&
      matchesColor &&
      matchesOccasion
    );
  });

  const hasFilters =
    activeCategory !== "All" ||
    activeSeason !== "" ||
    activeColor !== "" ||
    activeOccasion !== "";

  const clearFilters = () => {
    setActiveCategory("All");
    setActiveSeason("");
    setActiveColor("");
    setActiveOccasion("");
  };

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <div className="flex items-center gap-2 flex-1 h-9 px-3 rounded-[10px] border border-linen bg-paper text-ink text-[13px] min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-dust" strokeWidth={1.75} />
          <input
            type="text"
            placeholder="Search your wardrobe..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-[13px] text-ink placeholder:text-ash"
          />
        </div>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`h-9 px-3 rounded-[10px] text-[12px] font-medium transition-colors ${
              activeCategory === cat
                ? "bg-rose text-paper"
                : "bg-canvas text-ash hover:text-ink border border-linen"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {(availableSeasons.length > 0 ||
        availableColors.length > 0 ||
        availableOccasions.length > 0) && (
        <div className="flex flex-wrap items-center gap-1.5 mb-6">
          {availableSeasons.length > 0 && (
            <>
              <span
                className="text-[10px] tracking-[0.1em] uppercase text-dust mr-0.5"
                style={{ fontFamily: "var(--font-label)" }}
              >
                Season
              </span>
              {availableSeasons.map((s) => (
                <FilterChip
                  key={s}
                  active={activeSeason === s}
                  onClick={() =>
                    setActiveSeason(activeSeason === s ? "" : s)
                  }
                >
                  {s}
                </FilterChip>
              ))}
            </>
          )}
          {availableColors.length > 0 && (
            <>
              <span
                className="text-[10px] tracking-[0.1em] uppercase text-dust mr-0.5"
                style={{ fontFamily: "var(--font-label)" }}
              >
                Color
              </span>
              {availableColors.map((c) => (
                <FilterChip
                  key={c}
                  active={activeColor === c}
                  onClick={() => setActiveColor(activeColor === c ? "" : c)}
                >
                  {c}
                </FilterChip>
              ))}
            </>
          )}
          {availableOccasions.length > 0 && (
            <>
              <span
                className="text-[10px] tracking-[0.1em] uppercase text-dust mr-0.5"
                style={{ fontFamily: "var(--font-label)" }}
              >
                Occasion
              </span>
              {availableOccasions.map((o) => (
                <FilterChip
                  key={o}
                  active={activeOccasion === o}
                  onClick={() =>
                    setActiveOccasion(activeOccasion === o ? "" : o)
                  }
                >
                  {o}
                </FilterChip>
              ))}
            </>
          )}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] text-ash hover:text-crimson transition-colors"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[10px] border border-dashed border-linen py-16">
          <p className="text-[14px] text-ash">No items match your filters.</p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="mt-3 text-[13px] text-rose hover:text-crimson transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filtered.map((item) => (
            <ItemCard key={item.id} {...item} />
          ))}
        </div>
      )}
    </>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
        active
          ? "bg-rose/10 text-rose border-rose/30"
          : "bg-paper text-ash border-linen hover:border-dust hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
