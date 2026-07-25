"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "./UploadDropzone";
import {
  CATEGORIES,
  COLORS,
  SEASONS,
  OCCASIONS,
} from "@/lib/validations/wardrobe";
import { Check } from "lucide-react";

interface ItemFormProps {
  mode: "create" | "edit";
  action: (formData: FormData) => Promise<void>;
  initialData?: {
    name: string;
    category: string;
    subcategory: string;
    brand: string;
    colors: string[];
    size: string;
    seasons: string[];
    occasions: string[];
    purchaseDate: string;
    purchasePrice: string;
    notes: string;
    images: string[];
  };
}

function PillSelector({
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
    </div>
  );
}

export function ItemForm({ mode, action, initialData }: ItemFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, setIsPending] = useState(false);

  const [colors, setColors] = useState<string[]>(initialData?.colors || []);
  const [seasons, setSeasons] = useState<string[]>(initialData?.seasons || []);
  const [occasions, setOccasions] = useState<string[]>(
    initialData?.occasions || []
  );

  const formatPrice = (val: string) => {
    const num = parseFloat(val);
    return isNaN(num) ? "" : num.toString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsPending(true);
    const formData = new FormData(formRef.current);
    formData.set("colors", JSON.stringify(colors));
    formData.set("seasons", JSON.stringify(seasons));
    formData.set("occasions", JSON.stringify(occasions));

    try {
      await action(formData);
    } catch {
      setIsPending(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
      {/* Photos */}
      <div className="space-y-2">
        <label
          className="text-[11px] tracking-[0.14em] uppercase text-ash block"
          style={{ fontFamily: "var(--font-label)" }}
        >
          Photos
        </label>
        <UploadDropzone
          existingImages={initialData?.images || []}
          onChange={() => {}}
          maxFiles={5}
        />
      </div>

      {/* Name + Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label
            className="text-[11px] tracking-[0.14em] uppercase text-ash block"
            style={{ fontFamily: "var(--font-label)" }}
          >
            Name *
          </label>
          <input
            name="name"
            defaultValue={initialData?.name}
            required
            placeholder="Blue denim jacket"
            className="w-full h-9 px-3 rounded-lg border border-linen bg-paper text-ink text-sm placeholder:text-dust focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose/30 transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label
            className="text-[11px] tracking-[0.14em] uppercase text-ash block"
            style={{ fontFamily: "var(--font-label)" }}
          >
            Category *
          </label>
          <select
            name="category"
            defaultValue={initialData?.category}
            required
            className="w-full h-9 px-3 rounded-lg border border-linen bg-paper text-ink text-sm focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose/30 transition-all"
          >
            <option value="">Select...</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Subcategory + Brand + Size */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label
            className="text-[11px] tracking-[0.14em] uppercase text-ash block"
            style={{ fontFamily: "var(--font-label)" }}
          >
            Type
          </label>
          <input
            name="subcategory"
            defaultValue={initialData?.subcategory}
            placeholder="T-shirt, jeans..."
            className="w-full h-9 px-3 rounded-lg border border-linen bg-paper text-ink text-sm placeholder:text-dust focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose/30 transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label
            className="text-[11px] tracking-[0.14em] uppercase text-ash block"
            style={{ fontFamily: "var(--font-label)" }}
          >
            Brand
          </label>
          <input
            name="brand"
            defaultValue={initialData?.brand}
            placeholder="Levi's, Nike..."
            className="w-full h-9 px-3 rounded-lg border border-linen bg-paper text-ink text-sm placeholder:text-dust focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose/30 transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label
            className="text-[11px] tracking-[0.14em] uppercase text-ash block"
            style={{ fontFamily: "var(--font-label)" }}
          >
            Size
          </label>
          <input
            name="size"
            defaultValue={initialData?.size}
            placeholder="M, 10, 42..."
            className="w-full h-9 px-3 rounded-lg border border-linen bg-paper text-ink text-sm placeholder:text-dust focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose/30 transition-all"
          />
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-2">
        <label
          className="text-[11px] tracking-[0.14em] uppercase text-ash block"
          style={{ fontFamily: "var(--font-label)" }}
        >
          Colors
        </label>
        <PillSelector options={COLORS} selected={colors} onChange={setColors} />
      </div>

      {/* Seasons */}
      <div className="space-y-2">
        <label
          className="text-[11px] tracking-[0.14em] uppercase text-ash block"
          style={{ fontFamily: "var(--font-label)" }}
        >
          Seasons
        </label>
        <PillSelector
          options={SEASONS}
          selected={seasons}
          onChange={setSeasons}
        />
      </div>

      {/* Occasions */}
      <div className="space-y-2">
        <label
          className="text-[11px] tracking-[0.14em] uppercase text-ash block"
          style={{ fontFamily: "var(--font-label)" }}
        >
          Occasions
        </label>
        <PillSelector
          options={OCCASIONS}
          selected={occasions}
          onChange={setOccasions}
        />
      </div>

      {/* Price + Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label
            className="text-[11px] tracking-[0.14em] uppercase text-ash block"
            style={{ fontFamily: "var(--font-label)" }}
          >
            Purchase Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ash">
              $
            </span>
            <input
              name="purchasePrice"
              type="number"
              step="0.01"
              min="0"
              max="10000"
              defaultValue={initialData?.purchasePrice}
              placeholder="0.00"
              className="w-full h-9 pl-7 pr-3 rounded-lg border border-linen bg-paper text-ink text-sm placeholder:text-dust focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose/30 transition-all"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label
            className="text-[11px] tracking-[0.14em] uppercase text-ash block"
            style={{ fontFamily: "var(--font-label)" }}
          >
            Purchase Date
          </label>
          <input
            name="purchaseDate"
            type="date"
            defaultValue={initialData?.purchaseDate}
            className="w-full h-9 px-3 rounded-lg border border-linen bg-paper text-ink text-sm focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose/30 transition-all"
          />
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
          name="notes"
          rows={3}
          defaultValue={initialData?.notes}
          placeholder="Great layering piece, runs a bit small..."
          className="w-full px-3 py-2 rounded-lg border border-linen bg-paper text-ink text-sm placeholder:text-dust focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose/30 transition-all resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="h-9 px-5 rounded-lg bg-rose text-paper text-sm font-medium hover:bg-rose/80 disabled:opacity-50 transition-all"
        >
          {isPending
            ? mode === "create"
              ? "Adding..."
              : "Saving..."
            : mode === "create"
              ? "Add to Wardrobe"
              : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="h-9 px-5 rounded-lg border border-linen text-ink text-sm font-medium hover:bg-canvas transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
