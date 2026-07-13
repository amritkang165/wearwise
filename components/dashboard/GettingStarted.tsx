import { Check } from "lucide-react";
import { TapeProgress } from "./TapeProgress";

interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

interface GettingStartedProps {
  items: ChecklistItem[];
}

export function GettingStarted({ items }: GettingStartedProps) {
  const completed = items.filter((i) => i.done).length;

  return (
    <section className="bg-paper border border-linen rounded-[10px] p-6">
      <div className="flex items-baseline justify-between mb-5">
        <h2 className="text-[15px] font-semibold text-ink">Getting started</h2>
        <span
          className="text-[11px] tracking-[0.1em] text-ash tabular-nums"
          style={{ fontFamily: "var(--font-label)" }}
        >
          {completed}/{items.length}
        </span>
      </div>

      <TapeProgress completed={completed} total={items.length} />

      <ul className="mt-6 flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-3">
            <span
              className={`flex items-center justify-center w-[18px] h-[18px] rounded-[5px] border shrink-0 ${
                item.done
                  ? "bg-rose border-rose"
                  : "border-linen bg-paper"
              }`}
            >
              {item.done && <Check className="w-3 h-3 text-paper" strokeWidth={3} />}
            </span>
            <span
              className={`text-[13.5px] ${
                item.done ? "text-ash line-through" : "text-ink"
              }`}
            >
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
