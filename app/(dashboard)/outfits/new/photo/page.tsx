import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { OutfitPhotoUploader } from "@/components/outfits/OutfitPhotoUploader";

export const metadata = {
  title: "Upload Outfit Photo — WearWise",
};

export default async function NewOutfitFromPhotoPage() {
  await requireSession();

  return (
    <div className="max-w-[768px] mx-auto px-4 py-10">
      <Link
        href="/outfits"
        className="inline-flex items-center gap-1.5 text-[13px] text-ash hover:text-ink transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
        Back to outfits
      </Link>

      <header className="mb-8">
        <h1 className="text-[26px] font-semibold text-ink tracking-tight">
          Create from Photo
        </h1>
        <p
          className="mt-1.5 text-[12px] tracking-[0.04em] text-ash"
          style={{ fontFamily: "var(--font-label)" }}
        >
          AI DETECTS EVERY ITEM IN YOUR OUTFIT
        </p>
      </header>

      <OutfitPhotoUploader />
    </div>
  );
}
