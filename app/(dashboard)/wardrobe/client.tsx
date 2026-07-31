"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { ItemCard } from "@/components/wardrobe/ItemCard";

const CATEGORIES = ["All", "Tops", "Bottoms", "Shoes", "Outerwear", "Accessories"];

interface Item {
  id: string;
  name: string;
  category: string;
  subcategory: string | null;
  brand: string | null;
  images: string[];
  wearCount: number;
}

export function WardrobeClient({ items }: { items: Item[] }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = items.filter((item) => {
    const matchesSearch =
      search === "" ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.brand?.toLowerCase().includes(search.toLowerCase()) ||
      item.subcategory?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      activeCategory === "All" ||
      item.category.toLowerCase() === activeCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap mb-6">
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

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[10px] border border-dashed border-linen py-16">
          <p className="text-[14px] text-ash">No items match your search.</p>
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
