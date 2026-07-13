import { Shirt, Plus, Search } from "lucide-react";

export default function WardrobePage() {
  return (
    <div className="max-w-[768px] mx-auto px-4 py-10">
      <header className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[26px] font-semibold text-ink tracking-tight">
            Wardrobe
          </h1>
          <p
            className="mt-1.5 text-[12px] tracking-[0.04em] text-ash"
            style={{ fontFamily: "var(--font-label)" }}
          >
            YOUR CLOTHING COLLECTION
          </p>
        </div>
        <button className="flex items-center gap-1.5 bg-rose text-paper text-[13px] font-medium px-4 h-9 rounded-[10px] hover:bg-crimson transition-colors">
          <Plus className="w-4 h-4" strokeWidth={2} />
          Add item
        </button>
      </header>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex items-center gap-2 flex-1 h-9 px-3 rounded-[10px] border border-linen bg-paper text-ash text-[13px]">
          <Search className="w-3.5 h-3.5 text-dust" strokeWidth={1.75} />
          <span className="text-ash/50">Search your wardrobe...</span>
        </div>
        {["All", "Tops", "Bottoms", "Shoes", "Outerwear", "Accessories"].map((cat, i) => (
          <button
            key={cat}
            className={`h-9 px-3 rounded-[10px] text-[12px] font-medium transition-colors ${
              i === 0
                ? "bg-rose text-paper"
                : "bg-canvas text-ash hover:text-ink border border-linen"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center rounded-[10px] border border-dashed border-linen py-24">
        <Shirt className="w-10 h-10 text-dust/40" strokeWidth={1.25} />
        <p className="mt-4 text-[15px] font-semibold text-ink/30">
          Your wardrobe is empty
        </p>
        <p className="mt-1 text-[13px] text-ash/60">
          Upload photos of your clothing to get started.
        </p>
        <button className="mt-5 inline-flex items-center gap-1.5 bg-rose text-paper text-[13px] font-medium px-4 h-9 rounded-[10px] hover:bg-crimson transition-colors">
          <Plus className="w-3.5 h-3.5" strokeWidth={2} />
          Add your first item
        </button>
      </div>
    </div>
  );
}
