import { SlidersHorizontal } from "lucide-react";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";
import { PreferencesForm } from "@/components/settings/PreferencesForm";

export const metadata = {
  title: "Style preferences — WearWise",
};

export default async function SettingsPage() {
  const session = await requireSession();
  const prefs = await prisma.stylePreferences.findUnique({
    where: { userId: session.user.id },
  });

  return (
    <div className="max-w-[768px] mx-auto px-4 py-10">
      <header className="mb-8">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-rose" strokeWidth={1.75} />
          <h1 className="text-[26px] font-semibold text-ink tracking-tight">
            Style preferences
          </h1>
        </div>
        <p
          className="mt-1.5 text-[12px] tracking-[0.04em] text-ash"
          style={{ fontFamily: "var(--font-label)" }}
        >
          YOUR STYLIST PROFILE
        </p>
      </header>

      <div className="bg-paper border border-linen rounded-[10px] p-6">
        <p className="text-[14px] text-ash leading-relaxed mb-6">
          Tell WearWise what you like — these preferences help the AI pick
          outfits that match your taste, fit, and formality level.
        </p>
        <PreferencesForm
          initial={
            prefs
              ? {
                  colors: prefs.colors,
                  brands: prefs.brands,
                  fit: prefs.fit ?? "",
                  formality: prefs.formality ?? "",
                  style: prefs.style ?? "",
                }
              : null
          }
        />
      </div>
    </div>
  );
}
