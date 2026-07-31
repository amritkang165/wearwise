"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export function PillSelector({
  options,
  selected,
  onChange,
  multiple = true,
}: {
  options: readonly string[];
  selected: string[];
  onChange: (val: string[]) => void;
  multiple?: boolean;
}) {
  const [customValue, setCustomValue] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const toggle = (val: string) => {
    if (multiple) {
      onChange(
        selected.includes(val)
          ? selected.filter((v) => v !== val)
          : [...selected, val]
      );
    } else {
      onChange([val]);
    }
  };

  const addCustom = () => {
    const trimmed = customValue.trim();
    if (trimmed && !selected.includes(trimmed)) {
      onChange([...selected, trimmed]);
    }
    setCustomValue("");
    setShowCustom(false);
  };

  const customItems = selected.filter((s) => !options.includes(s));

  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              active
                ? "bg-rose text-paper border-rose"
                : "bg-paper text-ink border-linen hover:border-dust"
            }`}
          >
            {active && <Check className="w-3 h-3" />}
            {opt}
          </button>
        );
      })}
      {customItems.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => toggle(item)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-all bg-rose text-paper border-rose"
        >
          <Check className="w-3 h-3" />
          {item}
          <span className="ml-0.5 text-paper/60 text-[10px]">custom</span>
        </button>
      ))}
      {!showCustom ? (
        <button
          type="button"
          onClick={() => setShowCustom(true)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border border-dashed border-dust text-ash hover:border-rose hover:text-rose transition-all"
        >
          + Custom
        </button>
      ) : (
        <div className="inline-flex items-center gap-1">
          <input
            autoFocus
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustom();
              }
              if (e.key === "Escape") {
                setShowCustom(false);
                setCustomValue("");
              }
            }}
            onBlur={() => {
              if (customValue.trim()) addCustom();
              else setShowCustom(false);
            }}
            placeholder="Type value..."
            className="w-28 h-[30px] px-2.5 rounded-full text-xs border border-rose bg-paper text-ink placeholder:text-dust focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}
