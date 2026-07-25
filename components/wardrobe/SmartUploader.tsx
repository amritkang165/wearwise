"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  X,
  Sparkles,
  Check,
  Loader2,
  ArrowLeft,
  Copy,
  RefreshCw,
} from "lucide-react";
import { analyzeClothingImage, type AnalyzedClothing } from "@/actions/analyze";
import { checkForDuplicate } from "@/actions/duplicate-check";
import { createClothingItem } from "@/actions/wardrobe";
import { logWearForItems } from "@/actions/wear-log";
import {
  CATEGORIES,
  COLORS,
  SEASONS,
  OCCASIONS,
} from "@/lib/validations/wardrobe";
import Link from "next/link";

type Step = "upload" | "analyzing" | "review";

interface UploadedImage {
  file: File;
  preview: string;
}

type AnalyzedItem =
  | {
      type: "new";
      image: UploadedImage;
      data: AnalyzedClothing;
    }
  | {
      type: "duplicate";
      image: UploadedImage;
      matchedId: string;
      matchedName: string;
    };

function PillSelector({
  options,
  selected,
  onChange,
}: {
  options: readonly string[];
  selected: string[];
  onChange: (val: string[]) => void;
}) {
  const toggle = (val: string) => {
    onChange(
      selected.includes(val)
        ? selected.filter((v) => v !== val)
        : [...selected, val]
    );
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

export function SmartUploader() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("upload");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [results, setResults] = useState<AnalyzedItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [analyzingIndex, setAnalyzingIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const newImages = arr.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages].slice(0, 5));
  }, []);

  const removeImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const startAnalysis = async () => {
    if (images.length === 0) return;
    setStep("analyzing");

    const allResults: AnalyzedItem[] = [];

    for (let i = 0; i < images.length; i++) {
      setAnalyzingIndex(i);
      const image = images[i];

      try {
        const arrayBuffer = await image.file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Analyze with AI
        const analyzed = await analyzeClothingImage(buffer, image.file.type);

        // Check for duplicates
        const dupCheck = await checkForDuplicate(buffer, image.file.type);

        if (dupCheck.isDuplicate && dupCheck.matchedItemId) {
          allResults.push({
            type: "duplicate",
            image,
            matchedId: dupCheck.matchedItemId,
            matchedName: dupCheck.matchedItemName ?? "Existing item",
          });
        } else {
          allResults.push({ type: "new", image, data: analyzed });
        }
      } catch {
        allResults.push({
          type: "new",
          image,
          data: {
            name: "Untitled item",
            category: "tops",
            subcategory: "",
            colors: [],
            seasons: [],
            occasions: [],
            material: "",
            pattern: "solid",
            confidence: 0,
          },
        });
      }
    }

    setResults(allResults);
    setStep("review");
  };

  const updateData = (
    index: number,
    field: keyof AnalyzedClothing,
    value: unknown
  ) => {
    setResults((prev) =>
      prev.map((item, i) => {
        if (i !== index || item.type !== "new") return item;
        return { ...item, data: { ...item.data, [field]: value } };
      })
    );
  };

  const saveAll = async () => {
    setIsSaving(true);
    try {
      const newItems = results.filter((r) => r.type === "new");
      const duplicates = results.filter((r) => r.type === "duplicate");

      // Log wears for duplicates
      if (duplicates.length > 0) {
        await logWearForItems(duplicates.map((d) => d.matchedId));
      }

      // Create new items
      for (const item of newItems) {
        if (item.type !== "new") continue;
        const formData = new FormData();
        formData.append("name", item.data.name);
        formData.append("category", item.data.category);
        formData.append("subcategory", item.data.subcategory);
        formData.append("brand", "");
        formData.append("colors", JSON.stringify(item.data.colors));
        formData.append("size", "");
        formData.append("seasons", JSON.stringify(item.data.seasons));
        formData.append("occasions", JSON.stringify(item.data.occasions));
        formData.append("purchaseDate", "");
        formData.append("purchasePrice", "");
        formData.append(
          "notes",
          item.data.material ? `Material: ${item.data.material}` : ""
        );
        formData.append("images", item.image.file);

        await createClothingItem(formData);
      }

      router.push("/wardrobe");
    } catch {
      setIsSaving(false);
    }
  };

  const newCount = results.filter((r) => r.type === "new").length;
  const dupCount = results.filter((r) => r.type === "duplicate").length;

  // Step 1: Upload
  if (step === "upload") {
    return (
      <div className="space-y-6">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            addFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-12 cursor-pointer transition-all ${
            isDragging
              ? "border-rose bg-rose/5"
              : "border-linen hover:border-dust hover:bg-canvas/50"
          }`}
        >
          <div className="w-14 h-14 rounded-full bg-canvas border border-linen flex items-center justify-center">
            <Upload className="w-6 h-6 text-ash" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <p className="text-[15px] font-medium text-ink">
              Drop photos of your clothing
            </p>
            <p className="text-[13px] text-ash mt-1">
              AI identifies each item, detects duplicates, and logs wear
            </p>
          </div>
          <p className="text-[11px] text-dust">
            JPG, PNG, or WebP · Up to 5 items at once
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
            }}
          />
        </div>

        {images.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {images.map((img, i) => (
                <div
                  key={img.preview}
                  className="relative w-24 h-24 rounded-lg overflow-hidden border border-linen group"
                >
                  <img
                    src={img.preview}
                    alt={`Upload ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(i);
                    }}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-ink/60 text-paper flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={startAnalysis}
              className="w-full h-11 rounded-xl bg-rose text-paper text-[14px] font-medium hover:bg-crimson transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Analyze {images.length} {images.length === 1 ? "item" : "items"}
            </button>
          </div>
        )}
      </div>
    );
  }

  // Step 2: Analyzing
  if (step === "analyzing") {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 text-rose animate-spin" />
        <p className="text-[15px] font-medium text-ink">
          Analyzing item {analyzingIndex + 1} of {images.length}...
        </p>
        <p className="text-[13px] text-ash">
          AI is identifying the item and checking your wardrobe
        </p>
        <div className="flex gap-1 mt-2">
          {images.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i < analyzingIndex
                  ? "bg-rose"
                  : i === analyzingIndex
                    ? "bg-rose animate-pulse"
                    : "bg-linen"
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  // Step 3: Review
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <p
            className="text-[12px] tracking-[0.04em] text-ash"
            style={{ fontFamily: "var(--font-label)" }}
          >
            {dupCount > 0 && `${dupCount} duplicate${dupCount > 1 ? "s" : ""} found · `}
            {newCount > 0 && `${newCount} new item${newCount > 1 ? "s" : ""} to add`}
          </p>
        </div>
        <button
          onClick={() => {
            setStep("upload");
            setResults([]);
            setImages([]);
          }}
          className="text-[13px] text-ash hover:text-ink transition-colors flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" />
          Start over
        </button>
      </div>

      {/* Duplicates */}
      {dupCount > 0 && (
        <div className="space-y-2">
          <p
            className="text-[10px] tracking-[0.14em] uppercase text-ash"
            style={{ fontFamily: "var(--font-label)" }}
          >
            ALREADY IN YOUR WARDROBE — WILL LOG AS WORN
          </p>
          {results.map((item, index) => {
            if (item.type !== "duplicate") return null;
            return (
              <div
                key={index}
                className="flex items-center gap-3 rounded-xl border border-dust bg-canvas p-3"
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden border border-linen shrink-0">
                  <img
                    src={item.image.preview}
                    alt={item.matchedName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-ink truncate">
                    {item.matchedName}
                  </p>
                  <p className="text-[11px] text-ash flex items-center gap-1 mt-0.5">
                    <Copy className="w-3 h-3" />
                    Duplicate detected — wear will be logged
                  </p>
                </div>
                <Check className="w-4 h-4 text-rose shrink-0" />
              </div>
            );
          })}
        </div>
      )}

      {/* New items */}
      {newCount > 0 && (
        <div className="space-y-3">
          <p
            className="text-[10px] tracking-[0.14em] uppercase text-ash"
            style={{ fontFamily: "var(--font-label)" }}
          >
            NEW ITEMS — REVIEW AI TAGS
          </p>
          {results.map((item, index) => {
            if (item.type !== "new") return null;
            return (
              <div
                key={index}
                className="rounded-xl border border-linen bg-paper p-5 space-y-4"
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-linen shrink-0">
                    <img
                      src={item.image.preview}
                      alt={item.data.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <input
                      value={item.data.name}
                      onChange={(e) =>
                        updateData(index, "name", e.target.value)
                      }
                      className="text-[16px] font-semibold text-ink bg-transparent outline-none w-full"
                    />
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] tracking-[0.1em] uppercase text-ash px-2 py-0.5 bg-canvas rounded border border-linen"
                        style={{ fontFamily: "var(--font-label)" }}
                      >
                        {item.data.category}
                      </span>
                      {item.data.confidence > 0.7 && (
                        <span
                          className="text-[10px] tracking-[0.1em] uppercase text-rose px-2 py-0.5 bg-rose/5 rounded border border-rose/20 flex items-center gap-1"
                          style={{ fontFamily: "var(--font-label)" }}
                        >
                          <Sparkles className="w-2.5 h-2.5" />
                          AI tagged
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    className="text-[10px] tracking-[0.14em] uppercase text-ash"
                    style={{ fontFamily: "var(--font-label)" }}
                  >
                    Category
                  </label>
                  <select
                    value={item.data.category}
                    onChange={(e) =>
                      updateData(index, "category", e.target.value)
                    }
                    className="w-full h-8 px-3 rounded-lg border border-linen bg-paper text-ink text-[13px] focus:outline-none focus:border-rose transition-all"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    className="text-[10px] tracking-[0.14em] uppercase text-ash"
                    style={{ fontFamily: "var(--font-label)" }}
                  >
                    Colors
                  </label>
                  <PillSelector
                    options={COLORS}
                    selected={item.data.colors}
                    onChange={(val) => updateData(index, "colors", val)}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className="text-[10px] tracking-[0.14em] uppercase text-ash"
                    style={{ fontFamily: "var(--font-label)" }}
                  >
                    Seasons
                  </label>
                  <PillSelector
                    options={SEASONS}
                    selected={item.data.seasons}
                    onChange={(val) => updateData(index, "seasons", val)}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className="text-[10px] tracking-[0.14em] uppercase text-ash"
                    style={{ fontFamily: "var(--font-label)" }}
                  >
                    Occasions
                  </label>
                  <PillSelector
                    options={OCCASIONS}
                    selected={item.data.occasions}
                    onChange={(val) => updateData(index, "occasions", val)}
                  />
                </div>

                {item.data.material && (
                  <p className="text-[12px] text-ash">
                    Material: {item.data.material} · {item.data.pattern}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      <button
        onClick={saveAll}
        disabled={isSaving}
        className="w-full h-11 rounded-xl bg-rose text-paper text-[14px] font-medium hover:bg-crimson disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
      >
        {isSaving ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Check className="w-4 h-4" />
            {dupCount > 0 && newCount > 0
              ? `Log ${dupCount} wear${dupCount > 1 ? "s" : ""} & add ${newCount} new item${newCount > 1 ? "s" : ""}`
              : dupCount > 0
                ? `Log ${dupCount} wear${dupCount > 1 ? "s" : ""}`
                : `Add ${newCount} new item${newCount > 1 ? "s" : ""}`}
          </>
        )}
      </button>
    </div>
  );
}
