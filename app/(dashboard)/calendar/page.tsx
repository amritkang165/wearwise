import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarPage() {
  return (
    <div className="max-w-[768px] mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="text-[26px] font-semibold text-ink tracking-tight">
          Calendar
        </h1>
        <p
          className="mt-1.5 text-[12px] tracking-[0.04em] text-ash"
          style={{ fontFamily: "var(--font-label)" }}
        >
          WHAT YOU WORE AND WHEN
        </p>
      </header>

      {/* Month nav */}
      <div className="flex items-center justify-between bg-paper border border-linen rounded-[10px] p-4 mb-6">
        <button className="flex items-center justify-center w-8 h-8 rounded-[8px] text-ash hover:text-ink hover:bg-canvas transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span
          className="text-[14px] font-semibold text-ink"
          style={{ fontFamily: "var(--font-label)" }}
        >
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <button className="flex items-center justify-center w-8 h-8 rounded-[8px] text-ash hover:text-ink hover:bg-canvas transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center rounded-[10px] border border-dashed border-linen py-24">
        <Calendar className="w-10 h-10 text-dust/40" strokeWidth={1.25} />
        <p className="mt-4 text-[15px] font-semibold text-ink/30">
          No wear history
        </p>
        <p className="mt-1 text-[13px] text-ash/60">
          Log outfits to build your style history.
        </p>
      </div>
    </div>
  );
}
