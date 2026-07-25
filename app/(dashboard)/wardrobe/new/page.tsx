import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SmartUploader } from "@/components/wardrobe/SmartUploader";

export const metadata = {
  title: "Add Item — WearWise",
};

export default function NewItemPage() {
  return (
    <div className="max-w-[640px] mx-auto px-4 py-10">
      <Link
        href="/wardrobe"
        className="inline-flex items-center gap-1.5 text-[13px] text-ash hover:text-ink transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
        Back to wardrobe
      </Link>

      <header className="mb-8">
        <h1 className="text-[26px] font-semibold text-ink tracking-tight">
          Add Item
        </h1>
        <p
          className="mt-1.5 text-[12px] tracking-[0.04em] text-ash"
          style={{ fontFamily: "var(--font-label)" }}
        >
          UPLOAD A PHOTO — AI DOES THE REST
        </p>
      </header>

      <SmartUploader />
    </div>
  );
}
