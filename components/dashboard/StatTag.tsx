import { LucideIcon } from "lucide-react";

interface StatTagProps {
  value: number | string;
  label: string;
  icon: LucideIcon;
  trend?: string;
}

export function StatTag({ value, label, icon: Icon, trend }: StatTagProps) {
  return (
    <div
      className="relative bg-paper border border-linen"
      style={{
        borderRadius: "10px",
        clipPath:
          "polygon(0 18px, 18px 0, 100% 0, 100% 100%, 0 100%)",
      }}
    >
      <span
        aria-hidden
        className="absolute top-[7px] left-[7px] w-[6px] h-[6px] rounded-full bg-canvas border border-dust"
      />

      <div
        aria-hidden
        className="absolute inset-[6px] rounded-[6px] pointer-events-none"
        style={{
          border: "1px dashed var(--color-linen)",
        }}
      />

      <div className="relative p-5 pl-6 flex items-start justify-between gap-3">
        <div>
          <p className="text-[34px] leading-none font-semibold text-ink tracking-tight tabular-nums">
            {value}
          </p>
          <p
            className="mt-2 text-[11px] tracking-[0.14em] uppercase text-ash"
            style={{ fontFamily: "var(--font-label)" }}
          >
            {label}
          </p>
          {trend && (
            <p
              className="mt-1 text-[11px] tracking-[0.08em] text-rose"
              style={{ fontFamily: "var(--font-label)" }}
            >
              {trend}
            </p>
          )}
        </div>
        <Icon className="w-4 h-4 text-dust mt-1 shrink-0" strokeWidth={1.75} />
      </div>
    </div>
  );
}
