"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  X,
  Sparkles,
  Check,
  Loader2,
  RefreshCw,
  Shirt,
  Camera,
  Scissors,
} from "lucide-react";
import { analyzeAndMatch, type AnalyzedClothing } from "@/actions/analyze";
import { createItemsAndOutfit } from "@/actions/create-items-and-outfit";
import { compressImageToBase64 } from "@/lib/compress-image";
import { CropModal } from "./CropModal";

type Step = "upload" | "analyzing" | "review";

interface UploadedImage {
  file: File;
  preview: string;
}

type DetectedItem =
  | {
      type: "existing";
      image: UploadedImage;
      wardrobeItemId: string;
      name: string;
      category: string;
    }
  | {
      type: "new";
      image: UploadedImage;
      data: AnalyzedClothing;
      keep: boolean;
      cropBase64?: string;
    };

export function OutfitPhotoUploader() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("upload");
  const [image, setImage] = useState<UploadedImage | null>(null);
  const [items, setItems] = useState<DetectedItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [analyzingDetail, setAnalyzingDetail] = useState("");
  const [outfitName, setOutfitName] = useState("");
  const [cropIndex, setCropIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setImage({ file, preview: URL.createObjectURL(file) });
  }, []);

  const removeImage = useCallback(() => {
    setImage(null);
  }, []);

  const startAnalysis = async () => {
    if (!image) return;
    setStep("analyzing");
    setAnalyzingDetail("Reading your outfit photo...");

    try {
      const base64 = await compressImageToBase64(image.file);

      setAnalyzingDetail("AI is identifying each item...");
      const result = await analyzeAndMatch(base64, image.file.type);

      setAnalyzingDetail(`Found ${result.items.length} item${result.items.length !== 1 ? "s" : ""}.`);

      const detected: DetectedItem[] = [];

      for (let i = 0; i < result.items.length; i++) {
        const analyzed = result.items[i];
        const dup = result.duplicates[i];

        if (dup?.isDuplicate && dup.matchedItemId) {
          detected.push({
            type: "existing",
            image,
            wardrobeItemId: dup.matchedItemId,
            name: dup.matchedItemName ?? analyzed.name,
            category: analyzed.category,
          });
        } else {
          detected.push({
            type: "new",
            image,
            data: analyzed,
            keep: true,
          });
        }
      }

      setItems(detected);
      const firstCategory = result.items[0]?.category ?? "outfit";
      setOutfitName(`${firstCategory.charAt(0).toUpperCase() + firstCategory.slice(1)} outfit`);
      setStep("review");
    } catch {
      setStep("upload");
      setImage(null);
    }
  };

  const toggleNew = (index: number) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index || item.type !== "new") return item;
        return { ...item, keep: !item.keep };
      })
    );
  };

  const updateItemName = (index: number, name: string) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index || item.type !== "new") return item;
        return { ...item, data: { ...item.data, name } };
      })
    );
  };

  const setCrop = (index: number, base64: string) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index || item.type !== "new") return item;
        return { ...item, cropBase64: base64 };
      })
    );
    setCropIndex(null);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const save = async () => {
    if (!outfitName.trim() || items.length === 0 || !image) return;
    setIsSaving(true);

    try {
      const base64 = await compressImageToBase64(image.file);
      const existingIds: string[] = [];
      const newItems = items.filter((i): i is Extract<DetectedItem, { type: "new" }> => i.type === "new" && i.keep);

      for (const item of items) {
        if (item.type === "existing") {
          existingIds.push(item.wardrobeItemId);
        }
      }

      const outfitId = await createItemsAndOutfit(
        outfitName.trim(),
        "",
        existingIds,
        newItems.map((item) => ({
          name: item.data.name,
          category: item.data.category,
          subcategory: item.data.subcategory,
          colors: item.data.colors,
          seasons: item.data.seasons,
          occasions: item.data.occasions,
          notes: [
            item.data.material ? `Material: ${item.data.material}` : "",
            item.data.fit ? `Fit: ${item.data.fit}` : "",
            item.data.details ? `Details: ${item.data.details}` : "",
          ]
            .filter(Boolean)
            .join(" · "),
          imageBase64: item.cropBase64 ?? base64,
          mimeType: item.cropBase64 ? "image/jpeg" : image.file.type,
        }))
      );

      router.push(`/outfits/${outfitId}`);
    } catch {
      setIsSaving(false);
    }
  };

  const existingCount = items.filter((i) => i.type === "existing").length;
  const newCount = items.filter((i) => i.type === "new" && i.keep).length;

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
            if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
          }}
          onClick={() => inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-16 cursor-pointer transition-all ${
            isDragging
              ? "border-rose bg-rose/5"
              : "border-linen hover:border-dust hover:bg-canvas/50"
          }`}
        >
          <div className="w-14 h-14 rounded-full bg-canvas border border-linen flex items-center justify-center">
            <Camera className="w-6 h-6 text-ash" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <p className="text-[15px] font-medium text-ink">
              Drop your outfit photo
            </p>
            <p className="text-[13px] text-ash mt-1">
              Mirror selfie, flat lay, or any photo of a full outfit
            </p>
          </div>
          <p className="text-[11px] text-dust mt-1">JPG, PNG, WebP</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFile(e.target.files[0]);
            }}
          />
        </div>

        {image && (
          <div className="space-y-4">
            <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-linen mx-auto">
              <img
                src={image.preview}
                alt="Outfit preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage();
                }}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-ink/60 text-paper flex items-center justify-center hover:bg-ink/80 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={startAnalysis}
              className="w-full h-11 rounded-xl bg-rose text-paper text-[14px] font-medium hover:bg-crimson transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Detect items & create outfit
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
        <p className="text-[15px] font-medium text-ink">Analyzing your outfit</p>
        <p className="text-[13px] text-ash">{analyzingDetail}</p>
      </div>
    );
  }

  // Step 3: Review
  return (
    <div className="space-y-6">
      {/* Outfit name */}
      <div className="space-y-1.5">
        <label
          className="text-[11px] tracking-[0.14em] uppercase text-ash block"
          style={{ fontFamily: "var(--font-label)" }}
        >
          Outfit Name *
        </label>
        <input
          value={outfitName}
          onChange={(e) => setOutfitName(e.target.value)}
          placeholder="Name this outfit..."
          className="w-full h-9 px-3 rounded-lg border border-linen bg-paper text-ink text-sm placeholder:text-dust focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose/30 transition-all"
        />
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between">
        <p
          className="text-[12px] tracking-[0.04em] text-ash"
          style={{ fontFamily: "var(--font-label)" }}
        >
          {existingCount > 0 && `${existingCount} from your wardrobe`}
          {existingCount > 0 && newCount > 0 && " · "}
          {newCount > 0 && `${newCount} new item${newCount > 1 ? "s" : ""}`}
        </p>
        <button
          onClick={() => {
            setStep("upload");
            setItems([]);
            setImage(null);
          }}
          className="text-[13px] text-ash hover:text-ink transition-colors flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" />
          Start over
        </button>
      </div>

      {/* Items list */}
      <div className="space-y-3">
        <p
          className="text-[10px] tracking-[0.14em] uppercase text-ash"
          style={{ fontFamily: "var(--font-label)" }}
        >
          DETECTED ITEMS
        </p>

        {items.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
              item.type === "existing"
                ? "border-dust bg-canvas"
                : item.keep
                  ? "border-linen bg-paper"
                  : "border-linen bg-canvas opacity-50"
            }`}
          >
            <div className="w-14 h-14 rounded-lg overflow-hidden border border-linen shrink-0">
              {item.type === "existing" ? (
                <div className="w-full h-full bg-linen flex items-center justify-center">
                  <Shirt className="w-5 h-5 text-ash" strokeWidth={1.5} />
                </div>
              ) : item.cropBase64 ? (
                <img
                  src={`data:image/jpeg;base64,${item.cropBase64}`}
                  alt={item.data.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={item.image.preview}
                  alt={item.data.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="flex-1 min-w-0">
              {item.type === "existing" ? (
                <>
                  <p className="text-[13px] font-medium text-ink truncate">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-ash flex items-center gap-1 mt-0.5">
                    <Check className="w-3 h-3 text-rose" />
                    Already in wardrobe
                  </p>
                </>
              ) : (
                <>
                  <input
                    value={item.data.name}
                    onChange={(e) => updateItemName(index, e.target.value)}
                    className="text-[13px] font-medium text-ink bg-transparent outline-none w-full"
                  />
                  {item.cropBase64 && (
                    <p className="text-[11px] text-ash flex items-center gap-1 mt-0.5">
                      <Check className="w-3 h-3 text-rose" />
                      Cropped
                    </p>
                  )}
                </>
              )}
            </div>

            {item.type === "new" ? (
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setCropIndex(index)}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                    item.cropBase64
                      ? "bg-rose/10 text-rose"
                      : "bg-canvas text-ash hover:text-ink"
                  }`}
                  title={
                    item.cropBase64
                      ? "Re-crop photo"
                      : "Crop this item's photo"
                  }
                >
                  <Scissors className="w-3.5 h-3.5" strokeWidth={1.75} />
                </button>
                <button
                  onClick={() => toggleNew(index)}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                    item.keep
                      ? "bg-rose/10 text-rose"
                      : "bg-canvas text-ash hover:text-ink"
                  }`}
                  title={item.keep ? "Remove from outfit" : "Keep in outfit"}
                >
                  {item.keep ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <X className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  onClick={() => removeItem(index)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-ash hover:text-crimson hover:bg-crimson/5 transition-all"
                  title="Remove"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <Check className="w-4 h-4 text-rose shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Save */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={save}
          disabled={isSaving || !outfitName.trim() || items.length === 0}
          className="h-9 px-5 rounded-lg bg-rose text-paper text-sm font-medium hover:bg-rose/80 disabled:opacity-50 transition-all flex items-center gap-1.5"
        >
          {isSaving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" strokeWidth={2} />
          )}
          {isSaving ? "Saving..." : "Create outfit"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="h-9 px-5 rounded-lg border border-linen text-ink text-sm font-medium hover:bg-canvas transition-all"
        >
          Cancel
        </button>
      </div>

      {cropIndex !== null && items[cropIndex]?.type === "new" && (
        <CropModal
          imageUrl={items[cropIndex].image.preview}
          itemName={items[cropIndex].data.name}
          onCancel={() => setCropIndex(null)}
          onCrop={(base64) => setCrop(cropIndex, base64)}
        />
      )}
    </div>
  );
}
