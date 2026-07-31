"use client";

import { useMemo, useRef, useState } from "react";
import { Loader2, Scissors } from "lucide-react";

interface CropModalProps {
  imageUrl: string;
  itemName: string;
  onCancel: () => void;
  onCrop: (base64: string) => void;
}

interface Point {
  x: number;
  y: number;
}

const OUTPUT_SIZE = 600;

export function CropModal({
  imageUrl,
  itemName,
  onCancel,
  onCrop,
}: CropModalProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [start, setStart] = useState<Point | null>(null);
  const [current, setCurrent] = useState<Point | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [error, setError] = useState("");

  const rect = useMemo(() => {
    if (!start || !current) return null;
    const dx = current.x - start.x;
    const dy = current.y - start.y;
    const size = Math.max(Math.abs(dx), Math.abs(dy));
    let x = dx >= 0 ? start.x : start.x - size;
    let y = dy >= 0 ? start.y : start.y - size;
    x = Math.max(0, Math.min(x, 1));
    y = Math.max(0, Math.min(y, 1));
    let s = Math.max(0.05, Math.min(size, 1));
    if (x + s > 1) s = 1 - x;
    if (y + s > 1) s = 1 - y;
    return { x, y, size: s };
  }, [start, current]);

  const getPoint = (e: React.PointerEvent): Point => {
    const img = imgRef.current;
    if (!img) return { x: 0, y: 0 };
    const b = img.getBoundingClientRect();
    return {
      x: (e.clientX - b.left) / b.width,
      y: (e.clientY - b.top) / b.height,
    };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setStart(getPoint(e));
    setCurrent(getPoint(e));
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!start) return;
    setCurrent(getPoint(e));
  };

  const handlePointerUp = () => {
    setStart(null);
  };

  const handleConfirm = async () => {
    if (!rect || !imgRef.current) return;
    const img = imgRef.current;
    setIsCropping(true);
    setError("");
    try {
      const natW = img.naturalWidth;
      const natH = img.naturalHeight;
      const px = Math.round(rect.x * natW);
      const py = Math.round(rect.y * natH);
      const psize = Math.round(Math.min(rect.size * natW, rect.size * natH));

      const canvas = document.createElement("canvas");
      canvas.width = OUTPUT_SIZE;
      canvas.height = OUTPUT_SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");
      ctx.drawImage(img, px, py, psize, psize, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

      const base64 = canvas.toDataURL("image/jpeg", 0.85).split(",")[1];
      onCrop(base64);
    } catch {
      setError("Couldn't crop the image. Try again.");
      setIsCropping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/50" onClick={onCancel} />
      <div className="relative bg-paper rounded-xl border border-linen w-full max-w-lg overflow-hidden shadow-xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-linen">
          <div className="flex items-center gap-2 min-w-0">
            <Scissors className="w-4 h-4 text-rose shrink-0" strokeWidth={1.75} />
            <p className="text-[13px] font-medium text-ink truncate">
              Crop {itemName}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-[12px] text-ash hover:text-ink transition-colors"
          >
            Cancel
          </button>
        </div>

        <div className="p-4">
          <div
            className="relative overflow-hidden rounded-lg select-none touch-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            <img
              ref={imgRef}
              src={imageUrl}
              alt={itemName}
              draggable={false}
              className="w-full h-auto block cursor-crosshair"
              onDragStart={(e) => e.preventDefault()}
            />
            {rect && (
              <div
                className="absolute border-2 border-rose bg-rose/20 pointer-events-none"
                style={{
                  left: `${rect.x * 100}%`,
                  top: `${rect.y * 100}%`,
                  width: `${rect.size * 100}%`,
                  height: `${rect.size * 100}%`,
                }}
              />
            )}
          </div>
          <p className="mt-2 text-[11px] text-ash">
            Drag to select the item's photo, then crop.
          </p>
          {error && <p className="mt-1 text-[12px] text-crimson">{error}</p>}
        </div>

        <div className="flex items-center gap-2 px-4 py-3 border-t border-linen">
          <button
            onClick={handleConfirm}
            disabled={isCropping || !rect}
            className="h-9 px-4 rounded-lg bg-rose text-paper text-[13px] font-medium hover:bg-crimson disabled:opacity-50 transition-all flex items-center gap-1.5"
          >
            {isCropping ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Scissors className="w-3.5 h-3.5" strokeWidth={2} />
            )}
            {isCropping ? "Cropping..." : "Crop item"}
          </button>
        </div>
      </div>
    </div>
  );
}
