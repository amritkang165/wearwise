"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check } from "lucide-react";
import { saveStylePreferences } from "@/actions/preferences";
import { PillSelector } from "@/components/PillSelector";
import { COLORS } from "@/lib/validations/wardrobe";

const FITS = ["Relaxed", "Tailored", "Oversized", "Slim"] as const;
const FORMALITY = [
  "Casual",
  "Smart Casual",
  "Business Casual",
  "Formal",
  "Black Tie",
] as const;
const STYLES = [
  "Minimal",
  "Classic",
  "Streetwear",
  "Preppy",
  "Bold",
  "Edgy",
  "Romantic",
  "Outdoor",
] as const;

interface PreferencesFormProps {
  initial: {
    colors: string[];
    brands: string[];
    fit: string;
    formality: string;
    style: string;
  } | null;
}

export function PreferencesForm({ initial }: PreferencesFormProps) {
  const router = useRouter();
  const [colors, setColors] = useState<string[]>(initial?.colors ?? []);
  const [brands, setBrands] = useState<string[]>(initial?.brands ?? []);
  const [fit, setFit] = useState<string>(initial?.fit ?? "");
  const [formality, setFormality] = useState<string>(initial?.formality ?? "");
  const [style, setStyle] = useState<string>(initial?.style ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const hasValues =
    colors.length > 0 ||
    brands.length > 0 ||
    fit !== "" ||
    formality !== "" ||
    style !== "";

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveStylePreferences({ colors, brands, fit, formality, style });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label
          className="text-[11px] tracking-[0.14em] uppercase text-ash block"
          style={{ fontFamily: "var(--font-label)" }}
        >
          Favorite colors
        </label>
        <PillSelector options={COLORS} selected={colors} onChange={setColors} />
      </div>

      <div className="space-y-2">
        <label
          className="text-[11px] tracking-[0.14em] uppercase text-ash block"
          style={{ fontFamily: "var(--font-label)" }}
        >
          Preferred brands
        </label>
        <PillSelector options={[]} selected={brands} onChange={setBrands} />
      </div>

      <div className="space-y-2">
        <label
          className="text-[11px] tracking-[0.14em] uppercase text-ash block"
          style={{ fontFamily: "var(--font-label)" }}
        >
          Fit
        </label>
        <PillSelector
          options={FITS}
          selected={fit ? [fit] : []}
          onChange={(v) => setFit(v[0] ?? "")}
          multiple={false}
        />
      </div>

      <div className="space-y-2">
        <label
          className="text-[11px] tracking-[0.14em] uppercase text-ash block"
          style={{ fontFamily: "var(--font-label)" }}
        >
          Formality
        </label>
        <PillSelector
          options={FORMALITY}
          selected={formality ? [formality] : []}
          onChange={(v) => setFormality(v[0] ?? "")}
          multiple={false}
        />
      </div>

      <div className="space-y-2">
        <label
          className="text-[11px] tracking-[0.14em] uppercase text-ash block"
          style={{ fontFamily: "var(--font-label)" }}
        >
          Style vibe
        </label>
        <PillSelector
          options={STYLES}
          selected={style ? [style] : []}
          onChange={(v) => setStyle(v[0] ?? "")}
          multiple={false}
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={isSaving || !hasValues}
          className="h-9 px-5 rounded-lg bg-rose text-paper text-sm font-medium hover:bg-rose/80 disabled:opacity-50 transition-all flex items-center gap-1.5"
        >
          {isSaving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
          )}
          {isSaving ? "Saving..." : "Save preferences"}
        </button>
        {saved && (
          <span className="text-[13px] text-rose">Saved — your stylist knows!</span>
        )}
      </div>
    </div>
  );
}
