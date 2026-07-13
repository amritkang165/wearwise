import { Layers, Plus } from "lucide-react";

export default function OutfitsPage() {
  return (
    <div className="max-w-[768px] mx-auto px-4 py-10">
      <header className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[26px] font-semibold text-ink tracking-tight">
            Outfits
          </h1>
          <p
            className="mt-1.5 text-[12px] tracking-[0.04em] text-ash"
            style={{ fontFamily: "var(--font-label)" }}
          >
            SAVED COMBINATIONS
          </p>
        </div>
        <button className="flex items-center gap-1.5 bg-rose text-paper text-[13px] font-medium px-4 h-9 rounded-[10px] hover:bg-crimson transition-colors">
          <Plus className="w-4 h-4" strokeWidth={2} />
          New outfit
        </button>
      </header>

      <div className="flex flex-col items-center justify-center rounded-[10px] border border-dashed border-linen py-24">
        <Layers className="w-10 h-10 text-dust/40" strokeWidth={1.25} />
        <p className="mt-4 text-[15px] font-semibold text-ink/30">
          No outfits yet
        </p>
        <p className="mt-1 text-[13px] text-ash/60">
          Combine items from your wardrobe into outfits.
        </p>
        <button className="mt-5 inline-flex items-center gap-1.5 bg-rose text-paper text-[13px] font-medium px-4 h-9 rounded-[10px] hover:bg-crimson transition-colors">
          <Plus className="w-3.5 h-3.5" strokeWidth={2} />
          Create your first outfit
        </button>
      </div>
    </div>
  );
}
