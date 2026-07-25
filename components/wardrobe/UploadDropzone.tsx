"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";

interface UploadDropzoneProps {
  onChange: (files: File[]) => void;
  maxFiles?: number;
  existingImages?: string[];
}

export function UploadDropzone({
  onChange,
  maxFiles = 5,
  existingImages = [],
}: UploadDropzoneProps) {
  const [previews, setPreviews] = useState<
    { file: File; preview: string }[]
  >([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const arr = Array.from(newFiles).filter((f) =>
        f.type.startsWith("image/")
      );
      const combined = [
        ...previews.map((p) => p.file),
        ...arr,
      ].slice(0, maxFiles);

      const newPreviews = combined.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      setPreviews(newPreviews);
      onChange(combined);
    },
    [previews, maxFiles, onChange]
  );

  const removeFile = useCallback(
    (index: number) => {
      const updated = previews.filter((_, i) => i !== index);
      setPreviews(updated);
      onChange(updated.map((p) => p.file));
    },
    [previews, onChange]
  );

  const totalImages = previews.length + existingImages.length;

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 cursor-pointer transition-all ${
          isDragging
            ? "border-rose bg-rose/5"
            : "border-linen hover:border-dust hover:bg-canvas/50"
        }`}
      >
        <div className="w-12 h-12 rounded-full bg-canvas border border-linen flex items-center justify-center">
          <Upload className="w-5 h-5 text-ash" strokeWidth={1.5} />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-ink">
            Drag photos here or click to browse
          </p>
          <p className="text-xs text-ash mt-1">
            JPG, PNG, or WebP · Max 5MB each · Up to {maxFiles} images
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
          }}
        />
      </div>

      {(previews.length > 0 || existingImages.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {existingImages.map((url, i) => (
            <div
              key={`existing-${i}`}
              className="relative w-20 h-20 rounded-lg overflow-hidden border border-linen"
            >
              <img
                src={url}
                alt={`Existing ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-0.5 right-0.5 text-[9px] bg-ink/60 text-paper px-1 rounded">
                Saved
              </span>
            </div>
          ))}
          {previews.map((p, i) => (
            <div
              key={p.preview}
              className="relative w-20 h-20 rounded-lg overflow-hidden border border-linen group"
            >
              <img
                src={p.preview}
                alt={`Upload ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(i);
                }}
                className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-ink/60 text-paper flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {totalImages === 0 && (
        <div className="flex items-center gap-2 text-xs text-ash">
          <ImageIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>No photos added yet</span>
        </div>
      )}
    </div>
  );
}
